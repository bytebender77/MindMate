from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import get_settings
import logging

logger = logging.getLogger(__name__)

settings = get_settings()

# Configure database connection
# SQLite needs check_same_thread=False, PostgreSQL doesn't
connect_args = {}
if "sqlite" in settings.database_url:
    connect_args = {"check_same_thread": False}
elif "postgresql" in settings.database_url:
    # PostgreSQL connection pool settings for production
    connect_args = {
        "connect_timeout": 10,
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    }

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=300,  # Recycle connections after 5 minutes
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Log database connection info
logger.info(f"Database URL: {settings.database_url.split('@')[0]}@***")  # Hide password