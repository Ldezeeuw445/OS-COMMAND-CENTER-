import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  Database, Globe, Cloud, Cpu, TrendingUp, CreditCard, Brain,
  Zap, Wifi, Activity, AlertTriangle, CheckCircle, Terminal
} from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';

const services = [
  { name: 'Supabase', latency: '45ms', latencyColor: 'green', errors: '0%', uptime: '—', region: '—', extra: 'Integration pending', last: '—' },
  { name: 'Vercel', latency: '89ms', latencyColor: 'green', errors: '—', uptime: '—', region: '—', extra: 'Integration pending', last: '—' },
  { name: 'Cloudflare', latency: '34ms', latencyColor: 'green', errors: '—', uptime: '—', region: '—', extra: 'Integration pending', last: '—' },
  { name: 'AXE Core', latency: '—', latencyColor: 'amber', errors: '—', uptime: '—', region: '—', extra: 'Agent logs pending', last: '—' },
  { name: 'MetaApi', latency: '—', latencyColor: 'red', errors: '—', uptime: '—', region: '—', extra: 'Integration pending', last: '—' },
  { name: 'Alpaca', latency: '—', latencyColor: 'amber', errors: '—', uptime: '—', region: '—', extra: 'Broker stream pending', last: '—' },
  { name: 'Stripe', latency: '—', latencyColor: 'amber', errors: '—', uptime: '—', region: '—', extra: 'Integration pending', last: '—' },
  { name: 'OpenAI', latency: '—', latencyColor: 'amber', errors: '—', uptime: '—', region: '—', extra: 'Provider pending', last: '—' },
  { name: 'Trading OS Engine', latency: '—', latencyColor: 'green', errors: '—', uptime: '—', region: '—', extra: 'Product integration pending', last: '—' },
  { name: 'WebSocket Worker', latency: '—', latencyColor: 'green', errors: '—', uptime: '—', region: '—', extra: 'Integration pending', last: '—' },
];

const serviceIcons: Record<string, React.ReactNode> = {
  'Supabase': <Database size={14} />,
  'Vercel': <Globe size={14} />,
  'Cloudflare': <Cloud size={14} />,
  'AXE Core': <Cpu size={14} />,
  'MetaApi': <TrendingUp size={14} />,
  'Alpaca': <TrendingUp size={14} />,
  'Stripe': <CreditCard size={14} />,
  'OpenAI': <Brain size={14} />,
  'Trading OS Engine': <Zap size={14} />,
  'WebSocket Worker': <Wifi size={14} />,
};

const providerTabs = [
  { id: 'all', label: 'All Providers', members: [] as string[] },
  { id: 'supabase', label: 'Supabase', members: ['Supabase'] },
  { id: 'cloudflare', label: 'Cloudflare', members: ['Cloudflare', 'WebSocket Worker'] },
  { id: 'vercel', label: 'Vercel', members: ['Vercel'] },
  { id: 'railway', label: 'Railway', members: ['Trading OS Engine'] },
  { id: 'metaapi', label: 'MetaApi', members: ['MetaApi'] },
  { id: 'alpaca', label: 'Alpaca', members: ['Alpaca'] },
];

const latencyData = Array.from({ length: 60 }, (_, i) => ({
  time: i,
  supabase: 45 + Math.random() * 10,
  vercel: 85 + Math.random() * 20,
  metaapi: i > 50 ? 340 : 120 + Math.random() * 40,
  openai: 200 + Math.random() * 60,
}));

const errorData = Array.from({ length: 60 }, (_, i) => ({
  time: i,
  rate: i > 50 ? 1.2 : 0.1 + Math.random() * 0.3,
}));

const apiRequests = [
  { hour: '08:00', value: 4200 },
  { hour: '09:00', value: 6800 },
  { hour: '10:00', value: 9200 },
  { hour: '11:00', value: 7400 },
  { hour: '12:00', value: 5600 },
  { hour: '13:00', value: 6200 },
  { hour: '14:00', value: 7800 },
];

const cacheData = [
  { name: 'Cache Hit', value: 87 },
  { name: 'Cache Miss', value: 13 },
];

const circuitBreakers = [
  { name: 'Supabase', state: 'CLOSED', status: 'OK', ago: '14d ago' },
  { name: 'MetaApi', state: 'OPEN', status: 'Alert', ago: '12m ago', failures: '12 failures' },
  { name: 'OpenAI', state: 'CLOSED', status: 'OK', ago: '2d ago', failures: '1 failures' },
  { name: 'Stripe', state: 'CLOSED', status: 'OK', ago: '8d ago' },
];

