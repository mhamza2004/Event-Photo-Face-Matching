import os
import shutil
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.ai.face_engine import face_engine
from app.models.event import Event
from app.models.photo import Photo
from app.repositories.photo_repository import PhotoRepository
from app.services.face_embedding_service import FaceEmbeddingService

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
        )

        # Save embeddings
        for face in faces:

            FaceEmbeddingService.save_embedding(
                db=db,
                photo_id=saved_photo.id,
                embedding=face.embedding,
                bbox=face.bbox.astype(int),
            )

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