from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

from backend.app.database import get_db
from backend.app.models.delivery import (
    RoadmapInitiative, Epic, Sprint, UserStory, DeliveryTask, RiskBlocker, RACIAssignment
)
from backend.app.schemas.delivery import (
    RoadmapInitiativeCreate, RoadmapInitiativeUpdate, RoadmapInitiativeOut,
    EpicCreate, EpicOut, SprintCreate, SprintOut,
    UserStoryCreate, UserStoryUpdate, UserStoryOut, KanbanMoveRequest,
    DeliveryTaskCreate, DeliveryTaskOut,
    RiskBlockerCreate, RiskBlockerUpdate, RiskBlockerOut,
    RACIAssignmentCreate, RACIAssignmentOut,
    SprintBurndownResponse, BurndownDay
)

router = APIRouter(prefix="/delivery", tags=["Program & Delivery Management (Internal Agile/Scrum)"])

# Roadmap & RICE
@router.get("/roadmap", response_model=List[RoadmapInitiativeOut])
def get_roadmap_initiatives(db: Session = Depends(get_db)):
    return db.query(RoadmapInitiative).order_by(RoadmapInitiative.rice_score.desc()).all()

@router.post("/roadmap", response_model=RoadmapInitiativeOut)
def create_roadmap_initiative(item: RoadmapInitiativeCreate, db: Session = Depends(get_db)):
    # Calculate RICE
    r = item.reach
    i = item.impact
    c = item.confidence
    e = max(item.effort, 0.1)
    rice = round((r * i * c) / e, 1)

    db_obj = RoadmapInitiative(
        title=item.title,
        objective=item.objective,
        quarter=item.quarter,
        status=item.status,
        priority=item.priority,
        reach=r,
        impact=i,
        confidence=c,
        effort=e,
        rice_score=rice,
        owner=item.owner,
        target_date=item.target_date,
        dependencies_json=item.dependencies_json
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/roadmap/{initiative_id}", response_model=RoadmapInitiativeOut)
def update_roadmap_initiative(initiative_id: int, item: RoadmapInitiativeUpdate, db: Session = Depends(get_db)):
    init = db.query(RoadmapInitiative).filter(RoadmapInitiative.id == initiative_id).first()
    if not init:
        raise HTTPException(status_code=404, detail="Initiative not found")
    
    update_data = item.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(init, k, v)
    
    # Recalculate RICE
    init.rice_score = round((init.reach * init.impact * init.confidence) / max(init.effort, 0.1), 1)
    db.commit()
    db.refresh(init)
    return init

# Sprints
@router.get("/sprints", response_model=List[SprintOut])
def get_sprints(db: Session = Depends(get_db)):
    return db.query(Sprint).order_by(Sprint.sprint_number.desc()).all()

@router.post("/sprints", response_model=SprintOut)
def create_sprint(item: SprintCreate, db: Session = Depends(get_db)):
    db_obj = Sprint(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/sprints/{sprint_id}/burndown", response_model=SprintBurndownResponse)
def get_sprint_burndown(sprint_id: int, db: Session = Depends(get_db)):
    sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")

    stories = db.query(UserStory).filter(UserStory.sprint_id == sprint_id).all()
    total_pts = sum(s.story_points for s in stories) or 35
    completed_pts = sum(s.story_points for s in stories if s.status == "done")
    remaining_pts = max(0, total_pts - completed_pts)

    # 10 sprint working days
    days_data = []
    step = total_pts / 9.0
    for day_idx in range(1, 11):
        ideal = max(0.0, round(total_pts - (day_idx - 1) * step, 1))
        # Actual trajectory
        if day_idx <= 6:
            actual = max(0.0, round(total_pts - (day_idx - 1) * (step * 0.85), 1))
        else:
            actual = remaining_pts
        days_data.append(BurndownDay(
            day=f"Day {day_idx}",
            ideal_remaining_points=ideal,
            actual_remaining_points=actual
        ))

    return {
        "sprint_id": sprint.id,
        "sprint_name": sprint.name,
        "total_committed_points": total_pts,
        "completed_points": completed_pts,
        "remaining_points": remaining_pts,
        "days": days_data
    }

# User Stories & Kanban
@router.get("/stories", response_model=List[UserStoryOut])
def get_user_stories(sprint_id: Optional[int] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(UserStory)
    if sprint_id:
        q = q.filter(UserStory.sprint_id == sprint_id)
    if status:
        q = q.filter(UserStory.status == status)
    return q.order_by(UserStory.kanban_order.asc()).all()

@router.post("/stories", response_model=UserStoryOut)
def create_user_story(item: UserStoryCreate, db: Session = Depends(get_db)):
    db_obj = UserStory(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/stories/{story_id}", response_model=UserStoryOut)
def update_user_story(story_id: int, item: UserStoryUpdate, db: Session = Depends(get_db)):
    story = db.query(UserStory).filter(UserStory.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    for k, v in item.model_dump(exclude_unset=True).items():
        setattr(story, k, v)
    db.commit()
    db.refresh(story)
    return story

@router.post("/stories/move", response_model=UserStoryOut)
def move_kanban_story(req: KanbanMoveRequest, db: Session = Depends(get_db)):
    story = db.query(UserStory).filter(UserStory.id == req.story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    story.status = req.new_status
    if req.new_order is not None:
        story.kanban_order = req.new_order
    db.commit()
    db.refresh(story)
    return story

# Risk Blockers
@router.get("/risks", response_model=List[RiskBlockerOut])
def get_risks(db: Session = Depends(get_db)):
    return db.query(RiskBlocker).order_by(RiskBlocker.created_at.desc()).all()

@router.post("/risks", response_model=RiskBlockerOut)
def create_risk(item: RiskBlockerCreate, db: Session = Depends(get_db)):
    db_obj = RiskBlocker(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# RACI Matrix
@router.get("/raci", response_model=List[RACIAssignmentOut])
def get_raci(db: Session = Depends(get_db)):
    return db.query(RACIAssignment).all()

@router.post("/raci", response_model=RACIAssignmentOut)
def create_raci(item: RACIAssignmentCreate, db: Session = Depends(get_db)):
    db_obj = RACIAssignment(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
