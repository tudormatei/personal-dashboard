from pydantic import BaseModel


class UploadResponse(BaseModel):
    imported: int
