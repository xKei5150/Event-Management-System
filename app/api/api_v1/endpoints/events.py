from fastapi import APIRouter
from pydantic import BaseModel
from app.db.session import database, engine
from app.db.models import events_table
from datetime import datetime

router = APIRouter()

class Event(BaseModel):
    event_type: str
    event_name: str
    event_description: str
    location: str
    start_date: datetime
    end_date: datetime

@router.post("/add-event/")
async def add_event(event: Event):
    query = events_table.insert().values(
        event_type=event.event_type,
        event_name=event.event_name,
        event_description=event.event_description,
        location=event.location,
        start_date=event.start_date,
        end_date=event.end_date
    )
    last_record_id = await database.execute(query)
    return {"id": last_record_id}
