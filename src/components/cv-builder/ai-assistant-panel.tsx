"use client";

import { useState, useRef, useEffect } from "react";
import { useAIChat } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send, Loader2, Trash2, Sparkles, FileText, Target,
  Wand2, ListChecks, Languages, PenLine, Bot, User, X
} from "lucide-react";

interface AIAssistantPanelProps {
  cvId: string;
}

// ─── Quick action prompts ───────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    icon: Wand2,
    label: "Améliorer le résumé",
    prompt: "Améliore mon résumé professionnel pour le rendre plus impactant et orienté résultats.",
    color: "text-amber-500",
  },
  {
    icon: Target,
    label: "Optimiser ATS",
    prompt: "Analyse mon CV et donne-moi des recommandations pour améliorer sa compatibilité ATS (Applicant Tracking System). Fournis des mots-clés manquants.",
    color: "text-blue-500",
  },
  {
    icon: ListChecks,
    label: "Vérifier les erreurs",
    prompt: "Vérifie mon CV pour les fautes d'orthographe, de grammaire, les incohérences de dates et les améliorations possibles.",
    color: "text-emerald-500",
  },
  {
    icon: PenLine,
    label: "Réécrire l'expérience",
    prompt: "Réécris mes descriptions d'expérience professionnelle avec des verbes d'action forts et des métriques quantifiables.",
    color: "text-violet-500",
  },
  {
    icon: Languages,
    label: "Traduire en anglais",
    prompt: "Traduis tout le contenu de mon CV en anglais professionnel.",
    color: "text-teal-500",
  },
  {
    icon: FileText,
    label: "Adapter pour un poste",
    prompt: "Comment adapter mon CV pour un poste de [décris le poste] ? Fournis des suggestions de modifications.",
    color: "text-rose-500",
  },
];

export function AIAssistantPanel({ cvId }: AIAssistantPanelProps) {
  const { messages, isLoading, error, sendMessage, clearHistory, cancelRequest } = useAIChat({
    context: "cv",
    cvId,
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ─── Messages area ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="space-y-4">
            {/* Welcome */}
            <div className="text-center py-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <h4 className="text-xs font-semibold text-foreground">
                Assistant CV IA
              </h4>
              <p className="text-[10px] text-muted-foreground mt-1">
                Je peux vous aider à améliorer, corriger et optimiser votre CV.
              </p>
            </div>

            {/* Quick actions */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-medium text-muted-foreground uppercase">Actions rapides</span>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md border border-border hover:bg-muted transition-colors text-left"
                  >
                    <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", action.color)} />
                    <span className="text-xs text-muted-foreground">{action.label}</span>
                  </button>
                );
              })}
            </div>
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
                    "max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed",
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
                <div className="bg-muted rounded-lg px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                    <span className="text-muted-foreground">Réflexion en cours...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ─── Clear history ───────────────────────────────────────────────── */}
      {messages.length > 0 && (
        <div className="px-3 py-1 border-t border-border">
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trash2 className="h-2.5 w-2.5" />
            Effacer l&apos;historique
          </button>
        </div>
      )}

      {/* ─── Input area ──────────────────────────────────────────────────── */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-1.5">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez une question sur votre CV..."
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
    </div>
  );
}
