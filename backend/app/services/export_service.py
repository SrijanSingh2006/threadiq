import io
import csv
from typing import List, Dict, Any
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.models.analytics import ProductEvent
from backend.app.models.commerce import Product, Customer, Order, OrderItem, ReturnRequest, Inventory
from backend.app.models.research import PainPoint, Interview, ResearchProject
from backend.app.models.experiment import Experiment
from backend.app.models.delivery import UserStory, RoadmapInitiative, RACIAssignment
from backend.app.models.operations import LaunchChecklistItem, SOPDocument

def export_to_csv_string(data: List[Dict[str, Any]], fieldnames: List[str]) -> str:
    """Utility to export list of dictionaries to CSV string."""
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
    writer.writeheader()
    for row in data:
        writer.writerow(row)
    return output.getvalue()

def export_to_excel_bytes(sheets: Dict[str, pd.DataFrame]) -> bytes:
    """Exports multiple DataFrames into a single multi-sheet Excel XLSX buffer."""
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        for sheet_name, df in sheets.items():
            # Truncate sheet names to 31 chars as per Excel limit
            clean_name = sheet_name[:31]
            df.to_excel(writer, sheet_name=clean_name, index=False)
    return output.getvalue()

def generate_tableau_fact_events(db: Session, limit: int = 5000) -> pd.DataFrame:
    """Generates clean Fact_Product_Events star-schema table for Tableau."""
    events = (
        db.query(ProductEvent)
        .order_by(ProductEvent.timestamp.desc())
        .limit(limit)
        .all()
    )
    rows = []
    for e in events:
        rows.append({
            "event_id": e.id,
            "event_name": e.event_name,
            "user_id": e.user_id,
            "session_id": e.session_id,
            "timestamp": e.timestamp.strftime("%Y-%m-%d %H:%M:%S") if e.timestamp else "",
            "date": e.timestamp.strftime("%Y-%m-%d") if e.timestamp else "",
            "product_id": e.product_id or "",
            "product_category": e.product_category or "None",
            "search_query": e.search_query or "",
            "device_type": e.device_type or "unknown",
            "experiment_assignment": e.experiment_assignment or "none",
            "is_synthetic": 1 if e.is_synthetic else 0
        })
    return pd.DataFrame(rows)

def generate_tableau_fact_orders(db: Session, limit: int = 2000) -> pd.DataFrame:
    """Generates clean Fact_Orders table for Tableau."""
    orders = db.query(Order).limit(limit).all()
    rows = []
    for o in orders:
        cust = o.customer
        rows.append({
            "order_id": o.id,
            "order_number": o.order_number,
            "customer_id": o.customer_id,
            "customer_segment": cust.segment if cust else "Unknown",
            "city": cust.city if cust else "Bengaluru",
            "total_amount": o.total_amount,
            "discount_amount": o.discount_amount,
            "final_amount": o.final_amount,
            "order_status": o.status,
            "payment_method": o.payment_method,
            "order_date": o.created_at.strftime("%Y-%m-%d %H:%M:%S") if o.created_at else "",
            "order_day": o.created_at.strftime("%Y-%m-%d") if o.created_at else "",
            "is_synthetic": 1 if o.is_synthetic else 0
        })
    return pd.DataFrame(rows)

def generate_tableau_dim_products(db: Session) -> pd.DataFrame:
    """Generates clean Dim_Products dimension table for Tableau."""
    products = db.query(Product).all()
    rows = []
    for p in products:
        rows.append({
            "product_id": p.id,
            "sku": p.sku,
            "product_name": p.name,
            "brand_name": p.brand.name if p.brand else "Unknown",
            "brand_tier": p.brand.tier if p.brand else "Mid-Range",
            "category_name": p.category.name if p.category else "Unknown",
            "price_inr": p.price,
            "discount_percent": p.discount_percent,
            "effective_price": round(p.price * (1.0 - p.discount_percent / 100.0), 2),
            "customer_rating": p.rating,
            "review_count": p.review_count,
            "catalogue_completeness_pct": p.catalogue_completeness,
            "is_active": 1 if p.is_active else 0
        })
    return pd.DataFrame(rows)

def generate_tableau_dim_customers(db: Session) -> pd.DataFrame:
    """Generates clean Dim_Customers dimension table for Tableau."""
    customers = db.query(Customer).limit(2500).all()
    rows = []
    for c in customers:
        rows.append({
            "customer_id": c.id,
            "customer_code": c.customer_id,
            "customer_name": c.full_name,
            "segment": c.segment,
            "city": c.city,
            "total_orders": c.total_orders,
            "rfm_recency_days": c.rfm_recency,
            "rfm_frequency": c.rfm_frequency,
            "rfm_monetary_spend": c.rfm_monetary,
            "joined_date": c.created_at.strftime("%Y-%m-%d") if c.created_at else ""
        })
    return pd.DataFrame(rows)

def generate_complete_system_export(db: Session) -> bytes:
    """Compiles all operational and analytics data into an executive workbook."""
    sheets = {
        "Fact_Product_Events": generate_tableau_fact_events(db, limit=2000),
        "Fact_Orders": generate_tableau_fact_orders(db, limit=1000),
        "Dim_Products": generate_tableau_dim_products(db),
        "Dim_Customers": generate_tableau_dim_customers(db),
        "Pain_Points": pd.DataFrame([
            {"id": p.id, "title": p.title, "segment": p.customer_segment, "stage": p.journey_stage,
             "severity": p.severity, "impact": p.business_impact, "status": p.status}
            for p in db.query(PainPoint).all()
        ]),
        "User_Stories": pd.DataFrame([
            {"id": s.id, "title": s.title, "priority": s.priority, "points": s.story_points,
             "status": s.status, "owner": s.owner}
            for s in db.query(UserStory).all()
        ]),
        "Launch_Checklist": pd.DataFrame([
            {"order": i.item_order, "category": i.category, "item": i.item_title,
             "completed": i.is_completed, "owner": i.owner, "blocker": i.blocker_flag}
            for i in db.query(LaunchChecklistItem).all()
        ])
    }
    return export_to_excel_bytes(sheets)
