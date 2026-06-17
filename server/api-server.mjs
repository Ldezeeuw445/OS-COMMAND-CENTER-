import http from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.OSCC_API_PORT || 8787);
const FETCH_TIMEOUT_MS = Number(process.env.OSCC_FETCH_TIMEOUT_MS || 7000);
const MONITOR_INTERVAL_MS = Number(process.env.OSCC_MONITOR_INTERVAL_MS || 60000);
const ALERT_HISTORY_LIMIT = Number(process.env.OSCC_ALERT_HISTORY_LIMIT || 200);
const ALERT_STRIPE_OUTFLOW_THRESHOLD = Number(process.env.OSCC_ALERT_STRIPE_OUTFLOW_30D || 5000);
const ALERT_METAAPI_MIN_BALANCE = Number(process.env.OSCC_ALERT_METAAPI_MIN_BALANCE || 0);
const ALERT_NOTIFY_COOLDOWN_MS = Number(process.env.OSCC_NOTIFY_COOLDOWN_MS || 15 * 60 * 1000);
const ALERT_NOTIFY_WARNINGS = process.env.OSCC_NOTIFY_WARNINGS === "1";
const integrationIds = [
  "supabase_admin",
  "stripe",
  "github",
  "vercel",
  "cloudflare",
  "railway",
  "openai",
  "metaapi",
  "axe_companion",
  "axe_core",
];

const monitorState = {
  lastRunAt: null,
  running: false,
  snapshot: null,
  alerts: [],
  fingerprints: new Set(),
  notifyLog: [],
};

const notificationState = {
  lastSentByKey: new Map(),
};

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(payload);
}

function ok(req) {
  return {
    ok: true,
    now: new Date().toISOString(),
    version: "oscc-api-v1",
  };
}

function envMissing(required) {
  return required.filter((k) => !process.env[k]);
}

async function fetchJson(url, init = {}) {
  const ctl = new AbortController();
  const timeout = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctl.signal });
    const text = await res.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }
    return { ok: res.ok, status: res.status, body };
  } finally {
    clearTimeout(timeout);
  }
}

function notificationConfigStatus() {
  return {
    cooldownMs: ALERT_NOTIFY_COOLDOWN_MS,
    includeWarnings: ALERT_NOTIFY_WARNINGS,
    channels: {
      webhook: Boolean(process.env.ALERT_WEBHOOK_URL),
      slack: Boolean(process.env.ALERT_SLACK_WEBHOOK_URL),
      telegram: Boolean(process.env.ALERT_TELEGRAM_BOT_TOKEN && process.env.ALERT_TELEGRAM_CHAT_ID),
    },
  };
}

async function postJson(url, payload) {
  return fetchJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function shouldNotify(alert) {
  if (alert.severity !== "critical" && !ALERT_NOTIFY_WARNINGS) {
    return { ok: false, reason: "warnings_disabled" };
  }
  const now = Date.now();
  const dedupeKey = `${alert.key}:${alert.severity}`;
  const last = notificationState.lastSentByKey.get(dedupeKey) || 0;
  if (now - last < ALERT_NOTIFY_COOLDOWN_MS) {
    return { ok: false, reason: "cooldown" };
  }
  return { ok: true, dedupeKey, now };
}

function textForAlert(alert) {
  return [
    `OS Command Center alert (${alert.severity.toUpperCase()})`,
    alert.message,
    `category: ${alert.category}`,
    `time: ${alert.createdAt}`,
    `details: ${JSON.stringify(alert.details || {})}`,
  ].join("\n");
}

async function sendAlertNotifications(alert, snapshot) {
  const decision = shouldNotify(alert);
  if (!decision.ok) {
    return { sent: false, reason: decision.reason, delivered: [], failed: [] };
  }

  const config = notificationConfigStatus();
  const delivered = [];
  const failed = [];
  const text = textForAlert(alert);

  if (config.channels.webhook) {
    const res = await postJson(process.env.ALERT_WEBHOOK_URL, {
      source: "os-command-center",
      alert,
      snapshot,
    });
    if (res.ok) delivered.push("webhook");
    else failed.push(`webhook(${res.status})`);
  }

  if (config.channels.slack) {
    const res = await postJson(process.env.ALERT_SLACK_WEBHOOK_URL, {
      text: `:rotating_light: ${text}`,
    });
    if (res.ok) delivered.push("slack");
    else failed.push(`slack(${res.status})`);
  }

  if (config.channels.telegram) {
    const token = process.env.ALERT_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.ALERT_TELEGRAM_CHAT_ID;
    const tgRes = await fetchJson(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });
    if (tgRes.ok && tgRes.body?.ok) delivered.push("telegram");
    else failed.push(`telegram(${tgRes.status})`);
  }

  if (delivered.length > 0) {
    notificationState.lastSentByKey.set(decision.dedupeKey, decision.now);
  }
  const status = {
    sent: delivered.length > 0,
    delivered,
    failed,
    reason: delivered.length > 0 ? "delivered" : failed.length > 0 ? "delivery_failed" : "no_channels",
  };
  monitorState.notifyLog.unshift({
    at: new Date().toISOString(),
    alertKey: alert.key,
    severity: alert.severity,
    ...status,
  });
  monitorState.notifyLog = monitorState.notifyLog.slice(0, ALERT_HISTORY_LIMIT);
  return status;
}

