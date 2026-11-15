from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class StakeholderFeedbackBase(BaseModel):
    title: str
    description: str
    stakeholder_name: str
    team: str
    business_area: str
    feedback_type: str
    priority: str = "Medium"
    customer_impact: Optional[str] = None
    evidence: Optional[str] = None
    owner: str
    status: str = "New"
    resolution_notes: Optional[str] = None
    related_feature_id: Optional[str] = None
    pain_point_id: Optional[int] = None

class StakeholderFeedbackCreate(StakeholderFeedbackBase):
    pass

class StakeholderFeedbackUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    owner: Optional[str] = None
    resolution_notes: Optional[str] = None
    pain_point_id: Optional[int] = None

class StakeholderFeedbackOut(StakeholderFeedbackBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SOPDocumentBase(BaseModel):
    title: str
    category: str
    purpose: str
    scope: str
    owner: str
    preconditions: Optional[str] = None
    step_by_step_json: str
    expected_outcome: str
    review_date: Optional[datetime] = None
    version: str = "v1.0"
    status: str = "Active"

class SOPDocumentCreate(SOPDocumentBase):
    pass

class SOPDocumentUpdate(BaseModel):
    title: Optional[str] = None
    purpose: Optional[str] = None
    scope: Optional[str] = None
    step_by_step_json: Optional[str] = None
    expected_outcome: Optional[str] = None
    version: Optional[str] = None
    status: Optional[str] = None

class SOPDocumentOut(SOPDocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReleaseRecordBase(BaseModel):
    release_name: str
    version: str
    release_owner: str
    features_json: str
    changes_summary: str
    start_date: Optional[datetime] = None
    target_date: datetime
    actual_release_date: Optional[datetime] = None
    qa_status: str = "In QA"
    engineering_status: str = "Code Frozen"
    known_issues_json: Optional[str] = None
    release_notes: Optional[str] = None
    stakeholder_communication: Optional[str] = None
    support_handover: Optional[str] = None
    release_approval_status: str = "Pending Approval"

class ReleaseRecordCreate(ReleaseRecordBase):
    pass

class ReleaseRecordUpdate(BaseModel):
    qa_status: Optional[str] = None
    engineering_status: Optional[str] = None
    release_approval_status: Optional[str] = None
    release_notes: Optional[str] = None
    known_issues_json: Optional[str] = None
    actual_release_date: Optional[datetime] = None

class ReleaseRecordOut(ReleaseRecordBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class KnowledgeArticleBase(BaseModel):
    title: str
    category: str
    tags_json: Optional[str] = None
    content: str
    author: str

class KnowledgeArticleCreate(KnowledgeArticleBase):
    pass

class KnowledgeArticleOut(KnowledgeArticleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LaunchChecklistItemBase(BaseModel):
    item_order: int
    category: str
    item_title: str
    description: Optional[str] = None
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    owner: str
    blocker_flag: bool = False
    blocker_reason: Optional[str] = None
    target_release_date: Optional[datetime] = None

class LaunchChecklistItemUpdate(BaseModel):
    is_completed: Optional[bool] = None
    blocker_flag: Optional[bool] = None
    blocker_reason: Optional[str] = None
    owner: Optional[str] = None

class LaunchChecklistItemOut(LaunchChecklistItemBase):
    id: int

    class Config:
        from_attributes = True

class LaunchReadinessSummary(BaseModel):
    total_items: int
    completed_items: int
    blocked_items: int
    readiness_percentage: float
    overall_status: str # Ready for Launch, At Risk, Blocked
    items_by_category: Dict[str, Dict[str, Any]]
