import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, ArrowUp, ArrowDown, CreditCard, Users } from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';
import { liveValue } from '../src/lib/display';

const mrrData = [
  { month: 'Jan', mrr: 8200, target: 8000 },
  { month: 'Feb', mrr: 8800, target: 8500 },
  { month: 'Mar', mrr: 9400, target: 9000 },
  { month: 'Apr', mrr: 10200, target: 9500 },
  { month: 'May', mrr: 10800, target: 10000 },
  { month: 'Jun', mrr: 11400, target: 10500 },
  { month: 'Jul', mrr: 12340, target: 12000 },
  { month: 'Aug', mrr: 12900, target: 12500 },
  { month: 'Sep', mrr: 13400, target: 13000 },
  { month: 'Oct', mrr: 13800, target: 13500 },
  { month: 'Nov', mrr: 14200, target: 14000 },
  { month: 'Dec', mrr: 14600, target: 14500 },
];

const revenueBreakdown = [
  { name: 'AXE Companion', value: 45 },
  { name: 'Trading OS', value: 30 },
  { name: 'One-time', value: 15 },
  { name: 'Other', value: 10 },
];

const costBreakdown = [
  { name: 'AI Costs', cost: 2104, pct: 58, color: '#06b6d4' },
  { name: 'Infrastructure', cost: 890, pct: 24, color: '#8b5cf6' },
  { name: 'Stripe Fees', cost: 312, pct: 9, color: '#f59e0b' },
  { name: 'Other', cost: 234, pct: 7, color: '#6b7280' },
];

const plans = [
  { name: 'AXE Pro', price: '$29/mo', subs: 142, churn: '3.2%', revenue: '$4.118' },
  { name: 'AXE Elite', price: '$79/mo', subs: 38, churn: '2.1%', revenue: '$3.002' },
  { name: 'Trading Pro', price: '$49/mo', subs: 28, churn: '4.5%', revenue: '$1.372' },
  { name: 'Trading Elite', price: '$129/mo', subs: 6, churn: '1.8%', revenue: '$774' },
];

const subscriptions = [
  { state: 'Active', count: 156, color: '#06b6d4' },
  { state: 'Trialing', count: 24, color: '#06b6d4aa' },
  { state: 'Past Due', count: 4, color: '#f59e0b' },
  { state: 'Canceled', count: 12, color: '#ffffff22' },
  { state: 'Unpaid', count: 0, color: '#ffffff11' },
];

const failedInvoices = [
  { id: 'in_1aBcDe', user: 'user#4521', amount: '$29', reason: 'Card declined', status: 'RETRY', statusColor: 'amber', date: '2d ago' },
  { id: 'in_2fGhIj', user: 'user#3892', amount: '$79', reason: 'Expired card', status: 'FAILED', statusColor: 'red', date: '5d ago' },
  { id: 'in_3kLmNo', user: 'user#1204', amount: '$29', reason: 'Insufficient funds', status: 'RETRY', statusColor: 'amber', date: '1d ago' },
  { id: 're_4pQrSt', user: 'user#5678', amount: '$29', reason: 'Customer request', status: 'REFUNDED', statusColor: 'green', date: '7d ago' },
  { id: 'in_5uVwXy', user: 'user#9012', amount: '$49', reason: 'Bank reject', status: 'FAILED', statusColor: 'red', date: '12d ago' },
];

const REV_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#6b7280'];

