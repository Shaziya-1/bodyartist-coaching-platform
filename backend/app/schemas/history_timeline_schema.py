from pydantic import BaseModel, UUID4, Field
from datetime import date as DateType
from typing import List, Optional

class TimelinePoint(BaseModel):
    # alias handles mapping log_date from database to date in response
    date: DateType = Field(validation_alias="log_date")
    water_logged: int
    steps_logged: int
    weight: Optional[float] = None
    
    class Config:
        from_attributes = True
        populate_by_name = True

class HistoryTimelineResponse(BaseModel):
    athlete_id: UUID4
    start_date: DateType
    end_date: DateType
    timeline: List[TimelinePoint]