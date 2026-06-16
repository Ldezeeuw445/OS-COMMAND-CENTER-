import React, { createContext, useContext, useMemo, useState } from "react";
import type { DataMode } from "./dataStatus";

type DataModeContextValue = {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
};

const DataModeContext = createContext<DataModeContextValue | null>(null);

const STORAGE_KEY = "oscc.dataMode.v1";

function readInitialMode(): DataMode {
  if (typeof window === "undefined") return "demo";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "live" || raw === "demo" || raw === "hybrid") return raw;
  return "demo";
}

export function DataModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DataMode>(() => readInitialMode());

  const setMode = (next: DataMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const value = useMemo(() => ({ mode, setMode }), [mode]);
  return <DataModeContext.Provider value={value}>{children}</DataModeContext.Provider>;
}

export function useDataMode() {
  const ctx = useContext(DataModeContext);
  if (!ctx) throw new Error("useDataMode must be used within DataModeProvider");
  return ctx;
}

