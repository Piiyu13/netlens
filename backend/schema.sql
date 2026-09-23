-- NetLens PostgreSQL schema (replaces Supabase migrations)
-- Run with: psql $DATABASE_URL -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users (replaces auth.users + public.profiles)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'analyst',
  avatar_url TEXT,
  phone TEXT,
  organization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  alert_type TEXT NOT NULL,
  source_ip TEXT,
  destination_ip TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved', 'blocked')),
  confidence NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Packets
CREATE TABLE IF NOT EXISTS packets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_ip TEXT NOT NULL,
  destination_ip TEXT NOT NULL,
  protocol TEXT NOT NULL,
  port INTEGER,
  packet_size INTEGER,
  threat_status TEXT NOT NULL DEFAULT 'safe' CHECK (threat_status IN ('safe', 'suspicious', 'malicious')),
  confidence NUMERIC NOT NULL DEFAULT 0,
  threat_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Logs
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL CHECK (log_type IN ('login', 'activity', 'attack', 'packet', 'error', 'system')),
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warning', 'error', 'critical')),
  message TEXT NOT NULL,
  source TEXT,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'threat_summary', 'ai_analysis')),
  summary TEXT,
  threat_count INTEGER NOT NULL DEFAULT 0,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat history
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Threat intel (global, no user_id)
CREATE TABLE IF NOT EXISTS threat_intel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intel_type TEXT NOT NULL CHECK (intel_type IN ('cve', 'malware', 'ioc', 'global_attack')),
  name TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  description TEXT,
  affected_systems TEXT,
  indicator_value TEXT,
  indicator_type TEXT,
  region TEXT,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  email_alerts BOOLEAN NOT NULL DEFAULT true,
  sms_alerts BOOLEAN NOT NULL DEFAULT false,
  auto_block BOOLEAN NOT NULL DEFAULT true,
  ai_sensitivity TEXT NOT NULL DEFAULT 'medium' CHECK (ai_sensitivity IN ('low', 'medium', 'high')),
  language TEXT NOT NULL DEFAULT 'en',
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  notification_sound BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Devices
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hostname TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  mac_address TEXT,
  os_type TEXT,
  device_type TEXT NOT NULL DEFAULT 'client'
    CHECK (device_type IN ('router', 'switch', 'server', 'client', 'firewall', 'cloud', 'iot')),
  cpu_usage INTEGER NOT NULL DEFAULT 0,
  ram_usage INTEGER NOT NULL DEFAULT 0,
  storage_usage INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'warning', 'critical')),
  patch_level TEXT NOT NULL DEFAULT 'current',
  bandwidth_mbps INTEGER NOT NULL DEFAULT 0,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_alerts_user_created ON alerts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_packets_user_created ON packets(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_user_created ON logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_user_created ON reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_user_created ON chat_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_threat_intel_type ON threat_intel(intel_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Keep updated_at fresh on users
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
