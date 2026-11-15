from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Dict, Any, List

from backend.app.database import get_db
from backend.app.models.commerce import (
    Supplier, ProcurementRecord, Product, Inventory, Order, ReturnRequest, ExchangeRequest, Promotion
)

router = APIRouter(prefix="/supply-chain", tags=["Supply Chain Intelligence (Inbound & Outbound)"])

@router.get("/metrics")
def get_supply_chain_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Computes comprehensive Inbound and Outbound operational KPIs.
    """
    # 1. Inbound Intelligence
    suppliers = db.query(Supplier).all()
    avg_supplier_lead_time = round(sum(s.lead_time_days for s in suppliers) / max(len(suppliers), 1), 1)
    
    # Catalogue completeness
    avg_completeness = db.query(func.avg(Product.catalogue_completeness)).scalar() or 95.0
    
    # 2. Outbound Intelligence: Inventory & Stockouts
    total_inventory_units = db.query(func.sum(Inventory.current_stock)).scalar() or 0
    low_stock_count = db.query(func.count(Inventory.id)).filter(Inventory.current_stock <= Inventory.reorder_threshold).scalar() or 0
    out_of_stock_count = db.query(func.count(Inventory.id)).filter(Inventory.current_stock == 0).scalar() or 0
    
    # Inventory aging distribution (> 30 days)
    aged_inventory_items = db.query(func.count(Inventory.id)).filter(Inventory.aging_days > 30).scalar() or 0

    # 3. Fulfilment & Delivery SLAs
    total_orders = db.query(func.count(Order.id)).scalar() or 1
    delivered_orders = db.query(func.count(Order.id)).filter(Order.status == "delivered").scalar() or 0
    delayed_orders = db.query(func.count(Order.id)).filter(Order.status == "processing").scalar() or 0
    on_time_delivery_rate = round((delivered_orders / total_orders * 100.0), 1)

    # 4. Post-Order: Return and Exchange Rates
    total_returns = db.query(func.count(ReturnRequest.id)).scalar() or 0
    total_exchanges = db.query(func.count(ExchangeRequest.id)).scalar() or 0
    return_rate = round((total_returns / total_orders * 100.0), 1)
    exchange_rate = round((total_exchanges / total_orders * 100.0), 1)

    # Top Return Reasons
    reason_counts = (
        db.query(ReturnRequest.return_reason, func.count(ReturnRequest.id))
        .group_by(ReturnRequest.return_reason)
        .order_by(desc(func.count(ReturnRequest.id)))
        .limit(5)
        .all()
    )
    return_reasons_breakdown = [
        {"reason": r[0], "count": r[1], "percentage": round(r[1] / max(total_returns, 1) * 100.0, 1)}
        for r in reason_counts
    ]

    return {
        "inbound": {
            "active_suppliers_count": len(suppliers),
            "average_lead_time_days": avg_supplier_lead_time,
            "catalogue_completeness_percent": round(float(avg_completeness), 1),
            "vendor_sla_compliance_percent": 94.2
        },
        "outbound": {
            "total_stock_units": total_inventory_units,
            "low_stock_skus_count": low_stock_count,
            "out_of_stock_skus_count": out_of_stock_count,
            "aged_inventory_units_gt30d": aged_inventory_items,
            "on_time_delivery_rate_percent": on_time_delivery_rate,
            "average_fulfilment_cycle_hours": 32.4
        },
        "post_order": {
            "total_return_requests": total_returns,
            "total_exchange_requests": total_exchanges,
            "return_rate_percent": return_rate,
            "exchange_rate_percent": exchange_rate,
            "top_return_reasons": return_reasons_breakdown
        },
        "is_synthetic": True
    }

@router.get("/inventory/low-stock")
def get_low_stock_inventory(db: Session = Depends(get_db)):
    items = (
        db.query(Inventory)
        .filter(Inventory.current_stock <= Inventory.reorder_threshold)
        .limit(20)
        .all()
    )
    return [
        {
            "id": i.id,
            "product_id": i.product_id,
            "product_name": i.product.name if i.product else "Unknown",
            "sku": i.product.sku if i.product else "Unknown",
            "brand": i.product.brand.name if i.product and i.product.brand else "Unknown",
            "size": i.size,
            "current_stock": i.current_stock,
            "reorder_threshold": i.reorder_threshold,
            "aging_days": i.aging_days
        }
        for i in items
    ]
