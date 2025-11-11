from sqlalchemy import Column, Integer, ForeignKey, JSON, TIMESTAMP, func
from sqlalchemy.orm import relationship
from .database import Base

class ColorPalette(Base):
    __tablename__ = "color_palettes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    palette = Column(JSON, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    user = relationship("User", backref="color_palettes")
