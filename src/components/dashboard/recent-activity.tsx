"use client";

import { FileText, Search, Mail, Mic, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const activities = [
  {
    type: "cv_created",
    icon: FileText,
    label: "CV Senior Developer créé",
    detail: "Score ATS: 92/100",
    time: new Date(Date.now() - 1000 * 60 * 30),
    status: "success",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
  {
    type: "job_match",
    icon: Search,
    label: "Offre analysée — CTO Startup",
    detail: "Match: 87% — Chez TechCo Paris",
    time: new Date(Date.now() - 1000 * 60 * 120),
    status: "success",
    iconColor: "text-teal-400",
    iconBg: "bg-teal-500/10",
  },
  {
    type: "cover_letter",
    icon: Mail,
    label: "Lettre de motivation générée",
    detail: "Poste: Lead Product Manager",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: "success",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
  },
  {
    type: "interview",
    icon: Mic,
    label: "Simulation d'entretien complétée",
    detail: "25 questions — Score: 78/100",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "success",
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10",
  },
];

export function RecentActivity() {
  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-display font-semibold">Activité récente</h2>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          7 derniers jours
        </Badge>
      </div>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className={`w-8 h-8 rounded-lg ${activity.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{activity.label}</div>
              <div className="text-xs text-muted-foreground">{activity.detail}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.time, { addSuffix: true, locale: fr })}
              </span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
