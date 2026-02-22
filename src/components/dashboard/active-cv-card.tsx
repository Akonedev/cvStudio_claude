"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Star, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

const mockCV = {
  name: "CV Senior Developer",
  lastModified: "Il y a 2 heures",
  atsScore: 92,
  pages: 1,
  completeness: 94,
};

export function ActiveCVCard() {
  return (
    <div className="card-premium p-6 border-amber-500/20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-display font-semibold">CV Actif</h2>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Actif</Badge>
      </div>

      {/* CV Preview */}
      <div className="bg-muted/30 rounded-xl p-4 mb-5 border border-border/50">
        <div className="w-full aspect-[3/4] bg-card rounded-lg border border-border/50 flex flex-col overflow-hidden">
          {/* Mini CV mockup */}
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

      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Score ATS</span>
          <span className="font-medium text-emerald-400">{mockCV.atsScore}/100</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            style={{ width: `${mockCV.atsScore}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Complétude</span>
          <span className="font-medium">{mockCV.completeness}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
            style={{ width: `${mockCV.completeness}%` }}
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-5">
        Modifié {mockCV.lastModified} · {mockCV.pages} page
      </div>

      <div className="space-y-2">
        <Button className="w-full btn-gradient font-medium" asChild>
          <Link href="/dashboard/cv-builder/1">
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
