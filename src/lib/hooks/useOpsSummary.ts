import { useEffect, useState } from "react";
import { apiGetJson, type OpsSummary } from "../apiClient";

export function useOpsSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<OpsSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const payload = await apiGetJson<OpsSummary>("/api/ops/summary");
        if (cancelled) return;
        setSummary(payload);
      } catch (err) {
        if (cancelled) return;
        setError(String((err as Error)?.message || err));
        setSummary(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, error, summary };
}
