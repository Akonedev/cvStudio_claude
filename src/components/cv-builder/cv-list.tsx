"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Plus, Star, StarOff, MoreVertical, 
  Download, Copy, Trash2, Edit, Eye, TrendingUp 
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockCVs = [
  {
    id: "1",
    name: "CV Senior Developer",
    template: "Minerva Executive",
    atsScore: 92,
    pages: 1,
    isActive: true,
    lastModified: "Il y a 2h",
    completeness: 94,
    jobs: 12,
  },
  {
    id: "2",
    name: "CV Tech Lead",
    template: "Atlas Professional",
    atsScore: 78,
    pages: 2,
    isActive: false,
    lastModified: "Il y a 3j",
    completeness: 76,
    jobs: 5,
  },
  {
    id: "3",
    name: "CV CTO Vision",
    template: "Lumière Creative",
    atsScore: 85,
    pages: 1,
    isActive: false,
    lastModified: "Il y a 1sem",
    completeness: 88,
    jobs: 3,
  },
];

export function CVList() {
  const [cvs, setCVs] = useState(mockCVs);

  const setActive = (id: string) => {
    setCVs(prev => prev.map(cv => ({ ...cv, isActive: cv.id === id })));
  };

  return (
    <div className="space-y-6">
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

      {/* CV Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {cvs.map((cv, i) => (
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
                  <div className="font-semibold text-sm">{cv.name}</div>
                  <div className="text-xs text-muted-foreground">{cv.template}</div>
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
                    <DropdownMenuItem className="text-red-400">
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
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Score ATS</span>
                <span className={`font-medium ${cv.atsScore >= 85 ? "text-emerald-400" : cv.atsScore >= 70 ? "text-amber-400" : "text-red-400"}`}>
                  {cv.atsScore}/100
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full">
                <div
                  className={`h-full rounded-full ${cv.atsScore >= 85 ? "bg-emerald-500" : cv.atsScore >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                  style={{ width: `${cv.atsScore}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">{cv.lastModified} · {cv.pages}p</span>
              <span className="text-xs text-muted-foreground">{cv.jobs} offres envoyées</span>
            </div>

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
        ))}
      </div>
    </div>
  );
}
