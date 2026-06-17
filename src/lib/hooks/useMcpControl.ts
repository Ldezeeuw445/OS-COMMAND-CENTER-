import { useCallback, useMemo, useState } from "react";
import type { McpActionResponse, McpConnectionsResponse } from "@/lib/apiClient";

type McpState = {
  loading: boolean;
  error: string | null;
  connections: McpConnectionsResponse | null;
  lastRun: McpActionResponse | null;
};

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { accept: "application/json" } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

async function postJson<T>(path: string, payload: object): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

export function useMcpControl() {
  const [state, setState] = useState<McpState>({
    loading: false,
    error: null,
    connections: null,
    lastRun: null,
  });

  const loadConnections = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const connections = await getJson<McpConnectionsResponse>("/api/mcp/connections");
      setState((s) => ({ ...s, loading: false, connections }));
      return connections;
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: String((err as Error)?.message || err),
      }));
      throw err;
    }
  }, []);

  const runAction = useCallback(
    async (input: { provider: string; action: string; params?: Record<string, unknown>; secret?: string }) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const result = await postJson<McpActionResponse>("/api/mcp/actions/run", input);
        setState((s) => ({ ...s, loading: false, lastRun: result }));
        return result;
      } catch (err) {
        setState((s) => ({
          ...s,
          loading: false,
          error: String((err as Error)?.message || err),
        }));
        throw err;
      }
    },
    [],
  );

  const providers = useMemo(() => state.connections?.providers ?? [], [state.connections]);

  return {
    ...state,
    providers,
    loadConnections,
    runAction,
  };
}

