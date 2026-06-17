import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";
import { useOpsSummary } from "../lib/hooks/useOpsSummary";
import { useAlertsFeed } from "../lib/hooks/useAlertsFeed";

function fmtTime(iso?: string) {
  if (!iso) return "—";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Overview() {
  const { summary, loading, error } = useOpsSummary();
  const { feed } = useAlertsFeed(15000);
  const integrations = summary?.integrations ?? feed?.snapshot?.integrations ?? {};
  const alerts = feed?.alerts ?? [];

  const topAgentsData = alerts.length
    ? Object.entries(
        alerts.reduce<Record<string, number>>((acc, a) => {
          acc[a.category] = (acc[a.category] || 0) + 1;
          return acc;
        }, {}),
      ).map(([name, value]) => ({ name, value }))
    : [];

  const systems = [
    ["Supabase", integrations.supabase_admin],
    ["Cloudflare", integrations.cloudflare],
    ["Vercel", integrations.vercel],
    ["MetaApi", integrations.metaapi],
    ["Stripe", integrations.stripe],
    ["OpenAI", integrations.openai],
    ["Railway", integrations.railway],
    ["AXE Core", integrations.axe_core],
    ["AXE Companion", integrations.axe_companion],
  ] as const;

  const connected = Object.values(integrations).filter((x) => x?.status === "live").length;
  const errors = Object.values(integrations).filter((x) => x?.status === "error").length;
  const missing = Object.values(integrations).filter((x) => x?.status === "missing_config").length;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      {(loading || error) && (
        <div className={`px-3 py-2 rounded-md border ${error ? "bg-red-500/5 border-red-500/10" : "bg-white/[0.02] border-white/[0.08]"}`}>
          <span className="text-[11px] text-white/60">{loading ? "Loading live summary..." : `Could not load summary: ${error}`}</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 panel" data-status="LIVE">
          <h3 className="text-xs font-semibold text-white/70 mb-3">Top Alert Categories</h3>
          <div className="h-48">
            {topAgentsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[11px] text-white/35">No alert data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAgentsData}>
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 11 }} />
                  <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="col-span-5 panel" data-status="LIVE">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/70">System Status</h3>
            <span className="text-[9px] text-white/30 flex items-center gap-1">Live checks <ChevronRight size={10} /></span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {systems.map(([name, row]) => (
              <div key={name} className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-white/[0.02] border border-white/[0.04]">
                <span className={`w-1.5 h-1.5 rounded-full ${row?.status === "live" ? "bg-green-400" : row?.status === "error" ? "bg-red-400" : "bg-purple-400"}`} />
                <span className="text-[9px] text-white/50">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-white/70 mb-3">HQ Rooms</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="panel" data-status="LIVE"><div className="text-[11px] text-white/70">Connected Integrations</div><div className="text-lg text-white/85 font-semibold mt-1">{connected}</div></div>
          <div className="panel" data-status="ERROR"><div className="text-[11px] text-white/70">Integration Errors</div><div className="text-lg text-red-300 font-semibold mt-1">{errors}</div></div>
          <div className="panel" data-status="MISSING_CONFIG"><div className="text-[11px] text-white/70">Missing Config</div><div className="text-lg text-purple-300 font-semibold mt-1">{missing}</div></div>
          <div className="panel" data-status="LIVE"><div className="text-[11px] text-white/70">Alerts (24h)</div><div className="text-lg text-white/85 font-semibold mt-1">{alerts.length}</div></div>
        </div>
      </div>

      <div className="panel" data-status="LIVE">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-white/70">Recent Incidents & Alerts</h3>
        </div>
        <div className="space-y-2">
          {alerts.slice(0, 8).map((inc) => (
            <div key={inc.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-3">
                {inc.severity === "critical" ? <AlertTriangle size={14} className="text-red-400" /> : <CheckCircle size={14} className="text-amber-400" />}
                <span className="text-[11px] text-white/60">{inc.message}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[9px] text-white/25">{fmtTime(inc.createdAt)}</span>
                <span className="text-[9px] text-white/30">{inc.category}</span>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-medium ${inc.severity === "critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                  {inc.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
          {alerts.length === 0 && <div className="text-[11px] text-white/35 py-5 text-center">No alerts yet.</div>}
        </div>
      </div>
    </div>
  );
}

