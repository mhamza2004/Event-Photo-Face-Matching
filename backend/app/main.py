from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine

# Import all models so SQLAlchemy registers them
from app.models.user import User
from app.models.event import Event
from app.models.photo import Photo
from app.models.face_embedding import FaceEmbedding

from app.api.auth import router as auth_router
from app.api.event import router as event_router
from app.api.photo import router as photo_router
from app.api.match import router as match_router
import os

os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="Event Photo Face-Matching API",
    version="1.0.0"
)
Base.metadata.create_all(bind=engine)

# Register Routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://event-photo-face-matching.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(event_router)
app.include_router(photo_router)
app.include_router(match_router)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)


@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "Backend is running 🚀"
    }