function integrationMissing(id, required) {
  const missing = envMissing(required);
  if (missing.length > 0) {
    return {
      status: "missing_config",
      source: "oscc-api",
      data: { connected: false, id, details: {} },
      error: `Missing env: ${missing.join(", ")}`,
    };
  }
  return null;
}

function integrationError(id, message) {
  return {
    status: "error",
    source: "oscc-api",
    data: { connected: false, id, details: {} },
    error: message,
  };
}

function integrationOk(id, details = {}) {
  return {
    status: "live",
    source: "oscc-api",
    updatedAt: new Date().toISOString(),
    data: { connected: true, id, details },
  };
}

function centsToUsd(cents) {
  return Number((cents / 100).toFixed(2));
}

function mkAlert({ key, severity, category, message, details = {} }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    key,
    severity,
    category,
    message,
    details,
    createdAt: new Date().toISOString(),
  };
}

function alertFingerprint(key, details) {
  return `${key}:${JSON.stringify(details || {})}`;
}

function pushAlert(alert) {
  const fp = alertFingerprint(alert.key, alert.details);
  if (monitorState.fingerprints.has(fp)) return false;
  monitorState.fingerprints.add(fp);
  monitorState.alerts.unshift(alert);
  if (monitorState.alerts.length > ALERT_HISTORY_LIMIT) {
    const removed = monitorState.alerts.splice(ALERT_HISTORY_LIMIT);
    for (const entry of removed) {
      monitorState.fingerprints.delete(alertFingerprint(entry.key, entry.details));
    }
  }
  return true;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

async function checkCloudflare() {
  const missing = integrationMissing("cloudflare", ["CLOUDFLARE_API_TOKEN"]);
  if (missing) return missing;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const res = await fetchJson("https://api.cloudflare.com/client/v4/user/tokens/verify", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok || !res.body?.success) {
    return integrationError("cloudflare", `Cloudflare token verify failed (${res.status})`);
  }
  const info = res.body?.result || {};
  return integrationOk("cloudflare", { tokenStatus: info.status ?? "ok" });
}

async function checkSupabase() {
  const missing = integrationMissing("supabase_admin", ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  if (missing) return missing;
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, "")}/auth/v1/settings`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetchJson(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) return integrationError("supabase_admin", `Supabase settings check failed (${res.status})`);
  return integrationOk("supabase_admin", { project: process.env.SUPABASE_URL });
}

async function checkVercel() {
  const missing = integrationMissing("vercel", ["VERCEL_TOKEN"]);
  if (missing) return missing;
  const res = await fetchJson("https://api.vercel.com/v2/user", {
    headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
  });
  if (!res.ok) return integrationError("vercel", `Vercel token check failed (${res.status})`);
  return integrationOk("vercel", { user: res.body?.user?.username ?? "connected" });
}

async function checkGitHub() {
  const missing = integrationMissing("github", ["GITHUB_TOKEN"]);
  if (missing) return missing;
  const res = await fetchJson("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "os-command-center",
    },
  });
  if (!res.ok) return integrationError("github", `GitHub token check failed (${res.status})`);
  return integrationOk("github", { login: res.body?.login ?? "connected" });
}

async function checkRailway() {
  const missing = integrationMissing("railway", ["RAILWAY_TOKEN"]);
  if (missing) return missing;
  const res = await fetchJson("https://backboard.railway.com/graphql/v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: "query { me { id name email } }" }),
  });
  if (!res.ok || !res.body?.data?.me) {
    return integrationError("railway", `Railway token check failed (${res.status})`);
  }
  return integrationOk("railway", { account: res.body.data.me.name ?? "connected" });
}

async function checkStripe() {
  const missing = integrationMissing("stripe", ["STRIPE_SECRET_KEY"]);
  if (missing) return missing;
  const key = process.env.STRIPE_SECRET_KEY;
  const account = await fetchJson("https://api.stripe.com/v1/account", {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!account.ok) return integrationError("stripe", `Stripe token check failed (${account.status})`);
  return integrationOk("stripe", { accountId: account.body?.id ?? "connected" });
}

async function checkOpenAi() {
  const missing = integrationMissing("openai", ["OPENAI_API_KEY"]);
  if (missing) return missing;
  const res = await fetchJson("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
  });
  if (!res.ok) return integrationError("openai", `OpenAI key check failed (${res.status})`);
  return integrationOk("openai", { modelCount: Array.isArray(res.body?.data) ? res.body.data.length : 0 });
}

async function checkMetaApi() {
  const missing = integrationMissing("metaapi", ["METAAPI_TOKEN"]);
  if (missing) return missing;
  const token = process.env.METAAPI_TOKEN;
  const accounts = await fetchJson("https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts?offset=0&limit=20", {
    headers: { "auth-token": token },
  });
  if (!accounts.ok) return integrationError("metaapi", `MetaApi token check failed (${accounts.status})`);
  const count = Array.isArray(accounts.body) ? accounts.body.length : 0;
  return integrationOk("metaapi", { accountCount: count });
}

async function checkAxeCompanion() {
  const missing = integrationMissing("axe_companion", ["AXE_COMPANION_API_URL", "AXE_COMPANION_API_TOKEN"]);
  if (missing) return missing;
  const base = process.env.AXE_COMPANION_API_URL.replace(/\/+$/, "");
  const res = await fetchJson(`${base}/health`, {
    headers: { Authorization: `Bearer ${process.env.AXE_COMPANION_API_TOKEN}` },
  });
  if (!res.ok) return integrationError("axe_companion", `AXE Companion health check failed (${res.status})`);
  return integrationOk("axe_companion", { endpoint: `${base}/health` });
}

async function checkAxeCore() {
  const missing = integrationMissing("axe_core", ["AXE_CORE_LOGS_ENDPOINT", "AXE_CORE_LOGS_TOKEN"]);
  if (missing) return missing;
  const endpoint = process.env.AXE_CORE_LOGS_ENDPOINT;
  const res = await fetchJson(endpoint, {
    headers: { Authorization: `Bearer ${process.env.AXE_CORE_LOGS_TOKEN}` },
  });
  if (!res.ok) return integrationError("axe_core", `AXE Core endpoint check failed (${res.status})`);
  return integrationOk("axe_core", { endpoint });
}

async function integrationResult(id) {
  try {
    if (id === "cloudflare") return await checkCloudflare();
    if (id === "supabase_admin") return await checkSupabase();
    if (id === "vercel") return await checkVercel();
    if (id === "github") return await checkGitHub();
    if (id === "railway") return await checkRailway();
    if (id === "stripe") return await checkStripe();
    if (id === "openai") return await checkOpenAi();
    if (id === "metaapi") return await checkMetaApi();
    if (id === "axe_companion") return await checkAxeCompanion();
    if (id === "axe_core") return await checkAxeCore();
    return integrationError(id, "Unknown integration id.");
  } catch (error) {
    return integrationError(id, String(error?.message || error));
  }
}

async function getMetaApiBalance() {
  const missing = envMissing(["METAAPI_TOKEN", "METAAPI_ACCOUNT_ID"]);
  if (missing.length > 0) {
    return { ok: false, status: "missing_config", error: `Missing env: ${missing.join(", ")}` };
  }
  const region = process.env.METAAPI_REGION || "new-york";
  const token = process.env.METAAPI_TOKEN;
  const accountId = process.env.METAAPI_ACCOUNT_ID;
  const url = `https://mt-client-api-v1.${region}.agiliumtrade.ai/users/current/accounts/${accountId}/account-information`;
  const res = await fetchJson(url, { headers: { "auth-token": token } });
  if (!res.ok) {
    return { ok: false, status: "error", error: `MetaApi account info failed (${res.status})` };
  }
  return {
    ok: true,
    status: "live",
    data: {
      balance: res.body?.balance ?? null,
      equity: res.body?.equity ?? null,
      margin: res.body?.margin ?? null,
      currency: res.body?.currency ?? null,
    },
  };
}

