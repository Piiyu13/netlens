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
  { label: 'Packet Analyzer', path: '/packet-analyzer', icon: PackageIcon, group: 'monitoring' },
  { label: 'Alerts Center', path: '/alerts', icon: BellIcon, group: 'monitoring' },
  { label: 'Performance', path: '/performance', icon: GaugeIcon, group: 'analysis' },
  { label: 'Network Topology', path: '/topology', icon: NetworkIcon, group: 'intel' },
  { label: 'Device Management', path: '/devices', icon: HardDriveIcon, group: 'intel' },
  { label: 'User Management', path: '/users', icon: UsersIcon, group: 'system' },
  { label: 'Settings', path: '/settings', icon: SettingsIcon, group: 'system' },
];

import {
  LayoutDashboard as LayoutDashboardIcon,
  Activity as ActivityIcon,
  Brain as BrainIcon,
  Package as PackageIcon,
  Bell as BellIcon,
  Gauge as GaugeIcon,
  Network as NetworkIcon,
  HardDrive as HardDriveIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
