from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ResearchProjectBase(BaseModel):
    name: str
    objective: str
    research_type: str
    business_area: str
    target_customer_segment: str
    owner: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str = "In Progress"
    research_questions: Optional[str] = None
    success_criteria: Optional[str] = None

class ResearchProjectCreate(ResearchProjectBase):
    pass

class ResearchProjectOut(ResearchProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class InterviewBase(BaseModel):
    project_id: Optional[int] = None
    participant_id: str
    customer_segment: str
    interview_date: Optional[datetime] = None
    objective: str
    questions_json: Optional[str] = None
    responses_json: Optional[str] = None
    observations: Optional[str] = None
    pain_points: Optional[str] = None
    opportunities: Optional[str] = None
    researcher_notes: Optional[str] = None
    evidence_reference: Optional[str] = None
    is_synthetic: bool = False

class InterviewCreate(InterviewBase):
    pass

class InterviewOut(InterviewBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SurveyQuestionBase(BaseModel):
    question_text: str
    question_type: str
    options_json: Optional[str] = None
    order_idx: int = 0

class SurveyQuestionOut(SurveyQuestionBase):
    id: int
    class Config:
        from_attributes = True

class SurveyBase(BaseModel):
    project_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    category: str
    target_segment: str
    status: str = "Active"

class SurveyCreate(SurveyBase):
    questions: Optional[List[SurveyQuestionBase]] = []

class SurveyOut(SurveyBase):
    id: int
    created_at: datetime
    questions: List[SurveyQuestionOut] = []

    class Config:
        from_attributes = True

class SurveyResponseCreate(BaseModel):
    survey_id: int
    participant_id: str
    responses_json: str
    is_synthetic: bool = False

class SurveyResponseOut(BaseModel):
    id: int
    survey_id: int
    participant_id: str
    responses_json: str
    submitted_at: datetime
    is_synthetic: bool

    class Config:
        from_attributes = True

class PersonaBase(BaseModel):
    name: str
    tagline: Optional[str] = None
    age_range: str
    customer_segment: str
    shopping_frequency: str
    preferred_categories: str
    shopping_motivation: str
    spending_preference: str
    purchase_behaviour: str
    common_frustrations: str
    preferred_discovery_methods: str
    return_behaviour: str
    customer_goals: str
    avatar_url: Optional[str] = None

class PersonaCreate(PersonaBase):
    pass

class PersonaOut(PersonaBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PainPointBase(BaseModel):
    title: str
    description: str
    customer_segment: str
    journey_stage: str
    supporting_feedback: Optional[str] = None
    supporting_records_count: int = 1
    severity: str = "Medium"
    frequency: str = "Frequent"
    customer_impact: int = 3
    business_impact: int = 3
    status: str = "Under Investigation"
    proposed_opportunity: Optional[str] = None

class PainPointCreate(PainPointBase):
    pass

class PainPointOut(PainPointBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProblemValidationBase(BaseModel):
    pain_point_id: int
    hypothesis: str
    evidence: str
    research_source: str
    validation_method: str
    test_participants_count: int = 0
    observed_behaviour: Optional[str] = None
    validation_outcome: str = "Inconclusive"
    confidence_level: str = "Medium"
    follow_up_questions: Optional[str] = None

class ProblemValidationCreate(ProblemValidationBase):
    pass

class ProblemValidationOut(ProblemValidationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class JourneyStageOut(BaseModel):
    id: int
    stage_order: int
    stage_name: str
    customer_activity: str
    customer_expectation: str
    customer_emotion: str
    friction_point: str
    supporting_evidence: Optional[str] = None
    drop_off_possibility: float
    opportunity: str
    related_kpi: str
    proposed_improvement: str

    class Config:
        from_attributes = True
