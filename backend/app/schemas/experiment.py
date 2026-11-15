from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ExperimentVariantBase(BaseModel):
    variant_key: str
    variant_name: str
    description: Optional[str] = None
    traffic_allocation_percent: int = 50

class ExperimentVariantCreate(ExperimentVariantBase):
    pass

class ExperimentVariantOut(ExperimentVariantBase):
    id: int
    experiment_id: int

    class Config:
        from_attributes = True

class ExperimentBase(BaseModel):
    name: str
    code: str
    problem_statement: str
    customer_pain_point: str
    hypothesis: str
    proposed_solution: str
    target_segment: str = "All Users"
    owner: str
    primary_kpi: str
    secondary_kpis_json: Optional[str] = None
    guardrail_metrics_json: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    success_criteria: str
    status: str = "Running"
    traffic_split_percent: int = 50
    is_synthetic: bool = True

class ExperimentCreate(ExperimentBase):
    variants: Optional[List[ExperimentVariantCreate]] = None

class ExperimentOut(ExperimentBase):
    id: int
    created_at: datetime
    variants: List[ExperimentVariantOut] = []

    class Config:
        from_attributes = True

class AssignmentRequest(BaseModel):
    experiment_code: str
    user_id: str

class AssignmentResponse(BaseModel):
    experiment_code: str
    user_id: str
    assigned_variant: str
    traffic_split: str

class VariantStats(BaseModel):
    variant_key: str
    variant_name: str
    sample_size: int
    conversions: int
    conversion_rate: float
    standard_error: float
    ci_lower_95: float
    ci_upper_95: float

class StatisticalAnalysisResponse(BaseModel):
    experiment_id: int
    experiment_name: str
    experiment_code: str
    primary_metric: str
    control: VariantStats
    variant: VariantStats
    absolute_lift: float
    relative_lift_percent: float
    z_score: float
    p_value: float
    is_statistically_significant: bool
    confidence_level_percent: float
    sample_size_adequate: bool
    recommended_sample_size: int
    conclusion: str
    decision: str # Ship Variant, Inconclusive, Iterate / Keep Control
    guardrail_status: Dict[str, str]

class FeatureFlagBase(BaseModel):
    name: str
    key: str
    description: Optional[str] = None
    is_enabled: bool = False
    target_segments_json: Optional[str] = "[]"
    target_variants_json: Optional[str] = "[]"
    rollout_percentage: int = 0

class FeatureFlagCreate(FeatureFlagBase):
    pass

class FeatureFlagUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_enabled: Optional[bool] = None
    target_segments_json: Optional[str] = None
    rollout_percentage: Optional[int] = None

class FeatureFlagOut(FeatureFlagBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UsabilityTestTaskBase(BaseModel):
    title: str
    scenario: str
    target_url: Optional[str] = None
    expected_steps: str
    max_duration_seconds: int = 300

class UsabilityTestTaskCreate(UsabilityTestTaskBase):
    pass

class UsabilityTestResultBase(BaseModel):
    task_id: int
    participant_id: str
    is_completed: bool = True
    time_taken_seconds: int = 95
    errors_count: int = 0
    difficulty_rating: int = 2
    user_comments: Optional[str] = None
    friction_observed: Optional[str] = None
    researcher_notes: Optional[str] = None
    is_synthetic: bool = False

class UsabilityTestResultCreate(UsabilityTestResultBase):
    pass

class UsabilityTestResultOut(UsabilityTestResultBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UsabilityTestTaskOut(UsabilityTestTaskBase):
    id: int
    created_at: datetime
    results: List[UsabilityTestResultOut] = []

    class Config:
        from_attributes = True
