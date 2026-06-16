import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  AlertTriangle, CheckCircle, ChevronRight
} from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';

const topAgentsData = [
  { name: 'Trade\nReviewer', value: 15600 },
  { name: 'Terminal\nCopilot', value: 14200 },
  { name: 'Support\nAgent', value: 9800 },
  { name: 'Journal\nCoach', value: 7600 },
  { name: 'Market\nContext', value: 5400 },
];

const systemStatus = [
  { name: 'Supabase', status: 'healthy' },
  { name: 'Edge Functions', status: 'healthy' },
  { name: 'Cloudflare', status: 'healthy' },
  { name: 'WebSocket', status: 'healthy' },
  { name: 'MetaApi', status: 'degraded' },
  { name: 'Stripe', status: 'healthy' },
  { name: 'AI Provider', status: 'healthy' },
  { name: 'Cache', status: 'healthy' },
  { name: 'CDN', status: 'healthy' },
];

const hqRooms = [
  { name: 'Products', active: 2, uptime: '98%', versions: 3, lastUpdate: '2m ago', status: 'healthy' },
  { name: 'Agent Offices', agents: 5, runs: 892, queued: 0, lastUpdate: 'Just now', status: 'healthy' },
  { name: 'Server Room', services: 9, warning: 1, avg: '342ms', lastUpdate: '1m ago', status: 'warning' },
  { name: 'Finance', mrr: '$14,230', mom: '+8%', paid: 186, lastUpdate: '15m ago', status: 'healthy' },
  { name: 'Support', open: 14, week: '-3', avg: '2.4h', lastUpdate: '5m ago', status: 'healthy' },
  { name: 'Growth', waitlist: '2,847', conv: '14.9%', wow: '+12%', lastUpdate: '1h ago', status: 'healthy' },
  { name: 'Users', total: '1,247', active: 892, rate: '72%', lastUpdate: '3m ago', status: 'healthy' },
  { name: 'Releases', version: 'v2.4.1 Live', ago: '2h ago', health: 'Healthy', lastUpdate: 'Just now', status: 'healthy' },
];

const incidents = [
  { id: 1, title: 'MT5 sync delay', time: '12m ago', product: 'Trading OS', status: 'degraded', icon: 'alert' },
  { id: 2, title: 'Deploy completed', time: '2h ago', product: 'All products', status: 'resolved', icon: 'check' },
  { id: 3, title: 'AI provider restored', time: '4h ago', product: 'AXE Core', status: 'resolved', icon: 'check' },
  { id: 4, title: 'High latency on Edge Functions', time: '6h ago', product: 'AXE Core', status: 'degraded', icon: 'alert' },
  { id: 5, title: 'Database backup completed', time: '8h ago', product: 'All products', status: 'resolved', icon: 'check' },
];

