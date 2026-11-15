from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class BrandOut(BaseModel):
    id: int
    name: str
    slug: str
    tier: str
    description: Optional[str] = None
    logo_url: Optional[str] = None

    class Config:
        from_attributes = True

class InventoryOut(BaseModel):
    id: int
    product_id: int
    size: str
    current_stock: int
    reserved_stock: int
    reorder_threshold: int
    aging_days: int
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    sku: str
    brand_id: int
    category_id: int
    supplier_id: Optional[int] = None
    description: str
    price: float
    discount_percent: float = 0.0
    rating: float = 4.2
    review_count: int = 40
    hero_image: str
    images_json: Optional[str] = None
    available_sizes_json: str
    colors_json: Optional[str] = None
    return_policy: str = "14 days hassle-free return"
    delivery_estimate_days: int = 3
    catalogue_completeness: float = 95.0
    is_active: bool = True
    is_synthetic: bool = True

class ProductCreate(ProductBase):
    pass

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    brand: Optional[BrandOut] = None
    category: Optional[CategoryOut] = None
    inventory_items: List[InventoryOut] = []

    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    product_id: int
    size: str
    quantity: int = 1
    unit_price: float

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    size: str
    quantity: int
    unit_price: float
    total_price: float
    product: Optional[ProductOut] = None

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    shipping_address: str
    payment_method: str = "UPI - Simulated"
    items: List[OrderItemCreate]

class OrderOut(BaseModel):
    id: int
    order_number: str
    customer_id: int
    total_amount: float
    discount_amount: float
    final_amount: float
    status: str
    payment_method: str
    shipping_address: Optional[str] = None
    tracking_number: Optional[str] = None
    created_at: datetime
    delivered_at: Optional[datetime] = None
    is_synthetic: bool
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True

class ReturnRequestCreate(BaseModel):
    order_id: int
    order_item_id: int
    return_reason: str
    product_condition: str = "Tags Attached / Unused"
    refund_amount: float
    resolution_notes: Optional[str] = None

class ReturnRequestOut(BaseModel):
    id: int
    order_id: int
    order_item_id: int
    return_reason: str
    product_condition: str
    request_date: datetime
    status: str
    refund_amount: float
    resolution_notes: Optional[str] = None
    is_synthetic: bool

    class Config:
        from_attributes = True

class ExchangeRequestCreate(BaseModel):
    order_id: int
    order_item_id: int
    requested_size: str
    exchange_reason: str
    resolution_notes: Optional[str] = None

class ExchangeRequestOut(BaseModel):
    id: int
    order_id: int
    order_item_id: int
    requested_size: str
    exchange_reason: str
    status: str
    request_date: datetime
    resolution_notes: Optional[str] = None
    is_synthetic: bool

    class Config:
        from_attributes = True

class SupplierOut(BaseModel):
    id: int
    name: str
    contact_email: Optional[str] = None
    lead_time_days: int
    rating: float
    status: str

    class Config:
        from_attributes = True

class ProcurementOut(BaseModel):
    id: int
    po_number: str
    supplier_id: int
    product_id: int
    quantity: int
    unit_cost: float
    total_cost: float
    order_date: datetime
    expected_delivery_date: Optional[datetime] = None
    received_date: Optional[datetime] = None
    status: str
    is_synthetic: bool

    class Config:
        from_attributes = True
