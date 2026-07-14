from sqlalchemy.orm import Session

from app.models.photo import Photo


class PhotoRepository:

    @staticmethod
    def create(
        db: Session,
        photo: Photo,
    ):
        db.add(photo)
        db.commit()
        db.refresh(photo)
        return photo

    @staticmethod
    def get_by_event(
        db: Session,
        event_id: int,
    ):
        return (
            db.query(Photo)
            .filter(Photo.event_id == event_id)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        photo_id: int,
    ):
        return (
            db.query(Photo)
            .filter(Photo.id == photo_id)
            .first()
        )

    @staticmethod
    def delete(
        db: Session,
        photo: Photo,
    ):
        db.delete(photo)
        db.commit()