from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    event_date: datetime


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[datetime] = None


class EventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    location: Optional[str]
    event_date: datetime
    organizer_id: int

    class Config:
        from_attributes = True