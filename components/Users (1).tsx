import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';
import { ArrowUp, Crown } from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';

const userStats = [
  { label: 'TOTAL USERS', value: '15', change: '+45', color: 'green' },
  { label: 'ACTIVE TODAY', value: '0', change: '+23', color: 'green' },
  { label: 'NEW THIS WEEK', value: '0', change: '+8', color: 'green' },
  { label: 'CHURN RISK HIGH', value: '3', change: '+5', warning: true },
  { label: 'VIP USERS', value: '5', change: '+2', color: 'green' },
  { label: 'MT5 CONNECTED', value: '11', change: '+12', color: 'green' },
];

const planData = [
  { name: 'Free', value: 4, color: '#6b7280' },
  { name: 'Pro', value: 6, color: '#06b6d4' },
  { name: 'Elite', value: 5, color: '#8b5cf6' },
];

const activityData = [
  { name: 'Daily', value: 6, color: '#06b6d4' },
  { name: '3x/Week', value: 3, color: '#06b6d4aa' },
  { name: 'Weekly', value: 4, color: '#f59e0b' },
  { name: 'Monthly', value: 1, color: '#ffffff22' },
  { name: 'Inactive', value: 1, color: '#ffffff11' },
];

const users = [
  { initials: 'AM', name: 'Alex Morgan', id: 'u#452', email: 'alex.m@trader.com', plan: 'PRO', planColor: 'cyan', app: 'AXE', appColor: 'cyan', lastActive: '15mo ago', linked: 2, mt5: 'CONNECTED', mt5Color: 'green', chats: 847, risk: 'LOW', riskColor: 'green', vip: false },
  { initials: 'SC', name: 'Sarah Chen', id: 'u#891', email: 'sarah.chen@fxpro.io', plan: 'ELITE', planColor: 'purple', app: 'Both', appColor: 'gray', lastActive: '15mo ago', linked: 3, mt5: 'CONNECTED', mt5Color: 'green', chats: 3420, risk: 'LOW', riskColor: 'green', vip: true },
  { initials: 'MJ', name: 'Marcus Johnson', id: 'u#204', email: 'marcus.j@outlook.com', plan: 'PRO', planColor: 'cyan', app: 'Trading', appColor: 'purple', lastActive: '15mo ago', linked: 1, mt5: 'CONNECTED', mt5Color: 'green', chats: 423, risk: 'MEDIUM', riskColor: 'amber', vip: false },
  { initials: 'EW', name: 'Emily Watson', id: 'u#567', email: 'emily.w@gmail.com', plan: 'FREE', planColor: 'gray', app: 'AXE', appColor: 'cyan', lastActive: '15mo ago', linked: '—', mt5: 'OFFLINE', mt5Color: 'red', chats: 89, risk: 'HIGH', riskColor: 'red', vip: false },
  { initials: 'DP', name: 'David Park', id: 'u#103', email: 'david.park@kakao.com', plan: 'ELITE', planColor: 'purple', app: 'Both', appColor: 'gray', lastActive: '15mo ago', linked: 4, mt5: 'CONNECTED', mt5Color: 'green', chats: 5621, risk: 'LOW', riskColor: 'green', vip: true },
  { initials: 'NP', name: 'Nina Petrova', id: 'u#338', email: 'nina.p@yandex.ru', plan: 'PRO', planColor: 'cyan', app: 'Trading', appColor: 'purple', lastActive: '15mo ago', linked: 2, mt5: 'SYNCING', mt5Color: 'amber', chats: 1240, risk: 'LOW', riskColor: 'green', vip: false },
  { initials: 'JO', name: "James O'Connor", id: 'u#721', email: 'james.oconnor@ireland.ie', plan: 'FREE', planColor: 'gray', app: 'AXE', appColor: 'cyan', lastActive: '15mo ago', linked: 1, mt5: 'CONNECTED', mt5Color: 'green', chats: 234, risk: 'MEDIUM', riskColor: 'amber', vip: false },
  { initials: 'LN', name: 'Lisa Nakamura', id: 'u#445', email: 'lisa.n@tokyo.fx', plan: 'ELITE', planColor: 'purple', app: 'Trading', appColor: 'purple', lastActive: '15mo ago', linked: 2, mt5: 'CONNECTED', mt5Color: 'green', chats: 2890, risk: 'LOW', riskColor: 'green', vip: true },
  { initials: 'CM', name: 'Carlos Mendez', id: 'u#612', email: 'carlos.m@latam.trade', plan: 'PRO', planColor: 'cyan', app: 'AXE', appColor: 'cyan', lastActive: '15mo ago', linked: 1, mt5: 'OFFLINE', mt5Color: 'red', chats: 567, risk: 'HIGH', riskColor: 'red', vip: false },
  { initials: 'PS', name: 'Priya Sharma', id: 'u#779', email: 'priya.s@delhi.invest', plan: 'PRO', planColor: 'cyan', app: 'Both', appColor: 'gray', lastActive: '15mo ago', linked: 2, mt5: 'CONNECTED', mt5Color: 'green', chats: 1890, risk: 'LOW', riskColor: 'green', vip: false },
  { initials: 'TB', name: 'Tom Bradley', id: 'u#521', email: 'tom.b@london.fx', plan: 'FREE', planColor: 'gray', app: 'Trading', appColor: 'purple', lastActive: '15mo ago', linked: 1, mt5: 'CONNECTED', mt5Color: 'green', chats: 312, risk: 'MEDIUM', riskColor: 'amber', vip: false },
];

