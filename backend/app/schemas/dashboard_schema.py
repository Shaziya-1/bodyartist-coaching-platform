from pydantic import BaseModel, UUID4

class DashboardSummaryResponse(BaseModel):
    athlete_id: UUID4
    water_logged: int
    supplements_completed: int
    supplements_total: int
    current_streak: int
