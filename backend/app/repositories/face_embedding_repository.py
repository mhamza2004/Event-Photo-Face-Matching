from sqlalchemy.orm import Session

from app.models.face_embedding import FaceEmbedding


class FaceEmbeddingRepository:

    @staticmethod
    def create(
        db: Session,
        face_embedding: FaceEmbedding,
    ):
        db.add(face_embedding)
        db.commit()
        db.refresh(face_embedding)
        return face_embedding

    @staticmethod
    def get_all(
        db: Session,
    ):
        return db.query(
            FaceEmbedding
        ).all()