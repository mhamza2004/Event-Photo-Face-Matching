from sqlalchemy.orm import Session

from app.models.face_embedding import FaceEmbedding


class FaceEmbeddingRepository:

    @staticmethod
    def create(
        db: Session,
        face_embedding: FaceEmbedding,
        commit: bool = True,
    ):
        db.add(face_embedding)

        if commit:
            db.commit()
            db.refresh(face_embedding)

        return face_embedding

    @staticmethod
    def commit(
        db: Session,
    ):
        db.commit()

    @staticmethod
    def get_all(
        db: Session,
    ):
        return db.query(
            FaceEmbedding
        ).all()