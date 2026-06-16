import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Smartphone, Terminal, Cpu } from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';

const usageData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 400 + Math.sin(i * 0.5) * 200 + Math.random() * 150 + i * 15,
}));

const topFeatures = [
  { name: 'Chat with AXE', value: 4230 },
  { name: 'Trade Journal', value: 2891 },
  { name: 'Market\nContext', value: 1742 },
  { name: 'MT5 Account\nSync', value: 1203 },
  { name: 'Notes / Memory', value: 987 },
];

const funnelData = [
  { stage: 'Signup', value: 1240, drop: null },
  { stage: 'Active (chat)', value: 980, drop: '-21%' },
  { stage: 'MT5 Connected', value: 640, drop: '-35%' },
  { stage: 'Paid', value: 420, drop: '-34%' },
];

const accountData = [
  { name: 'MT5 Connected', value: 534 },
  { name: 'Manual Only', value: 213 },
  { name: 'Demo', value: 100 },
];

const flows = [
  { name: 'Chat with AXE', count: 4230, pct: 34 },
  { name: 'Trade Journal Entry', count: 2891, pct: 23 },
  { name: 'Market Context Request', count: 1742, pct: 14 },
  { name: 'MT5 Account Sync', count: 1203, pct: 10 },
  { name: 'Notes / Memory', count: 987, pct: 8 },
];

const healthServices = [
  { name: 'Chat API', latency: '142ms', latencyColor: 'amber', errors: 0, lastCheck: '2m ago' },
  { name: 'MT5 Sync', latency: '89ms', latencyColor: 'green', errors: 2, lastCheck: '5m ago' },
  { name: 'Journal Store', latency: '56ms', latencyColor: 'green', errors: 0, lastCheck: '1m ago' },
  { name: 'Memory Engine', latency: '34ms', latencyColor: 'green', errors: 0, lastCheck: '3m ago' },
  { name: 'Subscription', latency: '201ms', latencyColor: 'amber', errors: 0, lastCheck: '4m ago' },
];

const COLORS = ['#06b6d4', '#06b6d4aa', '#06b6d455'];

