from sqlalchemy.orm import Session

from app.models.event import Event


class EventRepository:

    @staticmethod
    def create(db: Session, event: Event):
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def get_all(db: Session):
        return db.query(Event).all()

    @staticmethod
    def get_by_id(db: Session, event_id: int):
        return db.query(Event).filter(Event.id == event_id).first()

    @staticmethod
    def update(db: Session, event: Event):
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def update_event(
        db: Session,
        event: Event,
    ):
        db.commit()
        db.refresh(event)
        return event
    
    @staticmethod
    def delete(db: Session, event: Event):
        db.delete(event)
        db.commit()