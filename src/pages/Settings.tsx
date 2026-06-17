import { Settings2, Send, Wrench } from "lucide-react";
import { useState } from "react";
import { useOpsActions } from "../lib/hooks/useOpsActions";
import { useOpsSummary } from "../lib/hooks/useOpsSummary";
import { useAlertsFeed } from "../lib/hooks/useAlertsFeed";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const integrationIds = [
  "supabase_admin",
  "stripe",
  "github",
  "vercel",
  "cloudflare",
  "railway",
  "openai",
  "metaapi",
  "axe_companion",
  "axe_core",
];

export default function Settings() {
  const [selectedId, setSelectedId] = useState("cloudflare");
  const [reason, setReason] = useState("manual_action");
  const [notifMessage, setNotifMessage] = useState("Manual test notification from OS Command Center.");
  const [notifSeverity, setNotifSeverity] = useState<"critical" | "warning">("critical");
  const [otpValue, setOtpValue] = useState("");
  const [otpUnlockUntil, setOtpUnlockUntil] = useState<number | null>(null);

  const actions = useOpsActions();
  const { summary } = useOpsSummary();
  const { feed } = useAlertsFeed(15000);

  const monitor = feed?.monitor;
  const notifications = feed?.notifications;
  const integrations = summary?.integrations ?? feed?.snapshot?.integrations ?? {};
  const otpUnlocked = otpUnlockUntil != null && otpUnlockUntil > Date.now();
  const actionLocked = !otpUnlocked;

  function unlockActions() {
    if (otpValue.length < 6) return;
    // Local OTP gate: requires a 6-digit entry before manual ops actions.
    setOtpUnlockUntil(Date.now() + 10 * 60 * 1000);
    setOtpValue("");
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Settings2 size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Settings / Action Center</h2>
      </div>

      {(actions.error || actions.message) && (
        <div className={`px-3 py-2 rounded-md border ${actions.error ? "bg-red-500/5 border-red-500/10" : "bg-cyan-500/5 border-cyan-500/20"}`}>
          <span className={`text-[11px] ${actions.error ? "text-red-300" : "text-cyan-300"}`}>
            {actions.error || actions.message}
          </span>
        </div>
      )}

      <div className="panel" data-status={otpUnlocked ? "LIVE" : "PENDING"}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-xs font-semibold text-white/75">Action OTP</h3>
          <span className={`text-[10px] ${otpUnlocked ? "text-emerald-300" : "text-amber-300"}`}>
            {otpUnlocked ? "Unlocked (10m)" : "Locked"}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <button
            onClick={unlockActions}
            disabled={otpValue.length < 6}
            className="rounded-md border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 text-[11px] text-cyan-300 disabled:opacity-50"
          >
            Unlock Actions
          </button>
          {otpUnlocked ? (
            <button
              onClick={() => setOtpUnlockUntil(null)}
              className="rounded-md border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/65"
            >
              Lock now
            </button>
          ) : null}
        </div>
        <p className="text-[10px] text-white/35 mt-2">
          Manual monitor/recheck/notification actions are OTP-gated to prevent accidental execution.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="panel" data-status="LIVE">
          <div className="text-[10px] text-white/40">Monitor interval</div>
          <div className="text-lg font-semibold text-white/80 mt-1">{monitor ? `${Math.round(monitor.intervalMs / 1000)}s` : "—"}</div>
        </div>
        <div className="panel" data-status="LIVE">
          <div className="text-[10px] text-white/40">Last monitor run</div>
          <div className="text-lg font-semibold text-white/80 mt-1">{monitor?.lastRunAt ? new Date(monitor.lastRunAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
        </div>
        <div className="panel" data-status="LIVE">
          <div className="text-[10px] text-white/40">Notification channels</div>
          <div className="text-lg font-semibold text-white/80 mt-1">
            {[notifications?.channels.webhook ? "webhook" : "", notifications?.channels.slack ? "slack" : "", notifications?.channels.telegram ? "telegram" : ""].filter(Boolean).join(", ") || "none"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="panel" data-status="LIVE">
          <div className="flex items-center gap-2 mb-3">
            <Wrench size={14} className="text-cyan-300" />
            <h3 className="text-xs font-semibold text-white/70">Run Monitor</h3>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[11px] text-white/70 outline-none"
              placeholder="reason"
            />
            <button
              onClick={() => void actions.runMonitor(reason.trim() || "manual_action")}
              disabled={actions.loading || actionLocked}
              className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] text-cyan-300 disabled:opacity-50"
            >
              Run
            </button>
          </div>
        </div>

        <div className="panel" data-status="LIVE">
          <div className="flex items-center gap-2 mb-3">
            <Wrench size={14} className="text-cyan-300" />
            <h3 className="text-xs font-semibold text-white/70">Recheck Integration</h3>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[11px] text-white/70 outline-none"
            >
              {integrationIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
            <button
              onClick={() => void actions.recheckIntegration(selectedId)}
              disabled={actions.loading || actionLocked}
              className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] text-cyan-300 disabled:opacity-50"
            >
              Recheck
            </button>
          </div>
        </div>
      </div>

      <div className="panel" data-status="LIVE">
        <div className="flex items-center gap-2 mb-3">
          <Send size={14} className="text-cyan-300" />
          <h3 className="text-xs font-semibold text-white/70">Test Notification</h3>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <select
            value={notifSeverity}
            onChange={(e) => setNotifSeverity(e.target.value as "critical" | "warning")}
            className="col-span-2 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[11px] text-white/70 outline-none"
          >
            <option value="critical">critical</option>
            <option value="warning">warning</option>
          </select>
          <input
            value={notifMessage}
            onChange={(e) => setNotifMessage(e.target.value)}
            className="col-span-8 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[11px] text-white/70 outline-none"
            placeholder="Notification message"
          />
          <button
            onClick={() => void actions.testNotification(notifSeverity, notifMessage.trim() || "Manual test notification")}
            disabled={actions.loading || actionLocked}
            className="col-span-2 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] text-cyan-300 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      <div className="panel" data-status="LIVE">
        <h3 className="text-xs font-semibold text-white/70 mb-2">Integration Snapshot</h3>
        <div className="grid grid-cols-5 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>ID</span>
          <span>Status</span>
          <span>Connected</span>
          <span>Source</span>
          <span>Note</span>
        </div>
        {Object.entries(integrations).map(([id, row]) => (
          <div key={id} className="grid grid-cols-5 gap-2 items-center py-2 border-t border-white/[0.04] px-2 text-[10px]">
            <span className="text-white/55">{id}</span>
            <span className="text-white/65">{row?.status || "—"}</span>
            <span className="text-white/55">{row?.data?.connected ? "yes" : "no"}</span>
            <span className="text-white/45">{row?.source || "—"}</span>
            <span className="text-white/35 truncate">{row?.error || "ok"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

