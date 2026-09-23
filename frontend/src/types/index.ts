export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type ThreatStatus = 'safe' | 'suspicious' | 'malicious';
export type AlertStatus = 'open' | 'acknowledged' | 'resolved' | 'blocked';
export type LogType = 'login' | 'activity' | 'attack' | 'packet' | 'error' | 'system';
export type LogLevel = 'info' | 'warning' | 'error' | 'critical';
export type ReportType = 'daily' | 'weekly' | 'monthly' | 'threat_summary' | 'ai_analysis';

export interface Alert {
  id: string;
  user_id: string;
  title: string;
  severity: Severity;
  alert_type: string;
  source_ip: string | null;
  destination_ip: string | null;
  status: AlertStatus;
  confidence: number;
  description: string | null;
  recommendation: string | null;
  created_at: string;
}

export interface Packet {
  id: string;
  user_id: string;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  port: number;
  packet_size: number;
  threat_status: ThreatStatus;
  confidence: number;
  threat_type: string | null;
  created_at: string;
}

export interface LogEntry {
  id: string;
  user_id: string;
  log_type: LogType;
  level: LogLevel;
  message: string;
  source: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  title: string;
  report_type: ReportType;
  summary: string | null;
  threat_count: number;
  data: Record<string, unknown> | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  message: string;
  category: string | null;
  created_at: string;
}

export interface ThreatIntel {
  id: string;
  intel_type: 'cve' | 'malware' | 'ioc' | 'global_attack';
  name: string;
  severity: Severity;
  description: string | null;
  affected_systems: string | null;
  indicator_value: string | null;
  indicator_type: string | null;
  region: string | null;
  first_seen: string;
  last_seen: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'dark' | 'light';
  email_alerts: boolean;
  sms_alerts: boolean;
  auto_block: boolean;
  ai_sensitivity: 'low' | 'medium' | 'high';
  language: string;
  two_factor_enabled: boolean;
  notification_sound: boolean;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  phone: string | null;
  organization: string | null;
  created_at: string;
  updated_at: string;
}

export interface LivePacket {
  id: string;
  sourceIp: string;
  destinationIp: string;
  country: string;
  protocol: string;
  port: number;
  size: number;
  device: string;
  threatStatus: ThreatStatus;
  confidence: number;
  riskScore: number;
  threatType: string | null;
  timestamp: number;
}

export interface AttackType {
  name: string;
  category: string;
  description: string;
  severity: Severity;
}

export interface Device {
  id: string;
  user_id: string;
  hostname: string;
  ip_address: string;
  mac_address: string | null;
  os_type: string | null;
  device_type: 'router' | 'switch' | 'server' | 'client' | 'firewall' | 'cloud' | 'iot';
  cpu_usage: number;
  ram_usage: number;
  storage_usage: number;
  status: 'online' | 'offline' | 'warning' | 'critical';
  patch_level: string;
  bandwidth_mbps: number;
  last_seen: string;
  created_at: string;
}
