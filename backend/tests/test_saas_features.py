import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import get_db, SessionLocal
from backend.app.models.auth import User
from backend.app.models.workspace import Workspace, WorkspaceMembership

client = TestClient(app)

def test_saas_register_and_login():
    unique_email = f"saas_test_user_{id(client)}@threadiq.internal"
    
    # Register new user
    reg_payload = {
        "email": unique_email,
        "password": "StrongPassword123!@",
        "full_name": "Test SaaS Founder",
        "role": "Product Manager",
        "job_title": "Principal PM",
        "department": "Core Discovery",
        "workspace_name": "SaaS Test Fashion Pod"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 201, res.text
    data = res.json()
    assert "access_token" in data
    assert "user" in data
    assert data["user"]["email"] == unique_email
    assert data["user"]["full_name"] == "Test SaaS Founder"
    assert "workspace" in data
    assert data["workspace"]["name"] == "SaaS Test Fashion Pod"

    access_token = data["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    # Verify /auth/me returns current user profile
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == unique_email

    # Test login
    login_res = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "StrongPassword123!@"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    assert "refresh_token" in login_data

def test_saas_workspaces_crud():
    # Login as default seeded PM
    login_res = client.post("/api/auth/login", json={
        "email": "pm@threadiq.internal",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List user workspaces
    ws_list_res = client.get("/api/workspaces", headers=headers)
    assert ws_list_res.status_code == 200
    workspaces = ws_list_res.json()
    assert len(workspaces) >= 1

    # Create new workspace
    new_ws_res = client.post("/api/workspaces", json={
        "name": "Luxury Apparel Pod",
        "description": "Premium brand intelligence pod"
    }, headers=headers)
    assert new_ws_res.status_code == 201
    new_ws = new_ws_res.json()
    assert new_ws["name"] == "Luxury Apparel Pod"
    ws_id = new_ws["id"]

    # Read workspace
    get_ws_res = client.get(f"/api/workspaces/{ws_id}", headers=headers)
    assert get_ws_res.status_code == 200

    # List members
    members_res = client.get(f"/api/workspaces/{ws_id}/members", headers=headers)
    assert members_res.status_code == 200
    members = members_res.json()
    assert len(members) >= 1

    # Invite new member
    invite_res = client.post(f"/api/workspaces/{ws_id}/invitations", json={
        "email": "colleague@threadiq.internal",
        "role": "Product Analyst"
    }, headers=headers)
    assert invite_res.status_code == 201
    invite_data = invite_res.json()
    assert "token" in invite_data

def test_saas_notifications():
    # Login as PM
    login_res = client.post("/api/auth/login", json={
        "email": "pm@threadiq.internal",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get notifications
    notif_res = client.get("/api/notifications", headers=headers)
    assert notif_res.status_code == 200
    assert isinstance(notif_res.json(), list)

    # Get unread count
    count_res = client.get("/api/notifications/unread-count", headers=headers)
    assert count_res.status_code == 200
    assert "unread_count" in count_res.json()

    # Mark all read
    read_all_res = client.post("/api/notifications/mark-all-read", headers=headers)
    assert read_all_res.status_code == 200

def test_saas_user_profile():
    login_res = client.post("/api/auth/login", json={
        "email": "pm@threadiq.internal",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get profile
    prof_res = client.get("/api/users/me/profile", headers=headers)
    assert prof_res.status_code == 200
    prof = prof_res.json()
    user_data = prof.get("user") or prof
    assert "full_name" in user_data

    # Update profile
    update_res = client.put("/api/users/me/profile", json={
        "bio": "Lead fashion e-commerce product manager driving fit accuracy.",
        "timezone": "Asia/Kolkata",
        "job_title": "Staff PM"
    }, headers=headers)
    assert update_res.status_code == 200
    res_data = update_res.json()
    user_res = res_data.get("user") or res_data
    assert user_res["job_title"] == "Staff PM"
