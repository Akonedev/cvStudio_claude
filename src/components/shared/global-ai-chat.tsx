"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAIChat, type AIMessage } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MessageSquare, Send, Loader2, X, Trash2, Sparkles,
  Bot, User, Minimize2, Maximize2, ChevronDown, Users
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AgentMini {
  id: string;
  name: string;
  slug: string;
  description: string;
  context: string;
  icon: string;
  color: string;
  isDefault: boolean;
  greeting?: string | null;
  capabilities?: string[] | null;
}

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

// ── Context enum mapping ────────────────────────────────────────────────────
const DB_CONTEXT_MAP: Record<string, string> = {
  CV: "cv",
  COVER_LETTER: "cover-letter",
  INTERVIEW: "interview",
  JOB_MATCHER: "job-matcher",
  ATS: "cv",
  CAREER: "general",
  GENERAL: "general",
};

export function GlobalAIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [agents, setAgents] = useState<AgentMini[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentMini | null>(null);
  const pathname = usePathname();
  const { context, label, color } = getPageContext(pathname);

  const { messages, isLoading, error, sendMessage, clearHistory, cancelRequest, switchAgent } = useAIChat({
    context,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch available agents
  useEffect(() => {
    fetch("/api/ai/agents")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setAgents(json.data);
          // Auto-select default agent for current context
          const contextDefault = json.data.find(
            (a: AgentMini) => a.isDefault && DB_CONTEXT_MAP[a.context] === context
          );
          if (contextDefault) {
            setSelectedAgent(contextDefault);
            switchAgent(contextDefault.id);
          }
        }
      })
      .catch(() => {/* no agents available */});
  }, [context, switchAgent]);

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

  const selectAgent = (agent: AgentMini | null) => {
    setSelectedAgent(agent);
    switchAgent(agent?.id);
    setShowAgentPicker(false);
  };

  // Don't show the global FAB when inside the CV editor (it has its own AI panel)
  const isInCVEditor = pathname.match(/\/cv-builder\/[^/]+/);
  if (isInCVEditor) return null;

  const currentGreeting = selectedAgent?.greeting || CONTEXT_GREETINGS[context];
  const currentLabel = selectedAgent?.name || `Assistant — ${label}`;

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
            "fixed z-50 bg-card rounded-lg shadow-2xl border border-border flex flex-col transition-all duration-200",
            isMinimized
              ? "bottom-6 right-6 w-72 h-12"
              : "bottom-6 right-6 w-96 h-[520px]"
          )}
        >
          {/* ─── Header ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border rounded-t-lg bg-muted">
            <div className="flex items-center gap-2">
              <div
                className={cn("w-6 h-6 rounded-full flex items-center justify-center")}
                style={selectedAgent ? { backgroundColor: `${selectedAgent.color}30`, color: selectedAgent.color } : undefined}
              >
                {selectedAgent ? (
                  <Bot className="h-3 w-3" />
                ) : (
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", color)}>
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => setShowAgentPicker(!showAgentPicker)}
                  className="text-xs font-semibold text-foreground hover:text-amber-500 flex items-center gap-1 transition-colors"
                >
                  {currentLabel}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setShowAgentPicker(!showAgentPicker)}
                className="p-1 hover:bg-muted rounded"
                title="Changer d'agent"
              >
                <Users className="h-3 w-3 text-muted-foreground" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-muted rounded"
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Minimize2 className="h-3 w-3 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* ─── Agent Picker ──────────────────────────────────────────── */}
          {showAgentPicker && !isMinimized && (
            <div className="border-b border-border bg-muted/50 max-h-48 overflow-y-auto">
              <button
                className={cn(
                  "w-full text-left px-3 py-2 text-xs hover:bg-muted flex items-center gap-2 transition-colors",
                  !selectedAgent && "bg-amber-50 dark:bg-amber-900/20"
                )}
                onClick={() => selectAgent(null)}
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                <div>
                  <span className="font-medium">Auto ({label})</span>
                  <span className="text-muted-foreground ml-1">— détection par page</span>
                </div>
              </button>
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs hover:bg-muted flex items-center gap-2 transition-colors",
                    selectedAgent?.id === agent.id && "bg-amber-50 dark:bg-amber-900/20"
                  )}
                  onClick={() => selectAgent(agent)}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                  >
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{agent.name}</span>
                    {agent.isDefault && (
                      <span className="text-amber-500 text-[9px] ml-1">par défaut</span>
                    )}
                    <p className="text-muted-foreground truncate text-[10px]">{agent.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

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
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      {currentLabel}
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-[260px] mx-auto">
                      {currentGreeting}
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
                              : "bg-muted text-foreground rounded-bl-none"
                          )}
                        >
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                          <div className={cn(
                            "text-[9px] mt-1 flex items-center gap-1",
                            msg.role === "user" ? "text-amber-200" : "text-muted-foreground"
                          )}>
                            {msg.role === "assistant" && msg.agent && (
                              <span className="font-medium">{msg.agent} ·</span>
                            )}
                            {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Bot className="h-3 w-3 text-amber-600" />
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                            <span className="text-xs text-muted-foreground">Réflexion...</span>
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
                <div className="px-3 py-1 border-t border-border">
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-2.5 w-2.5" /> Effacer
                  </button>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-1.5">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question..."
                    rows={1}
                    className="flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 min-h-[32px] max-h-[80px]"
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
