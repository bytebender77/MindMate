from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, List, Any

class JournalCreate(BaseModel):
    content: str = Field(..., min_length=10, max_length=5000)
    is_voice: bool = False

class EmotionAnalysis(BaseModel):
    emotion: str
    confidence: float
    all_scores: Dict[str, float]

class ReflectionRequest(BaseModel):
    content: str
    emotion: str

class ReflectionResponse(BaseModel):
    reflection: str
    suggestions: List[str]

class JournalResponse(BaseModel):
    id: int
    content: str
    emotion: Optional[str] = None
    emotion_scores: Optional[str] = None  # JSON string
    reflection: Optional[str] = None
    created_at: datetime
    is_voice: bool
    user_id: Optional[str] = "default_user"
    
    class Config:
        from_attributes = True

class MoodTrendItem(BaseModel):
    date: str
    emotion: Optional[str] = None
    confidence: Optional[float] = None

class MoodStatsResponse(BaseModel):
    total_entries: int
    emotion_distribution: Dict[str, int]
    weekly_trend: List[MoodTrendItem]

# V2 Schemas for GoEmotions
class EmotionScore(BaseModel):
    label: str
    confidence: float

class ValenceScore(BaseModel):
    positive: float
    negative: float
    neutral: float
    overall: str

class EmotionAnalysisV2(BaseModel):
    emotion: str
    confidence: float
    all_scores: Dict[str, float]
    significant_emotions: List[EmotionScore]
    is_mixed: bool
    mixed_type: str
    has_conflict: bool
    has_confusion: bool
    complexity: str
    valence: ValenceScore
    emotional_state: str
    model: str

class ReflectionMetadata(BaseModel):
    suggestions: List[str]
    tone: str
    focus: str

class JournalResponseV2(BaseModel):
    id: int
    content: str
    emotion: Optional[str] = None
    emotion_metadata: Optional[dict] = None
    reflection: Optional[str] = None
    reflection_metadata: Optional[dict] = None
    created_at: datetime
    is_voice: bool
    
    class Config:
        from_attributes = True