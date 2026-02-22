"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PanelLeft, PanelRight, Check } from "lucide-react";

const sidebarTemplates = [
  { id: "classic-dark", name: "Classic Dark", preview: "bg-stone-900" },
  { id: "navy-pro", name: "Navy Pro", preview: "bg-slate-800" },
  { id: "forest", name: "Forest", preview: "bg-emerald-900" },
  { id: "burgundy", name: "Burgundy", preview: "bg-rose-900" },
  { id: "midnight", name: "Midnight", preview: "bg-indigo-900" },
  { id: "charcoal", name: "Charcoal", preview: "bg-zinc-800" },
];

interface CVSidebarEditorProps {
  showSidebar: boolean;
  setShowSidebar: (v: boolean) => void;
  sidebarPosition: "left" | "right";
  setSidebarPosition: (v: "left" | "right") => void;
}

export function CVSidebarEditor({ 
  showSidebar, setShowSidebar, sidebarPosition, setSidebarPosition 
}: CVSidebarEditorProps) {
  return (
    <div className="space-y-5">
      {/* Show/hide sidebar */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Barre latérale</Label>
          <p className="text-xs text-muted-foreground">Afficher une colonne latérale</p>
        </div>
        <Switch checked={showSidebar} onCheckedChange={setShowSidebar} />
      </div>

      {showSidebar && (
        <>
          <Separator />
          
          {/* Position */}
          <div>
            <Label className="text-sm font-medium block mb-3">Position</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["left", "right"] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSidebarPosition(pos)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    sidebarPosition === pos
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                      : "border-border bg-muted hover:border-border/80 text-muted-foreground"
                  }`}
                >
                  {pos === "left" ? <PanelLeft className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
                  {pos === "left" ? "Gauche" : "Droite"}
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div>
            <Label className="text-sm font-medium block mb-3">Style de sidebar</Label>
            <div className="grid grid-cols-3 gap-2">
              {sidebarTemplates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <div className={`w-full aspect-[1/1.4] ${tmpl.preview} rounded-lg border-2 border-transparent group-hover:border-amber-500/50 transition-all flex items-center justify-center relative`}>
                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-white/5 m-1 rounded" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{tmpl.name}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sidebar content */}
          <div>
            <Label className="text-sm font-medium block mb-3">Éléments de la sidebar</Label>
            <div className="space-y-2">
              {["Photo", "Coordonnées", "Compétences", "Langues", "Centres d'intérêt", "Réseaux sociaux"].map((el) => (
                <div key={el} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <span className="text-xs">{el}</span>
                  <Switch defaultChecked={["Photo", "Coordonnées", "Compétences", "Langues"].includes(el)} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
