import { useEffect, useMemo, useState } from "react";
import { PlugZap, Play } from "lucide-react";
import { useMcpControl } from "@/lib/hooks/useMcpControl";

type AuditRow = {
  id: string;
  at: string;
  provider: string;
  action: string;
  status: "success" | "error";
  message: string;
};

export default function McpHub() {
  const mcp = useMcpControl();
  const [provider, setProvider] = useState("supabase");
  const [action, setAction] = useState("recheck");
  const [limit, setLimit] = useState("10");
  const [secret, setSecret] = useState("");
  const [approvedOnce, setApprovedOnce] = useState(false);
  const [auditRows, setAuditRows] = useState<AuditRow[]>([]);

  useEffect(() => {
    void mcp.loadConnections();
  }, [mcp]);

  const selectedProvider = useMemo(
    () => mcp.providers.find((p) => p.id === provider) ?? null,
    [mcp.providers, provider],
  );

  useEffect(() => {
    if (!selectedProvider) return;
    if (!selectedProvider.actions.includes(action)) {
      setAction(selectedProvider.actions[0] || "recheck");
    }
  }, [selectedProvider, action]);

  async function runApprovedAction() {
    if (!approvedOnce) return;
    const runAt = new Date().toISOString();
    try {
      const out = await mcp.runAction({
        provider,
        action,
        params: { limit: Number(limit) || 10 },
        secret: secret.trim() || undefined,
      });
      setAuditRows((rows) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          at: runAt,
          provider,
          action,
          status: "success",
          message: out?.result?.status || "ok",
        },
        ...rows,
      ]);
      setApprovedOnce(false);
    } catch (err) {
      setAuditRows((rows) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          at: runAt,
          provider,
          action,
          status: "error",
          message: String((err as Error)?.message || err),
        },
        ...rows,
      ]);
      setApprovedOnce(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-2">
        <PlugZap size={18} className="text-cyan-300" />
        <h2 className="text-lg font-semibold text-white/80">MCP Hub</h2>
      </div>

      {mcp.error ? (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] text-red-300">
          {mcp.error}
        </div>
      ) : null}

      <div className="panel" data-status="LIVE">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-white/70">Provider Connections</h3>
          <button
            onClick={() => void mcp.loadConnections()}
            disabled={mcp.loading}
            className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] text-cyan-300 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {mcp.providers.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProvider(p.id);
                setAction(p.actions[0] || "recheck");
              }}
              className={`rounded-md border px-2 py-2 text-left ${
                provider === p.id
                  ? "border-white/25 bg-white/[0.08]"
                  : "border-white/[0.08] bg-white/[0.03]"
              }`}
            >
              <div className="text-[11px] text-white/80">{p.label}</div>
              <div className={`text-[9px] mt-1 ${p.configured ? "text-emerald-300" : "text-amber-300"}`}>
                {p.configured ? "configured" : "missing env"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="panel" data-status="LIVE">
        <h3 className="text-xs font-semibold text-white/70 mb-3">Run MCP Action</h3>
        <div className="mb-2 flex items-center justify-between rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5">
          <span className="text-[10px] text-white/60">Approval</span>
          <button
            onClick={() => setApprovedOnce((v) => !v)}
            className={`rounded px-2 py-1 text-[10px] ${
              approvedOnce ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
            }`}
          >
            {approvedOnce ? "Approved for next action" : "Approve next action"}
          </button>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="col-span-3 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[11px] text-white/70 outline-none"
          >
            {mcp.providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id}
              </option>
            ))}
          </select>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="col-span-3 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[11px] text-white/70 outline-none"
          >
            {(selectedProvider?.actions ?? ["recheck"]).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <input
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="col-span-2 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[11px] text-white/70 outline-none"
            placeholder="limit"
          />
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="col-span-3 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[11px] text-white/70 outline-none"
            placeholder={mcp.connections?.actionSecretRequired ? "action secret" : "secret (optional)"}
          />
          <button
            onClick={() => void runApprovedAction()}
            disabled={mcp.loading || !approvedOnce}
            className="col-span-1 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-1.5 text-cyan-300 disabled:opacity-50"
            title="Run action"
          >
            <Play size={12} />
          </button>
        </div>
      </div>

      <div className="panel" data-status="LIVE">
        <h3 className="text-xs font-semibold text-white/70 mb-2">Last Action Result</h3>
        <pre className="max-h-[38vh] overflow-auto rounded-md border border-white/[0.08] bg-black/40 p-3 text-[10px] text-white/70">
          {JSON.stringify(mcp.lastRun ?? { message: "No action run yet." }, null, 2)}
        </pre>
      </div>

      <div className="panel" data-status="LIVE">
        <h3 className="text-xs font-semibold text-white/70 mb-2">Action Audit Log</h3>
        <div className="space-y-1.5">
          {auditRows.length === 0 ? (
            <div className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-2 text-[10px] text-white/45">
              No actions executed yet.
            </div>
          ) : (
            auditRows.slice(0, 12).map((row) => (
              <div
                key={row.id}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-2 text-[10px] text-white/70"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white/80">
                    {row.provider}.{row.action}
                  </span>
                  <span className={row.status === "success" ? "text-emerald-300" : "text-red-300"}>{row.status}</span>
                </div>
                <div className="mt-0.5 text-white/45">{new Date(row.at).toLocaleString()}</div>
                <div className="mt-0.5 text-white/60">{row.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

