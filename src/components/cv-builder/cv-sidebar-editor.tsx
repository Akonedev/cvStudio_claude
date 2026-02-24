"use client";

import { useCVEditorStore } from "@/store/cv-editor-store";
import { SIDEBAR_THEMES, CV_TEMPLATES, TEMPLATE_CATEGORIES, getTemplateById } from "@/lib/cv-templates";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  PanelLeft, PanelRight, Palette, Maximize2, Columns3, Check,
  LayoutTemplate, Eye, EyeOff, GripVertical
} from "lucide-react";
import { useState } from "react";

// ─── Sidebar width options ──────────────────────────────────────────────────
const SIDEBAR_WIDTHS = [
  { id: "narrow" as const, label: "Étroite", size: "160px" },
  { id: "medium" as const, label: "Moyenne", size: "190px" },
  { id: "wide" as const, label: "Large", size: "220px" },
];

// ─── Sidebar element options ────────────────────────────────────────────────
const SIDEBAR_ELEMENTS = [
  { id: "photo", label: "Photo de profil" },
  { id: "contact", label: "Informations de contact" },
  { id: "skills", label: "Compétences" },
  { id: "languages", label: "Langues" },
  { id: "hobbies", label: "Centres d'intérêt" },
  { id: "social", label: "Liens sociaux" },
];

