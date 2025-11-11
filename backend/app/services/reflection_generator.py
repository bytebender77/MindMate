import google.generativeai as genai
from openai import OpenAI
from ..config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# Global provider setting (can be changed at runtime)
_reflection_provider = settings.reflection_provider.lower()

class ReflectionGenerator:
    def __init__(self):
        self._initialize_providers()
        self._select_provider()
    
    def _initialize_providers(self):
        """Initialize both Gemini and OpenAI clients"""
        self.gemini_model = None
        self.openai_client = None
        self.openai_model = settings.openai_model
        
        # Initialize Gemini if API key is available
        if settings.gemini_api_key:
            try:
                genai.configure(api_key=settings.gemini_api_key)
                self.gemini_model = genai.GenerativeModel(settings.gemini_model)
                logger.info(f"✅ Gemini {settings.gemini_model} initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini: {e}")
        
        # Initialize OpenAI if API key is available
        if settings.openai_api_key:
            try:
                self.openai_client = OpenAI(api_key=settings.openai_api_key)
                logger.info(f"✅ OpenAI {settings.openai_model} initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI: {e}")
    
    def _select_provider(self):
        """Select the active provider based on settings"""
        global _reflection_provider
        
        provider = _reflection_provider or settings.reflection_provider.lower()
        
        if provider == "gemini" and self.gemini_model:
            self.use_gemini = True
            logger.info(f"✅ Using Gemini {settings.gemini_model} for reflections (Testing Mode)")
        elif provider == "openai" and self.openai_client:
            self.use_gemini = False
            logger.info(f"✅ Using OpenAI {settings.openai_model} for reflections (Production Mode)")
        elif self.gemini_model:
            self.use_gemini = True
            logger.info(f"✅ Falling back to Gemini {settings.gemini_model}")
        elif self.openai_client:
            self.use_gemini = False
            logger.info(f"✅ Falling back to OpenAI {settings.openai_model}")
        else:
            logger.warning("⚠️ No AI API key provided for either provider")
            self.use_gemini = None
    
    @classmethod
    def set_provider(cls, provider: str, instance=None):
        """Change the provider at runtime"""
        global _reflection_provider
        valid_providers = ["gemini", "openai"]
        
        if provider.lower() not in valid_providers:
            raise ValueError(f"Provider must be one of: {valid_providers}")
        
        _reflection_provider = provider.lower()
        logger.info(f"🔄 Switched reflection provider to: {_reflection_provider}")
        
        # Update the provider selection on the instance
        if instance:
            instance._select_provider()
        
        return _reflection_provider
    
    @staticmethod
    def get_provider():
        """Get the current provider"""
        global _reflection_provider
        return _reflection_provider or settings.reflection_provider.lower()
    
    def generate(self, journal_text: str, emotion: str) -> dict:
        """Generate AI reflection based on journal and emotion"""
        
        prompt = f"""You are a compassionate mental wellness companion named MindMate.

The user wrote this journal entry:
"{journal_text}"

Detected emotion: {emotion}

Provide:
1. A warm, empathetic 2-3 sentence reflection acknowledging their feelings
2. Two actionable self-care tips

Format:
REFLECTION: [your reflection]
TIPS:
- [tip 1]
- [tip 2]
"""
        
        try:
            # Recheck provider in case it was changed at runtime
            self._select_provider()
            
            if self.use_gemini and self.gemini_model:
                response = self.gemini_model.generate_content(prompt)
                text = response.text
            elif not self.use_gemini and self.openai_client:
                response = self.openai_client.chat.completions.create(
                    model=self.openai_model,
                    messages=[
                        {"role": "system", "content": "You are a supportive mental wellness AI companion."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=300
                )
                text = response.choices[0].message.content
            else:
                raise Exception("No available AI provider")
            
            # Parse response
            parts = text.split("TIPS:")
            reflection = parts[0].replace("REFLECTION:", "").strip()
            
            tips = []
            if len(parts) > 1:
                tip_lines = parts[1].strip().split("\n")
                tips = [t.strip("- ").strip() for t in tip_lines if t.strip()]
            
            return {
                "reflection": reflection,
                "suggestions": tips[:2]  # Max 2 tips
            }
            
        except Exception as e:
            logger.error(f"Error generating reflection: {e}")
            return {
                "reflection": "Thank you for sharing. Remember, it's okay to feel what you're feeling.",
                "suggestions": ["Take a few deep breaths", "Be kind to yourself"]
            }

# Singleton instance
_reflection_generator_instance = None

def get_reflection_generator():
    """Get or create the singleton instance"""
    global _reflection_generator_instance
    if _reflection_generator_instance is None:
        _reflection_generator_instance = ReflectionGenerator()
    return _reflection_generator_instance

# Create singleton
reflection_generator = get_reflection_generator()

# Update set_provider to use the singleton
def set_provider(provider: str):
    """Set the provider for the reflection generator"""
    return ReflectionGenerator.set_provider(provider, reflection_generator)

# Update get_provider to use the singleton
def get_provider():
    """Get the current provider"""
    return ReflectionGenerator.get_provider()