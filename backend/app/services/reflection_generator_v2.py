import google.generativeai as genai
from openai import OpenAI
from ..config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()


class ReflectionGeneratorV2:
    """
    Enhanced reflection generator that handles 27 GoEmotions labels
    and complex emotional states
    """
    
    # Emotion-specific response templates
    EMOTION_TEMPLATES = {
        'confusion': {
            'acknowledge': "It's okay to feel confused right now.",
            'validate': "Confusion is often a sign that you're processing complex information or emotions.",
            'suggestions': [
                "Take time to sit with your thoughts without judgment",
                "Write down what you know vs. what you're unsure about",
                "Talk to someone you trust about what's on your mind"
            ]
        },
        'conflicted': {
            'acknowledge': "Having conflicting emotions is completely normal.",
            'validate': "It shows you're thinking deeply about different aspects of your situation.",
            'suggestions': [
                "List out the different emotions and what's causing each one",
                "Remember that you can feel multiple things at once",
                "Give yourself permission to not have all the answers right now"
            ]
        },
        'mixed_positive': {
            'acknowledge': "You're experiencing a mix of emotions, which is natural.",
            'validate': "It's wonderful that there are positive feelings present.",
            'suggestions': [
                "Focus on nurturing the positive aspects",
                "Acknowledge all your feelings without judgment",
                "Celebrate small wins"
            ]
        },
        'anxiety': {
            'acknowledge': "I hear that you're feeling anxious.",
            'validate': "Anxiety is your mind trying to protect you.",
            'suggestions': [
                "Practice the 5-4-3-2-1 grounding technique",
                "Focus on what you can control",
                "Take slow, deep breaths"
            ]
        }
    }
    
    def __init__(self):
        self.use_gemini = True if settings.gemini_api_key else False
        
        if self.use_gemini:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel('gemini-pro')
            logger.info("✅ Using Gemini for reflections")
        elif settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)
            self.use_gemini = False
            logger.info("✅ Using OpenAI for reflections")
        else:
            logger.warning("⚠️ No AI API key provided")
            self.client = None
    
    def generate(self, journal_text: str, emotion_data: dict) -> dict:
        """
        Generate contextual reflection based on GoEmotions analysis
        
        Args:
            journal_text: User's journal entry
            emotion_data: Full GoEmotions analysis result
            
        Returns:
            Dict with reflection, suggestions, and metadata
        """
        # Extract emotion analysis
        primary = emotion_data.get('emotion', 'neutral')
        emotional_state = emotion_data.get('emotional_state', 'neutral')
        is_mixed = emotion_data.get('is_mixed', False)
        has_conflict = emotion_data.get('has_conflict', False)
        has_confusion = emotion_data.get('has_confusion', False)
        significant = emotion_data.get('significant_emotions', [])
        complexity = emotion_data.get('complexity', 'moderate')
        valence = emotion_data.get('valence', {})
        
        # Build contextual prompt
        prompt = self._build_advanced_prompt(
            journal_text,
            primary,
            emotional_state,
            is_mixed,
            has_conflict,
            has_confusion,
            significant,
            complexity,
            valence
        )
        
        try:
            if self.use_gemini:
                response = self.model.generate_content(prompt)
                text = response.text
            elif self.client:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are MindMate, an emotionally intelligent mental wellness AI. You understand nuance, complexity, and mixed emotions."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.75,
                    max_tokens=300
                )
                text = response.choices[0].message.content
            else:
                # Use template-based fallback
                return self._template_based_reflection(
                    emotional_state, primary, significant
                )
            
            # Parse response
            reflection, suggestions = self._parse_response(text)
            
            return {
                "reflection": reflection,
                "suggestions": suggestions[:3],
                "tone": self._determine_tone(emotional_state),
                "emotional_state": emotional_state,
                "focus": self._determine_focus(emotional_state, has_confusion)
            }
            
        except Exception as e:
            logger.error(f"Error generating reflection: {e}")
            return self._template_based_reflection(emotional_state, primary, significant)
    
    def _build_advanced_prompt(
        self, text: str, primary: str, emotional_state: str,
        is_mixed: bool, has_conflict: bool, has_confusion: bool,
        significant: list, complexity: str, valence: dict
    ) -> str:
        """Build sophisticated prompt based on emotional analysis"""
        
        # Format significant emotions
        if len(significant) > 1:
            emotion_list = ", ".join([
                f"{e['label']} ({int(e['confidence']*100)}%)"
                for e in significant[:3]
            ])
        else:
            emotion_list = primary
        
        # Build context description
        context_parts = []
        
        if has_confusion:
            context_parts.append("The user is experiencing CONFUSION")
        
        if has_conflict:
            context_parts.append("There is EMOTIONAL CONFLICT present")
        
        if is_mixed and not has_conflict:
            context_parts.append("Multiple emotions are present simultaneously")
        
        if complexity == "very_complex":
            context_parts.append("This is a VERY COMPLEX emotional situation")
        elif complexity == "complex":
            context_parts.append("This is a complex emotional situation")
        
        context = " AND ".join(context_parts) if context_parts else "Clear emotional state"
        
        # Build prompt
        if has_confusion or has_conflict or is_mixed:
            prompt = f"""You are MindMate, a compassionate mental wellness AI companion specializing in emotional complexity.

USER'S JOURNAL ENTRY:
"{text}"

EMOTIONAL ANALYSIS:
- Detected emotions: {emotion_list}
- Emotional state: {emotional_state}
- Context: {context}
- Overall sentiment: {valence.get('overall', 'neutral')}

INSTRUCTIONS:
The user is experiencing {emotional_state.replace('_', ' ')}. This requires special care.

Provide a response with:

1. **ACKNOWLEDGMENT** (2-3 sentences):
   - Acknowledge the COMPLEXITY of what they're feeling
   - Validate that their mixed/conflicted emotions are completely normal
   - Show understanding of the specific situation

2. **INSIGHT** (1-2 sentences):
   - Help them understand WHY they might be feeling this way
   - Normalize the experience
   - Provide gentle perspective

3. **ACTIONABLE TIPS** (3 specific suggestions):
   - Practical, doable self-care actions
   - Tailored to their specific emotional state
   - Mix of immediate relief and longer-term strategies

FORMAT:
REFLECTION: [Your acknowledgment and insight here]

TIPS:
- [Specific tip 1]
- [Specific tip 2]
- [Specific tip 3]

TONE: Warm, non-judgmental, emotionally intelligent, validating
"""
        else:
            # Simpler prompt for clear emotional states
            prompt = f"""You are MindMate, a compassionate mental wellness companion.

USER'S JOURNAL ENTRY:
"{text}"

DETECTED EMOTION: {primary}

Provide:
1. A warm, empathetic 2-3 sentence reflection
2. Three actionable self-care tips

FORMAT:
REFLECTION: [your reflection]

TIPS:
- [tip 1]
- [tip 2]
- [tip 3]
"""
        
        return prompt
    
    def _parse_response(self, text: str) -> tuple:
        """Parse AI response into reflection and suggestions"""
        parts = text.split("TIPS:")
        
        reflection = parts[0].replace("REFLECTION:", "").strip()
        
        suggestions = []
        if len(parts) > 1:
            tip_lines = parts[1].strip().split("\n")
            suggestions = [
                t.strip("- •*").strip() 
                for t in tip_lines 
                if t.strip() and len(t.strip()) > 5
            ]
        
        return reflection, suggestions
    
    def _template_based_reflection(
        self, emotional_state: str, primary: str, significant: list
    ) -> dict:
        """Fallback template-based reflection when AI is unavailable"""
        
        # Get template for emotional state
        template = self.EMOTION_TEMPLATES.get(
            emotional_state,
            self.EMOTION_TEMPLATES.get('confusion')  # Default
        )
        
        if len(significant) > 1:
            emotions_text = " and ".join([e['label'] for e in significant[:2]])
            reflection = f"{template['acknowledge']} I can see you're feeling {emotions_text}. {template['validate']}"
        else:
            reflection = f"{template['acknowledge']} {template['validate']}"
        
        return {
            "reflection": reflection,
            "suggestions": template['suggestions'],
            "tone": "supportive",
            "emotional_state": emotional_state,
            "focus": "validation"
        }
    
    def _determine_tone(self, emotional_state: str) -> str:
        """Determine appropriate tone based on emotional state"""
        if 'confused' in emotional_state or 'conflicted' in emotional_state:
            return "validating"
        elif 'positive' in emotional_state:
            return "encouraging"
        elif 'negative' in emotional_state:
            return "empathetic"
        else:
            return "supportive"
    
    def _determine_focus(self, emotional_state: str, has_confusion: bool) -> str:
        """Determine what the reflection should focus on"""
        if has_confusion:
            return "clarity"
        elif 'conflicted' in emotional_state:
            return "validation"
        elif 'mixed' in emotional_state:
            return "integration"
        else:
            return "support"


# Singleton
reflection_generator_v2 = ReflectionGeneratorV2()