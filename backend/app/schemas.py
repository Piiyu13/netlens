from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    full_name: Optional[str] = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    role: str
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MeOut(BaseModel):
    user: UserOut
    profile: UserOut


# ---------- Profile ----------
class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    avatar_url: Optional[str] = None


# ---------- Settings ----------
class SettingsOut(BaseModel):
    id: UUID
    user_id: UUID
    theme: str
    email_alerts: bool
    sms_alerts: bool
    auto_block: bool
    ai_sensitivity: str
    language: str
    two_factor_enabled: bool
    notification_sound: bool

    class Config:
        from_attributes = True


class SettingsUpdate(BaseModel):
    theme: Optional[str] = None
    email_alerts: Optional[bool] = None
    sms_alerts: Optional[bool] = None
    auto_block: Optional[bool] = None
    ai_sensitivity: Optional[str] = None
    language: Optional[str] = None
    two_factor_enabled: Optional[bool] = None
    notification_sound: Optional[bool] = None


# ---------- Alerts ----------
class AlertCreate(BaseModel):
    title: str
    severity: str
    alert_type: str
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    status: Optional[str] = "open"
    confidence: Optional[float] = 0
    description: Optional[str] = None
    recommendation: Optional[str] = None


class AlertUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    recommendation: Optional[str] = None


class AlertOut(AlertCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Devices ----------
class DeviceCreate(BaseModel):
    hostname: str
    ip_address: str
    mac_address: Optional[str] = None
    os_type: Optional[str] = None
    device_type: Optional[str] = "client"
    cpu_usage: Optional[int] = 0
    ram_usage: Optional[int] = 0
    storage_usage: Optional[int] = 0
    status: Optional[str] = "online"
    patch_level: Optional[str] = "current"
    bandwidth_mbps: Optional[int] = 0


class DeviceUpdate(BaseModel):
    hostname: Optional[str] = None
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    os_type: Optional[str] = None
    device_type: Optional[str] = None
    cpu_usage: Optional[int] = None
    ram_usage: Optional[int] = None
    storage_usage: Optional[int] = None
    status: Optional[str] = None
    patch_level: Optional[str] = None
    bandwidth_mbps: Optional[int] = None


class DeviceOut(DeviceCreate):
    id: UUID
    user_id: UUID
    last_seen: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Packets ----------
class PacketCreate(BaseModel):
    source_ip: str
    destination_ip: str
    protocol: str
    port: Optional[int] = None
    packet_size: Optional[int] = None
    threat_status: Optional[str] = "safe"
    confidence: Optional[float] = 0
    threat_type: Optional[str] = None


class PacketOut(PacketCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Logs ----------
class LogCreate(BaseModel):
    log_type: str
    level: Optional[str] = "info"
    message: str
    source: Optional[str] = None
    ip_address: Optional[str] = None
    metadata: Optional[dict[str, Any]] = None


class LogOut(BaseModel):
    id: UUID
    user_id: UUID
    log_type: str
    level: str
    message: str
    source: Optional[str] = None
    ip_address: Optional[str] = None
    metadata: Optional[dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Reports ----------
class ReportCreate(BaseModel):
    title: str
    report_type: str
    summary: Optional[str] = None
    threat_count: Optional[int] = 0
    data: Optional[dict[str, Any]] = None


class ReportOut(ReportCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Chat ----------
class ChatCreate(BaseModel):
    role: str
    message: str
    category: Optional[str] = None


class ChatOut(ChatCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Threat intel ----------
class ThreatIntelCreate(BaseModel):
    intel_type: str
    name: str
    severity: Optional[str] = "medium"
    description: Optional[str] = None
    affected_systems: Optional[str] = None
    indicator_value: Optional[str] = None
    indicator_type: Optional[str] = None
    region: Optional[str] = None


class ThreatIntelOut(ThreatIntelCreate):
    id: UUID
    first_seen: Optional[datetime] = None
    last_seen: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Admin users ----------
class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
