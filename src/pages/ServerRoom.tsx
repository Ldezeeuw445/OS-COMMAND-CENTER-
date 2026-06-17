import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Terminal, Activity, Database, Globe, Cloud, Cpu, TrendingUp, CreditCard, Brain, Zap, Wifi } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useOpsSummary } from "../lib/hooks/useOpsSummary";
import { useAlertsFeed } from "../lib/hooks/useAlertsFeed";
import { useOpsActions } from "../lib/hooks/useOpsActions";
import type { IntegrationApiResult } from "../lib/apiClient";

type ServiceDef = {
  name: string;
  key?: string;
  group: string;
  icon: ReactNode;
};

const services: ServiceDef[] = [
  { name: "Supabase", key: "supabase_admin", group: "supabase", icon: <Database size={14} /> },
  { name: "Vercel", key: "vercel", group: "vercel", icon: <Globe size={14} /> },
  { name: "Cloudflare", key: "cloudflare", group: "cloudflare", icon: <Cloud size={14} /> },
  { name: "AXE Core", key: "axe_core", group: "cloudflare", icon: <Cpu size={14} /> },
  { name: "MetaApi", key: "metaapi", group: "metaapi", icon: <TrendingUp size={14} /> },
  { name: "Alpaca", group: "alpaca", icon: <TrendingUp size={14} /> },
  { name: "Stripe", key: "stripe", group: "stripe", icon: <CreditCard size={14} /> },
  { name: "OpenAI", key: "openai", group: "openai", icon: <Brain size={14} /> },
  { name: "Trading OS Engine", key: "railway", group: "railway", icon: <Zap size={14} /> },
  { name: "WebSocket Worker", key: "axe_companion", group: "cloudflare", icon: <Wifi size={14} /> },
];

const providerTabs = [
  { id: "all", label: "All Providers" },
  { id: "supabase", label: "Supabase" },
  { id: "cloudflare", label: "Cloudflare" },
  { id: "vercel", label: "Vercel" },
  { id: "railway", label: "Railway" },
  { id: "metaapi", label: "MetaApi" },
  { id: "alpaca", label: "Alpaca" },
];

function statusBadge(result: IntegrationApiResult | undefined) {
  if (!result) return { label: "NO DATA", cls: "bg-white/[0.04] text-white/40 border border-white/[0.08]", panel: "PENDING" };
  if (result.status === "live") return { label: "HEALTHY", cls: "bg-green-500/10 text-green-300 border border-green-500/20", panel: "LIVE" };
  if (result.status === "error") return { label: "ERROR", cls: "bg-red-500/10 text-red-300 border border-red-500/20", panel: "ERROR" };
  if (result.status === "missing_config") {
    return { label: "MISSING CONFIG", cls: "bg-purple-500/10 text-purple-300 border border-purple-500/20", panel: "MISSING_CONFIG" };
  }
  return { label: "PENDING", cls: "bg-white/[0.04] text-white/40 border border-white/[0.08]", panel: "PENDING" };
}

