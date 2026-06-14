from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.config.database import get_db
from backend.app.schemas.supplement_log_schema import SupplementLogRequest, SupplementLogResponse
from backend.app.services.supplement_log_service import SupplementLogService

router = APIRouter(
    prefix="/api/v1/logs",
    tags=["Logs"]
)

@router.put("/supplements", response_model=SupplementLogResponse, status_code=status.HTTP_200_OK)
def upsert_supplement_log(data: SupplementLogRequest, db: Session = Depends(get_db)):
    service = SupplementLogService(db)
    return service.log_supplements(data)
