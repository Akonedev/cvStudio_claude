"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic, Sparkles, ChevronDown, ChevronUp, RotateCcw,
  CheckCircle, MessageSquare, Brain, Target, Award,
  Play, Link as LinkIcon, RefreshCw, Clock, ThumbsUp,
  Lightbulb, Star
} from "lucide-react";

const mockQuestions = [
  {
    id: "1",
    category: "Comportemental",
    difficulty: "Moyen",
    question: "Parlez-moi d'un projet techniquement complexe que vous avez piloté. Quels défis avez-vous rencontrés et comment les avez-vous résolus ?",
    tips: [
      "Utilisez la méthode STAR (Situation, Tâche, Action, Résultat)",
      "Chiffrez l'impact de votre action",
      "Montrez votre capacité à prendre des décisions sous pression",
    ],
    modelAnswer: "Lors de mon poste de Lead Tech chez Finova, j'ai piloté la migration de notre monolithe vers une architecture microservices...",
  },
  {
    id: "2",
    category: "Technique",
    difficulty: "Difficile",
    question: "Comment architecureriez-vous un système fintech capable de traiter 1 million de transactions par seconde avec une haute disponibilité ?",
    tips: [
      "Pensez event-driven architecture",
      "Abordez la résilience et le fallback",
      "Mentionnez les patterns comme Circuit Breaker, CQRS",
    ],
    modelAnswer: "Pour un tel système, j'adopterais une architecture événementielle avec Kafka comme backbone...",
  },
  {
    id: "3",
    category: "Leadership",
    difficulty: "Moyen",
    question: "Comment gérez-vous les conflits techniques au sein d'une équipe d'ingénieurs seniors avec des opinions divergentes ?",
    tips: [
      "Montrez votre capacité d'écoute",
      "Parlez de processus de décision structuré",
      "Donnez un exemple concret",
    ],
    modelAnswer: "Je facilite d'abord un échange structuré autour des critères objectifs...",
  },
  {
    id: "4",
    category: "Situationnel",
    difficulty: "Facile",
    question: "Où vous voyez-vous dans 3 ans ? Quelles sont vos ambitions en tant que CTO ?",
    tips: [
      "Alignez vos ambitions avec la vision de l'entreprise",
      "Montrez votre envie d'apprendre et d'évoluer",
      "Parlez d'impact, pas seulement de titre",
    ],
    modelAnswer: "Dans 3 ans, j'aspire à avoir construit une organisation technique de référence...",
  },
];

const difficultyColor = {
  Facile: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Moyen: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Difficile: "bg-red-500/10 text-red-400 border-red-500/20",
};

