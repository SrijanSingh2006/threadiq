from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from backend.app.database import get_db
from backend.app.models.research import (
    ResearchProject, Interview, Survey, SurveyQuestion, SurveyResponse,
    CustomerPersona, PainPoint, ProblemValidation, JourneyStage
)
from backend.app.schemas.research import (
    ResearchProjectCreate, ResearchProjectOut,
    InterviewCreate, InterviewOut,
    SurveyCreate, SurveyOut, SurveyResponseCreate, SurveyResponseOut,
    PersonaCreate, PersonaOut,
    PainPointCreate, PainPointOut,
    ProblemValidationCreate, ProblemValidationOut,
    JourneyStageOut
)

router = APIRouter(prefix="/research", tags=["Customer Research & Discovery"])

# Projects
@router.get("/projects", response_model=List[ResearchProjectOut])
def get_research_projects(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(ResearchProject)
    if status:
        q = q.filter(ResearchProject.status == status)
    return q.all()

@router.post("/projects", response_model=ResearchProjectOut)
def create_research_project(proj: ResearchProjectCreate, db: Session = Depends(get_db)):
    db_obj = ResearchProject(**proj.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Interviews
@router.get("/interviews", response_model=List[InterviewOut])
def get_interviews(project_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Interview)
    if project_id:
        q = q.filter(Interview.project_id == project_id)
    return q.order_by(Interview.interview_date.desc()).all()

@router.post("/interviews", response_model=InterviewOut)
def create_interview(item: InterviewCreate, db: Session = Depends(get_db)):
    db_obj = Interview(**item.model_dump())
    db_obj.is_synthetic = False # Real user-entered
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Surveys
@router.get("/surveys", response_model=List[SurveyOut])
def get_surveys(db: Session = Depends(get_db)):
    return db.query(Survey).all()

@router.post("/surveys", response_model=SurveyOut)
def create_survey(data: SurveyCreate, db: Session = Depends(get_db)):
    survey = Survey(
        project_id=data.project_id,
        title=data.title,
        description=data.description,
        category=data.category,
        target_segment=data.target_segment,
        status=data.status
    )
    db.add(survey)
    db.commit()
    db.refresh(survey)

    if data.questions:
        for q in data.questions:
            db_q = SurveyQuestion(
                survey_id=survey.id,
                question_text=q.question_text,
                question_type=q.question_type,
                options_json=q.options_json,
                order_idx=q.order_idx
            )
            db.add(db_q)
        db.commit()
        db.refresh(survey)

    return survey

@router.get("/surveys/{survey_id}/responses", response_model=List[SurveyResponseOut])
def get_survey_responses(survey_id: int, db: Session = Depends(get_db)):
    return db.query(SurveyResponse).filter(SurveyResponse.survey_id == survey_id).all()

@router.post("/surveys/responses", response_model=SurveyResponseOut)
def submit_survey_response(resp: SurveyResponseCreate, db: Session = Depends(get_db)):
    db_obj = SurveyResponse(**resp.model_dump())
    db_obj.is_synthetic = False
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Personas
@router.get("/personas", response_model=List[PersonaOut])
def get_personas(db: Session = Depends(get_db)):
    return db.query(CustomerPersona).all()

@router.post("/personas", response_model=PersonaOut)
def create_persona(item: PersonaCreate, db: Session = Depends(get_db)):
    db_obj = CustomerPersona(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Pain Points
@router.get("/pain-points", response_model=List[PainPointOut])
def get_pain_points(
    severity: Optional[str] = None,
    stage: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(PainPoint)
    if severity:
        q = q.filter(PainPoint.severity == severity)
    if stage:
        q = q.filter(PainPoint.journey_stage == stage)
    return q.all()

@router.post("/pain-points", response_model=PainPointOut)
def create_pain_point(item: PainPointCreate, db: Session = Depends(get_db)):
    db_obj = PainPoint(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Problem Validations
@router.get("/validations", response_model=List[ProblemValidationOut])
def get_validations(db: Session = Depends(get_db)):
    return db.query(ProblemValidation).all()

@router.post("/validations", response_model=ProblemValidationOut)
def create_validation(item: ProblemValidationCreate, db: Session = Depends(get_db)):
    db_obj = ProblemValidation(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Customer Journey Stages
@router.get("/journey-map", response_model=List[JourneyStageOut])
def get_journey_map(db: Session = Depends(get_db)):
    return db.query(JourneyStage).order_by(JourneyStage.stage_order.asc()).all()
