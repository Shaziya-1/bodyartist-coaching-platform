from backend.app.models.meal_log_model import MealLog
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

    def get_today_athlete_meals_desc(self, db, athlete_id: UUID) -> List[MealLog]:
        from datetime import date
        from sqlalchemy import cast, Date
        today = date.today()
        return (
            db.query(MealLog)
            .filter(MealLog.athlete_id == athlete_id, cast(MealLog.logged_at, Date) == today)
            .order_by(MealLog.logged_at.desc())
            .all()
        )

