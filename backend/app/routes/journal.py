from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import JournalEntry
from ..schemas import JournalCreate, JournalResponse, JournalResponseV2
from ..services.emotion_analyzer_v2 import emotion_analyzer_v2  # NEW
from ..services.reflection_generator_v2 import reflection_generator_v2  # NEW
import json
from typing import List

router = APIRouter(prefix="/journal", tags=["Journal"])

@router.post("/create", response_model=JournalResponseV2)
async def create_journal_entry(
    entry: JournalCreate,
    db: Session = Depends(get_db)
):
    """Create a new journal entry with GoEmotions analysis"""
    
    # Analyze emotion with GoEmotions (27 labels)
    emotion_result = emotion_analyzer_v2.analyze(entry.content)
    
    # Generate reflection with enhanced context
    reflection_result = reflection_generator_v2.generate(
        entry.content,
        emotion_result
    )
    
    # Save to database
    db_entry = JournalEntry(
        content=entry.content,
        emotion=emotion_result['emotion'],
        emotion_scores=json.dumps({
            'all_scores': emotion_result['all_scores'],
            'significant_emotions': emotion_result['significant_emotions'],
            'is_mixed': emotion_result['is_mixed'],
            'mixed_type': emotion_result['mixed_type'],
            'has_conflict': emotion_result['has_conflict'],
            'has_confusion': emotion_result['has_confusion'],
            'complexity': emotion_result['complexity'],
            'valence': emotion_result['valence'],
            'emotional_state': emotion_result['emotional_state'],
            'model': emotion_result['model']
        }),
        reflection=reflection_result['reflection'],
        is_voice=entry.is_voice
    )
    
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    
    # Parse emotion_scores for metadata
    emotion_metadata = {}
    if db_entry.emotion_scores:
        try:
            emotion_metadata = json.loads(db_entry.emotion_scores)
        except (json.JSONDecodeError, TypeError):
            emotion_metadata = {}
    
    # Return with full metadata
    return JournalResponseV2(
        id=db_entry.id,
        content=db_entry.content,
        emotion=db_entry.emotion,
        emotion_metadata=emotion_metadata,
        reflection=db_entry.reflection,
        reflection_metadata={
            'suggestions': reflection_result.get('suggestions', []),
            'tone': reflection_result.get('tone', 'supportive'),
            'focus': reflection_result.get('focus', 'support')
        },
        created_at=db_entry.created_at,
        is_voice=db_entry.is_voice
    )

@router.get("/history", response_model=List[JournalResponseV2])
async def get_journal_history(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get recent journal entries"""
    entries = db.query(JournalEntry)\
        .order_by(JournalEntry.created_at.desc())\
        .limit(limit)\
        .all()
    
    # Parse emotion_scores and return as emotion_metadata
    result = []
    for entry in entries:
        emotion_metadata = {}
        reflection_metadata = {}
        
        # Parse emotion_scores if it exists
        if entry.emotion_scores:
            try:
                emotion_metadata = json.loads(entry.emotion_scores)
            except (json.JSONDecodeError, TypeError):
                emotion_metadata = {}
        
        result.append(JournalResponseV2(
            id=entry.id,
            content=entry.content,
            emotion=entry.emotion,
            emotion_metadata=emotion_metadata if emotion_metadata else None,
            reflection=entry.reflection,
            reflection_metadata=reflection_metadata if reflection_metadata else None,
            created_at=entry.created_at,
            is_voice=entry.is_voice
        ))
    
    return result

@router.get("/{entry_id}", response_model=JournalResponseV2)
async def get_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db)
):
    """Get specific journal entry"""
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    # Parse emotion_scores if it exists
    emotion_metadata = {}
    if entry.emotion_scores:
        try:
            emotion_metadata = json.loads(entry.emotion_scores)
        except (json.JSONDecodeError, TypeError):
            emotion_metadata = {}
    
    return JournalResponseV2(
        id=entry.id,
        content=entry.content,
        emotion=entry.emotion,
        emotion_metadata=emotion_metadata if emotion_metadata else None,
        reflection=entry.reflection,
        reflection_metadata=None,  # Not stored in DB for old entries
        created_at=entry.created_at,
        is_voice=entry.is_voice
    )