export default function Users() {
  const { mode } = useDataMode();
  const panelStatus = mode === 'live' ? 'MISSING_CONFIG' : mode === 'hybrid' ? 'DEMO' : 'DEMO';

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {mode === 'live' && (
        <div className="px-3 py-2 rounded-md bg-purple-500/5 border border-purple-500/10">
          <span className="text-[11px] text-purple-300">
            Supabase admin adapter is not connected. Live mode does not show any real user rows.
          </span>
        </div>
      )}
      {/* Title */}
      <h2 className="text-lg font-semibold text-white/80">User Intelligence</h2>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-3">
        {userStats.map((s) => (
          <div key={s.label} className="panel" data-status={panelStatus}>
            <div className="text-[8px] text-white/25 uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-bold text-white/80 mt-1">{s.value}</div>
            <span className={`text-[9px] flex items-center gap-0.5 mt-1 ${s.warning ? 'text-amber-400' : 'text-green-400'}`}>
              <ArrowUp size={8} /> {s.change}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-white/[0.03] rounded-md px-3 py-1.5 border border-white/[0.04] flex-1 max-w-md">
          <span className="text-white/20 text-[11px]">🔍</span>
          <input type="text" placeholder="Search users, emails, IDs..." className="bg-transparent text-[11px] text-white/60 placeholder:text-white/20 outline-none w-full" />
        </div>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Plans</option>
          <option>Free</option>
          <option>Pro</option>
          <option>Elite</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Apps</option>
          <option>AXE</option>
          <option>Trading</option>
          <option>Both</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Risks</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Users</option>
          <option>VIP</option>
        </select>
        <button className="text-[10px] text-white/30 hover:text-white/50">↻ Reset</button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 panel" data-status={panelStatus}>
          <h3 className="text-xs font-semibold text-white/70 mb-3">Users by Plan</h3>
          <div className="flex justify-center">
            <PieChart width={160} height={160}>
              <Pie data={planData} cx={80} cy={80} innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                {planData.map((p, i) => (
                  <Cell key={i} fill={p.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            {planData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                <span className="text-[9px] text-white/40">{p.name}: {p.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-6 panel" data-status={panelStatus}>
          <h3 className="text-xs font-semibold text-white/70 mb-3">Activity Distribution</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                  {activityData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="panel" data-status={panelStatus}>
        <div className="grid grid-cols-10 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>User</span>
          <span>Email</span>
          <span>Plan</span>
          <span>App</span>
          <span>Last Active</span>
          <span>Linked</span>
          <span>MT5</span>
          <span>Chats</span>
          <span>Risk</span>
          <span>VIP</span>
        </div>
        {users.map((u) => (
          <div key={u.id} className="grid grid-cols-10 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center">
                <span className="text-[8px] font-bold text-cyan-400">{u.initials}</span>
              </div>
              <div>
                <div className="text-[10px] text-white/60">{u.name}</div>
                <div className="text-[8px] text-white/20">{u.id}</div>
              </div>
            </div>
            <span className="text-[9px] text-white/40 truncate">{u.email}</span>
            <span className={`inline-flex items-center text-[8px] px-1.5 py-0.5 rounded w-fit ${
              u.planColor === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
              u.planColor === 'purple' ? 'bg-purple-500/10 text-purple-400' :
              'bg-white/[0.04] text-white/30'
            }`}>{u.plan}</span>
            <span className={`inline-flex items-center text-[8px] px-1.5 py-0.5 rounded w-fit ${
              u.appColor === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
              u.appColor === 'purple' ? 'bg-purple-500/10 text-purple-400' :
              'bg-white/[0.04] text-white/30'
            }`}>{u.app}</span>
            <span className="text-[9px] text-white/25">{u.lastActive}</span>
            <span className="text-[10px] text-white/40">{u.linked}</span>
            <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full w-fit ${
              u.mt5Color === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              u.mt5Color === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              <span className="w-1 h-1 rounded-full bg-current" /> {u.mt5}
            </span>
            <span className="text-[10px] text-white/40">{u.chats.toLocaleString()}</span>
            <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full w-fit ${
              u.riskColor === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              u.riskColor === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              <span className="w-1 h-1 rounded-full bg-current" /> {u.risk}
            </span>
            <span>{u.vip ? <Crown size={12} className="text-purple-400" /> : <span className="text-white/10">—</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
