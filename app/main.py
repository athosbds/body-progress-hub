from fastapi import FastAPI
from app.core.config import settings
from app.db import create_db_and_tables
from app.models.user import User

app = FastAPI(title="Muscle Up API", version="1.0.0")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Muscle Up Running."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}