import type { LivePacket, ThreatStatus, Severity, AttackType } from '../types';

const SAMPLE_IPS = [
  '192.168.1.10', '192.168.1.20', '10.0.0.5', '10.0.0.15', '172.16.0.8',
  '45.227.255.206', '185.220.101.45', '203.0.113.50', '198.51.100.23',
  '91.214.124.18', '188.166.93.41', '212.193.30.99', '88.218.204.12',
  '103.45.227.89', '193.27.228.5', '146.70.201.45', '51.158.144.33',
];

const PROTOCOLS = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP', 'SMTP', 'ICMP', 'TLS'];
const COMMON_PORTS: Record<string, number> = {
  HTTP: 80, HTTPS: 443, DNS: 53, SSH: 22, FTP: 21, SMTP: 25, ICMP: 0, TLS: 443,
};

export const ATTACK_TYPES: AttackType[] = [
  { name: 'DDoS Attack', category: 'Volumetric', description: 'Distributed denial of service flooding target with traffic from multiple sources', severity: 'critical' },
  { name: 'SQL Injection', category: 'Web Attack', description: 'Malicious SQL code injection via input parameters to access or corrupt databases', severity: 'high' },
  { name: 'XSS Attempt', category: 'Web Attack', description: 'Cross-site scripting payload injected through HTTP requests to steal session tokens', severity: 'medium' },
  { name: 'Port Scan', category: 'Reconnaissance', description: 'Sequential probing of ports to map open services and vulnerabilities', severity: 'medium' },
  { name: 'Brute Force', category: 'Credential', description: 'Systematic password guessing against authentication services using automated tools', severity: 'high' },
  { name: 'Malware C2', category: 'Malware', description: 'Command and control beaconing to external server coordinating infected hosts', severity: 'critical' },
  { name: 'Trojan', category: 'Malware', description: 'Disguised malicious software creating backdoor access for remote attackers', severity: 'critical' },
  { name: 'Worm', category: 'Malware', description: 'Self-replicating malware spreading across network without user interaction', severity: 'high' },
  { name: 'Ransomware', category: 'Malware', description: 'File encryption malware attempting lateral movement and data extortion', severity: 'critical' },
  { name: 'Spyware', category: 'Malware', description: 'Covert surveillance software exfiltrating keystrokes and screen captures', severity: 'high' },
  { name: 'Botnet', category: 'Botnet', description: 'Automated bot traffic pattern from known botnet participating in coordinated attacks', severity: 'high' },
  { name: 'DNS Spoofing', category: 'DNS Attack', description: 'Forged DNS responses redirecting traffic to malicious infrastructure', severity: 'high' },
  { name: 'ARP Spoofing', category: 'L2 Attack', description: 'ARP cache poisoning for man-in-the-middle positioning on local network', severity: 'high' },
  { name: 'MITM Attack', category: 'Interception', description: 'Man-in-the-middle intercepting and modifying encrypted communications', severity: 'critical' },
  { name: 'Insider Threat', category: 'Behavioral', description: 'Anomalous data access and exfiltration from authenticated internal user', severity: 'high' },
  { name: 'Data Exfiltration', category: 'Exfiltration', description: 'Unauthorized bulk data transfer to external destination via covert channel', severity: 'critical' },
  { name: 'Zero-Day Exploit', category: 'Unknown', description: 'Previously unknown vulnerability exploitation attempt with no signature available', severity: 'critical' },
  { name: 'Beaconing', category: 'C2', description: 'Periodic outbound connections to C2 infrastructure indicating compromised host', severity: 'high' },
  { name: 'Credential Stuffing', category: 'Credential', description: 'Automated injection of breached username/password pairs against multiple services', severity: 'high' },
  { name: 'Phishing', category: 'Social', description: 'Credential harvesting via deceptive network requests mimicking legitimate services', severity: 'medium' },
];

function randomIp(): string {
  return SAMPLE_IPS[Math.floor(Math.random() * SAMPLE_IPS.length)];
}

function randomProtocol(): string {
  return PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
}

const SOURCE_COUNTRIES = ['China', 'Russia', 'USA', 'Brazil', 'India', 'Netherlands', 'Germany', 'North Korea', 'Iran', 'Ukraine', 'Vietnam', 'France'];
const DEVICE_NAMES = ['WEB-SRV-01', 'DB-SRV-02', 'APP-SRV-03', 'CORE-RTR-01', 'SW-FLOOR-A', 'FW-EDGE-01', 'WS-JOHN-PC', 'IOT-CAM-03', 'CLOUD-AWS-01', 'WS-SARA-MAC'];

export function generatePacket(): LivePacket {
  const protocol = randomProtocol();
  const isInternal = Math.random() < 0.5;
  const threatRoll = Math.random();
  let threatStatus: ThreatStatus = 'safe';
  let threatType: string | null = null;
  let confidence = Math.floor(Math.random() * 30 + 70);
  let riskScore = Math.floor(Math.random() * 20 + 5);

  if (threatRoll > 0.88) {
    threatStatus = 'malicious';
    threatType = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)].name;
    confidence = Math.floor(Math.random() * 15 + 85);
    riskScore = Math.floor(Math.random() * 30 + 70);
  } else if (threatRoll > 0.7) {
    threatStatus = 'suspicious';
    threatType = ATTACK_TYPES[Math.floor(Math.random() * 5)].name;
    confidence = Math.floor(Math.random() * 25 + 50);
    riskScore = Math.floor(Math.random() * 30 + 40);
  } else {
    confidence = Math.floor(Math.random() * 20 + 80);
    riskScore = Math.floor(Math.random() * 15 + 1);
  }

  return {
    id: `pkt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sourceIp: isInternal ? '192.168.1.' + Math.floor(Math.random() * 254 + 1) : randomIp(),
    destinationIp: isInternal ? randomIp() : '192.168.1.' + Math.floor(Math.random() * 254 + 1),
    country: SOURCE_COUNTRIES[Math.floor(Math.random() * SOURCE_COUNTRIES.length)],
    protocol,
    port: COMMON_PORTS[protocol] || Math.floor(Math.random() * 65535),
    size: Math.floor(Math.random() * 1500 + 64),
    device: DEVICE_NAMES[Math.floor(Math.random() * DEVICE_NAMES.length)],
    threatStatus,
    confidence,
    riskScore,
    threatType,
    timestamp: Date.now(),
  };
}

export function generatePackets(count: number): LivePacket[] {
  return Array.from({ length: count }, () => generatePacket());
}

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

export const THREAT_STATUS_COLORS: Record<ThreatStatus, string> = {
  safe: '#22c55e',
  suspicious: '#eab308',
  malicious: '#ef4444',
};

export function generateTimeSeriesData(points: number, base: number, variance: number): number[] {
  return Array.from({ length: points }, () => {
    return Math.max(0, base + (Math.random() - 0.5) * variance);
  });
}

export function generateTrafficData(points: number): { in: number; out: number }[] {
  return Array.from({ length: points }, () => ({
    in: Math.floor(Math.random() * 500 + 200),
    out: Math.floor(Math.random() * 400 + 150),
  }));
}

export function randomConfidence(): number {
  return Math.floor(Math.random() * 20 + 80);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function timeAgo(timestamp: number | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
