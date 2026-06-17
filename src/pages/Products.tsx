import { Activity, Boxes, RefreshCcw } from "lucide-react";
import { useOpsSummary } from "../lib/hooks/useOpsSummary";
import { useAlertsFeed } from "../lib/hooks/useAlertsFeed";

function panelStatus(status?: string) {
  if (status === "live") return "LIVE";
  if (status === "error") return "ERROR";
  if (status === "missing_config") return "MISSING_CONFIG";
  return "PENDING";
}

export default function Products() {
  const { summary, loading, error } = useOpsSummary();
  const { feed, runMonitor, loading: refreshLoading } = useAlertsFeed(15000);
  const integrations = summary?.integrations ?? feed?.snapshot?.integrations ?? {};
  const alerts = feed?.alerts ?? [];

  const products = [
    { name: "AXE Companion", key: "axe_companion", notes: "Trading runtime + chart/websocket stack" },
    { name: "AXE Core", key: "axe_core", notes: "Agent orchestration, logs, and policy engine" },
    { name: "Trading OS Engine", key: "railway", notes: "Backend services and automation workers" },
    { name: "WebSocket Worker", key: "cloudflare", notes: "Real-time streaming and edge gateway" },
  ] as const;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Boxes size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Products</h2>
        <button
          onClick={() => void runMonitor()}
          disabled={refreshLoading}
          className="ml-auto text-[10px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 disabled:opacity-60"
        >
          <RefreshCcw size={10} className={refreshLoading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {(loading || error) && (
        <div className={`px-3 py-2 rounded-md border ${error ? "bg-red-500/5 border-red-500/10" : "bg-white/[0.02] border-white/[0.08]"}`}>
          <span className="text-[11px] text-white/60">{loading ? "Loading product health..." : `Could not load product health: ${error}`}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const row = integrations[product.key];
          const productAlerts = alerts.filter((a) => a.message.toLowerCase().includes(product.name.toLowerCase()) || a.category.toLowerCase().includes(product.key));
          return (
            <div key={product.name} className="panel" data-status={panelStatus(row?.status)}>
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-white/75">{product.name}</h3>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
                  row?.status === "live" ? "bg-green-500/10 text-green-300 border-green-500/20" :
                  row?.status === "error" ? "bg-red-500/10 text-red-300 border-red-500/20" :
                  row?.status === "missing_config" ? "bg-purple-500/10 text-purple-300 border-purple-500/20" :
                  "bg-white/[0.04] text-white/45 border-white/[0.08]"
                }`}>
                  {row?.status || "pending"}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-white/35">{product.notes}</p>
              <div className="mt-3 text-[10px] text-white/45 space-y-1">
                <div>Connected: <span className="text-white/70">{row?.data?.connected ? "yes" : "no"}</span></div>
                <div>Source: <span className="text-white/70">{row?.source || "—"}</span></div>
                <div>Active alerts: <span className={productAlerts.length > 0 ? "text-amber-300" : "text-white/70"}>{productAlerts.length}</span></div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] text-[9px] text-white/35 flex items-center gap-1">
                <Activity size={10} /> {row?.error || "No extra telemetry available yet."}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

