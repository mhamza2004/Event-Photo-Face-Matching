from fastapi import APIRouter, Depends, File, UploadFile, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.face_match_service import FaceMatchService

router = APIRouter(
    prefix="/match",
    tags=["Face Matching"],
)


@router.post("/")
def match_face(
    event_id: int = Query(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return FaceMatchService.match_face(
        db=db,
        event_id=event_id,
        file=file,
    )