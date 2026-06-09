from app.models.diet_plan_model import DietPlan


class DietPlanRepository:

    def save(self, db, diet_plan):
        db.add(diet_plan)
        db.commit()
        db.refresh(diet_plan)
        return diet_plan

    def get_by_athlete_id(self, db, athlete_id):
        return (
            db.query(DietPlan)
            .filter(DietPlan.athlete_id == athlete_id)
            .first()
        )

    def update(self, db, athlete_id, update_data):

        diet_plan = self.get_by_athlete_id(
            db,
            athlete_id
        )

        if not diet_plan:
            return None

        for key, value in update_data.items():
            if hasattr(diet_plan, key):
                setattr(diet_plan, key, value)

        db.commit()
        db.refresh(diet_plan)

        return diet_plan