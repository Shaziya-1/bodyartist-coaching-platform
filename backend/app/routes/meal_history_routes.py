from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from backend.app.config.database import get_db
from backend.app.schemas.meal_history_schema import MealHistoryResponse
from backend.app.services.meal_history_service import MealHistoryService

router = APIRouter(
    prefix="/api/v1/meals",
    tags=["Meals"]
)

@router.get("/history/{athlete_id}", response_model=MealHistoryResponse, status_code=status.HTTP_200_OK)
def get_meal_history(athlete_id: UUID, db: Session = Depends(get_db)):
    service = MealHistoryService(db)
    return service.get_meal_history(athlete_id)