async function getStripeBillingSummary() {
  const missing = envMissing(["STRIPE_SECRET_KEY"]);
  if (missing.length > 0) {
    return { ok: false, status: "missing_config", error: `Missing env: ${missing.join(", ")}` };
  }
  const key = process.env.STRIPE_SECRET_KEY;
  const since = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);

  const [balance, subscriptions, balanceTx] = await Promise.all([
    fetchJson("https://api.stripe.com/v1/balance", { headers: { Authorization: `Bearer ${key}` } }),
    fetchJson("https://api.stripe.com/v1/subscriptions?status=all&limit=100", { headers: { Authorization: `Bearer ${key}` } }),
    fetchJson(`https://api.stripe.com/v1/balance_transactions?limit=100&created[gte]=${since}`, {
      headers: { Authorization: `Bearer ${key}` },
    }),
  ]);

  if (!balance.ok) return { ok: false, status: "error", error: `Stripe balance fetch failed (${balance.status})` };
  if (!subscriptions.ok) return { ok: false, status: "error", error: `Stripe subscriptions fetch failed (${subscriptions.status})` };
  if (!balanceTx.ok) return { ok: false, status: "error", error: `Stripe balance transactions failed (${balanceTx.status})` };

  const subs = Array.isArray(subscriptions.body?.data) ? subscriptions.body.data : [];
  const statusCounts = {
    active: 0,
    trialing: 0,
    canceled: 0,
    past_due: 0,
    unpaid: 0,
    free: 0,
    premium: 0,
  };
  for (const sub of subs) {
    const status = sub?.status;
    if (status in statusCounts) statusCounts[status] += 1;
    const amount = Number(sub?.items?.data?.[0]?.price?.unit_amount ?? 0);
    if (amount <= 0) statusCounts.free += 1;
    else statusCounts.premium += 1;
  }

  const txs = Array.isArray(balanceTx.body?.data) ? balanceTx.body.data : [];
  let inflow = 0;
  let outflow = 0;
  let fees = 0;
  for (const tx of txs) {
    const amount = Number(tx?.amount ?? 0);
    const fee = Number(tx?.fee ?? 0);
    fees += fee;
    if (amount >= 0) inflow += amount;
    else outflow += Math.abs(amount);
  }

  const available = Array.isArray(balance.body?.available) ? balance.body.available[0] : null;
  const pending = Array.isArray(balance.body?.pending) ? balance.body.pending[0] : null;
  return {
    ok: true,
    status: "live",
    data: {
      subscriptions: statusCounts,
      cash: {
        available: centsToUsd(Number(available?.amount ?? 0)),
        pending: centsToUsd(Number(pending?.amount ?? 0)),
        currency: available?.currency ?? "usd",
      },
      flow30d: {
        inflow: centsToUsd(inflow),
        outflow: centsToUsd(outflow),
        fees: centsToUsd(fees),
      },
    },
  };
}

