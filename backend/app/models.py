import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID

from .database import Base


def _uuid():
    return uuid.uuid4()


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    email = Column(Text, unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    full_name = Column(Text)
    role = Column(Text, nullable=False, default="analyst")
    avatar_url = Column(Text)
    phone = Column(Text)
    organization = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    theme = Column(Text, nullable=False, default="dark")
    email_alerts = Column(Boolean, nullable=False, default=True)
    sms_alerts = Column(Boolean, nullable=False, default=False)
    auto_block = Column(Boolean, nullable=False, default=True)
    ai_sensitivity = Column(Text, nullable=False, default="medium")
    language = Column(Text, nullable=False, default="en")
    two_factor_enabled = Column(Boolean, nullable=False, default=False)
    notification_sound = Column(Boolean, nullable=False, default=True)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(Text, nullable=False)
    severity = Column(Text, nullable=False)
    alert_type = Column(Text, nullable=False)
    source_ip = Column(Text)
    destination_ip = Column(Text)
    status = Column(Text, nullable=False, default="open")
    confidence = Column(Numeric, nullable=False, default=0)
    description = Column(Text)
    recommendation = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class Packet(Base):
    __tablename__ = "packets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    source_ip = Column(Text, nullable=False)
    destination_ip = Column(Text, nullable=False)
    protocol = Column(Text, nullable=False)
    port = Column(Integer)
    packet_size = Column(Integer)
    threat_status = Column(Text, nullable=False, default="safe")
    confidence = Column(Numeric, nullable=False, default=0)
    threat_type = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class Log(Base):
    __tablename__ = "logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    log_type = Column(Text, nullable=False)
    level = Column(Text, nullable=False, default="info")
    message = Column(Text, nullable=False)
    source = Column(Text)
    ip_address = Column(Text)
    meta = Column("metadata", JSONB)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(Text, nullable=False)
    report_type = Column(Text, nullable=False)
    summary = Column(Text)
    threat_count = Column(Integer, nullable=False, default=0)
    data = Column(JSONB)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class ChatMessage(Base):
    __tablename__ = "chat_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    category = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class ThreatIntel(Base):
    __tablename__ = "threat_intel"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    intel_type = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    severity = Column(Text, nullable=False, default="medium")
    description = Column(Text)
    affected_systems = Column(Text)
    indicator_value = Column(Text)
    indicator_type = Column(Text)
    region = Column(Text)
    first_seen = Column(DateTime(timezone=True), default=datetime.utcnow)
    last_seen = Column(DateTime(timezone=True), default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class Device(Base):
    __tablename__ = "devices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    hostname = Column(Text, nullable=False)
    ip_address = Column(Text, nullable=False)
    mac_address = Column(Text)
    os_type = Column(Text)
    device_type = Column(Text, nullable=False, default="client")
    cpu_usage = Column(Integer, nullable=False, default=0)
    ram_usage = Column(Integer, nullable=False, default=0)
    storage_usage = Column(Integer, nullable=False, default=0)
    status = Column(Text, nullable=False, default="online")
    patch_level = Column(Text, nullable=False, default="current")
    bandwidth_mbps = Column(Integer, nullable=False, default=0)
    last_seen = Column(DateTime(timezone=True), default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