export default function Finance() {
  const { mode } = useDataMode();
  const panelStatus = mode === 'live' ? 'MISSING_CONFIG' : mode === 'hybrid' ? 'DEMO' : 'DEMO';
  const v = (demo: string) => liveValue(mode, demo);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <DollarSign size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Finance / Vault</h2>
        <span className={`ml-2 text-[9px] px-2 py-0.5 rounded-full border ${
          mode === 'live'
            ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>{mode === 'live' ? 'MISSING CONFIG' : 'DEMO MODE'}</span>
      </div>

      {mode === 'live' && (
        <div className="px-3 py-2 rounded-md bg-purple-500/5 border border-purple-500/10">
          <span className="text-[11px] text-purple-300">
            Stripe is not connected yet. Live mode will not show any revenue until configured.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>30D</option>
          <option>7D</option>
          <option>90D</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All</option>
          <option>AXE</option>
          <option>Trading OS</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Plans</option>
          <option>Pro</option>
          <option>Elite</option>
        </select>
        <div className="flex-1" />
        <div className="flex items-center gap-2 bg-white/[0.03] rounded-md px-3 py-1.5 border border-white/[0.04]">
          <span className="text-white/20 text-[11px]">🔍</span>
          <input type="text" placeholder="Search invoices, users..." className="bg-transparent text-[11px] text-white/60 placeholder:text-white/20 outline-none w-40" />
        </div>
        <button className="text-[10px] text-white/30 hover:text-white/50">↻ Reset</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">MRR</span>
          <div className="text-lg font-bold text-white/80 mt-1">{v('$14.230')}</div>
          <span className="text-[9px] text-green-400 flex items-center gap-0.5 mt-1">{mode === 'live' ? '—' : (<><ArrowUp size={8} /> +8%</>)}</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">ARR Estimate</span>
          <div className="text-lg font-bold text-white/80 mt-1">{v('$170.760')}</div>
          <span className="text-[9px] text-green-400 flex items-center gap-0.5 mt-1">{mode === 'live' ? '—' : (<><ArrowUp size={8} /> +12%</>)}</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Total Revenue (MTD)</span>
          <div className="text-lg font-bold text-white/80 mt-1">{v('$18.450')}</div>
          <span className="text-[9px] text-green-400 flex items-center gap-0.5 mt-1">{mode === 'live' ? '—' : (<><ArrowUp size={8} /> +15%</>)}</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Subscribers</span>
          <div className="text-lg font-bold text-white/80 mt-1">{v('186')}</div>
          <span className="text-[9px] text-green-400 flex items-center gap-0.5 mt-1">{mode === 'live' ? '—' : (<><ArrowUp size={8} /> +3</>)}</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Net Margin</span>
          <div className="text-lg font-bold text-white/80 mt-1">{v('74%')}</div>
          <span className="text-[9px] text-green-400 flex items-center gap-0.5 mt-1">{mode === 'live' ? '—' : (<><ArrowUp size={8} /> +2pp</>)}</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">AI Costs</span>
          <div className="text-lg font-bold text-white/80 mt-1">{v('$2.104')}</div>
          <span className="text-[9px] text-green-400 flex items-center gap-0.5 mt-1">{mode === 'live' ? '—' : (<><ArrowUp size={8} /> +4%</>)}</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Infra Costs</span>
          <div className="text-lg font-bold text-white/80 mt-1">{v('$890')}</div>
          <span className="text-[9px] text-red-400 flex items-center gap-0.5 mt-1">{mode === 'live' ? '—' : (<><ArrowDown size={8} /> -1%</>)}</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Cost per User</span>
          <div className="text-lg font-bold text-white/80 mt-1">{v('$3')}</div>
          <span className="text-[9px] text-red-400 flex items-center gap-0.5 mt-1">{mode === 'live' ? '—' : (<><ArrowDown size={8} /> - $0.15</>)}</span>
        </div>
      </div>

      {/* MRR Trend + Revenue Breakdown */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 panel">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-white/70">MRR Trend (12 Months)</h3>
            <span className="text-[9px] text-white/20">Target vs Actual</span>
          </div>
          <div className="h-48">
            {mode === 'live' ? (
              <div className="h-full flex items-center justify-center text-[11px] text-white/35">
                Stripe integration missing. No MRR trend available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mrrData}>
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }} />
                <Area type="monotone" dataKey="mrr" stroke="#06b6d4" fill="#06b6d422" strokeWidth={2} />
                <Area type="monotone" dataKey="target" stroke="#f59e0b" fill="none" strokeWidth={1} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="col-span-4 panel">
          <h3 className="text-xs font-semibold text-white/70 mb-3">Revenue Breakdown</h3>
          <div className="flex justify-center">
            <PieChart width={140} height={140}>
              <Pie data={revenueBreakdown} cx={70} cy={70} innerRadius={45} outerRadius={65} dataKey="value" stroke="none">
                {revenueBreakdown.map((_, i) => (
                  <Cell key={i} fill={REV_COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {revenueBreakdown.map((r, i) => (
              <div key={r.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: REV_COLORS[i] }} />
                <span className="text-[9px] text-white/40">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Churn Rate</span>
          <div className="text-lg font-bold text-white/80 mt-1">4%</div>
          <span className="text-[9px] text-red-400 flex items-center gap-0.5 mt-1"><ArrowDown size={8} /> -0.3pp</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">LTV Estimate</span>
          <div className="text-lg font-bold text-white/80 mt-1">$1.824</div>
          <span className="text-[9px] text-green-400 flex items-center gap-0.5 mt-1"><ArrowUp size={8} /> +$120</span>
        </div>
        <div className="panel" data-status={panelStatus}>
          <span className="stat-label">Cancellations (30D)</span>
          <div className="text-lg font-bold text-white/80 mt-1">8</div>
          <span className="text-[9px] text-red-400 flex items-center gap-0.5 mt-1"><ArrowDown size={8} /> -2</span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="panel" data-status={panelStatus}>
        <h3 className="text-xs font-semibold text-white/70 mb-3">Cost Breakdown</h3>
        <div className="space-y-2">
          {costBreakdown.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="text-[10px] text-white/40 w-24">{c.name}</span>
              <div className="flex-1 h-3 bg-white/[0.03] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
              </div>
              <span className="text-[10px] text-white/60 w-12 text-right">${c.cost}</span>
              <span className="text-[9px] text-white/25 w-8 text-right">{c.pct}%</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.04]">
          <span className="text-[10px] text-white/40">Total Cost</span>
          <span className="text-[10px] text-white/60">$3,540</span>
          <span className="text-[9px] text-white/25">100%</span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[9px] text-white/25">
          <span>Margin: <span className="text-green-400">74%</span></span>
          <span>Cost/User: <span className="text-white/40">$3.25</span></span>
          <span>Cost/Active: <span className="text-white/40">$4.50</span></span>
          <span>Cost/AI Query: <span className="text-white/40">$0.024</span></span>
        </div>
      </div>

      {/* Plans + Subscriptions */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 panel">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/70">Stripe Plans</h3>
            <CreditCard size={14} className="text-white/20" />
          </div>
          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div>
                  <div className="text-[11px] font-semibold text-white/70">{p.name}</div>
                  <div className="text-[9px] text-white/25">{p.subs} subs · {p.churn} churn</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/40">{p.price}</div>
                  <div className="text-[9px] text-amber-400">{p.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-6 panel">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/70">Subscription States</h3>
            <Users size={14} className="text-white/20" />
          </div>
          <div className="space-y-2">
            {subscriptions.map((s) => (
              <div key={s.state} className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 w-16">{s.state}</span>
                <div className="flex-1 h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(s.count / 196) * 100}%`, background: s.color }} />
                </div>
                <span className="text-[10px] text-white/60 w-8 text-right">{s.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04] text-[9px] text-white/25">
            Total managed subscriptions <span className="text-white/40 ml-2">196</span>
          </div>
        </div>
      </div>

      {/* Failed Invoices */}
      <div className="panel" data-status={panelStatus}>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-xs font-semibold text-white/70">Failed Invoices & Refunds</h3>
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">2 failed</span>
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">$87 refunded</span>
        </div>
        <div className="grid grid-cols-6 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>ID</span>
          <span>User</span>
          <span>Amount</span>
          <span>Reason</span>
          <span>Status</span>
          <span>Date</span>
        </div>
        {failedInvoices.map((inv) => (
          <div key={inv.id} className="grid grid-cols-6 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
            <span className="text-[9px] text-white/20 font-mono">{inv.id}</span>
            <span className="text-[10px] text-white/60">{inv.user}</span>
            <span className="text-[10px] text-white/60">{inv.amount}</span>
            <span className="text-[9px] text-white/40">{inv.reason}</span>
            <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full w-fit ${
              inv.statusColor === 'red' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              inv.statusColor === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              <span className="w-1 h-1 rounded-full bg-current" /> {inv.status}
            </span>
            <span className="text-[9px] text-white/25">{inv.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
