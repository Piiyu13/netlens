import { useEffect, useState, useCallback } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Mail, MessageSquare, Ban, Brain, Globe, Lock, User, Bell, Shield } from 'lucide-react';
import { Card, Badge, Button, Toggle } from '../components/ui';
import { PageHeader } from './Dashboard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { UserSettings } from '../types';

export function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [org, setOrg] = useState(profile?.organization || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle();
    if (data) setSettings(data as UserSettings);
  }, [user]);

  useEffect(() => { loadSettings(); }, [loadSettings]);
  useEffect(() => { setFullName(profile?.full_name || ''); setPhone(profile?.phone || ''); setOrg(profile?.organization || ''); }, [profile]);

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    if (!user || !settings) return;
    setSettings({ ...settings, [key]: value });
    await supabase.from('user_settings').update({ [key]: value, updated_at: new Date().toISOString() }).eq('user_id', user.id);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({ full_name: fullName, phone, organization: org, updated_at: new Date().toISOString() }).eq('id', user.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader title="Settings" subtitle="Configure your NetLens security preferences" icon={SettingsIcon} />

      <Card>
        <div className="flex items-center gap-2 mb-5">
          <User className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-p">User Profile</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-s mb-1.5 block">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" placeholder="John Doe" />
          </div>
          <div>
            <label className="text-sm text-s mb-1.5 block">Email</label>
            <input type="email" value={user?.email || ''} disabled className="input-field opacity-60" />
          </div>
          <div>
            <label className="text-sm text-s mb-1.5 block">Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+1 555 0123" />
          </div>
          <div>
            <label className="text-sm text-s mb-1.5 block">Organization</label>
            <input type="text" value={org} onChange={(e) => setOrg(e.target.value)} className="input-field" placeholder="Company Inc." />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button onClick={saveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</Button>
          {saved && <span className="text-sm text-green-400 fade-in">Saved successfully</span>}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-p">Alert Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-s" />
              <div><div className="text-sm font-medium text-p">Email Alerts</div><div className="text-xs text-m">Receive threat notifications via email</div></div>
            </div>
            <Toggle checked={settings?.email_alerts ?? true} onChange={() => updateSetting('email_alerts', !settings?.email_alerts)} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-s" />
              <div><div className="text-sm font-medium text-p">SMS Alerts</div><div className="text-xs text-m">Receive critical alerts via SMS</div></div>
            </div>
            <Toggle checked={settings?.sms_alerts ?? false} onChange={() => updateSetting('sms_alerts', !settings?.sms_alerts)} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-s" />
              <div><div className="text-sm font-medium text-p">Notification Sound</div><div className="text-xs text-m">Play sound for new alerts</div></div>
            </div>
            <Toggle checked={settings?.notification_sound ?? true} onChange={() => updateSetting('notification_sound', !settings?.notification_sound)} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-p">Security Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
            <div className="flex items-center gap-3">
              <Ban className="w-5 h-5 text-s" />
              <div><div className="text-sm font-medium text-p">Auto Block Threats</div><div className="text-xs text-m">Automatically block IPs with high-confidence threats</div></div>
            </div>
            <Toggle checked={settings?.auto_block ?? true} onChange={() => updateSetting('auto_block', !settings?.auto_block)} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-s" />
              <div><div className="text-sm font-medium text-p">Two-Factor Authentication</div><div className="text-xs text-m">Require 2FA for account login</div></div>
            </div>
            <Toggle checked={settings?.two_factor_enabled ?? false} onChange={() => updateSetting('two_factor_enabled', !settings?.two_factor_enabled)} />
          </div>
          <div className="p-3 rounded-xl bg-tertiary">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-s" />
              <div><div className="text-sm font-medium text-p">AI Sensitivity</div><div className="text-xs text-m">Adjust detection sensitivity level</div></div>
            </div>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((s) => (
                <button key={s} onClick={() => updateSetting('ai_sensitivity', s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${settings?.ai_sensitivity === s ? 'text-accent' : 'text-s hover:text-p'}`}
                  style={settings?.ai_sensitivity === s ? { background: 'var(--accent-glow)' } : { background: 'var(--bg-primary)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-p">Appearance & Language</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-s" /> : <Sun className="w-5 h-5 text-s" />}
              <div><div className="text-sm font-medium text-p">Theme</div><div className="text-xs text-m">Toggle dark or light mode</div></div>
            </div>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button key={t} onClick={() => setTheme(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${theme === t ? 'text-accent' : 'text-s hover:text-p'}`}
                  style={theme === t ? { background: 'var(--accent-glow)' } : { background: 'var(--bg-primary)' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-tertiary">
            <label className="text-sm text-s mb-2 block">Language</label>
            <select value={settings?.language || 'en'} onChange={(e) => updateSetting('language', e.target.value)} className="input-field">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-p">Password</h3>
        </div>
        <div className="space-y-3">
          <input type="password" placeholder="Current password" className="input-field" />
          <input type="password" placeholder="New password" className="input-field" />
          <input type="password" placeholder="Confirm new password" className="input-field" />
          <Button variant="secondary">Update Password</Button>
        </div>
      </Card>
    </div>
  );
}
