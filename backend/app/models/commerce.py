from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)

    products = relationship("Product", back_populates="category")

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True)
    tier = Column(String(50), default="Mid-Range") # Fast Fashion, Premium, Luxury, Athleisure, D2C
    description = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)

    products = relationship("Product", back_populates="brand")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    contact_email = Column(String(150), nullable=True)
    lead_time_days = Column(Integer, default=7)
    rating = Column(Float, default=4.5)
    status = Column(String(50), default="Active")

    products = relationship("Product", back_populates="supplier")
    procurements = relationship("ProcurementRecord", back_populates="supplier")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="RESTRICT"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    discount_percent = Column(Float, default=0.0)
    rating = Column(Float, default=4.2)
    review_count = Column(Integer, default=45)
    hero_image = Column(String(500), nullable=False)
    images_json = Column(Text, nullable=True) # JSON list of extra image URLs
    available_sizes_json = Column(Text, nullable=False) # JSON list e.g. ["XS", "S", "M", "L", "XL"]
    colors_json = Column(Text, nullable=True) # JSON list e.g. ["Black", "Navy Blue"]
    return_policy = Column(String(100), default="14 days hassle-free return")
    delivery_estimate_days = Column(Integer, default=3)
    catalogue_completeness = Column(Float, default=95.0) # Percentage score of attributes filled
    is_active = Column(Boolean, default=True)
    is_synthetic = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    brand = relationship("Brand", back_populates="products")
    category = relationship("Category", back_populates="products")
    supplier = relationship("Supplier", back_populates="products")
    inventory_items = relationship("Inventory", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    size = Column(String(20), nullable=False)
    current_stock = Column(Integer, default=25)
    reserved_stock = Column(Integer, default=0)
    reorder_threshold = Column(Integer, default=10)
    aging_days = Column(Integer, default=15)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="inventory_items")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(100), unique=True, index=True, nullable=False) # USR-XXXX
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    segment = Column(String(100), default="Regular Shopper") # Gen Z Trendsetter, Value Seeker, Premium Wardrobe, Occasional
    city = Column(String(100), default="Bengaluru")
    total_orders = Column(Integer, default=1)
    rfm_recency = Column(Integer, default=12) # Days since last purchase
    rfm_frequency = Column(Integer, default=3) # Orders count
    rfm_monetary = Column(Float, default=4500.0) # Total lifetime spend INR
    is_synthetic = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    orders = relationship("Order", back_populates="customer")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(100), unique=True, index=True, nullable=False) # ORD-XXXXXX
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    total_amount = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    final_amount = Column(Float, nullable=False)
    status = Column(String(50), default="processing") # processing, dispatched, in_transit, delivered, cancelled
    payment_method = Column(String(50), default="UPI - Simulated")
    shipping_address = Column(Text, nullable=True)
    tracking_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    delivered_at = Column(DateTime, nullable=True)
    is_synthetic = Column(Boolean, default=True)

    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    size = Column(String(20), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
    return_requests = relationship("ReturnRequest", back_populates="order_item")
    exchange_requests = relationship("ExchangeRequest", back_populates="order_item")

class ReturnRequest(Base):
    __tablename__ = "return_requests"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    order_item_id = Column(Integer, ForeignKey("order_items.id", ondelete="CASCADE"), nullable=False)
    return_reason = Column(String(255), nullable=False) # Size too large, Size too small, Fabric quality, Defective, Disliked color/style
    product_condition = Column(String(100), default="Tags Attached / Unused")
    request_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="Requested") # Requested, Inspection Pending, Approved, Refund Initiated, Completed, Rejected
    refund_amount = Column(Float, nullable=False)
    resolution_notes = Column(Text, nullable=True)
    is_synthetic = Column(Boolean, default=True)

    order_item = relationship("OrderItem", back_populates="return_requests")

class ExchangeRequest(Base):
    __tablename__ = "exchange_requests"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    order_item_id = Column(Integer, ForeignKey("order_items.id", ondelete="CASCADE"), nullable=False)
    requested_size = Column(String(20), nullable=False)
    exchange_reason = Column(String(255), nullable=False) # Size Exchange, Color Exchange
    status = Column(String(50), default="Requested") # Requested, Approved, Replacement Dispatched, Completed, Rejected
    request_date = Column(DateTime, default=datetime.utcnow)
    resolution_notes = Column(Text, nullable=True)
    is_synthetic = Column(Boolean, default=True)

    order_item = relationship("OrderItem", back_populates="exchange_requests")

class ProcurementRecord(Base):
    __tablename__ = "procurement_records"

    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String(100), unique=True, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_cost = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow)
    expected_delivery_date = Column(DateTime, nullable=True)
    received_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="Pending") # Ordered, In Production, In Transit, Received, Delayed
    is_synthetic = Column(Boolean, default=True)

    supplier = relationship("Supplier", back_populates="procurements")

class Promotion(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    discount_type = Column(String(50), default="percentage") # percentage, flat
    discount_value = Column(Float, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    campaign_name = Column(String(150), nullable=False)
    target_category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="Active")
