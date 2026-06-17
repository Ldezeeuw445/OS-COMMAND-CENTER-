# OS Command Center

Command and operations dashboard for AXE ecosystem products.

## What this repo is for

- Central command page for launch operations and runtime visibility.
- Separate repository from `AXE-COMPANION-OS` so it can evolve independently.
- Foundation for future modules such as Trading OS controls and AXE brain/supabase integrations.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Recharts + Radix UI primitives

## Local development

```bash
npm install
npm run dev
```

Runs on the Vite default URL (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Use As App (PWA)

- Deploy the app (Vercel/Cloudflare Pages/static hosting).
- Open the URL on phone/tablet.
- iPhone/iPad (Safari): Share -> Add to Home Screen.
- Android (Chrome): Install App prompt or browser menu -> Install app.

The app includes a manifest and logo icons so it behaves like a standalone app on your homescreen.

## AXE + AXE Core Integration

- Runtime links are designed to be managed from the local API layer (`server/api-server.mjs`).
- `AXE_COMPANION_API_URL` + `AXE_COMPANION_API_TOKEN` for AXE Companion runtime links.
- `AXE_CORE_LOGS_ENDPOINT` + `AXE_CORE_LOGS_TOKEN` for AXE Core logs/agent control links.

## Live Health + Cost Endpoints

- `GET /api/integrations` checks real token connectivity for Cloudflare, Supabase, Vercel, Railway, Stripe, OpenAI, MetaApi, AXE Companion, and AXE Core.
- `GET /api/billing/summary` returns Stripe subscription/cash-flow summary (free vs premium, inflow/outflow/fees).
- `GET /api/metaapi/balance` returns live account balance/equity/margin for `METAAPI_ACCOUNT_ID`.
- `GET /api/ops/summary` returns combined integration + billing + MetaApi operational snapshot.
- `GET /api/alerts` returns monitor state + alert history + latest snapshot.
- `POST /api/monitor/run` triggers an immediate monitor cycle (manual check).
- `POST /api/notifications/test` sends a manual test alert to configured channels.

## Automated Monitoring

- The API server runs a scheduled monitor loop (default every 60 seconds).
- Alert rules currently include:
  - integration failures and missing configuration
  - Stripe outflow spike threshold (30d)
  - MetaApi balance below minimum threshold
- Tune thresholds with:
  - `OSCC_MONITOR_INTERVAL_MS`
  - `OSCC_ALERT_STRIPE_OUTFLOW_30D`
  - `OSCC_ALERT_METAAPI_MIN_BALANCE`
  - `OSCC_ALERT_HISTORY_LIMIT`

## Alert Notifications

- Critical alerts can be pushed to Webhook, Slack, and Telegram.
- Channels are configured with:
  - `ALERT_WEBHOOK_URL`
  - `ALERT_SLACK_WEBHOOK_URL`
  - `ALERT_TELEGRAM_BOT_TOKEN`
  - `ALERT_TELEGRAM_CHAT_ID`
- Notification controls:
  - `OSCC_NOTIFY_COOLDOWN_MS` to prevent spam
  - `OSCC_NOTIFY_WARNINGS=1` to also send warning-level alerts

## Secrets Safety

- Put secrets only in server env vars (`.env` / hosting secrets UI).
- Never expose keys with public prefixes (`VITE_*`) when they are sensitive.
- Use `.env.example` as the required keys template.

## Notes

- Current version includes the imported OS OPS foundation UI as baseline.
- Integration status blocks are present and ready to connect to real APIs.
- Keep this repo dedicated to Command Center scope (separate from trading runtime app code).
