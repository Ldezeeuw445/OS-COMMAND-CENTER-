import { useState } from "react";

type ActionState = {
  loading: boolean;
  error: string | null;
  message: string | null;
};

async function postJson(path: string, payload: object) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Action failed (${res.status})`);
  }
  return data;
}

export function useOpsActions() {
  const [state, setState] = useState<ActionState>({
    loading: false,
    error: null,
    message: null,
  });

  async function runMonitor(reason: string) {
    setState({ loading: true, error: null, message: null });
    try {
      const data = await postJson("/api/actions/monitor/run", { reason });
      setState({
        loading: false,
        error: null,
        message: `Monitor run complete (${data?.created ?? 0} alerts, ${data?.notified ?? 0} notified).`,
      });
      return data;
    } catch (err) {
      setState({
        loading: false,
        error: String((err as Error)?.message || err),
        message: null,
      });
      throw err;
    }
  }

  async function recheckIntegration(id: string) {
    setState({ loading: true, error: null, message: null });
    try {
      const data = await postJson("/api/actions/integrations/recheck", { id });
      setState({
        loading: false,
        error: null,
        message: `Integration rechecked: ${id} -> ${data?.result?.status || "unknown"}.`,
      });
      return data;
    } catch (err) {
      setState({
        loading: false,
        error: String((err as Error)?.message || err),
        message: null,
      });
      throw err;
    }
  }

  async function testNotification(severity: "critical" | "warning", message: string) {
    setState({ loading: true, error: null, message: null });
    try {
      const data = await postJson("/api/actions/notifications/test", { severity, message });
      const sent = Boolean(data?.notification?.sent);
      setState({
        loading: false,
        error: null,
        message: sent ? "Test notification sent." : `Test notification not sent (${data?.notification?.reason || "unknown"}).`,
      });
      return data;
    } catch (err) {
      setState({
        loading: false,
        error: String((err as Error)?.message || err),
        message: null,
      });
      throw err;
    }
  }

  return {
    ...state,
    runMonitor,
    recheckIntegration,
    testNotification,
  };
}
