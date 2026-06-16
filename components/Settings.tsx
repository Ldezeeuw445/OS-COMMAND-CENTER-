import { useState } from 'react';
import {
  Settings, Bell, Bot, FileText, Zap, CreditCard, TrendingUp
} from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';
import { integrations, axeCoreAgentLoggingResult, makeIntegrationResult } from '../src/lib/integrations';
import { AdapterStatusPill } from '../src/components/DataStatusPill';
import { useIntegrationStatuses } from '../src/lib/hooks/useIntegrationStatuses';

const tabs = [
  { id: 'flags', label: 'Feature Flags', icon: Zap },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'business', label: 'Business', icon: TrendingUp },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
];

const auditLogs = [
  { action: 'Feature Flag Changed', details: 'newJournalUI → enabled (100% rollout)', admin: 'admin', ip: '192.168.1.1', time: '2024-01-15 14:30:00' },
  { action: 'User Role Updated', details: 'user#4521 → VIP (Elite plan)', admin: 'admin', ip: '192.168.1.1', time: '2024-01-15 14:28:00' },
  { action: 'Agent Prompt Updated', details: 'Trade Reviewer → v2.4.1', admin: 'admin', ip: '192.168.1.1', time: '2024-01-15 14:25:00' },
  { action: 'Database Migration', details: 'add_user_prefs → applied successfully', admin: 'system', ip: 'internal', time: '2024-01-15 14:20:00' },
  { action: 'API Key Regenerated', details: 'Stripe webhook secret rotated', admin: 'admin', ip: '192.168.1.1', time: '2024-01-15 14:15:00' },
  { action: 'Feature Flag Changed', details: 'darkModeV2 → disabled (0% rollout)', admin: 'admin', ip: '192.168.1.1', time: '2024-01-15 14:10:00' },
  { action: 'Release Deployed', details: 'v2.4.1 → production environment', admin: 'github-actions', ip: '10.0.0.2', time: '2024-01-15 14:00:00' },
];

const secretEnvKeys = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'AXE_CORE_LOGS_TOKEN',
  'AXE_COMPANION_API_TOKEN',
  'STRIPE_SECRET_KEY',
  'GITHUB_TOKEN',
  'VERCEL_TOKEN',
  'CLOUDFLARE_API_TOKEN',
  'METAAPI_TOKEN',
];

