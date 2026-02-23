"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload, FileText, Sparkles, Check, ChevronRight,
  ChevronLeft, AlertCircle, Loader2, X, FileJson,
  AlignLeft, Wand2, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedCVData {
  title?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  template?: string;
  hasSidebar?: boolean;
  sidebarPos?: "LEFT" | "RIGHT";
  sidebarTheme?: string;
  data?: Record<string, unknown>;
  detectedTemplate?: boolean; // true if template was detected from the file
}

// ─── Templates ────────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Épuré, minimaliste",
    accent: "bg-amber-500",
    sidebar: false,
  },
  {
    id: "classic-dark",
    name: "Classic Dark",
    description: "Colonne sombre élégante",
    accent: "bg-stone-800",
    sidebar: true,
  },
  {
    id: "navy-pro",
    name: "Navy Pro",
    description: "Professionnel, marine",
    accent: "bg-slate-700",
    sidebar: true,
  },
  {
    id: "forest",
    name: "Forest",
    description: "Nature & sobriété",
    accent: "bg-emerald-800",
    sidebar: true,
  },
  {
    id: "burgundy",
    name: "Burgundy",
    description: "Élégance & raffinement",
    accent: "bg-rose-900",
    sidebar: true,
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Sombre & moderne",
    accent: "bg-indigo-900",
    sidebar: true,
  },
];

// ─── Text parser — extracts basic info from plain text ────────────────────────

function parseTextCV(text: string): ParsedCVData {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  // Phone
  const phoneMatch = text.match(/(?:\+?\d[\d\s.\-()]{7,}\d)/);
  // First non-empty line as name
  const name = lines[0] ?? "";

  // Summary: look for block after "profil", "résumé", "about", "summary"
  const summaryTriggerIdx = lines.findIndex((l) =>
    /^(profil|résumé|resume|about|summary|à propos)/i.test(l)
  );
  const summary =
    summaryTriggerIdx >= 0 ? lines[summaryTriggerIdx + 1] ?? "" : "";

  return {
    title: name ? `CV de ${name}` : "CV importé",
    name,
    email: emailMatch?.[0] ?? "",
    phone: phoneMatch?.[0] ?? "",
    summary,
    template: "modern",
    detectedTemplate: false,
    data: {
      personal: {
        name,
        email: emailMatch?.[0] ?? "",
        phone: phoneMatch?.[0] ?? "",
        summary,
      },
      raw: text,
    },
  };
}

// ─── JSON parser ──────────────────────────────────────────────────────────────

