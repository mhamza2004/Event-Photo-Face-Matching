from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.photo import PhotoResponse
from app.services.photo_service import PhotoService

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