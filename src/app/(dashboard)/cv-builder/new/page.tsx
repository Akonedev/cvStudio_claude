"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Sparkles, ArrowRight, Plus } from "lucide-react";
import DashboardHeader from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCVActions } from "@/hooks/use-cv-actions";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "modern", name: "Moderne", description: "Design épuré et contemporain, idéal pour les secteurs tech et créatifs.", badge: "Populaire", color: "from-amber-500 to-orange-500" },
  { id: "classic", name: "Classique", description: "Format traditionnel multi-colonnes, apprécié dans la finance et le droit.", badge: null, color: "from-slate-500 to-gray-600" },
  { id: "minimal", name: "Minimaliste", description: "Ultra-clean, focus sur le contenu. Excellent score ATS.", badge: "ATS ⭐", color: "from-teal-500 to-cyan-500" },
  { id: "executive", name: "Exécutif", description: "Profil senior et direction, sobre et impactant.", badge: null, color: "from-violet-500 to-purple-600" },
  { id: "creative", name: "Créatif", description: "Bold et distinctif, pour les métiers créatifs et design.", badge: null, color: "from-rose-500 to-pink-500" },
  { id: "technical", name: "Technique", description: "Structuré pour mettre en avant les compétences techniques.", badge: null, color: "from-blue-500 to-indigo-600" },
];

export default function NewCVPage() {
  const router = useRouter();
  const { createCV } = useCVActions();
  const [title, setTitle] = useState("Mon CV");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setIsCreating(true);
    const cv = await createCV(title.trim(), selectedTemplate);
    if (cv) router.push(`/dashboard/cv-builder/${cv.id}`);
    else setIsCreating(false);
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Nouveau CV"
        subtitle="Choisissez un template et personnalisez votre CV avec l'aide de l'IA"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* CV Title */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  Nom de votre CV
                </CardTitle>
                <CardDescription>Donnez un nom descriptif pour retrouver facilement votre CV</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="cv-title">Titre</Label>
                  <Input
                    id="cv-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ex: CV Développeur Full-Stack 2026"
                    className="max-w-md"
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Template Selection */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Choisissez un template
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((tpl, i) => (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={cn(
                      "w-full text-left rounded-xl border-2 p-4 transition-all duration-200 group",
                      selectedTemplate === tpl.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-border hover:border-amber-500/50 bg-surface-1"
                    )}
                  >
                    <div className={cn("h-24 rounded-lg bg-gradient-to-br mb-3 flex items-center justify-center", tpl.color)}>
                      <FileText className="w-10 h-10 text-white opacity-80" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{tpl.name}</span>
                      {tpl.badge && (
                        <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400">{tpl.badge}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{tpl.description}</p>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-end">
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || isCreating}
              size="lg"
              className="btn-gradient gap-2"
            >
              {isCreating ? (
                <Plus className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Créer ce CV <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
