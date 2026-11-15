from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class RoadmapInitiative(Base):
    __tablename__ = "roadmap_initiatives"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    objective = Column(Text, nullable=False)
    quarter = Column(String(50), nullable=False) # Q1 2026, Q2 2026, etc.
    status = Column(String(50), default="Planning") # Now, Next, Later / Planning, In Development, Validation, Completed
    priority = Column(String(20), default="P1") # P0, P1, P2
    reach = Column(Integer, default=50000) # Number of users reached
    impact = Column(Float, default=3.0) # 0.25 (minimal), 0.5, 1, 2, 3 (massive)
    confidence = Column(Float, default=0.8) # 0.5 to 1.0 (80%)
    effort = Column(Float, default=2.0) # person-months
    rice_score = Column(Float, default=0.0) # (reach * impact * confidence) / effort
    owner = Column(String(100), nullable=False)
    target_date = Column(DateTime, nullable=True)
    dependencies_json = Column(Text, nullable=True) # JSON list of dependency strings
    created_at = Column(DateTime, default=datetime.utcnow)

    epics = relationship("Epic", back_populates="initiative", cascade="all, delete-orphan")

class Epic(Base):
    __tablename__ = "epics"

    id = Column(Integer, primary_key=True, index=True)
    initiative_id = Column(Integer, ForeignKey("roadmap_initiatives.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="In Progress")
    owner = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    initiative = relationship("RoadmapInitiative", back_populates="epics")
    user_stories = relationship("UserStory", back_populates="epic", cascade="all, delete-orphan")

class Sprint(Base):
    __tablename__ = "sprints"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    sprint_number = Column(Integer, unique=True, nullable=False)
    goal = Column(Text, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="Active") # Planning, Active, Completed
    velocity_points = Column(Integer, default=35)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_stories = relationship("UserStory", back_populates="sprint")

class UserStory(Base):
    __tablename__ = "user_stories"

    id = Column(Integer, primary_key=True, index=True)
    epic_id = Column(Integer, ForeignKey("epics.id", ondelete="SET NULL"), nullable=True)
    sprint_id = Column(Integer, ForeignKey("sprints.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    user_role = Column(String(100), nullable=False) # As a fashion shopper
    user_need = Column(Text, nullable=False) # I want to view accurate real-time size recommendations
    business_value = Column(Text, nullable=False) # So that fit-based return rates decrease by 15%
    acceptance_criteria = Column(Text, nullable=False)
    priority = Column(String(50), default="High") # Critical, High, Medium, Low
    owner = Column(String(100), nullable=False)
    story_points = Column(Integer, default=5)
    dependencies_json = Column(Text, nullable=True)
    status = Column(String(50), default="todo") # backlog, todo, in_progress, in_review, qa, blocked, done
    kanban_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    epic = relationship("Epic", back_populates="user_stories")
    sprint = relationship("Sprint", back_populates="user_stories")
    tasks = relationship("DeliveryTask", back_populates="story", cascade="all, delete-orphan")

class DeliveryTask(Base):
    __tablename__ = "delivery_tasks"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("user_stories.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    assigned_to = Column(String(100), nullable=False)
    team = Column(String(50), default="Engineering") # Product, Engineering, Design, QA, Operations, Business
    status = Column(String(50), default="todo") # todo, in_progress, done
    due_date = Column(DateTime, nullable=True)
    blocker_flag = Column(Boolean, default=False)
    blocker_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    story = relationship("UserStory", back_populates="tasks")

class RiskBlocker(Base):
    __tablename__ = "risk_blockers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False) # Technical, Dependency, Resource, Timeline, Operational
    severity = Column(String(50), default="Medium") # Critical, High, Medium, Low
    status = Column(String(50), default="Open") # Open, Mitigating, Resolved
    owner = Column(String(100), nullable=False)
    mitigation_plan = Column(Text, nullable=False)
    related_story_id = Column(Integer, ForeignKey("user_stories.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RACIAssignment(Base):
    __tablename__ = "raci_assignments"

    id = Column(Integer, primary_key=True, index=True)
    initiative_name = Column(String(255), nullable=False)
    deliverable = Column(String(255), nullable=False)
    responsible = Column(String(150), nullable=False) # Role/Person who does the work
    accountable = Column(String(150), nullable=False) # PM who approves
    consulted = Column(String(150), nullable=False) # Tech Lead, Design Lead
    informed = Column(String(150), nullable=False) # Ops, Business Stakeholders
