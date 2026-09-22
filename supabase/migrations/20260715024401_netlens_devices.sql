/*
# NetLens - Add Devices Table

1. New Tables
- `devices` - network device inventory (hostname, ip, mac, os, cpu, ram, storage, status, patch_level, last_seen, device_type)

2. Security
- RLS enabled on devices.
- Owner-scoped via user_id with DEFAULT auth.uid().

3. Notes
- Supports the Device Management and Network Topology pages.
*/

CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  hostname text NOT NULL,
  ip_address text NOT NULL,
  mac_address text,
  os_type text,
  device_type text DEFAULT 'client' CHECK (device_type IN ('router', 'switch', 'server', 'client', 'firewall', 'cloud', 'iot')),
  cpu_usage integer DEFAULT 0,
  ram_usage integer DEFAULT 0,
  storage_usage integer DEFAULT 0,
  status text DEFAULT 'online' CHECK (status IN ('online', 'offline', 'warning', 'critical')),
  patch_level text DEFAULT 'current',
  bandwidth_mbps integer DEFAULT 0,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_devices" ON devices;
CREATE POLICY "select_own_devices" ON devices FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_devices" ON devices;
CREATE POLICY "insert_own_devices" ON devices FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_devices" ON devices;
CREATE POLICY "update_own_devices" ON devices FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_devices" ON devices;
CREATE POLICY "delete_own_devices" ON devices FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id);
