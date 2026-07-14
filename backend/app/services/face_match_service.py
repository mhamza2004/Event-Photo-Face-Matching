import os
import shutil
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.ai.face_engine import face_engine
from app.ai.similarity import SimilarityEngine
from app.repositories.photo_repository import PhotoRepository
from app.services.face_embedding_service import FaceEmbeddingService

SELFIE_DIRECTORY = "uploads/selfies"


class FaceMatchService:

    @staticmethod
    def match_face(
        db: Session,
        event_id: int,
        file: UploadFile,
    ):

        extension = os.path.splitext(file.filename)[1].lower()

        if extension not in {".jpg", ".jpeg", ".png"}:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG and PNG images are allowed.",
            )

        os.makedirs(SELFIE_DIRECTORY, exist_ok=True)

        filename = f"{uuid.uuid4()}{extension}"

        file_path = os.path.join(
            SELFIE_DIRECTORY,
            filename,
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:

            selfie_embedding = face_engine.get_embedding(file_path)

        except Exception as e:

            if os.path.exists(file_path):
                os.remove(file_path)

            raise HTTPException(
                status_code=400,
                detail=str(e),
            )

        all_embeddings = FaceEmbeddingService.get_by_event(
            db=db,
            event_id=event_id,
        )

        matches = []

        for item in all_embeddings:

            similarity = SimilarityEngine.cosine_similarity(
                selfie_embedding,
                item.embedding,
            )

            if similarity >= 0.60:

                photo = PhotoRepository.get_by_id(
                    db,
                    item.photo_id,
                )

                if photo is None:
                    continue

                matches.append(
                    {
                        "photo_id": photo.id,
                        "event_id": photo.event_id,
                        "image_path": photo.image_path,
                        "similarity": round(
                            float(similarity),
                            4,
                        ),
                    }
                )

        matches.sort(
            key=lambda x: x["similarity"],
            reverse=True,
        )

        if os.path.exists(file_path):
            os.remove(file_path)

        return {
            "matches": matches
        }