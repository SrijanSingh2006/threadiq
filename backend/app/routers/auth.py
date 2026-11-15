from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.auth import User, AuditLog
from backend.app.schemas.auth import UserLogin, UserOut, Token, SwitchRoleRequest

router = APIRouter(prefix="/auth", tags=["Authentication & Roles"])

@router.post("/login", response_model=Token)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    # Accept demo credentials or existing user
    user = db.query(User).filter(User.email == creds.email).first()
    if not user:
        # Create user if logging in with standard demo email
        user = User(
            email=creds.email,
            hashed_password="pbkdf2_sha256$260000$demo$hash",
            full_name="Aarav Sharma" if "pm" in creds.email else "ThreadIQ User",
            role="Product Manager"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Log session
    log = AuditLog(
        user_id=user.id,
        user_name=user.full_name,
        action="LOGIN",
        entity="USER",
        entity_id=str(user.id),
        details=f"User signed in with role {user.role}"
    )
    db.add(log)
    db.commit()

    return {
        "access_token": f"tiq_demo_jwt_{user.id}_{user.role.lower().replace(' ', '_')}",
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.role == "Product Manager").first()
    if not user:
        user = db.query(User).first()
    return user

@router.post("/switch-role", response_model=UserOut)
def switch_role(req: SwitchRoleRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email.like("%threadiq.internal%")).first()
    if user:
        user.role = req.role
        db.commit()
        db.refresh(user)
    return user
