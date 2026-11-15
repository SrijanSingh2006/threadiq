from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.database import get_db
from backend.app.models.market import MarketResearch, Competitor, CompetitorFeature, MarketOpportunity
from backend.app.schemas.market import (
    MarketResearchCreate, MarketResearchOut,
    CompetitorCreate, CompetitorOut,
    CompetitorFeatureCreate, CompetitorFeatureOut,
    MarketOpportunityCreate, MarketOpportunityOut
)

router = APIRouter(prefix="/market", tags=["Market & Competitor Intelligence"])

# Market Research
@router.get("/research", response_model=List[MarketResearchOut])
def get_market_research(category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(MarketResearch)
    if category:
        q = q.filter(MarketResearch.category == category)
    return q.all()

@router.post("/research", response_model=MarketResearchOut)
def create_market_research(item: MarketResearchCreate, db: Session = Depends(get_db)):
    db_obj = MarketResearch(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Competitors & Matrix
@router.get("/competitors", response_model=List[CompetitorOut])
def get_competitors(db: Session = Depends(get_db)):
    return db.query(Competitor).all()

@router.post("/competitors", response_model=CompetitorOut)
def create_competitor(item: CompetitorCreate, db: Session = Depends(get_db)):
    db_obj = Competitor(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.post("/competitor-features", response_model=CompetitorFeatureOut)
def add_competitor_feature(item: CompetitorFeatureCreate, db: Session = Depends(get_db)):
    db_obj = CompetitorFeature(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Market Opportunities
@router.get("/opportunities", response_model=List[MarketOpportunityOut])
def get_market_opportunities(db: Session = Depends(get_db)):
    return db.query(MarketOpportunity).all()

@router.post("/opportunities", response_model=MarketOpportunityOut)
def create_market_opportunity(item: MarketOpportunityCreate, db: Session = Depends(get_db)):
    db_obj = MarketOpportunity(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
