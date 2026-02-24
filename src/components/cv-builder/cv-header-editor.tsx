"use client";

import { useCVEditorStore, type PersonalInfo } from "@/store/cv-editor-store";
import { HEADER_STYLES } from "@/lib/cv-templates";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  User, Mail, Phone, MapPin, Linkedin, Github, Globe, Camera,
  AlignLeft, AlignCenter, Check, PanelLeft
} from "lucide-react";

// ─── Header field definitions ───────────────────────────────────────────────
const HEADER_FIELDS: {
  key: keyof PersonalInfo;
  label: string;
  icon: React.ElementType;
  placeholder: string;
  configKey?: string;
}[] = [
  { key: "firstName", label: "Prénom", icon: User, placeholder: "Jean" },
  { key: "lastName", label: "Nom", icon: User, placeholder: "Dupont" },
  { key: "jobTitle", label: "Titre", icon: AlignLeft, placeholder: "Développeur Full Stack" },
  { key: "email", label: "Email", icon: Mail, placeholder: "jean@example.com", configKey: "showEmail" },
  { key: "phone", label: "Téléphone", icon: Phone, placeholder: "+33 6 12 34 56 78", configKey: "showPhone" },
  { key: "address", label: "Adresse / Ville", icon: MapPin, placeholder: "Paris, France", configKey: "showAddress" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "linkedin.com/in/jean", configKey: "showLinkedin" },
  { key: "github", label: "GitHub", icon: Github, placeholder: "github.com/jean", configKey: "showGithub" },
  { key: "website", label: "Site web", icon: Globe, placeholder: "https://jean.dev", configKey: "showWebsite" },
];

// ─── Photo position options ─────────────────────────────────────────────────
const PHOTO_POSITIONS = [
  { id: "left" as const, label: "Gauche" },
  { id: "center" as const, label: "Centre" },
  { id: "right" as const, label: "Droite" },
];

export function CVHeaderEditor() {
  const {
    data, headerConfig, setHeaderConfig, updatePersonalInfo
  } = useCVEditorStore();

  const { personalInfo } = data;

  return (
    <div className="space-y-5 p-4 text-sm overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* ─── Header Style ────────────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-foreground mb-2">
          Style d&apos;en-tête
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {HEADER_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setHeaderConfig({ style: style.id })}
              className={cn(
                "flex flex-col items-start px-2.5 py-2 rounded-md border text-left transition-all",
                headerConfig.style === style.id
                  ? "bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700"
                  : "border-border hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="text-xs font-medium text-foreground">{style.name}</span>
                {headerConfig.style === style.id && (
                  <Check className="h-3 w-3 text-amber-500 ml-auto" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5">{style.description}</span>
            </button>
          ))}
        </div>
      </section>

      <Separator />

      {/* ─── Photo Config ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground flex items-center gap-1.5">
            <Camera className="h-4 w-4" /> Photo
          </h3>
          <Switch
            checked={headerConfig.showPhoto}
            onCheckedChange={(v) => setHeaderConfig({ showPhoto: v })}
          />
        </div>
        {headerConfig.showPhoto && (
          <div>
            <Label className="text-xs mb-1.5 block">Position</Label>
            <div className="flex gap-1.5">
              {PHOTO_POSITIONS.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setHeaderConfig({ photoPosition: pos.id })}
                  className={cn(
                    "flex-1 px-2 py-1 rounded text-xs border transition-colors",
                    headerConfig.photoPosition === pos.id
                      ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <Separator />

      {/* ─── In Sidebar Toggle ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PanelLeft className="h-3.5 w-3.5 text-muted-foreground" />
            <Label htmlFor="header-sidebar" className="text-xs font-semibold">
              Infos perso dans la sidebar
            </Label>
          </div>
          <Switch
            id="header-sidebar"
            checked={headerConfig.inSidebar}
            onCheckedChange={(v) => setHeaderConfig({ inSidebar: v })}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Si activé, le nom, titre et contacts seront dans la sidebar (pas de doublon dans l&apos;en-tête).
        </p>
      </section>

      <Separator />

      {/* ─── Visibility toggles ──────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-foreground mb-2">
          Éléments visibles
        </h3>
        <div className="space-y-2">
          {[
            { key: "showName", label: "Nom complet" },
            { key: "showTitle", label: "Titre professionnel" },
            { key: "showEmail", label: "Email" },
            { key: "showPhone", label: "Téléphone" },
            { key: "showAddress", label: "Adresse" },
            { key: "showLinkedin", label: "LinkedIn" },
            { key: "showGithub", label: "GitHub" },
            { key: "showWebsite", label: "Site web" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <Switch
                checked={(headerConfig as unknown as Record<string, unknown>)[item.key] as boolean}
                onCheckedChange={(v) =>
                  setHeaderConfig({ [item.key]: v } as Partial<typeof headerConfig>)
                }
              />
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ─── Personal info fields ────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-foreground mb-3">
          Informations personnelles
        </h3>
        <div className="space-y-3">
          {HEADER_FIELDS.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key}>
                <Label className="text-xs mb-1 block flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  {field.label}
                </Label>
                <Input
                  value={personalInfo[field.key]}
                  onChange={(e) => updatePersonalInfo(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="h-8 text-xs"
                />
              </div>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* ─── Summary ─────────────────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-foreground mb-2">
          Profil / Résumé
        </h3>
        <textarea
          value={data.summary}
          onChange={(e) => useCVEditorStore.getState().setSummary(e.target.value)}
          placeholder="Décrivez votre profil professionnel en quelques lignes..."
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
        />
      </section>
    </div>
  );
}
