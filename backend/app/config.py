from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
import os

class Settings(BaseSettings):
    # API Keys (Pydantic Settings automatically reads from environment variables)
    openai_api_key: str = ""
    gemini_api_key: str = ""
    
    # Model Configuration
    gemini_model: str = "gemini-2.5-flash"
    openai_model: str = "gpt-4o-mini"
    whisper_model: str = "whisper-1"
    
    # Provider Selection (gemini for testing, openai for production)
    reflection_provider: str = "gemini"
    
    # Database
    # Support both SQLite (local) and PostgreSQL (Render)
    # Render provides DATABASE_URL as postgres://..., convert to sqlalchemy format
    database_url: str = "sqlite:///./mindmate.db"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    
    # App
    app_name: str = "MindMate API"
    version: str = "1.0.0"
    
    # CORS
    cors_origins: str = "*"
    
    @field_validator('database_url', mode='before')
    @classmethod
    def process_database_url(cls, v):
        """Convert postgres:// to postgresql:// for SQLAlchemy compatibility"""
        # If not provided, use default SQLite
        if not v or v == "sqlite:///./mindmate.db":
            # Check environment variable
            env_db_url = os.getenv("DATABASE_URL")
            if env_db_url:
                v = env_db_url
            else:
                return "sqlite:///./mindmate.db"
        
        # Convert postgres:// to postgresql:// for SQLAlchemy
        if isinstance(v, str) and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v
    
    @field_validator('port', mode='before')
    @classmethod
    def process_port(cls, v):
        """Convert port to int, fallback to environment variable"""
        if v is None:
            port_env = os.getenv("PORT")
            return int(port_env) if port_env else 8000
        return int(v)
    
    @field_validator('debug', mode='before')
    @classmethod
    def process_debug(cls, v):
        """Convert debug to boolean"""
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes")
        # Check environment variable
        debug_env = os.getenv("DEBUG", "False")
        return debug_env.lower() in ("true", "1", "yes")
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        # Pydantic Settings automatically reads from environment variables
        # Environment variables take precedence over .env file

@lru_cache()
def get_settings():
    return Settings()