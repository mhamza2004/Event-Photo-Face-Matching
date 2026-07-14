from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    photo_id = Column(
        Integer,
        ForeignKey("photos.id"),
        nullable=False,
    )

    embedding = Column(
        ARRAY(Float),
        nullable=False,
    )

    bbox_x1 = Column(Integer)
    bbox_y1 = Column(Integer)
    bbox_x2 = Column(Integer)
    bbox_y2 = Column(Integer)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    photo = relationship(
        "Photo",
        back_populates="embeddings",
    )