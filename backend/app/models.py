from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean
from datetime import datetime
from .database import Base

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default_user")
    content = Column(Text, nullable=False)
    emotion = Column(String, nullable=True)
    emotion_scores = Column(String, nullable=True)  # JSON string
    reflection = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_voice = Column(Boolean, default=False)