"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText, Search, Mail, Mic, Download, Eye,
  Filter, Calendar, Clock, ChevronRight, Building,
  Star, Trash2, RotateCcw
} from "lucide-react";

type ActivityType = "cv" | "job" | "letter" | "interview";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  time: string;
  company?: string;
  score?: number;
  status: "completed" | "draft" | "exported";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "cv",
    title: "CV Senior Developer",
    description: "Mise à jour de la section expériences avec nouveaux projets",
    date: "Aujourd'hui",
    time: "14:32",
    score: 92,
    status: "completed",
  },
  {
    id: "2",
    type: "job",
    title: "Analyse offre CTO — TechCo",
    description: "Analyse de compatibilité : 87% de matching",
    date: "Aujourd'hui",
    time: "11:15",
    company: "TechCo",
    score: 87,
    status: "completed",
  },
  {
    id: "3",
    type: "letter",
    title: "Lettre de motivation — TechCo",
    description: "Lettre générée et exportée en PDF",
    date: "Hier",
    time: "16:45",
    company: "TechCo",
    score: 94,
    status: "exported",
  },
  {
    id: "4",
    type: "interview",
    title: "Préparation entretien CTO",
    description: "12 questions générées, 4 réponses complétées",
    date: "Hier",
    time: "10:20",
    company: "TechCo",
    status: "draft",
  },
  {
    id: "5",
    type: "cv",
    title: "CV Manager de Transition",
    description: "Nouveau CV créé à partir du template Moderne",
    date: "Il y a 2j",
    time: "09:10",
    status: "draft",
  },
  {
    id: "6",
    type: "job",
    title: "Analyse offre Lead Dev — DataFlow",
    description: "Score de matching : 72%",
    date: "Il y a 3j",
    time: "15:30",
    company: "DataFlow",
    score: 72,
    status: "completed",
  },
  {
    id: "7",
    type: "letter",
    title: "Lettre de motivation — DataFlow",
    description: "Lettre personnalisée pour Lead Developer",
    date: "Il y a 3j",
    time: "16:00",
    company: "DataFlow",
    score: 88,
    status: "exported",
  },
];

const typeConfig: Record<ActivityType, { icon: typeof FileText; color: string; label: string; bg: string }> = {
  cv: { icon: FileText, color: "text-amber-400", label: "CV", bg: "bg-amber-500/10" },
  job: { icon: Building, color: "text-teal-400", label: "Job Matcher", bg: "bg-teal-500/10" },
  letter: { icon: Mail, color: "text-violet-400", label: "Lettre", bg: "bg-violet-500/10" },
  interview: { icon: Mic, color: "text-blue-400", label: "Entretien", bg: "bg-blue-500/10" },
};

const statusConfig = {
  completed: { label: "Terminé", className: "badge-active" },
  draft: { label: "Brouillon", className: "badge-pending" },
  exported: { label: "Exporté", className: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
};

export function HistoryInterface() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = activities.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || a.type === typeFilter;
    return matchSearch && matchType;
  });

  const grouped = filtered.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main list */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border bg-card/50 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'historique..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-border/60 text-sm"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44 border-border/60 bg-background text-sm">
              <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Type d'activité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="cv">CV</SelectItem>
              <SelectItem value="job">Job Matcher</SelectItem>
              <SelectItem value="letter">Lettres</SelectItem>
              <SelectItem value="interview">Entretiens</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-muted text-muted-foreground border-border text-xs">
            {filtered.length} activités
          </Badge>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">{items.length} activité{items.length > 1 ? "s" : ""}</span>
                </div>

                <div className="space-y-2">
                  {items.map((activity) => {
                    const config = typeConfig[activity.type];
                    const statusCfg = statusConfig[activity.status];
                    const isSelected = selectedId === activity.id;

                    return (
                      <div
                        key={activity.id}
                        className={`card-premium p-4 flex items-center gap-4 cursor-pointer transition-all ${
                          isSelected ? "ring-1 ring-primary/30 border-primary/30" : ""
                        }`}
                        onClick={() => setSelectedId(isSelected ? null : activity.id)}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                          <config.icon className={`w-5 h-5 ${config.color}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium truncate">{activity.title}</span>
                            <Badge className={`text-[10px] flex-shrink-0 ${statusCfg.className}`}>
                              {statusCfg.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          {activity.score && (
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400" />
                                <span className="text-sm font-bold text-amber-400">{activity.score}</span>
                              </div>
                            </div>
                          )}
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </div>
                            {activity.company && (
                              <div className="text-[10px] text-muted-foreground">{activity.company}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={(e) => e.stopPropagation()}>
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={(e) => e.stopPropagation()}>
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Stats sidebar */}
      <div className="w-64 border-l border-border bg-card flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-border">
          <div className="text-sm font-medium">Statistiques</div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Total stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "CV créés", value: "5", icon: FileText, color: "text-amber-400" },
                { label: "Analyses", value: "12", icon: Building, color: "text-teal-400" },
                { label: "Lettres", value: "8", icon: Mail, color: "text-violet-400" },
                { label: "Entretiens", value: "3", icon: Mic, color: "text-blue-400" },
              ].map((stat) => (
                <div key={stat.label} className="card-premium p-3 text-center">
                  <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                  <div className="text-xl font-display font-bold">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* This week */}
            <div className="card-premium p-4">
              <div className="text-xs font-medium mb-3">Cette semaine</div>
              <div className="space-y-2">
                {[
                  { day: "Lun", value: 40 },
                  { day: "Mar", value: 70 },
                  { day: "Mer", value: 55 },
                  { day: "Jeu", value: 90 },
                  { day: "Ven", value: 30 },
                ].map((d) => (
                  <div key={d.day} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-6">{d.day}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${d.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 border-border/60 text-xs justify-start"
              >
                <Download className="w-3.5 h-3.5" />
                Exporter l'historique
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2 text-xs justify-start text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Effacer l'historique
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
