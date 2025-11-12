from transformers import pipeline
import logging
import numpy as np
import os
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)


class EmotionAnalyzerV2:
    """
    Enhanced emotion analyzer using GoEmotions (27 emotion labels)
    Includes support for mixed emotions, confusion, and complex emotional states
    """
    
    # GoEmotions 27 labels
    EMOTIONS = [
        'admiration', 'amusement', 'anger', 'annoyance', 'approval', 
        'caring', 'confusion', 'curiosity', 'desire', 'disappointment',
        'disapproval', 'disgust', 'embarrassment', 'excitement', 'fear',
        'gratitude', 'grief', 'joy', 'love', 'nervousness', 'optimism',
        'pride', 'realization', 'relief', 'remorse', 'sadness', 'surprise'
    ]
    
    # Emotion categories
    POSITIVE_EMOTIONS = [
        'admiration', 'amusement', 'approval', 'caring', 'excitement',
        'gratitude', 'joy', 'love', 'optimism', 'pride', 'relief'
    ]
    
    NEGATIVE_EMOTIONS = [
        'anger', 'annoyance', 'disappointment', 'disapproval', 'disgust',
        'embarrassment', 'fear', 'grief', 'nervousness', 'remorse', 'sadness'
    ]
    
    NEUTRAL_EMOTIONS = [
        'confusion', 'curiosity', 'desire', 'realization', 'surprise'
    ]
    
    # Conflict indicators
    CONFLICT_PHRASES = [
        'but', 'however', 'though', 'although', 'yet', 'still',
        'should be', 'supposed to', 'expected to', 'want to be',
        "don't know", "can't tell", 'mixed', 'confused', 'conflicted',
        'torn', 'part of me', 'on one hand', 'on the other hand',
        'at the same time', 'despite', 'even though', 'while'
    ]
    
    def __init__(self):
        # Check if we should use lighter model for free tier (memory constraints)
        use_light_model = os.getenv("USE_LIGHT_MODEL", "false").lower() == "true"
        
        if use_light_model:
            # Use lighter model for free tier deployments
            self.model_name = "j-hartmann/emotion-english-distilroberta-base"
            logger.info("Using lighter model for free tier (memory-efficient)")
        else:
            # Use full GoEmotions model (27 emotions)
            self.model_name = "SamLowe/roberta-base-go_emotions"
        
        self.classifier = None
        self._model_loaded = False
        # Don't load model on initialization - use lazy loading to save memory
        # Model will be loaded on first request
    
    def _ensure_model_loaded(self):
        """Lazy load model only when needed"""
        if self.classifier is not None:
            return
        
        if not self._model_loaded:
            try:
                logger.info(f"Loading {self.model_name} (lazy loading)...")
                self.classifier = pipeline(
                    "text-classification",
                    model=self.model_name,
                    top_k=None,  # Return all emotion scores
                    device=-1,  # CPU (use 0 for GPU)
                    # Memory optimization: Use CPU and optimize settings
                    # Note: torch_dtype parameter may not be supported for all models
                )
                self._model_loaded = True
                if "go_emotions" in self.model_name.lower():
                    logger.info("✅ GoEmotions model loaded successfully (27 emotion labels)")
                else:
                    logger.info(f"✅ Emotion model loaded successfully: {self.model_name}")
            except Exception as e:
                logger.error(f"❌ Failed to load GoEmotions model: {e}")
                logger.info("Falling back to lighter model...")
                self._load_fallback_model()
    
    def _load_fallback_model(self):
        """Fallback to lighter model if GoEmotions fails or for memory constraints"""
        try:
            # Use lighter DistilRoBERTa model for free tier
            fallback_model = "j-hartmann/emotion-english-distilroberta-base"
            logger.info(f"Loading lighter model: {fallback_model}...")
            self.classifier = pipeline(
                "text-classification",
                model=fallback_model,
                top_k=None,
                device=-1  # CPU
            )
            self._model_loaded = True
            logger.info("✅ Loaded fallback emotion model (lighter, memory-efficient)")
        except Exception as e:
            logger.error(f"❌ All models failed to load: {e}")
            self.classifier = None
            self._model_loaded = False
    
    def analyze(self, text: str, threshold: float = 0.10) -> dict:
        """
        Comprehensive emotion analysis
        
        Args:
            text: Input text to analyze
            threshold: Minimum confidence to include emotion (0.0-1.0)
            
        Returns:
            Dict with comprehensive emotion analysis
        """
        # Lazy load model on first request
        self._ensure_model_loaded()
        
        if not self.classifier:
            return self._fallback_response()
        
        if not text or len(text.strip()) < 3:
            return self._fallback_response()
        
        try:
            # Get predictions
            results = self.classifier(text[:512])[0]
            
            # Sort by confidence
            sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)
            
            # Extract data
            all_scores = {r['label']: round(r['score'], 4) for r in sorted_results}
            
            # Get significant emotions (above threshold)
            significant = [
                {"label": r['label'], "confidence": round(r['score'], 4)}
                for r in sorted_results 
                if r['score'] >= threshold
            ]
            
            # Primary emotion
            primary = sorted_results[0]
            
            # Detect mixed emotions
            is_mixed, mixed_type = self._detect_mixed_emotions(
                text, significant, all_scores
            )
            
            # Detect emotional conflict
            has_conflict = self._detect_conflict_patterns(text, significant)
            
            # Calculate complexity
            complexity = self._calculate_complexity(all_scores, significant)
            
            # Calculate valence (positive/negative)
            valence = self._calculate_valence(all_scores)
            
            # Detect confusion specifically
            has_confusion = all_scores.get('confusion', 0) > 0.15
            
            return {
                "emotion": primary['label'],
                "confidence": round(primary['score'], 4),
                "all_scores": all_scores,
                "significant_emotions": significant[:5],  # Top 5
                "is_mixed": is_mixed,
                "mixed_type": mixed_type,
                "has_conflict": has_conflict,
                "has_confusion": has_confusion,
                "complexity": complexity,
                "valence": valence,
                "emotional_state": self._describe_emotional_state(
                    is_mixed, has_conflict, has_confusion, valence
                ),
                "model": self.model_name
            }
            
        except Exception as e:
            logger.error(f"Error analyzing emotion: {e}")
            return self._fallback_response()
    
    def _detect_mixed_emotions(
        self, text: str, significant: List[dict], all_scores: dict
    ) -> Tuple[bool, str]:
        """
        Detect if emotions are mixed and what type
        
        Returns:
            (is_mixed: bool, mixed_type: str)
        """
        if len(significant) < 2:
            return False, "single"
        
        # Check if second emotion is strong enough
        if significant[1]['confidence'] < 0.20:
            return False, "single"
        
        labels = [e['label'] for e in significant[:3]]
        
        # Check for positive-negative mix
        has_positive = any(label in self.POSITIVE_EMOTIONS for label in labels)
        has_negative = any(label in self.NEGATIVE_EMOTIONS for label in labels)
        
        if has_positive and has_negative:
            return True, "conflicted"  # Positive + Negative
        
        # Multiple emotions from same category
        if len(significant) >= 3:
            return True, "complex"  # Multiple emotions
        
        # Two moderate emotions
        if len(significant) >= 2 and significant[1]['confidence'] > 0.25:
            return True, "layered"  # Layered emotions
        
        return False, "single"
    
    def _detect_conflict_patterns(self, text: str, significant: List[dict]) -> bool:
        """Detect linguistic patterns indicating emotional conflict"""
        text_lower = text.lower()
        
        # Check for conflict phrases
        has_conflict_phrase = any(
            phrase in text_lower for phrase in self.CONFLICT_PHRASES
        )
        
        # Check for emotional contrast in text
        if len(significant) >= 2:
            labels = [e['label'] for e in significant[:2]]
            
            has_positive = any(label in self.POSITIVE_EMOTIONS for label in labels)
            has_negative = any(label in self.NEGATIVE_EMOTIONS for label in labels)
            
            if has_positive and has_negative and has_conflict_phrase:
                return True
        
        return has_conflict_phrase and len(significant) >= 2
    
    def _calculate_complexity(self, all_scores: dict, significant: List[dict]) -> str:
        """
        Calculate emotional complexity
        
        Returns:
            'simple', 'moderate', 'complex', 'very_complex'
        """
        # Count significant emotions
        sig_count = len(significant)
        
        # Calculate entropy (emotional diversity)
        scores = [s for s in all_scores.values() if s > 0]
        if not scores:
            return "simple"
        
        entropy = -sum(s * np.log(s + 1e-10) for s in scores)
        
        # Determine complexity
        if sig_count == 1 and entropy < 1.5:
            return "simple"
        elif sig_count == 2 and entropy < 2.5:
            return "moderate"
        elif sig_count >= 3 and entropy < 3.0:
            return "complex"
        else:
            return "very_complex"
    
    def _calculate_valence(self, all_scores: dict) -> dict:
        """
        Calculate emotional valence (positive/negative/neutral)
        
        Returns:
            Dict with positive, negative, neutral scores
        """
        positive_score = sum(
            all_scores.get(emotion, 0) 
            for emotion in self.POSITIVE_EMOTIONS
        )
        
        negative_score = sum(
            all_scores.get(emotion, 0)
            for emotion in self.NEGATIVE_EMOTIONS
        )
        
        neutral_score = sum(
            all_scores.get(emotion, 0)
            for emotion in self.NEUTRAL_EMOTIONS
        )
        
        total = positive_score + negative_score + neutral_score
        
        if total == 0:
            return {
                "positive": 0.0,
                "negative": 0.0,
                "neutral": 1.0,
                "overall": "neutral"
            }
        
        # Normalize
        pos_norm = positive_score / total
        neg_norm = negative_score / total
        neu_norm = neutral_score / total
        
        # Determine overall
        if pos_norm > 0.5:
            overall = "positive"
        elif neg_norm > 0.5:
            overall = "negative"
        else:
            overall = "neutral"
        
        return {
            "positive": round(pos_norm, 3),
            "negative": round(neg_norm, 3),
            "neutral": round(neu_norm, 3),
            "overall": overall
        }
    
    def _describe_emotional_state(
        self, is_mixed: bool, has_conflict: bool, 
        has_confusion: bool, valence: dict
    ) -> str:
        """Generate human-readable emotional state description"""
        
        if has_confusion and is_mixed:
            return "confused_mixed"
        elif has_confusion:
            return "confused"
        elif has_conflict:
            return "conflicted"
        elif is_mixed and valence['overall'] == 'positive':
            return "mixed_positive"
        elif is_mixed and valence['overall'] == 'negative':
            return "mixed_negative"
        elif is_mixed:
            return "mixed_neutral"
        elif valence['overall'] == 'positive':
            return "positive"
        elif valence['overall'] == 'negative':
            return "negative"
        else:
            return "neutral"
    
    def _fallback_response(self):
        """Fallback response when analysis fails"""
        return {
            "emotion": "neutral",
            "confidence": 0.0,
            "all_scores": {},
            "significant_emotions": [],
            "is_mixed": False,
            "mixed_type": "single",
            "has_conflict": False,
            "has_confusion": False,
            "complexity": "unknown",
            "valence": {
                "positive": 0.0,
                "negative": 0.0,
                "neutral": 1.0,
                "overall": "neutral"
            },
            "emotional_state": "neutral",
            "model": "fallback"
        }
    
    def analyze_batch(self, texts: List[str]) -> List[dict]:
        """Analyze multiple texts at once (more efficient)"""
        return [self.analyze(text) for text in texts]


# Singleton instance
emotion_analyzer_v2 = EmotionAnalyzerV2()