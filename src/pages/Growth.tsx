import { BarChart3 } from "lucide-react";
import { useBillingSummary } from "../lib/hooks/useBillingSummary";

function money(value: number | undefined, currency = "USD") {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export default function Growth() {
  const { summary, loading, error } = useBillingSummary();
  const flow = summary?.data?.flow30d;
  const ccy = (summary?.data?.cash.currency || "usd").toUpperCase();

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Growth</h2>
      </div>

      {(loading || error) && (
        <div className={`px-3 py-2 rounded-md border ${error ? "bg-red-500/5 border-red-500/10" : "bg-white/[0.02] border-white/[0.08]"}`}>
          <span className="text-[11px] text-white/60">{loading ? "Loading growth metrics..." : `Growth metrics unavailable: ${error}`}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="panel" data-status={flow ? "LIVE" : "PENDING"}>
          <div className="text-[10px] text-white/40">Revenue Inflow (30d)</div>
          <div className="text-lg font-semibold text-white/80 mt-1">{money(flow?.inflow, ccy)}</div>
        </div>
        <div className="panel" data-status={flow ? "LIVE" : "PENDING"}>
          <div className="text-[10px] text-white/40">Cost Outflow (30d)</div>
          <div className="text-lg font-semibold text-white/80 mt-1">{money(flow?.outflow, ccy)}</div>
        </div>
        <div className="panel" data-status={flow ? "LIVE" : "PENDING"}>
          <div className="text-[10px] text-white/40">Net (30d)</div>
          <div className="text-lg font-semibold text-white/80 mt-1">
            {flow ? money(flow.inflow - flow.outflow, ccy) : "—"}
          </div>
        </div>
      </div>

      <div className="panel" data-status="PENDING">
        <h3 className="text-xs font-semibold text-white/70 mb-2">Campaign Analytics</h3>
        <div className="text-[11px] text-white/35 py-6 text-center">
          No real marketing sources connected yet (ad platforms/utm pipeline).
          <br />
          Connect campaign APIs to populate attribution and funnel blocks.
        </div>
      </div>
    </div>
  );
}
