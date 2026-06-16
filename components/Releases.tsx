import { useState } from 'react';
import {
  GitBranch, Play, CheckCircle, XCircle, Clock, RotateCcw, FileText, Terminal
} from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';

const environments = [
  { name: 'Production', icon: <GitBranch size={14} />, version: 'v2.4.1', status: 'DEMO', statusColor: 'amber', commit: 'a1b2c3d', deployed: '2h ago', by: 'github-actions', actions: ['View Logs', 'Rollback'] },
  { name: 'Preview', icon: <Play size={14} />, version: 'v2.5.0-rc.3', status: 'DEMO', statusColor: 'amber', commit: 'e5f6g7h', deployed: '30m ago', by: 'github-actions', actions: ['Promote', 'View Logs'] },
  { name: 'Local', icon: <Terminal size={14} />, version: 'v2.5.0-dev', status: 'DEMO', statusColor: 'amber', commit: 'local', deployed: 'Running', by: '', actions: [] },
];

const buildHistory = [
  { status: 'PASS', version: 'v2.4.1', branch: 'main', duration: '4m 12s', deployed: '473d ago', commit: 'a1b2c3d' },
  { status: 'PASS', version: 'v2.5.0-rc.3', branch: 'develop', duration: '5m 34s', deployed: '473d ago', commit: 'e5f6g7h' },
  { status: 'FAIL', version: 'v2.5.0-rc.2', branch: 'develop', duration: '2m 10s', deployed: '473d ago', commit: 'd4e5f6g' },
  { status: 'PASS', version: 'v2.4.0', branch: 'main', duration: '3m 45s', deployed: '475d ago', commit: 'b2c3d4e' },
  { status: 'PASS', version: 'v2.3.2', branch: 'main', duration: '4m 01s', deployed: '478d ago', commit: 'c3d4e5f' },
  { status: 'PASS', version: 'v2.3.1', branch: 'hotfix', duration: '3m 22s', deployed: '480d ago', commit: 'f6g7h8i' },
  { status: 'PASS', version: 'v2.3.0', branch: 'main', duration: '5m 08s', deployed: '483d ago', commit: 'g7h8i9j' },
];

const featureFlags = [
  { name: 'newJournalUI', desc: 'Redesigned journal interface with templates', scope: 'All', enabled: true, rollout: 100 },
  { name: 'mt5AutoSync', desc: 'Automatic MT5 trade synchronization', scope: 'AXE  Trading', enabled: true, rollout: 85 },
  { name: 'darkModeV2', desc: 'Next-generation dark mode with OLED support', scope: 'All', enabled: false, rollout: 0 },
  { name: 'aiProviderClaude', desc: 'Claude 3.5 Sonnet as primary AI provider', scope: 'All', enabled: true, rollout: 60 },
  { name: 'tradingOSBeta', desc: 'Beta access to Trading OS v2 features', scope: 'Trading', enabled: false, rollout: 0 },
  { name: 'mobileNotifications', desc: 'Push notifications for trade alerts', scope: 'All', enabled: true, rollout: 100 },
];

const currentVersions = [
  { name: 'AXE Companion', version: 'v2.4.1', status: 'green' },
  { name: 'Trading OS', version: 'v1.2.0', status: 'green' },
  { name: 'AXE Core', version: 'v3.1.2', status: 'green' },
  { name: 'Mobile App', version: 'v2.4.0', status: 'amber' },
];

const releaseTimeline = [
  { version: 'v2.4.1', branch: 'main', time: '473d ago', duration: '4m 12s', status: 'green' },
  { version: 'v2.5.0-rc.3', branch: 'develop', time: '473d ago', duration: '5m 34s', status: 'green' },
  { version: 'v2.5.0-rc.2', branch: 'develop', time: '473d ago', duration: '2m 10s', status: 'red' },
  { version: 'v2.4.0', branch: 'main', time: '475d ago', duration: '3m 45s', status: 'green' },
];

const migrations = [
  { name: 'add_user_prefs', status: 'APPLIED', statusColor: 'green', date: 'Jan 10, 2025', duration: '0.3s' },
  { name: 'journal_embeddings', status: 'APPLIED', statusColor: 'green', date: 'Jan 8, 2025', duration: '12.4s' },
  { name: 'mt5_account_v2', status: 'APPLIED', statusColor: 'green', date: 'Jan 5, 2025', duration: '0.1s' },
  { name: 'agent_routing', status: 'PENDING', statusColor: 'amber', date: '—', duration: '—' },
  { name: 'analytics_partition', status: 'FAILED', statusColor: 'red', date: 'Jan 12, 2025', duration: '2.1s' },
];

