from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(100), unique=True, index=True, nullable=False) # EXP-FIT-GUIDE-001
    problem_statement = Column(Text, nullable=False)
    customer_pain_point = Column(Text, nullable=False)
    hypothesis = Column(Text, nullable=False)
    proposed_solution = Column(Text, nullable=False)
    target_segment = Column(String(100), default="All Users")
    owner = Column(String(100), nullable=False)
    primary_kpi = Column(String(100), nullable=False) # e.g. Add-to-cart conversion rate
    secondary_kpis_json = Column(Text, nullable=True) # e.g. ["Size guide engagement", "PDP return rate"]
    guardrail_metrics_json = Column(Text, nullable=True) # e.g. ["Cart abandonment rate < 35%", "Latency < 200ms"]
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    success_criteria = Column(Text, nullable=False) # e.g. Minimum +5% relative lift in ATC with p < 0.05
    status = Column(String(50), default="Running") # Draft, Running, Concluded, Paused
    traffic_split_percent = Column(Integer, default=50) # 50/50 split
    is_synthetic = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    variants = relationship("ExperimentVariant", back_populates="experiment", cascade="all, delete-orphan")
    assignments = relationship("ExperimentAssignment", back_populates="experiment", cascade="all, delete-orphan")

class ExperimentVariant(Base):
    __tablename__ = "experiment_variants"

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False)
    variant_key = Column(String(50), nullable=False) # control, variant_a, variant_b
    variant_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    traffic_allocation_percent = Column(Integer, default=50)

    experiment = relationship("Experiment", back_populates="variants")

class ExperimentAssignment(Base):
    __tablename__ = "experiment_assignments"

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(100), nullable=False, index=True)
    variant_key = Column(String(50), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_exp_user_unique", "experiment_id", "user_id", unique=True),
    )

    experiment = relationship("Experiment", back_populates="assignments")

class FeatureFlag(Base):
    __tablename__ = "feature_flags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    key = Column(String(100), unique=True, index=True, nullable=False) # e.g. enable_smart_size_predictor
    description = Column(Text, nullable=True)
    is_enabled = Column(Boolean, default=False)
    target_segments_json = Column(Text, default="[]") # JSON list of segments e.g. ["Gen Z", "Tier 2"]
    target_variants_json = Column(Text, default="[]")
    rollout_percentage = Column(Integer, default=0) # 0 to 100
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UsabilityTestTask(Base):
    __tablename__ = "usability_test_tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    scenario = Column(Text, nullable=False)
    target_url = Column(String(255), nullable=True)
    expected_steps = Column(Text, nullable=False)
    max_duration_seconds = Column(Integer, default=300)
    created_at = Column(DateTime, default=datetime.utcnow)

    results = relationship("UsabilityTestResult", back_populates="task", cascade="all, delete-orphan")

class UsabilityTestResult(Base):
    __tablename__ = "usability_test_results"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("usability_test_tasks.id", ondelete="CASCADE"), nullable=False)
    participant_id = Column(String(100), nullable=False)
    is_completed = Column(Boolean, default=True)
    time_taken_seconds = Column(Integer, default=95)
    errors_count = Column(Integer, default=0)
    difficulty_rating = Column(Integer, default=2) # 1 (very easy) to 5 (very difficult)
    user_comments = Column(Text, nullable=True)
    friction_observed = Column(Text, nullable=True)
    researcher_notes = Column(Text, nullable=True)
    is_synthetic = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("UsabilityTestTask", back_populates="results")
