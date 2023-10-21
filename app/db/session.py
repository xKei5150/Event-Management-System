import databases
import sqlalchemy
from .models import metadata
from app.core.config import DATABASE_URL

database = databases.Database(DATABASE_URL)
engine = sqlalchemy.create_engine(DATABASE_URL)
