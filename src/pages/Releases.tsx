import { GitBranch, RefreshCcw } from "lucide-react";
import { useOpsSummary } from "../lib/hooks/useOpsSummary";
import { useAlertsFeed } from "../lib/hooks/useAlertsFeed";

function fmtTime(iso?: string) {
  if (!iso) return "—";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Releases() {
  const { summary } = useOpsSummary();
  const { feed, runMonitor, loading } = useAlertsFeed(15000);
  const integrations = summary?.integrations ?? feed?.snapshot?.integrations ?? {};
  const alerts = feed?.alerts ?? [];

  const releaseInfra = [
    { name: "GitHub", key: "github" },
    { name: "Vercel", key: "vercel" },
    { name: "Railway", key: "railway" },
    { name: "Cloudflare", key: "cloudflare" },
  ] as const;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <GitBranch size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Releases</h2>
        <button
          onClick={() => void runMonitor()}
          disabled={loading}
          className="ml-auto text-[10px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 disabled:opacity-60"
        >
          <RefreshCcw size={10} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {releaseInfra.map((item) => {
          const row = integrations[item.key];
          return (
            <div
              key={item.name}
              className="panel"
              data-status={
                row?.status === "live" ? "LIVE" :
                row?.status === "error" ? "ERROR" :
                row?.status === "missing_config" ? "MISSING_CONFIG" : "PENDING"
              }
            >
              <div className="text-[10px] text-white/40">{item.name}</div>
              <div className="text-lg font-semibold text-white/80 mt-1">{row?.status || "pending"}</div>
              <div className="text-[9px] text-white/35 mt-2">{row?.error || "No deploy metadata endpoint connected yet."}</div>
            </div>
          );
        })}
      </div>

      <div className="panel" data-status="LIVE">
        <h3 className="text-xs font-semibold text-white/70 mb-2">Release-impacting incidents</h3>
        {alerts.length === 0 ? (
          <div className="text-[11px] text-white/35 py-6 text-center">No release incidents right now.</div>
        ) : (
          <div className="space-y-2">
            {alerts.slice(0, 10).map((a) => (
              <div key={a.id} className="grid grid-cols-4 gap-2 py-2 border-b border-white/[0.04] last:border-0 text-[10px]">
                <span className="text-white/65">{a.message}</span>
                <span className="text-white/40">{a.category}</span>
                <span className={a.severity === "critical" ? "text-red-300" : "text-amber-300"}>{a.severity.toUpperCase()}</span>
                <span className="text-white/35">{fmtTime(a.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

