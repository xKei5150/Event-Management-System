from fastapi import FastAPI
from app.db.session import metadata, engine, database
from app.api.api import router as api_router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
metadata.create_all(engine)

app = FastAPI()

# Set up CORS
origins = [
    "http://localhost:3000",   # React app address, change if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(api_router)

if __name__== "__main__":
   uvicorn.run(app, host="0.0.0.0", port=8000)