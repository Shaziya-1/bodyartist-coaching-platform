from pydantic import BaseModel, UUID4
from datetime import date
from typing import List, Dict, Any

class SupplementLogRequest(BaseModel):
    athlete_id: UUID4
    log_date: date
    checked_supplements: List[str]

class SupplementLogResponse(BaseModel):
    athlete_id: UUID4
    log_date: date
    completion_percentage: int
    supplement_checkoffs: List[Dict[str, Any]]
