import { useState } from "react";

type AssistantResponse = {
  ok: boolean;
  status: string;
  error?: string;
  data?: {
    model: string;
    reply: string;
  };
};

export function useAssistantChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string>("");
  const [model, setModel] = useState<string>("");

  async function ask(message: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = (await res.json()) as AssistantResponse;
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Assistant error (${res.status})`);
      }
      setReply(data.data?.reply || "");
      setModel(data.data?.model || "");
    } catch (err) {
      setError(String((err as Error)?.message || err));
      setReply("");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, reply, model, ask };
}