const categoryColor = {
  Comportemental: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Technique: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Leadership: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Situationnel: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

export function InterviewPrepInterface() {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<typeof mockQuestions | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("prepare");

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setQuestions(mockQuestions);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="border-b border-border bg-card/50 px-4 pt-3">
            <TabsList className="bg-transparent gap-1">
              <TabsTrigger value="prepare" className="text-xs data-[state=active]:bg-background">
                <Brain className="w-3.5 h-3.5 mr-1.5" />
                Préparer
              </TabsTrigger>
              <TabsTrigger value="practice" className="text-xs data-[state=active]:bg-background">
                <Mic className="w-3.5 h-3.5 mr-1.5" />
                S'entraîner
              </TabsTrigger>
              <TabsTrigger value="tips" className="text-xs data-[state=active]:bg-background">
                <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
                Conseils
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="prepare" className="flex-1 flex flex-col overflow-hidden mt-0">
            {/* URL input */}
            <div className="p-6 border-b border-border bg-card/30">
              <div className="max-w-2xl">
                <div className="text-sm font-medium mb-2">
                  URL de l'offre (optionnel — personnalise les questions)
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="https://linkedin.com/jobs/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-9 bg-background border-border/60"
                    />
                  </div>
                  <Button
                    className="btn-gradient font-medium gap-2 px-6"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Générer les questions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              {!questions && !isGenerating && (
                <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2">
                    Préparez votre entretien
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    L'IA génère des questions personnalisées basées sur le poste visé, avec des
                    conseils d'experts RH et des réponses modèles.
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium mb-1">Préparation de vos questions...</div>
                    <div className="text-sm text-muted-foreground">L'IA RH senior analyse le profil</div>
                  </div>
                </div>
              )}

              {questions && (
                <div className="p-6 space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { label: "Questions", value: questions.length, icon: MessageSquare, color: "text-blue-400" },
                      { label: "Comportemental", value: 1, icon: Brain, color: "text-blue-400" },
                      { label: "Technique", value: 1, icon: Target, color: "text-violet-400" },
                      { label: "Leadership", value: 2, icon: Award, color: "text-amber-400" },
                    ].map((stat) => (
                      <div key={stat.label} className="card-premium p-3 text-center">
                        <stat.icon className={`w-4 h-4 mx-auto mb-1.5 ${stat.color}`} />
                        <div className="text-lg font-display font-bold">{stat.value}</div>
                        <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Questions */}
                  {questions.map((q) => (
                    <div key={q.id} className="card-premium overflow-hidden">
                      <button
                        className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-muted-foreground">
                          {q.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge className={`text-[10px] ${categoryColor[q.category as keyof typeof categoryColor]}`}>
                              {q.category}
                            </Badge>
                            <Badge className={`text-[10px] ${difficultyColor[q.difficulty as keyof typeof difficultyColor]}`}>
                              {q.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium leading-relaxed">{q.question}</p>
                        </div>
                        {expandedId === q.id ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>

                      {expandedId === q.id && (
                        <div className="border-t border-border p-4 space-y-4">
                          {/* Tips */}
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                              Conseils pour répondre
                            </div>
                            <ul className="space-y-1.5">
                              {q.tips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Your answer */}
                          <div>
                            <div className="text-xs font-medium mb-2">Votre réponse</div>
                            <Textarea
                              placeholder="Rédigez votre réponse ici pour vous entraîner..."
                              value={userAnswer[q.id] || ""}
                              onChange={(e) => setUserAnswer({ ...userAnswer, [q.id]: e.target.value })}
                              className="min-h-[100px] bg-background border-border/60 text-sm resize-none"
                            />
                          </div>

                          {/* Model answer */}
                          <div className="bg-teal-500/5 border border-teal-500/20 rounded-lg p-3">
                            <div className="text-xs font-medium text-teal-400 mb-2 flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5" />
                              Exemple de réponse senior
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{q.modelAnswer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="practice" className="flex-1 flex flex-col items-center justify-center mt-0 p-8">
            <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Mic className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-3">Simulation d'entretien</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Simulez un vrai entretien avec l'IA. Répondez à voix haute et obtenez
              un feedback détaillé sur votre performance.
            </p>
            <div className="flex gap-3">
              <Button className="btn-gradient font-medium gap-2 px-8 h-12">
                <Play className="w-4 h-4" />
                Démarrer la simulation
              </Button>
              <Button variant="outline" className="border-border/60 h-12 px-8 gap-2">
                <RotateCcw className="w-4 h-4" />
                Reprendre
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Fonctionnalité disponible sur le plan Pro et Élite
            </p>
          </TabsContent>

          <TabsContent value="tips" className="flex-1 overflow-auto mt-0 p-6">
            <div className="max-w-2xl space-y-4">
              {[
                {
                  title: "Avant l'entretien",
                  icon: "📋",
                  tips: [
                    "Recherchez l'entreprise en profondeur (actualités, culture, valeurs, concurrents)",
                    "Préparez 5-7 questions pertinentes à poser au recruteur",
                    "Revoyez vos expériences avec la méthode STAR",
                    "Testez votre connexion si entretien en visio 30 min avant",
                    "Ayez votre CV et la description du poste sous la main",
                  ],
                },
                {
                  title: "Pendant l'entretien",
                  icon: "🎯",
                  tips: [
                    "Prenez le temps de réfléchir avant de répondre — c'est un signe de maturité",
                    "Quantifiez vos réalisations avec des chiffres concrets",
                    "Montrez votre enthousiasme pour le poste et l'entreprise",
                    "Adaptez votre langage au niveau technique de votre interlocuteur",
                    "Demandez des clarifications si une question est ambiguë",
                  ],
                },
                {
                  title: "Signaux positifs à envoyer",
                  icon: "✅",
                  tips: [
                    "Montrez que vous avez fait vos recherches sur l'entreprise",
                    "Parlez de projets concrets et de résultats mesurables",
                    "Exprimez votre curiosité et votre envie d'apprendre",
                    "Montrez votre capacité d'adaptation et de gestion d'ambiguïté",
                    "Soyez honnête sur vos points de progression — cela inspire confiance",
                  ],
                },
                {
                  title: "Après l'entretien",
                  icon: "📧",
                  tips: [
                    "Envoyez un email de remerciement dans les 24h",
                    "Récapitulez un point clé de l'échange pour montrer que vous écoutiez",
                    "Relancez poliment si vous n'avez pas de nouvelles après 7-10 jours",
                    "Notez les questions posées pour améliorer vos prochaines préparations",
                  ],
                },
              ].map((section) => (
                <div key={section.title} className="card-premium p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{section.icon}</span>
                    <h3 className="font-display font-semibold">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right sidebar */}
      <div className="w-64 border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-border">
          <div className="text-sm font-medium">Progression</div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="card-premium p-4">
              <div className="text-xs text-muted-foreground mb-2">Score de préparation</div>
              <div className="text-3xl font-display font-bold text-amber-400 mb-2">
                {questions ? "65" : "—"}
              </div>
              {questions && <Progress value={65} className="h-1.5" />}
            </div>

            {questions && (
              <div className="space-y-2">
                {[
                  { cat: "Comportemental", done: false },
                  { cat: "Technique", done: false },
                  { cat: "Leadership", done: false },
                  { cat: "Situationnel", done: false },
                ].map((item) => (
                  <div key={item.cat} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.cat}</span>
                    <span className={item.done ? "text-emerald-400" : "text-muted-foreground"}>
                      {item.done ? "✓" : "○"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground">
              <div className="font-medium text-foreground mb-1">💡 Conseil du jour</div>
              La préparation est clé — les candidats qui s'entraînent 2h avant un entretien ont 40% plus de chances de réussir.
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
