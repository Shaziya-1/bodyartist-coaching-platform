from pydantic import BaseModel, Field, UUID4
from datetime import date

class StepLogRequest(BaseModel):
    athlete_id: UUID4
    log_date: date
    steps_logged: int = Field(..., ge=0, description="Steps logged must be 0 or greater")

class StepLogResponse(BaseModel):
    athlete_id: UUID4
    log_date: date
    steps_logged: int

    class Config:
        from_attributes = True
