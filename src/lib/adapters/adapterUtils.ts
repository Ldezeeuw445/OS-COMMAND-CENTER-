import type { AdapterResult } from "../dataStatus";

export function nowIso() {
  return new Date().toISOString();
}

export function demoResult<T>(source: string, data: T): AdapterResult<T> {
  return { status: "demo", source, updatedAt: nowIso(), data };
}

export function missingConfigResult<T>(source: string, emptyData: T): AdapterResult<T> {
  return { status: "missing_config", source, data: emptyData };
}

export function pendingResult<T>(source: string, emptyData: T): AdapterResult<T> {
  return { status: "pending", source, data: emptyData };
}

export function errorResult<T>(source: string, emptyData: T, error: string): AdapterResult<T> {
  return { status: "error", source, data: emptyData, error };
}

