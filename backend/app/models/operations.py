from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from datetime import datetime
from backend.app.database import Base

class StakeholderFeedback(Base):
    __tablename__ = "stakeholder_feedback"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    stakeholder_name = Column(String(100), nullable=False)
    team = Column(String(100), nullable=False) # Merchandising, Marketing, Customer Support, Logistics, Category Management, Leadership
    business_area = Column(String(100), nullable=False)
    feedback_type = Column(String(100), nullable=False) # Friction report, Feature request, Policy suggestion, Quality concern
    priority = Column(String(50), default="Medium") # Urgent, High, Medium, Low
    customer_impact = Column(String(100), nullable=True)
    evidence = Column(Text, nullable=True)
    owner = Column(String(100), nullable=False)
    status = Column(String(50), default="New") # New, Under Review, Converted to Pain Point, Roadmapped, Resolved
    resolution_notes = Column(Text, nullable=True)
    related_feature_id = Column(String(100), nullable=True)
    pain_point_id = Column(Integer, ForeignKey("pain_points.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SOPDocument(Base):
    __tablename__ = "sop_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # Catalogue Quality, Feedback Handling, Release Management, QA Signoff, Incident Escalation, Analytics Review, Launch Readiness
    purpose = Column(Text, nullable=False)
    scope = Column(Text, nullable=False)
    owner = Column(String(100), nullable=False)
    preconditions = Column(Text, nullable=True)
    step_by_step_json = Column(Text, nullable=False) # JSON array of step descriptions
    expected_outcome = Column(Text, nullable=False)
    review_date = Column(DateTime, nullable=True)
    version = Column(String(20), default="v1.0")
    status = Column(String(50), default="Active") # Active, Draft, Review Required, Deprecated
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ReleaseRecord(Base):
    __tablename__ = "release_records"

    id = Column(Integer, primary_key=True, index=True)
    release_name = Column(String(255), nullable=False)
    version = Column(String(50), unique=True, nullable=False) # e.g. v2.4.0
    release_owner = Column(String(100), nullable=False)
    features_json = Column(Text, nullable=False) # JSON list of features included
    changes_summary = Column(Text, nullable=False)
    start_date = Column(DateTime, nullable=True)
    target_date = Column(DateTime, nullable=False)
    actual_release_date = Column(DateTime, nullable=True)
    qa_status = Column(String(50), default="In QA") # Pending, In QA, QA Approved, QA Blocked
    engineering_status = Column(String(50), default="Code Frozen") # In Development, Code Frozen, Staging Deployed, Production Deployed
    known_issues_json = Column(Text, nullable=True) # JSON list of known issues
    release_notes = Column(Text, nullable=True)
    stakeholder_communication = Column(Text, nullable=True)
    support_handover = Column(Text, nullable=True)
    release_approval_status = Column(String(50), default="Pending Approval") # Pending Approval, Approved, Blocked, Deployed
    created_at = Column(DateTime, default=datetime.utcnow)

class KnowledgeArticle(Base):
    __tablename__ = "knowledge_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # Product Spec, Architecture, FAQ, Runbook, Data Dictionary, Post-Mortem
    tags_json = Column(Text, nullable=True) # JSON list of tags
    content = Column(Text, nullable=False)
    author = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LaunchChecklistItem(Base):
    __tablename__ = "launch_checklist_items"

    id = Column(Integer, primary_key=True, index=True)
    item_order = Column(Integer, nullable=False)
    category = Column(String(100), nullable=False) # Product, Design, Engineering, QA, Operations, Support, Legal & Compliance
    item_title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    owner = Column(String(100), nullable=False)
    blocker_flag = Column(Boolean, default=False)
    blocker_reason = Column(Text, nullable=True)
    target_release_date = Column(DateTime, nullable=True)
