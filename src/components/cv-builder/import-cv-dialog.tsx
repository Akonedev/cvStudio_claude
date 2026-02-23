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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload, FileText, Sparkles, Check, ChevronRight,
  ChevronLeft, AlertCircle, Loader2, X, FileJson,
  AlignLeft, Wand2, Eye, File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CV_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/cv-templates";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedCVData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  jobTitle: string;
  summary: string;
  skills: string[];
  languages: Array<{ name: string; level: string }>;
  experience: Array<{
    position: string; company: string; period: string;
    description: string; bullets: string[];
  }>;
  education: Array<{
    degree: string; institution: string; period: string; description: string;
  }>;
  certifications: Array<{ name: string; issuer: string; date: string }>;
}

const ACCEPTED_FORMATS = ".pdf,.docx,.doc,.txt,.md,.json";
const FORMAT_LABELS = [
  { ext: "PDF", icon: FileText, color: "text-red-400" },
  { ext: "DOCX", icon: File, color: "text-blue-400" },
  { ext: "DOC", icon: File, color: "text-blue-500" },
  { ext: "TXT", icon: FileText, color: "text-stone-400" },
  { ext: "JSON", icon: FileJson, color: "text-amber-400" },
];

function StepDot({ step, current, label }: { step: number; current: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
        done && "bg-emerald-500 text-white",
        active && "bg-amber-500 text-white ring-2 ring-amber-500/30",
        !done && !active && "bg-muted text-muted-foreground",
      )}>
        {done ? <Check className="w-3.5 h-3.5" /> : step}
      </div>
      <span className={cn("text-xs font-medium hidden sm:block", active ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface ImportCVDialogProps { open: boolean; onOpenChange: (v: boolean) => void }

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
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [parsed, setParsed] = useState<ParsedCVData | null>(null);
  const [cvTitle, setCvTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic-dark");
  const [templateCategory, setTemplateCategory] = useState("all");

  const reset = useCallback(() => {
    setStep(1); setIsDragging(false); setIsProcessing(false); setIsSaving(false);
    setParseError(null); setPastedText(""); setInputTab("file");
    setFileName(""); setFileType(""); setFileSize(0);
    setParsed(null); setCvTitle(""); setSelectedTemplate("classic-dark"); setTemplateCategory("all");
  }, []);

  const handleClose = () => { reset(); onOpenChange(false); };

  // ── Server-side file parsing ──────────────────────────────────────────────
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setParseError(null);
    setFileName(file.name);
    setFileSize(file.size);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cvs/parse", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setParseError(json.error ?? "Erreur lors de l'analyse du fichier");
        setIsProcessing(false);
        return;
      }

      setFileType(json.data.fileType);
      applyParsed(json.data.parsed as ParsedCVData);
    } catch {
      setParseError("Impossible de lire ce fichier. Vérifiez le format et réessayez.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processPastedText = useCallback(async () => {
    if (!pastedText.trim()) { setParseError("Veuillez coller du texte."); return; }
    setIsProcessing(true);
    const blob = new Blob([pastedText], { type: "text/plain" });
    const file = new globalThis.File([blob], "pasted.txt", { type: "text/plain" });
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/cvs/parse", { method: "POST", body: formData });
      const result = await res.json();
      if (res.ok) { setFileType("txt"); applyParsed(result.data.parsed); }
      else setParseError(result.error ?? "Erreur d'analyse");
    } catch { setParseError("Erreur réseau"); }
    finally { setIsProcessing(false); }
  }, [pastedText]);

  const applyParsed = (result: ParsedCVData) => {
    setParsed(result);
    setCvTitle(result.name ? `CV de ${result.name}` : "CV importé");
    setStep(2);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!parsed) return;
    setIsSaving(true);
    const tmpl = CV_TEMPLATES.find((t) => t.id === selectedTemplate) ?? CV_TEMPLATES[0];

    const body = {
      title: cvTitle || "CV importé",
      template: selectedTemplate,
      hasSidebar: tmpl.hasSidebar,
      sidebarPos: "LEFT",
      sidebarTheme: tmpl.hasSidebar ? tmpl.id : undefined,
      data: {
        personalInfo: {
          firstName: parsed.name?.split(" ")[0] ?? "",
          lastName: parsed.name?.split(" ").slice(1).join(" ") ?? "",
          jobTitle: parsed.jobTitle ?? "", email: parsed.email ?? "",
          phone: parsed.phone ?? "", address: parsed.location ?? "",
          linkedin: parsed.linkedin ?? "", github: parsed.github ?? "",
          website: parsed.website ?? "",
        },
        summary: parsed.summary ?? "",
        experience: parsed.experience?.map((e, i) => ({
          id: `exp-${i}`, position: e.position, company: e.company,
          location: "", startDate: "", endDate: "", current: false,
          description: e.description, bullets: e.bullets,
        })) ?? [],
        education: parsed.education?.map((e, i) => ({
          id: `edu-${i}`, degree: e.degree, institution: e.institution,
          field: "", startDate: "", endDate: e.period, description: e.description,
        })) ?? [],
        skills: parsed.skills?.map((s, i) => ({ id: `skill-${i}`, name: s, level: 3, category: "" })) ?? [],
        languages: parsed.languages?.map((l, i) => ({ id: `lang-${i}`, name: l.name, level: l.level })) ?? [],
        certifications: parsed.certifications?.map((c, i) => ({
          id: `cert-${i}`, name: c.name, issuer: c.issuer, date: c.date, url: "",
        })) ?? [],
        projects: [], hobbies: [], references: [],
        importedAt: new Date().toISOString(), importSource: fileType || "paste",
        importFileName: fileName || undefined,
      },
    };

    try {
      const res = await fetch("/api/cvs/import", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? "Erreur"); setIsSaving(false); return; }
      toast.success("CV importé avec succès !");
      handleClose();
      router.push(`/dashboard/cv-builder/${json.data.id}`);
      router.refresh();
    } catch { toast.error("Erreur réseau"); }
    finally { setIsSaving(false); }
  };

  const filteredTemplates = templateCategory === "all"
    ? CV_TEMPLATES : CV_TEMPLATES.filter((t) => t.category === templateCategory);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden max-h-[90vh]">
        <div className="px-6 pt-6 pb-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Upload className="w-5 h-5 text-amber-400" />
              Importer un CV existant
            </DialogTitle>
            <DialogDescription>
              Importez votre CV depuis un fichier PDF, DOCX, DOC, TXT ou JSON pour l&apos;éditer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 mt-5 pb-5">
            <StepDot step={1} current={step} label="Source" />
            <div className="flex-1 h-px bg-border" />
            <StepDot step={2} current={step} label="Template" />
            <div className="flex-1 h-px bg-border" />
            <StepDot step={3} current={step} label="Confirmation" />
          </div>
          <Separator />
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-5 min-h-[340px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Upload */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-4">
                  <Tabs value={inputTab} onValueChange={(v) => setInputTab(v as "file" | "paste")}>
                    <TabsList className="w-full">
                      <TabsTrigger value="file" className="flex-1 gap-2"><FileText className="w-4 h-4" />Fichier</TabsTrigger>
                      <TabsTrigger value="paste" className="flex-1 gap-2"><AlignLeft className="w-4 h-4" />Coller</TabsTrigger>
                    </TabsList>
                    <TabsContent value="file" className="mt-4">
                      <div
                        className={cn("relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all",
                          isDragging ? "border-amber-500 bg-amber-500/5" : "border-border/60 hover:border-amber-500/40 hover:bg-muted/40")}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input ref={fileInputRef} type="file" accept={ACCEPTED_FORMATS} className="hidden" onChange={handleFileSelect} />
                        {isProcessing ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                            <p className="text-sm text-muted-foreground">Analyse du fichier en cours...</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                              <Upload className="w-7 h-7 text-amber-400" />
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-sm">Glissez-déposez votre CV ici</p>
                              <p className="text-xs text-muted-foreground mt-1">ou cliquez pour sélectionner</p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {FORMAT_LABELS.map((f) => (
                                <Badge key={f.ext} variant="outline" className="gap-1.5 text-[10px]">
                                  <f.icon className={cn("w-3 h-3", f.color)} />{f.ext}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-[11px] text-muted-foreground/70 text-center max-w-xs">
                              PDF, DOCX, DOC, TXT, MD, JSON — Max 10 Mo
                            </p>
                          </>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="paste" className="mt-4 space-y-3">
                      <Textarea placeholder="Collez le contenu de votre CV…" className="min-h-[200px] resize-none text-sm font-mono" value={pastedText} onChange={(e) => setPastedText(e.target.value)} />
                      <Button className="w-full btn-gradient" onClick={processPastedText} disabled={!pastedText.trim() || isProcessing}>
                        {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        Analyser le texte
                      </Button>
                    </TabsContent>
                  </Tabs>
                  {parseError && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{parseError}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Template */}
              {step === 2 && parsed && (
                <motion.div key="s2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-5">
                  <div className="flex items-start gap-3 bg-muted/40 rounded-xl p-4 border border-border/50">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">CV analysé avec succès</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {[parsed.name, parsed.email, parsed.experience?.length ? `${parsed.experience.length} exp.` : null,
                          parsed.skills?.length ? `${parsed.skills.length} comp.` : null].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {fileType && <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] uppercase">{fileType}</Badge>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Titre du CV</Label>
                    <Input value={cvTitle} onChange={(e) => setCvTitle(e.target.value)} placeholder="Mon CV…" className="text-sm" />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Choisir un template</Label>
                    <div className="flex gap-1.5 flex-wrap">
                      {TEMPLATE_CATEGORIES.map((cat) => (
                        <button key={cat.id} onClick={() => setTemplateCategory(cat.id)}
                          className={cn("text-[10px] px-2.5 py-1 rounded-full border transition-all font-medium",
                            templateCategory === cat.id ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "text-muted-foreground border-border/50 hover:border-border")}>
                          {cat.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {filteredTemplates.map((t) => (
                        <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                          className={cn("relative flex flex-col items-start p-3 rounded-xl border text-left transition-all",
                            selectedTemplate === t.id ? "border-amber-500/60 bg-amber-500/5 ring-1 ring-amber-500/30" : "border-border/50 hover:border-border bg-card")}>
                          <div className={cn("w-full aspect-[3/4] rounded-lg mb-2 relative overflow-hidden", t.preview)}>
                            {t.hasSidebar && (
                              <div className="absolute top-0 left-0 bottom-0 opacity-80"
                                style={{ width: t.sidebarWidth === "narrow" ? "25%" : t.sidebarWidth === "wide" ? "40%" : "33%", backgroundColor: t.sidebarColor }} />
                            )}
                            <div className={cn("absolute top-2 right-2 space-y-1", t.hasSidebar ? "left-[38%]" : "left-2")}>
                              <div className="h-1 bg-white/30 rounded w-3/4" />
                              <div className="h-0.5 bg-white/20 rounded w-1/2" />
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold block truncate w-full">{t.name}</span>
                          <span className="text-[9px] text-muted-foreground truncate w-full">{t.description.length > 30 ? t.description.slice(0, 30) + "…" : t.description}</span>
                          {selectedTemplate === t.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && parsed && (
                <motion.div key="s3" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-4">
                  <div className="bg-muted/30 rounded-xl border border-border/50 overflow-hidden">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Récapitulatif</span>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setStep(2)}><Eye className="w-3.5 h-3.5" />Modifier</Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-xs text-muted-foreground block">Titre</span><span className="font-medium truncate block">{cvTitle}</span></div>
                        <div><span className="text-xs text-muted-foreground block">Template</span><span className="font-medium block">{CV_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</span></div>
                        {parsed.name && <div><span className="text-xs text-muted-foreground block">Nom</span><span className="font-medium">{parsed.name}</span></div>}
                        {parsed.email && <div><span className="text-xs text-muted-foreground block">E-mail</span><span className="font-medium truncate block">{parsed.email}</span></div>}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {parsed.experience?.length > 0 && <Badge variant="outline" className="text-[10px]">💼 {parsed.experience.length} exp.</Badge>}
                        {parsed.education?.length > 0 && <Badge variant="outline" className="text-[10px]">🎓 {parsed.education.length} form.</Badge>}
                        {parsed.skills?.length > 0 && <Badge variant="outline" className="text-[10px]">⚡ {parsed.skills.length} comp.</Badge>}
                        {parsed.languages?.length > 0 && <Badge variant="outline" className="text-[10px]">🌐 {parsed.languages.length} lang.</Badge>}
                      </div>
                    </div>
                    <Separator />
                    <div className="px-4 py-3 flex items-center gap-2.5 bg-amber-500/5">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        {fileName ? `${fileName} (${(fileSize / 1024).toFixed(0)} Ko) · ` : ""}
                        Template &quot;{CV_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}&quot;. Modifiable après import.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
          <Button variant="ghost" size="sm" onClick={() => { if (step === 1) handleClose(); else setStep((s) => (s - 1) as 1 | 2 | 3); }} disabled={isSaving}>
            {step === 1 ? <><X className="w-4 h-4 mr-1.5" />Annuler</> : <><ChevronLeft className="w-4 h-4 mr-1.5" />Retour</>}
          </Button>
          {step < 3 && <Button className="btn-gradient gap-1.5" size="sm" disabled={step === 1 || !parsed} onClick={() => setStep((s) => (s + 1) as 2 | 3)}>Suivant <ChevronRight className="w-4 h-4" /></Button>}
          {step === 3 && <Button className="btn-gradient gap-1.5" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Check className="w-4 h-4 mr-1.5" />}Importer & éditer
          </Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
