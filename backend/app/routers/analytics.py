from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from backend.app.database import get_db
from backend.app.models.analytics import ProductEvent, MetricDefinition, FeatureKPI
from backend.app.schemas.analytics import (
    ProductEventCreate, ProductEventOut,
    FunnelResponse, RootCauseFriction,
    CohortMatrixResponse, RFMResponse,
    MetricDefinitionOut, FeatureKPICreate, FeatureKPIOut
)
from backend.app.services.analytics_engine import (
    compute_conversion_funnel,
    analyze_root_cause_friction,
    compute_cohort_matrix,
    compute_rfm_segmentation
)

router = APIRouter(prefix="/analytics", tags=["Product Event Analytics Engine"])

@router.post("/events", response_model=ProductEventOut)
def record_product_event(event_data: ProductEventCreate, db: Session = Depends(get_db)):
    """
    First-party event ingestion endpoint.
    Receives all real-time user storefront interactions and stores them in PostgreSQL/SQLite.
    """
    db_obj = ProductEvent(
        event_name=event_data.event_name,
        user_id=event_data.user_id,
        session_id=event_data.session_id,
        timestamp=datetime.utcnow(),
        product_id=event_data.product_id,
        product_category=event_data.product_category,
        search_query=event_data.search_query,
        device_type=event_data.device_type,
        experiment_assignment=event_data.experiment_assignment,
        properties_json=event_data.properties_json,
        is_synthetic=event_data.is_synthetic
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/events", response_model=List[ProductEventOut])
def get_recent_events(limit: int = 50, db: Session = Depends(get_db)):
    return (
        db.query(ProductEvent)
        .order_by(ProductEvent.timestamp.desc())
        .limit(limit)
        .all()
    )

@router.get("/funnel", response_model=FunnelResponse)
def get_conversion_funnel(
    segment: Optional[str] = None,
    device: Optional[str] = "all",
    db: Session = Depends(get_db)
):
    """
    Calculates step-by-step conversion funnel from stored product events.
    """
    return compute_conversion_funnel(db, segment_filter=segment, device_filter=device)

@router.get("/root-cause", response_model=RootCauseFriction)
def get_root_cause_investigation(
    stage_name: str = "Added to Cart -> Checkout Started",
    db: Session = Depends(get_db)
):
    """
    Performs root-cause friction analysis for a specified funnel drop-off stage.
    """
    return analyze_root_cause_friction(db, stage_name=stage_name)

@router.get("/cohorts", response_model=CohortMatrixResponse)
def get_cohort_retention(db: Session = Depends(get_db)):
    return compute_cohort_matrix(db)

@router.get("/rfm", response_model=RFMResponse)
def get_rfm_customer_segments(db: Session = Depends(get_db)):
    return compute_rfm_segmentation(db)

@router.get("/metrics", response_model=List[MetricDefinitionOut])
def get_metric_definitions(db: Session = Depends(get_db)):
    return db.query(MetricDefinition).all()

@router.get("/feature-kpis", response_model=List[FeatureKPIOut])
def get_feature_kpis(db: Session = Depends(get_db)):
    return db.query(FeatureKPI).all()

@router.post("/feature-kpis", response_model=FeatureKPIOut)
def create_feature_kpi(item: FeatureKPICreate, db: Session = Depends(get_db)):
    db_obj = FeatureKPI(**item.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