async function runAssistant(message) {
  const missing = envMissing(["OPENAI_API_KEY"]);
  if (missing.length > 0) {
    return { ok: false, status: "missing_config", error: `Missing env: ${missing.join(", ")}` };
  }

  const model = process.env.OPENAI_ASSISTANT_MODEL || "gpt-4o-mini";
  const prompt = [
    "You are the OS Command Center assistant.",
    "Focus on operational reliability, incident response, and practical next actions.",
    "Be concise and prioritize cost-effective actions first.",
  ].join(" ");
  const payload = {
    model,
    input: [
      { role: "system", content: [{ type: "input_text", text: prompt }] },
      { role: "user", content: [{ type: "input_text", text: String(message || "") }] },
    ],
    max_output_tokens: 350,
  };
  const res = await fetchJson("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    return { ok: false, status: "error", error: `Assistant call failed (${res.status})` };
  }
  const reply = res.body?.output_text || "";
  return {
    ok: true,
    status: "live",
    data: {
      model,
      reply,
    },
  };
}

async function collectOpsSummary() {
  const [integrationRows, billing, metaApiBalance] = await Promise.all([
    Promise.all(integrationIds.map(async (id) => [id, await integrationResult(id)])),
    getStripeBillingSummary(),
    getMetaApiBalance(),
  ]);
  return {
    ok: true,
    now: new Date().toISOString(),
    integrations: Object.fromEntries(integrationRows),
    billing,
    metaApiBalance,
  };
}

