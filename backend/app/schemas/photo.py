from datetime import datetime

from pydantic import BaseModel


class PhotoResponse(BaseModel):
    id: int
    event_id: int
    image_path: str
    uploaded_at: datetime

    class Config:
        from_attributes = True