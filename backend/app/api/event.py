from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
)
from app.services.event_service import EventService

router = APIRouter(
    prefix="/events",
    tags=["Events"],
)


@router.post("", response_model=EventResponse)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return EventService.create_event(
        db=db,
        event=event,
        current_user=current_user,
    )


@router.get("", response_model=list[EventResponse])
def get_all_events(
    db: Session = Depends(get_db),
):
    return EventService.get_all_events(db)


@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
):
    return EventService.get_event_by_id(
        db,
        event_id,
    )

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return EventService.update_event(
        db=db,
        event_id=event_id,
        event_data=event,
        current_user=current_user,
    )

@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return EventService.delete_event(
        db=db,
        event_id=event_id,
        current_user=current_user,
    )