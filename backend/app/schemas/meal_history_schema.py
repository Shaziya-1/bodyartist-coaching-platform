from pydantic import BaseModel, UUID4
from typing import List, Dict, Any, Optional
from datetime import datetime

class MealLogItem(BaseModel):
    photo_url: Optional[str] = None
    raw_food_log: Optional[str] = None
    confidence_score: Optional[float] = None
    logged_at: datetime
    confirmed_macros: Dict[str, Any]

    class Config:
        from_attributes = True

class MealHistoryResponse(BaseModel):
    athlete_id: UUID4
    total_meals: int
    meals: List[MealLogItem]
