from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Photo(Base):
    __tablename__ = "photos"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    event_id = Column(
        Integer,
        ForeignKey("events.id"),
        nullable=False,
    )

    image_path = Column(
        String,
        nullable=False,
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    event = relationship(
        "Event",
        back_populates="photos",
    )

    embeddings = relationship(
        "FaceEmbedding",
        back_populates="photo",
        cascade="all, delete-orphan",
    )