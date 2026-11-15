import pytest
from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_auth_login_and_role_switch(client: TestClient):
    # Ensure role switch works properly
    client.post("/api/auth/switch-role", json={"role": "Product Manager"})
    res = client.post("/api/auth/login", json={"email": "pm@threadiq.internal", "password": "password"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "Product Manager"

    switch_res = client.post("/api/auth/switch-role", json={"role": "Product Analyst"})
    assert switch_res.status_code == 200
    assert switch_res.json()["role"] == "Product Analyst"

    # Reset back to Product Manager for clean state
    client.post("/api/auth/switch-role", json={"role": "Product Manager"})

def test_overview_metrics(client: TestClient):
    res = client.get("/api/overview/metrics")
    assert res.status_code == 200
    data = res.json()
    assert "kpis" in data
    assert data["kpis"]["total_products"] >= 100
    assert data["kpis"]["total_customers"] >= 5000
    assert "alerts" in data

def test_customer_research_flows(client: TestClient):
    # Get projects
    p_res = client.get("/api/research/projects")
    assert p_res.status_code == 200
    assert len(p_res.json()) >= 1

    # Get personas
    per_res = client.get("/api/research/personas")
    assert per_res.status_code == 200
    assert len(per_res.json()) >= 5

    # Get pain points
    pp_res = client.get("/api/research/pain-points")
    assert pp_res.status_code == 200
    assert len(pp_res.json()) >= 6

    # Create new pain point
    new_pp = client.post("/api/research/pain-points", json={
        "title": "Delivery Window Uncertainty for Gifting Orders",
        "description": "Users need exact morning/evening delivery window selection for festival gifts.",
        "customer_segment": "Festive Shopper",
        "journey_stage": "Delivery",
        "severity": "High",
        "frequency": "Occasional",
        "customer_impact": 4,
        "business_impact": 3,
        "status": "Discovered"
    })
    assert new_pp.status_code == 200
    created_id = new_pp.json()["id"]

    # Problem validation link
    val_res = client.post("/api/research/validations", json={
        "pain_point_id": created_id,
        "hypothesis": "Providing 3-hour delivery slot selection reduces failed first-attempt deliveries by 20%.",
        "evidence": "Logistics trace analysis shows 18% of failed deliveries happen when customer is away at work.",
        "research_source": "Logistics Telemetry & User Interviews",
        "validation_method": "Usability Lab",
        "test_participants_count": 25,
        "validation_outcome": "Validated",
        "confidence_level": "High"
    })
    assert val_res.status_code == 200
    assert val_res.json()["validation_outcome"] == "Validated"

def test_storefront_and_event_telemetry(client: TestClient):
    # 1. Fetch categories
    cats = client.get("/api/storefront/categories")
    assert cats.status_code == 200
    assert len(cats.json()) == 10

    # 2. Fetch products with filter
    prods = client.get("/api/storefront/products?limit=10")
    assert prods.status_code == 200
    prod_list = prods.json()
    assert len(prod_list) == 10
    first_prod = prod_list[0]

    # 3. Simulate first-party event tracking
    ev_res = client.post("/api/analytics/events", json={
        "event_name": "product_viewed",
        "user_id": "USR-TEST-001",
        "session_id": "sess_test_123",
        "product_id": first_prod["id"],
        "product_category": first_prod["category"]["name"],
        "device_type": "mobile",
        "is_synthetic": False
    })
    assert ev_res.status_code == 200
    assert ev_res.json()["event_name"] == "product_viewed"

    # 4. Simulate checkout
    order_res = client.post("/api/storefront/checkout", json={
        "customer_name": "Test Shopper",
        "customer_email": "test@threadiq.internal",
        "shipping_address": "Indiranagar 100ft Rd, Bengaluru",
        "payment_method": "UPI - Simulated",
        "items": [
            {
                "product_id": first_prod["id"],
                "size": "M",
                "quantity": 1,
                "unit_price": first_prod["price"]
            }
        ]
    })
    assert order_res.status_code == 200
    order_data = order_res.json()
    assert "order_number" in order_data
    assert order_data["status"] == "processing"

    # Track order
    track_res = client.get(f"/api/storefront/orders/{order_data['order_number']}")
    assert track_res.status_code == 200
    assert track_res.json()["id"] == order_data["id"]

def test_analytics_funnel_and_friction(client: TestClient):
    funnel = client.get("/api/analytics/funnel")
    assert funnel.status_code == 200
    data = funnel.json()
    assert len(data["steps"]) == 6
    assert data["total_starters"] > 0
    assert "overall_conversion_rate" in data

    root_cause = client.get("/api/analytics/root-cause")
    assert root_cause.status_code == 200
    rc_data = root_cause.json()
    assert "top_drop_off_categories" in rc_data
    assert "root_cause_hypothesis" in rc_data

def test_experiments_and_statistical_engine(client: TestClient):
    exps = client.get("/api/experiments")
    assert exps.status_code == 200
    assert len(exps.json()) >= 1
    exp_id = exps.json()[0]["id"]

    # Stable user assignment
    assign1 = client.post("/api/experiments/assign", json={
        "experiment_code": exps.json()[0]["code"],
        "user_id": "USR-REPEAT-999"
    })
    assert assign1.status_code == 200
    v1 = assign1.json()["assigned_variant"]

    # Verify deterministic consistency
    assign2 = client.post("/api/experiments/assign", json={
        "experiment_code": exps.json()[0]["code"],
        "user_id": "USR-REPEAT-999"
    })
    assert assign2.status_code == 200
    assert assign2.json()["assigned_variant"] == v1

    # Statistical analysis calculation
    stats_res = client.get(f"/api/experiments/{exp_id}/statistics")
    assert stats_res.status_code == 200
    s_data = stats_res.json()
    assert "z_score" in s_data
    assert "p_value" in s_data
    assert "decision" in s_data
    assert "confidence_level_percent" in s_data

def test_kanban_move_and_sprint(client: TestClient):
    stories = client.get("/api/delivery/stories")
    assert stories.status_code == 200
    story_list = stories.json()
    assert len(story_list) >= 1
    target_story = story_list[0]

    # Move story
    move_res = client.post("/api/delivery/stories/move", json={
        "story_id": target_story["id"],
        "new_status": "done"
    })
    assert move_res.status_code == 200
    assert move_res.json()["status"] == "done"

    # Sprint burndown
    sprint_res = client.get("/api/delivery/sprints")
    assert sprint_res.status_code == 200
    s_id = sprint_res.json()[0]["id"]

    burn_res = client.get(f"/api/delivery/sprints/{s_id}/burndown")
    assert burn_res.status_code == 200
    assert len(burn_res.json()["days"]) == 10

def test_launch_readiness_summary(client: TestClient):
    res = client.get("/api/operations/launch-readiness/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_items"] == 15
    assert "readiness_percentage" in data
    assert "items_by_category" in data

def test_ai_copilot_workflow(client: TestClient):
    req = {
        "prompt": "Synthesize the primary sizing friction and recommend an immediate product hypothesis.",
        "workflow_type": "customer_pain_point_extraction"
    }
    res = client.post("/api/copilot/generate", json=req)
    assert res.status_code == 200
    data = res.json()
    assert "summary_markdown" in data
    assert len(data["source_records_cited"]) >= 1
    assert "engine_mode" in data

def test_reports_excel_and_csv_export(client: TestClient):
    # CSV export
    csv_res = client.get("/api/reports/export/csv/funnel_analysis")
    assert csv_res.status_code == 200
    assert "event_id" in csv_res.text or "event_name" in csv_res.text

    # Excel multi-sheet export
    xlsx_res = client.get("/api/reports/export/excel")
    assert xlsx_res.status_code == 200
    assert len(xlsx_res.content) > 1000 # Valid non-empty binary excel
