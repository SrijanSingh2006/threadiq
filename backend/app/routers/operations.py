from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from backend.app.database import get_db
from backend.app.models.operations import (
    StakeholderFeedback, SOPDocument, ReleaseRecord, KnowledgeArticle, LaunchChecklistItem
)
from backend.app.models.research import PainPoint
from backend.app.schemas.operations import (
    StakeholderFeedbackCreate, StakeholderFeedbackUpdate, StakeholderFeedbackOut,
    SOPDocumentCreate, SOPDocumentUpdate, SOPDocumentOut,
    ReleaseRecordCreate, ReleaseRecordUpdate, ReleaseRecordOut,
    KnowledgeArticleCreate, KnowledgeArticleOut,
    LaunchChecklistItemUpdate, LaunchChecklistItemOut, LaunchReadinessSummary
)

router = APIRouter(prefix="/operations", tags=["Product Operations Centre"])

# Stakeholder Feedback
@router.get("/feedback", response_model=List[StakeholderFeedbackOut])
def get_stakeholder_feedback(team: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(StakeholderFeedback)
    if team:
        q = q.filter(StakeholderFeedback.team == team)
    if status:
        q = q.filter(StakeholderFeedback.status == status)
    return q.order_by(StakeholderFeedback.created_at.desc()).all()

@router.post("/feedback", response_model=StakeholderFeedbackOut)
def submit_stakeholder_feedback(fb: StakeholderFeedbackCreate, db: Session = Depends(get_db)):
    db_obj = StakeholderFeedback(**fb.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/feedback/{feedback_id}", response_model=StakeholderFeedbackOut)
def update_feedback(feedback_id: int, item: StakeholderFeedbackUpdate, db: Session = Depends(get_db)):
    fb = db.query(StakeholderFeedback).filter(StakeholderFeedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    for k, v in item.model_dump(exclude_unset=True).items():
        setattr(fb, k, v)
    
    db.commit()
    db.refresh(fb)
    return fb

@router.post("/feedback/{feedback_id}/convert-to-pain-point")
def convert_feedback_to_pain_point(feedback_id: int, db: Session = Depends(get_db)):
    fb = db.query(StakeholderFeedback).filter(StakeholderFeedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    new_pain_point = PainPoint(
        title=fb.title,
        description=fb.description,
        customer_segment=f"Reported by {fb.team}",
        journey_stage="Storefront Discovery",
        supporting_feedback=f"Feedback #{fb.id} from {fb.stakeholder_name} ({fb.team}): {fb.evidence or ''}",
        supporting_records_count=1,
        severity="High" if fb.priority in ["Urgent", "High"] else "Medium",
        frequency="Frequent",
        status="Under Investigation",
        proposed_opportunity="Investigate resolution via customer research interview cohort"
    )
    db.add(new_pain_point)
    db.commit()
    db.refresh(new_pain_point)

    fb.status = "Converted to Pain Point"
    fb.pain_point_id = new_pain_point.id
    db.commit()

    return {"status": "success", "pain_point_id": new_pain_point.id}

# SOPs
@router.get("/sops", response_model=List[SOPDocumentOut])
def get_sops(category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(SOPDocument)
    if category:
        q = q.filter(SOPDocument.category == category)
    return q.all()

@router.post("/sops", response_model=SOPDocumentOut)
def create_sop(item: SOPDocumentCreate, db: Session = Depends(get_db)):
    db_obj = SOPDocument(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/sops/{sop_id}", response_model=SOPDocumentOut)
def update_sop(sop_id: int, item: SOPDocumentUpdate, db: Session = Depends(get_db)):
    sop = db.query(SOPDocument).filter(SOPDocument.id == sop_id).first()
    if not sop:
        raise HTTPException(status_code=404, detail="SOP not found")
    for k, v in item.model_dump(exclude_unset=True).items():
        setattr(sop, k, v)
    db.commit()
    db.refresh(sop)
    return sop

# Releases
@router.get("/releases", response_model=List[ReleaseRecordOut])
def get_releases(db: Session = Depends(get_db)):
    return db.query(ReleaseRecord).order_by(ReleaseRecord.target_date.desc()).all()

@router.post("/releases", response_model=ReleaseRecordOut)
def create_release(item: ReleaseRecordCreate, db: Session = Depends(get_db)):
    db_obj = ReleaseRecord(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/releases/{release_id}", response_model=ReleaseRecordOut)
def update_release(release_id: int, item: ReleaseRecordUpdate, db: Session = Depends(get_db)):
    rel = db.query(ReleaseRecord).filter(ReleaseRecord.id == release_id).first()
    if not rel:
        raise HTTPException(status_code=404, detail="Release record not found")
    for k, v in item.model_dump(exclude_unset=True).items():
        setattr(rel, k, v)
    db.commit()
    db.refresh(rel)
    return rel

# Knowledge Base
@router.get("/knowledge", response_model=List[KnowledgeArticleOut])
def get_knowledge_articles(category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(KnowledgeArticle)
    if category:
        q = q.filter(KnowledgeArticle.category == category)
    return q.all()

@router.post("/knowledge", response_model=KnowledgeArticleOut)
def create_knowledge_article(item: KnowledgeArticleCreate, db: Session = Depends(get_db)):
    db_obj = KnowledgeArticle(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Launch Readiness Checklist
@router.get("/launch-readiness", response_model=List[LaunchChecklistItemOut])
def get_launch_checklist(db: Session = Depends(get_db)):
    return db.query(LaunchChecklistItem).order_by(LaunchChecklistItem.item_order.asc()).all()

@router.get("/launch-readiness/summary", response_model=LaunchReadinessSummary)
def get_launch_readiness_summary(db: Session = Depends(get_db)):
    items = db.query(LaunchChecklistItem).all()
    total = len(items)
    completed = sum(1 for i in items if i.is_completed)
    blocked = sum(1 for i in items if i.blocker_flag)
    pct = round((completed / total * 100.0), 1) if total > 0 else 0.0

    status = "Ready for Launch" if pct >= 90.0 and blocked == 0 else ("Blocked" if blocked > 0 else "In Progress")

    by_cat = {}
    for i in items:
        if i.category not in by_cat:
            by_cat[i.category] = {"total": 0, "completed": 0, "blocked": 0}
        by_cat[i.category]["total"] += 1
        if i.is_completed:
            by_cat[i.category]["completed"] += 1
        if i.blocker_flag:
            by_cat[i.category]["blocked"] += 1

    return {
        "total_items": total,
        "completed_items": completed,
        "blocked_items": blocked,
        "readiness_percentage": pct,
        "overall_status": status,
        "items_by_category": by_cat
    }

@router.put("/launch-readiness/{item_id}", response_model=LaunchChecklistItemOut)
def update_checklist_item(item_id: int, update: LaunchChecklistItemUpdate, db: Session = Depends(get_db)):
    item = db.query(LaunchChecklistItem).filter(LaunchChecklistItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    
    if update.is_completed is not None:
        item.is_completed = update.is_completed
        item.completed_at = datetime.utcnow() if update.is_completed else None
    if update.blocker_flag is not None:
        item.blocker_flag = update.blocker_flag
    if update.blocker_reason is not None:
        item.blocker_reason = update.blocker_reason
    if update.owner is not None:
        item.owner = update.owner

    db.commit()
    db.refresh(item)
    return item
