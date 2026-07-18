import os
import shutil
import uuid
from typing import List
import tempfile
import zipfile

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.ai.face_engine import face_engine
from app.models.event import Event
from app.models.photo import Photo
from app.repositories.photo_repository import PhotoRepository
from app.services.face_embedding_service import FaceEmbeddingService
from app.repositories.face_embedding_repository import FaceEmbeddingRepository

UPLOAD_PROGRESS = {}
UPLOAD_DIRECTORY = "uploads/events"


class PhotoService:

    @staticmethod
    def upload_photo(
        db: Session,
        event_id: int,
        file: UploadFile,
    ):
        # Check if event exists
        event = db.query(Event).filter(
            Event.id == event_id
        ).first()

        if event is None:
            raise HTTPException(
                status_code=404,
                detail="Event not found.",
            )

        # Validate image type
        allowed_extensions = {
            ".jpg",
            ".jpeg",
            ".png",
        }

        extension = os.path.splitext(
            file.filename
        )[1].lower()

        if extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG and PNG images are allowed.",
            )

        # Validate file size
        MAX_FILE_SIZE = 10 * 1024 * 1024

        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="Image size must not exceed 10 MB.",
            )

        # Generate filename
        filename = f"{uuid.uuid4()}{extension}"

        event_folder = os.path.join(
            UPLOAD_DIRECTORY,
            str(event_id),
        )

        os.makedirs(
            event_folder,
            exist_ok=True,
        )

        file_path = os.path.join(
            event_folder,
            filename,
        )

        # Save image temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer,
            )

        # ----------------------------
        # AI VALIDATION FIRST
        # ----------------------------
        try:

            faces = face_engine.detect_faces(
                file_path
            )

            if len(faces) == 0:

                if os.path.exists(file_path):
                    os.remove(file_path)

                raise HTTPException(
                    status_code=400,
                    detail="No face detected in the uploaded image.",
                )

        except HTTPException:
            raise

        except Exception:

            if os.path.exists(file_path):
                os.remove(file_path)

            raise HTTPException(
                status_code=500,
                detail="AI processing failed.",
            )

        # ----------------------------
        # Save photo after validation
        # ----------------------------
        photo = Photo(
            event_id=event_id,
            image_path=file_path.replace("\\", "/"),
        )

        saved_photo = PhotoRepository.create(
            db,
            photo,
            commit=False,
        )

        PhotoRepository.commit(db)

        PhotoRepository.refresh(
            db,
            saved_photo,
        )

        # Save embeddings
        for face in faces:

            FaceEmbeddingService.save_embedding(
                db=db,
                photo_id=saved_photo.id,
                embedding=face.embedding,
                bbox=face.bbox.astype(int),
                commit=False,
            )

        FaceEmbeddingRepository.commit(db)

        return saved_photo
    

    @staticmethod
    def get_event_photos(
        db: Session,
        event_id: int,
    ):
        event = db.query(Event).filter(
            Event.id == event_id
        ).first()

        if event is None:
            raise HTTPException(
                status_code=404,
                detail="Event not found.",
            )

        return PhotoRepository.get_by_event(
            db,
            event_id,
        )


    @staticmethod
    def upload_bulk(
        
        db: Session,
        event_id: int,
        files: List[UploadFile],
    ):
        uploaded = []
        skipped = []

        UPLOAD_PROGRESS[event_id] = {
            "status": "processing",
            "processed": 0,
            "total": 0,
        }
        total = 0

        for file in files:

            ext = os.path.splitext(file.filename)[1].lower()

            if ext == ".zip":

                with tempfile.TemporaryDirectory() as temp_dir:

                    zip_path = os.path.join(temp_dir, file.filename)

                    with open(zip_path, "wb") as buffer:
                        shutil.copyfileobj(file.file, buffer)

                    with zipfile.ZipFile(zip_path) as zip_ref:
                        zip_ref.extractall(temp_dir)

                    for root, _, filenames in os.walk(temp_dir):

                        for filename in filenames:

                            if filename.lower().endswith(
                                (".jpg", ".jpeg", ".png")
                            ):
                                total += 1

            else:

                total += 1

        UPLOAD_PROGRESS[event_id] = {

            "status": "processing",

            "processed": 0,

            "total": total

        }

        for file in files:

            extension = os.path.splitext(file.filename)[1].lower()

            # ZIP Upload
            if extension == ".zip":

                file.file.seek(0)

                with tempfile.TemporaryDirectory() as temp_dir:

                    zip_path = os.path.join(
                        temp_dir,
                        file.filename,
                    )

                    with open(zip_path, "wb") as buffer:
                        shutil.copyfileobj(file.file, buffer)

                    with zipfile.ZipFile(zip_path, "r") as zip_ref:
                        zip_ref.extractall(temp_dir)

                    for root, _, filenames in os.walk(temp_dir):

                        for filename in filenames:

                            ext = os.path.splitext(filename)[1].lower()

                            if ext not in [".jpg", ".jpeg", ".png"]:
                                continue

                            image_path = os.path.join(root, filename)

                            try:

                                with open(image_path, "rb") as image_file:

                                    upload = UploadFile(
                                        filename=filename,
                                        file=image_file,
                                    )

                                    photo = PhotoService.upload_photo(
                                        db=db,
                                        event_id=event_id,
                                        file=upload,
                                    )

                                    uploaded.append(photo)
                                    UPLOAD_PROGRESS[event_id]["processed"] += 1

                            except Exception as e:

                                print(f"ZIP Upload Error: {e}")

                                skipped.append(filename)

            # Multiple Images
            else:

                try:

                    photo = PhotoService.upload_photo(
                        db=db,
                        event_id=event_id,
                        file=file,
                    )

                    uploaded.append(photo)
                    UPLOAD_PROGRESS[event_id]["processed"] += 1

                except Exception:

                    skipped.append(file.filename)

        UPLOAD_PROGRESS[event_id]["status"] = "completed"    

        return {

            "uploaded": len(uploaded),

            "skipped": skipped,

        }

    @staticmethod
    def delete_photo(
        db: Session,
        photo_id: int,
    ):
        photo = PhotoRepository.get_by_id(
            db,
            photo_id,
        )

        if photo is None:
            raise HTTPException(
                status_code=404,
                detail="Photo not found.",
            )

        if os.path.exists(photo.image_path):
            os.remove(photo.image_path)

        PhotoRepository.delete(
            db,
            photo,
        )

        return {
            "message": "Photo deleted successfully."
        }