export default function SettingsPage() {
  const { mode, setMode } = useDataMode();
  const panelStatus = mode === 'live' ? 'MISSING_CONFIG' : mode === 'hybrid' ? 'DEMO' : 'DEMO';
  const integrationApi = useIntegrationStatuses(mode);
  const [activeTab, setActiveTab] = useState('flags');
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    newJournalUI: true,
    mt5AutoSync: true,
    darkModeV2: false,
    aiProviderClaude: true,
    tradingOSBeta: false,
    mobileNotifications: true,
    emailAlerts: true,
    slackAlerts: false,
    webhookAlerts: true,
    autoScale: true,
    cacheEnabled: true,
    debugMode: false,
  });

  const toggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Settings size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">System Settings</h2>
        <span className={`ml-2 text-[9px] px-2 py-0.5 rounded-full border ${
          mode === 'live'
            ? 'bg-green-500/10 text-green-400 border-green-500/20'
            : mode === 'hybrid'
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          {mode === 'live' ? 'LIVE MODE' : mode === 'hybrid' ? 'HYBRID MODE' : 'DEMO MODE'}
        </span>
      </div>

      <div className="panel" data-status={panelStatus}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-white/70">Global Data Mode</h3>
            <p className="text-[9px] text-white/30 mt-0.5">
              Live mode will never show demo metrics. Missing integrations become pending/missing_config.
            </p>
          </div>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none"
          >
            <option value="demo">demo</option>
            <option value="hybrid">hybrid</option>
            <option value="live">live</option>
          </select>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { name: 'Supabase', status: mode === 'live' ? 'MISSING_CONFIG' : 'DEMO' },
            { name: 'Stripe', status: mode === 'live' ? 'MISSING_CONFIG' : 'DEMO' },
            { name: 'Cloudflare', status: mode === 'live' ? 'MISSING_CONFIG' : 'DEMO' },
            { name: 'MetaApi', status: mode === 'live' ? 'MISSING_CONFIG' : 'DEMO' },
            { name: 'Vercel', status: mode === 'live' ? 'MISSING_CONFIG' : 'DEMO' },
            { name: 'GitHub', status: mode === 'live' ? 'MISSING_CONFIG' : 'DEMO' },
            { name: 'AXE Core Logs', status: 'PENDING' },
            { name: 'Support Desk', status: 'PENDING' },
            { name: 'Growth Analytics', status: 'PENDING' },
          ].map((it) => (
            <div key={it.name} className="rounded bg-white/[0.02] border border-white/[0.04] px-2 py-2 flex items-center justify-between">
              <span className="text-[10px] text-white/55">{it.name}</span>
              <span className="text-[8px] font-medium tracking-wider text-white/35">{it.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" data-status={panelStatus}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold text-white/70">Integrations</h3>
            <p className="text-[9px] text-white/25 mt-0.5">
              OS Command Center never fakes live data. Live mode stays empty until these are connected.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>Name</span>
          <span>Scope</span>
          <span>Status</span>
          <span>Source</span>
          <span>Notes</span>
        </div>

        {integrations.map((it) => {
          const result =
            mode === 'live' && integrationApi.ordered.find((x) => x.id === it.id)?.api
              ? integrationApi.ordered.find((x) => x.id === it.id)?.api!
              : it.id === 'axe_core'
                ? axeCoreAgentLoggingResult(mode)
                : makeIntegrationResult(mode, `${it.id}Adapter`, { connected: false, hint: 'Demo placeholder.' });

          return (
            <div key={it.id} className="grid grid-cols-5 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
              <span className="text-[11px] text-white/60">{it.label}</span>
              <span className="text-[10px] text-white/35">{it.scope}</span>
              <div className="flex items-center">
                <AdapterStatusPill result={result} />
              </div>
              <span className="text-[10px] text-white/30 font-mono">{result.source}</span>
              <span className="text-[9px] text-white/25">{it.notes}</span>
            </div>
          );
        })}

        {mode === 'live' && (
          <div className="mt-3 text-[9px] text-white/30">
            {integrationApi.loading && <span>Checking local API…</span>}
            {integrationApi.error && (
              <span className="text-red-400">API error: {integrationApi.error}</span>
            )}
            {!integrationApi.loading && !integrationApi.error && (
              <span className="text-white/25">
                Tip: run <span className="font-mono text-white/35">npm run dev:api</span> to enable integration status checks.
              </span>
            )}
          </div>
        )}
      </div>

      <div className="panel" data-status={panelStatus}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded bg-white/[0.02] border border-white/[0.04] p-3">
            <h3 className="text-xs font-semibold text-white/70">Install As App</h3>
            <p className="mt-1 text-[10px] text-white/35">
              Open this dashboard in Safari/Chrome and use Add to Home Screen. PWA manifest + app icon are enabled.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <img src="./oscc-icon-192.png" alt="OS Command Center logo" className="h-8 w-8 rounded" />
              <div className="text-[10px] text-white/45">
                App name: <span className="text-white/65">OS Command Center</span>
              </div>
            </div>
          </div>

          <div className="rounded bg-white/[0.02] border border-white/[0.04] p-3">
            <h3 className="text-xs font-semibold text-white/70">Secrets Safety</h3>
            <p className="mt-1 text-[10px] text-white/35">
              Keep all tokens server-side only. Never expose secrets in browser env variables.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {secretEnvKeys.map((key) => (
                <span key={key} className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-1 text-[9px] font-mono text-white/50">
                  {key}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.04]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-[11px] transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-white/30 border-transparent hover:text-white/50'
              }`}
            >
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feature Flags */}
      {activeTab === 'flags' && (
        <div className="space-y-3">
          <div className="panel" data-status={panelStatus}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white/70">Feature Flags</h3>
              <button className="text-[9px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">+ New Flag</button>
            </div>
            {[
              { key: 'newJournalUI', name: 'newJournalUI', desc: 'Redesigned journal interface with templates', scope: 'All', rollout: 100 },
              { key: 'mt5AutoSync', name: 'mt5AutoSync', desc: 'Automatic MT5 trade synchronization', scope: 'AXE + Trading', rollout: 85 },
              { key: 'darkModeV2', name: 'darkModeV2', desc: 'Next-generation dark mode with OLED support', scope: 'All', rollout: 0 },
              { key: 'aiProviderClaude', name: 'aiProviderClaude', desc: 'Claude 3.5 Sonnet as primary AI provider', scope: 'All', rollout: 60 },
              { key: 'tradingOSBeta', name: 'tradingOSBeta', desc: 'Beta access to Trading OS v2 features', scope: 'Trading', rollout: 0 },
              { key: 'mobileNotifications', name: 'mobileNotifications', desc: 'Push notifications for trade alerts', scope: 'All', rollout: 100 },
            ].map((flag) => (
              <div key={flag.key} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-white/70">{flag.name}</span>
                    <button
                      onClick={() => toggle(flag.key)}
                      className={`w-8 h-4 rounded-full transition-colors relative ${
                        toggles[flag.key] ? 'bg-cyan-500' : 'bg-white/10'
                      }`}
                    >
                      <span className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all" style={{ left: toggles[flag.key] ? '18px' : '2px' }} />
                    </button>
                  </div>
                  <p className="text-[9px] text-white/25 mt-0.5">{flag.desc}</p>
                  <span className="inline-block mt-1 text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30">{flag.scope}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-white/30">Rollout</span>
                  <div className="text-[11px] text-white/60">{flag.rollout}%</div>
                  <div className="w-24 h-1.5 bg-white/[0.03] rounded-full overflow-hidden mt-1">
                    <div className={`h-full rounded-full ${toggles[flag.key] ? 'bg-cyan-500' : 'bg-white/10'}`} style={{ width: `${flag.rollout}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing */}
      {activeTab === 'pricing' && (
        <div className="space-y-3">
          <div className="panel" data-status={panelStatus}>
            <h3 className="text-xs font-semibold text-white/70 mb-3">Pricing Plans</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: 'AXE Pro', price: '$29/mo', subs: 142, revenue: '$4.118', features: ['AI Chat', 'Journal', 'Basic Analytics'] },
                { name: 'AXE Elite', price: '$79/mo', subs: 38, revenue: '$3.002', features: ['All Pro', 'MT5 Sync', 'Advanced Analytics'] },
                { name: 'Trading Pro', price: '$49/mo', subs: 28, revenue: '$1.372', features: ['Terminal AI', 'Risk Tools', 'Live Data'] },
                { name: 'Trading Elite', price: '$129/mo', subs: 6, revenue: '$774', features: ['All Trading', 'Custom Agents', 'Priority Support'] },
              ].map((plan) => (
                <div key={plan.name} className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-[11px] font-semibold text-white/70">{plan.name}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{plan.price}</div>
                  <div className="text-[9px] text-white/25 mt-1">{plan.subs} subs · {plan.revenue}</div>
                  <div className="mt-2 space-y-1">
                    {plan.features.map((f) => (
                      <div key={f} className="text-[9px] text-white/30 flex items-center gap-1">
                        <span className="text-green-400">✓</span> {f}
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-2 py-1.5 rounded bg-white/[0.04] text-white/40 text-[9px] hover:bg-white/[0.06]">Edit Plan</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Agents */}
      {activeTab === 'agents' && (
        <div className="space-y-3">
          <div className="panel" data-status={panelStatus}>
            <h3 className="text-xs font-semibold text-white/70 mb-3">Agent Configuration</h3>
            <div className="space-y-3">
              {[
                { name: 'Trade Reviewer', model: 'GPT-4o', temp: 0.7, maxTokens: 2000, enabled: true },
                { name: 'Journal Coach', model: 'GPT-4o', temp: 0.5, maxTokens: 1500, enabled: true },
                { name: 'Market Context', model: 'Claude 3.5', temp: 0.8, maxTokens: 3000, enabled: true },
                { name: 'Risk Guardian', model: 'GPT-4o', temp: 0.3, maxTokens: 1000, enabled: true },
                { name: 'Support Agent', model: 'GPT-4o-mini', temp: 0.6, maxTokens: 2000, enabled: true },
              ].map((agent) => (
                <div key={agent.name} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <span className="text-[11px] font-semibold text-white/70">{agent.name}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] text-white/30">Model: <span className="text-white/50">{agent.model}</span></span>
                      <span className="text-[9px] text-white/30">Temp: <span className="text-white/50">{agent.temp}</span></span>
                      <span className="text-[9px] text-white/30">Max: <span className="text-white/50">{agent.maxTokens}</span></span>
                    </div>
                  </div>
                  <button
                    className={`w-8 h-4 rounded-full transition-colors relative ${
                      agent.enabled ? 'bg-cyan-500' : 'bg-white/10'
                    }`}
                  >
                    <span className="absolute top-0.5 w-3 h-3 rounded-full bg-white" style={{ left: agent.enabled ? '18px' : '2px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          <div className="panel" data-status={panelStatus}>
            <h3 className="text-xs font-semibold text-white/70 mb-3">Alert Configuration</h3>
            <div className="space-y-3">
              {[
                { key: 'emailAlerts', label: 'Email Alerts', desc: 'Send critical alerts to admin email' },
                { key: 'slackAlerts', label: 'Slack Alerts', desc: 'Post alerts to #alerts channel' },
                { key: 'webhookAlerts', label: 'Webhook Alerts', desc: 'Send alerts to configured webhook URL' },
              ].map((alert) => (
                <div key={alert.key} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div>
                    <span className="text-[11px] text-white/60">{alert.label}</span>
                    <p className="text-[9px] text-white/25">{alert.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(alert.key)}
                    className={`w-8 h-4 rounded-full transition-colors relative ${
                      toggles[alert.key] ? 'bg-cyan-500' : 'bg-white/10'
                    }`}
                  >
                    <span className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all" style={{ left: toggles[alert.key] ? '18px' : '2px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="panel" data-status={panelStatus}>
            <h3 className="text-xs font-semibold text-white/70 mb-3">Thresholds</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2 rounded bg-white/[0.02]">
                <div className="text-[9px] text-white/25">Latency Alert</div>
                <div className="text-lg font-bold text-white/80 mt-1">250ms</div>
              </div>
              <div className="p-2 rounded bg-white/[0.02]">
                <div className="text-[9px] text-white/25">Error Rate Alert</div>
                <div className="text-lg font-bold text-white/80 mt-1">1.0%</div>
              </div>
              <div className="p-2 rounded bg-white/[0.02]">
                <div className="text-[9px] text-white/25">Uptime Alert</div>
                <div className="text-lg font-bold text-white/80 mt-1">99.9%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business */}
      {activeTab === 'business' && (
        <div className="space-y-3">
          <div className="panel" data-status={panelStatus}>
            <h3 className="text-xs font-semibold text-white/70 mb-3">Business Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-white/30 block mb-1">Company Name</label>
                  <input type="text" value="AXE OS" readOnly className="w-full bg-white/[0.03] border border-white/[0.06] rounded px-3 py-1.5 text-[11px] text-white/60 outline-none" />
                </div>
                <div>
                  <label className="text-[9px] text-white/30 block mb-1">Support Email</label>
                  <input type="text" value="support@axeos.io" readOnly className="w-full bg-white/[0.03] border border-white/[0.06] rounded px-3 py-1.5 text-[11px] text-white/60 outline-none" />
                </div>
                <div>
                  <label className="text-[9px] text-white/30 block mb-1">Stripe Account</label>
                  {mode === 'live' ? (
                    <div className="flex items-center gap-2 text-[10px] text-purple-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Missing config
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[10px] text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Demo placeholder
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-white/30 block mb-1">Default Currency</label>
                  <select className="w-full bg-white/[0.03] border border-white/[0.06] rounded px-3 py-1.5 text-[11px] text-white/60 outline-none">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-white/30 block mb-1">Default Language</label>
                  <select className="w-full bg-white/[0.03] border border-white/[0.06] rounded px-3 py-1.5 text-[11px] text-white/60 outline-none">
                    <option>English</option>
                    <option>Dutch</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-white/30 block mb-1">Timezone</label>
                  <select className="w-full bg-white/[0.03] border border-white/[0.06] rounded px-3 py-1.5 text-[11px] text-white/60 outline-none">
                    <option>UTC-5 (EST)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (CET)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="panel" data-status={panelStatus}>
            <h3 className="text-xs font-semibold text-white/70 mb-3">System Toggles</h3>
            <div className="space-y-2">
              {[
                { key: 'autoScale', label: 'Auto-scaling', desc: 'Automatically scale services based on load' },
                { key: 'cacheEnabled', label: 'Cache Layer', desc: 'Enable Redis caching for API responses' },
                { key: 'debugMode', label: 'Debug Mode', desc: 'Enable verbose logging for all services' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div>
                    <span className="text-[11px] text-white/60">{item.label}</span>
                    <p className="text-[9px] text-white/25">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className={`w-8 h-4 rounded-full transition-colors relative ${
                      toggles[item.key] ? 'bg-cyan-500' : 'bg-white/10'
                    }`}
                  >
                    <span className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all" style={{ left: toggles[item.key] ? '18px' : '2px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs */}
      {activeTab === 'audit' && (
        <div className="panel" data-status={panelStatus}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/70 flex items-center gap-2">
              <FileText size={14} className="text-white/30" /> Audit Logs
            </h3>
            <div className="flex items-center gap-2">
              <button className="text-[9px] text-white/30 hover:text-white/50">Export CSV</button>
              <button className="text-[9px] text-white/30 hover:text-white/50">Export JSON</button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
            <span>Action</span>
            <span>Details</span>
            <span>Admin</span>
            <span>IP Address</span>
            <span>Time</span>
          </div>
          {auditLogs.map((log, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
              <span className="text-[10px] text-white/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> {log.action}
              </span>
              <span className="text-[9px] text-white/40">{log.details}</span>
              <span className="text-[9px] text-white/30">{log.admin}</span>
              <span className="text-[9px] text-white/20 font-mono">{log.ip}</span>
              <span className="text-[9px] text-white/20">{log.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
