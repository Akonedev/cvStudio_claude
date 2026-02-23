"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface CV {
  id: string;
  title: string;
  atsScore: number | null;
  isActive: boolean;
  updatedAt: string;
}

export function ActiveCVCard() {
  const [cv, setCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cvs")
      .then((r) => r.json())
      .then((d) => {
        const list: CV[] = d.data ?? [];
        const active = list.find((c) => c.isActive) ?? list[0] ?? null;
        setCV(active);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card-premium p-6 border-amber-500/20">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-muted/50 rounded w-1/2" />
          <div className="aspect-[3/4] bg-muted/30 rounded-xl" />
          <div className="h-3 bg-muted/50 rounded w-3/4" />
          <div className="h-3 bg-muted/50 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="card-premium p-6 border-amber-500/20 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Aucun CV créé</p>
          <p className="text-xs text-muted-foreground">Créez votre premier CV pour commencer.</p>
        </div>
        <Button size="sm" className="btn-gradient font-medium" asChild>
          <Link href="/dashboard/cv-builder/new">Créer un CV</Link>
        </Button>
      </div>
    );
  }

  const atsScore = cv.atsScore ?? 0;
  const lastModified = formatDistanceToNow(new Date(cv.updatedAt), { addSuffix: true, locale: fr });

  return (
    <div className="card-premium p-6 border-amber-500/20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-display font-semibold">CV Actif</h2>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Actif</Badge>
      </div>

      {/* CV Preview */}
      <div className="bg-muted/30 rounded-xl p-4 mb-5 border border-border/50">
        <div className="w-full aspect-[3/4] bg-card rounded-lg border border-border/50 flex flex-col overflow-hidden">
          <div className="h-1/4 bg-amber-500/10 border-b border-border/50 p-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 mb-1.5" />
            <div className="h-1.5 bg-foreground/20 rounded w-3/4 mb-1" />
            <div className="h-1 bg-amber-500/30 rounded w-1/2" />
          </div>
          <div className="flex-1 p-2 space-y-2">
            <div className="h-1 bg-muted rounded w-1/2" />
            {[80, 70, 90].map((w, i) => (
              <div key={i} className="h-1 bg-muted/60 rounded" style={{ width: `${w}%` }} />
            ))}
            <div className="h-1 bg-muted rounded w-2/5 mt-2" />
            {[60, 75, 50].map((w, i) => (
              <div key={i} className="h-1 bg-muted/60 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm font-medium truncate mb-4">{cv.title}</p>

      {atsScore > 0 && (
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Score ATS</span>
            <span className="font-medium text-emerald-400">{atsScore}/100</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              style={{ width: `${atsScore}%` }}
            />
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground mb-5">Modifié {lastModified}</div>

      <div className="space-y-2">
        <Button className="w-full btn-gradient font-medium" asChild>
          <Link href={`/dashboard/cv-builder/${cv.id}`}>
            <Edit className="w-4 h-4 mr-2" />
            Modifier le CV
          </Link>
        </Button>
        <Button variant="outline" className="w-full border-border/60" asChild>
          <Link href="/dashboard/cv-builder">
            Changer de CV actif
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

