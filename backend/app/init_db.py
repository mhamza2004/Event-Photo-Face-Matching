from app.db.database import Base, engine

# Import ALL models
from app.models.user import User
from app.models.event import Event
from app.models.photo import Photo
from app.models.face_embedding import FaceEmbedding


def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ All database tables created successfully!")


if __name__ == "__main__":
    create_tables()