from sqlalchemy.orm import Session

from app.models.face_embedding import FaceEmbedding
from app.repositories.face_embedding_repository import FaceEmbeddingRepository
from app.models.photo import Photo


class FaceEmbeddingService:

    @staticmethod
    def save_embedding(
        db: Session,
        photo_id: int,
        embedding,
        bbox,
        commit: bool = True,
    ):
        face_embedding = FaceEmbedding(
            photo_id=photo_id,
            embedding=embedding.tolist(),
            bbox_x1=int(bbox[0]),
            bbox_y1=int(bbox[1]),
            bbox_x2=int(bbox[2]),
            bbox_y2=int(bbox[3]),
        )

        return FaceEmbeddingRepository.create(
            db,
            face_embedding,
            commit=commit,
        )

    @staticmethod
    def get_all_embeddings(
        db: Session,
    ):
        return FaceEmbeddingRepository.get_all(
            db,
        )

    @staticmethod
    def get_by_event(
        db: Session,
        event_id: int,
    ):
        return (
            db.query(FaceEmbedding)
            .join(Photo)
            .filter(Photo.event_id == event_id)
            .all()
        )