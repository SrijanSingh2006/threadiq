from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional
import random
from datetime import datetime

from backend.app.database import get_db
from backend.app.models.commerce import (
    Product, Category, Brand, Order, OrderItem, ReturnRequest, ExchangeRequest, Customer, Inventory
)
from backend.app.schemas.commerce import (
    ProductOut, CategoryOut, BrandOut, OrderCreate, OrderOut,
    ReturnRequestCreate, ReturnRequestOut, ExchangeRequestCreate, ExchangeRequestOut
)

router = APIRouter(prefix="/storefront", tags=["Fashion Storefront Prototype"])

@router.get("/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("/brands", response_model=List[BrandOut])
def get_brands(db: Session = Depends(get_db)):
    return db.query(Brand).all()

@router.get("/products", response_model=List[ProductOut])
def get_products(
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "popular", # popular, price_asc, price_desc, rating
    limit: int = Query(50, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    q = db.query(Product).filter(Product.is_active == True)

    if category_id:
        q = q.filter(Product.category_id == category_id)
    if brand_id:
        q = q.filter(Product.brand_id == brand_id)
    if search:
        search_term = f"%{search}%"
        q = q.filter(or_(Product.name.ilike(search_term), Product.description.ilike(search_term)))
    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)

    if sort_by == "price_asc":
        q = q.order_by(asc(Product.price))
    elif sort_by == "price_desc":
        q = q.order_by(desc(Product.price))
    elif sort_by == "rating":
        q = q.order_by(desc(Product.rating))
    else:
        q = q.order_by(desc(Product.review_count))

    return q.offset(offset).limit(limit).all()

@router.get("/products/{product_id}", response_model=ProductOut)
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@router.get("/products/{product_id}/recommendations", response_model=List[ProductOut])
def get_product_recommendations(product_id: int, db: Session = Depends(get_db)):
    target = db.query(Product).filter(Product.id == product_id).first()
    if not target:
        return []
    # Similar products from same category or brand
    return (
        db.query(Product)
        .filter(Product.id != product_id, Product.category_id == target.category_id)
        .limit(4)
        .all()
    )

@router.post("/checkout", response_model=OrderOut)
def simulate_checkout(order_data: OrderCreate, db: Session = Depends(get_db)):
    """
    Simulates complete e-commerce checkout.
    Persists real Order and OrderItem records without charging actual cards.
    """
    customer_id = order_data.customer_id
    if not customer_id:
        # Pick or create a customer
        cust = db.query(Customer).first()
        customer_id = cust.id if cust else 1

    total_amount = sum(item.unit_price * item.quantity for item in order_data.items)
    discount_amount = round(total_amount * 0.10, 2) # Demo 10% promo
    final_amount = round(total_amount - discount_amount, 2)
    order_num = f"ORD-2026-{random.randint(200000, 999999)}"

    new_order = Order(
        order_number=order_num,
        customer_id=customer_id,
        total_amount=total_amount,
        discount_amount=discount_amount,
        final_amount=final_amount,
        status="processing",
        payment_method=order_data.payment_method,
        shipping_address=order_data.shipping_address,
        tracking_number=f"TRK-DELH-{random.randint(100000, 999999)}",
        is_synthetic=True
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order_data.items:
        db_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            size=item.size,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=round(item.unit_price * item.quantity, 2)
        )
        db.add(db_item)

    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/orders/{order_number}", response_model=OrderOut)
def track_order(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/returns", response_model=ReturnRequestOut)
def request_return(ret: ReturnRequestCreate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == ret.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_obj = ReturnRequest(
        order_id=ret.order_id,
        order_item_id=ret.order_item_id,
        return_reason=ret.return_reason,
        product_condition=ret.product_condition,
        refund_amount=ret.refund_amount,
        resolution_notes=ret.resolution_notes or "Return pickup scheduled via simulated logistics API.",
        is_synthetic=False
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.post("/exchanges", response_model=ExchangeRequestOut)
def request_exchange(ex: ExchangeRequestCreate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == ex.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_obj = ExchangeRequest(
        order_id=ex.order_id,
        order_item_id=ex.order_item_id,
        requested_size=ex.requested_size,
        exchange_reason=ex.exchange_reason,
        resolution_notes=ex.resolution_notes or "Doorstep 1-click replacement initiated.",
        is_synthetic=False
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
