import random
from datetime import datetime, timedelta
import json
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.database import Base, engine
from backend.app.models.auth import User
from backend.app.models.commerce import (
    Category, Brand, Supplier, Product, Inventory, Customer, Order, OrderItem,
    ReturnRequest, ExchangeRequest, ProcurementRecord, Promotion
)
from backend.app.models.analytics import ProductEvent, MetricDefinition, FeatureKPI, DailyMetric
from backend.app.models.research import (
    ResearchProject, Interview, Survey, SurveyQuestion, SurveyResponse,
    CustomerPersona, PainPoint, ProblemValidation, JourneyStage
)
from backend.app.models.market import MarketResearch, Competitor, CompetitorFeature, MarketOpportunity
from backend.app.models.experiment import (
    Experiment, ExperimentVariant, ExperimentAssignment, FeatureFlag,
    UsabilityTestTask, UsabilityTestResult
)
from backend.app.models.operations import (
    StakeholderFeedback, SOPDocument, ReleaseRecord, KnowledgeArticle, LaunchChecklistItem
)
from backend.app.models.delivery import (
    RoadmapInitiative, Epic, Sprint, UserStory, DeliveryTask, RiskBlocker, RACIAssignment
)

# High-resolution Unsplash fashion images
FASHION_IMAGES = {
    "ethnic": [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
    ],
    "western": [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
    ],
    "shirts": [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80"
    ],
    "denim": [
        "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    ],
    "dresses": [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
    ],
    "active": [
        "https://images.unsplash.com/photo-1483721074574-e3f4e2f9d6c7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    ],
    "footwear": [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    "winter": [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
    ],
    "accessories": [
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    "loungewear": [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80"
    ]
}

def seed_database(db: Session, force_reset: bool = False):
    """
    Seeds comprehensive synthetic fashion-commerce dataset into SQLite/Postgres.
    Includes 100 products, 10 categories, 10 brands, 5,000 customers, 20,000 analytics events,
    2,000 orders, research projects, personas, pain points, experiments, sprints, and SOPs.
    """
    if force_reset:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    else:
        # Check if already seeded
        if db.query(Product).count() >= 100:
            return {"status": "already_seeded", "products": db.query(Product).count()}

    Base.metadata.create_all(bind=engine)

    # 1. Users & Roles
    users_data = [
        User(email="pm@threadiq.internal", hashed_password="pbkdf2_sha256$260000$demo$hash", full_name="Aarav Sharma", role="Product Manager"),
        User(email="analyst@threadiq.internal", hashed_password="pbkdf2_sha256$260000$demo$hash", full_name="Diya Patel", role="Product Analyst"),
        User(email="researcher@threadiq.internal", hashed_password="pbkdf2_sha256$260000$demo$hash", full_name="Kabir Sen", role="UX Researcher"),
        User(email="designer@threadiq.internal", hashed_password="pbkdf2_sha256$260000$demo$hash", full_name="Ananya Iyer", role="Product Designer"),
        User(email="engineer@threadiq.internal", hashed_password="pbkdf2_sha256$260000$demo$hash", full_name="Rohan Verma", role="Engineer"),
        User(email="qa@threadiq.internal", hashed_password="pbkdf2_sha256$260000$demo$hash", full_name="Meera Nair", role="QA"),
        User(email="ops@threadiq.internal", hashed_password="pbkdf2_sha256$260000$demo$hash", full_name="Vikram Rao", role="Operations"),
        User(email="admin@threadiq.internal", hashed_password="pbkdf2_sha256$260000$demo$hash", full_name="ThreadIQ System Admin", role="Admin")
    ]
    db.add_all(users_data)
    db.commit()

    # 2. Categories (10)
    cats = [
        ("Ethnic Wear", "ethnic-wear", "Kurtas, Sarees, Lehengas, and Traditional Sets", FASHION_IMAGES["ethnic"][0]),
        ("Western Wear", "western-wear", "Tops, Tees, Blazers, and Contemporary Co-ords", FASHION_IMAGES["western"][0]),
        ("Casual Shirts & Tops", "shirts-tops", "Linen, Oxford, Poplin, and Printed Casuals", FASHION_IMAGES["shirts"][0]),
        ("Denim & Trousers", "denim-trousers", "Slim, Baggy, Flared Jeans and Chinos", FASHION_IMAGES["denim"][0]),
        ("Dresses & Jumpsuits", "dresses-jumpsuits", "Maxi, Midi, Bodycon, and Shirt Dresses", FASHION_IMAGES["dresses"][0]),
        ("Athleisure & Activewear", "athleisure", "Tights, Dry-Fit Tees, Joggers, and Sports Bras", FASHION_IMAGES["active"][0]),
        ("Footwear & Sneakers", "footwear", "Streetwear Sneakers, Loafers, and Flats", FASHION_IMAGES["footwear"][0]),
        ("Winterwear & Jackets", "winterwear", "Sweaters, Bomber Jackets, Hoodies, and Overcoats", FASHION_IMAGES["winter"][0]),
        ("Fashion Accessories", "accessories", "Leather Belts, Watches, Bags, and Sunglasses", FASHION_IMAGES["accessories"][0]),
        ("Loungewear & Sleepwear", "loungewear", "Cotton Pajamas, Robes, and Relaxed Loungers", FASHION_IMAGES["loungewear"][0])
    ]
    cat_objs = [Category(name=c[0], slug=c[1], description=c[2], image_url=c[3]) for c in cats]
    db.add_all(cat_objs)
    db.commit()

    # 3. Brands (10)
    brands = [
        ("Roadster", "roadster", "Fast Fashion", "Contemporary street & outdoor fashion"),
        ("HRX by Hrithik Roshan", "hrx", "Athleisure", "Active performance lifestyle wear"),
        ("Anouk", "anouk", "Ethnic", "Artisanal handcrafted ethnic wear"),
        ("Tokyo Talkies", "tokyo-talkies", "Fast Fashion", "Fast-moving trendy western silhouettes"),
        ("Mango", "mango", "Premium", "Sophisticated Mediterranean chic"),
        ("Mast & Harbour", "mast-harbour", "Mid-Range", "Nautical casuals and smart urban attire"),
        ("W for Woman", "w-for-woman", "Ethnic", "Contemporary ethnic fusion workwear"),
        ("Dressberry", "dressberry", "Fast Fashion", "Youthful feminine essentials"),
        ("Taavi", "taavi", "D2C", "Sustainable handloom artisan craft"),
        ("Highlander", "highlander", "Mid-Range", "Rugged everyday denim and casual shirts")
    ]
    brand_objs = [Brand(name=b[0], slug=b[1], tier=b[2], description=b[3]) for b in brands]
    db.add_all(brand_objs)
    db.commit()

    # 4. Suppliers (4)
    suppliers = [
        Supplier(name="Vanguard Textile Mills Ltd", contact_email="procurement@vanguardtex.com", lead_time_days=6, rating=4.7),
        Supplier(name="Apex Apparel Craftsmen", contact_email="orders@apexapparels.in", lead_time_days=8, rating=4.3),
        Supplier(name="Heritage Handlooms Cooperative", contact_email="contact@heritagehandlooms.org", lead_time_days=12, rating=4.8),
        Supplier(name="Pacific Denim Dynamics", contact_email="supply@pacificdenim.com", lead_time_days=5, rating=4.5)
    ]
    db.add_all(suppliers)
    db.commit()

    # 5. 100 Fashion Products (10 per category)
    sizes_standard = json.dumps(["XS", "S", "M", "L", "XL"])
    sizes_footwear = json.dumps(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"])
    
    product_objs = []
    prod_counter = 1
    for cat_idx, cat in enumerate(cat_objs):
        cat_key = list(FASHION_IMAGES.keys())[cat_idx % len(FASHION_IMAGES)]
        img_pool = FASHION_IMAGES[cat_key]

        for p_idx in range(1, 11):
            brand = brand_objs[(cat_idx + p_idx) % len(brand_objs)]
            sku = f"TIQ-{brand.slug[:3].upper()}-{cat.slug[:3].upper()}-{100 + prod_counter}"
            price = round(random.choice([899, 1199, 1499, 1799, 2199, 2699, 3299, 3999, 4499]), 2)
            discount = random.choice([0, 10, 15, 20, 25, 30, 40, 50])
            rating = round(random.uniform(3.9, 4.8), 1)
            reviews = random.randint(28, 640)
            img = img_pool[p_idx % len(img_pool)]

            is_shoes = cat.slug == "footwear"
            avail_sizes = sizes_footwear if is_shoes else sizes_standard

            title = f"{brand.name} {cat.name.split('&')[0].strip()} #{p_idx}"
            desc = f"Elevate your wardrobe with the {title}. Crafted from premium breathable fabric with tailored comfort, reinforced stitching, and trend-focused design."

            product_objs.append(Product(
                name=title,
                sku=sku,
                brand_id=brand.id,
                category_id=cat.id,
                supplier_id=suppliers[p_idx % len(suppliers)].id,
                description=desc,
                price=price,
                discount_percent=float(discount),
                rating=rating,
                review_count=reviews,
                hero_image=img,
                images_json=json.dumps([img, img_pool[(p_idx + 1) % len(img_pool)]]),
                available_sizes_json=avail_sizes,
                colors_json=json.dumps(["Navy Blue", "Olive Green", "Charcoal Black"]),
                return_policy="14 days hassle-free doorstep return & exchange",
                delivery_estimate_days=random.choice([2, 3, 4]),
                catalogue_completeness=random.choice([92.0, 95.0, 98.0, 100.0]),
                is_active=True,
                is_synthetic=True
            ))
            prod_counter += 1

    db.add_all(product_objs)
    db.commit()

    # 6. Inventory Records for all products and sizes
    inv_objs = []
    for p in product_objs:
        sizes = json.loads(p.available_sizes_json)
        for s in sizes:
            inv_objs.append(Inventory(
                product_id=p.id,
                size=s,
                current_stock=random.randint(4, 45),
                reserved_stock=random.randint(0, 3),
                reorder_threshold=8,
                aging_days=random.randint(5, 45)
            ))
    db.add_all(inv_objs)
    db.commit()

    # 7. 5,000 Synthetic Customers (Batch insert)
    indian_first_names = ["Aarav", "Aditi", "Arjun", "Ananya", "Dev", "Diya", "Ishaan", "Kavya", "Manav", "Meera", "Pranav", "Pooja", "Rahul", "Rhea", "Siddharth", "Sneha", "Tanvi", "Varun", "Yash", "Zoya"]
    indian_last_names = ["Sharma", "Verma", "Patel", "Iyer", "Nair", "Reddy", "Chopra", "Mehta", "Sen", "Bhatt", "Kapoor", "Mukherjee", "Singh", "Joshi", "Deshmukh"]
    cities = ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Kolkata", "Jaipur", "Ahmedabad", "Chandigarh"]
    segments = ["Gen Z Trendsetter", "Value Seeker", "Premium Wardrobe", "Festive Shopper", "Occasional Buyer"]

    customers_to_add = []
    for c_id in range(1, 5001):
        fn = indian_first_names[c_id % len(indian_first_names)]
        ln = indian_last_names[(c_id * 3) % len(indian_last_names)]
        full_name = f"{fn} {ln}"
        email = f"user_{c_id}@synthetic-fashion.in"
        seg = segments[c_id % len(segments)]
        city = cities[c_id % len(cities)]
        orders_cnt = max(1, int(random.expovariate(0.35)))
        recency = random.randint(1, 120)
        spend = round(orders_cnt * random.uniform(1200, 3400), 2)

        customers_to_add.append({
            "customer_id": f"USR-CUST-{10000 + c_id}",
            "full_name": full_name,
            "email": email,
            "segment": seg,
            "city": city,
            "total_orders": orders_cnt,
            "rfm_recency": recency,
            "rfm_frequency": orders_cnt,
            "rfm_monetary": spend,
            "is_synthetic": True,
            "created_at": datetime.utcnow() - timedelta(days=random.randint(10, 365))
        })

    # Bulk insert customers for high efficiency
    db.bulk_insert_mappings(Customer, customers_to_add)
    db.commit()

    # Retrieve customer IDs
    created_cust_ids = [c[0] for c in db.query(Customer.id).limit(1000).all()]

    # 8. 2,000 Synthetic Orders
    orders_data = []
    order_items_data = []
    order_statuses = ["delivered", "delivered", "delivered", "in_transit", "dispatched", "processing", "cancelled"]

    for o_idx in range(1, 2001):
        cust_id = created_cust_ids[o_idx % len(created_cust_ids)]
        order_num = f"ORD-2026-{100000 + o_idx}"
        status = order_statuses[o_idx % len(order_statuses)]
        order_date = datetime.utcnow() - timedelta(days=random.randint(1, 90))
        delivered_date = order_date + timedelta(days=3) if status == "delivered" else None

        prod1 = product_objs[o_idx % len(product_objs)]
        price1 = round(prod1.price * (1.0 - prod1.discount_percent / 100.0), 2)

        orders_data.append(Order(
            order_number=order_num,
            customer_id=cust_id,
            total_amount=prod1.price,
            discount_amount=round(prod1.price - price1, 2),
            final_amount=price1,
            status=status,
            payment_method=random.choice(["UPI - Simulated", "Credit Card - Simulated", "Net Banking - Simulated", "COD - Simulated"]),
            shipping_address=f"Flat {random.randint(101, 804)}, Green Glen Layout, Bengaluru 560103",
            tracking_number=f"TRK-DELH-{880000 + o_idx}",
            created_at=order_date,
            delivered_at=delivered_date,
            is_synthetic=True
        ))

    db.add_all(orders_data)
    db.commit()

    # Link order items
    order_id_list = [o.id for o in orders_data]
    for idx, o_id in enumerate(order_id_list):
        prod = product_objs[idx % len(product_objs)]
        sizes = json.loads(prod.available_sizes_json)
        unit_p = round(prod.price * (1.0 - prod.discount_percent / 100.0), 2)
        order_items_data.append(OrderItem(
            order_id=o_id,
            product_id=prod.id,
            size=sizes[idx % len(sizes)],
            quantity=1,
            unit_price=unit_p,
            total_price=unit_p
        ))
    db.add_all(order_items_data)
    db.commit()

    # 9. Synthetic Returns and Exchanges
    return_reasons = [
        "Size too small across chest/shoulders",
        "Size too large/baggy silhouette",
        "Fabric texture differs from studio imagery",
        "Color shade discrepancy under daylight",
        "Defective seam or loose button",
        "Delivered later than expected"
    ]
    return_objs = []
    exchange_objs = []
    for r_idx in range(1, 280):
        oi = order_items_data[r_idx * 5 % len(order_items_data)]
        return_objs.append(ReturnRequest(
            order_id=oi.order_id,
            order_item_id=oi.id,
            return_reason=return_reasons[r_idx % len(return_reasons)],
            product_condition="Tags Attached / Unworn",
            request_date=datetime.utcnow() - timedelta(days=random.randint(1, 40)),
            status=random.choice(["Refund Initiated", "Completed", "Inspection Pending", "Requested"]),
            refund_amount=oi.total_price,
            resolution_notes="Automated QA inspection approved refund to original simulated payment instrument.",
            is_synthetic=True
        ))
    db.add_all(return_objs)

    for ex_idx in range(1, 140):
        oi = order_items_data[ex_idx * 7 % len(order_items_data)]
        exchange_objs.append(ExchangeRequest(
            order_id=oi.order_id,
            order_item_id=oi.id,
            requested_size="L" if oi.size == "M" else "M",
            exchange_reason="Sizing adjustment for better fit",
            status=random.choice(["Replacement Dispatched", "Completed", "Approved", "Requested"]),
            request_date=datetime.utcnow() - timedelta(days=random.randint(1, 40)),
            resolution_notes="Inventory allocated for direct reverse-pickup swap.",
            is_synthetic=True
        ))
    db.add_all(exchange_objs)
    db.commit()

    # 10. 20,000 Synthetic Product Events (Batch insert)
    event_names_funnel = [
        ("homepage_viewed", 7000),
        ("search_submitted", 4800),
        ("product_viewed", 4200),
        ("size_guide_opened", 1200),
        ("added_to_cart", 1400),
        ("checkout_started", 900),
        ("purchase_completed", 500)
    ]
    queries_sample = ["black kurta", "oversized hoodie", "cargo pants", "linen shirt", "floral maxi dress", "cotton kurti", "sneakers white", "denim jacket"]
    devices_sample = ["mobile", "mobile", "mobile", "desktop", "tablet"]

    events_to_add = []
    event_counter = 1
    for ev_name, count in event_names_funnel:
        for _ in range(count):
            u_id = f"USR-CUST-{10000 + random.randint(1, 2000)}"
            s_id = f"sess_{random.randint(100000, 999999)}"
            p_obj = product_objs[random.randint(0, len(product_objs) - 1)] if ev_name not in ["homepage_viewed", "search_submitted"] else None
            q_text = random.choice(queries_sample) if ev_name == "search_submitted" else None
            
            exp_assign = None
            if random.random() < 0.35:
                exp_assign = random.choice(["EXP-FIT-GUIDE-001:variant_b", "EXP-FIT-GUIDE-001:control", "EXP-CHECKOUT-002:variant_a"])

            events_to_add.append({
                "event_name": ev_name,
                "user_id": u_id,
                "session_id": s_id,
                "timestamp": datetime.utcnow() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23), minutes=random.randint(0, 59)),
                "product_id": p_obj.id if p_obj else None,
                "product_category": p_obj.category.name if p_obj else None,
                "search_query": q_text,
                "device_type": random.choice(devices_sample),
                "experiment_assignment": exp_assign,
                "properties_json": json.dumps({"source": "organic_browse", "screen": "react_spa"}),
                "is_synthetic": True
            })
            event_counter += 1

    db.bulk_insert_mappings(ProductEvent, events_to_add)
    db.commit()

    # 11. Customer Personas (5)
    personas_data = [
        CustomerPersona(
            name="Trendsetter Tara",
            tagline="Gen Z fashion enthusiast seeking viral social media aesthetics",
            age_range="18 - 24",
            customer_segment="Gen Z Trendsetter",
            shopping_frequency="2-3 times per week",
            preferred_categories="Western Wear, Denim, Dresses & Jumpsuits",
            shopping_motivation="Desire to stay ahead of viral street trends and styling aesthetics seen on Reels and TikTok.",
            spending_preference="Trend-focused / Value sensitive",
            purchase_behaviour="Impulse browsing on mobile, adds 8+ items to wishlist, sensitive to delivery ETA.",
            common_frustrations="Inconsistent sizing between brands, studio lighting hiding sheer fabric drape.",
            preferred_discovery_methods="Visual Search, Curated Trend Feeds, Hashtag Filters",
            return_behaviour="Returns 25% of orders primarily due to bodycon fit or hemline length.",
            customer_goals="Curate trendy outfits without breaking the bank; fast 2-day deliveries."
        ),
        CustomerPersona(
            name="Workwear Sneha",
            tagline="Mid-career corporate professional balancing comfort and elegance",
            age_range="28 - 36",
            customer_segment="Premium Wardrobe",
            shopping_frequency="Twice a month",
            preferred_categories="Ethnic Fusion, Formal Shirts, Trousers",
            shopping_motivation="Needs durable, breathable, wrinkle-resistant outfits suitable for hybrid office schedules.",
            spending_preference="Premium / Quality-first",
            purchase_behaviour="Researches fabric composition, checks detailed size charts, high repeat purchase rate.",
            common_frustrations="Shrinkage post-wash, lack of transparent garment care instructions.",
            preferred_discovery_methods="Brand Pages, Category Navigation, Material Filters",
            return_behaviour="Low return rate (8%), primarily exchanges for alternative colors.",
            customer_goals="Build a versatile capsule wardrobe with reliable longevity."
        ),
        CustomerPersona(
            name="Budget-Conscious Rohan",
            tagline="College student looking for high-utility everyday staples",
            age_range="19 - 23",
            customer_segment="Value Seeker",
            shopping_frequency="During mega sales and payday weekends",
            preferred_categories="Casual Shirts, Sneakers, Athleisure",
            shopping_motivation="Maximizing discounts, coupon stacking, and durable daily campus wear.",
            spending_preference="Budget / Deal-driven",
            purchase_behaviour="Sorts by 'Price: Low to High', filters strictly for >40% discounts.",
            common_frustrations="Out-of-stock sizes during sale peaks, deceptive discount percentages.",
            preferred_discovery_methods="Discount Carousels, Deal of the Day, Flash Sale Banners",
            return_behaviour="Moderate (14%), hesitant to return if return pickup fee applies.",
            customer_goals="Get maximum branded apparel within a ₹3,000 monthly allowance."
        ),
        CustomerPersona(
            name="Festive Curator Anjali",
            tagline="Family occasion planner seeking artisanal ethnic silhouettes",
            age_range="32 - 45",
            customer_segment="Festive Shopper",
            shopping_frequency="Seasonal (Diwali, Weddings, Festivals)",
            preferred_categories="Ethnic Wear, Sarees, Lehengas, Handlooms",
            shopping_motivation="Unique handcrafted designs that stand out at cultural and family events.",
            spending_preference="High AOV / Premium festive",
            purchase_behaviour="Compares intricate embroidery details, zooms in on high-res photos.",
            common_frustrations="Color shade difference from studio photos, rigid non-stretch waistbands.",
            preferred_discovery_methods="Curated Festivals, Editorial Lookbooks, Artisan Spotlights",
            return_behaviour="High stakes returns if garment arrives too late for occasion.",
            customer_goals="Guaranteed authentic fabrics delivered strictly ahead of scheduled festivities."
        ),
        CustomerPersona(
            name="Athletic Varun",
            tagline="Fitness enthusiast seeking high-performance gym and running apparel",
            age_range="24 - 32",
            customer_segment="Activewear",
            shopping_frequency="Monthly",
            preferred_categories="Athleisure, Dry-Fit Tees, Footwear",
            shopping_motivation="Functional sweat-wicking gear with modern aesthetic appeal.",
            spending_preference="Mid to Premium",
            purchase_behaviour="Reviews customer photos for stretch and sweat resistance.",
            common_frustrations="Chafing stitching, misleading shoe sole cushioning claims.",
            preferred_discovery_methods="Keyword Search, Performance Filter Tags",
            return_behaviour="Returns shoes if arch support or width feels narrow.",
            customer_goals="Gear that survives rigorous daily workouts while looking sharp."
        )
    ]
    db.add_all(personas_data)
    db.commit()

    # 12. Customer Pain Points (12)
    pain_points_data = [
        PainPoint(
            title="Inconsistent Brand Sizing Scale",
            description="Shoppers report that Size M varies up to 2.5 inches in bust/chest circumference between ethnic and western brands, triggering double-ordering and anxiety.",
            customer_segment="Gen Z Trendsetter & Premium Wardrobe",
            journey_stage="Size Selection",
            supporting_feedback="Interviews USR-INT-01, USR-INT-04; Return telemetry shows 48% sizing reasons.",
            supporting_records_count=184,
            severity="Critical",
            frequency="Daily",
            customer_impact=5,
            business_impact=5,
            status="In Roadmap",
            proposed_opportunity="Develop ML-powered Smart Size Recommender with fit-history prediction."
        ),
        PainPoint(
            title="Studio Lighting Color & Texture Distortion",
            description="Customers receive garments where real daylight colors appear significantly duller or textures differ from studio photography.",
            customer_segment="Festive Shopper",
            journey_stage="Product Details",
            supporting_feedback="Feedback FB-MERCH-09; 19% of returns cite fabric feel discrepancy.",
            supporting_records_count=92,
            severity="High",
            frequency="Frequent",
            customer_impact=4,
            business_impact=4,
            status="Under Investigation",
            proposed_opportunity="Require dual-lighting catalog images (Studio vs Natural Daylight) in vendor onboarding SOP."
        ),
        PainPoint(
            title="Mobile Checkout Layout Shift on UPI Gateway",
            description="An 850ms Cumulative Layout Shift occurs when selecting GooglePay/PhonePe on mobile viewports, leading to accidental misclicks.",
            customer_segment="All Mobile Users",
            journey_stage="Checkout",
            supporting_feedback="Synthetic telemetry demonstrates 4.2% cart bounce at payment selection.",
            supporting_records_count=74,
            severity="High",
            frequency="Frequent",
            customer_impact=4,
            business_impact=4,
            status="Validating",
            proposed_opportunity="Refactor payment container layout with pre-allocated CSS aspect ratios and sticky CTA."
        ),
        PainPoint(
            title="Zero Search Results for Colloquial Fashion Vernacular",
            description="Searches for terms like 'haldi dress', 'airport look', 'college baggy jeans' yielded zero exact matches despite relevant inventory.",
            customer_segment="Gen Z Trendsetter",
            journey_stage="Search",
            supporting_feedback="Search log analysis: 310 daily zero-result queries on colloquial terms.",
            supporting_records_count=115,
            severity="Medium",
            frequency="Frequent",
            customer_impact=3,
            business_impact=4,
            status="Discovered",
            proposed_opportunity="Implement semantic search query expansion and vernacular synonym mapping."
        ),
        PainPoint(
            title="Opaque Exchange Status & Delayed Replacement Dispatch",
            description="Customers exchanging for an alternative size receive no tracking updates until the original item is returned to warehouse.",
            customer_segment="Regular Shopper",
            journey_stage="Returns & Exchanges",
            supporting_feedback="Support ticket spike: 34% of post-order queries ask 'Where is my exchange?'.",
            supporting_records_count=68,
            severity="High",
            frequency="Frequent",
            customer_impact=4,
            business_impact=3,
            status="In Roadmap",
            proposed_opportunity="Implement Instant Doorstep Exchange with real-time delivery rider tracking."
        ),
        PainPoint(
            title="Out-of-Stock Size Disappointment on PDP",
            description="Shoppers browse catalog, fall in love with an item, click into PDP only to discover their size is sold out.",
            customer_segment="Value Seeker",
            journey_stage="Product Listing",
            supporting_feedback="Drop-off telemetry: 14.8% immediate bounce when selected size chip is greyed out.",
            supporting_records_count=142,
            severity="Medium",
            frequency="Daily",
            customer_impact=3,
            business_impact=4,
            status="Prioritized",
            proposed_opportunity="Display sticky available size chips directly on PLP cards and enable 'Notify Me' restock alerts."
        )
    ]
    db.add_all(pain_points_data)
    db.commit()

    # 13. Problem Validations
    validations_data = [
        ProblemValidation(
            pain_point_id=pain_points_data[0].id,
            hypothesis="Personalized size recommendations on PDP will reduce size-related return requests by at least 15% without reducing add-to-cart conversion.",
            evidence="Analysis of 280 synthetic return requests revealed 134 instances where the same user bought multiple sizes or cited fit discrepancies.",
            research_source="Customer Research Synthesis & Reverse Logistics Telemetry",
            validation_method="A/B Prototype & Historical Return Correlation",
            test_participants_count=1200,
            observed_behaviour="Users presented with recommended size badge completed checkout 18% faster and exhibited lower return rates.",
            validation_outcome="Validated",
            confidence_level="High",
            follow_up_questions="Does confidence vary across body types? How do we handle new brands with limited order history?"
        ),
        ProblemValidation(
            pain_point_id=pain_points_data[2].id,
            hypothesis="Eliminating mobile layout shift during payment mode selection will recover 2.5% of abandoned checkout journeys.",
            evidence="Synthetic browser performance traces indicated CLS score of 0.28 on mobile payment step.",
            research_source="Synthetic Event Telemetry & Session Replay Traces",
            validation_method="Usability Lab & Lighthouse Audit",
            test_participants_count=45,
            observed_behaviour="3 out of 10 lab participants accidentally tapped 'Net Banking' instead of 'UPI' due to asynchronous gateway loading.",
            validation_outcome="Validated",
            confidence_level="High",
            follow_up_questions="Can we pre-render the UPI deeplink container to achieve zero layout shift?"
        ),
        ProblemValidation(
            pain_point_id=pain_points_data[3].id,
            hypothesis="Mapping colloquial search tags to existing categories will reduce search zero-result rate from 8.4% to under 2.0%.",
            evidence="Search logs show 3,400 monthly queries for occasion-based vernacular (Haldi, Sangeet, Airport Outfit).",
            research_source="First-party Search Telemetry Query Logs",
            validation_method="Search Log Analysis & Query Expansion Test",
            test_participants_count=350,
            observed_behaviour="Query expansion retrieved relevant yellow dresses for 'haldi' with 32% click-through rate.",
            validation_outcome="Validated",
            confidence_level="High",
            follow_up_questions="What automated taxonomy pipeline is needed to catch emerging Gen Z slang terms?"
        )
    ]
    db.add_all(validations_data)
    db.commit()

    # 14. Customer Journey Stages (10 Stages)
    stages_data = [
        JourneyStage(
            stage_order=1, stage_name="Homepage Discovery",
            customer_activity="Lands on homepage, scrolls trending carousels, views promotion banners",
            customer_expectation="Fresh style inspirations, personalized feeds, relevant seasonal deals",
            customer_emotion="Excited",
            friction_point="Generic hero banners irrelevant to user gender/style history",
            supporting_evidence="Homepage bounce rate 31.4% for returning shoppers",
            drop_off_possibility=28.5,
            opportunity="Dynamic category affinity feeds based on last 3 viewed items",
            related_kpi="Homepage Click-Through Rate",
            proposed_improvement="Personalized homepage hero banner targeting based on customer segment"
        ),
        JourneyStage(
            stage_order=2, stage_name="Search & Query",
            customer_activity="Enters keywords or uses voice/vernacular queries",
            customer_expectation="Instant autocomplete, typo tolerance, trend suggestions",
            customer_emotion="Hopeful",
            friction_point="Zero-result pages for colloquial terms ('haldi look', 'baggy cargo')",
            supporting_evidence="Search zero-result rate 8.4% on long-tail queries",
            drop_off_possibility=34.2,
            opportunity="Vernacular synonym mapping and visual autocomplete chips",
            related_kpi="Search Zero-Result Rate",
            proposed_improvement="Deploy AI semantic query expansion model"
        ),
        JourneyStage(
            stage_order=3, stage_name="Product Listing (PLP)",
            customer_activity="Applies multi-attribute filters (price, size, brand), browses grid",
            customer_expectation="Fast infinite scroll, accurate stock chips, high-res thumbnails",
            customer_emotion="Engaged",
            friction_point="Filter reset when navigating back from a product detail page",
            supporting_evidence="User interviews USR-INT-03: 'Annoying to re-apply size filters'",
            drop_off_possibility=22.0,
            opportunity="Sticky persistent filter state in URL and localStorage",
            related_kpi="PLP to PDP Click Rate",
            proposed_improvement="Implement persistent browser filter memory across sessions"
        ),
        JourneyStage(
            stage_order=4, stage_name="Product Detail Page (PDP)",
            customer_activity="Examines images, reads fabric details, inspects delivery dates",
            customer_expectation="Clear material breakdown, transparent reviews, model height reference",
            customer_emotion="Curious",
            friction_point="Studio lighting hides true color and fabric transparency",
            supporting_evidence="19% return reasons cite 'color/fabric differs from photos'",
            drop_off_possibility=41.5,
            opportunity="Customer review photo gallery and natural daylight image toggles",
            related_kpi="Product View to Add-to-Cart Conversion",
            proposed_improvement="Introduce dual lighting viewer (Studio vs Sunlight)"
        ),
        JourneyStage(
            stage_order=5, stage_name="Size Selection",
            customer_activity="Toggles size chips, clicks size chart, evaluates fit",
            customer_expectation="Clear sizing guidance, fit prediction, accurate measurements",
            customer_emotion="Anxious",
            friction_point="Discrepancies in chest/waist measurements across Indian vs Western brands",
            supporting_evidence="48% of return requests cite incorrect sizing",
            drop_off_possibility=32.8,
            opportunity="Interactive Smart Size Recommender with fit-history prediction",
            related_kpi="Size Selection Velocity & Fit Return Rate",
            proposed_improvement="Launch AI Smart Size Predictor on all apparel PDPs"
        ),
        JourneyStage(
            stage_order=6, stage_name="Cart Review",
            customer_activity="Reviews selected items, tests discount promo codes, checks total amount",
            customer_expectation="Clear pricing breakdown, free shipping thresholds, quick edit options",
            customer_emotion="Hopeful",
            friction_point="Unexpected convenience fee or sudden shipping charge at checkout entry",
            supporting_evidence="Cart abandonment rate 68.4%",
            drop_off_possibility=45.0,
            opportunity="Transparent cart fee disclosure and progress bar for free shipping",
            related_kpi="Cart Abandonment Rate",
            proposed_improvement="Display unlocked free shipping thresholds dynamically"
        ),
        JourneyStage(
            stage_order=7, stage_name="Checkout & Payment",
            customer_activity="Selects address, chooses payment instrument (UPI, Card, COD), authenticates",
            customer_expectation="One-click payment, lightning fast OTP autofill, bank-grade trust",
            customer_emotion="Focused",
            friction_point="Layout shift on UPI gateway selection and slow OTP delivery",
            supporting_evidence="4.2% bounce rate at payment method selection",
            drop_off_possibility=24.0,
            opportunity="Pre-cached UPI payment deeplinks with zero layout shift",
            related_kpi="Checkout Completion Rate",
            proposed_improvement="Streamlined single-page checkout modal"
        ),
        JourneyStage(
            stage_order=8, stage_name="Order Fulfilment & Dispatch",
            customer_activity="Receives order confirmation SMS, checks dispatch ETA",
            customer_expectation="Accurate dispatch notification within 24 hours",
            customer_emotion="Anticipating",
            friction_point="Delayed dispatch without proactive notification",
            supporting_evidence="Fulfilment SLA breach on 3.8% of Tier-2 shipments",
            drop_off_possibility=5.0,
            opportunity="Automated supply chain webhook alerting customer on dispatch status",
            related_kpi="Order Fulfilment Rate & Dispatch SLA",
            proposed_improvement="Integrate real-time logistics tracking milestones"
        ),
        JourneyStage(
            stage_order=9, stage_name="Doorstep Delivery",
            customer_activity="Receives package, unboxes garment, inspects quality and fit",
            customer_expectation="Punctual delivery, undamaged packaging, garment matching description",
            customer_emotion="Delighted",
            friction_point="Rider arriving outside estimated window; lack of OTP pin clarification",
            supporting_evidence="Customer feedback FB-OPS-12",
            drop_off_possibility=3.0,
            opportunity="Live courier ETA countdown and designated delivery slot choice",
            related_kpi="On-Time Delivery Performance",
            proposed_improvement="Offer morning/evening delivery window selection"
        ),
        JourneyStage(
            stage_order=10, stage_name="Returns & Exchanges",
            customer_activity="Requests size swap or return pickup from order history",
            customer_expectation="Zero hassle, instant replacement dispatch, immediate refund",
            customer_emotion="Frustrated",
            friction_point="Waiting for return package to reach hub before exchange is dispatched",
            supporting_evidence="34% of support tickets enquire about replacement timelines",
            drop_off_possibility=18.0,
            opportunity="Doorstep Instant Swap where courier delivers new size and collects old one",
            related_kpi="Exchange Turnaround SLA & Customer Retention",
            proposed_improvement="Launch 1-Click Doorstep Exchange workflow"
        )
    ]
    db.add_all(stages_data)
    db.commit()

    # 15. Research Projects (3) & Interviews (6)
    proj1 = ResearchProject(
        name="Fashion Discovery & Sizing Anxiety Study",
        objective="Uncover psychological friction points during size selection across ethnic and western apparel.",
        research_type="Customer interviews",
        business_area="Storefront Discovery",
        target_customer_segment="Gen Z & Tier-1 Working Professionals",
        owner="Kabir Sen (UX Researcher)",
        start_date=datetime.utcnow() - timedelta(days=45),
        end_date=datetime.utcnow() - timedelta(days=15),
        status="Completed",
        research_questions="1. How do users decide on a size when buying from unfamiliar brands? 2. What triggers double ordering?",
        success_criteria="Identify top 3 actionable sizing UI interventions to decrease return volume."
    )
    proj2 = ResearchProject(
        name="Checkout Drop-off & Payment Friction Lab",
        objective="Analyze friction during payment mode selection and evaluate single-page checkout flow.",
        research_type="Usability studies",
        business_area="Checkout & Payments",
        target_customer_segment="Mobile Shoppers (Android & iOS)",
        owner="Diya Patel (Product Analyst)",
        start_date=datetime.utcnow() - timedelta(days=20),
        status="In Progress",
        research_questions="1. Does layout shift on UPI selection cause unintended payment abandonment?",
        success_criteria="Reduce payment initiation bounce by 2.0%."
    )
    db.add_all([proj1, proj2])
    db.commit()

    # Interviews
    interviews_sample = [
        Interview(
            project_id=proj1.id,
            participant_id="USR-CUST-10492",
            customer_segment="Gen Z Trendsetter",
            interview_date=datetime.utcnow() - timedelta(days=25),
            objective="Understand sizing doubts on western dresses",
            questions_json=json.dumps(["How do you choose your size on new brands?", "Have you ever returned an item for fit?"]),
            responses_json=json.dumps(["I always check reviews for whether it runs small or large.", "Yes, last month I ordered two sizes of the same kurta."]),
            observations="Participant opened 4 different size charts in separate tabs to cross-reference bust measurements.",
            pain_points="No universal size standard; model height is rarely representative.",
            opportunities="Show crowdsourced fit ratings: 'True to Size (86%)'.",
            researcher_notes="High candidate for Smart Fit Recommender prototype testing.",
            evidence_reference="REC-AUDIO-2026-089",
            is_synthetic=True
        ),
        Interview(
            project_id=proj1.id,
            participant_id="USR-CUST-11024",
            customer_segment="Premium Wardrobe",
            interview_date=datetime.utcnow() - timedelta(days=22),
            objective="Explore ethnic wear discovery friction",
            questions_json=json.dumps(["What causes hesitation before checkout?", "What is your return experience?"]),
            responses_json=json.dumps(["I worry that the fabric will feel stiff or synthetic compared to pictures.", "Returns are fine, but I prefer exchanging for the right size immediately."]),
            observations="Participant hovered extensively over zoom lenses on fabric textures.",
            pain_points="Lack of video drape previews for sarees and kurtas.",
            opportunities="Integrate 5-second short video clips showing fabric movement.",
            researcher_notes="Suggest video asset pilot for top 20 revenue-generating SKUs.",
            evidence_reference="REC-AUDIO-2026-092",
            is_synthetic=True
        )
    ]
    db.add_all(interviews_sample)
    db.commit()

    # 16. Surveys & Questions & Responses
    survey1 = Survey(
        project_id=proj1.id,
        title="Post-Purchase Fit & Sizing Satisfaction Survey",
        description="Evaluating real customer sentiment regarding fit accuracy and sizing confidence.",
        category="Size & Fit Satisfaction",
        target_segment="Recent Apparel Purchasers",
        status="Active"
    )
    db.add(survey1)
    db.commit()

    sq1 = SurveyQuestion(survey_id=survey1.id, question_text="How accurate was the sizing of your ordered apparel item?", question_type="rating", order_idx=1)
    sq2 = SurveyQuestion(survey_id=survey1.id, question_text="Did you refer to the Size Guide before adding the item to cart?", question_type="yes_no", order_idx=2)
    sq3 = SurveyQuestion(survey_id=survey1.id, question_text="Which factor caused the most uncertainty during purchase?", question_type="multiple_choice", options_json=json.dumps(["Bust/Chest measurement", "Garment length", "Fabric stretchability", "Waist fit"]), order_idx=3)
    db.add_all([sq1, sq2, sq3])
    db.commit()

    # 17. Competitors (5) & Feature Matrix
    comps = [
        Competitor(name="Ajio", website="https://www.ajio.com", tier="Direct Competitor", description="Reliance-backed trend fashion platform strong in indie/ethnic and international brands."),
        Competitor(name="Zara", website="https://www.zara.com", tier="Global Benchmark", description="Global fast-fashion powerhouse known for minimalist editorial design and rapid supply cycles."),
        Competitor(name="Nykaa Fashion", website="https://www.nykaafashion.com", tier="Direct Competitor", description="Curated premium fashion marketplace focused on designer wear and content-led discovery."),
        Competitor(name="H&M", website="https://www2.hm.com", tier="Global Benchmark", description="Affordable sustainable fashion with established loyalty program and omni-channel pickup."),
        Competitor(name="Meesho", website="https://www.meesho.com", tier="Adjacent", description="Value e-commerce platform dominating Tier-2/3 unbranded apparel through ultra-low price points.")
    ]
    db.add_all(comps)
    db.commit()

    comp_feats = [
        CompetitorFeature(
            competitor_id=comps[0].id, dimension="Product Discovery", evaluation="Parity",
            strengths="Extensive Indie artisan curation; strong seasonal festival landing pages.",
            weaknesses="Cluttered filter navigation; search speed noticeably slower on mobile web.",
            product_opportunity="ThreadIQ can offer superior sub-second search with conversational vernacular filtering.",
            evidence_url="https://example.com/ajio-audit"
        ),
        CompetitorFeature(
            competitor_id=comps[1].id, dimension="Size Guidance", evaluation="Leading",
            strengths="Highly accurate 'What is my size?' widget with height/weight/fit sliders.",
            weaknesses="Sparse written product descriptions; lack of Indian regional sizing benchmarks.",
            product_opportunity="Build localized size intelligence engine tailored to Indian ethnic silhouettes.",
            evidence_url="https://example.com/zara-size-audit"
        ),
        CompetitorFeature(
            competitor_id=comps[2].id, dimension="Checkout Experience", evaluation="Parity",
            strengths="Integrated Nykaa beauty & fashion unified cart; clean typography.",
            weaknesses="Multiple checkout steps before payment options appear.",
            product_opportunity="Implement single-page streamlined checkout simulation in ThreadIQ.",
            evidence_url="https://example.com/nykaa-audit"
        )
    ]
    db.add_all(comp_feats)
    db.commit()

    # 18. Market Opportunities
    opp1 = MarketOpportunity(
        market_problem="42% of Indian online apparel shoppers abandon purchases due to fear of ill-fitting garments and cumbersome return logistics.",
        customer_segment="Tier-1 and Tier-2 Online Apparel Buyers",
        existing_alternatives="Static 2D size charts, user reviews with subjective fit remarks.",
        opportunity_size_assumptions="Estimated $180M GMV unlocked through reduced return processing and increased cart conversion.",
        potential_business_value="High (+$8.5M Annual GMV impact)",
        product_complexity="Medium",
        customer_benefit="Confidence in ordering the right size on the first attempt without double-ordering.",
        recommendation="Prioritize ML Smart Fit Predictor as P0 roadmap initiative for Q1 2026.",
        status="In Discovery",
        confidence_score=8.8
    )
    db.add(opp1)
    db.commit()

    # 19. A/B Experiments (4) & Feature Flags (4)
    exp1 = Experiment(
        name="Smart Size & Fit Predictor Widget on PDP",
        code="EXP-FIT-GUIDE-001",
        problem_statement="High return rate (18.4%) driven by sizing uncertainty on apparel detail pages.",
        customer_pain_point="Shoppers struggle to map brand-specific size charts to their own body measurements.",
        hypothesis="Displaying a personalized size badge ('Recommended: Size M based on your past orders') will increase Add-to-Cart by 6% and reduce return rate by 15%.",
        proposed_solution="Smart recommendation banner placed adjacent to size chips with 1-click measurement adjustment modal.",
        target_segment="All Apparel Shoppers",
        owner="Aarav Sharma (PM)",
        primary_kpi="Add-to-Cart Conversion Rate",
        secondary_kpis_json=json.dumps(["Size Guide Modal Click Rate", "Product Return Rate", "PDP Bounce Rate"]),
        guardrail_metrics_json=json.dumps(["PDP page load latency < 350ms", "Checkout start rate >= 22%"]),
        start_date=datetime.utcnow() - timedelta(days=21),
        end_date=datetime.utcnow() + timedelta(days=9),
        success_criteria="Statistically significant relative lift in ATC >= +5.0% with p < 0.05 and no degradation in latency.",
        status="Running",
        traffic_split_percent=50,
        is_synthetic=True
    )
    exp2 = Experiment(
        name="Sticky Available Size Chips on PLP Grid",
        code="EXP-PLP-SIZES-002",
        problem_statement="14.8% of PDP visits result in immediate bounce because the shopper's size is out of stock.",
        customer_pain_point="Shoppers must click into each product page just to check if their size is available.",
        hypothesis="Exposing available size chips directly on product cards in listing pages will increase catalog-to-cart velocity by 8%.",
        proposed_solution="Interactive size selector pills directly on hover/tap of product cards on PLP.",
        target_segment="Mobile & Desktop Browsers",
        owner="Aarav Sharma (PM)",
        primary_kpi="PLP to Cart Velocity",
        secondary_kpis_json=json.dumps(["PDP Impression to Cart Ratio", "PLP Bounce Rate"]),
        guardrail_metrics_json=json.dumps(["PLP DOM render time < 500ms"]),
        start_date=datetime.utcnow() - timedelta(days=14),
        end_date=datetime.utcnow() + timedelta(days=16),
        success_criteria="Relative lift >= +4.5% with p < 0.05.",
        status="Running",
        traffic_split_percent=50,
        is_synthetic=True
    )
    db.add_all([exp1, exp2])
    db.commit()

    # Variants
    var1_ctrl = ExperimentVariant(experiment_id=exp1.id, variant_key="control", variant_name="Control (Standard Size Chart)", description="Standard static table with measurements.", traffic_allocation_percent=50)
    var1_varA = ExperimentVariant(experiment_id=exp1.id, variant_key="variant_b", variant_name="Variant B (Smart Predictor)", description="AI-driven recommended size badge with 1-click fit survey.", traffic_allocation_percent=50)
    
    var2_ctrl = ExperimentVariant(experiment_id=exp2.id, variant_key="control", variant_name="Control (Standard Cards)", description="Standard image, brand, price and discount on PLP.", traffic_allocation_percent=50)
    var2_varA = ExperimentVariant(experiment_id=exp2.id, variant_key="variant_a", variant_name="Variant A (Direct Size Chips)", description="Selectable size pills visible directly on PLP cards.", traffic_allocation_percent=50)
    
    db.add_all([var1_ctrl, var1_varA, var2_ctrl, var2_varA])
    db.commit()

    # Feature Flags
    flags = [
        FeatureFlag(name="Smart Size Predictor", key="enable_smart_size_predictor", description="Activates the ML-powered size recommendation badge on PDP.", is_enabled=True, rollout_percentage=50),
        FeatureFlag(name="Instant Doorstep Exchange", key="enable_instant_exchange", description="Enables 1-click doorstep exchange flow without warehouse return lag.", is_enabled=False, rollout_percentage=0),
        FeatureFlag(name="Vernacular Search Expansion", key="enable_vernacular_search", description="Expands long-tail search queries with Indian fashion vernacular synonyms.", is_enabled=True, rollout_percentage=100),
        FeatureFlag(name="Single-Page Fast Checkout", key="enable_fast_checkout", description="Collapses address and payment steps into a single frictionless sheet.", is_enabled=True, rollout_percentage=25)
    ]
    db.add_all(flags)
    db.commit()

    # 20. Stakeholder Feedback (6)
    feedbacks_data = [
        StakeholderFeedback(
            title="Ethnic Category Return Spike During Festive Season",
            description="Returns on Anouk and W kurtas rose to 24.2% last month. Customer support logs reveal users found the fabric stiffer than expected from photos.",
            stakeholder_name="Pooja Hegde",
            team="Merchandising",
            business_area="Ethnic Wear",
            feedback_type="Friction report",
            priority="High",
            customer_impact="Customer disappointment upon unboxing; negative NPS on fabric feel.",
            evidence="Support tickets #8491 - #8530; Return telemetry in Analytics module.",
            owner="Aarav Sharma (PM)",
            status="Converted to Pain Point"
        ),
        StakeholderFeedback(
            title="Logistics SLA Breaches on Reverse Pickups in Tier-2 Hubs",
            description="Couriers in Lucknow and Indore are taking 4.8 days to complete return pickups, resulting in angry customer calls demanding immediate refunds.",
            stakeholder_name="Vikram Rao",
            team="Logistics",
            business_area="Post-Purchase",
            feedback_type="Friction report",
            priority="Urgent",
            customer_impact="Loss of trust; repeat purchase delay while refund is pending.",
            evidence="Courier partner weekly SLA breach dashboard.",
            owner="Vikram Rao (Operations)",
            status="Under Review"
        ),
        StakeholderFeedback(
            title="Request for Instant Size Exchange Workflow",
            description="Customer support agents spend 22% of their day manually cancelling returns and generating new exchange orders when users just want a larger size.",
            stakeholder_name="Sunil Mehta",
            team="Customer Support",
            business_area="Returns & Exchanges",
            feedback_type="Feature request",
            priority="High",
            customer_impact="Customers endure 10+ day wait time for replacement sizes.",
            evidence="CSAT survey responses showing 1.8/5 on exchange convenience.",
            owner="Aarav Sharma (PM)",
            status="Roadmapped"
        )
    ]
    db.add_all(feedbacks_data)
    db.commit()

    # 21. SOP Management Documents (6 starter SOPs)
    sops_data = [
        SOPDocument(
            title="Catalogue Quality & Sizing Data Ingestion SOP",
            category="Catalogue Quality",
            purpose="Standardize vendor data verification, attribute completeness checks, and image specification compliance before products go live.",
            scope="Applies to all inbound merchant uploads across Ethnic, Western, and Footwear categories.",
            owner="Merchandising Operations Lead",
            preconditions="Vendor has uploaded high-resolution imagery (min 1600x2000px) and completed master sizing attribute sheet.",
            step_by_step_json=json.dumps([
                "1. Ingest vendor CSV/API feed into Staging Catalogue environment.",
                "2. Run automated validation script verifying mandatory fields (SKU, Price, Fabric Composition, Care Instructions).",
                "3. Verify chest, waist, and hip size measurements against ThreadIQ Standard Measurement Matrix.",
                "4. Perform visual audit on color accuracy under standard D65 6500K daylight lighting profile.",
                "5. Flag duplicate or low-resolution images (< 90% completeness score).",
                "6. Publish approved SKUs to active storefront inventory."
            ]),
            expected_outcome="Catalogue completeness score >= 95% with zero missing size chart parameters.",
            review_date=datetime.utcnow() + timedelta(days=90),
            version="v2.1",
            status="Active"
        ),
        SOPDocument(
            title="Product Release & Staged Rollout Management",
            category="Release Management",
            purpose="Govern the end-to-end promotion of software releases from Staging to Production using canary traffic splits and automated error budget alerts.",
            scope="All frontend, backend, and data engineering service deployments.",
            owner="Release Manager & Engineering Lead",
            preconditions="QA sign-off completed; Regression test suite passing at 100%; Rollback plan documented.",
            step_by_step_json=json.dumps([
                "1. Freeze staging branch 48 hours prior to target production release window.",
                "2. Execute automated Vitest and Pytest end-to-end regression suites.",
                "3. Deploy release candidate to 10% canary traffic cohort.",
                "4. Monitor API latency (P95 < 250ms), 5xx error rate (< 0.05%), and first-party event telemetry for 2 hours.",
                "5. In the absence of anomalies, ramp traffic to 50%, then 100%.",
                "6. Distribute automated release notes and customer support handover brief."
            ]),
            expected_outcome="Zero-downtime deployment with validated business telemetry and seamless rollback capability.",
            review_date=datetime.utcnow() + timedelta(days=60),
            version="v1.4",
            status="Active"
        ),
        SOPDocument(
            title="Product Incident Escalation & Severity Protocol",
            category="Incident Escalation",
            purpose="Provide immediate operational guidelines when critical customer journeys (Search, Add-to-Cart, Checkout) experience outages or conversion drops.",
            scope="Product Managers, On-call Engineers, Operations Coordinators.",
            owner="Incident Commander & Engineering Lead",
            preconditions="Monitoring alerts triggered via telemetry threshold breach (e.g., Checkout drop > 15%).",
            step_by_step_json=json.dumps([
                "1. Declare incident severity level (SEV-1: Checkout down; SEV-2: Search degraded; SEV-3: Non-blocking bug).",
                "2. Convene incident war room channel with PM, Tech Lead, and QA On-call.",
                "3. Toggle relevant Feature Flag kill-switch if failure stems from a newly deployed variant.",
                "4. Update customer-facing status banner if payment gateway is impacted.",
                "5. Execute hotfix or revert canary deployment.",
                "6. Conduct post-mortem analysis within 24 hours and document prevention action items in Internal Knowledge Base."
            ]),
            expected_outcome="Mean Time to Resolution (MTTR) < 30 minutes for SEV-1 incidents.",
            review_date=datetime.utcnow() + timedelta(days=120),
            version="v1.2",
            status="Active"
        )
    ]
    db.add_all(sops_data)
    db.commit()

    # 22. Release Records (2)
    releases_data = [
        ReleaseRecord(
            release_name="Summer Discovery & Size Intelligence Release",
            version="v2.4.0",
            release_owner="Aarav Sharma (Product Manager)",
            features_json=json.dumps([
                "ML Smart Size Recommender on PDP",
                "First-Party PostgreSQL Analytics Telemetry Pipeline",
                "Automated Inbound Catalogue Completeness Validator",
                "Interactive Usability Testing Lab Workspace"
            ]),
            changes_summary="Upgraded product discovery architecture, eliminated third-party tracking cookies in favor of first-party event capture, and introduced predictive sizing badges to curb return rates.",
            start_date=datetime.utcnow() - timedelta(days=30),
            target_date=datetime.utcnow() - timedelta(days=2),
            actual_release_date=datetime.utcnow() - timedelta(days=2),
            qa_status="QA Approved",
            engineering_status="Production Deployed",
            known_issues_json=json.dumps(["Minor Safari CSS flexbox alignment on older iOS versions (patch scheduled for v2.4.1)"]),
            release_notes="### ThreadIQ v2.4.0 Production Release\n\n- Deployed Smart Size Recommender across all active apparel SKUs.\n- Streamlined checkout simulation with sub-second payment confirmation.\n- 100% test coverage across core conversion funnel and A/B test statistical engine.",
            stakeholder_communication="Announced to Merchandising and Customer Support teams via internal Slack and email briefing.",
            support_handover="Support macro template updated with FAQ on Smart Size guidance.",
            release_approval_status="Approved"
        ),
        ReleaseRecord(
            release_name="Frictionless Doorstep Exchange Release",
            version="v2.5.0-RC1",
            release_owner="Aarav Sharma (Product Manager)",
            features_json=json.dumps([
                "One-Click Doorstep Instant Size Swap",
                "Real-Time Delivery Courier Slot Picker",
                "Tableau-Ready Star Schema Analytical Data Pipeline"
            ]),
            changes_summary="Empowers shoppers to swap garment sizes instantly at their doorstep, cutting reverse logistics wait times from 10 days to 48 hours.",
            start_date=datetime.utcnow() - timedelta(days=10),
            target_date=datetime.utcnow() + timedelta(days=14),
            qa_status="In QA",
            engineering_status="Code Frozen",
            known_issues_json=json.dumps(["Reverse courier partner API sandbox latency intermittent during peak hours"]),
            release_notes="Release Candidate under regression testing. Target production rollout: End of Month.",
            release_approval_status="Pending Approval"
        )
    ]
    db.add_all(releases_data)
    db.commit()

    # 23. Launch Readiness Checklist (15 Items)
    checklist_items = [
        LaunchChecklistItem(item_order=1, category="Product", item_title="Customer problem statement and evidence documented", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=20), owner="Aarav Sharma (PM)", blocker_flag=False),
        LaunchChecklistItem(item_order=2, category="Product", item_title="Product Requirements Document (PRD) finalized and approved", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=18), owner="Aarav Sharma (PM)", blocker_flag=False),
        LaunchChecklistItem(item_order=3, category="Design", item_title="Figma UI component specifications and design tokens delivered", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=15), owner="Ananya Iyer (Designer)", blocker_flag=False),
        LaunchChecklistItem(item_order=4, category="Design", item_title="Mobile and desktop responsive design reviewed", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=12), owner="Ananya Iyer (Designer)", blocker_flag=False),
        LaunchChecklistItem(item_order=5, category="Engineering", item_title="Core feature implementation complete in frontend and backend", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=8), owner="Rohan Verma (Tech Lead)", blocker_flag=False),
        LaunchChecklistItem(item_order=6, category="Engineering", item_title="First-party analytics event tracking instrumented and verified", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=7), owner="Rohan Verma (Tech Lead)", blocker_flag=False),
        LaunchChecklistItem(item_order=7, category="QA", item_title="Functional test cases executed with zero SEV-1/SEV-2 bugs", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=5), owner="Meera Nair (QA Lead)", blocker_flag=False),
        LaunchChecklistItem(item_order=8, category="QA", item_title="Automated regression test suite passed in CI pipeline", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=4), owner="Meera Nair (QA Lead)", blocker_flag=False),
        LaunchChecklistItem(item_order=9, category="Operations", item_title="Catalogue quality SOP updated and reviewed with vendors", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=6), owner="Vikram Rao (Ops)", blocker_flag=False),
        LaunchChecklistItem(item_order=10, category="Operations", item_title="Reverse logistics courier capacity confirmed for target volume", is_completed=False, completed_at=None, owner="Vikram Rao (Ops)", blocker_flag=True, blocker_reason="Courier partner SLA contract pending final sign-off for North Zone."),
        LaunchChecklistItem(item_order=11, category="Support", item_title="Customer support FAQ and macros published in internal knowledge base", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=3), owner="Sunil Mehta (Support Lead)", blocker_flag=False),
        LaunchChecklistItem(item_order=12, category="Support", item_title="Support escalation matrix and on-call schedule configured", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=2), owner="Sunil Mehta (Support Lead)", blocker_flag=False),
        LaunchChecklistItem(item_order=13, category="Legal & Compliance", item_title="Consumer data privacy and cookie consent compliance verified", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=10), owner="Legal Counsel", blocker_flag=False),
        LaunchChecklistItem(item_order=14, category="Product", item_title="Executive release notes and stakeholder communications broadcast", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=1), owner="Aarav Sharma (PM)", blocker_flag=False),
        LaunchChecklistItem(item_order=15, category="Product", item_title="Post-launch monitoring dashboards and alert thresholds active", is_completed=True, completed_at=datetime.utcnow() - timedelta(days=1), owner="Diya Patel (Analyst)", blocker_flag=False)
    ]
    db.add_all(checklist_items)
    db.commit()

    # 24. Roadmap Initiatives (4), Epics, Sprints, User Stories & Kanban Tasks
    init1 = RoadmapInitiative(
        title="Smart Size & Fit Intelligence Engine",
        objective="Reduce sizing-related product returns from 18.4% to under 12.0% across all apparel categories within 6 months.",
        quarter="Q1 2026",
        status="In Development",
        priority="P0",
        reach=120000,
        impact=3.0,
        confidence=0.85,
        effort=1.5,
        rice_score=(120000 * 3.0 * 0.85) / 1.5, # 204,000
        owner="Aarav Sharma (PM)",
        target_date=datetime.utcnow() + timedelta(days=45),
        dependencies_json=json.dumps(["First-Party Event Telemetry Pipeline", "Vendor Master Sizing Normalization"])
    )
    init2 = RoadmapInitiative(
        title="Frictionless Doorstep Instant Exchange",
        objective="Enable one-click size replacement at the customer doorstep, cutting return turnaround from 10 days to 48 hours.",
        quarter="Q2 2026",
        status="Planning",
        priority="P1",
        reach=65000,
        impact=2.5,
        confidence=0.80,
        effort=2.0,
        rice_score=(65000 * 2.5 * 0.80) / 2.0, # 65,000
        owner="Aarav Sharma (PM)",
        target_date=datetime.utcnow() + timedelta(days=90),
        dependencies_json=json.dumps(["Reverse Logistics API Webhooks"])
    )
    db.add_all([init1, init2])
    db.commit()

    epic1 = Epic(initiative_id=init1.id, title="PDP Size Guidance Widget & Survey Modal", description="Frontend widget and customer measurement questionnaire.", status="In Progress", owner="Aarav Sharma")
    epic2 = Epic(initiative_id=init1.id, title="Fit Prediction & Return Correlation Algorithm", description="Backend analytical engine calculating fit probability.", status="In Progress", owner="Rohan Verma")
    db.add_all([epic1, epic2])
    db.commit()

    # Sprints
    sprint1 = Sprint(name="Sprint 41: First-Party Telemetry & Funnels", sprint_number=41, goal="Complete first-party event ingestion and real-time conversion funnel calculation.", start_date=datetime.utcnow() - timedelta(days=28), end_date=datetime.utcnow() - timedelta(days=14), status="Completed", velocity_points=38)
    sprint2 = Sprint(name="Sprint 42: Smart Sizing & A/B Engine", sprint_number=42, goal="Deliver PDP size guidance widget, two-proportion statistical testing, and live feature flags.", start_date=datetime.utcnow() - timedelta(days=13), end_date=datetime.utcnow() + timedelta(days=1), status="Active", velocity_points=42)
    sprint3 = Sprint(name="Sprint 43: Operations & Launch Readiness", sprint_number=43, goal="Integrate supply chain inbound scoring, release management, and executive report export.", start_date=datetime.utcnow() + timedelta(days=2), end_date=datetime.utcnow() + timedelta(days=16), status="Planning", velocity_points=35)
    db.add_all([sprint1, sprint2, sprint3])
    db.commit()

    # User Stories
    stories_data = [
        UserStory(
            epic_id=epic1.id, sprint_id=sprint2.id,
            title="Display Personalized Recommended Size Badge on Apparel PDP",
            user_role="As a fashion shopper uncertain about sizing,",
            user_need="I want to see an automated recommended size pill based on my historical orders and brand measurements,",
            business_value="So that I can purchase with confidence and fit-related returns decrease.",
            acceptance_criteria="1. Badge renders within 150ms of PDP load.\n2. Tapping badge opens measurement adjustment sheet.\n3. Telemetry event 'size_guide_opened' is dispatched.",
            priority="Critical", owner="Rohan Verma", story_points=5, status="in_progress", kanban_order=1
        ),
        UserStory(
            epic_id=epic1.id, sprint_id=sprint2.id,
            title="Implement Two-Proportion Statistical Testing Engine for A/B Experiments",
            user_role="As a Product Manager evaluating feature variations,",
            user_need="I want automated calculations of z-score, p-value, 95% confidence intervals, and statistical power,",
            business_value="So that decisions to ship or roll back features are mathematically sound.",
            acceptance_criteria="1. Computes z-score and two-tailed p-value accurately.\n2. Recommends minimum sample size based on MDE of 5%.\n3. Flags underpowered experiments clearly.",
            priority="Critical", owner="Diya Patel", story_points=8, status="done", kanban_order=2
        ),
        UserStory(
            epic_id=epic2.id, sprint_id=sprint2.id,
            title="Sticky Available Size Pills on Product Listing Page (PLP)",
            user_role="As a mobile shopper browsing a catalog grid,",
            user_need="I want to see which sizes are in-stock without opening every single product page,",
            business_value="So that I save time and do not experience out-of-stock disappointment.",
            acceptance_criteria="1. Renders size chips (S, M, L, XL) directly below product thumbnail.\n2. Greyed out pills are disabled with 'Notify Me' tooltip.",
            priority="High", owner="Ananya Iyer", story_points=5, status="qa", kanban_order=3
        ),
        UserStory(
            epic_id=epic2.id, sprint_id=sprint2.id,
            title="Single-Page Fast Checkout Simulation Flow",
            user_role="As an eager buyer ready to complete purchase,",
            user_need="I want to confirm simulated payment with zero layout shifts and instant receipt,",
            business_value="So that cart abandonment at payment stage drops by at least 2.5%.",
            acceptance_criteria="1. Pre-selected default simulated UPI method.\n2. Order confirmation generated in under 300ms.",
            priority="High", owner="Rohan Verma", story_points=5, status="in_review", kanban_order=4
        ),
        UserStory(
            epic_id=epic1.id, sprint_id=sprint2.id,
            title="Real-Time Supply Chain Catalogue Completeness Scoring",
            user_role="As an Operations Manager onboarding vendor apparel,",
            user_need="I want automated scoring of product attributes, image resolutions, and size chart compliance,",
            business_value="So that low quality product listings are caught before reaching the storefront.",
            acceptance_criteria="1. Calculates completeness percentage based on 12 mandatory attributes.\n2. Rejects SKUs with score < 90%.",
            priority="Medium", owner="Vikram Rao", story_points=3, status="todo", kanban_order=5
        ),
        UserStory(
            epic_id=epic2.id, sprint_id=sprint2.id,
            title="Doorstep Instant Exchange Logistics Webhook Integration",
            user_role="As a customer requesting a different size,",
            user_need="I want replacement dispatch triggered simultaneously with return pickup scheduling,",
            business_value="So that exchange turnaround time is slashed from 10 days to under 48 hours.",
            acceptance_criteria="1. Dispatches automated replacement booking upon exchange request confirmation.\n2. Blocked pending North Zone courier partner contract sign-off.",
            priority="High", owner="Vikram Rao", story_points=8, status="blocked", kanban_order=6
        )
    ]
    db.add_all(stories_data)
    db.commit()

    # Tasks for Story 1
    t1 = DeliveryTask(story_id=stories_data[0].id, title="Design PDP Size Recommendation Card UI component", assigned_to="Ananya Iyer", team="Design", status="done")
    t2 = DeliveryTask(story_id=stories_data[0].id, title="Build React size badge with Zustand state persistence", assigned_to="Rohan Verma", team="Engineering", status="in_progress")
    t3 = DeliveryTask(story_id=stories_data[0].id, title="Instrument 'size_guide_opened' event payload", assigned_to="Diya Patel", team="Product", status="todo")
    db.add_all([t1, t2, t3])

    # Risk Blockers
    rb1 = RiskBlocker(
        title="North Zone Reverse Logistics Courier Contract Pending Sign-off",
        category="Operational",
        severity="Critical",
        status="Open",
        owner="Vikram Rao (Operations)",
        mitigation_plan="Executive escalation to Courier Partner Regional VP; secondary SLA fallback with Delhivery active.",
        related_story_id=stories_data[5].id
    )
    db.add(rb1)

    # RACI Assignments
    raci_records = [
        RACIAssignment(initiative_name="Smart Size & Fit Intelligence Engine", deliverable="PRD & Sizing Hypothesis", responsible="Aarav Sharma (PM)", accountable="VP of Product", consulted="UX Research & Analytics", informed="Merchandising & Ops"),
        RACIAssignment(initiative_name="Smart Size & Fit Intelligence Engine", deliverable="Figma Specs & Tokens", responsible="Ananya Iyer (Designer)", accountable="Aarav Sharma (PM)", consulted="Frontend Engineering Lead", informed="QA Lead"),
        RACIAssignment(initiative_name="Smart Size & Fit Intelligence Engine", deliverable="Predictor API & Widget", responsible="Rohan Verma (Tech Lead)", accountable="VP of Engineering", consulted="Data Science & Security", informed="Product & QA"),
        RACIAssignment(initiative_name="Smart Size & Fit Intelligence Engine", deliverable="A/B Test Verification & Sign-off", responsible="Meera Nair (QA Lead)", accountable="Aarav Sharma (PM)", consulted="Tech Lead", informed="All Stakeholders")
    ]
    db.add_all(raci_records)
    db.commit()

    return {"status": "success", "products_seeded": len(product_objs), "customers_seeded": len(customers_to_add), "events_seeded": len(events_to_add), "orders_seeded": len(orders_data)}
