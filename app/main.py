from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users
from app.db.session import create_db_and_tables

app = FastAPI(
    title="Muscle Up API",
    version="1.0.0",
    description="Backend para aplicativo de rastreamento de treinos",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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