function parseJsonCV(json: unknown): ParsedCVData & { valid: true } | { valid: false; error: string } {
  if (typeof json !== "object" || json === null) {
    return { valid: false, error: "Le JSON n'est pas un objet valide" };
  }

  const obj = json as Record<string, unknown>;

  // Support both CV Studio format and generic formats
  const data = (obj.data as Record<string, unknown>) ?? obj;
  const personal = (data.personal as Record<string, unknown>) ?? {};

  const name =
    (personal.name as string) ??
    (obj.name as string) ??
    (personal.firstName && personal.lastName
      ? `${personal.firstName} ${personal.lastName}`
      : "");

  const template =
    (obj.template as string) ??
    (obj.templateId as string) ??
    "modern";

  const sidebarPos = (obj.sidebarPos as "LEFT" | "RIGHT") ?? undefined;

  return {
    valid: true,
    title: (obj.title as string) ?? (name ? `CV de ${name}` : "CV importé"),
    name,
    email: (personal.email as string) ?? (obj.email as string) ?? "",
    phone: (personal.phone as string) ?? (obj.phone as string) ?? "",
    location: (personal.location as string) ?? (obj.location as string) ?? "",
    summary: (personal.summary as string) ?? (obj.summary as string) ?? "",
    template,
    hasSidebar: (obj.hasSidebar as boolean) ?? false,
    sidebarPos,
    sidebarTheme: (obj.sidebarTheme as string) ?? undefined,
    detectedTemplate: true,
    data: data as Record<string, unknown>,
  };
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDot({ step, current, label }: { step: number; current: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
          done && "bg-emerald-500 text-white",
          active && "bg-amber-500 text-white ring-2 ring-amber-500/30",
          !done && !active && "bg-muted text-muted-foreground"
        )}
      >
        {done ? <Check className="w-3.5 h-3.5" /> : step}
      </div>
      <span className={cn("text-xs font-medium hidden sm:block", active ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ImportCVDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ImportCVDialog({ open, onOpenChange }: ImportCVDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [inputTab, setInputTab] = useState<"file" | "paste">("file");

  // Parsed data
  const [parsed, setParsed] = useState<ParsedCVData | null>(null);
  const [cvTitle, setCvTitle] = useState("");
  const [keepImportedStyle, setKeepImportedStyle] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setStep(1);
    setIsDragging(false);
    setIsProcessing(false);
    setIsSaving(false);
    setParseError(null);
    setPastedText("");
    setInputTab("file");
    setParsed(null);
    setCvTitle("");
    setKeepImportedStyle(true);
    setSelectedTemplate("modern");
  }, []);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  // ── File parsing ──────────────────────────────────────────────────────────

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setParseError(null);

    try {
      const text = await file.text();
      let result: ParsedCVData;

      if (file.name.endsWith(".json") || file.type === "application/json") {
        const json = JSON.parse(text);
        const r = parseJsonCV(json);
        if (!r.valid) {
          setParseError(r.error);
          setIsProcessing(false);
          return;
        }
        result = r;
      } else {
        // .txt, .md, .pdf (text fallback), etc.
        result = parseTextCV(text);
      }

      applyParsed(result);
    } catch {
      setParseError("Impossible de lire ce fichier. Essayez un fichier JSON ou texte.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processPastedText = useCallback(() => {
    if (!pastedText.trim()) {
      setParseError("Veuillez coller du texte avant de continuer.");
      return;
    }
    const result = parseTextCV(pastedText);
    applyParsed(result);
  }, [pastedText]);

  const applyParsed = (result: ParsedCVData) => {
    setParsed(result);
    setCvTitle(result.title ?? "CV importé");
    setSelectedTemplate(result.template ?? "modern");
    setKeepImportedStyle(result.detectedTemplate === true);
    setStep(2);
  };

  // ── Drag & drop ───────────────────────────────────────────────────────────

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!parsed) return;
    setIsSaving(true);

    const templateToUse =
      keepImportedStyle && parsed.detectedTemplate ? parsed.template : selectedTemplate;

    const body = {
      title: cvTitle || "CV importé",
      template: templateToUse ?? "modern",
      hasSidebar: keepImportedStyle && parsed.detectedTemplate ? parsed.hasSidebar : TEMPLATES.find((t) => t.id === templateToUse)?.sidebar ?? false,
      sidebarPos: keepImportedStyle && parsed.hasSidebar ? (parsed.sidebarPos ?? "LEFT") : "LEFT",
      sidebarTheme: keepImportedStyle ? parsed.sidebarTheme : undefined,
      data: {
        ...(parsed.data ?? {}),
        personal: {
          name: parsed.name ?? "",
          email: parsed.email ?? "",
          phone: parsed.phone ?? "",
          location: parsed.location ?? "",
          summary: parsed.summary ?? "",
        },
        importedAt: new Date().toISOString(),
      },
    };

    try {
      const res = await fetch("/api/cvs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Erreur lors de l'import");
        setIsSaving(false);
        return;
      }

      toast.success("CV importé avec succès !");
      handleClose();
      router.push(`/dashboard/cv-builder/${json.data.id}`);
      router.refresh();
    } catch {
      toast.error("Erreur réseau lors de l'import");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Upload className="w-5 h-5 text-amber-400" />
              Importer un CV existant
            </DialogTitle>
            <DialogDescription>
              Importez votre CV depuis un fichier ou en collant son contenu pour l&apos;éditer et l&apos;améliorer.
            </DialogDescription>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-3 mt-5 pb-5">
            <StepDot step={1} current={step} label="Source" />
            <div className="flex-1 h-px bg-border" />
            <StepDot step={2} current={step} label="Style & Template" />
            <div className="flex-1 h-px bg-border" />
            <StepDot step={3} current={step} label="Confirmation" />
          </div>

          <Separator />
        </div>

        {/* Body */}
        <div className="px-6 py-5 min-h-[340px]">
          <AnimatePresence mode="wait">

            {/* ── Step 1 : Upload ──────────────────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="space-y-4"
              >
                <Tabs value={inputTab} onValueChange={(v) => setInputTab(v as "file" | "paste")}>
                  <TabsList className="w-full">
                    <TabsTrigger value="file" className="flex-1 gap-2">
                      <FileText className="w-4 h-4" />Fichier
                    </TabsTrigger>
                    <TabsTrigger value="paste" className="flex-1 gap-2">
                      <AlignLeft className="w-4 h-4" />Coller du texte
                    </TabsTrigger>
                  </TabsList>

                  {/* ── File upload ── */}
                  <TabsContent value="file" className="mt-4">
                    <div
                      className={cn(
                        "relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all",
                        isDragging
                          ? "border-amber-500 bg-amber-500/5"
                          : "border-border/60 hover:border-amber-500/40 hover:bg-muted/40"
                      )}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,.txt,.md"
                        className="hidden"
                        onChange={handleFileSelect}
                      />

                      {isProcessing ? (
                        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                            <Upload className="w-7 h-7 text-amber-400" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-sm">
                              Glissez-déposez votre CV ici
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              ou cliquez pour sélectionner
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="gap-1.5 text-[10px]">
                              <FileJson className="w-3 h-3" /> JSON
                            </Badge>
                            <Badge variant="outline" className="gap-1.5 text-[10px]">
                              <FileText className="w-3 h-3" /> TXT
                            </Badge>
                            <Badge variant="outline" className="gap-1.5 text-[10px]">
                              <FileText className="w-3 h-3" /> MD
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground/70 text-center max-w-xs">
                            💡 Pour un import parfait, exportez d&apos;abord votre CV depuis CV Studio en format JSON.
                          </p>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  {/* ── Paste text ── */}
                  <TabsContent value="paste" className="mt-4 space-y-3">
                    <Textarea
                      placeholder="Collez ici le contenu de votre CV (nom, e-mail, téléphone, expériences, formations…)"
                      className="min-h-[200px] resize-none text-sm font-mono"
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      <Sparkles className="inline w-3 h-3 mr-1 text-amber-400" />
                      L&apos;IA extraira automatiquement les informations clés (nom, e-mail, téléphone, résumé…)
                    </p>
                    <Button
                      className="w-full btn-gradient"
                      onClick={processPastedText}
                      disabled={!pastedText.trim() || isProcessing}
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                      Analyser le texte
                    </Button>
                  </TabsContent>
                </Tabs>

                {parseError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {parseError}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── Step 2 : Style & Template ────────────────────────────────── */}
            {step === 2 && parsed && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="space-y-5"
              >
                {/* Detected info summary */}
                <div className="flex items-start gap-3 bg-muted/40 rounded-xl p-4 border border-border/50">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">CV analysé avec succès</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {[parsed.name, parsed.email, parsed.phone].filter(Boolean).join(" · ") || "Informations extraites"}
                    </p>
                  </div>
                  {parsed.detectedTemplate && (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] flex-shrink-0">
                      Style détecté
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Titre du CV</Label>
                  <Input
                    value={cvTitle}
                    onChange={(e) => setCvTitle(e.target.value)}
                    placeholder="Mon CV Senior Developer…"
                    className="text-sm"
                  />
                </div>

                {/* Keep imported style (only when detected) */}
                {parsed.detectedTemplate && (
                  <div
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                      keepImportedStyle
                        ? "border-amber-500/50 bg-amber-500/5"
                        : "border-border/50 hover:border-border"
                    )}
                    onClick={() => setKeepImportedStyle(!keepImportedStyle)}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        keepImportedStyle
                          ? "border-amber-500 bg-amber-500"
                          : "border-muted-foreground/40"
                      )}
                    >
                      {keepImportedStyle && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Conserver le style importé</p>
                      <p className="text-xs text-muted-foreground">
                        Template : <span className="font-medium text-amber-400">{parsed.template}</span>
                        {parsed.hasSidebar && " · Barre latérale"}{" "}
                        {parsed.sidebarPos && `(${parsed.sidebarPos.toLowerCase()})`}
                      </p>
                    </div>
                    <Sparkles className="w-4 h-4 text-amber-400 ml-auto flex-shrink-0" />
                  </div>
                )}

                {/* Template picker (shown when not keeping imported style or no detected template) */}
                {(!parsed.detectedTemplate || !keepImportedStyle) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Choisir un template</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {TEMPLATES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTemplate(t.id)}
                          className={cn(
                            "relative flex flex-col items-start p-3 rounded-xl border text-left transition-all",
                            selectedTemplate === t.id
                              ? "border-amber-500/60 bg-amber-500/5 ring-1 ring-amber-500/30"
                              : "border-border/50 hover:border-border bg-card"
                          )}
                        >
                          <div className={cn("w-8 h-8 rounded-lg mb-2", t.accent)} />
                          <span className="text-xs font-semibold block">{t.name}</span>
                          <span className="text-[10px] text-muted-foreground">{t.description}</span>
                          {selectedTemplate === t.id && (
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 3 : Confirm ─────────────────────────────────────────── */}
            {step === 3 && parsed && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="space-y-4"
              >
                <div className="bg-muted/30 rounded-xl border border-border/50 overflow-hidden">
                  {/* CV summary preview */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Récapitulatif</span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setStep(2)}>
                        <Eye className="w-3.5 h-3.5" />Modifier
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground block">Titre</span>
                        <span className="font-medium truncate block">{cvTitle || "CV importé"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Template</span>
                        <span className="font-medium capitalize block">
                          {keepImportedStyle && parsed.detectedTemplate
                            ? parsed.template
                            : selectedTemplate}
                        </span>
                      </div>
                      {parsed.name && (
                        <div>
                          <span className="text-xs text-muted-foreground block">Nom</span>
                          <span className="font-medium">{parsed.name}</span>
                        </div>
                      )}
                      {parsed.email && (
                        <div>
                          <span className="text-xs text-muted-foreground block">E-mail</span>
                          <span className="font-medium truncate block">{parsed.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Style info */}
                  <div className="px-4 py-3 flex items-center gap-2.5 bg-amber-500/5">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      {keepImportedStyle && parsed.detectedTemplate
                        ? `Le style original sera conservé (${parsed.template}${parsed.hasSidebar ? " avec barre latérale" : ""}).`
                        : `Le template "${selectedTemplate}" sera appliqué. Vous pourrez le modifier après import.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
                  Après import, vous pourrez éditer toutes les sections, ajuster le style et générer une version optimisée ATS.
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (step === 1) handleClose();
              else setStep((s) => (s - 1) as 1 | 2 | 3);
            }}
            disabled={isSaving}
          >
            {step === 1 ? (
              <><X className="w-4 h-4 mr-1.5" />Annuler</>
            ) : (
              <><ChevronLeft className="w-4 h-4 mr-1.5" />Retour</>
            )}
          </Button>

          {step < 3 && (
            <Button
              className="btn-gradient gap-1.5"
              size="sm"
              disabled={step === 1 || !parsed}
              onClick={() => setStep((s) => (s + 1) as 2 | 3)}
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          {step === 3 && (
            <Button
              className="btn-gradient gap-1.5"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1.5" />
              )}
              Importer & éditer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