const rollbackPoints = [
  { version: 'v2.4.1', label: 'Current production', time: '473d ago' },
  { version: 'v2.4.0', label: 'Stable baseline', time: '475d ago' },
  { version: 'v2.3.2', label: 'Last known good', time: '478d ago' },
];

export default function Releases() {
  const { mode } = useDataMode();
  const panelStatus = mode === 'live' ? 'MISSING_CONFIG' : mode === 'hybrid' ? 'DEMO' : 'DEMO';
  const [flags, setFlags] = useState(featureFlags);

  const toggleFlag = (idx: number) => {
    setFlags(prev => prev.map((f, i) => i === idx ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {mode === 'live' && (
        <div className="px-3 py-2 rounded-md bg-purple-500/5 border border-purple-500/10">
          <span className="text-[11px] text-purple-300">
            GitHub/Vercel adapters are not connected yet. Deploy controls are placeholders (disabled until admin/auth + adapters).
          </span>
        </div>
      )}
      {/* Title */}
      <h2 className="text-lg font-semibold text-white/80">Release Room</h2>

      {/* Environment Cards */}
      <div className="grid grid-cols-3 gap-3">
        {environments.map((env) => (
          <div key={env.name} className="panel" data-status={panelStatus}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">{env.icon}</span>
                <h3 className="text-[11px] font-semibold text-white/70">{env.name}</h3>
              </div>
              <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full ${
                env.statusColor === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                env.statusColor === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                'bg-white/[0.03] text-white/30 border border-white/[0.06]'
              }`}>
                <span className="w-1 h-1 rounded-full bg-current" /> {env.status}
              </span>
            </div>
            <div className="space-y-1 text-[9px]">
              <div className="flex items-center justify-between"><span className="text-white/25">Version</span><span className="text-white/60 font-mono">{env.version}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/25">Commit</span><span className="text-white/40 font-mono">{env.commit}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/25">Deployed</span><span className="text-white/40">{env.deployed}</span></div>
              {env.by && <div className="flex items-center justify-between"><span className="text-white/25">By</span><span className="text-white/40">{env.by}</span></div>}
            </div>
            <div className="flex items-center gap-2 mt-3">
              {env.actions.map((action) => (
                <button
                  key={action}
                  disabled={action === 'Rollback' || action === 'Promote' || mode === 'live'}
                  className={`text-[9px] px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                    action === 'Rollback' || action === 'Promote'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 disabled:opacity-40 disabled:hover:bg-cyan-500/10 disabled:cursor-not-allowed'
                      : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  {action === 'Promote' && <GitBranch size={8} />}
                  {action === 'View Logs' && <Terminal size={8} />}
                  {action === 'Rollback' && <RotateCcw size={8} />}
                  {action}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Build History */}
      <div className="panel" data-status={panelStatus}>
        <h3 className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
          <GitBranch size={14} className="text-cyan-400" /> Build History
        </h3>
        <div className="grid grid-cols-6 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>Status</span>
          <span>Version</span>
          <span>Branch</span>
          <span>Duration</span>
          <span>Deployed</span>
          <span>Commit</span>
        </div>
        {buildHistory.map((b) => (
          <div key={b.version} className="grid grid-cols-6 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
            <span className={`inline-flex items-center gap-1 text-[9px] ${
              b.status === 'PASS' ? 'text-green-400' : 'text-red-400'
            }`}>
              {b.status === 'PASS' ? <CheckCircle size={10} /> : <XCircle size={10} />} {b.status}
            </span>
            <span className="text-[10px] text-white/60 font-mono">{b.version}</span>
            <span className="text-[9px] text-white/30 flex items-center gap-1"><GitBranch size={8} /> {b.branch}</span>
            <span className="text-[9px] text-white/40">{b.duration}</span>
            <span className="text-[9px] text-white/25">{b.deployed}</span>
            <span className="text-[9px] text-white/30 font-mono">{b.commit}</span>
          </div>
        ))}
      </div>

      {/* Feature Flags + Current Versions */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 panel">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/70 flex items-center gap-2">
              <FileText size={14} className="text-cyan-400" /> Feature Flags
            </h3>
            <button className="text-[9px] px-2 py-1 rounded bg-white/[0.04] text-white/40 border border-white/[0.06]">+ New Flag</button>
          </div>
          <div className="space-y-3">
            {flags.map((f, i) => (
              <div key={f.name} className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-white/70">{f.name}</span>
                      <button
                        onClick={() => toggleFlag(i)}
                        className={`w-8 h-4 rounded-full transition-colors relative ${
                          f.enabled ? 'bg-cyan-500' : 'bg-white/10'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                          f.enabled ? 'left-4.5' : 'left-0.5'
                        }`} style={{ left: f.enabled ? '18px' : '2px' }} />
                      </button>
                    </div>
                    <p className="text-[9px] text-white/25 mt-0.5">{f.desc}</p>
                    <span className="inline-block mt-1 text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30">{f.scope}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-white/30">Rollout</span>
                    <div className="text-[11px] text-white/60">{f.rollout}%</div>
                    <div className="w-24 h-1.5 bg-white/[0.03] rounded-full overflow-hidden mt-1">
                      <div className={`h-full rounded-full ${f.enabled ? 'bg-cyan-500' : 'bg-white/10'}`} style={{ width: `${f.rollout}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-5 panel">
          <h3 className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
            <GitBranch size={14} className="text-purple-400" /> Current Versions
          </h3>
          <div className="space-y-2">
            {currentVersions.map((v) => (
              <div key={v.name} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'green' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <span className="text-[11px] text-white/60">{v.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40 font-mono">{v.version}</span>
                  <button className="text-[9px] text-cyan-400 hover:text-cyan-300">Changelog</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div className="text-[8px] text-white/20 uppercase tracking-wider mb-2">Release Timeline</div>
            <div className="space-y-2">
              {releaseTimeline.map((rt) => (
                <div key={rt.version} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${rt.status === 'green' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-[10px] text-white/60 font-mono">{rt.version}</span>
                  <span className="text-[8px] text-white/20">{rt.branch}</span>
                  <span className="text-[8px] text-white/20 ml-auto">{rt.time} · {rt.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Migrations */}
      <div className="panel" data-status={panelStatus}>
        <h3 className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
          <Clock size={14} className="text-amber-400" /> Migrations
        </h3>
        <div className="grid grid-cols-4 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>Migration</span>
          <span>Status</span>
          <span>Run Date</span>
          <span>Duration</span>
        </div>
        {migrations.map((m) => (
          <div key={m.name} className="grid grid-cols-4 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
            <span className="text-[11px] text-white/60 font-mono">{m.name}</span>
            <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full w-fit ${
              m.statusColor === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              m.statusColor === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              <span className="w-1 h-1 rounded-full bg-current" /> {m.status}
            </span>
            <span className="text-[9px] text-white/40">{m.date}</span>
            <span className="text-[9px] text-white/40">{m.duration}</span>
          </div>
        ))}
      </div>

      {/* Rollback Points + Release Notes */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5 panel">
          <h3 className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
            <RotateCcw size={14} className="text-red-400" /> Rollback Points
          </h3>
          <div className="space-y-2">
            {rollbackPoints.map((rp) => (
              <div key={rp.version} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <div>
                    <div className="text-[11px] text-white/60 font-mono">{rp.version}</div>
                    <div className="text-[8px] text-white/20">{rp.label} · {rp.time}</div>
                  </div>
                </div>
                <button className="text-[9px] text-red-400 hover:text-red-300">Rollback</button>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-7 panel">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/70 flex items-center gap-2">
              <FileText size={14} className="text-green-400" /> Release Notes
            </h3>
            <button className="text-[9px] text-cyan-400 hover:text-cyan-300">Edit</button>
          </div>
          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] font-mono text-[10px] text-white/40 space-y-2">
            <div className="text-white/50"># v2.4.1 — Jan 15, 2025</div>
            <div className="text-white/30 mt-2">## Features</div>
            <div>- New journal UI with templates and quick-entry</div>
            <div>- Mobile push notifications for trade alerts</div>
            <div>- AI provider fallback chain (Claude → GPT-4 → GPT-3.5)</div>
            <div className="text-white/30 mt-2">## Fixes</div>
            <div>- Fixed MT5 sync timeout on large accounts (&gt;10k trades)</div>
            <div>- Resolved chart rendering issue on Safari iOS</div>
            <div>- Corrected timezone handling in journal timestamps</div>
            <div className="text-white/30 mt-2">## Improvements</div>
            <div>- 40% faster chat response latency</div>
            <div>- Reduced bundle size by 12%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
