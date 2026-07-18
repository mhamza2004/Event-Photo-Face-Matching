from fastapi import APIRouter, Depends, File, UploadFile
from typing import List
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.photo import PhotoResponse
from app.services.photo_service import (
    PhotoService,
    UPLOAD_PROGRESS,
)

router = APIRouter(
    prefix="/photos",
    tags=["Photos"],
)


@router.post("/upload", response_model=PhotoResponse)
def upload_photo(
    event_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return PhotoService.upload_photo(
        db=db,
        event_id=event_id,
        file=file,
    )

@router.post("/upload-bulk")
def upload_bulk(
    event_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    return PhotoService.upload_bulk(
        db=db,
        event_id=event_id,
        files=files,
    )

@router.get(
    "/event/{event_id}",
    response_model=list[PhotoResponse],
)
def get_event_photos(
    event_id: int,
    db: Session = Depends(get_db),
):
    return PhotoService.get_event_photos(
        db=db,
        event_id=event_id,
    )

@router.delete("/{photo_id}")
def delete_photo(
    photo_id: int,
    db: Session = Depends(get_db),
):
    return PhotoService.delete_photo(
        db=db,
        photo_id=photo_id,
    )

@router.get("/upload-progress/{event_id}")
def upload_progress(event_id: int):

    return UPLOAD_PROGRESS.get(
        event_id,
        {
            "status": "idle",
            "processed": 0,
            "total": 0,
        },
    )