const apiQuotas = [
  { name: 'OpenAI', used: 7800, total: 10000, pct: 78, color: 'amber' },
  { name: 'Anthropic', used: 6200, total: 10000, pct: 62, color: 'green' },
  { name: 'Stripe', used: 920, total: 1000, pct: 92, color: 'red' },
  { name: 'MetaApi', used: 450, total: 1000, pct: 45, color: 'green' },
];

const fallbackCounts = [
  { service: 'OpenAI', primary: '7.820', fallback: '120', success: '98.5%', latency: '245ms', latencyColor: 'amber' },
  { service: 'MetaApi', primary: '420', fallback: '18', success: '95.8%', latency: '340ms', latencyColor: 'red' },
  { service: 'Stripe', primary: '920', fallback: '0', success: '100%', latency: '120ms', latencyColor: 'amber' },
  { service: 'Supabase', primary: '12.400', fallback: '3', success: '99.98%', latency: '45ms', latencyColor: 'green' },
];

const liveLogs = [
  { time: '2024-01-15 14:32:01', level: 'ERROR', source: 'MetaApi', msg: 'MetaApi sync timeout for user#4521' },
  { time: '2024-01-15 14:28:45', level: 'WARN', source: 'Vercel', msg: 'Edge function cold start: 890ms' },
  { time: '2024-01-15 14:15:22', level: 'INFO', source: 'AXE Core', msg: 'Deploy completed: v2.4.1' },
  { time: '2024-01-15 13:58:11', level: 'ERROR', source: 'MetaApi', msg: 'MT5 connection lost: user#4521' },
  { time: '2024-01-15 13:45:00', level: 'INFO', source: 'Supabase', msg: 'Daily backup completed' },
  { time: '2024-01-15 13:30:15', level: 'INFO', source: 'OpenAI', msg: 'Rate limit check: 78% used' },
  { time: '2024-01-15 13:12:40', level: 'WARN', source: 'Cloudflare', msg: 'Cache purge triggered for /api/v1/*' },
  { time: '2024-01-15 12:55:22', level: 'ERROR', source: 'Trading OS', msg: 'Chart engine timeout: symbol EURUSD' },
  { time: '2024-01-15 12:40:00', level: 'INFO', source: 'Stripe', msg: 'Webhook processed: invoice.paid' },
  { time: '2024-01-15 12:15:10', level: 'DEBUG', source: 'AXE Core', msg: 'Agent routing: Trade Reviewer → GPT-4o' },
  { time: '2024-01-15 11:58:33', level: 'INFO', source: 'WebSocket', msg: 'Connection pool scaled: 1240 active' },
  { time: '2024-01-15 11:42:05', level: 'WARN', source: 'OpenAI', msg: 'Token usage alert: 85% of quota' },
];

const incidents = [
  { id: '#42', title: 'MetaApi Delay', status: 'CRITICAL', statusColor: 'red', duration: '12m', product: 'Trading OS', started: '12m ago' },
  { id: '#41', title: 'Deploy Issue', status: 'RESOLVED', statusColor: 'gray', duration: '8m', product: 'All', started: '3h ago' },
  { id: '#40', title: 'AI Rate Limit', status: 'RESOLVED', statusColor: 'gray', duration: '45m', product: 'All', started: '1d ago' },
  { id: '#39', title: 'Cloudflare Cache Miss', status: 'DEGRADED', statusColor: 'amber', duration: '25m', product: 'AXE Companion', started: '2d ago' },
];


