from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from backend.app.database import get_db
from backend.app.models.auth import User, UserProfile
from backend.app.schemas.auth import UserOut, UserProfileUpdate
from backend.app.services.auth_service import get_current_user

router = APIRouter(prefix="/users", tags=["User Profile & Preferences"])

class OnboardingCompleteRequest(BaseModel):
    workspace_name: Optional[str] = None
    role_preference: Optional[str] = None
    selected_modules: Optional[list] = []

@router.get("/profile")
@router.get("/me/profile")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    return {
        "user": current_user,
        "profile": {
            "bio": profile.bio if profile else "",
            "timezone": profile.timezone if profile else "Asia/Kolkata",
            "theme": profile.theme if profile else "light",
            "language": profile.language if profile else "en"
        }
    }

@router.put("/profile")
@router.put("/me/profile")
def update_profile(
    req: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.full_name:
        current_user.full_name = req.full_name.strip()
    if req.job_title is not None:
        current_user.job_title = req.job_title
    if req.department is not None:
        current_user.department = req.department
    if req.phone_number is not None:
        current_user.phone_number = req.phone_number

    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    if req.bio is not None:
        profile.bio = req.bio
    if req.timezone:
        profile.timezone = req.timezone
    if req.theme:
        profile.theme = req.theme

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully.",
        "user": current_user,
        "profile": {
            "bio": profile.bio,
            "timezone": profile.timezone,
            "theme": profile.theme,
            "language": profile.language
        }
    }

@router.post("/onboarding/complete")
def complete_onboarding(
    req: OnboardingCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.onboarding_completed = True
    if req.role_preference:
        current_user.role = req.role_preference
    db.commit()
    return {"message": "Onboarding completed successfully. Welcome to ThreadIQ!", "status": "success"}
