from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any

from backend.app.database import get_db
from backend.app.models.commerce import Product, Order, ReturnRequest, Customer
from backend.app.models.experiment import Experiment
from backend.app.models.research import PainPoint, ResearchProject
from backend.app.models.delivery import Sprint, UserStory, RiskBlocker
from backend.app.models.operations import LaunchChecklistItem
from backend.app.models.analytics import ProductEvent

router = APIRouter(prefix="/overview", tags=["Executive PM Cockpit"])

@router.get("/metrics")
def get_executive_overview_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Returns aggregated real-time executive PM metrics for the central Cockpit.
    """
    total_products = db.query(Product).count()
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()
    total_returns = db.query(ReturnRequest).count()

    return_rate = round((total_returns / total_orders * 100.0), 1) if total_orders > 0 else 0.0

    # Funnel calculations
    homepage_visits = db.query(func.count(ProductEvent.id)).filter(ProductEvent.event_name == "homepage_viewed").scalar() or 1
    purchases = db.query(func.count(ProductEvent.id)).filter(ProductEvent.event_name == "purchase_completed").scalar() or 0
    atc_count = db.query(func.count(ProductEvent.id)).filter(ProductEvent.event_name == "added_to_cart").scalar() or 0
    checkout_count = db.query(func.count(ProductEvent.id)).filter(ProductEvent.event_name == "checkout_started").scalar() or 0

    purchase_conversion_rate = round((purchases / homepage_visits * 100.0), 2)
    cart_abandonment_rate = round(((atc_count - checkout_count) / max(atc_count, 1) * 100.0), 1)

    # Launch readiness
    total_checklist = db.query(LaunchChecklistItem).count()
    completed_checklist = db.query(LaunchChecklistItem).filter(LaunchChecklistItem.is_completed == True).count()
    blocked_items = db.query(LaunchChecklistItem).filter(LaunchChecklistItem.blocker_flag == True).count()
    launch_readiness_pct = round((completed_checklist / total_checklist * 100.0), 1) if total_checklist > 0 else 0.0

    # Active Experiments
    active_experiments = db.query(Experiment).filter(Experiment.status == "Running").count()

    # Pain points
    critical_pain_points = db.query(PainPoint).filter(PainPoint.severity == "Critical").count()
    total_pain_points = db.query(PainPoint).count()

    # Active Sprint
    active_sprint = db.query(Sprint).filter(Sprint.status == "Active").first()
    sprint_stories = db.query(UserStory).filter(UserStory.sprint_id == active_sprint.id).all() if active_sprint else []
    total_points = sum(s.story_points for s in sprint_stories)
    completed_points = sum(s.story_points for s in sprint_stories if s.status == "done")
    sprint_completion_pct = round((completed_points / max(total_points, 1) * 100.0), 1)

    # Alerts & Attention Items
    alerts = [
        {
            "id": 1,
            "type": "warning",
            "title": "Reverse Logistics Contract SLA Blocker",
            "message": "Courier Partner contract in North Zone pending signature, holding Doorstep Instant Exchange release candidate.",
            "link": "/launch-readiness"
        },
        {
            "id": 2,
            "type": "info",
            "title": "A/B Experiment EXP-FIT-GUIDE-001 Nearing Significance",
            "message": "Variant B demonstrates +6.2% relative lift in Add-to-Cart with 92% confidence. Recommended 3 more days of traffic.",
            "link": "/experimentation"
        },
        {
            "id": 3,
            "type": "critical",
            "title": "Sizing Uncertainty Dominates Returns",
            "message": "48% of return requests cite incorrect fit across ethnic apparel. Smart Size Recommender priority confirmed.",
            "link": "/customer-research"
        }
    ]

    return {
        "kpis": {
            "total_products": total_products,
            "total_customers": total_customers,
            "total_orders": total_orders,
            "return_rate_percent": return_rate,
            "purchase_conversion_rate": purchase_conversion_rate,
            "cart_abandonment_rate": cart_abandonment_rate,
            "launch_readiness_percent": launch_readiness_pct,
            "active_experiments_count": active_experiments,
            "critical_pain_points_count": critical_pain_points,
            "total_pain_points_count": total_pain_points,
            "active_sprint_name": active_sprint.name if active_sprint else "Sprint 42",
            "sprint_completion_percent": sprint_completion_pct,
            "sprint_points_completed": f"{completed_points} / {total_points}"
        },
        "alerts": alerts,
        "is_synthetic": True,
        "environment": "Enterprise Production Sandbox"
    }
