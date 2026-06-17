import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type SessionResponse = {
  ok: boolean;
  authenticated: boolean;
  expiresAt: number | null;
  error?: string;
};

type AuthContextValue = {
  loading: boolean;
  authenticated: boolean;
  expiresAt: number | null;
  error: string | null;
  refresh: () => Promise<void>;
  login: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function requestSession(): Promise<SessionResponse> {
  const res = await fetch("/api/auth/session", {
    method: "GET",
    headers: { accept: "application/json" },
    credentials: "include",
  });
  const data = (await res.json().catch(() => ({}))) as SessionResponse;
  if (!res.ok) throw new Error(data?.error || `Session check failed (${res.status})`);
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const session = await requestSession();
      setAuthenticated(Boolean(session?.authenticated));
      setExpiresAt(session?.expiresAt ?? null);
    } catch (err) {
      setAuthenticated(false);
      setExpiresAt(null);
      setError(String((err as Error)?.message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (otp: string) => {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ otp }),
    });
    const data = (await res.json().catch(() => ({}))) as SessionResponse;
    if (!res.ok) {
      const message = data?.error || `Login failed (${res.status})`;
      setAuthenticated(false);
      setExpiresAt(null);
      setError(message);
      throw new Error(message);
    }
    setAuthenticated(true);
    setExpiresAt(data?.expiresAt ?? null);
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data?.error || `Logout failed (${res.status})`);
    }
    setAuthenticated(false);
    setExpiresAt(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      authenticated,
      expiresAt,
      error,
      refresh,
      login,
      logout,
    }),
    [authenticated, error, expiresAt, loading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}

