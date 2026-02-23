"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Plus, Star, MoreVertical, 
  Download, Copy, Trash2, Edit, Eye, Upload
} from "lucide-react";
import { ImportCVDialog } from "./import-cv-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface CV {
  id: string;
  title: string;
  template: string;
  atsScore: number | null;
  isActive: boolean;
  updatedAt: string;
}

export function CVList() {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);

  const loadCVs = () => {
    fetch("/api/cvs")
      .then((r) => r.json())
      .then((d) => setCVs(d.data ?? []))
      .catch(() => toast.error("Impossible de charger les CV"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCVs(); }, []);

  const setActive = async (id: string) => {
    try {
      const res = await fetch(`/api/cvs/${id}/active`, { method: "POST" });
      if (!res.ok) throw new Error();
      setCVs((prev) => prev.map((cv) => ({ ...cv, isActive: cv.id === id })));
      toast.success("CV actif mis à jour");
    } catch {
      toast.error("Erreur lors du changement de CV actif");
    }
  };

  const deleteCV = async (id: string) => {
    if (!confirm("Supprimer ce CV définitivement ?")) return;
    try {
      const res = await fetch(`/api/cvs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCVs((prev) => prev.filter((cv) => cv.id !== id));
      toast.success("CV supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <ImportCVDialog open={importOpen} onOpenChange={setImportOpen} />

      {/* Action cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Create new */}
        <Link href="/dashboard/cv-builder/new">
          <div className="card-premium border-2 border-dashed border-border/60 hover:border-amber-500/40 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all min-h-[140px]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <Plus className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">Créer un nouveau CV</div>
              <div className="text-xs text-muted-foreground">Démarrez depuis un template premium</div>
            </div>
          </div>
        </Link>

        {/* Import existing */}
        <div
          className="card-premium border-2 border-dashed border-border/60 hover:border-teal-500/40 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all min-h-[140px]"
          onClick={() => setImportOpen(true)}
        >
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
            <Upload className="w-6 h-6 text-teal-400" />
          </div>
          <div className="text-center">
            <div className="font-medium text-sm">Importer un CV existant</div>
            <div className="text-xs text-muted-foreground">JSON, texte · style conservé</div>
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-premium p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-muted/50" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted/50 rounded w-3/4" />
                  <div className="h-2.5 bg-muted/30 rounded w-1/2" />
                </div>
              </div>
              <div className="aspect-[210/140] bg-muted/30 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-1.5 bg-muted/50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && cvs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun CV pour l'instant. Créez le vôtre !</p>
        </div>
      )}

      {/* CV Grid */}
      {!loading && cvs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {cvs.map((cv, i) => {
            const score = cv.atsScore ?? 0;
            const lastModified = formatDistanceToNow(new Date(cv.updatedAt), { addSuffix: true, locale: fr });

            return (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`card-premium p-5 flex flex-col gap-4 ${cv.isActive ? "border-amber-500/30" : ""}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{cv.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">{cv.template}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {cv.isActive && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">Actif</Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-7 h-7">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/cv-builder/${cv.id}`}>
                            <Edit className="w-4 h-4 mr-2" />Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />Aperçu
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />Exporter
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />Dupliquer
                        </DropdownMenuItem>
                        {!cv.isActive && (
                          <DropdownMenuItem onClick={() => setActive(cv.id)}>
                            <Star className="w-4 h-4 mr-2" />Définir comme actif
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-400" onClick={() => deleteCV(cv.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Mini CV preview */}
                <div className="bg-muted/20 rounded-lg p-3 border border-border/50">
                  <div className="w-full aspect-[210/140] bg-card rounded flex flex-col overflow-hidden">
                    <div className="h-1/3 bg-amber-500/10 p-1.5">
                      <div className="h-2 bg-foreground/20 rounded w-1/2 mb-1" />
                      <div className="h-1.5 bg-amber-500/30 rounded w-1/3" />
                    </div>
                    <div className="flex-1 p-1.5 space-y-1">
                      {[70, 85, 60, 75].map((w, j) => (
                        <div key={j} className="h-1 bg-muted rounded" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                {score > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Score ATS</span>
                      <span className={`font-medium ${score >= 85 ? "text-emerald-400" : score >= 70 ? "text-amber-400" : "text-red-400"}`}>
                        {score}/100
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div
                        className={`h-full rounded-full ${score >= 85 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="text-xs text-muted-foreground">{lastModified}</div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" className="flex-1 btn-gradient text-xs font-medium" asChild>
                    <Link href={`/dashboard/cv-builder/${cv.id}`}>
                      <Edit className="w-3.5 h-3.5 mr-1.5" />
                      Modifier
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-border/60 text-xs">
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Exporter
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
