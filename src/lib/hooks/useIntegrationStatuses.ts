import { useEffect, useMemo, useState } from "react";
import type { DataMode } from "../dataStatus";
import { apiGetJson, type IntegrationApiResult } from "../apiClient";
import { integrations } from "../integrations";

type ApiPayload = {
  ok: boolean;
  results: Record<string, IntegrationApiResult>;
};

export function useIntegrationStatuses(mode: DataMode) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, IntegrationApiResult> | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (mode !== "live") {
        setResults(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const payload = await apiGetJson<ApiPayload>("/api/integrations");
        if (cancelled) return;
        setResults(payload.results);
      } catch (e) {
        if (cancelled) return;
        setError(String((e as Error)?.message || e));
        setResults(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const ordered = useMemo(() => {
    return integrations.map((it) => ({
      ...it,
      api: results?.[it.id] ?? null,
    }));
  }, [results]);

  return { loading, error, ordered };
}

