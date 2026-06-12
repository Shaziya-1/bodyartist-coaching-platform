from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy import Column, String, ForeignKey, DateTime, Numeric, Boolean, Integer
from sqlalchemy.orm import relationship
import uuid
import datetime
from backend.app.config.database import Base

class VisionApiCalls(Base):

    __tablename__ = "vision_api_calls"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    athlete_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    timestamp = Column(DateTime(timezone=True), nullable=False, default=datetime.datetime.utcnow)
    api_provider = Column(String(50), nullable=False)  # 'LogMeal' or 'Spike'
    status = Column(String(50), nullable=False)  # 'success' or 'error'
    retry_count = Column(Integer, nullable=False, default=0)
    cost = Column(Numeric(10, 8), nullable=False, default=0.00000000)

