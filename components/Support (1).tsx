import { MessageSquare, Bug, Lightbulb, BarChart3, Clock, ArrowRight } from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';

const ticketStats = [
  { label: 'OPEN', value: 7, change: '+2', color: 'green' },
  { label: 'URGENT', value: 7, change: '--', color: 'gray' },
  { label: 'BILLING', value: 3, change: '--', color: 'gray' },
  { label: 'MT5 ISSUES', value: 3, change: '+1', color: 'green' },
  { label: 'BUG REPORTS', value: 4, change: '-1', color: 'red' },
  { label: 'FEATURE REQUESTS', value: 3, change: '--', color: 'gray' },
];

const tickets = [
  { id: '#142', user: 'user#4521', product: 'AXE', plan: 'AXE Elite', severity: 'CRITICAL', severityColor: 'red', category: 'MT5', status: 'OPEN', statusColor: 'green', lastMessage: '2h ago', assigned: 'Support Team A' },
  { id: '#141', user: 'user#3892', product: 'TRADING OS', plan: 'Trading Pro', severity: 'HIGH', severityColor: 'amber', category: 'Billing', status: 'OPEN', statusColor: 'green', lastMessage: '4h ago', assigned: 'Billing Team' },
  { id: '#140', user: 'user#1204', product: 'AXE', plan: 'AXE Pro', severity: 'LOW', severityColor: 'gray', category: 'Feature', status: 'IN PROGRESS', statusColor: 'cyan', lastMessage: '1d ago', assigned: 'Product Team' },
  { id: '#139', user: 'user#5678', product: 'TRADING OS', plan: 'Trading Elite', severity: 'HIGH', severityColor: 'amber', category: 'Bug', status: 'IN PROGRESS', statusColor: 'cyan', lastMessage: '6h ago', assigned: 'Dev Team' },
  { id: '#138', user: 'user#9012', product: 'AXE', plan: 'AXE Pro', severity: 'MEDIUM', severityColor: 'cyan', category: 'Bug', status: 'OPEN', statusColor: 'green', lastMessage: '8h ago', assigned: 'Unassigned' },
  { id: '#137', user: 'user#3456', product: 'AXE', plan: 'AXE Elite', severity: 'HIGH', severityColor: 'amber', category: 'Billing', status: 'ESCALATED', statusColor: 'red', lastMessage: '30m ago', assigned: 'Billing Lead' },
  { id: '#136', user: 'user#7890', product: 'AXE', plan: 'AXE Pro', severity: 'MEDIUM', severityColor: 'cyan', category: 'Chat', status: 'OPEN', statusColor: 'green', lastMessage: '3h ago', assigned: 'AI Team' },
  { id: '#135', user: 'user#2468', product: 'AXE', plan: 'AXE Pro', severity: 'MEDIUM', severityColor: 'cyan', category: 'MT5', status: 'RESOLVED', statusColor: 'gray', lastMessage: '2d ago', assigned: 'Support Team A' },
  { id: '#134', user: 'user#1357', product: 'CORE', plan: 'Enterprise', severity: 'LOW', severityColor: 'gray', category: 'Feature', status: 'IN PROGRESS', statusColor: 'cyan', lastMessage: '1d ago', assigned: 'Engineering' },
  { id: '#133', user: 'user#8642', product: 'AXE', plan: 'AXE Elite', severity: 'CRITICAL', severityColor: 'red', category: 'Bug', status: 'ESCALATED', statusColor: 'red', lastMessage: '1h ago', assigned: 'Mobile Team' },
  { id: '#132', user: 'user#9753', product: 'AXE', plan: 'AXE Elite', severity: 'MEDIUM', severityColor: 'cyan', category: 'Billing', status: 'OPEN', statusColor: 'green', lastMessage: '5h ago', assigned: 'Billing Team' },
  { id: '#131', user: 'user#5820', product: 'AXE', plan: 'AXE Pro', severity: 'HIGH', severityColor: 'amber', category: 'Bug', status: 'IN PROGRESS', statusColor: 'cyan', lastMessage: '7h ago', assigned: 'AI Team' },
  { id: '#130', user: 'user#3194', product: 'AXE', plan: 'AXE Pro', severity: 'LOW', severityColor: 'gray', category: 'Feature', status: 'OPEN', statusColor: 'green', lastMessage: '12h ago', assigned: 'Unassigned' },
  { id: '#129', user: 'user#6075', product: 'AXE', plan: 'AXE Elite', severity: 'MEDIUM', severityColor: 'cyan', category: 'Chat', status: 'RESOLVED', statusColor: 'gray', lastMessage: '3d ago', assigned: 'AI Team' },
  { id: '#128', user: 'user#7531', product: 'TRADING OS', plan: 'Trading Pro', severity: 'HIGH', severityColor: 'amber', category: 'MT5', status: 'OPEN', statusColor: 'green', lastMessage: '9h ago', assigned: 'Dev Team' },
];

