import secrets
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.auth import (
    User,
    UserProfile,
    UserSession,
    RefreshToken,
    PasswordResetToken,
    EmailVerificationToken,
    AuditLog,
)
from backend.app.models.workspace import (
    Workspace,
    WorkspaceMembership,
    WorkspaceInvitation,
    WorkspaceSetting,
)
from backend.app.models.notifications import (
    Notification,
    NotificationPreference,
)
from backend.app.schemas.auth import (
    UserLogin,
    UserRegisterRequest,
    UserOut,
    Token,
    TokenRefreshRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    ChangePasswordRequest,
    UserProfileUpdate,
    UserSessionOut,
    SwitchRoleRequest,
    WorkspaceOut,
)
from backend.app.services.auth_service import (
    verify_password,
    get_password_hash,
    hash_token,
    validate_password_strength,
    create_access_token,
    create_refresh_token,
    create_session,
    get_current_user,
    get_current_workspace,
    RESET_TOKEN_EXPIRE_HOURS,
    VERIFICATION_TOKEN_EXPIRE_HOURS,
)

router = APIRouter(prefix="/auth", tags=["Authentication & User Management"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(req: UserRegisterRequest, request: Request, db: Session = Depends(get_db)):
    # 1. Check duplicate email
    existing_user = db.query(User).filter(User.email == req.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # 2. Validate password strength & confirmation
    if req.confirm_password and req.password != req.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and confirm password do not match."
        )
    validate_password_strength(req.password)

    # 3. Create user with safe default role (prevent self-escalation)
    hashed_pwd = get_password_hash(req.password)
    user = User(
        email=req.email.lower(),
        hashed_password=hashed_pwd,
        full_name=req.full_name.strip(),
        role="Product Manager", # Safe default role
        is_active=True,
        is_verified=True, # Verified by default in demo/dev mode
        onboarding_completed=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 4. Create UserProfile
    profile = UserProfile(user_id=user.id, bio="Product thinker building high-impact commerce experiences.")
    db.add(profile)

    # 5. Create default personal workspace for the user
    ws_name = req.workspace_name.strip() if req.workspace_name else f"{user.full_name}'s Workspace"
    ws_slug = f"ws-{user.id}-{secrets.token_hex(3)}"
    new_ws = Workspace(
        name=ws_name,
        slug=ws_slug,
        description=f"Primary Commerce Product Management workspace for {user.full_name}",
        owner_id=user.id,
        industry="Fashion & Apparel E-Commerce",
        size="10-50"
    )
    db.add(new_ws)
    db.commit()
    db.refresh(new_ws)

    # 6. Assign Workspace Owner membership
    mem = WorkspaceMembership(
        workspace_id=new_ws.id,
        user_id=user.id,
        role="Workspace Owner"
    )
    db.add(mem)

    # 7. Notification Preference & Welcome Notification
    notif_pref = NotificationPreference(user_id=user.id)
    db.add(notif_pref)
    
    welcome_notif = Notification(
        user_id=user.id,
        workspace_id=new_ws.id,
        title="Welcome to ThreadIQ! 🚀",
        message="Your commerce intelligence workspace is ready. Explore Customer Research, Funnels, and Sprint Kanban.",
        type="system",
        link_url="/"
    )
    db.add(welcome_notif)
    db.commit()

    # 8. Generate session, access token & refresh token
    create_session(db, user.id, request)
    access_token = create_access_token({"sub": str(user.id), "role": user.role, "ws": new_ws.id})
    refresh_token = create_refresh_token(db, user.id)

    ws_out = WorkspaceOut(
        id=new_ws.id,
        name=new_ws.name,
        slug=new_ws.slug,
        description=new_ws.description,
        logo_url=new_ws.logo_url,
        owner_id=new_ws.owner_id,
        industry=new_ws.industry,
        size=new_ws.size,
        created_at=new_ws.created_at,
        user_role="Workspace Owner"
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user,
        "workspace": ws_out,
        "active_workspace": ws_out
    }

@router.post("/login", response_model=Token)
def login(creds: UserLogin, request: Request, db: Session = Depends(get_db)):
    email = creds.email.lower().strip()
    user = db.query(User).filter(User.email == email).first()

    # Pre-seeded demo user creation if not found
    if not user:
        if "pm@" in email or "threadiq.internal" in email or email == "pm@threadiq.internal":
            user = User(
                email=email,
                hashed_password="pbkdf2_sha256$260000$demo$hash",
                full_name="Aarav Sharma" if "pm" in email else "ThreadIQ Member",
                role="Product Manager",
                is_active=True,
                is_verified=True,
                onboarding_completed=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )

    # Verify password
    if not verify_password(creds.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Contact your workspace administrator."
        )

    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()

    # Get or create active workspace
    membership = db.query(WorkspaceMembership).filter(
        WorkspaceMembership.user_id == user.id,
        WorkspaceMembership.is_active == True
    ).first()

    active_ws = None
    if membership:
        ws_obj = db.query(Workspace).filter(Workspace.id == membership.workspace_id).first()
        if ws_obj:
            active_ws = WorkspaceOut(
                id=ws_obj.id,
                name=ws_obj.name,
                slug=ws_obj.slug,
                description=ws_obj.description,
                logo_url=ws_obj.logo_url,
                owner_id=ws_obj.owner_id,
                industry=ws_obj.industry,
                size=ws_obj.size,
                created_at=ws_obj.created_at,
                user_role=membership.role
            )

    if not active_ws:
        default_ws = db.query(Workspace).order_by(Workspace.id.asc()).first()
        if default_ws:
            active_ws = WorkspaceOut(
                id=default_ws.id,
                name=default_ws.name,
                slug=default_ws.slug,
                description=default_ws.description,
                logo_url=default_ws.logo_url,
                owner_id=default_ws.owner_id,
                industry=default_ws.industry,
                size=default_ws.size,
                created_at=default_ws.created_at,
                user_role=user.role
            )

    # Generate tokens & session
    create_session(db, user.id, request)
    access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role,
        "ws": active_ws.id if active_ws else 1
    })
    refresh_token = create_refresh_token(db, user.id)

    # Audit log
    log = AuditLog(
        user_id=user.id,
        user_name=user.full_name,
        action="LOGIN",
        entity="USER",
        entity_id=str(user.id),
        details=f"User signed in successfully from {request.client.host if request.client else 'client'}"
    )
    db.add(log)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user,
        "active_workspace": active_ws
    }

