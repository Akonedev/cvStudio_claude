"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles, Send, Zap, TrendingUp, AlertCircle, 
  CheckCircle, RefreshCw, ChevronRight
} from "lucide-react";

const suggestions = [
  {
    type: "improvement",
    icon: TrendingUp,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    message: "Ajoutez des métriques chiffrées à vos expériences pour augmenter l'impact.",
  },
  {
    type: "warning",
    icon: AlertCircle,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    message: "La section 'Profil' est trop courte (< 80 mots). Développez pour améliorer l'ATS.",
  },
  {
    type: "success",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    message: "Excellente utilisation des mots-clés techniques. Score ATS: 87/100 ✓",
  },
];

const quickActions = [
  "Améliorer le profil",
  "Optimiser pour l'ATS",
  "Réécrire une expérience",
  "Suggérer des compétences",
  "Raccourcir à 1 page",
  "Adapter à une offre",
];

export function AIAssistantPanel() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    {
      role: "ai",
      content: "Bonjour ! Je suis votre assistant RH senior. Je vois votre CV — voici mes premières observations. Que souhaitez-vous améliorer ?",
    },
  ]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const userMessage = prompt;
    setPrompt("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Excellente question ! Pour votre profil Senior Developer, je vous recommande de mettre en avant votre leadership technique et vos réalisations chiffrées. Par exemple : 'Architecturé une plateforme SaaS servant 50K+ utilisateurs avec 99.9% de disponibilité'. Voulez-vous que je reformule une section spécifique ?",
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-sm font-semibold">Assistant IA RH</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-muted-foreground">Expert Senior disponible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="p-3 border-b border-border space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-1">Recommandations</div>
        {suggestions.map((s, i) => (
          <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg ${s.bg} border border-border/40`}>
            <s.icon className={`w-3.5 h-3.5 ${s.color} flex-shrink-0 mt-0.5`} />
            <p className="text-[10px] text-muted-foreground leading-relaxed">{s.message}</p>
          </div>
        ))}
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[90%] rounded-xl px-3 py-2 text-[10px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-amber-500/20 text-amber-100 border border-amber-500/20"
                    : "bg-muted text-muted-foreground border border-border/50"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-xl px-3 py-2 flex items-center gap-2">
                <RefreshCw className="w-3 h-3 text-teal-400 animate-spin" />
                <span className="text-[10px] text-muted-foreground">Analyse en cours...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick actions */}
      <div className="px-3 py-2 border-t border-border">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">Actions rapides</div>
        <div className="flex flex-wrap gap-1">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => setPrompt(action)}
              className="text-[9px] bg-muted hover:bg-muted/80 border border-border/60 text-muted-foreground hover:text-foreground rounded-full px-2 py-0.5 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            placeholder="Demandez à l'IA de modifier votre CV..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-xs min-h-0 h-16 resize-none bg-background border-border/60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            size="icon"
            className="w-9 h-16 btn-gradient flex-shrink-0"
            onClick={handleSend}
            disabled={isLoading || !prompt.trim()}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
