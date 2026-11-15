from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProductEventCreate(BaseModel):
    event_name: str
    user_id: str
    session_id: str
    product_id: Optional[int] = None
    product_category: Optional[str] = None
    search_query: Optional[str] = None
    device_type: Optional[str] = "mobile"
    experiment_assignment: Optional[str] = None
    properties_json: Optional[str] = None
    is_synthetic: bool = False

class ProductEventOut(BaseModel):
    id: int
    event_name: str
    user_id: str
    session_id: str
    timestamp: datetime
    product_id: Optional[int] = None
    product_category: Optional[str] = None
    search_query: Optional[str] = None
    device_type: Optional[str] = None
    experiment_assignment: Optional[str] = None
    properties_json: Optional[str] = None
    is_synthetic: bool

    class Config:
        from_attributes = True

class MetricDefinitionOut(BaseModel):
    id: int
    name: str
    metric_code: str
    category: str
    calculation_formula: str
    target_value: Optional[float] = None
    unit: str
    owner: str

    class Config:
        from_attributes = True

class FeatureKPICreate(BaseModel):
    feature_name: str
    business_problem: str
    objective: str
    primary_kpi: str
    secondary_kpis_json: Optional[str] = None
    baseline_value: float
    target_value: float
    actual_value: float
    measurement_period: str = "Last 30 Days"
    success_status: str = "On Track"

class FeatureKPIOut(FeatureKPICreate):
    id: int
    class Config:
        from_attributes = True

class FunnelStep(BaseModel):
    step_number: int
    step_name: str
    event_name: str
    unique_users: int
    total_events: int
    conversion_from_previous_percent: float
    drop_off_from_previous_percent: float
    overall_conversion_percent: float

class FunnelResponse(BaseModel):
    funnel_name: str
    total_starters: int
    total_completers: int
    overall_conversion_rate: float
    steps: List[FunnelStep]
    segment_comparison: Optional[Dict[str, float]] = None
    device_comparison: Optional[Dict[str, float]] = None

class RootCauseFriction(BaseModel):
    stage_name: str
    drop_off_rate: float
    top_drop_off_categories: List[Dict[str, Any]]
    top_drop_off_devices: List[Dict[str, Any]]
    friction_queries: List[Dict[str, Any]]
    related_feedback: List[str]
    root_cause_hypothesis: str
    recommended_product_action: str

class CohortRow(BaseModel):
    cohort_period: str
    cohort_size: int
    retention_rates: List[float] # [100.0, 34.2, 28.5, 24.1, ...]

class CohortMatrixResponse(BaseModel):
    period_type: str # weekly, monthly
    cohorts: List[CohortRow]

class RFMSegment(BaseModel):
    segment_name: str
    customer_count: int
    percentage: float
    avg_recency_days: float
    avg_frequency_orders: float
    avg_monetary_inr: float
    description: str

class RFMResponse(BaseModel):
    total_customers: int
    segments: List[RFMSegment]