@router.post("/refresh", response_model=Token)
def refresh_token(req: TokenRefreshRequest, db: Session = Depends(get_db)):
    token_h = hash_token(req.refresh_token)
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token_hash == token_h,
        RefreshToken.is_revoked == False,
        RefreshToken.expires_at > datetime.utcnow()
    ).first()

    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token."
        )

    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account inactive.")

    # Rotate refresh token
    db_token.is_revoked = True
    new_refresh_token = create_refresh_token(db, user.id)
    new_access_token = create_access_token({"sub": str(user.id), "role": user.role})

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "user": user,
        "active_workspace": None
    }

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Revoke all active refresh tokens for this user
    db.query(RefreshToken).filter(RefreshToken.user_id == current_user.id).update({"is_revoked": True})
    db.query(UserSession).filter(UserSession.user_id == current_user.id).update({"is_revoked": True})
    
    log = AuditLog(
        user_id=current_user.id,
        user_name=current_user.full_name,
        action="LOGOUT",
        entity="USER",
        entity_id=str(current_user.id),
        details="User logged out"
    )
    db.add(log)
    db.commit()
    return {"message": "Successfully logged out."}

@router.get("/me", response_model=UserOut)
def get_current_user_profile(user: User = Depends(get_current_user)):
    return user

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if user:
        raw_token = secrets.token_urlsafe(32)
        token_h = hash_token(raw_token)
        reset_tok = PasswordResetToken(
            user_id=user.id,
            token_hash=token_h,
            expires_at=datetime.utcnow() + timedelta(hours=RESET_TOKEN_EXPIRE_HOURS)
        )
        db.add(reset_tok)
        db.commit()
        # In development/demo, token hash is stored; an email link would be: /reset-password?token={raw_token}
    
    # Generic message prevents account enumeration
    return {
        "message": "If an account matches this email, a password reset link has been dispatched.",
        "status": "success"
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_h = hash_token(req.token)
    tok = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == token_h,
        PasswordResetToken.is_used == False,
        PasswordResetToken.expires_at > datetime.utcnow()
    ).first()

    if not tok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset token is invalid or has expired."
        )

    if req.confirm_password and req.new_password != req.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirmation do not match."
        )

    validate_password_strength(req.new_password)

    user = db.query(User).filter(User.id == tok.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.hashed_password = get_password_hash(req.new_password)
    tok.is_used = True
    
    # Revoke sessions
    db.query(UserSession).filter(UserSession.user_id == user.id).update({"is_revoked": True})
    db.query(RefreshToken).filter(RefreshToken.user_id == user.id).update({"is_revoked": True})
    db.commit()

    return {"message": "Password has been successfully updated. You may now log in with your new credentials."}

@router.post("/verify-email")
def verify_email(req: VerifyEmailRequest, db: Session = Depends(get_db)):
    token_h = hash_token(req.token)
    tok = db.query(EmailVerificationToken).filter(
        EmailVerificationToken.token_hash == token_h,
        EmailVerificationToken.is_used == False,
        EmailVerificationToken.expires_at > datetime.utcnow()
    ).first()

    if not tok:
        # Check if user with token exists or allow demo mock token
        if req.token == "demo-verify-token":
            return {"message": "Email address verified successfully!"}
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token is invalid or has expired."
        )

    tok.is_used = True
    user = db.query(User).filter(User.id == tok.user_id).first()
    if user:
        user.is_verified = True
    db.commit()

    return {"message": "Email address verified successfully. Full SaaS capabilities unlocked."}

@router.post("/change-password")
def change_password(
    req: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect."
        )

    if req.confirm_password and req.new_password != req.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirm password do not match."
        )

    validate_password_strength(req.new_password)
    current_user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password changed successfully."}

@router.get("/sessions", response_model=List[UserSessionOut])
def get_user_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(UserSession)
        .filter(UserSession.user_id == current_user.id, UserSession.is_revoked == False)
        .order_by(UserSession.last_activity.desc())
        .limit(10)
        .all()
    )
    return sessions

@router.delete("/sessions/{session_id}")
def revoke_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(UserSession).filter(
        UserSession.id == session_id,
        UserSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")

    session.is_revoked = True
    db.commit()
    return {"message": "Session revoked."}

@router.post("/switch-role", response_model=UserOut)
def switch_role(req: SwitchRoleRequest, db: Session = Depends(get_db)):
    # Support cross-functional persona switching for portfolio evaluation
    user = db.query(User).filter(User.email.like("%threadiq.internal%")).first()
    if not user:
        user = db.query(User).first()
    if user:
        user.role = req.role
        db.commit()
        db.refresh(user)
    return user