export default function ServerRoom() {
  const [logFilter, setLogFilter] = useState('ALL');
  const [provider, setProvider] = useState('all');
  const { mode } = useDataMode();
  const panelStatus = mode === 'live' ? 'MISSING_CONFIG' : mode === 'hybrid' ? 'DEMO' : 'DEMO';
  const serviceBadge =
    mode === 'live'
      ? { label: 'MISSING CONFIG', cls: 'bg-purple-500/10 text-purple-300 border border-purple-500/20', dot: 'bg-purple-400' }
      : { label: 'DEMO', cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-500' };

  const selected = providerTabs.find((x) => x.id === provider) ?? providerTabs[0];
  const visibleServices =
    selected.id === 'all'
      ? services
      : services.filter((service) => selected.members.includes(service.name));

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {/* Status bar */}
      <div className="flex items-center gap-4 px-3 py-2 rounded-md bg-amber-500/5 border border-amber-500/10">
        <span className="text-[11px] text-amber-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> 1 Service Degraded
        </span>
        <span className="text-[10px] text-white/40">Avg Latency: <span className="text-white/60">114ms</span></span>
        <span className="text-[10px] text-white/40">Uptime: <span className="text-white/60">99.98%</span></span>
        <span className="text-[10px] text-white/40">Active Incidents: <span className="text-red-400">1</span></span>
      </div>

      {mode === 'live' && (
        <div className="px-3 py-2 rounded-md bg-purple-500/5 border border-purple-500/10">
          <span className="text-[11px] text-purple-300">
            Live integrations are not connected yet. Showing safe placeholders only.
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {providerTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setProvider(tab.id)}
            className={`text-[10px] px-2.5 py-1 rounded-md border transition-colors ${
              provider === tab.id
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                : 'bg-white/[0.02] text-white/40 border-white/[0.06] hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-3 gap-3">
        {visibleServices.map((s) => (
          <div key={s.name} className="panel" data-status={panelStatus}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40">
                {serviceIcons[s.name]}
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-white/70">{s.name}</h4>
                <span
                  className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full border ${serviceBadge.cls}`}
                >
                  <span className={`w-1 h-1 rounded-full ${serviceBadge.dot}`} /> {serviceBadge.label}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
              <div><span className="text-white/25">LATENCY</span><br/><span className={s.latencyColor === 'green' ? 'text-green-400' : s.latencyColor === 'red' ? 'text-red-400' : 'text-amber-400'}>{s.latency}</span></div>
              <div><span className="text-white/25">ERRORS</span><br/><span className="text-white/50">{s.errors}</span></div>
              <div><span className="text-white/25">UPTIME</span><br/><span className="text-white/50">{s.uptime}</span></div>
              <div><span className="text-white/25">REGION</span><br/><span className="text-white/50">{s.region}</span></div>
            </div>
            <div className="mt-2 p-1.5 rounded bg-white/[0.02] text-[9px] text-white/40">
              <Activity size={10} className="inline mr-1" /> {s.extra}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
              <span className="text-[8px] text-white/20">{s.last}</span>
              <button
                className="text-[8px] text-white/25 hover:text-white/40 flex items-center gap-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={mode === 'live'}
                title={mode === 'live' ? 'Logs require integrations' : 'Demo placeholder'}
              >
                <Terminal size={8} /> View Logs
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Latency + Error charts */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 panel">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Latency Trend (60 min)</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData}>
                <XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 8 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}m`} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 8 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 10 }} />
                <Area type="monotone" dataKey="supabase" stroke="#06b6d4" fill="none" strokeWidth={1} />
                <Area type="monotone" dataKey="vercel" stroke="#06b6d4aa" fill="none" strokeWidth={1} />
                <Area type="monotone" dataKey="metaapi" stroke="#ef4444" fill="none" strokeWidth={1.5} />
                <Area type="monotone" dataKey="openai" stroke="#f59e0b" fill="none" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-6 panel">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Error Rate (60 min)</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={errorData}>
                <XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 8 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}m`} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 8 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 10 }} />
                <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="#ef444411" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* API Requests + Cache */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 panel">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">API Requests (Hourly)</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apiRequests}>
                <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 10 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                  {apiRequests.map((_, i) => (
                    <Cell key={i} fill={i === 2 ? '#06b6d4' : '#06b6d4aa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-5 panel">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Cache Hit Rate</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <PieChart width={80} height={80}>
                <Pie data={cacheData} cx={40} cy={40} innerRadius={28} outerRadius={36} dataKey="value" stroke="none">
                  <Cell fill="#06b6d4" />
                  <Cell fill="#ffffff15" />
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-white/80">87%</span>
                <span className="text-[7px] text-white/25">hit rate</span>
              </div>
            </div>
            <div className="space-y-1 flex-1">
              {cacheData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: i === 0 ? '#06b6d4' : '#ffffff15' }} />
                  <span className="text-[9px] text-white/40">{d.name}</span>
                  <span className="text-[10px] text-white/60 ml-auto">{d.value}%</span>
                </div>
              ))}
              <div className="text-[9px] text-white/25 pt-1">7-day avg <span className="text-white/40 ml-2">91%</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Circuit Breakers + API Quotas */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 panel">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Circuit Breakers</h3>
          <div className="space-y-2">
            {circuitBreakers.map((cb) => (
              <div key={cb.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${cb.state === 'OPEN' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className="text-[11px] text-white/60">{cb.name}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    cb.state === 'OPEN' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                  }`}>{cb.state}</span>
                  <span className="text-[9px] text-white/30">{cb.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-white/20">{cb.ago}</span>
                  {cb.failures && <span className="text-[9px] text-red-400">{cb.failures}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-6 panel">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">API Quotas</h3>
          <div className="space-y-3">
            {apiQuotas.map((q) => (
              <div key={q.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-white/50">{q.name}</span>
                  <span className="text-[9px] text-white/30">{q.used.toLocaleString()} / {q.total.toLocaleString()}</span>
                  <span className={`text-[10px] ${q.color === 'red' ? 'text-red-400' : q.color === 'amber' ? 'text-amber-400' : 'text-green-400'}`}>{q.pct}%</span>
                </div>
                <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    q.color === 'red' ? 'bg-red-500' : q.color === 'amber' ? 'bg-amber-500' : 'bg-green-500'
                  }`} style={{ width: `${q.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fallback Counts */}
      <div className="panel" data-status={panelStatus}>
        <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Fallback Counts (24h)</h3>
        <div className="grid grid-cols-5 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>Service</span>
          <span>Primary</span>
          <span>Fallback</span>
          <span>Success Rate</span>
          <span>Avg Latency</span>
        </div>
        {fallbackCounts.map((f) => (
          <div key={f.service} className="grid grid-cols-5 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
            <span className="text-[11px] text-white/60">{f.service}</span>
            <span className="text-[10px] text-white/50">{f.primary}</span>
            <span className="text-[10px] text-amber-400">{f.fallback}</span>
            <span className="text-[10px] text-white/50">{f.success}</span>
            <span className={`text-[10px] ${f.latencyColor === 'green' ? 'text-green-400' : f.latencyColor === 'red' ? 'text-red-400' : 'text-amber-400'}`}>{f.latency}</span>
          </div>
        ))}
      </div>

      {/* Deployment Status */}
      <div className="panel" data-status={panelStatus}>
        <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Deployment Status</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-md bg-green-500/5 border border-green-500/10">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-400" />
              <div>
                <div className="text-[11px] font-semibold text-white/70">Production</div>
                <div className="text-[9px] text-white/30">{mode === 'live' ? '—' : 'v2.4.1 — Demo'}</div>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-md bg-cyan-500/5 border border-cyan-500/10">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-cyan-400" />
              <div>
                <div className="text-[11px] font-semibold text-white/70">Staging</div>
                <div className="text-[9px] text-white/30">v2.5.0-rc2 — Testing</div>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-white/30" />
              <div>
                <div className="text-[11px] font-semibold text-white/70">Last Deploy</div>
                <div className="text-[9px] text-white/30">2h 14m ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Logs */}
      <div className="panel" data-status={panelStatus}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal size={10} /> {mode === 'live' ? 'LOGS (PENDING)' : 'DEMO LOGS'}
          </h3>
          <div className="flex items-center gap-1">
            {['ALL', 'ERROR', 'WARN', 'INFO'].map((f) => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`text-[9px] px-2 py-0.5 rounded transition-colors ${
                  logFilter === f ? 'bg-white/[0.08] text-white/60' : 'text-white/20 hover:text-white/40'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1 font-mono">
          {liveLogs
            .filter((l) => logFilter === 'ALL' || l.level === logFilter)
            .map((l, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px] py-0.5">
                <span className="text-white/20 w-32 shrink-0">{l.time}</span>
                <span className={`w-12 shrink-0 ${
                  l.level === 'ERROR' ? 'text-red-400' : l.level === 'WARN' ? 'text-amber-400' : l.level === 'DEBUG' ? 'text-cyan-400' : 'text-green-400'
                }`}>[{l.level}]</span>
                <span className="text-white/30 w-20 shrink-0">{l.source}</span>
                <span className="text-white/40">{l.msg}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="panel" data-status={panelStatus}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider">Recent Incidents</h3>
          <button className="text-[9px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
            <AlertTriangle size={10} /> Create Incident
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>ID</span>
          <span>Title</span>
          <span>Status</span>
          <span>Duration</span>
          <span>Product</span>
          <span>Started</span>
        </div>
        {incidents.map((inc) => (
          <div key={inc.id} className="grid grid-cols-6 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
            <span className="text-[10px] text-white/40 font-mono">{inc.id}</span>
            <span className="text-[11px] text-white/60">{inc.title}</span>
            <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full w-fit ${
              inc.statusColor === 'red'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : inc.statusColor === 'amber'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-white/[0.03] text-white/30 border border-white/[0.06]'
            }`}>
              <span className="w-1 h-1 rounded-full bg-current" /> {inc.status}
            </span>
            <span className="text-[10px] text-white/40">{inc.duration}</span>
            <span className="text-[10px] text-white/40">{inc.product}</span>
            <span className="text-[9px] text-white/25">{inc.started}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
