from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class MarketResearch(Base):
    __tablename__ = "market_research"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(255), nullable=False)
    source = Column(String(255), nullable=False)
    source_url = Column(String(500), nullable=True)
    publication_date = Column(DateTime, nullable=True)
    observation_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    finding = Column(Text, nullable=False)
    reliability = Column(String(50), default="High") # High, Medium, Low
    category = Column(String(100), nullable=False) # Fashion Market Trends, Gen Z Preferences, Price Positioning, Returns Behavior, Delivery Expectation
    implication = Column(Text, nullable=False)
    is_synthetic = Column(Boolean, default=True) # Clearly marked demo vs user input
    created_at = Column(DateTime, default=datetime.utcnow)

class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    website = Column(String(255), nullable=True)
    tier = Column(String(50), default="Tier 1") # Direct Competitor, Adjacent, Global Benchmark
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    features = relationship("CompetitorFeature", back_populates="competitor", cascade="all, delete-orphan")

class CompetitorFeature(Base):
    __tablename__ = "competitor_features"

    id = Column(Integer, primary_key=True, index=True)
    competitor_id = Column(Integer, ForeignKey("competitors.id", ondelete="CASCADE"), nullable=False)
    dimension = Column(String(100), nullable=False) # Homepage, Product Discovery, Search, Recommendations, PDP, Size Guidance, Cart, Checkout, Promotions, Returns
    evaluation = Column(String(50), default="Parity") # Leading, Parity, Lagging
    strengths = Column(Text, nullable=True)
    weaknesses = Column(Text, nullable=True)
    product_opportunity = Column(Text, nullable=True)
    evidence_url = Column(String(500), nullable=True)

    competitor = relationship("Competitor", back_populates="features")

class MarketOpportunity(Base):
    __tablename__ = "market_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    market_problem = Column(Text, nullable=False)
    customer_segment = Column(String(100), nullable=False)
    existing_alternatives = Column(Text, nullable=False)
    opportunity_size_assumptions = Column(Text, nullable=True)
    potential_business_value = Column(String(100), nullable=False) # High (+$5M GMV), Medium, Low
    product_complexity = Column(String(50), default="Medium") # Low, Medium, High
    customer_benefit = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    status = Column(String(50), default="Proposed") # Proposed, In Discovery, Roadmapped, Rejected
    confidence_score = Column(Float, default=7.5) # Out of 10
    created_at = Column(DateTime, default=datetime.utcnow)
