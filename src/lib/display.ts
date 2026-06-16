import type { DataMode } from "./dataStatus";

export function isLiveMode(mode: DataMode) {
  return mode === "live";
}

export function liveValue(mode: DataMode, demo: string, live: string = "—") {
  return isLiveMode(mode) ? live : demo;
}

