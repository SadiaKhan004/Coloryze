from pydantic import BaseModel

class UploadResponse(BaseModel):
    message: str
    filename: str
    status: str
    next_step: str

class AIResult(BaseModel):
    status: str
    result: dict
