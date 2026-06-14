from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.config.database import get_db
from backend.app.schemas.step_log_schema import StepLogRequest, StepLogResponse
from backend.app.services.step_log_service import StepLogService

router = APIRouter(
    prefix="/api/v1/logs",
    tags=["Logs"]
)

@router.put("/steps", response_model=StepLogResponse, status_code=status.HTTP_200_OK)
def upsert_step_log(data: StepLogRequest, db: Session = Depends(get_db)):
    service = StepLogService(db)
    return service.log_steps(data)
