import type { AdapterResult } from "./dataStatus";

export async function apiGetJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export type IntegrationApiResult = AdapterResult<{ connected: boolean; id: string }>;
export type BillingSummary = {
  ok: boolean;
  status: string;
  error?: string;
  data?: {
    subscriptions: {
      active: number;
      trialing: number;
      canceled: number;
      past_due: number;
      unpaid: number;
      free: number;
      premium: number;
    };
    cash: {
      available: number;
      pending: number;
      currency: string;
    };
    flow30d: {
      inflow: number;
      outflow: number;
      fees: number;
    };
  };
};

export type OpsSummary = {
  ok: boolean;
  now: string;
  integrations: Record<string, IntegrationApiResult>;
  billing: BillingSummary;
  metaApiBalance: {
    ok: boolean;
    status: string;
    error?: string;
    data?: {
      balance: number | null;
      equity: number | null;
      margin: number | null;
      currency: string | null;
    };
  };
};

export type AlertEvent = {
  id: string;
  key: string;
  severity: "warning" | "critical";
  category: string;
  message: string;
  details: Record<string, unknown>;
  createdAt: string;
};

export type AlertsFeed = {
  ok: boolean;
  monitor: {
    lastRunAt: string | null;
    running: boolean;
    intervalMs: number;
    threshold: {
      stripeOutflow30d: number;
      metaApiMinBalance: number;
    };
  };
  notifications: {
    cooldownMs: number;
    includeWarnings: boolean;
    channels: {
      webhook: boolean;
      slack: boolean;
      telegram: boolean;
    };
    recent: Array<{
      at: string;
      alertKey: string;
      severity: string;
      sent: boolean;
      delivered: string[];
      failed: string[];
      reason: string;
    }>;
  };
  alerts: AlertEvent[];
  snapshot: OpsSummary | null;
};

