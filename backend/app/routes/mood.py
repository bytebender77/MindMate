from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import JournalEntry
from ..schemas import MoodStatsResponse
from datetime import datetime, timedelta
import json

router = APIRouter(prefix="/mood", tags=["Mood Analytics"])

@router.get("/stats", response_model=MoodStatsResponse)
async def get_mood_statistics(
    days: int = 7,
    db: Session = Depends(get_db)
):
    """Get mood statistics for the past N days"""
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Total entries
    total = db.query(JournalEntry).filter(
        JournalEntry.created_at >= start_date
    ).count()
    
    # Emotion distribution
    emotion_counts = db.query(
        JournalEntry.emotion,
        func.count(JournalEntry.id)
    ).filter(
        JournalEntry.created_at >= start_date,
        JournalEntry.emotion.isnot(None)
    ).group_by(JournalEntry.emotion).all()
    
    emotion_distribution = {emotion: count for emotion, count in emotion_counts}
    
    # Weekly trend
    entries = db.query(JournalEntry).filter(
        JournalEntry.created_at >= start_date
    ).order_by(JournalEntry.created_at).all()
    
    weekly_trend = []
    for entry in entries:
        trend_item = {
            "date": entry.created_at.strftime("%Y-%m-%d"),
            "emotion": entry.emotion,
        }
        # Add confidence if emotion_scores exists
        if entry.emotion_scores:
            try:
                scores = json.loads(entry.emotion_scores)
                trend_item["confidence"] = float(scores.get(entry.emotion, 0)) if entry.emotion else None
            except (json.JSONDecodeError, ValueError, TypeError):
                trend_item["confidence"] = None
        else:
            trend_item["confidence"] = None
        weekly_trend.append(trend_item)
    
    return {
        "total_entries": total,
        "emotion_distribution": emotion_distribution,
        "weekly_trend": weekly_trend
    }