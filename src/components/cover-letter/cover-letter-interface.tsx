"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail, Link as LinkIcon, Sparkles, RefreshCw, Download,
  Copy, CheckCheck, Edit3, FileText, Wand2, ChevronRight,
  Building, Star, Clock
} from "lucide-react";

const mockLetter = `Madame, Monsieur,

Passionné par l'innovation technologique et fort de 8 années d'expérience en développement full-stack, je me permets de vous adresser ma candidature au poste de CTO au sein de TechCo.

Votre startup m'attire particulièrement pour son positionnement ambitieux dans la fintech et sa culture d'excellence technique. La mission de démocratiser l'accès aux services financiers résonne profondément avec mes valeurs professionnelles.

Au cours de mon parcours, j'ai eu l'opportunité de diriger des équipes de 15 à 30 développeurs et d'architecturer des systèmes traitant plus de 2 millions de transactions quotidiennes. Mon expertise en React, TypeScript, Node.js et AWS me permet de relever immédiatement les défis techniques de votre Série A.

Plus récemment, chez Finova (scale-up 200 personnes), j'ai piloté la migration vers une architecture microservices qui a réduit nos temps de déploiement de 70% et amélioré notre disponibilité à 99,98%.

Convaincu que la technologie est au service de l'humain, je serais honoré de contribuer à la vision de TechCo et d'échanger avec vous sur les défis techniques et organisationnels de votre prochain cap de croissance.

Dans l'attente de votre retour, je reste à votre disposition pour tout entretien à votre convenance.

Cordialement,

Jean Dupont
jean.dupont@email.com | +33 6 12 34 56 78 | LinkedIn`;

const savedLetters = [
  { id: "1", company: "TechCo", title: "CTO Fintech", date: "Aujourd'hui", score: 94 },
  { id: "2", company: "DataFlow", title: "Lead Engineer", date: "Hier", score: 88 },
  { id: "3", company: "CloudStart", title: "Tech Director", date: "Il y a 3j", score: 79 },
];

export function CoverLetterInterface() {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [editedLetter, setEditedLetter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");

  const handleGenerate = () => {
    if (!url) return;
    setIsGenerating(true);
    setTimeout(() => {
      setLetter(mockLetter);
      setEditedLetter(mockLetter);
      setIsGenerating(false);
    }, 2800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedLetter || letter || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="border-b border-border bg-card/50 px-4 pt-3">
            <TabsList className="bg-transparent gap-1">
              <TabsTrigger value="generate" className="text-xs data-[state=active]:bg-background">
                <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                Générer
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-xs data-[state=active]:bg-background">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Mes lettres ({savedLetters.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="flex-1 flex flex-col overflow-hidden mt-0">
            {/* URL Input */}
            <div className="p-6 border-b border-border bg-card/30">
              <div className="max-w-2xl">
                <div className="text-sm font-medium mb-2">URL de l'offre d'emploi</div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="https://linkedin.com/jobs/... ou indeed.com/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-9 bg-background border-border/60"
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                  </div>
                  <Button
                    className="btn-gradient font-medium gap-2 px-6"
                    onClick={handleGenerate}
                    disabled={isGenerating || !url}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Générer
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  L'IA analyse l'offre et génère une lettre personnalisée basée sur votre CV actif
                </p>
              </div>
            </div>

            {/* Letter content */}
            <ScrollArea className="flex-1">
              {!letter && !isGenerating && (
                <div className="flex flex-col items-center justify-center h-full py-24 text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2">
                    Générez votre première lettre
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Collez l'URL d'une offre et l'IA créera une lettre de motivation
                    professionnelle, percutante et parfaitement adaptée au poste.
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-md">
                    {["Personnalisée à l'offre", "Ton professionnel adapté", "Bonnes pratiques RH"].map((f) => (
                      <div key={f} className="bg-muted rounded-lg p-3 text-xs text-muted-foreground text-center">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-24 gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium mb-1">Génération en cours...</div>
                    <div className="text-sm text-muted-foreground">L'IA rédige votre lettre personnalisée</div>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {["Analyse de l'offre", "Extraction des points clés", "Adaptation au profil", "Rédaction professionnelle", "Vérification qualité"].map((step) => (
                      <div key={step} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-violet-500/20 flex items-center justify-center">
                          <Clock className="w-2.5 h-2.5 text-violet-400" />
                        </div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {letter && (
                <div className="p-6 space-y-4">
                  {/* Actions bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                        Lettre générée
                      </Badge>
                      <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs">
                        Score : 94/100
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs border-border/60"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {isEditing ? "Aperçu" : "Éditer"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs border-border/60"
                        onClick={handleCopy}
                      >
                        {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copié" : "Copier"}
                      </Button>
                      <Button size="sm" className="btn-gradient text-xs gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        Exporter
                      </Button>
                    </div>
                  </div>

                  {/* Letter */}
                  <div className="card-premium p-8 bg-card">
                    {isEditing ? (
                      <Textarea
                        value={editedLetter}
                        onChange={(e) => setEditedLetter(e.target.value)}
                        className="min-h-[500px] bg-transparent border-none resize-none font-mono text-sm p-0 focus-visible:ring-0"
                      />
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {(editedLetter || letter).split("\n").map((line, i) => (
                          <p key={i} className={`${line === "" ? "mb-4" : "mb-0"} text-sm leading-relaxed`}>
                            {line || <>&nbsp;</>}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Regenerate */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="gap-2 border-border/60 text-xs"
                      onClick={handleGenerate}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Régénérer
                    </Button>
                    <Input
                      placeholder="Instructions pour la régénération... (ex: ton plus formel, insister sur leadership)"
                      className="flex-1 text-xs bg-background border-border/60"
                    />
                    <Button variant="outline" className="gap-2 border-border/60 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      Affiner
                    </Button>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="saved" className="flex-1 overflow-auto mt-0 p-6">
            <div className="space-y-3">
              {savedLetters.map((item) => (
                <div key={item.id} className="card-premium p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building className="w-3 h-3" /> {item.company}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        <span className="text-sm font-bold text-amber-400">{item.score}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">Score</div>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right sidebar — tips */}
      <div className="w-72 border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-border">
          <div className="text-sm font-medium">Conseils RH Senior</div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {[
              {
                tip: "Personnalisez toujours le nom du responsable si vous le connaissez",
                icon: "👤",
              },
              {
                tip: "La lettre doit faire max 1 page — 3 paragraphes est idéal",
                icon: "📄",
              },
              {
                tip: "Commencez par une accroche qui montre votre connaissance de l'entreprise",
                icon: "🎯",
              },
              {
                tip: "Chiffrez vos réalisations avec des metrics concrètes",
                icon: "📊",
              },
              {
                tip: "Terminez toujours par un appel à l'action clair",
                icon: "✅",
              },
            ].map((item, i) => (
              <div key={i} className="bg-muted rounded-lg p-3 text-xs text-muted-foreground flex gap-2.5">
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.tip}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
