"use client";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Unified hook for AI-assisted cover letter generation.
 */
export function useCoverLetterActions() {
  const generate = useCallback(async (params: {
    cvId: string;
    jobDescription?: string;
    tone?: "formal" | "enthusiastic" | "concise";
    instructions?: string;
  }) => {
    const res = await fetch("/api/cover-letters/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  }, []);

  const save = useCallback(async (id: string, content: string, title?: string) => {
    const res = await fetch(`/api/cover-letters/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, ...(title ? { title } : {}) }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    toast.success("Lettre sauvegardée");
    return json.data;
  }, []);

  const list = useCallback(async () => {
    const res = await fetch("/api/cover-letters");
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/cover-letters/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    toast.success("Lettre supprimée");
    return true;
  }, []);

  return { generate, save, list, remove };
}