function fmtTime(iso?: string) {
  if (!iso) return "—";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ServerRoom() {
  const [provider, setProvider] = useState("all");
  const [logFilter, setLogFilter] = useState("ALL");
  const { summary, loading, error } = useOpsSummary();
  const { feed, runMonitor, loading: monitorLoading } = useAlertsFeed(15000);
  const actions = useOpsActions();

  const integrations = summary?.integrations ?? feed?.snapshot?.integrations ?? {};
  const alerts = feed?.alerts ?? [];
  const activeIncidents = alerts.filter((a) => a.severity === "critical");

  const visibleServices = services.filter((service) => provider === "all" || service.group === provider);
  const liveCount = Object.values(integrations).filter((i) => i?.status === "live").length;
  const errorCount = Object.values(integrations).filter((i) => i?.status === "error").length;
  const missingCount = Object.values(integrations).filter((i) => i?.status === "missing_config").length;

  const alertChartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const row of alerts.slice(0, 50)) {
      const key = fmtTime(row.createdAt);
      grouped[key] = (grouped[key] || 0) + 1;
    }
    return Object.entries(grouped).map(([time, count]) => ({ time, count })).slice(-10);
  }, [alerts]);

  const logs = alerts
    .map((entry) => ({
      time: entry.createdAt,
      level: entry.severity === "critical" ? "ERROR" : "WARN",
      source: entry.category.toUpperCase(),
      message: entry.message,
    }))
    .filter((row) => logFilter === "ALL" || row.level === logFilter);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-4 px-3 py-2 rounded-md bg-amber-500/5 border border-amber-500/10">
        <span className="text-[11px] text-amber-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> {activeIncidents.length} Critical Alerts
        </span>
        <span className="text-[10px] text-white/40">Connected: <span className="text-white/60">{liveCount}</span></span>
        <span className="text-[10px] text-white/40">Errors: <span className="text-red-400">{errorCount}</span></span>
        <span className="text-[10px] text-white/40">Missing: <span className="text-purple-300">{missingCount}</span></span>
        <button
          onClick={() => void runMonitor()}
          disabled={monitorLoading}
          className="ml-auto text-[10px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 disabled:opacity-60"
        >
          <RefreshCcw size={10} className={monitorLoading ? "animate-spin" : ""} /> Refresh checks
        </button>
      </div>

      {(loading || error) && (
        <div className={`px-3 py-2 rounded-md border ${error ? "bg-red-500/5 border-red-500/10" : "bg-white/[0.02] border-white/[0.08]"}`}>
          <span className="text-[11px] text-white/60">{loading ? "Loading integration checks..." : `Unable to load checks: ${error}`}</span>
        </div>
      )}
      {(actions.error || actions.message) && (
        <div className={`px-3 py-2 rounded-md border ${actions.error ? "bg-red-500/5 border-red-500/10" : "bg-cyan-500/5 border-cyan-500/20"}`}>
          <span className={`text-[11px] ${actions.error ? "text-red-300" : "text-cyan-300"}`}>
            {actions.error || actions.message}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {providerTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setProvider(tab.id)}
            className={`text-[10px] px-2.5 py-1 rounded-md border transition-colors ${
              provider === tab.id ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20" : "bg-white/[0.02] text-white/40 border-white/[0.06] hover:text-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {visibleServices.map((service) => {
          const result = service.key ? integrations[service.key] : undefined;
          const badge = statusBadge(result);
          return (
            <div key={service.name} className="panel" data-status={badge.panel}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40">{service.icon}</div>
                <div>
                  <h4 className="text-[11px] font-semibold text-white/70">{service.name}</h4>
                  <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full border ${badge.cls}`}>
                    <span className="w-1 h-1 rounded-full bg-current" /> {badge.label}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                <div><span className="text-white/25">STATUS</span><br /><span className="text-white/55">{result?.status || "pending"}</span></div>
                <div><span className="text-white/25">CONNECTED</span><br /><span className="text-white/55">{result?.data?.connected ? "yes" : "no"}</span></div>
                <div><span className="text-white/25">SOURCE</span><br /><span className="text-white/55">{result?.source || "—"}</span></div>
                <div><span className="text-white/25">UPDATED</span><br /><span className="text-white/55">{fmtTime(result?.updatedAt)}</span></div>
              </div>
              <div className="mt-2 p-1.5 rounded bg-white/[0.02] text-[9px] text-white/40">
                <Activity size={10} className="inline mr-1" /> {result?.error || "No extra telemetry yet."}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                <span className="text-[8px] text-white/20">{service.key || "manual integration"}</span>
                <div className="flex items-center gap-2">
                  {service.key && (
                    <button
                      onClick={() => void actions.recheckIntegration(service.key!)}
                      disabled={actions.loading}
                      className="text-[8px] text-cyan-300/80 hover:text-cyan-200 disabled:opacity-50 flex items-center gap-0.5"
                    >
                      <RefreshCcw size={8} className={actions.loading ? "animate-spin" : ""} /> Recheck
                    </button>
                  )}
                  <button onClick={() => setLogFilter("ALL")} className="text-[8px] text-white/25 hover:text-white/40 flex items-center gap-0.5">
                    <Terminal size={8} /> View Logs
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 panel" data-status="LIVE">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Alert Frequency</h3>
          <div className="h-40">
            {alertChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[11px] text-white/35">No incident history yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertChartData}>
                  <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 8 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 8 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 10 }} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="col-span-6 panel" data-status="PENDING">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Telemetry</h3>
          <div className="h-40 flex items-center justify-center text-[11px] text-white/35">No latency/error time-series source connected yet.</div>
        </div>
      </div>

      <div className="panel" data-status="LIVE">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal size={10} /> Live Alerts Feed
          </h3>
          <div className="flex items-center gap-1">
            {["ALL", "ERROR", "WARN"].map((f) => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`text-[9px] px-2 py-0.5 rounded transition-colors ${logFilter === f ? "bg-white/[0.08] text-white/60" : "text-white/20 hover:text-white/40"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1 font-mono">
          {logs.length === 0 ? (
            <div className="text-[10px] text-white/30 py-5 text-center">No alerts yet.</div>
          ) : (
            logs.slice(0, 14).map((row, i) => (
              <div key={`${row.time}-${i}`} className="flex items-center gap-3 text-[10px] py-0.5">
                <span className="text-white/20 w-16 shrink-0">{fmtTime(row.time)}</span>
                <span className={`w-12 shrink-0 ${row.level === "ERROR" ? "text-red-400" : "text-amber-400"}`}>[{row.level}]</span>
                <span className="text-white/30 w-20 shrink-0">{row.source}</span>
                <span className="text-white/40">{row.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel" data-status="LIVE">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] text-white/40 uppercase tracking-wider">Recent Incidents</h3>
          <button onClick={() => void runMonitor()} className="text-[9px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
            <AlertTriangle size={10} /> Run Monitor
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>ID</span><span>Title</span><span>Status</span><span>Duration</span><span>Product</span><span>Started</span>
        </div>
        {alerts.slice(0, 8).map((inc, idx) => (
          <div key={inc.id} className="grid grid-cols-6 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
            <span className="text-[10px] text-white/40 font-mono">#{idx + 1}</span>
            <span className="text-[11px] text-white/60">{inc.message}</span>
            <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full w-fit ${inc.severity === "critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
              <span className="w-1 h-1 rounded-full bg-current" /> {inc.severity.toUpperCase()}
            </span>
            <span className="text-[10px] text-white/40">—</span>
            <span className="text-[10px] text-white/40">{inc.category}</span>
            <span className="text-[9px] text-white/25">{fmtTime(inc.createdAt)}</span>
          </div>
        ))}
        {alerts.length === 0 && <div className="text-[10px] text-white/30 py-4 text-center">No incidents recorded yet.</div>}
      </div>
    </div>
  );
}

