import { UsersIcon } from "lucide-react";
import { useBillingSummary } from "../lib/hooks/useBillingSummary";
import { useOpsSummary } from "../lib/hooks/useOpsSummary";

export default function Users() {
  const { summary: billing } = useBillingSummary();
  const { summary: ops } = useOpsSummary();
  const sub = billing?.data?.subscriptions;
  const supabase = ops?.integrations?.supabase_admin;

  const totalKnown = sub ? sub.active + sub.trialing + sub.past_due + sub.canceled + sub.unpaid : 0;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <UsersIcon size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Users</h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="panel" data-status={sub ? "LIVE" : "PENDING"}>
          <div className="text-[10px] text-white/40">Known Subscribers</div>
          <div className="text-lg font-semibold text-white/80 mt-1">{sub ? totalKnown : "—"}</div>
        </div>
        <div className="panel" data-status={sub ? "LIVE" : "PENDING"}>
          <div className="text-[10px] text-white/40">Active</div>
          <div className="text-lg font-semibold text-white/80 mt-1">{sub ? sub.active : "—"}</div>
        </div>
        <div className="panel" data-status={sub ? "LIVE" : "PENDING"}>
          <div className="text-[10px] text-white/40">Trialing</div>
          <div className="text-lg font-semibold text-white/80 mt-1">{sub ? sub.trialing : "—"}</div>
        </div>
        <div className="panel" data-status={supabase?.status === "live" ? "LIVE" : "MISSING_CONFIG"}>
          <div className="text-[10px] text-white/40">Supabase User Feed</div>
          <div className="text-lg font-semibold text-white/80 mt-1">{supabase?.status || "pending"}</div>
        </div>
      </div>

      <div className="panel" data-status="PENDING">
        <h3 className="text-xs font-semibold text-white/70 mb-2">User Directory</h3>
        <div className="text-[11px] text-white/35 py-6 text-center">
          No direct user table endpoint connected yet.
          <br />
          Add a server route for Supabase user aggregates to unlock this view.
        </div>
      </div>
    </div>
  );
}