export function CVSidebarEditor() {
  const {
    sidebarConfig, setSidebarConfig,
    headerConfig, setHeaderConfig,
    template, setTemplate,
    sections, setSectionInSidebar,
  } = useCVEditorStore();

  const [activeCategory, setActiveCategory] = useState("all");

  const currentTemplate = getTemplateById(template);

  // Filter templates by category
  const filteredTemplates = activeCategory === "all"
    ? CV_TEMPLATES
    : CV_TEMPLATES.filter((t) => t.category === activeCategory);

  // Sections that can be placed in sidebar
  const assignableSections = sections.filter((s) => s.enabled);

  return (
    <div className="space-y-5 p-4 text-sm overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* ─── Template Selection ──────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4" />
          Modèle de CV
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Sélectionnez un modèle. Les paramètres s&apos;adaptent automatiquement.
        </p>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1 mb-3">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium transition-colors",
                activeCategory === cat.id
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTemplate(t.id);
                // Apply template defaults to sidebar config
                setSidebarConfig({
                  enabled: t.hasSidebar,
                  theme: t.sidebarColor === "transparent" ? "classic-dark" :
                    SIDEBAR_THEMES.find((s) => s.color === t.sidebarColor)?.id ?? "classic-dark",
                  width: t.sidebarWidth,
                  fullHeight: t.sidebarFullHeight,
                });
                setHeaderConfig({ style: t.headerStyle });
              }}
              className={cn(
                "relative rounded-lg border-2 p-2 transition-all text-left",
                template === t.id
                  ? "border-amber-500 ring-2 ring-amber-200 dark:ring-amber-800"
                  : "border-border hover:border-border/80"
              )}
            >
              {/* Template preview thumbnail */}
              <div className={cn("w-full h-12 rounded mb-1.5 flex overflow-hidden", t.preview)}>
                {t.hasSidebar && (
                  <div
                    className="h-full"
                    style={{
                      width: t.sidebarWidth === "narrow" ? "30%" : t.sidebarWidth === "wide" ? "40%" : "35%",
                      backgroundColor: t.sidebarColor === "transparent" ? "#f4f4f5" : t.sidebarColor,
                    }}
                  />
                )}
                <div className="flex-1 p-1">
                  <div className="h-1 w-3/4 rounded-full bg-muted-foreground/20 mb-0.5" />
                  <div className="h-0.5 w-1/2 rounded-full bg-muted-foreground/15" />
                </div>
              </div>
              <div className="text-xs font-medium text-foreground truncate">
                {t.name}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">{t.description}</div>
              {template === t.id && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      <Separator />

      {/* ─── Sidebar Toggle ──────────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Columns3 className="h-4 w-4" />
          Sidebar
        </h3>

        <div className="space-y-3">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sidebar-toggle" className="text-xs">Activer la sidebar</Label>
            <Switch
              id="sidebar-toggle"
              checked={sidebarConfig.enabled}
              onCheckedChange={(v) => setSidebarConfig({ enabled: v })}
            />
          </div>

          {sidebarConfig.enabled && (
            <>
              {/* Position */}
              <div>
                <Label className="text-xs mb-1.5 block">Position</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSidebarConfig({ position: "left" })}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors",
                      sidebarConfig.position === "left"
                        ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    <PanelLeft className="h-3.5 w-3.5" /> Gauche
                  </button>
                  <button
                    onClick={() => setSidebarConfig({ position: "right" })}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors",
                      sidebarConfig.position === "right"
                        ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    <PanelRight className="h-3.5 w-3.5" /> Droite
                  </button>
                </div>
              </div>

              {/* Full height */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="h-3 w-3 text-muted-foreground" />
                  <Label htmlFor="full-height" className="text-xs">Pleine hauteur</Label>
                </div>
                <Switch
                  id="full-height"
                  checked={sidebarConfig.fullHeight}
                  onCheckedChange={(v) => setSidebarConfig({ fullHeight: v })}
                />
              </div>

              {/* Width */}
              <div>
                <Label className="text-xs mb-1.5 block">Largeur</Label>
                <div className="flex gap-1.5">
                  {SIDEBAR_WIDTHS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSidebarConfig({ width: w.id })}
                      className={cn(
                        "flex-1 px-2 py-1 rounded text-xs font-medium border transition-colors",
                        sidebarConfig.width === w.id
                          ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <Label className="text-xs mb-1.5 block flex items-center gap-1.5">
                  <Palette className="h-3 w-3" /> Thème de couleur
                </Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {SIDEBAR_THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSidebarConfig({ theme: t.id })}
                      title={t.name}
                      className={cn(
                        "w-full aspect-square rounded-md border-2 transition-all relative",
                        sidebarConfig.theme === t.id
                          ? "border-amber-500 ring-1 ring-amber-300"
                          : "border-transparent hover:border-border"
                      )}
                      style={{ backgroundColor: t.color }}
                    >
                      {sidebarConfig.theme === t.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className={cn(
                            "h-3 w-3",
                            t.color === "#F4F4F5" || t.color === "#FAFAF9" ? "text-stone-800" : "text-white"
                          )} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Header in sidebar */}
              <div className="flex items-center justify-between">
                <Label htmlFor="header-in-sidebar" className="text-xs">
                  Nom / Titre dans la sidebar
                </Label>
                <Switch
                  id="header-in-sidebar"
                  checked={headerConfig.inSidebar}
                  onCheckedChange={(v) => setHeaderConfig({ inSidebar: v })}
                />
              </div>

              <Separator className="my-2" />

              {/* ─── Sidebar Elements ──────────────────────────────────────── */}
              <div>
                <Label className="text-xs mb-2 block font-semibold">Éléments à afficher</Label>
                <div className="space-y-2">
                  {SIDEBAR_ELEMENTS.map((el) => (
                    <div key={el.id} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{el.label}</span>
                      <Switch
                        checked={sidebarConfig.elements[el.id] ?? false}
                        onCheckedChange={(v) =>
                          setSidebarConfig({
                            elements: { ...sidebarConfig.elements, [el.id]: v }
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-2" />

              {/* ─── Sections → Sidebar assignment ─────────────────────────── */}
              <div>
                <Label className="text-xs mb-2 block font-semibold">
                  Sections dans la sidebar
                </Label>
                <p className="text-[10px] text-muted-foreground mb-2">
                  Cochez les sections à placer dans la sidebar plutôt que dans la zone principale.
                </p>
                <div className="space-y-1.5">
                  {assignableSections.map((sec) => (
                    <div
                      key={sec.id}
                      className={cn(
                        "flex items-center justify-between px-2 py-1 rounded-md transition-colors",
                        sec.inSidebar
                          ? "bg-amber-50 dark:bg-amber-900/20"
                        : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{sec.icon}</span>
                        <span className="text-xs text-foreground">{sec.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-[9px] px-1">
                          {sec.inSidebar ? "Sidebar" : "Principal"}
                        </Badge>
                        <Switch
                          checked={sec.inSidebar}
                          onCheckedChange={(v) => setSectionInSidebar(sec.id, v)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
