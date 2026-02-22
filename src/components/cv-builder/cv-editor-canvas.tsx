"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Save, Download, Eye, Undo2, Redo2, Sparkles, 
  Layout, PanelLeft, PanelRight, PanelLeftClose,
  Settings, Share2, ChevronLeft, Zap
} from "lucide-react";
import Link from "next/link";
import { CVPreviewPanel } from "./cv-preview-panel";
import { CVSidebarEditor } from "./cv-sidebar-editor";
import { CVHeaderEditor } from "./cv-header-editor";
import { CVSectionsEditor } from "./cv-sections-editor";
import { AIAssistantPanel } from "./ai-assistant-panel";

interface CVEditorCanvasProps {
  cvId: string;
}

export function CVEditorCanvas({ cvId }: CVEditorCanvasProps) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarPosition, setSidebarPosition] = useState<"left" | "right">("left");
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [activePanel, setActivePanel] = useState("layout");
  const [atsScore] = useState(87);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center border-b border-border bg-card px-4 py-2.5 gap-3 flex-shrink-0">
        <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
          <Link href="/dashboard/cv-builder">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">CV Senior Developer</span>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
            Enregistré
          </Badge>
        </div>

        <div className="flex-1" />

        {/* ATS Score */}
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium">ATS:</span>
          <span className={`text-xs font-bold ${atsScore >= 85 ? "text-emerald-400" : "text-amber-400"}`}>
            {atsScore}/100
          </span>
          <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${atsScore >= 85 ? "bg-emerald-500" : "bg-amber-500"}`}
              style={{ width: `${atsScore}%` }}
            />
          </div>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8" title="Annuler">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8" title="Refaire">
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 border-border/60 text-xs">
            <Eye className="w-3.5 h-3.5" />
            Aperçu
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 border-border/60 text-xs">
            <Download className="w-3.5 h-3.5" />
            Exporter
          </Button>
          <Button size="sm" className="btn-gradient gap-1.5 font-medium text-xs">
            <Save className="w-3.5 h-3.5" />
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — controls */}
        <div className="w-72 flex-shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
          <Tabs value={activePanel} onValueChange={setActivePanel} className="flex flex-col h-full">
            <TabsList className="w-full rounded-none border-b border-border bg-transparent px-2 pt-2 pb-0 gap-1 justify-start h-auto">
              <TabsTrigger value="layout" className="text-xs px-2.5 py-1.5 rounded-t-lg rounded-b-none data-[state=active]:border-b-0 data-[state=active]:bg-background">
                <Layout className="w-3.5 h-3.5 mr-1.5" />
                Mise en page
              </TabsTrigger>
              <TabsTrigger value="header" className="text-xs px-2.5 py-1.5 rounded-t-lg rounded-b-none">
                En-tête
              </TabsTrigger>
              <TabsTrigger value="sections" className="text-xs px-2.5 py-1.5 rounded-t-lg rounded-b-none">
                Sections
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              <TabsContent value="layout" className="mt-0 p-4 space-y-4">
                <CVSidebarEditor
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                  sidebarPosition={sidebarPosition}
                  setSidebarPosition={setSidebarPosition}
                />
              </TabsContent>
              <TabsContent value="header" className="mt-0 p-4">
                <CVHeaderEditor />
              </TabsContent>
              <TabsContent value="sections" className="mt-0 p-4">
                <CVSectionsEditor />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* CV Preview */}
        <div className="flex-1 overflow-auto bg-muted/30 flex items-start justify-center p-8">
          <CVPreviewPanel showSidebar={showSidebar} sidebarPosition={sidebarPosition} />
        </div>

        {/* Right panel — AI Assistant */}
        {showAIPanel && (
          <div className="w-72 flex-shrink-0 border-l border-border bg-card">
            <AIAssistantPanel />
          </div>
        )}
      </div>
    </div>
  );
}
