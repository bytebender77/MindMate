from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .database import engine, Base
from .routes import journal, mood, analysis
from .routes import settings as settings_router
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="2.0.0",  # Updated version
    description="AI-powered mental wellness companion API with GoEmotions"
)

# CORS - Support multiple origins from environment
cors_origins = settings.cors_origins.split(",") if settings.cors_origins != "*" else ["*"]
cors_origins = [origin.strip() for origin in cors_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(journal.router)
app.include_router(mood.router)
app.include_router(analysis.router)
app.include_router(settings_router.router)

@app.get("/")
async def root():
    return {
        "message": "🧠 MindMate API v2.0",
        "version": "2.0.0",
        "status": "running",
        "features": {
            "emotion_model": "GoEmotions (27 labels)",
            "mixed_emotions": True,
            "confusion_detection": True,
            "conflict_detection": True
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "model": "GoEmotions"
    }

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 MindMate API v2.0 starting up...")
    logger.info("📊 Loading GoEmotions model...")
    
    # Warm up models
    try:
        from .services.emotion_analyzer_v2 import emotion_analyzer_v2
        test_result = emotion_analyzer_v2.analyze("This is a test")
        logger.info(f"✅ Model loaded: {test_result.get('model', 'unknown')}")
    except Exception as e:
        logger.warning(f"⚠️ Model warmup failed (will load on first request): {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )