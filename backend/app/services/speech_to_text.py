import logging
from fastapi import UploadFile
import tempfile
import os
from pathlib import Path

logger = logging.getLogger(__name__)


class SpeechToTextService:
    """
    Speech-to-Text service supporting multiple backends:
    - OpenAI Whisper API
    - Google Speech-to-Text
    - Local Whisper model
    """
    
    def __init__(self):
        self.backend = self._initialize_backend()
    
    def _initialize_backend(self):
        """Initialize the best available backend"""
        from ..config import get_settings
        settings = get_settings()
        
        # Try OpenAI Whisper first
        if settings.openai_api_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=settings.openai_api_key)
                logger.info("✅ Using OpenAI Whisper for speech-to-text")
                return "openai"
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI Whisper: {e}")
        
        # Try Google Speech-to-Text
        if settings.gemini_api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.gemini_api_key)
                logger.info("✅ Using Google Speech-to-Text")
                return "google"
            except Exception as e:
                logger.warning(f"Failed to initialize Google STT: {e}")
        
        # Fallback: Local Whisper (requires installation)
        try:
            import whisper  # pyright: ignore[reportMissingImports]
            self.local_model = whisper.load_model("base")
            logger.info("✅ Using local Whisper model")
            return "local"
        except Exception as e:
            logger.warning(f"Local Whisper not available: {e}")
        
        logger.warning("⚠️ No speech-to-text backend available")
        return None
    
    async def transcribe(self, audio_file: UploadFile) -> str:
        """
        Transcribe audio file to text
        
        Args:
            audio_file: Audio file upload
            
        Returns:
            Transcribed text
        """
        if not self.backend:
            raise Exception("No speech-to-text backend available")
        
        # Save uploaded file temporarily
        suffix = Path(audio_file.filename).suffix or ".wav"
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await audio_file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            if self.backend == "openai":
                return await self._transcribe_openai(tmp_path)
            elif self.backend == "google":
                return await self._transcribe_google(tmp_path)
            elif self.backend == "local":
                return await self._transcribe_local(tmp_path)
            else:
                raise Exception("No backend configured")
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
    
    async def _transcribe_openai(self, audio_path: str) -> str:
        """Transcribe using OpenAI Whisper API"""
        try:
            from ..config import get_settings
            settings = get_settings()
            
            with open(audio_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model=settings.whisper_model,
                    file=audio_file,
                    language="en"
                )
            return transcript.text
        except Exception as e:
            logger.error(f"OpenAI transcription error: {e}")
            raise
    
    async def _transcribe_google(self, audio_path: str) -> str:
        """Transcribe using Google Speech-to-Text"""
        try:
            import google.generativeai as genai
            from ..config import get_settings
            settings = get_settings()
            
            # Upload audio file
            audio_file = genai.upload_file(audio_path)
            
            # Use Gemini for transcription (can use flash models for audio)
            model = genai.GenerativeModel(settings.gemini_model)
            
            response = model.generate_content([
                "Please transcribe this audio file. Only provide the transcription text, nothing else.",
                audio_file
            ])
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Google transcription error: {e}")
            raise
    
    async def _transcribe_local(self, audio_path: str) -> str:
        """Transcribe using local Whisper model"""
        try:
            result = self.local_model.transcribe(audio_path)
            return result["text"]
        except Exception as e:
            logger.error(f"Local Whisper error: {e}")
            raise


# Singleton instance
speech_to_text_service = SpeechToTextService()