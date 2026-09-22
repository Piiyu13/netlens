import { type LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  group?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboardIcon, group: 'main' },
  { label: 'Live Monitoring', path: '/monitoring', icon: ActivityIcon, group: 'monitoring' },
  { label: 'AI Threat Detection', path: '/threat-detection', icon: BrainIcon, group: 'ai' },
  { label: 'AI Attack Prediction', path: '/attack-prediction', icon: TrendingUpIcon, group: 'ai' },
  { label: 'Packet Analyzer', path: '/packet-analyzer', icon: PackageIcon, group: 'monitoring' },
  { label: 'Alerts Center', path: '/alerts', icon: BellIcon, group: 'monitoring' },
  { label: 'Reports', path: '/reports', icon: FileTextIcon, group: 'analysis' },
  { label: 'Logs', path: '/logs', icon: ScrollTextIcon, group: 'analysis' },
  { label: 'Performance', path: '/performance', icon: GaugeIcon, group: 'analysis' },
  { label: 'Threat Intelligence', path: '/threat-intel', icon: GlobeIcon, group: 'intel' },
  { label: 'Network Topology', path: '/topology', icon: NetworkIcon, group: 'intel' },
  { label: 'Device Management', path: '/devices', icon: HardDriveIcon, group: 'intel' },
  { label: 'User Management', path: '/users', icon: UsersIcon, group: 'system' },
  { label: 'AI Chat Assistant', path: '/chat', icon: MessageSquareIcon, group: 'ai' },
  { label: 'Settings', path: '/settings', icon: SettingsIcon, group: 'system' },
  { label: 'Contact', path: '/contact', icon: MailIcon, group: 'system' },
  { label: 'Admin Panel', path: '/admin', icon: ShieldCheckIcon, group: 'system' },
];

import {
  LayoutDashboard as LayoutDashboardIcon,
  Activity as ActivityIcon,
  Brain as BrainIcon,
  TrendingUp as TrendingUpIcon,
  Package as PackageIcon,
  Bell as BellIcon,
  FileText as FileTextIcon,
  ScrollText as ScrollTextIcon,
  Gauge as GaugeIcon,
  Globe as GlobeIcon,
  Network as NetworkIcon,
  HardDrive as HardDriveIcon,
  Users as UsersIcon,
  MessageSquare as MessageSquareIcon,
  Settings as SettingsIcon,
  Mail as MailIcon,
  ShieldCheck as ShieldCheckIcon,
} from 'lucide-react';
