from sqlalchemy.orm import Session
from uuid import UUID

from backend.app.repositories.meal_log_repository import MealLogRepository
from backend.app.schemas.meal_history_schema import MealHistoryResponse, MealLogItem

class MealHistoryService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = MealLogRepository()

    def get_meal_history(self, athlete_id: UUID) -> MealHistoryResponse:
        meals = self.repository.get_athlete_meals_desc(self.db, athlete_id)
        
        meal_items = [MealLogItem.model_validate(meal) for meal in meals]
        
        return MealHistoryResponse(
            athlete_id=athlete_id,
            total_meals=len(meal_items),
            meals=meal_items
        )
