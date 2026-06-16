import type { AdapterResult, DataMode, DataStatus } from "./dataStatus";
import { demoResult, missingConfigResult, pendingResult } from "./adapters/adapterUtils";

export type IntegrationId =
  | "supabase_admin"
  | "stripe"
  | "cloudflare"
  | "metaapi"
  | "vercel"
  | "github"
  | "axe_core";

export type IntegrationInfo = {
  id: IntegrationId;
  label: string;
  scope: "Overview" | "Products" | "Agent Offices" | "Server Room" | "Finance" | "Support" | "Growth" | "Users" | "Releases" | "Settings";
  notes: string;
};

export const integrations: IntegrationInfo[] = [
  {
    id: "supabase_admin",
    label: "Supabase (Admin)",
    scope: "Users",
    notes: "Read-only aggregates; service role must stay server-side.",
  },
  { id: "stripe", label: "Stripe", scope: "Finance", notes: "MRR/subscriptions via server-side Stripe API + webhooks." },
  { id: "cloudflare", label: "Cloudflare (Workers/DO/WS)", scope: "Server Room", notes: "Worker/DO health + WS tick age." },
  { id: "metaapi", label: "MetaApi / MT5", scope: "Server Room", notes: "Sync health, connection mode, errors." },
  { id: "vercel", label: "Vercel", scope: "Releases", notes: "Deployments, build status, logs links." },
  { id: "github", label: "GitHub", scope: "Releases", notes: "Commits, releases, checks." },
  { id: "axe_core", label: "AXE Core Logs", scope: "Agent Offices", notes: "Agent runs/prompts/tool policy must come from AXE Core." },
];

export function integrationStatusFromMode(mode: DataMode): DataStatus {
  if (mode === "demo") return "demo";
  if (mode === "hybrid") return "demo";
  return "missing_config";
}

export function makeIntegrationResult(
  mode: DataMode,
  source: string,
  data: { connected: boolean; hint: string },
): AdapterResult<{ connected: boolean; hint: string }> {
  if (mode === "demo" || mode === "hybrid") return demoResult(source, data);
  return missingConfigResult(source, { connected: false, hint: "Integration not configured yet." });
}

export function axeCoreAgentLoggingResult(mode: DataMode) {
  if (mode === "demo") return demoResult("axeCoreAdapter", { connected: false, hint: "Demo placeholder." });
  return pendingResult("axeCoreAdapter", { connected: false, hint: "Pending until AXE Core logging exists." });
}

