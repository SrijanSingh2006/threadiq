import os
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "ThreadIQ"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database: Dual mode - PostgreSQL production, SQLite local fallback
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./threadiq.db")
    
    # Gemini AI configuration
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "threadiq-secret-pm-key-2026-production-ready")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Demo and Environment Flags
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    IS_SYNTHETIC_DATA: bool = True
    
settings = Settings()
