from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io
import pandas as pd
from typing import Dict, Any, List

from backend.app.database import get_db
from backend.app.services.export_service import (
    generate_complete_system_export,
    generate_tableau_fact_events,
    generate_tableau_fact_orders,
    generate_tableau_dim_products,
    generate_tableau_dim_customers,
    export_to_csv_string
)

router = APIRouter(prefix="/reports", tags=["Reports & Analytical Data Exports"])

REPORT_CATALOG = [
    {"id": "customer_research", "title": "Customer Research Synthesis Report", "category": "Discovery", "format": "CSV/XLSX"},
    {"id": "market_research", "title": "Market Trends & Price Positioning Report", "category": "Market Intelligence", "format": "CSV/XLSX"},
    {"id": "competitor_matrix", "title": "Competitor Feature Comparison Report", "category": "Market Intelligence", "format": "CSV/XLSX"},
    {"id": "pain_points", "title": "Customer Pain Points & Friction Index", "category": "Problem Discovery", "format": "CSV/XLSX"},
    {"id": "product_analytics", "title": "Product Telemetry & Daily Active Metrics", "category": "Analytics", "format": "CSV/XLSX"},
    {"id": "funnel_analysis", "title": "Conversion Funnel & Drop-Off Report", "category": "Analytics", "format": "CSV/XLSX"},
    {"id": "cohort_retention", "title": "Cohort Retention Matrix Report", "category": "Analytics", "format": "CSV/XLSX"},
    {"id": "experiment_results", "title": "A/B Experimentation & Statistical Report", "category": "Validation", "format": "CSV/XLSX"},
    {"id": "usability_testing", "title": "Prototype Usability Testing Report", "category": "Validation", "format": "CSV/XLSX"},
    {"id": "product_operations", "title": "Stakeholder Feedback & Operational Triage", "category": "Operations", "format": "CSV/XLSX"},
    {"id": "release_management", "title": "Product Release Manifest & Notes Report", "category": "Operations", "format": "CSV/XLSX"},
    {"id": "sprint_delivery", "title": "Agile Sprint Burndown & Velocity Report", "category": "Program Management", "format": "CSV/XLSX"},
    {"id": "launch_readiness", "title": "Executive Launch Readiness Checklist Report", "category": "Program Management", "format": "CSV/XLSX"},
    {"id": "inventory_aging", "title": "Supply Chain Inventory Aging & Low Stock Report", "category": "Supply Chain", "format": "CSV/XLSX"},
    {"id": "order_fulfilment", "title": "Fulfilment Cycle Times & Delivery SLA Report", "category": "Supply Chain", "format": "CSV/XLSX"},
    {"id": "returns_exchanges", "title": "Returns Root Cause & Exchange Velocity Report", "category": "Supply Chain", "format": "CSV/XLSX"}
]

@router.get("/catalog")
def get_report_catalog():
    return REPORT_CATALOG

@router.get("/export/excel")
def download_complete_excel_workbook(db: Session = Depends(get_db)):
    """
    Exports a multi-sheet Microsoft Excel XLSX executive report
    containing clean fact and dimension tables across all 16 domains.
    """
    excel_bytes = generate_complete_system_export(db)
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=ThreadIQ_Executive_Intelligence_Report.xlsx"}
    )

@router.get("/export/csv/{report_id}")
def download_report_csv(report_id: str, db: Session = Depends(get_db)):
    """
    Exports a single targeted CSV dataset for Google Sheets or Tableau import.
    """
    if report_id in ["product_analytics", "funnel_analysis"]:
        df = generate_tableau_fact_events(db, limit=2000)
    elif report_id in ["order_fulfilment", "returns_exchanges"]:
        df = generate_tableau_fact_orders(db, limit=1000)
    elif report_id == "inventory_aging":
        df = generate_tableau_dim_products(db)
    else:
        df = generate_tableau_dim_customers(db)

    csv_data = df.to_csv(index=False)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=ThreadIQ_{report_id}.csv"}
    )

@router.get("/tableau/meta")
def get_tableau_integration_spec():
    """
    Provides Tableau connection instructions and dimensional schema guide.
    """
    return {
        "database_type": "PostgreSQL / SQLite Compatible",
        "connection_host": "localhost:5432 (or direct CSV star-schema export)",
        "star_schema": {
            "fact_tables": ["Fact_Product_Events", "Fact_Orders", "Fact_Returns"],
            "dimension_tables": ["Dim_Products", "Dim_Customers", "Dim_Date"]
        },
        "instructions": "In Tableau Desktop, choose 'PostgreSQL' as your data source, connect to the ThreadIQ database, and join Fact_Product_Events to Dim_Products on product_id."
    }
