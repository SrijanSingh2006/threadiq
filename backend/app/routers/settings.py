from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import os

from backend.app.database import get_db
from backend.app.config import settings
from backend.app.models.auth import AuditLog
from backend.app.services.seed_service import seed_database

router = APIRouter(prefix="/settings", tags=["System Settings & Seed Controls"])

class GeminiConfigRequest(BaseModel):
    gemini_api_key: Optional[str] = None
    gemini_model: Optional[str] = "gemini-1.5-flash"

@router.get("")
def get_system_settings():
    has_gemini = bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5)
    return {
        "project_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database_backend": "PostgreSQL (configured)" if "postgres" in settings.DATABASE_URL else "SQLite (Local development WAL mode)",
        "gemini_api_configured": has_gemini,
        "gemini_model": settings.GEMINI_MODEL,
        "gemini_mode_label": "Live Google Gemini API" if has_gemini else "Deterministic Domain Intelligence (Demo Fallback)",
        "synthetic_data_active": settings.IS_SYNTHETIC_DATA
    }

@router.post("/gemini-config")
def update_gemini_config(req: GeminiConfigRequest):
    if req.gemini_api_key is not None:
        settings.GEMINI_API_KEY = req.gemini_api_key.strip() or None
        os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY or ""
    if req.gemini_model:
        settings.GEMINI_MODEL = req.gemini_model
        os.environ["GEMINI_MODEL"] = req.gemini_model

    has_gemini = bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5)
    return {
        "status": "success",
        "gemini_api_configured": has_gemini,
        "gemini_model": settings.GEMINI_MODEL,
        "message": "Gemini credentials updated successfully." if has_gemini else "Gemini API key cleared; falling back to Deterministic Domain Intelligence."
    }

@router.post("/reset-demo-data")
def trigger_reset_demo_data(db: Session = Depends(get_db)):
    """
    Clears and re-seeds the entire platform database with fresh synthetic datasets.
    """
    result = seed_database(db, force_reset=True)
    return {
        "status": "success",
        "message": "Database successfully reset and re-seeded with synthetic fashion-commerce dataset.",
        "details": result
    }

@router.get("/audit-logs")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
