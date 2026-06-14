from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from backend.app.config.database import get_db
from backend.app.schemas.diet_plan_schema import DietPlanCreate, DietPlanUpdate, DietPlanResponse
from backend.app.services.diet_plan_service import DietPlanService

router = APIRouter(
    prefix="/api/v1/diet-plan",
    tags=["Diet Plans"]
)

@router.post("/", response_model=DietPlanResponse, status_code=status.HTTP_201_CREATED)
def create_diet_plan(data: DietPlanCreate, db: Session = Depends(get_db)):
    service = DietPlanService(db)
    return service.create_diet_plan(data)


@router.put("/{athlete_id}", response_model=DietPlanResponse, status_code=status.HTTP_200_OK)
def update_diet_plan(athlete_id: UUID, data: DietPlanUpdate, db: Session = Depends(get_db)):
    service = DietPlanService(db)
    return service.update_diet_plan(athlete_id, data)
