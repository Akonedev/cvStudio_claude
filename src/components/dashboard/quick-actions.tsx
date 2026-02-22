"use client";

import Link from "next/link";
import { FileText, Search, Mail, Mic, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: FileText,
    label: "Créer un nouveau CV",
    description: "Démarrez depuis un template premium",
    href: "/dashboard/cv-builder/new",
    color: "amber",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Search,
    label: "Analyser une offre",
    description: "Collez l'URL d'une offre d'emploi",
    href: "/dashboard/job-matcher",
    color: "teal",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    iconColor: "text-teal-400",
  },
  {
    icon: Mail,
    label: "Rédiger une lettre",
    description: "Lettre de motivation personnalisée",
    href: "/dashboard/cover-letter/new",
    color: "violet",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Mic,
    label: "Préparer un entretien",
    description: "Simulation avec coach IA",
    href: "/dashboard/interview/new",
    color: "rose",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
  },
];

export function QuickActions() {
  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-display font-semibold">Actions rapides</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex items-center gap-4 p-4 rounded-xl border ${action.border} ${action.bg} hover:opacity-80 transition-all duration-200 group`}
          >
            <div className={`w-10 h-10 rounded-xl bg-background flex items-center justify-center flex-shrink-0`}>
              <action.icon className={`w-5 h-5 ${action.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{action.label}</div>
              <div className="text-xs text-muted-foreground truncate">{action.description}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
