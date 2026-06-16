import http from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.OSCC_API_PORT || 8787);

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,OPTIONS",
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

function integrationResult(id) {
  // Rule: do not fake live. If env not present, return missing_config.
  const envMap = {
    supabase_admin: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    stripe: ["STRIPE_SECRET_KEY"],
    github: ["GITHUB_TOKEN"],
    vercel: ["VERCEL_TOKEN"],
    cloudflare: ["CLOUDFLARE_API_TOKEN"],
    metaapi: ["METAAPI_TOKEN"],
    axe_core: ["AXE_CORE_LOGS_ENDPOINT", "AXE_CORE_LOGS_TOKEN"],
  };

  const required = envMap[id] || [];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    return {
      status: "missing_config",
      source: "oscc-api",
      data: { connected: false, id },
      error: `Missing env: ${missing.join(", ")}`,
    };
  }

  return {
    status: "pending",
    source: "oscc-api",
    data: { connected: true, id },
    error: "Integration configured but adapter not implemented yet.",
  };
}

const server = http.createServer((req, res) => {
  try {
    if (!req.url) return json(res, 400, { ok: false, error: "Missing URL" });
    const u = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "OPTIONS") return json(res, 204, {});
    if (req.method !== "GET") return json(res, 405, { ok: false, error: "Method not allowed" });

    if (u.pathname === "/api/health") return json(res, 200, ok(req));

    if (u.pathname === "/api/integrations") {
      const ids = [
        "supabase_admin",
        "stripe",
        "github",
        "vercel",
        "cloudflare",
        "metaapi",
        "axe_core",
      ];
      return json(res, 200, {
        ok: true,
        results: Object.fromEntries(ids.map((id) => [id, integrationResult(id)])),
      });
    }

    const match = u.pathname.match(/^\/api\/integrations\/([a-z_]+)$/);
    if (match) {
      const id = match[1];
      return json(res, 200, integrationResult(id));
    }

    return json(res, 404, { ok: false, error: "Not found" });
  } catch (err) {
    return json(res, 500, { ok: false, error: String(err?.message || err) });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[oscc-api] listening on http://localhost:${PORT}`);
});

