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

## Notes

- Current version includes the imported OS OPS foundation UI as baseline.
- Integration status blocks are present and ready to connect to real APIs.
- Keep this repo dedicated to Command Center scope (separate from trading runtime app code).
