from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.event import Event
from app.models.user import User
from app.repositories.event_repository import EventRepository
from app.schemas.event import EventCreate, EventUpdate


class EventService:

    @staticmethod
    def create_event(
        db: Session,
        event: EventCreate,
        current_user: User,
    ):
        new_event = Event(
            title=event.title,
            description=event.description,
            location=event.location,
            event_date=event.event_date,
            organizer_id=current_user.id,
        )

        return EventRepository.create(db, new_event)

    @staticmethod
    def get_all_events(db: Session):
        return EventRepository.get_all(db)

    @staticmethod
    def get_event_by_id(
        db: Session,
        event_id: int,
    ):
        return EventRepository.get_by_id(db, event_id)
    
    @staticmethod
    def verify_event_owner(
        event: Event,
        current_user: User,
    ):
        if event.organizer_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to modify this event.",
            )
        
    @staticmethod
    def update_event(
        db: Session,
        event_id: int,
        event_data: EventUpdate,
        current_user: User,
    ):
        event = EventRepository.get_by_id(db, event_id)

        if event is None:
            raise HTTPException(
                status_code=404,
                detail="Event not found.",
            )

        EventService.verify_event_owner(
            event,
            current_user,
        )

        update_data = event_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(event, key, value)

        return EventRepository.update_event(
            db,
            event,
        )
    
    @staticmethod
    def delete_event(
        db: Session,
        event_id: int,
        current_user: User,
    ):
        event = EventRepository.get_by_id(db, event_id)

        if event is None:
            raise HTTPException(
                status_code=404,
                detail="Event not found.",
            )

        EventService.verify_event_owner(
            event,
            current_user,
        )

        EventRepository.delete(
            db,
            event,
        )

        return {
            "message": "Event deleted successfully."
        }