from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(String)

    location = Column(String)

    event_date = Column(DateTime)

    organizer_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    organizer = relationship(
        "User",
        back_populates="events",
    )

    photos = relationship(
        "Photo",
        back_populates="event",
        cascade="all, delete-orphan",
    )