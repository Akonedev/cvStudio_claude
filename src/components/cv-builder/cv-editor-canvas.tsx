"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useCVEditorStore } from "@/store/cv-editor-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { CVPreviewPanel } from "./cv-preview-panel";
import { CVSidebarEditor } from "./cv-sidebar-editor";
import { CVHeaderEditor } from "./cv-header-editor";
import { CVSectionsEditor } from "./cv-sections-editor";
import { AIAssistantPanel } from "./ai-assistant-panel";

import {
  Save, Download, Undo2, Redo2, Eye, ZoomIn, ZoomOut,
  MessageSquare, X, Loader2, LayoutTemplate, Type, Layers,
  ChevronLeft, FileText, CheckCircle2
} from "lucide-react";
import Link from "next/link";

interface CVEditorCanvasProps {
  cvId: string;
}

export function CVEditorCanvas({ cvId }: CVEditorCanvasProps) {
  const store = useCVEditorStore();
  const {
    cvTitle, isLoading, isSaving, isDirty, atsScore,
    activePanel, setActivePanel, showAIPanel, setShowAIPanel,
    initFromAPI, setLoading, setSaving, setDirty,
    previewScale, data
  } = store;

  const [zoom, setZoom] = useState(0.65);
  const hasInitRef = useRef(false);

  // ─── Fetch CV data on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;

    const fetchCV = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cvs/${cvId}`);
        const json = await res.json();
        if (json.success) {
          initFromAPI(json.data);
        } else {
          toast.error("Impossible de charger le CV");
        }
      } catch {
        toast.error("Erreur de connexion");
      }
    };

    fetchCV();
  }, [cvId, initFromAPI, setLoading]);

  // ─── Save handler ─────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const serializedData = store.getSerializableData();
      const res = await fetch(`/api/cvs/${cvId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serializedData),
      });
      const json = await res.json();
      if (json.success) {
        setDirty(false);
        toast.success("CV sauvegardé !");
      } else {
        toast.error(json.error ?? "Erreur de sauvegarde");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setSaving(false);
    }
  }, [cvId, setSaving, setDirty, store]);

  // ─── Auto-save every 30 seconds if dirty ──────────────────────────────────
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      handleSave();
    }, 30000);
    return () => clearTimeout(timer);
  }, [isDirty, handleSave]);

  // ─── Keyboard shortcut Ctrl+S ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  // ─── Export handler ───────────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    try {
      // First, save current state
      if (isDirty) await handleSave();

      const res = await fetch(`/api/cvs/${cvId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "json" }),
      });
      const json = await res.json();
      if (json.success) {
        const blob = new Blob([JSON.stringify(json.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${cvTitle || "cv"}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CV exporté !");
      }
    } catch {
      toast.error("Erreur d'export");
    }
  }, [cvId, cvTitle, isDirty, handleSave]);

  // ─── Tab definitions ──────────────────────────────────────────────────────
  const TABS = [
    { id: "layout", label: "Mise en page", icon: LayoutTemplate },
    { id: "header", label: "En-tête", icon: Type },
    { id: "sections", label: "Sections", icon: Layers },
  ];

  // ─── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Chargement du CV...</p>
        </div>
      </div>
    );
  }

  const fullName = [data.personalInfo.firstName, data.personalInfo.lastName].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* ─── Top Toolbar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background">
        {/* Left: Back + title */}
        <div className="flex items-center gap-3">
          <Link href="/cv-builder" className="p-1 hover:bg-muted rounded">
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold text-foreground">
                {cvTitle || "Sans titre"}
              </span>
              {isDirty && (
                <Badge variant="outline" className="text-[9px] px-1 text-amber-600 border-amber-300">
                  Non sauvé
                </Badge>
              )}
            </div>
            {fullName && (
              <p className="text-[10px] text-muted-foreground ml-6">{fullName}</p>
            )}
          </div>
        </div>

        {/* Center: ATS score */}
        <div className="flex items-center gap-3">
          {atsScore !== null && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted">
              <CheckCircle2 className={cn(
                "h-3 w-3",
                atsScore >= 80 ? "text-emerald-500" : atsScore >= 60 ? "text-amber-500" : "text-red-500"
              )} />
              <span className="text-xs font-medium">ATS {atsScore}%</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
            <button
              onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
              className="p-1 hover:bg-muted rounded"
            >
              <ZoomOut className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <span className="text-[10px] text-muted-foreground w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              className="p-1 hover:bg-muted rounded"
            >
              <ZoomIn className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* AI Panel toggle */}
          <Button
            variant={showAIPanel ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={cn("h-7 px-2 text-xs", showAIPanel && "bg-amber-500 hover:bg-amber-600")}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            IA
          </Button>

          {/* Export */}
          <Button variant="ghost" size="sm" onClick={handleExport} className="h-7 px-2 text-xs">
            <Download className="h-3.5 w-3.5 mr-1" /> Exporter
          </Button>

          {/* Save */}
          <Button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            size="sm"
            className="h-7 px-3 text-xs bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 mr-1" />
            )}
            {isSaving ? "Enregistrement..." : "Sauvegarder"}
          </Button>
        </div>
      </div>

      {/* ─── Main Layout: Editor + Preview + AI ───────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* ─── Left Panel: Editor Tabs ───────────────────────────────────── */}
        <div className="w-[300px] border-r border-border flex flex-col bg-background">
          {/* Tab bar */}
          <div className="flex border-b border-border">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors border-b-2",
                    activePanel === tab.id
                      ? "border-amber-500 text-amber-600 dark:text-amber-400"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activePanel === "layout" && <CVSidebarEditor />}
            {activePanel === "header" && <CVHeaderEditor />}
            {activePanel === "sections" && <CVSectionsEditor />}
          </div>
        </div>

        {/* ─── Center: Preview ───────────────────────────────────────────── */}
        <div className="flex-1 bg-muted overflow-auto flex items-start justify-center py-8 px-4">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            <CVPreviewPanel />
          </div>
        </div>

        {/* ─── Right Panel: AI Assistant ──────────────────────────────────── */}
        {showAIPanel && (
          <div className="w-[320px] border-l border-border flex flex-col bg-background">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-foreground">Assistant IA</span>
              </div>
              <button onClick={() => setShowAIPanel(false)} className="p-0.5 hover:bg-muted rounded">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIAssistantPanel cvId={cvId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
