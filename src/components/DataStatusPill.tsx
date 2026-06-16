import type { AdapterResult, DataMode, DataStatus } from "../lib/dataStatus";

function pillClasses(kind: DataStatus) {
  switch (kind) {
    case "live":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "demo":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "pending":
      return "bg-white/[0.03] text-white/40 border-white/[0.06]";
    case "missing_config":
      return "bg-purple-500/10 text-purple-300 border-purple-500/20";
    case "error":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "empty":
      return "bg-white/[0.03] text-white/30 border-white/[0.06]";
    case "hybrid":
      return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";
  }
}

function label(kind: DataStatus) {
  switch (kind) {
    case "missing_config":
      return "MISSING CONFIG";
    default:
      return kind.toUpperCase();
  }
}

export function DataModePill({ mode }: { mode: DataMode }) {
  const kind: DataStatus = mode === "hybrid" ? "hybrid" : mode;
  return (
    <span
      className={`rounded-full border px-2 py-1 text-[9px] font-medium tracking-wider ${pillClasses(
        kind,
      )}`}
      title="Global data mode"
    >
      {mode === "live" ? "LIVE MODE" : mode === "demo" ? "DEMO MODE" : "HYBRID MODE"}
    </span>
  );
}

export function AdapterStatusPill({
  result,
  compact,
}: {
  result: Pick<AdapterResult<unknown>, "status" | "source" | "updatedAt" | "error">;
  compact?: boolean;
}) {
  const kind = result.status;
  const titleParts = [`source: ${result.source}`];
  if (result.updatedAt) titleParts.push(`updated: ${result.updatedAt}`);
  if (result.error) titleParts.push(`error: ${result.error}`);

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[8px] font-medium tracking-wider ${pillClasses(
        kind,
      )} ${compact ? "" : ""}`}
      title={titleParts.join(" • ")}
    >
      {label(kind)}
    </span>
  );
}

