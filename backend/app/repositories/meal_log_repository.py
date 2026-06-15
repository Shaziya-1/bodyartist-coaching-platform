from backend.app.models.meal_logs import MealLog
from uuid import UUID
from typing import List

class MealLogRepository:
    def get_athlete_meals_desc(self, db, athlete_id: UUID) -> List[MealLog]:
        return (
            db.query(MealLog)
            .filter(MealLog.athlete_id == athlete_id)
            .order_by(MealLog.logged_at.desc())
            .all()
        )
