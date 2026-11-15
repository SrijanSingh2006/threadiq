from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class RoadmapInitiativeBase(BaseModel):
    title: str
    objective: str
    quarter: str
    status: str = "Planning"
    priority: str = "P1"
    reach: int = 50000
    impact: float = 3.0
    confidence: float = 0.8
    effort: float = 2.0
    rice_score: Optional[float] = None
    owner: str
    target_date: Optional[datetime] = None
    dependencies_json: Optional[str] = None

class RoadmapInitiativeCreate(RoadmapInitiativeBase):
    pass

class RoadmapInitiativeUpdate(BaseModel):
    title: Optional[str] = None
    objective: Optional[str] = None
    quarter: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    reach: Optional[int] = None
    impact: Optional[float] = None
    confidence: Optional[float] = None
    effort: Optional[float] = None
    rice_score: Optional[float] = None
    owner: Optional[str] = None

class RoadmapInitiativeOut(RoadmapInitiativeBase):
    id: int
    rice_score: float
    created_at: datetime

    class Config:
        from_attributes = True

class EpicBase(BaseModel):
    initiative_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    status: str = "In Progress"
    owner: str

class EpicCreate(EpicBase):
    pass

class EpicOut(EpicBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SprintBase(BaseModel):
    name: str
    sprint_number: int
    goal: str
    start_date: datetime
    end_date: datetime
    status: str = "Active"
    velocity_points: int = 35

class SprintCreate(SprintBase):
    pass

class SprintOut(SprintBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DeliveryTaskBase(BaseModel):
    story_id: int
    title: str
    assigned_to: str
    team: str = "Engineering"
    status: str = "todo"
    due_date: Optional[datetime] = None
    blocker_flag: bool = False
    blocker_notes: Optional[str] = None

class DeliveryTaskCreate(DeliveryTaskBase):
    pass

class DeliveryTaskOut(DeliveryTaskBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserStoryBase(BaseModel):
    epic_id: Optional[int] = None
    sprint_id: Optional[int] = None
    title: str
    user_role: str
    user_need: str
    business_value: str
    acceptance_criteria: str
    priority: str = "High"
    owner: str
    story_points: int = 5
    dependencies_json: Optional[str] = None
    status: str = "todo" # backlog, todo, in_progress, in_review, qa, blocked, done
    kanban_order: int = 0

class UserStoryCreate(UserStoryBase):
    pass

class UserStoryUpdate(BaseModel):
    title: Optional[str] = None
    user_role: Optional[str] = None
    user_need: Optional[str] = None
    business_value: Optional[str] = None
    acceptance_criteria: Optional[str] = None
    priority: Optional[str] = None
    owner: Optional[str] = None
    story_points: Optional[int] = None
    status: Optional[str] = None
    sprint_id: Optional[int] = None
    epic_id: Optional[int] = None
    kanban_order: Optional[int] = None

class KanbanMoveRequest(BaseModel):
    story_id: int
    new_status: str
    new_order: Optional[int] = 0

class UserStoryOut(UserStoryBase):
    id: int
    created_at: datetime
    tasks: List[DeliveryTaskOut] = []

    class Config:
        from_attributes = True

class RiskBlockerBase(BaseModel):
    title: str
    category: str
    severity: str = "Medium"
    status: str = "Open"
    owner: str
    mitigation_plan: str
    related_story_id: Optional[int] = None

class RiskBlockerCreate(RiskBlockerBase):
    pass

class RiskBlockerUpdate(BaseModel):
    severity: Optional[str] = None
    status: Optional[str] = None
    owner: Optional[str] = None
    mitigation_plan: Optional[str] = None

class RiskBlockerOut(RiskBlockerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RACIAssignmentBase(BaseModel):
    initiative_name: str
    deliverable: str
    responsible: str
    accountable: str
    consulted: str
    informed: str

class RACIAssignmentCreate(RACIAssignmentBase):
    pass

class RACIAssignmentOut(RACIAssignmentBase):
    id: int
    class Config:
        from_attributes = True

class BurndownDay(BaseModel):
    day: str
    ideal_remaining_points: float
    actual_remaining_points: float

class SprintBurndownResponse(BaseModel):
    sprint_id: int
    sprint_name: str
    total_committed_points: int
    completed_points: int
    remaining_points: int
    days: List[BurndownDay]
