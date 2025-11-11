from sqlalchemy import Column, Integer, ForeignKey, JSON, TIMESTAMP, func
from sqlalchemy.orm import relationship
from .database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    report_data = Column(JSON)
    generated_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    user = relationship("User", backref="reports")
