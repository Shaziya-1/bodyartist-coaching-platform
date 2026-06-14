from pydantic import BaseModel, Field, UUID4
from typing import Dict, List, Optional, Any

class TargetMacros(BaseModel):
    protein: float
    carbs: float
    fat: float

class DietPlanBase(BaseModel):
    meals_target: int = Field(..., gt=0, description="Must be greater than 0")
    water_target: int = Field(..., gt=0, description="Must be greater than 0")
    steps_target: int = Field(..., ge=0, description="Must be 0 or greater")
    cardio_target: int = Field(..., ge=0, description="Must be 0 or greater")
    tolerance_percent: int = Field(..., ge=0, le=100, description="Must be between 0 and 100")
    target_macros: TargetMacros
    supplement_checklist: List[Dict[str, Any]] = Field(default_factory=list)

class DietPlanCreate(DietPlanBase):
    athlete_id: UUID4

class DietPlanUpdate(DietPlanBase):
    pass

class DietPlanResponse(DietPlanBase):
    id: UUID4
    athlete_id: UUID4

    class Config:
        from_attributes = True
