"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Search, Link as LinkIcon, Sparkles, TrendingUp, FileText,
  Mail, CheckCircle, AlertCircle, ArrowRight, ExternalLink,
  Zap, Target, BarChart3, RefreshCw, Clock, Building
} from "lucide-react";

const mockAnalysis = {
  jobTitle: "CTO — Startup Fintech Series A",
  company: "TechCo",
  location: "Paris (Hybride)",
  salary: "120-150k€",
  matchScore: 87,
  analyzed: true,
  matchDetails: [
    { category: "Compétences techniques", score: 92, status: "excellent" },
    { category: "Expérience requise", score: 85, status: "good" },
    { category: "Leadership", score: 90, status: "excellent" },
    { category: "Secteur d'activité", score: 70, status: "moderate" },
    { category: "Formation", score: 95, status: "excellent" },
  ],
  keywords: {
    matched: ["React", "TypeScript", "Node.js", "AWS", "Leadership", "Agile", "Scalable", "Architecture"],
    missing: ["Golang", "Kubernetes", "ML/AI basics", "Fundraising"],
  },
  insights: [
    { type: "strength", text: "Votre expérience en scale-up correspond parfaitement au profil recherché." },
    { type: "strength", text: "Votre stack technique couvre 90% des technos requises." },
    { type: "gap", text: "Aucune mention de Golang dans votre CV — ajoutez votre expérience Go si vous en avez." },
    { type: "tip", text: "Mettez en avant la taille des équipes managées — ce poste cherche un CTO expérimenté." },
  ],
};

export function JobMatcherInterface() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<typeof mockAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("analysis");

  const handleAnalyze = () => {
    if (!url) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Input & Analysis */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* URL Input */}
        <div className="p-6 border-b border-border bg-card/50">
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
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>
              <Button
                className="btn-gradient font-medium gap-2 px-6"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyser
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Compatible : LinkedIn, Indeed, Welcome to the Jungle, Pole Emploi, APEC, et toutes les pages web
            </p>
          </div>
        </div>

        {/* Analysis results */}
        <ScrollArea className="flex-1">
          {!analysis && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">Analysez votre première offre</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Collez l'URL d'une offre d'emploi et l'IA analysera sa compatibilité avec votre CV actif,
                proposera des adaptations et générera une lettre de motivation personnalisée.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <div className="text-center">
                <div className="font-medium mb-1">Analyse en cours...</div>
                <div className="text-sm text-muted-foreground">L'IA lit et analyse l'offre d'emploi</div>
              </div>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                {["Lecture de l'offre", "Extraction des critères", "Comparaison avec votre CV", "Génération des recommandations"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Clock className="w-2.5 h-2.5 text-amber-400" />
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis && (
            <div className="p-6 space-y-6">
              {/* Job info */}
              <div className="card-premium p-5 border-amber-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-base">{analysis.jobTitle}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" />{analysis.company}</span>
                      <span>{analysis.location}</span>
                      <span className="text-amber-400">{analysis.salary}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                {/* Match score */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-muted-foreground">Score de compatibilité</span>
                      <span className={`text-lg font-display font-bold ${analysis.matchScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                        {analysis.matchScore}%
                      </span>
                    </div>
                    <Progress value={analysis.matchScore} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-muted">
                  <TabsTrigger value="analysis" className="flex-1 text-xs">
                    <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                    Analyse
                  </TabsTrigger>
                  <TabsTrigger value="cv" className="flex-1 text-xs">
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    CV Adapté
                  </TabsTrigger>
                  <TabsTrigger value="letter" className="flex-1 text-xs">
                    <Mail className="w-3.5 h-3.5 mr-1.5" />
                    Lettre
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-5 mt-5">
                  {/* Match details */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Détail du matching</h4>
                    <div className="space-y-3">
                      {analysis.matchDetails.map((detail) => (
                        <div key={detail.category}>
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span className="text-muted-foreground">{detail.category}</span>
                            <span className={
                              detail.status === "excellent" ? "text-emerald-400" :
                              detail.status === "good" ? "text-amber-400" : "text-orange-400"
                            }>{detail.score}%</span>
                          </div>
                          <Progress value={detail.score} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Mots-clés</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">✓ Présents dans votre CV</div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.keywords.matched.map((kw) => (
                            <Badge key={kw} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">✗ Absents — à ajouter si pertinent</div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.keywords.missing.map((kw) => (
                            <Badge key={kw} className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Recommandations IA</h4>
                    <div className="space-y-2">
                      {analysis.insights.map((insight, i) => (
                        <div key={i} className={`flex items-start gap-2.5 p-3 rounded-lg text-xs ${
                          insight.type === "strength" ? "bg-emerald-500/10 border border-emerald-500/20" :
                          insight.type === "gap" ? "bg-red-500/10 border border-red-500/20" :
                          "bg-amber-500/10 border border-amber-500/20"
                        }`}>
                          {insight.type === "strength" ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          ) : insight.type === "gap" ? (
                            <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          )}
                          <span className="text-muted-foreground">{insight.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cv" className="mt-5">
                  <div className="card-premium p-5 text-center space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">CV adapté à cette offre</h4>
                      <p className="text-xs text-muted-foreground">
                        L'IA a optimisé votre CV pour maximiser votre score ATS sur ce poste spécifique.
                      </p>
                    </div>
                    <Button className="btn-gradient font-medium gap-2">
                      <Sparkles className="w-4 h-4" />
                      Générer le CV adapté
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="letter" className="mt-5">
                  <div className="card-premium p-5 text-center space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto">
                      <Mail className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Lettre de motivation générée</h4>
                      <p className="text-xs text-muted-foreground">
                        Une lettre personnalisée pour ce poste, basée sur votre CV et les attentes de l'offre.
                      </p>
                    </div>
                    <Button className="btn-gradient font-medium gap-2">
                      <Mail className="w-4 h-4" />
                      Générer la lettre
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right: Recent analyses */}
      <div className="w-72 border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-border">
          <div className="text-sm font-medium">Analyses récentes</div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {[
              { company: "TechCo", title: "CTO", score: 87, time: "2h" },
              { company: "FinanceApp", title: "Lead Dev", score: 72, time: "1j" },
              { company: "EduTech", title: "Tech Director", score: 65, time: "3j" },
            ].map((job, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Building className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{job.title}</div>
                  <div className="text-[10px] text-muted-foreground">{job.company}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xs font-bold ${job.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                    {job.score}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">{job.time}</div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
