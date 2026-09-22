/*
# NetLens - AI Network Intrusion Detection System Schema

1. New Tables
- `profiles` - user profile info linked to auth.users (full_name, role, avatar_url, phone)
- `alerts` - security alerts (severity, type, source_ip, status, confidence, description, recommendation)
- `packets` - captured network packets (source_ip, dest_ip, protocol, port, size, threat_status, confidence)
- `logs` - system logs (login, activity, attack, packet, error, system categories)
- `reports` - generated reports (daily/weekly/monthly, threat summary, AI analysis)
- `chat_history` - AI chat assistant conversations (role, message)
- `threat_intel` - threat intelligence entries (CVE, malware, IOC data)
- `user_settings` - per-user settings (theme, alerts, sensitivity, language)

2. Security
- RLS enabled on all tables.
- profiles: authenticated users read/update own profile.
- alerts, packets, logs, reports, chat_history, user_settings: owner-scoped via user_id with DEFAULT auth.uid().
- threat_intel: shared/read-only to all authenticated users (global intelligence data).

3. Notes
- All owner-scoped tables use user_id uuid NOT NULL DEFAULT auth.uid() so client inserts omitting user_id succeed.
- threat_intel is seeded with global data shared across all users (authenticated read-only, no user_id).
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'analyst',
  avatar_url text,
  phone text,
  organization text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  alert_type text NOT NULL,
  source_ip text,
  destination_ip text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved', 'blocked')),
  confidence numeric DEFAULT 0,
  description text,
  recommendation text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_alerts" ON alerts;
CREATE POLICY "select_own_alerts" ON alerts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_alerts" ON alerts;
CREATE POLICY "insert_own_alerts" ON alerts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_alerts" ON alerts;
CREATE POLICY "update_own_alerts" ON alerts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_alerts" ON alerts;
CREATE POLICY "delete_own_alerts" ON alerts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Packets table
CREATE TABLE IF NOT EXISTS packets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  source_ip text NOT NULL,
  destination_ip text NOT NULL,
  protocol text NOT NULL,
  port integer,
  packet_size integer,
  threat_status text DEFAULT 'safe' CHECK (threat_status IN ('safe', 'suspicious', 'malicious')),
  confidence numeric DEFAULT 0,
  threat_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE packets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_packets" ON packets;
CREATE POLICY "select_own_packets" ON packets FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_packets" ON packets;
CREATE POLICY "insert_own_packets" ON packets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_packets" ON packets;
CREATE POLICY "update_own_packets" ON packets FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_packets" ON packets;
CREATE POLICY "delete_own_packets" ON packets FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  log_type text NOT NULL CHECK (log_type IN ('login', 'activity', 'attack', 'packet', 'error', 'system')),
  level text DEFAULT 'info' CHECK (level IN ('info', 'warning', 'error', 'critical')),
  message text NOT NULL,
  source text,
  ip_address text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_logs" ON logs;
CREATE POLICY "select_own_logs" ON logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_logs" ON logs;
CREATE POLICY "insert_own_logs" ON logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_logs" ON logs;
CREATE POLICY "update_own_logs" ON logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_logs" ON logs;
CREATE POLICY "delete_own_logs" ON logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'threat_summary', 'ai_analysis')),
  summary text,
  threat_count integer DEFAULT 0,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reports" ON reports;
CREATE POLICY "select_own_reports" ON reports FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reports" ON reports;
CREATE POLICY "insert_own_reports" ON reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reports" ON reports;
CREATE POLICY "update_own_reports" ON reports FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reports" ON reports;
CREATE POLICY "delete_own_reports" ON reports FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Chat history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  message text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_chat" ON chat_history;
CREATE POLICY "select_own_chat" ON chat_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_chat" ON chat_history;
CREATE POLICY "insert_own_chat" ON chat_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_chat" ON chat_history;
CREATE POLICY "delete_own_chat" ON chat_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Threat intelligence table (shared global data)
CREATE TABLE IF NOT EXISTS threat_intel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intel_type text NOT NULL CHECK (intel_type IN ('cve', 'malware', 'ioc', 'global_attack')),
  name text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  description text,
  affected_systems text,
  indicator_value text,
  indicator_type text,
  region text,
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE threat_intel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_threat_intel" ON threat_intel;
CREATE POLICY "read_threat_intel" ON threat_intel FOR SELECT
  TO authenticated USING (true);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  email_alerts boolean DEFAULT true,
  sms_alerts boolean DEFAULT false,
  auto_block boolean DEFAULT true,
  ai_sensitivity text DEFAULT 'medium' CHECK (ai_sensitivity IN ('low', 'medium', 'high')),
  language text DEFAULT 'en',
  two_factor_enabled boolean DEFAULT false,
  notification_sound boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_settings" ON user_settings;
CREATE POLICY "select_own_settings" ON user_settings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_settings" ON user_settings;
CREATE POLICY "insert_own_settings" ON user_settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_settings" ON user_settings;
CREATE POLICY "update_own_settings" ON user_settings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_user_created ON alerts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_packets_user_created ON packets(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_user_created ON logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_user_created ON reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_user_created ON chat_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_intel_type ON threat_intel(intel_type);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
