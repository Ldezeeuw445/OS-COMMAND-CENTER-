import { DollarSign } from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';

export default function Finance() {
  const { mode } = useDataMode();
  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Finance / Vault</h2>
        <span className="ml-2 text-[9px] px-2 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
          {mode === 'live' ? 'LIVE ONLY' : 'PENDING'}
        </span>
      </div>
      <div className="panel" data-status="LIVE">
        <h3 className="text-xs font-semibold text-white/70">Revenue Feed</h3>
        <p className="mt-2 text-[10px] text-white/35">
          No financial data available yet. Connect Stripe and backend revenue endpoints to populate MRR, invoices,
          subscription states, and cost analytics.
        </p>
        <div className="mt-3 rounded bg-white/[0.02] border border-white/[0.04] p-2">
          <p className="text-[10px] text-white/35">Expected sources:</p>
          <ul className="mt-1 space-y-1 text-[10px] text-white/45">
            <li>- Stripe subscriptions + invoices</li>
            <li>- Runtime cost telemetry (AI + infra)</li>
            <li>- Product revenue attribution (AXE / Trading OS)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
