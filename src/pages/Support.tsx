import { LifeBuoy, RefreshCcw } from "lucide-react";
import { useAlertsFeed } from "../lib/hooks/useAlertsFeed";

function fmtTime(iso?: string) {
  if (!iso) return "—";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Support() {
  const { feed, runMonitor, loading, error } = useAlertsFeed(15000);
  const alerts = feed?.alerts ?? [];
  const supportQueue = alerts.filter((a) => a.severity === "critical" || a.category === "configuration");

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <LifeBuoy size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Support</h2>
        <button
          onClick={() => void runMonitor()}
          disabled={loading}
          className="ml-auto text-[10px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 disabled:opacity-60"
        >
          <RefreshCcw size={10} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-md bg-red-500/5 border border-red-500/10">
          <span className="text-[11px] text-red-300">Could not load support queue: {error}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="panel" data-status="LIVE"><div className="text-[10px] text-white/40">Open Queue</div><div className="text-lg font-semibold text-white/80 mt-1">{supportQueue.length}</div></div>
        <div className="panel" data-status="LIVE"><div className="text-[10px] text-white/40">Critical</div><div className="text-lg font-semibold text-red-300 mt-1">{supportQueue.filter((a) => a.severity === "critical").length}</div></div>
        <div className="panel" data-status="LIVE"><div className="text-[10px] text-white/40">Warnings</div><div className="text-lg font-semibold text-amber-300 mt-1">{supportQueue.filter((a) => a.severity === "warning").length}</div></div>
      </div>

      <div className="panel" data-status="LIVE">
        <h3 className="text-xs font-semibold text-white/70 mb-3">Support Tickets (from alerts)</h3>
        {supportQueue.length === 0 ? (
          <div className="text-[11px] text-white/35 py-6 text-center">No support-impacting alerts right now.</div>
        ) : (
          <div className="space-y-2">
            {supportQueue.slice(0, 15).map((item) => (
              <div key={item.id} className="grid grid-cols-5 gap-2 items-center py-2 border-b border-white/[0.04] last:border-0 text-[10px]">
                <span className="text-white/45">#{item.id.slice(-5)}</span>
                <span className="text-white/65 col-span-2">{item.message}</span>
                <span className={item.severity === "critical" ? "text-red-300" : "text-amber-300"}>{item.severity.toUpperCase()}</span>
                <span className="text-white/35">{fmtTime(item.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

