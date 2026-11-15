from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- USER & AUTHENTICATION SCHEMAS ---

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "Product Manager"
    job_title: Optional[str] = None
    department: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None

class UserRegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: Optional[str] = None
    workspace_name: Optional[str] = None
    role_preference: Optional[str] = "Product Manager"

class UserLogin(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class UserOut(UserBase):
    id: int
    is_active: bool
    is_verified: bool = True
    onboarding_completed: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class WorkspaceOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    owner_id: int
    industry: str
    size: str
    created_at: datetime
    user_role: Optional[str] = None

    class Config:
        from_attributes = True

class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    industry: Optional[str] = "Fashion & Apparel E-Commerce"
    size: Optional[str] = "10-50"

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    logo_url: Optional[str] = None

class WorkspaceMemberOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    role: str
    avatar_url: Optional[str] = None
    job_title: Optional[str] = None
    is_active: bool
    joined_at: datetime

    class Config:
        from_attributes = True

class WorkspaceInvitationCreate(BaseModel):
    email: EmailStr
    role: str = "Product Manager"

class WorkspaceInvitationOut(BaseModel):
    id: int
    workspace_id: int
    email: str
    role: str
    invited_by_name: Optional[str] = None
    token: Optional[str] = None
    status: str
    created_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: UserOut
    workspace: Optional[WorkspaceOut] = None
    active_workspace: Optional[WorkspaceOut] = None

class TokenRefreshRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: Optional[str] = None

class VerifyEmailRequest(BaseModel):
    token: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: Optional[str] = None

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None
    theme: Optional[str] = None

class UserSessionOut(BaseModel):
    id: int
    device_type: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    last_activity: datetime
    created_at: datetime
    is_current: bool = False

    class Config:
        from_attributes = True

class SwitchRoleRequest(BaseModel):
    role: str

class SwitchWorkspaceRequest(BaseModel):
    workspace_id: int

# --- NOTIFICATION SCHEMAS ---

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    link_url: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationPreferenceOut(BaseModel):
    email_notifications: bool
    task_alerts: bool
    experiment_alerts: bool
    release_alerts: bool
    weekly_digest: bool

    class Config:
        from_attributes = True

class NotificationPreferenceUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    task_alerts: Optional[bool] = None
    experiment_alerts: Optional[bool] = None
    release_alerts: Optional[bool] = None
    weekly_digest: Optional[bool] = None
