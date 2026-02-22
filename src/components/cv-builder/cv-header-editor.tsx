"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const headerTemplates = [
  { id: "classic", name: "Classic", accent: "bg-amber-500" },
  { id: "modern", name: "Modern", accent: "bg-teal-500" },
  { id: "minimal", name: "Minimal", accent: "bg-stone-400" },
  { id: "bold", name: "Bold", accent: "bg-stone-900" },
  { id: "gradient", name: "Gradient", accent: "bg-gradient-to-r from-amber-400 to-rose-400" },
  { id: "split", name: "Split", accent: "bg-slate-700" },
];

export function CVHeaderEditor() {
  return (
    <div className="space-y-5">
      {/* Header templates */}
      <div>
        <Label className="text-sm font-medium block mb-3">Modèle d'en-tête</Label>
        <div className="grid grid-cols-3 gap-2">
          {headerTemplates.map((tmpl) => (
            <button key={tmpl.id} className="group flex flex-col items-center gap-1.5">
              <div className="w-full aspect-[2/1] bg-white rounded-lg border-2 border-transparent group-hover:border-amber-500/50 transition-all overflow-hidden p-1">
                <div className={`w-full h-1.5 ${tmpl.accent} rounded-sm mb-1`} />
                <div className="h-1 bg-stone-200 rounded w-2/3 mb-0.5" />
                <div className="h-0.5 bg-stone-100 rounded w-1/2" />
              </div>
              <span className="text-[10px] text-muted-foreground">{tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Content fields */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Contenu de l'en-tête</Label>
        {[
          { label: "Nom complet", placeholder: "Jean Dupont", enabled: true },
          { label: "Titre / Poste", placeholder: "Senior Developer", enabled: true },
          { label: "Email", placeholder: "jean@example.com", enabled: true },
          { label: "Téléphone", placeholder: "+33 6 ...", enabled: true },
          { label: "Adresse", placeholder: "Paris, France", enabled: true },
          { label: "LinkedIn", placeholder: "linkedin.com/in/...", enabled: false },
          { label: "GitHub", placeholder: "github.com/...", enabled: false },
          { label: "Site web", placeholder: "https://...", enabled: false },
        ].map((field) => (
          <div key={field.label} className="flex items-center gap-2">
            <Switch defaultChecked={field.enabled} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">{field.label}</div>
              <Input
                placeholder={field.placeholder}
                className="h-7 text-xs bg-background border-border/60"
              />
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Photo */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Photo de profil</Label>
          <p className="text-xs text-muted-foreground">Ajouter dans l'en-tête</p>
        </div>
        <Switch />
      </div>
    </div>
  );
}
