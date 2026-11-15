from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, Index
from datetime import datetime
from backend.app.database import Base

class ProductEvent(Base):
    __tablename__ = "product_events"

    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String(100), nullable=False, index=True)
    user_id = Column(String(100), nullable=False, index=True)
    session_id = Column(String(100), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    product_id = Column(Integer, nullable=True, index=True)
    product_category = Column(String(100), nullable=True)
    search_query = Column(String(255), nullable=True)
    device_type = Column(String(50), default="mobile") # mobile, desktop, tablet
    experiment_assignment = Column(String(255), nullable=True) # e.g. "EXP-SIZE-RECOMMENDER:variant_b"
    properties_json = Column(Text, nullable=True)
    is_synthetic = Column(Boolean, default=True)

    __table_args__ = (
        Index("idx_events_funnel", "event_name", "timestamp"),
        Index("idx_events_user_session", "user_id", "session_id"),
    )

class MetricDefinition(Base):
    __tablename__ = "metric_definitions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    metric_code = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False) # Discovery, Conversion, Engagement, Supply Chain, Returns
    calculation_formula = Column(Text, nullable=False)
    target_value = Column(Float, nullable=True)
    unit = Column(String(50), default="%") # %, count, INR, days, hours
    owner = Column(String(100), nullable=False)

class FeatureKPI(Base):
    __tablename__ = "feature_kpis"

    id = Column(Integer, primary_key=True, index=True)
    feature_name = Column(String(150), nullable=False)
    business_problem = Column(Text, nullable=False)
    objective = Column(Text, nullable=False)
    primary_kpi = Column(String(100), nullable=False)
    secondary_kpis_json = Column(Text, nullable=True)
    baseline_value = Column(Float, nullable=False)
    target_value = Column(Float, nullable=False)
    actual_value = Column(Float, nullable=False)
    measurement_period = Column(String(100), default="Last 30 Days")
    success_status = Column(String(50), default="On Track") # Exceeded, On Track, At Risk, Off Track

class DailyMetric(Base):
    __tablename__ = "daily_metrics"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, index=True)
    metric_code = Column(String(100), nullable=False, index=True)
    metric_value = Column(Float, nullable=False)
    dimension = Column(String(100), default="all") # all, device, category, segment
    dimension_value = Column(String(100), default="all")
