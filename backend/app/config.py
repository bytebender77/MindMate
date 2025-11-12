from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # API Keys
    openai_api_key: str = ""
    gemini_api_key: str = ""
    
    # Model Configuration
    gemini_model: str = "gemini-2.5-flash"  # Gemini 2.5 Flash (experimental 2.0)
    openai_model: str = "gpt-4o-mini"  # Recommended: gpt-4o-mini (cheaper) or gpt-3.5-turbo
    whisper_model: str = "whisper-1"  # OpenAI Whisper API model
    
    # Provider Selection (gemini for testing, openai for production)
    reflection_provider: str = "gemini"  # Options: "gemini" or "openai"
    
    # Database
    database_url: str = "sqlite:///./mindmate.db"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # App
    app_name: str = "MindMate API"
    version: str = "1.0.0"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()