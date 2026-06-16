import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { ArrowDown, ArrowUp, Globe, Megaphone, Send, Sparkles, Target } from "lucide-react";
import { useDataMode } from "../src/lib/dataMode";

const stats = [
  { label: "LANDING VISITORS", value: "15.420", change: "+8%" },
  { label: "SIGNUPS", value: "1.210", change: "+12%" },
  { label: "WAITLIST SIZE", value: "2.847", change: "+12%" },
  { label: "CONVERSION RATE", value: "18%", change: "+2.1pp" },
  { label: "PAID CONVERSION", value: "15%", change: "+1.2pp" },
  { label: "CTA PERFORMANCE", value: "42%", change: "+3pp" },
];

const funnel = [
  { stage: "Landing Page", value: 15420, conv: "18.4%", drop: "81.6%" },
  { stage: "Waitlist", value: 2847, conv: "42.5%", drop: "57.5%" },
  { stage: "App Signup", value: 1210, conv: "15.3%", drop: "84.7%" },
  { stage: "Paid", value: 186, conv: "14.9%", drop: null },
];

const sources = [
  { name: "Organic Search", value: 5420, pct: 22.4, color: "#06b6d4" },
  { name: "Paid Ads", value: 3180, pct: 14.2, color: "#8b5cf6" },
  { name: "Social Media", value: 2850, pct: 11.8, color: "#f59e0b" },
  { name: "Referral", value: 2140, pct: 28.6, color: "#10b981" },
  { name: "Direct", value: 1830, pct: 19.3, color: "#6b7280" },
];

const campaigns = [
  { name: "AXE Launch", status: "DEMO", channel: "Email", impressions: "12.400", clicks: "3.000", conv: "33.5%" },
  { name: "Trading OS Waitlist", status: "DEMO", channel: "X", impressions: "18.220", clicks: "2.140", conv: "11.7%" },
  { name: "MT5 Sync Feature", status: "DEMO", channel: "Blog", impressions: "4.120", clicks: "840", conv: "20.4%" },
];

export default function Growth() {
  const { mode } = useDataMode();
  const panelStatus = mode === "live" ? "MISSING_CONFIG" : "DEMO";

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {mode === "live" && (
        <div className="rounded-md border border-purple-500/10 bg-purple-500/5 px-3 py-2">
          <span className="text-[11px] text-purple-300">
            Growth analytics not connected. Live mode stays empty until a provider/table exists.
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Megaphone size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Growth Studio</h2>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="panel" data-status={panelStatus}>
            <div className="text-[9px] text-white/30 uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-bold text-white/80 mt-1">{s.value}</div>
            <div className="flex items-center gap-1 mt-1 text-[9px] text-green-400">
              <ArrowUp size={10} /> {s.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 panel" data-status={panelStatus}>
          <h3 className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
            <Target size={14} className="text-cyan-400" /> Funnel
          </h3>
          <div className="space-y-2">
            {funnel.map((f) => (
              <div key={f.stage} className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 w-28">{f.stage}</span>
                <div className="flex-1 h-8 bg-white/[0.03] rounded-md overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500/40 to-cyan-500/20 px-2 flex items-center"
                    style={{ width: `${Math.max(8, (f.value / 15420) * 100)}%` }}
                  >
                    <span className="text-[10px] font-semibold text-white/80">{f.value.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-[9px] text-white/25 w-14 text-right">{f.conv}</span>
                {f.drop ? (
                  <span className="text-[9px] text-red-400 w-14 text-right">
                    <ArrowDown size={10} className="inline" /> {f.drop}
                  </span>
                ) : (
                  <span className="text-[9px] text-white/15 w-14 text-right">—</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 panel" data-status={panelStatus}>
          <h3 className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
            <Globe size={14} className="text-cyan-400" /> Traffic Sources
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sources} layout="vertical" margin={{ left: 70 }}>
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                  {sources.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {sources.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-[10px] text-white/45">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="flex-1">{s.name}</span>
                <span className="text-white/30">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel" data-status={panelStatus}>
        <h3 className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-400" /> Campaigns
        </h3>
        <div className="grid grid-cols-5 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>Name</span>
          <span>Status</span>
          <span>Channel</span>
          <span>Impressions</span>
          <span>Conversion</span>
        </div>
        {campaigns.map((c) => (
          <div key={c.name} className="grid grid-cols-5 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
            <span className="text-[11px] text-white/60">{c.name}</span>
            <span className="text-[9px] text-amber-400">{c.status}</span>
            <span className="text-[10px] text-white/35">{c.channel}</span>
            <span className="text-[10px] text-white/35">{c.impressions}</span>
            <span className="text-[10px] text-white/35">{c.conv}</span>
          </div>
        ))}

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="text-[10px] px-2 py-1 rounded border border-white/[0.06] bg-white/[0.03] text-white/40 hover:bg-white/[0.05] inline-flex items-center gap-1"
            disabled={mode === "live"}
            title={mode === "live" ? "Requires integrations" : "Demo placeholder"}
          >
            <Send size={12} /> Create campaign
          </button>
        </div>
      </div>
    </div>
  );
}