export default function Products() {
  const [activeTab, setActiveTab] = useState('axe');
  const { mode } = useDataMode();
  const panelStatus = mode === 'live' ? 'MISSING_CONFIG' : mode === 'hybrid' ? 'DEMO' : 'DEMO';

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {mode === 'live' && (
        <div className="px-3 py-2 rounded-md bg-purple-500/5 border border-purple-500/10">
          <span className="text-[11px] text-purple-300">
            Product telemetry is not connected yet. Live mode will stay empty/pending until adapters exist.
          </span>
        </div>
      )}
      {/* Sub-tabs */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveTab('axe')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] transition-all ${
            activeTab === 'axe' ? 'bg-white/[0.06] text-white/80 border border-white/[0.08]' : 'text-white/30 hover:text-white/50'
          }`}
        >
          <Smartphone size={13} /> AXE Companion <span className="text-green-400">● 96</span>
        </button>
        <button
          onClick={() => setActiveTab('trading')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] transition-all ${
            activeTab === 'trading' ? 'bg-white/[0.06] text-white/80 border border-white/[0.08]' : 'text-white/30 hover:text-white/50'
          }`}
        >
          <Terminal size={13} /> Trading OS
        </button>
        <button
          onClick={() => setActiveTab('core')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] transition-all ${
            activeTab === 'core' ? 'bg-white/[0.06] text-white/80 border border-white/[0.08]' : 'text-white/30 hover:text-white/50'
          }`}
        >
          <Cpu size={13} /> AXE Core
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="panel flex flex-col items-center justify-center" data-status={panelStatus}>
          <span className="stat-label">Product Health</span>
          <div className="relative w-16 h-16 mt-1">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
              <circle cx="32" cy="32" r="28" stroke="#06b6d4" strokeWidth="4" fill="none" strokeDasharray="176" strokeDashoffset="7" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white/80">96</span>
          </div>
          <span className="text-[9px] text-green-400 mt-1">Healthy</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Users</span>
          <div className="text-xl font-bold text-white/80 mt-1">847</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] text-green-400">▲ +8%</span>
          </div>
          <div className="h-10 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData.slice(0, 10)}>
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="#06b6d422" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Usage (Today)</span>
          <div className="text-xl font-bold text-white/80 mt-1">12.400</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] text-green-400">▲ +8%</span>
          </div>
          <div className="h-10 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData.slice(0, 10)}>
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="#06b6d422" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Errors (24h)</span>
          <div className="text-xl font-bold text-white/80 mt-1">23</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] text-red-400">▼ -5 vs yday</span>
          </div>
          <div className="h-10 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData.slice(0, 10)}>
                <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#ef444422" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Retention (30D)</span>
          <div className="text-xl font-bold text-white/80 mt-1">84%</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] text-green-400">▲ +2%</span>
          </div>
          <div className="h-10 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData.slice(0, 10)}>
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="#06b6d422" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 panel" data-status={panelStatus}>
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Usage Over Time (30 Days)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }} />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="#06b6d422" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-5 panel" data-status={panelStatus}>
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Top Features</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topFeatures} layout="vertical" margin={{ left: 60 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9 }} axisLine={false} tickLine={false} width={70} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {topFeatures.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#06b6d4' : i === 1 ? '#06b6d4cc' : '#06b6d488'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Funnel + Account Connections */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 panel" data-status={panelStatus}>
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Conversion Funnel</h3>
          <div className="space-y-2">
            {funnelData.map((f) => (
              <div key={f.stage} className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 w-24">{f.stage}</span>
                <div className="flex-1 h-8 bg-white/[0.03] rounded-md overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500/40 to-cyan-500/20 rounded-md flex items-center px-2"
                    style={{ width: `${(f.value / 1240) * 100}%` }}
                  >
                    <span className="text-[10px] font-semibold text-white/80">{f.value}</span>
                  </div>
                </div>
                {f.drop && <span className="text-[9px] text-red-400 w-10">{f.drop} →</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-5 panel" data-status={panelStatus}>
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Account Connections</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <PieChart width={96} height={96}>
                <Pie data={accountData} cx={48} cy={48} innerRadius={32} outerRadius={44} dataKey="value" stroke="none">
                  {accountData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-white/80">847</span>
                <span className="text-[8px] text-white/30">total</span>
              </div>
            </div>
            <div className="space-y-1.5 flex-1">
              {accountData.map((a, i) => (
                <div key={a.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-[10px] text-white/40">{a.name}</span>
                  <span className="text-[10px] text-white/60 ml-auto">{a.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Most Used Flows */}
      <div className="panel" data-status={panelStatus}>
        <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Most Used Flows</h3>
        <div className="space-y-2">
          {flows.map((f, i) => (
            <div key={f.name} className="flex items-center gap-3">
              <span className="text-[9px] text-white/20 w-4">{i + 1}</span>
              <span className="text-[11px] text-white/60 w-48">{f.name}</span>
              <div className="flex-1 h-2 bg-white/[0.03] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500/60 rounded-full" style={{ width: `${f.pct}%` }} />
              </div>
              <span className="text-[10px] text-white/40 w-12 text-right">{f.count.toLocaleString()}</span>
              <span className="text-[9px] text-white/25 w-10 text-right">({f.pct}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Health & Errors */}
      <div className="panel" data-status={panelStatus}>
        <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Current Health & Errors</h3>
        <div className="grid grid-cols-5 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>Service</span>
          <span>Status</span>
          <span>Latency</span>
          <span>Errors (24h)</span>
          <span>Last Check</span>
        </div>
        {healthServices.map((s) => (
          <div key={s.name} className="grid grid-cols-5 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
            <span className="text-[11px] text-white/60">{s.name}</span>
            <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full w-fit ${
              mode === 'live'
                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              <span className={`w-1 h-1 rounded-full ${mode === 'live' ? 'bg-purple-400' : 'bg-amber-500'}`} /> {mode === 'live' ? 'PENDING' : 'DEMO'}
            </span>
            <span className={`text-[10px] ${s.latencyColor === 'green' ? 'text-green-400' : 'text-amber-400'}`}>{s.latency}</span>
            <span className="text-[10px] text-white/40">{s.errors}</span>
            <span className="text-[9px] text-white/25">{s.lastCheck}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
