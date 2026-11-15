from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    objective = Column(Text, nullable=False)
    research_type = Column(String(100), nullable=False) # Customer interviews, Customer surveys, Usability studies, Competitor research, Market research, Product feedback analysis
    business_area = Column(String(100), nullable=False) # Storefront Discovery, Size & Fit, Checkout & Payments, Returns & Exchanges, Post-Purchase
    target_customer_segment = Column(String(100), nullable=False) # Gen Z Shoppers, Bargain Hunters, Premium Fashion Enthusiasts, First-time Buyers
    owner = Column(String(100), nullable=False)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="In Progress") # Planning, In Progress, Synthesizing, Completed, Archived
    research_questions = Column(Text, nullable=True)
    success_criteria = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    interviews = relationship("Interview", back_populates="project", cascade="all, delete-orphan")
    surveys = relationship("Survey", back_populates="project", cascade="all, delete-orphan")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id", ondelete="CASCADE"), nullable=True)
    participant_id = Column(String(100), nullable=False) # e.g., USR-CUST-8491
    customer_segment = Column(String(100), nullable=False)
    interview_date = Column(DateTime, default=datetime.utcnow)
    objective = Column(Text, nullable=False)
    questions_json = Column(Text, nullable=True) # JSON string of questions asked
    responses_json = Column(Text, nullable=True) # JSON string of user answers
    observations = Column(Text, nullable=True)
    pain_points = Column(Text, nullable=True)
    opportunities = Column(Text, nullable=True)
    researcher_notes = Column(Text, nullable=True)
    evidence_reference = Column(String(255), nullable=True) # Audio/video link, recording ref
    is_synthetic = Column(Boolean, default=True) # Clearly marked demo vs user-entered
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ResearchProject", back_populates="interviews")

class Survey(Base):
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    target_segment = Column(String(100), nullable=False)
    status = Column(String(50), default="Active") # Draft, Active, Closed
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ResearchProject", back_populates="surveys")
    questions = relationship("SurveyQuestion", back_populates="survey", cascade="all, delete-orphan")
    responses = relationship("SurveyResponse", back_populates="survey", cascade="all, delete-orphan")

class SurveyQuestion(Base):
    __tablename__ = "survey_questions"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=False) # multiple_choice, rating, text, yes_no
    options_json = Column(Text, nullable=True) # JSON list of options for multiple choice
    order_idx = Column(Integer, default=0)

    survey = relationship("Survey", back_populates="questions")

class SurveyResponse(Base):
    __tablename__ = "survey_responses"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id", ondelete="CASCADE"), nullable=False)
    participant_id = Column(String(100), nullable=False)
    responses_json = Column(Text, nullable=False) # JSON dict of {question_id: answer}
    submitted_at = Column(DateTime, default=datetime.utcnow)
    is_synthetic = Column(Boolean, default=True)

    survey = relationship("Survey", back_populates="responses")

class CustomerPersona(Base):
    __tablename__ = "customer_personas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    tagline = Column(String(255), nullable=True)
    age_range = Column(String(50), nullable=False)
    customer_segment = Column(String(100), nullable=False)
    shopping_frequency = Column(String(100), nullable=False)
    preferred_categories = Column(String(255), nullable=False)
    shopping_motivation = Column(Text, nullable=False)
    spending_preference = Column(String(100), nullable=False) # Budget, Value-seeking, Premium, Trend-focused
    purchase_behaviour = Column(Text, nullable=False)
    common_frustrations = Column(Text, nullable=False)
    preferred_discovery_methods = Column(String(255), nullable=False) # Visual Search, Reels/Influencer, Filters, Brand Search
    return_behaviour = Column(Text, nullable=False)
    customer_goals = Column(Text, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PainPoint(Base):
    __tablename__ = "pain_points"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    customer_segment = Column(String(100), nullable=False)
    journey_stage = Column(String(100), nullable=False) # Search, PLP, PDP, Size Selection, Cart, Checkout, Delivery, Returns
    supporting_feedback = Column(Text, nullable=True)
    supporting_records_count = Column(Integer, default=1)
    severity = Column(String(50), default="Medium") # Critical, High, Medium, Low
    frequency = Column(String(50), default="Frequent") # Daily, Frequent, Occasional, Rare
    customer_impact = Column(Integer, default=3) # 1 to 5 scale
    business_impact = Column(Integer, default=3) # 1 to 5 scale
    status = Column(String(50), default="Under Investigation") # Discovered, Under Investigation, Validating, Prioritized, In Roadmap, Resolved
    proposed_opportunity = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    validations = relationship("ProblemValidation", back_populates="pain_point", cascade="all, delete-orphan")

class ProblemValidation(Base):
    __tablename__ = "problem_validations"

    id = Column(Integer, primary_key=True, index=True)
    pain_point_id = Column(Integer, ForeignKey("pain_points.id", ondelete="CASCADE"), nullable=False)
    hypothesis = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    research_source = Column(String(255), nullable=False)
    validation_method = Column(String(100), nullable=False) # Usability Lab, Survey Analysis, A/B Prototype, Data Telemetry, User Interviews
    test_participants_count = Column(Integer, default=0)
    observed_behaviour = Column(Text, nullable=True)
    validation_outcome = Column(String(50), default="Inconclusive") # Validated, Invalidated, Inconclusive
    confidence_level = Column(String(50), default="Medium") # High, Medium, Low
    follow_up_questions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    pain_point = relationship("PainPoint", back_populates="validations")

class JourneyStage(Base):
    __tablename__ = "journey_stages"

    id = Column(Integer, primary_key=True, index=True)
    stage_order = Column(Integer, nullable=False)
    stage_name = Column(String(100), nullable=False)
    customer_activity = Column(Text, nullable=False)
    customer_expectation = Column(Text, nullable=False)
    customer_emotion = Column(String(50), nullable=False) # Excited, Hopeful, Confused, Frustrated, Delighted, Anxious
    friction_point = Column(Text, nullable=False)
    supporting_evidence = Column(Text, nullable=True)
    drop_off_possibility = Column(Float, default=0.0) # Percentage e.g. 24.5%
    opportunity = Column(Text, nullable=False)
    related_kpi = Column(String(100), nullable=False)
    proposed_improvement = Column(Text, nullable=False)
