import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.services.seed_service import seed_database

# Routers
from backend.app.routers import (
    auth, workspaces, users, notifications,
    overview, research, market, storefront,
    analytics, experiment, operations, delivery,
    supply_chain, copilot, reports, settings as settings_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed sample database if not already populated
    db = SessionLocal()
    try:
        seed_database(db, force_reset=False)
    finally:
        db.close()
    
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Commerce Product Discovery, Validation & Operations Intelligence Platform",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api and /api/v1 for unified backward & v1 compatibility
for prefix in ["/api", "/api/v1"]:
    app.include_router(auth.router, prefix=prefix)
    app.include_router(workspaces.router, prefix=prefix)
    app.include_router(users.router, prefix=prefix)
    app.include_router(notifications.router, prefix=prefix)
    app.include_router(overview.router, prefix=prefix)
    app.include_router(research.router, prefix=prefix)
    app.include_router(market.router, prefix=prefix)
    app.include_router(storefront.router, prefix=prefix)
    app.include_router(analytics.router, prefix=prefix)
    app.include_router(experiment.router, prefix=prefix)
    app.include_router(operations.router, prefix=prefix)
    app.include_router(delivery.router, prefix=prefix)
    app.include_router(supply_chain.router, prefix=prefix)
    app.include_router(copilot.router, prefix=prefix)
    app.include_router(reports.router, prefix=prefix)
    app.include_router(settings_router.router, prefix=prefix)

@app.get("/api/health")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "synthetic_fashion_intelligence_platform"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
