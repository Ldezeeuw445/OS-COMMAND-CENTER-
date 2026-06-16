import type { AdapterResult } from "./dataStatus";

export async function apiGetJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export type IntegrationApiResult = AdapterResult<{ connected: boolean; id: string }>;

