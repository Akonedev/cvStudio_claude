"use client";
import { useState, useCallback, useRef, useEffect } from "react";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  agent?: string;
}

interface UseAIChatOptions {
  context?: "cv" | "cover-letter" | "job-matcher" | "interview" | "general";
  agentId?: string;
  cvId?: string;
  jobOfferId?: string;
  systemInstructions?: string;
}

/**
 * Hook for interacting with the AI chat API across all panels.
 * Supports agent-based routing via agentId.
 */
export function useAIChat(options: UseAIChatOptions = {}) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string | undefined>(options.agentId);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: AIMessage = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    // Abort any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const history = [...messages, userMsg]
        .slice(-20) // Keep last 20 messages for context
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          context: options.context ?? "general",
          agentId: activeAgent,
          cvId: options.cvId,
          jobOfferId: options.jobOfferId,
        }),
        signal: abortRef.current.signal,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      const assistantMsg: AIMessage = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: json.data.content,
        timestamp: Date.now(),
        agent: json.data.agent,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      return assistantMsg;
    } catch (e) {
      if ((e as Error).name === "AbortError") return null;
      const msg = (e as Error).message || "Erreur de communication avec l'IA";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, options, activeAgent]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const switchAgent = useCallback((agentId: string | undefined) => {
    setActiveAgent(agentId);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    cancelRequest,
    activeAgent,
    switchAgent,
  };
}
