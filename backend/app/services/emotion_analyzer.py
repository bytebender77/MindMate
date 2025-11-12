from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

class EmotionAnalyzer:
    def __init__(self):
        try:
            self.classifier = pipeline(
                "text-classification",
                model="j-hartmann/emotion-english-distilroberta-base",
                top_k=None
            )
            logger.info("✅ Emotion analyzer loaded successfully")
        except Exception as e:
            logger.error(f"❌ Failed to load emotion analyzer: {e}")
            self.classifier = None
    
    def analyze(self, text: str) -> dict:
        """Analyze emotion from text"""
        if not self.classifier:
            return {
                "emotion": "neutral",
                "confidence": 0.0,
                "all_scores": {}
            }
        
        try:
            results = self.classifier(text[:512])[0]  # Limit text length
            
            # Sort by score
            sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)
            
            primary_emotion = sorted_results[0]['label']
            primary_score = sorted_results[0]['score']
            
            all_scores = {r['label']: round(r['score'], 3) for r in sorted_results}
            
            return {
                "emotion": primary_emotion,
                "confidence": round(primary_score, 3),
                "all_scores": all_scores
            }
        except Exception as e:
            logger.error(f"Error analyzing emotion: {e}")
            return {
                "emotion": "neutral",
                "confidence": 0.0,
                "all_scores": {}
            }

# Singleton instance
emotion_analyzer = EmotionAnalyzer()