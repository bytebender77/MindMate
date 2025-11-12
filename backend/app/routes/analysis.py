from fastapi import APIRouter, HTTPException, UploadFile, File
from ..schemas import (
    EmotionAnalysis, ReflectionRequest, ReflectionResponse,
    EmotionAnalysisV2, EmotionScore, ValenceScore
)
from ..services.emotion_analyzer import emotion_analyzer
from ..services.reflection_generator import reflection_generator
from ..services.emotion_analyzer_v2 import emotion_analyzer_v2
from ..services.reflection_generator_v2 import reflection_generator_v2
from ..services.speech_to_text import speech_to_text_service
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analysis", tags=["AI Analysis"])


class TextRequest(BaseModel):
    text: str


@router.post("/emotion", response_model=EmotionAnalysis)
async def analyze_emotion(request: TextRequest):
    """
    Analyze emotion from text
    
    Args:
        request: TextRequest with text to analyze
        
    Returns:
        EmotionAnalysis with detected emotion and confidence scores
    """
    if not request.text or len(request.text.strip()) < 5:
        raise HTTPException(
            status_code=400, 
            detail="Text must be at least 5 characters long"
        )
    
    try:
        result = emotion_analyzer.analyze(request.text)
        
        return EmotionAnalysis(
            emotion=result["emotion"],
            confidence=result["confidence"],
            all_scores=result["all_scores"]
        )
    except Exception as e:
        logger.error(f"Error analyzing emotion: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze emotion"
        )


@router.post("/reflect", response_model=ReflectionResponse)
async def generate_reflection(request: ReflectionRequest):
    """
    Generate AI reflection based on journal content and detected emotion
    
    Args:
        request: ReflectionRequest with content and emotion
        
    Returns:
        ReflectionResponse with reflection text and suggestions
    """
    if not request.content or len(request.content.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Content must be at least 10 characters long"
        )
    
    try:
        result = reflection_generator.generate(
            request.content,
            request.emotion
        )
        
        return ReflectionResponse(
            reflection=result["reflection"],
            suggestions=result["suggestions"]
        )
    except Exception as e:
        logger.error(f"Error generating reflection: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate reflection"
        )


@router.post("/speech-to-text")
async def convert_speech_to_text(audio: UploadFile = File(...)):
    """
    Convert speech audio to text
    
    Args:
        audio: Audio file (WAV, MP3, WebM)
        
    Returns:
        Transcribed text
    """
    # Validate file type
    allowed_types = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/webm", "audio/ogg"]
    
    if audio.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Check file size (max 10MB)
    file_content = await audio.read()
    if len(file_content) > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 10MB limit"
        )
    
    try:
        # Reset file pointer
        await audio.seek(0)
        
        # Convert speech to text
        text = await speech_to_text_service.transcribe(audio)
        
        if not text:
            raise HTTPException(
                status_code=400,
                detail="Could not transcribe audio. Please try again."
            )
        
        return {
            "text": text,
            "success": True,
            "message": "Audio transcribed successfully"
        }
        
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to transcribe audio"
        )


@router.post("/analyze-full")
async def full_analysis(request: TextRequest):
    """
    Perform complete analysis: emotion detection + reflection generation
    
    Args:
        request: TextRequest with journal entry text
        
    Returns:
        Complete analysis with emotion and reflection
    """
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Text must be at least 10 characters long"
        )
    
    try:
        # Analyze emotion
        emotion_result = emotion_analyzer.analyze(request.text)
        
        # Generate reflection
        reflection_result = reflection_generator.generate(
            request.text,
            emotion_result["emotion"]
        )
        
        return {
            "emotion": {
                "primary": emotion_result["emotion"],
                "confidence": emotion_result["confidence"],
                "all_scores": emotion_result["all_scores"]
            },
            "reflection": {
                "message": reflection_result["reflection"],
                "suggestions": reflection_result["suggestions"]
            },
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Error in full analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to perform analysis"
        )


# V2 Endpoints using GoEmotions
@router.post("/emotion-v2", response_model=EmotionAnalysisV2)
async def analyze_emotion_v2(request: TextRequest):
    """
    Analyze emotion using GoEmotions (27 labels)
    Includes confusion, mixed emotions, and conflict detection
    """
    if not request.text or len(request.text.strip()) < 5:
        raise HTTPException(
            status_code=400,
            detail="Text must be at least 5 characters long"
        )
    
    try:
        result = emotion_analyzer_v2.analyze(request.text)
        
        # Convert significant_emotions to EmotionScore objects
        significant_emotions = [
            EmotionScore(label=e['label'], confidence=e['confidence'])
            for e in result.get('significant_emotions', [])
        ]
        
        # Convert valence to ValenceScore object
        valence_data = result.get('valence', {})
        valence = ValenceScore(
            positive=valence_data.get('positive', 0.0),
            negative=valence_data.get('negative', 0.0),
            neutral=valence_data.get('neutral', 0.0),
            overall=valence_data.get('overall', 'neutral')
        )
        
        return EmotionAnalysisV2(
            emotion=result['emotion'],
            confidence=result['confidence'],
            all_scores=result['all_scores'],
            significant_emotions=significant_emotions,
            is_mixed=result['is_mixed'],
            mixed_type=result['mixed_type'],
            has_conflict=result['has_conflict'],
            has_confusion=result['has_confusion'],
            complexity=result['complexity'],
            valence=valence,
            emotional_state=result['emotional_state'],
            model=result['model']
        )
    except Exception as e:
        logger.error(f"Error analyzing emotion: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze emotion"
        )


@router.post("/reflect-v2")
async def generate_reflection_v2(request: TextRequest):
    """
    Generate reflection using enhanced emotional analysis
    """
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Content must be at least 10 characters long"
        )
    
    try:
        # First analyze emotion
        emotion_result = emotion_analyzer_v2.analyze(request.text)
        
        # Then generate reflection
        reflection_result = reflection_generator_v2.generate(
            request.text,
            emotion_result
        )
        
        return {
            "emotion_analysis": emotion_result,
            "reflection": reflection_result,
            "success": True
        }
    except Exception as e:
        logger.error(f"Error generating reflection: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate reflection"
        )


@router.post("/full-analysis-v2")
async def full_analysis_v2(request: TextRequest):
    """
    Complete emotional analysis with GoEmotions
    """
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Text must be at least 10 characters long"
        )
    
    try:
        # Emotion analysis
        emotion_result = emotion_analyzer_v2.analyze(request.text)
        
        # Generate reflection
        reflection_result = reflection_generator_v2.generate(
            request.text,
            emotion_result
        )
        
        return {
            "text": request.text,
            "emotion": {
                "primary": emotion_result["emotion"],
                "confidence": emotion_result["confidence"],
                "all_emotions": emotion_result["significant_emotions"],
                "is_mixed": emotion_result["is_mixed"],
                "emotional_state": emotion_result["emotional_state"],
                "complexity": emotion_result["complexity"],
                "valence": emotion_result["valence"],
                "has_confusion": emotion_result["has_confusion"],
                "has_conflict": emotion_result["has_conflict"]
            },
            "reflection": {
                "message": reflection_result["reflection"],
                "suggestions": reflection_result["suggestions"],
                "tone": reflection_result.get("tone"),
                "focus": reflection_result.get("focus")
            },
            "model": emotion_result["model"],
            "success": True
        }
    except Exception as e:
        logger.error(f"Error in full analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to perform analysis"
        )