const categoryIcons: Record<string, React.ReactNode> = {
  'MT5': <BarChart3 size={10} />,
  'Billing': <MessageSquare size={10} />,
  'Feature': <Lightbulb size={10} />,
  'Bug': <Bug size={10} />,
  'Chat': <MessageSquare size={10} />,
};

export default function Support() {
  const { mode } = useDataMode();
  const panelStatus = mode === 'live' ? 'MISSING_CONFIG' : mode === 'hybrid' ? 'DEMO' : 'DEMO';

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {mode === 'live' && (
        <div className="px-3 py-2 rounded-md bg-purple-500/5 border border-purple-500/10">
          <span className="text-[11px] text-purple-300">
            Support integration is not connected yet. Live mode will show summaries only once configured.
          </span>
        </div>
      )}
      {/* Filters */}
      <div className="flex items-center gap-2">
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Products</option>
          <option>AXE</option>
          <option>Trading OS</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Categories</option>
          <option>Bug</option>
          <option>Feature</option>
          <option>Billing</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Severity</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <div className="flex-1" />
        <div className="flex items-center gap-2 bg-white/[0.03] rounded-md px-3 py-1.5 border border-white/[0.04]">
          <span className="text-white/20 text-[11px]">🔍</span>
          <input type="text" placeholder="Search tickets..." className="bg-transparent text-[11px] text-white/60 placeholder:text-white/20 outline-none w-32" />
        </div>
        <button className="text-[10px] text-white/30 hover:text-white/50">↻ Reset</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-3">
        {ticketStats.map((s) => (
          <div key={s.label} className="panel text-center" data-status={panelStatus}>
            <div className="text-[9px] text-white/30 uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-bold text-white/80 mt-1">{s.value}</div>
            <span className={`text-[9px] ${s.color === 'green' ? 'text-green-400' : s.color === 'red' ? 'text-red-400' : 'text-white/20'}`}>
              {s.change === '--' ? '—' : s.change.startsWith('+') ? `▲ ${s.change}` : `▼ ${s.change}`}
            </span>
          </div>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="panel" data-status={panelStatus}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-white/70">Tickets (15)</h3>
          <span className="text-[9px] text-white/20 flex items-center gap-1"><Clock size={10} /> Avg resolution: 4.2h</span>
        </div>
        <div className="grid grid-cols-9 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>ID</span>
          <span>User</span>
          <span>Product</span>
          <span>Plan</span>
          <span>Severity</span>
          <span>Category</span>
          <span>Status</span>
          <span>Last Message</span>
          <span>Assigned</span>
        </div>
        {tickets.map((t) => (
          <div key={t.id} className="grid grid-cols-9 gap-2 items-center py-2 border-t border-white/[0.04] px-2 group hover:bg-white/[0.01] transition-colors cursor-pointer">
            <span className="text-[9px] text-white/30 font-mono">{t.id}</span>
            <span className="text-[11px] text-white/60">{t.user}</span>
            <span className={`inline-flex items-center text-[8px] px-1.5 py-0.5 rounded w-fit ${
              t.product === 'AXE' ? 'bg-cyan-500/10 text-cyan-400' :
              t.product === 'TRADING OS' ? 'bg-purple-500/10 text-purple-400' :
              'bg-amber-500/10 text-amber-400'
            }`}>{t.product}</span>
            <span className="text-[9px] text-white/40">{t.plan}</span>
            <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full w-fit ${
              t.severityColor === 'red' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              t.severityColor === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              t.severityColor === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
              'bg-white/[0.03] text-white/30 border border-white/[0.06]'
            }`}>
              <span className="w-1 h-1 rounded-full bg-current" /> {t.severity}
            </span>
            <span className="text-[9px] text-white/30 flex items-center gap-1">{categoryIcons[t.category]} {t.category}</span>
            <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full w-fit ${
              t.statusColor === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              t.statusColor === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
              t.statusColor === 'red' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              'bg-white/[0.03] text-white/30 border border-white/[0.06]'
            }`}>
              <span className="w-1 h-1 rounded-full bg-current" /> {t.status}
            </span>
            <span className="text-[9px] text-white/25">{t.lastMessage}</span>
            <span className="text-[9px] text-white/30">{t.assigned}</span>
            <ArrowRight size={10} className="text-white/10 group-hover:text-white/30 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