function evaluateSummaryAlerts(summary) {
  const alerts = [];

  for (const [id, result] of Object.entries(summary.integrations || {})) {
    if (result?.status === "error") {
      alerts.push(
        mkAlert({
          key: `integration_error:${id}`,
          severity: "critical",
          category: "integration",
          message: `${id} check failed.`,
          details: { id, error: result.error || "unknown error" },
        }),
      );
    } else if (result?.status === "missing_config") {
      alerts.push(
        mkAlert({
          key: `integration_missing:${id}`,
          severity: "warning",
          category: "configuration",
          message: `${id} is missing configuration.`,
          details: { id, error: result.error || "missing env" },
        }),
      );
    }
  }

  const outflow = Number(summary.billing?.data?.flow30d?.outflow ?? 0);
  if (summary.billing?.ok && outflow > ALERT_STRIPE_OUTFLOW_THRESHOLD) {
    alerts.push(
      mkAlert({
        key: "billing_outflow_spike",
        severity: "warning",
        category: "billing",
        message: `Stripe outflow exceeded threshold ($${ALERT_STRIPE_OUTFLOW_THRESHOLD})`,
        details: { outflow30d: outflow, threshold: ALERT_STRIPE_OUTFLOW_THRESHOLD },
      }),
    );
  }
  if (summary.billing?.ok === false && summary.billing?.status === "error") {
    alerts.push(
      mkAlert({
        key: "billing_feed_error",
        severity: "critical",
        category: "billing",
        message: "Stripe billing summary failed.",
        details: { error: summary.billing?.error || "unknown error" },
      }),
    );
  }

  const metaBalance = Number(summary.metaApiBalance?.data?.balance ?? NaN);
  if (summary.metaApiBalance?.ok && Number.isFinite(metaBalance) && metaBalance < ALERT_METAAPI_MIN_BALANCE) {
    alerts.push(
      mkAlert({
        key: "metaapi_low_balance",
        severity: "critical",
        category: "risk",
        message: `MetaApi balance below minimum (${ALERT_METAAPI_MIN_BALANCE}).`,
        details: { balance: metaBalance, threshold: ALERT_METAAPI_MIN_BALANCE },
      }),
    );
  }
  if (summary.metaApiBalance?.ok === false && summary.metaApiBalance?.status === "error") {
    alerts.push(
      mkAlert({
        key: "metaapi_feed_error",
        severity: "critical",
        category: "risk",
        message: "MetaApi balance feed failed.",
        details: { error: summary.metaApiBalance?.error || "unknown error" },
      }),
    );
  }

  return alerts;
}

async function runMonitor(reason = "scheduled") {
  if (monitorState.running) {
    return { ok: false, skipped: true, reason: "already_running" };
  }
  monitorState.running = true;
  try {
    const summary = await collectOpsSummary();
    monitorState.snapshot = summary;
    monitorState.lastRunAt = new Date().toISOString();
    const alerts = evaluateSummaryAlerts(summary);
    let created = 0;
    let notified = 0;
    for (const alert of alerts) {
      const createdAlert = { ...alert, details: { ...alert.details, reason } };
      if (pushAlert(createdAlert)) {
        created += 1;
        const notification = await sendAlertNotifications(createdAlert, summary);
        if (notification.sent) notified += 1;
      }
    }
    return {
      ok: true,
      created,
      notified,
      totalAlerts: monitorState.alerts.length,
      lastRunAt: monitorState.lastRunAt,
    };
  } finally {
    monitorState.running = false;
  }
}

function updateSnapshotIntegration(id, result) {
  if (!monitorState.snapshot) {
    monitorState.snapshot = {
      ok: true,
      now: new Date().toISOString(),
      integrations: {},
      billing: { ok: false, status: "pending" },
      metaApiBalance: { ok: false, status: "pending" },
    };
  }
  monitorState.snapshot.now = new Date().toISOString();
  if (!monitorState.snapshot.integrations) {
    monitorState.snapshot.integrations = {};
  }
  monitorState.snapshot.integrations[id] = result;
}

