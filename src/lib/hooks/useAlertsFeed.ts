import { useCallback, useEffect, useState } from "react";
import { apiGetJson, type AlertsFeed } from "../apiClient";

export function useAlertsFeed(pollMs = 15000) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feed, setFeed] = useState<AlertsFeed | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await apiGetJson<AlertsFeed>("/api/alerts");
      setFeed(payload);
    } catch (err) {
      setError(String((err as Error)?.message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  const runMonitor = useCallback(async () => {
    try {
      await fetch("/api/monitor/run", { method: "POST" });
    } catch {
      // ignored, refresh path shows current state
    }
    await refresh();
  }, [refresh]);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => {
      void refresh();
    }, pollMs);
    return () => clearInterval(id);
  }, [pollMs, refresh]);

  return { loading, error, feed, refresh, runMonitor };
}
