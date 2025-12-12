from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users
from app.db.session import create_db_and_tables
import os

app = FastAPI(
    title="Muscle Up API",
    version="1.0.0",
    description="Backend para aplicativo de rastreamento de treinos",
    docs_url="/docs",
    redoc_url="/redoc"
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
if not allowed_origins or allowed_origins == [""]:
    allowed_origins = [
        "http://localhost:3000",
        "https://muscle-up-frontend.vercel.app",
        "https://muscle-up-frontend-*.vercel.app",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(users.router)

@app.on_event("startup")
def on_startup():
    """Inicializa o banco de dados na startup"""
    create_db_and_tables()

@app.get("/")
def read_root():
    """Endpoint raiz com informações da API"""
    return {
        "message": "Muscle Up API",
        "docs": "/docs",
        "redoc": "/redoc",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/auth",
            "users": "/users",
            "health": "/health"
        }
    }

@app.get("/health")
def health_check():
    """Health check endpoint para monitoramento"""
    return {
        "status": "healthy",
        "service": "muscle-up-api",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


from datetime import datetime