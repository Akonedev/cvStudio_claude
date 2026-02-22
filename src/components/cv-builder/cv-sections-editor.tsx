"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, ChevronDown, ChevronUp, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

const availableSections = [
  { id: "summary", label: "Profil / Résumé", icon: "📝", enabled: true },
  { id: "experience", label: "Expérience pro.", icon: "💼", enabled: true },
  { id: "education", label: "Formation", icon: "🎓", enabled: true },
  { id: "skills", label: "Compétences", icon: "⚡", enabled: true },
  { id: "languages", label: "Langues", icon: "🌐", enabled: true },
  { id: "certifications", label: "Certifications", icon: "🏆", enabled: false },
  { id: "projects", label: "Projets", icon: "🚀", enabled: false },
  { id: "volunteering", label: "Bénévolat", icon: "🤝", enabled: false },
  { id: "publications", label: "Publications", icon: "📚", enabled: false },
  { id: "awards", label: "Distinctions", icon: "🥇", enabled: false },
  { id: "hobbies", label: "Loisirs", icon: "🎯", enabled: false },
  { id: "references", label: "Références", icon: "👥", enabled: false },
];

export function CVSectionsEditor() {
  const [sections, setSections] = useState(availableSections);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const enabledSections = sections.filter(s => s.enabled);
  const disabledSections = sections.filter(s => !s.enabled);

  return (
    <div className="space-y-5">
      {/* Active sections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Sections actives</span>
          <Badge variant="outline" className="text-[10px]">{enabledSections.length}</Badge>
        </div>
        <div className="space-y-1.5">
          {enabledSections.map((section) => (
            <div
              key={section.id}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/50 group hover:border-border transition-colors"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
              <span className="text-sm">{section.icon}</span>
              <span className="text-xs font-medium flex-1">{section.label}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-muted-foreground hover:text-foreground"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-muted-foreground hover:text-red-400"
                  onClick={() => toggleSection(section.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add sections */}
      <div>
        <div className="text-sm font-medium mb-3">Ajouter une section</div>
        <div className="grid grid-cols-1 gap-1.5">
          {disabledSections.map((section) => (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-border/60 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group text-left"
            >
              <div className="w-6 h-6 rounded border border-dashed border-border/60 group-hover:border-amber-500/40 flex items-center justify-center flex-shrink-0">
                <Plus className="w-3 h-3 text-muted-foreground group-hover:text-amber-400" />
              </div>
              <span className="text-sm">{section.icon}</span>
              <span className="text-xs text-muted-foreground group-hover:text-foreground">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