function monitorPayload() {
  return {
    ok: true,
    monitor: {
      lastRunAt: monitorState.lastRunAt,
      running: monitorState.running,
      intervalMs: MONITOR_INTERVAL_MS,
      threshold: {
        stripeOutflow30d: ALERT_STRIPE_OUTFLOW_THRESHOLD,
        metaApiMinBalance: ALERT_METAAPI_MIN_BALANCE,
      },
    },
    notifications: {
      ...notificationConfigStatus(),
      recent: monitorState.notifyLog,
    },
    alerts: monitorState.alerts,
    snapshot: monitorState.snapshot,
  };
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) return json(res, 400, { ok: false, error: "Missing URL" });
    const u = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "OPTIONS") return json(res, 204, {});
    if (req.method === "POST" && u.pathname === "/api/assistant/chat") {
      const body = await readJsonBody(req);
      if (!body?.message || String(body.message).trim().length === 0) {
        return json(res, 400, { ok: false, error: "message is required" });
      }
      return json(res, 200, await runAssistant(body.message));
    }
    if (req.method === "POST" && u.pathname === "/api/monitor/run") {
      return json(res, 200, await runMonitor("manual"));
    }
    if (req.method === "POST" && u.pathname === "/api/actions/monitor/run") {
      const body = await readJsonBody(req);
      const reason = String(body?.reason || "manual_action").slice(0, 120);
      return json(res, 200, await runMonitor(reason));
    }
    if (req.method === "POST" && u.pathname === "/api/actions/integrations/recheck") {
      const body = await readJsonBody(req);
      const id = String(body?.id || "");
      if (!integrationIds.includes(id)) {
        return json(res, 400, { ok: false, error: `Unknown integration id: ${id}` });
      }
      const result = await integrationResult(id);
      updateSnapshotIntegration(id, result);
      return json(res, 200, { ok: true, id, result, at: new Date().toISOString() });
    }
    if (req.method === "POST" && u.pathname === "/api/actions/notifications/test") {
      const body = await readJsonBody(req);
      const severity = body?.severity === "warning" ? "warning" : "critical";
      const testAlert = mkAlert({
        key: "test_notification_action",
        severity,
        category: "test",
        message: String(body?.message || "Manual notification test from OS Command Center action center."),
        details: { source: "manual_action_test" },
      });
      const result = await sendAlertNotifications(testAlert, monitorState.snapshot);
      return json(res, 200, { ok: true, alert: testAlert, notification: result });
    }
    if (req.method === "POST" && u.pathname === "/api/notifications/test") {
      const body = await readJsonBody(req);
      const severity = body?.severity === "warning" ? "warning" : "critical";
      const testAlert = mkAlert({
        key: "test_notification",
        severity,
        category: "test",
        message: String(body?.message || "Manual notification test from OS Command Center."),
        details: { source: "manual_test" },
      });
      const result = await sendAlertNotifications(testAlert, monitorState.snapshot);
      return json(res, 200, {
        ok: true,
        alert: testAlert,
        notification: result,
      });
    }

    if (req.method !== "GET") return json(res, 405, { ok: false, error: "Method not allowed" });

    if (u.pathname === "/api/health") return json(res, 200, ok(req));

    if (u.pathname === "/api/integrations") {
      const results = await Promise.all(integrationIds.map(async (id) => [id, await integrationResult(id)]));
      return json(res, 200, {
        ok: true,
        results: Object.fromEntries(results),
      });
    }

    const match = u.pathname.match(/^\/api\/integrations\/([a-z_]+)$/);
    if (match) {
      const id = match[1];
      return json(res, 200, await integrationResult(id));
    }

    if (u.pathname === "/api/billing/summary") {
      return json(res, 200, await getStripeBillingSummary());
    }

    if (u.pathname === "/api/metaapi/balance") {
      return json(res, 200, await getMetaApiBalance());
    }

    if (u.pathname === "/api/ops/summary") {
      return json(res, 200, await collectOpsSummary());
    }

    if (u.pathname === "/api/alerts") {
      return json(res, 200, monitorPayload());
    }

    return json(res, 404, { ok: false, error: "Not found" });
  } catch (err) {
    return json(res, 500, { ok: false, error: String(err?.message || err) });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[oscc-api] listening on http://localhost:${PORT}`);
  runMonitor("startup").catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[oscc-api] startup monitor failed", err);
  });
  setInterval(() => {
    runMonitor("scheduled").catch((err) => {
      // eslint-disable-next-line no-console
      console.error("[oscc-api] scheduled monitor failed", err);
    });
  }, MONITOR_INTERVAL_MS);
});

