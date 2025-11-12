from fastapi import APIRouter, HTTPException
from ..services.reflection_generator_v2 import reflection_generator_v2
from pydantic import BaseModel
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/settings", tags=["Settings"])


class ProviderRequest(BaseModel):
    provider: str  # "gemini" or "openai"


class ProviderResponse(BaseModel):
    current_provider: str
    available_providers: List[str]
    message: str


@router.get("/provider", response_model=ProviderResponse)
async def get_reflection_provider():
    """Get the current reflection provider"""
    try:
        current = reflection_generator_v2.get_provider()
        available = []
        
        if reflection_generator_v2.gemini_model:
            available.append("gemini")
        if reflection_generator_v2.client:
            available.append("openai")
        
        return ProviderResponse(
            current_provider=current,
            available_providers=available,
            message=f"Current provider: {current}"
        )
    except Exception as e:
        logger.error(f"Error getting provider: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/provider", response_model=ProviderResponse)
async def set_reflection_provider(request: ProviderRequest):
    """Switch the reflection provider"""
    try:
        new_provider = reflection_generator_v2.set_provider(request.provider)
        available = []
        
        if reflection_generator_v2.gemini_model:
            available.append("gemini")
        if reflection_generator_v2.client:
            available.append("openai")
        
        mode = "Testing" if new_provider == "gemini" else "Production"
        
        return ProviderResponse(
            current_provider=new_provider,
            available_providers=available,
            message=f"Switched to {new_provider.upper()} ({mode} Mode)"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error setting provider: {e}")
        raise HTTPException(status_code=500, detail=str(e))

