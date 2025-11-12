"""
API Routes Package
"""

from .journal import router as journal_router
from .mood import router as mood_router
from .analysis import router as analysis_router
from .settings import router as settings_router

__all__ = ["journal_router", "mood_router", "analysis_router", "settings_router"]