export default function Overview() {
  const { mode } = useDataMode();
  const panelStatus = mode === 'live' ? 'MISSING_CONFIG' : mode === 'hybrid' ? 'DEMO' : 'DEMO';
  const isLive = mode === 'live';

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {mode === 'live' && (
        <div className="px-3 py-2 rounded-md bg-purple-500/5 border border-purple-500/10">
          <span className="text-[11px] text-purple-300">
            Live executive snapshot requires integrations. Until then, live mode shows safe empty/pending states.
          </span>
        </div>
      )}
      {/* Top row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Top Agents Today */}
        <div className="col-span-7 panel" data-status={panelStatus}>
          <h3 className="text-xs font-semibold text-white/70 mb-3">Top Agents Today</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAgentsData} layout="horizontal" margin={{ left: 20, right: 20 }}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={24}>
                  {topAgentsData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#06b6d4' : i === 1 ? '#06b6d4aa' : '#06b6d455'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Status */}
        <div className="col-span-5 panel" data-status={panelStatus}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/70">System Status</h3>
            <button className="text-[9px] text-white/30 hover:text-white/50 flex items-center gap-1">
              Click to view Server Room <ChevronRight size={10} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {systemStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-white/[0.02] border border-white/[0.04]">
                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-purple-400' : s.status === 'healthy' ? 'bg-amber-500' : 'bg-amber-500'}`} />
                <span className="text-[9px] text-white/50">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HQ Rooms */}
      <div>
        <h3 className="text-xs font-semibold text-white/70 mb-3">HQ Rooms</h3>
        <div className="grid grid-cols-4 gap-3">
          {hqRooms.map((room) => (
            <div key={room.name} className="panel relative" data-status={panelStatus}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-semibold text-white/70">{room.name}</h4>
                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-purple-400' : room.status === 'healthy' ? 'bg-amber-500' : 'bg-amber-500'}`} />
              </div>
              <div className="space-y-1">
                {'active' in room && <div className="text-[9px] text-white/40"><span className={isLive ? 'text-white/25' : 'text-amber-400'}>●</span> {isLive ? '—' : room.active} Active</div>}
                {'agents' in room && <div className="text-[9px] text-white/40"><span className={isLive ? 'text-white/25' : 'text-amber-400'}>●</span> {isLive ? '—' : room.agents} Agents</div>}
                {'services' in room && <div className="text-[9px] text-white/40"><span className={isLive ? 'text-white/25' : 'text-amber-400'}>●</span> {isLive ? '—' : room.services} Services</div>}
                {'mrr' in room && <div className="text-[9px] text-white/40"><span className={isLive ? 'text-white/25' : 'text-amber-400'}>●</span> {isLive ? '—' : room.mrr} MRR</div>}
                {'open' in room && <div className="text-[9px] text-white/40"><span className={isLive ? 'text-white/25' : 'text-amber-400'}>●</span> {isLive ? '—' : room.open} Open</div>}
                {'waitlist' in room && <div className="text-[9px] text-white/40"><span className={isLive ? 'text-white/25' : 'text-amber-400'}>●</span> {isLive ? '—' : room.waitlist} Waitlist</div>}
                {'total' in room && <div className="text-[9px] text-white/40"><span className={isLive ? 'text-white/25' : 'text-amber-400'}>●</span> {isLive ? '—' : room.total} Total</div>}
                {'version' in room && (
                  <div className="text-[9px] text-white/40">
                    <span className={isLive ? 'text-white/25' : 'text-amber-400'}>●</span>{" "}
                    {isLive ? '—' : String(room.version).replace(' Live', '')}
                  </div>
                )}

                {'uptime' in room && <div className="text-[9px] text-white/40"><span className="text-green-400">●</span> {room.uptime} Uptime</div>}
                {'runs' in room && <div className="text-[9px] text-white/40"><span className="text-green-400">●</span> {room.runs} Runs</div>}
                {'warning' in room && <div className="text-[9px] text-white/40"><span className="text-amber-400">●</span> {room.warning} Warning</div>}
                {'mom' in room && <div className="text-[9px] text-white/40"><span className="text-green-400">●</span> {room.mom} MoM</div>}
                {'week' in room && <div className="text-[9px] text-white/40"><span className="text-white/30">●</span> {room.week} This week</div>}
                {'conv' in room && <div className="text-[9px] text-white/40"><span className="text-green-400">●</span> {room.conv} Conv</div>}
                {'active' in room && 'rate' in room && <div className="text-[9px] text-white/40"><span className="text-green-400">●</span> {room.rate} Rate</div>}
                {'health' in room && <div className="text-[9px] text-white/40"><span className="text-green-400">●</span> {room.health}</div>}
              </div>
              <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[8px] text-white/20">Last update: {room.lastUpdate}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-purple-400' : room.status === 'healthy' ? 'bg-amber-500' : 'bg-amber-500'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="panel" data-status={panelStatus}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-white/70">Recent Incidents & Alerts</h3>
          <button className="text-[9px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All <ChevronRight size={10} />
          </button>
        </div>
        <div className="space-y-2">
          {incidents.map((inc) => (
            <div key={inc.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-3">
                {inc.icon === 'alert' ? (
                  <AlertTriangle size={14} className="text-amber-500" />
                ) : (
                  <CheckCircle size={14} className="text-green-500" />
                )}
                <span className="text-[11px] text-white/60">{inc.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[9px] text-white/25">{inc.time}</span>
                <span className="text-[9px] text-white/30">{inc.product}</span>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-medium ${
                  inc.status === 'degraded'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-white/[0.03] text-white/30 border border-white/[0.06]'
                }`}>
                  {inc.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-[8px] text-white/15 pt-2 pb-4">
        OS Command Center · v1.0.0 · Build 2025.01 · Authorized personnel only
      </div>
    </div>
  );
}
