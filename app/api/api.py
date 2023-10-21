from fastapi import APIRouter

router = APIRouter()

from app.api.api_v1.endpoints import events

router.include_router(events.router, prefix="/v1", tags=["events"])
