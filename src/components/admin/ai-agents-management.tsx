"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Bot,
  Plus,
  Trash2,
  Edit,
  Save,
  Copy,
  RefreshCw,
  Sparkles,
  Search,
  FileText,
  Mic,
  PenTool,
  ScanSearch,
  Compass,
  Star,
  StarOff,
  Power,
  PowerOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Zap,
  Brain,
  MoreVertical,
  Settings2,
  Eye,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import {
  type AIAgentContext,
  CONTEXT_LABELS,
  CONTEXT_COLORS,
  AGENT_TEMPLATES,
} from "@/types/ai-agents";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  systemPrompt: string;
  context: string;
  icon: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
  temperature: number;
  maxTokens: number;
  providerId?: string | null;
  modelName?: string | null;
  greeting?: string | null;
  capabilities?: string[] | null;
  priority: number;
  provider?: { id: string; name: string; type: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface AgentForm {
  name: string;
  slug: string;
  description: string;
  systemPrompt: string;
  context: string;
  icon: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
  temperature: number;
  maxTokens: number;
  providerId: string;
  modelName: string;
  greeting: string;
  capabilities: string;
  priority: number;
}

const EMPTY_FORM: AgentForm = {
  name: "",
  slug: "",
  description: "",
  systemPrompt: "",
  context: "GENERAL",
  icon: "bot",
  color: "#f59e0b",
  isActive: true,
  isDefault: false,
  temperature: 0.7,
  maxTokens: 2048,
  providerId: "",
  modelName: "",
  greeting: "",
  capabilities: "",
  priority: 0,
};

const CONTEXT_MAP: Record<string, AIAgentContext> = {
  CV: "cv",
  COVER_LETTER: "cover-letter",
  INTERVIEW: "interview",
  JOB_MATCHER: "job-matcher",
  ATS: "ats",
  CAREER: "career",
  GENERAL: "general",
};

const CONTEXT_REVERSE_MAP: Record<string, string> = {
  cv: "CV",
  "cover-letter": "COVER_LETTER",
  interview: "INTERVIEW",
  "job-matcher": "JOB_MATCHER",
  ats: "ATS",
  career: "CAREER",
  general: "GENERAL",
};

const ICON_OPTIONS = [
  { value: "bot", label: "Bot", icon: Bot },
  { value: "file-text", label: "Document", icon: FileText },
  { value: "mic", label: "Micro", icon: Mic },
  { value: "pen-tool", label: "Plume", icon: PenTool },
  { value: "search", label: "Recherche", icon: Search },
  { value: "scan-search", label: "Scan", icon: ScanSearch },
  { value: "compass", label: "Boussole", icon: Compass },
  { value: "brain", label: "Cerveau", icon: Brain },
  { value: "sparkles", label: "Étoiles", icon: Sparkles },
  { value: "zap", label: "Éclair", icon: Zap },
];

const COLOR_OPTIONS = [
  "#f59e0b", // amber
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
  "#f97316", // orange
  "#6b7280", // gray
  "#14b8a6", // teal
];

function getIconComponent(iconName: string) {
  const found = ICON_OPTIONS.find((i) => i.value === iconName);
  return found?.icon ?? Bot;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function AIAgentsManagement() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [contextFilter, setContextFilter] = useState<string>("all");
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [editForm, setEditForm] = useState<AgentForm>(EMPTY_FORM);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Agent | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  // Auto-clear success after 3s
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // ── Fetch agents ──────────────────────────────────────────────────────────

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ai-agents");
      const json = await res.json();
      if (json.success) {
        setAgents(json.data);
      } else {
        setError(json.error);
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // ── Seed agents ───────────────────────────────────────────────────────────

  const seedAgents = async () => {
    setSeeding(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ai-agents/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSuccess(json.data.message);
        fetchAgents();
      } else {
        setError(json.error);
      }
    } catch {
      setError("Erreur lors du seed");
    } finally {
      setSeeding(false);
    }
  };

  // ── Save (create/update) ─────────────────────────────────────────────────

  const saveAgent = async () => {
    setSaving(true);
    setError(null);
    try {
      const body = {
        name: editForm.name,
        slug: editForm.slug,
        description: editForm.description,
        systemPrompt: editForm.systemPrompt,
        context: editForm.context,
        icon: editForm.icon,
        color: editForm.color,
        isActive: editForm.isActive,
        isDefault: editForm.isDefault,
        temperature: editForm.temperature,
        maxTokens: editForm.maxTokens,
        providerId: editForm.providerId || undefined,
        modelName: editForm.modelName || undefined,
        greeting: editForm.greeting || undefined,
        capabilities: editForm.capabilities
          ? editForm.capabilities.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        priority: editForm.priority,
      };

      const url = isCreateMode
        ? "/api/admin/ai-agents"
        : `/api/admin/ai-agents/${editAgent!.id}`;
      const method = isCreateMode ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(isCreateMode ? "Agent créé" : "Agent mis à jour");
        setEditAgent(null);
        setIsCreateMode(false);
        fetchAgents();
      } else {
        setError(json.error);
      }
    } catch {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active/default ─────────────────────────────────────────────────

  const toggleField = async (agent: Agent, field: "isActive" | "isDefault") => {
    try {
      const res = await fetch(`/api/admin/ai-agents/${agent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !agent[field] }),
      });
      const json = await res.json();
      if (json.success) fetchAgents();
      else setError(json.error);
    } catch {
      setError("Erreur de mise à jour");
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const confirmDelete = async () => {
    if (!deleteDialog) return;
    try {
      const res = await fetch(`/api/admin/ai-agents/${deleteDialog.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setSuccess("Agent supprimé");
        fetchAgents();
      } else {
        setError(json.error);
      }
    } catch {
      setError("Erreur lors de la suppression");
    } finally {
      setDeleteDialog(null);
    }
  };

  // ── Open edit/create dialog ───────────────────────────────────────────────

  const openEdit = (agent: Agent) => {
    setEditAgent(agent);
    setIsCreateMode(false);
    setEditForm({
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      systemPrompt: agent.systemPrompt,
      context: agent.context,
      icon: agent.icon || "bot",
      color: agent.color || "#f59e0b",
      isActive: agent.isActive,
      isDefault: agent.isDefault,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      providerId: agent.providerId || "",
      modelName: agent.modelName || "",
      greeting: agent.greeting || "",
      capabilities: agent.capabilities?.join(", ") || "",
      priority: agent.priority,
    });
  };

  const openCreate = () => {
    setEditAgent(null);
    setIsCreateMode(true);
    setEditForm(EMPTY_FORM);
  };

  const createFromTemplate = (tplIdx: number) => {
    const tpl = AGENT_TEMPLATES[tplIdx];
    const slug = tpl.name
      .toLowerCase()
      .replace(/[àáâãäå]/g, "a")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ç]/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setEditAgent(null);
    setIsCreateMode(true);
    setEditForm({
      name: tpl.name,
      slug,
      description: tpl.description,
      systemPrompt: tpl.systemPrompt,
      context: CONTEXT_REVERSE_MAP[tpl.context] || "GENERAL",
      icon: tpl.icon || "bot",
      color: tpl.color || "#f59e0b",
      isActive: true,
      isDefault: tpl.isDefault || false,
      temperature: tpl.temperature || 0.7,
      maxTokens: tpl.maxTokens || 2048,
      providerId: "",
      modelName: "",
      greeting: tpl.greeting || "",
      capabilities: tpl.capabilities?.join(", ") || "",
      priority: tpl.priority || 0,
    });
  };

  // ── Auto-slug ─────────────────────────────────────────────────────────────

  const autoSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[àáâãäå]/g, "a")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ç]/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // ── Filter ────────────────────────────────────────────────────────────────

  const filtered = agents.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (contextFilter !== "all" && a.context !== contextFilter) return false;
    return true;
  });

  const groupedByContext = filtered.reduce<Record<string, Agent[]>>((acc, a) => {
    const key = a.context;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Agents IA</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les agents spécialisés qui répondent aux utilisateurs selon le contexte
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={seedAgents} disabled={seeding}>
            {seeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Seed défauts
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAgents} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Rafraîchir
          </Button>
          <Button className="btn-gradient" size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel agent
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button className="ml-auto text-red-400/60 hover:text-red-400" onClick={() => setError(null)}>×</button>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">{agents.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total agents</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{agents.filter((a) => a.isActive).length}</div>
            <div className="text-xs text-muted-foreground mt-1">Actifs</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">{agents.filter((a) => a.isDefault).length}</div>
            <div className="text-xs text-muted-foreground mt-1">Par défaut</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-cyan-400">
              {new Set(agents.map((a) => a.context)).size}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Contextes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={contextFilter} onValueChange={setContextFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les contextes</SelectItem>
            <SelectItem value="CV">CV</SelectItem>
            <SelectItem value="COVER_LETTER">Lettre de motivation</SelectItem>
            <SelectItem value="INTERVIEW">Entretien</SelectItem>
            <SelectItem value="JOB_MATCHER">Analyse offres</SelectItem>
            <SelectItem value="ATS">ATS</SelectItem>
            <SelectItem value="CAREER">Carrière</SelectItem>
            <SelectItem value="GENERAL">Général</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent list */}
      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards">Cartes</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Aucun agent trouvé</p>
              <Button variant="link" className="mt-2 text-amber-400" onClick={seedAgents}>
                Créer les agents par défaut
              </Button>
            </div>
          )}

          {Object.entries(groupedByContext).map(([ctx, ctxAgents]) => {
            const mapped = CONTEXT_MAP[ctx] || "general";
            return (
              <div key={ctx}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={cn("text-xs", CONTEXT_COLORS[mapped])}>
                    {CONTEXT_LABELS[mapped] || ctx}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {ctxAgents.length} agent{ctxAgents.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ctxAgents.map((agent) => {
                    const IconComp = getIconComponent(agent.icon);
                    return (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                      >
                        <Card
                          className={cn(
                            "glass hover:border-amber-500/30 transition-colors group",
                            !agent.isActive && "opacity-50"
                          )}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                                  style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                                >
                                  <IconComp className="w-5 h-5" />
                                </div>
                                <div>
                                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    {agent.name}
                                    {agent.isDefault && (
                                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    )}
                                  </CardTitle>
                                  <CardDescription className="text-xs">{agent.slug}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEdit(agent)}>
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7 text-red-400"
                                  onClick={() => setDeleteDialog(agent)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {agent.description}
                            </p>

                            {/* System prompt preview */}
                            <div className="relative">
                              <div
                                className={cn(
                                  "text-[11px] bg-muted/50 rounded-lg p-2 font-mono text-muted-foreground",
                                  expandedPrompt !== agent.id && "line-clamp-3"
                                )}
                              >
                                {agent.systemPrompt}
                              </div>
                              <button
                                className="text-[10px] text-amber-400 hover:underline mt-1"
                                onClick={() =>
                                  setExpandedPrompt(expandedPrompt === agent.id ? null : agent.id)
                                }
                              >
                                {expandedPrompt === agent.id ? (
                                  <span className="flex items-center gap-1">
                                    <ChevronUp className="w-3 h-3" /> Réduire
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <ChevronDown className="w-3 h-3" /> Voir tout
                                  </span>
                                )}
                              </button>
                            </div>

                            {/* Capabilities */}
                            {agent.capabilities && (agent.capabilities as string[]).length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {(agent.capabilities as string[]).map((cap) => (
                                  <Badge key={cap} variant="outline" className="text-[10px] px-1.5 py-0">
                                    {cap}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Config row */}
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                              <span>T° {agent.temperature} · {agent.maxTokens} tokens</span>
                              <div className="flex items-center gap-2">
                                <button
                                  className={cn(
                                    "flex items-center gap-1",
                                    agent.isDefault ? "text-amber-400" : "hover:text-amber-400"
                                  )}
                                  onClick={() => toggleField(agent, "isDefault")}
                                  title={agent.isDefault ? "Retirer par défaut" : "Définir par défaut"}
                                >
                                  {agent.isDefault ? (
                                    <Star className="w-3 h-3 fill-current" />
                                  ) : (
                                    <StarOff className="w-3 h-3" />
                                  )}
                                </button>
                                <button
                                  className={cn(
                                    "flex items-center gap-1",
                                    agent.isActive ? "text-emerald-400" : "text-red-400"
                                  )}
                                  onClick={() => toggleField(agent, "isActive")}
                                  title={agent.isActive ? "Désactiver" : "Activer"}
                                >
                                  {agent.isActive ? (
                                    <Power className="w-3 h-3" />
                                  ) : (
                                    <PowerOff className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Modèles prédéfinis — cliquez pour créer un agent à partir d&apos;un modèle
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENT_TEMPLATES.map((tpl, i) => {
              const ctx = tpl.context as AIAgentContext;
              return (
                <Card
                  key={i}
                  className="glass hover:border-amber-500/30 transition-colors cursor-pointer"
                  onClick={() => createFromTemplate(i)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${tpl.color}20`, color: tpl.color }}
                      >
                        {(() => {
                          const IC = getIconComponent(tpl.icon || "bot");
                          return <IC className="w-4 h-4" />;
                        })()}
                      </div>
                      <div>
                        <CardTitle className="text-sm">{tpl.name}</CardTitle>
                        <Badge variant="outline" className={cn("text-[10px] mt-1", CONTEXT_COLORS[ctx])}>
                          {CONTEXT_LABELS[ctx]}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tpl.capabilities?.map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px] px-1.5 py-0">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Edit/Create Dialog ───────────────────────────────────────────────── */}
      <Dialog
        open={!!editAgent || isCreateMode}
        onOpenChange={(open) => {
          if (!open) {
            setEditAgent(null);
            setIsCreateMode(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateMode ? "Nouvel agent" : `Modifier — ${editAgent?.name}`}
            </DialogTitle>
            <DialogDescription>
              {isCreateMode
                ? "Configurez un nouvel agent IA spécialisé"
                : "Modifiez la configuration de cet agent"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name + Slug */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">Nom</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditForm((f) => ({
                      ...f,
                      name,
                      ...(isCreateMode ? { slug: autoSlug(name) } : {}),
                    }));
                  }}
                  placeholder="Expert CV"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Slug</label>
                <Input
                  value={editForm.slug}
                  onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="expert-cv"
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {/* Context + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">Contexte</label>
                <Select
                  value={editForm.context}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, context: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CV">CV</SelectItem>
                    <SelectItem value="COVER_LETTER">Lettre de motivation</SelectItem>
                    <SelectItem value="INTERVIEW">Entretien</SelectItem>
                    <SelectItem value="JOB_MATCHER">Analyse offres</SelectItem>
                    <SelectItem value="ATS">ATS</SelectItem>
                    <SelectItem value="CAREER">Carrière</SelectItem>
                    <SelectItem value="GENERAL">Général</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Priorité</label>
                <Input
                  type="number"
                  value={editForm.priority}
                  onChange={(e) => setEditForm((f) => ({ ...f, priority: parseInt(e.target.value) || 0 }))}
                  min={0}
                  max={100}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Description</label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description courte de l'agent..."
                rows={2}
              />
            </div>

            {/* System Prompt */}
            <div className="space-y-1">
              <label className="text-xs font-medium">System Prompt</label>
              <Textarea
                value={editForm.systemPrompt}
                onChange={(e) => setEditForm((f) => ({ ...f, systemPrompt: e.target.value }))}
                placeholder="Instructions système pour l'agent..."
                rows={8}
                className="font-mono text-xs"
              />
            </div>

            {/* Greeting */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Message d&apos;accueil</label>
              <Textarea
                value={editForm.greeting}
                onChange={(e) => setEditForm((f) => ({ ...f, greeting: e.target.value }))}
                placeholder="Bonjour ! Je suis votre..."
                rows={2}
              />
            </div>

            {/* Icon + Color */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">Icône</label>
                <div className="flex flex-wrap gap-1">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center border transition-colors",
                        editForm.icon === opt.value
                          ? "border-amber-400 bg-amber-400/10"
                          : "border-border hover:border-amber-400/50"
                      )}
                      onClick={() => setEditForm((f) => ({ ...f, icon: opt.value }))}
                      title={opt.label}
                    >
                      <opt.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Couleur</label>
                <div className="flex flex-wrap gap-1">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      className={cn(
                        "w-8 h-8 rounded-lg border-2 transition-transform",
                        editForm.color === c
                          ? "border-white scale-110"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: c }}
                      onClick={() => setEditForm((f) => ({ ...f, color: c }))}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Temperature + MaxTokens */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">
                  Température: {editForm.temperature.toFixed(1)}
                </label>
                <Slider
                  value={[editForm.temperature]}
                  onValueChange={([v]) => setEditForm((f) => ({ ...f, temperature: v }))}
                  min={0}
                  max={2}
                  step={0.1}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Précis</span>
                  <span>Créatif</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Max tokens: {editForm.maxTokens}</label>
                <Slider
                  value={[editForm.maxTokens]}
                  onValueChange={([v]) => setEditForm((f) => ({ ...f, maxTokens: v }))}
                  min={256}
                  max={8192}
                  step={256}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Court</span>
                  <span>Long</span>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Capacités (séparées par des virgules)</label>
              <Input
                value={editForm.capabilities}
                onChange={(e) => setEditForm((f) => ({ ...f, capabilities: e.target.value }))}
                placeholder="Rédaction CV, Optimisation ATS, ..."
              />
            </div>

            {/* Provider + Model */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">Provider ID (optionnel)</label>
                <Input
                  value={editForm.providerId}
                  onChange={(e) => setEditForm((f) => ({ ...f, providerId: e.target.value }))}
                  placeholder="Laisser vide = provider par défaut"
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Modèle (optionnel)</label>
                <Input
                  value={editForm.modelName}
                  onChange={(e) => setEditForm((f) => ({ ...f, modelName: e.target.value }))}
                  placeholder="gpt-4o, claude-3.5-sonnet..."
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 pt-2 border-t border-border/50">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(v) => setEditForm((f) => ({ ...f, isActive: v }))}
                />
                Actif
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch
                  checked={editForm.isDefault}
                  onCheckedChange={(v) => setEditForm((f) => ({ ...f, isDefault: v }))}
                />
                Par défaut
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditAgent(null);
                setIsCreateMode(false);
              }}
            >
              Annuler
            </Button>
            <Button className="btn-gradient" onClick={saveAgent} disabled={saving || !editForm.name || !editForm.slug}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isCreateMode ? "Créer" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ──────────────────────────────────────────────── */}
      <Dialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;agent</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{deleteDialog?.name}</strong> ? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
