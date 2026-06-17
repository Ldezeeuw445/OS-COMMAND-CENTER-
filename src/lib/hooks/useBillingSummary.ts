import { useEffect, useState } from "react";
import { apiGetJson, type BillingSummary } from "../apiClient";

export function useBillingSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<BillingSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGetJson<BillingSummary>("/api/billing/summary");
        if (cancelled) return;
        setSummary(data);
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
