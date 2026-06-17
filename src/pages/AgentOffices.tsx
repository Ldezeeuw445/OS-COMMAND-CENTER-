import { Bot, MessageSquare, RefreshCcw, ShieldAlert } from "lucide-react";
import { useAssistantChat } from "../lib/hooks/useAssistantChat";
import { useOpsSummary } from "../lib/hooks/useOpsSummary";
import { useAlertsFeed } from "../lib/hooks/useAlertsFeed";

function statusToPanel(status?: string) {
  if (status === "live") return "LIVE";
  if (status === "error") return "ERROR";
  if (status === "missing_config") return "MISSING_CONFIG";
  return "PENDING";
}

export default function AgentOffices() {
  const assistant = useAssistantChat();
  const { summary } = useOpsSummary();
  const { feed, runMonitor, loading } = useAlertsFeed(15000);
  const integrations = summary?.integrations ?? feed?.snapshot?.integrations ?? {};
  const alerts = feed?.alerts ?? [];

  const aiProviders = [
    { name: "OpenAI", key: "openai" },
    { name: "AXE Core Logs", key: "axe_core" },
  ] as const;

  const riskAlerts = alerts.filter((a) => a.category === "risk" || a.category === "integration");

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Bot size={18} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white/80">Agent Offices</h2>
        <button
          onClick={() => void runMonitor()}
          disabled={loading}
          className="ml-auto text-[10px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 disabled:opacity-60"
        >
          <RefreshCcw size={10} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="panel" data-status="LIVE">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold text-white/70">OS Command Core AI</h3>
          <span className="text-[9px] text-white/35">Cost-efficient default: <span className="font-mono text-white/55">gpt-4o-mini</span></span>
        </div>
        <form
          className="mt-2 flex flex-col gap-2 md:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const input = form.elements.namedItem("assistantMessage") as HTMLInputElement | null;
            const message = input?.value?.trim() || "";
            if (!message) return;
            await assistant.ask(message);
          }}
        >
          <input
            name="assistantMessage"
            type="text"
            placeholder="Vraag iets als: which issue should I fix first?"
            className="flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] text-white/70 placeholder:text-white/25 outline-none"
          />
          <button
            type="submit"
            disabled={assistant.loading}
            className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-[11px] text-cyan-300 disabled:opacity-50"
          >
            {assistant.loading ? "Thinking..." : "Ask Assistant"}
          </button>
        </form>
        {assistant.error && <p className="mt-2 text-[10px] text-red-300">{assistant.error}</p>}
        {assistant.reply && (
          <div className="mt-2 rounded border border-white/[0.06] bg-white/[0.02] p-2">
            <p className="text-[9px] text-white/35">Reply via <span className="font-mono text-white/50">{assistant.model || "unknown"}</span></p>
            <p className="mt-1 whitespace-pre-wrap text-[10px] text-white/70">{assistant.reply}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {aiProviders.map((provider) => {
          const row = integrations[provider.key];
          return (
            <div key={provider.name} className="panel" data-status={statusToPanel(row?.status)}>
              <h3 className="text-[12px] font-semibold text-white/75">{provider.name}</h3>
              <div className="mt-2 text-[10px] text-white/45 space-y-1">
                <div>Status: <span className="text-white/70">{row?.status || "pending"}</span></div>
                <div>Connected: <span className="text-white/70">{row?.data?.connected ? "yes" : "no"}</span></div>
                <div>Source: <span className="text-white/70">{row?.source || "—"}</span></div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] text-[9px] text-white/35">
                {row?.error || "No agent-run stream connected yet."}
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel" data-status={riskAlerts.length ? "ERROR" : "LIVE"}>
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert size={14} className="text-amber-300" />
          <h3 className="text-xs font-semibold text-white/70">Agent Risk Queue</h3>
        </div>
        {riskAlerts.length === 0 ? (
          <div className="text-[11px] text-white/35 py-4 text-center">No agent-related risk alerts right now.</div>
        ) : (
          <div className="space-y-2">
            {riskAlerts.slice(0, 8).map((alert) => (
              <div key={alert.id} className="flex items-start gap-2 py-2 border-b border-white/[0.04] last:border-0">
                <MessageSquare size={12} className={alert.severity === "critical" ? "text-red-300" : "text-amber-300"} />
                <div>
                  <div className="text-[10px] text-white/70">{alert.message}</div>
                  <div className="text-[9px] text-white/35 mt-0.5">{alert.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

