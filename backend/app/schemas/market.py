from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MarketResearchBase(BaseModel):
    topic: str
    source: str
    source_url: Optional[str] = None
    publication_date: Optional[datetime] = None
    observation_date: Optional[datetime] = None
    notes: Optional[str] = None
    finding: str
    reliability: str = "High"
    category: str
    implication: str
    is_synthetic: bool = False

class MarketResearchCreate(MarketResearchBase):
    pass

class MarketResearchOut(MarketResearchBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CompetitorFeatureBase(BaseModel):
    dimension: str
    evaluation: str
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    product_opportunity: Optional[str] = None
    evidence_url: Optional[str] = None

class CompetitorFeatureCreate(CompetitorFeatureBase):
    competitor_id: int

class CompetitorFeatureOut(CompetitorFeatureBase):
    id: int
    competitor_id: int

    class Config:
        from_attributes = True

class CompetitorBase(BaseModel):
    name: str
    website: Optional[str] = None
    tier: str = "Direct Competitor"
    description: Optional[str] = None

class CompetitorCreate(CompetitorBase):
    pass

class CompetitorOut(CompetitorBase):
    id: int
    created_at: datetime
    features: List[CompetitorFeatureOut] = []

    class Config:
        from_attributes = True

class MarketOpportunityBase(BaseModel):
    market_problem: str
    customer_segment: str
    existing_alternatives: str
    opportunity_size_assumptions: Optional[str] = None
    potential_business_value: str
    product_complexity: str = "Medium"
    customer_benefit: str
    recommendation: str
    status: str = "Proposed"
    confidence_score: float = 7.5

class MarketOpportunityCreate(MarketOpportunityBase):
    pass

class MarketOpportunityOut(MarketOpportunityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
