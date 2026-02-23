"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAIChat, type AIMessage } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MessageSquare, Send, Loader2, X, Trash2, Sparkles,
  Bot, User, Minimize2, Maximize2, ChevronDown
} from "lucide-react";

// ─── Page context detection ─────────────────────────────────────────────────
function getPageContext(pathname: string): {
  context: "cv" | "cover-letter" | "job-matcher" | "interview" | "general";
  label: string;
  color: string;
} {
  if (pathname.includes("/cv-builder")) return { context: "cv", label: "CV Builder", color: "bg-amber-500" };
  if (pathname.includes("/cover-letter")) return { context: "cover-letter", label: "Lettre", color: "bg-violet-500" };
  if (pathname.includes("/job-matcher")) return { context: "job-matcher", label: "Job Matcher", color: "bg-blue-500" };
  if (pathname.includes("/interview")) return { context: "interview", label: "Entretien", color: "bg-rose-500" };
  return { context: "general", label: "Général", color: "bg-teal-500" };
}

// ─── Context-specific greetings ─────────────────────────────────────────────
const CONTEXT_GREETINGS: Record<string, string> = {
  cv: "Je suis votre assistant CV. Je peux vous aider à améliorer, optimiser et corriger votre CV.",
  "cover-letter": "Je peux vous aider à rédiger et améliorer vos lettres de motivation.",
  "job-matcher": "Je peux vous aider à analyser les offres d'emploi et adapter votre profil.",
  interview: "Je peux vous aider à préparer vos entretiens d'embauche avec des questions et conseils.",
  general: "Comment puis-je vous aider aujourd'hui ? Je suis votre assistant carrière IA.",
};

export function GlobalAIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const { context, label, color } = getPageContext(pathname);

  const { messages, isLoading, error, sendMessage, clearHistory, cancelRequest } = useAIChat({
    context,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, isMinimized]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Don't show the global FAB when inside the CV editor (it has its own AI panel)
  const isInCVEditor = pathname.match(/\/cv-builder\/[^/]+/);
  if (isInCVEditor) return null;

  return (
    <>
      {/* ─── Floating Action Button ─────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          title="Ouvrir l'assistant IA"
        >
          <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold">
              {messages.filter((m) => m.role === "assistant").length}
            </span>
          )}
        </button>
      )}

      {/* ─── Chat Panel ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-white dark:bg-stone-950 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col transition-all duration-200",
            isMinimized
              ? "bottom-6 right-6 w-72 h-12"
              : "bottom-6 right-6 w-96 h-[520px]"
          )}
        >
          {/* ─── Header ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-stone-200 dark:border-stone-800 rounded-t-lg bg-stone-50 dark:bg-stone-900">
            <div className="flex items-center gap-2">
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", color)}>
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Assistant IA
                </span>
                <span className="text-[9px] text-stone-400 ml-1.5 px-1.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800">
                  {label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded"
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3 text-stone-400" />
                ) : (
                  <Minimize2 className="h-3 w-3 text-stone-400" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded"
              >
                <X className="h-3 w-3 text-stone-400" />
              </button>
            </div>
          </div>

          {/* ─── Body (hidden when minimized) ──────────────────────────── */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="h-6 w-6 text-amber-500" />
                    </div>
                    <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Assistant IA — {label}
                    </h4>
                    <p className="text-xs text-stone-400 max-w-[260px] mx-auto">
                      {CONTEXT_GREETINGS[context]}
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-2",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="h-3 w-3 text-amber-600" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed",
                            msg.role === "user"
                              ? "bg-amber-500 text-white rounded-br-none"
                              : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-bl-none"
                          )}
                        >
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                          <div className={cn(
                            "text-[9px] mt-1",
                            msg.role === "user" ? "text-amber-200" : "text-stone-400"
                          )}>
                            {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User className="h-3 w-3 text-stone-500" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Bot className="h-3 w-3 text-amber-600" />
                        </div>
                        <div className="bg-stone-100 dark:bg-stone-800 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                            <span className="text-xs text-stone-400">Réflexion...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 text-xs text-red-600">
                        {error}
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Clear */}
              {messages.length > 0 && (
                <div className="px-3 py-1 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-600"
                  >
                    <Trash2 className="h-2.5 w-2.5" /> Effacer
                  </button>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-stone-200 dark:border-stone-800">
                <div className="flex gap-1.5">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question..."
                    rows={1}
                    className="flex-1 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-2.5 py-1.5 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 min-h-[32px] max-h-[80px]"
                    style={{ height: "auto", overflow: "hidden" }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = Math.min(target.scrollHeight, 80) + "px";
                    }}
                  />
                  <Button
                    onClick={isLoading ? cancelRequest : handleSend}
                    disabled={!input.trim() && !isLoading}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      isLoading ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"
                    )}
                  >
                    {isLoading ? (
                      <X className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <Send className="h-3.5 w-3.5 text-white" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
