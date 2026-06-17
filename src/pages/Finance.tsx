import { DollarSign, RefreshCcw } from "lucide-react";
import { useBillingSummary } from "../lib/hooks/useBillingSummary";
import { useOpsSummary } from "../lib/hooks/useOpsSummary";

function money(value: number | undefined, currency = "USD") {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export default function Finance() {
  const { summary: billing, loading, error } = useBillingSummary();
  const { summary: ops } = useOpsSummary();
  const data = billing?.data;
  const ccy = (data?.cash.currency || "usd").toUpperCase();

  const cards = [
    { label: "Cash Available", value: money(data?.cash.available, ccy) },
    { label: "Cash Pending", value: money(data?.cash.pending, ccy) },
    { label: "Inflow 30d", value: money(data?.flow30d.inflow, ccy) },
    { label: "Outflow 30d", value: money(data?.flow30d.outflow, ccy) },
    { label: "Fees 30d", value: money(data?.flow30d.fees, ccy) },
    { label: "Premium Subs", value: typeof data?.subscriptions.premium === "number" ? String(data.subscriptions.premium) : "—" },
    { label: "Free Subs", value: typeof data?.subscriptions.free === "number" ? String(data.subscriptions.free) : "—" },
    { label: "MetaApi Balance", value: money(ops?.metaApiBalance?.data?.balance ?? undefined, (ops?.metaApiBalance?.data?.currency || "usd").toUpperCase()) },
  ];

  const subRows = data
    ? [
        ["Active", data.subscriptions.active],
        ["Trialing", data.subscriptions.trialing],
        ["Past due", data.subscriptions.past_due],
        ["Canceled", data.subscriptions.canceled],
        ["Unpaid", data.subscriptions.unpaid],
      ]
    : [];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Finance / Vault</h2>
        <span className="ml-2 text-[9px] px-2 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-500/20">LIVE DATA</span>
      </div>

      {(loading || error) && (
        <div className={`px-3 py-2 rounded-md border ${error ? "bg-red-500/5 border-red-500/10" : "bg-white/[0.02] border-white/[0.08]"}`}>
          <span className="text-[11px] text-white/60">{loading ? "Loading billing..." : `Billing unavailable: ${error}`}</span>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="panel" data-status={data ? "LIVE" : "PENDING"}>
            <span className="stat-label">{card.label}</span>
            <div className="text-lg font-bold text-white/80 mt-1">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 panel" data-status={data ? "LIVE" : "PENDING"}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/70">Subscription States</h3>
            <RefreshCcw size={12} className="text-white/30" />
          </div>
          {subRows.length === 0 ? (
            <div className="text-[11px] text-white/35 py-10 text-center">No Stripe subscription data yet.</div>
          ) : (
            <div className="space-y-2">
              {subRows.map(([label, count]) => (
                <div key={label} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0">
                  <span className="text-[10px] text-white/45">{label}</span>
                  <span className="text-[11px] text-white/70">{String(count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-span-6 panel" data-status={ops?.metaApiBalance?.ok ? "LIVE" : "PENDING"}>
          <h3 className="text-xs font-semibold text-white/70 mb-3">MetaApi Account</h3>
          {ops?.metaApiBalance?.ok ? (
            <div className="space-y-2">
              <div className="text-[10px] text-white/40">Balance <span className="text-white/70 ml-2">{money(ops.metaApiBalance.data?.balance ?? undefined, (ops.metaApiBalance.data?.currency || "usd").toUpperCase())}</span></div>
              <div className="text-[10px] text-white/40">Equity <span className="text-white/70 ml-2">{money(ops.metaApiBalance.data?.equity ?? undefined, (ops.metaApiBalance.data?.currency || "usd").toUpperCase())}</span></div>
              <div className="text-[10px] text-white/40">Margin <span className="text-white/70 ml-2">{money(ops.metaApiBalance.data?.margin ?? undefined, (ops.metaApiBalance.data?.currency || "usd").toUpperCase())}</span></div>
            </div>
          ) : (
            <div className="text-[11px] text-white/35 py-10 text-center">No MetaApi balance feed yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

