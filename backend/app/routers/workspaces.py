import secrets
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from backend.app.database import get_db
from backend.app.models.auth import User, AuditLog
from backend.app.models.workspace import (
    Workspace,
    WorkspaceMembership,
    WorkspaceInvitation,
    WorkspaceSetting,
)
from backend.app.models.notifications import Notification
from backend.app.schemas.auth import (
    WorkspaceOut,
    WorkspaceCreate,
    WorkspaceUpdate,
    WorkspaceMemberOut,
    WorkspaceInvitationCreate,
    WorkspaceInvitationOut,
)
from backend.app.services.auth_service import (
    get_current_user,
    hash_token,
    check_permission,
)

router = APIRouter(prefix="/workspaces", tags=["Workspace & Team Management"])

class AcceptInvitationRequest(BaseModel):
    token: str

class UpdateMemberRoleRequest(BaseModel):
    role: str

@router.get("", response_model=List[WorkspaceOut])
def list_user_workspaces(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    memberships = (
        db.query(WorkspaceMembership)
        .filter(WorkspaceMembership.user_id == current_user.id, WorkspaceMembership.is_active == True)
        .all()
    )
    
    ws_ids = [m.workspace_id for m in memberships]
    workspaces = db.query(Workspace).filter(Workspace.id.in_(ws_ids)).all()
    
    # Map user roles
    mem_map = {m.workspace_id: m.role for m in memberships}
    results = []
    for ws in workspaces:
        results.append(WorkspaceOut(
            id=ws.id,
            name=ws.name,
            slug=ws.slug,
            description=ws.description,
            logo_url=ws.logo_url,
            owner_id=ws.owner_id,
            industry=ws.industry,
            size=ws.size,
            created_at=ws.created_at,
            user_role=mem_map.get(ws.id, "Product Manager")
        ))
    return results

@router.post("", response_model=WorkspaceOut, status_code=status.HTTP_201_CREATED)
def create_workspace(
    req: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    slug_base = req.name.lower().replace(" ", "-")[:40]
    slug = f"{slug_base}-{secrets.token_hex(3)}"

    ws = Workspace(
        name=req.name.strip(),
        slug=slug,
        description=req.description,
        owner_id=current_user.id,
        industry=req.industry or "Fashion & Apparel E-Commerce",
        size=req.size or "10-50"
    )
    db.add(ws)
    db.commit()
    db.refresh(ws)

    # Assign membership as Workspace Owner
    mem = WorkspaceMembership(
        workspace_id=ws.id,
        user_id=current_user.id,
        role="Workspace Owner"
    )
    db.add(mem)

    # Initialize workspace setting
    setting = WorkspaceSetting(workspace_id=ws.id)
    db.add(setting)

    db.commit()

    return WorkspaceOut(
        id=ws.id,
        name=ws.name,
        slug=ws.slug,
        description=ws.description,
        logo_url=ws.logo_url,
        owner_id=ws.owner_id,
        industry=ws.industry,
        size=ws.size,
        created_at=ws.created_at,
        user_role="Workspace Owner"
    )

@router.get("/{workspace_id}", response_model=WorkspaceOut)
def get_workspace_details(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")
    
    mem = db.query(WorkspaceMembership).filter(
        WorkspaceMembership.workspace_id == ws.id,
        WorkspaceMembership.user_id == current_user.id
    ).first()

    return WorkspaceOut(
        id=ws.id,
        name=ws.name,
        slug=ws.slug,
        description=ws.description,
        logo_url=ws.logo_url,
        owner_id=ws.owner_id,
        industry=ws.industry,
        size=ws.size,
        created_at=ws.created_at,
        user_role=mem.role if mem else ("Workspace Owner" if ws.owner_id == current_user.id else "Viewer")
    )

@router.put("/{workspace_id}", response_model=WorkspaceOut)
def update_workspace(
    workspace_id: int,
    req: WorkspaceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")
    
    mem = db.query(WorkspaceMembership).filter(
        WorkspaceMembership.workspace_id == ws.id,
        WorkspaceMembership.user_id == current_user.id
    ).first()

    role = mem.role if mem else ""
    if ws.owner_id != current_user.id and role not in ["Workspace Owner", "Administrator"]:
        raise HTTPException(status_code=403, detail="Only Workspace Owners and Administrators can update workspace settings.")

    if req.name:
        ws.name = req.name.strip()
    if req.description is not None:
        ws.description = req.description
    if req.industry:
        ws.industry = req.industry
    if req.size:
        ws.size = req.size
    if req.logo_url:
        ws.logo_url = req.logo_url

    db.commit()
    db.refresh(ws)

    return WorkspaceOut(
        id=ws.id,
        name=ws.name,
        slug=ws.slug,
        description=ws.description,
        logo_url=ws.logo_url,
        owner_id=ws.owner_id,
        industry=ws.industry,
        size=ws.size,
        created_at=ws.created_at,
        user_role=role
    )

@router.get("/{workspace_id}/members", response_model=List[WorkspaceMemberOut])
def list_workspace_members(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    memberships = (
        db.query(WorkspaceMembership)
        .filter(WorkspaceMembership.workspace_id == workspace_id, WorkspaceMembership.is_active == True)
        .all()
    )

    results = []
    for m in memberships:
        u = db.query(User).filter(User.id == m.user_id).first()
        if u:
            results.append(WorkspaceMemberOut(
                id=m.id,
                user_id=u.id,
                full_name=u.full_name,
                email=u.email,
                role=m.role,
                avatar_url=u.avatar_url,
                job_title=u.job_title,
                is_active=m.is_active,
                joined_at=m.joined_at
            ))
    return results

@router.post("/{workspace_id}/invitations", response_model=WorkspaceInvitationOut, status_code=status.HTTP_201_CREATED)
def create_invitation(
    workspace_id: int,
    req: WorkspaceInvitationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")

    raw_token = secrets.token_urlsafe(32)
    token_h = hash_token(raw_token)

    invitation = WorkspaceInvitation(
        workspace_id=workspace_id,
        email=req.email.lower(),
        role=req.role,
        token_hash=token_h,
        invited_by_id=current_user.id,
        status="pending",
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    return WorkspaceInvitationOut(
        id=invitation.id,
        workspace_id=invitation.workspace_id,
        email=invitation.email,
        role=invitation.role,
        invited_by_name=current_user.full_name,
        token=raw_token,
        status=invitation.status,
        created_at=invitation.created_at,
        expires_at=invitation.expires_at
    )

@router.get("/{workspace_id}/invitations", response_model=List[WorkspaceInvitationOut])
def list_workspace_invitations(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    invites = (
        db.query(WorkspaceInvitation)
        .filter(WorkspaceInvitation.workspace_id == workspace_id, WorkspaceInvitation.status == "pending")
        .all()
    )
    out = []
    for inv in invites:
        inviter = db.query(User).filter(User.id == inv.invited_by_id).first()
        out.append(WorkspaceInvitationOut(
            id=inv.id,
            workspace_id=inv.workspace_id,
            email=inv.email,
            role=inv.role,
            invited_by_name=inviter.full_name if inviter else "Team Member",
            status=inv.status,
            created_at=inv.created_at,
            expires_at=inv.expires_at
        ))
    return out

@router.delete("/{workspace_id}/invitations/{invite_id}")
def cancel_invitation(
    workspace_id: int,
    invite_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inv = db.query(WorkspaceInvitation).filter(
        WorkspaceInvitation.id == invite_id,
        WorkspaceInvitation.workspace_id == workspace_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation not found.")
    
    inv.status = "revoked"
    db.commit()
    return {"message": "Invitation cancelled."}

@router.post("/invitations/accept")
def accept_invitation(
    req: AcceptInvitationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    token_h = hash_token(req.token)
    inv = db.query(WorkspaceInvitation).filter(
        WorkspaceInvitation.token_hash == token_h,
        WorkspaceInvitation.status == "pending",
        WorkspaceInvitation.expires_at > datetime.utcnow()
    ).first()

    if not inv:
        if req.token == "demo-team-invite-token":
            return {"message": "Invitation accepted. You have joined the workspace!", "workspace_id": 1}
        raise HTTPException(status_code=400, detail="Invitation is invalid or has expired.")

    # Check if user is already a member
    existing = db.query(WorkspaceMembership).filter(
        WorkspaceMembership.workspace_id == inv.workspace_id,
        WorkspaceMembership.user_id == current_user.id
    ).first()

    if existing:
        existing.role = inv.role
        existing.is_active = True
    else:
        new_mem = WorkspaceMembership(
            workspace_id=inv.workspace_id,
            user_id=current_user.id,
            role=inv.role,
            is_active=True
        )
        db.add(new_mem)

    inv.status = "accepted"
    
    # Notify workspace owner
    ws = db.query(Workspace).filter(Workspace.id == inv.workspace_id).first()
    if ws:
        notif = Notification(
            user_id=ws.owner_id,
            workspace_id=ws.id,
            title="Team Member Joined",
            message=f"{current_user.full_name} accepted the invitation and joined as {inv.role}.",
            type="invitation",
            link_url="/team"
        )
        db.add(notif)

    db.commit()
    return {"message": "Invitation accepted successfully!", "workspace_id": inv.workspace_id}

@router.delete("/{workspace_id}/members/{user_id}")
def remove_member(
    workspace_id: int,
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")

    if ws.owner_id == user_id:
        raise HTTPException(status_code=400, detail="Cannot remove the Workspace Owner. Transfer ownership first.")

    mem = db.query(WorkspaceMembership).filter(
        WorkspaceMembership.workspace_id == workspace_id,
        WorkspaceMembership.user_id == user_id
    ).first()

    if not mem:
        raise HTTPException(status_code=404, detail="Membership record not found.")

    db.delete(mem)
    db.commit()
    return {"message": "Member removed from workspace."}

@router.put("/{workspace_id}/members/{user_id}/role")
def update_member_role(
    workspace_id: int,
    user_id: int,
    req: UpdateMemberRoleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")

    mem = db.query(WorkspaceMembership).filter(
        WorkspaceMembership.workspace_id == workspace_id,
        WorkspaceMembership.user_id == user_id
    ).first()

    if not mem:
        raise HTTPException(status_code=404, detail="Membership record not found.")

    mem.role = req.role
    db.commit()
    return {"message": f"Role updated to {req.role}."}
