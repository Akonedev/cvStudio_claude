"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Users, FileText, CreditCard, TrendingUp, Activity,
  Search, Filter, MoreVertical, Shield, Brain,
  Server, Key, Plus, Edit, Trash2, CheckCircle,
  XCircle, RefreshCw, Globe, Cpu, Eye,
  ArrowUp, ArrowDown, AlertTriangle
} from "lucide-react";

const stats = [
  { label: "Utilisateurs totaux", value: "12,847", change: "+8.3%", trend: "up", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "CV créés ce mois", value: "3,421", change: "+15.2%", trend: "up", icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Revenu mensuel", value: "48,320€", change: "+12.7%", trend: "up", icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Taux de rétention", value: "94.2%", change: "-0.8%", trend: "down", icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10" },
];

const mockUsers = [
  { id: "1", name: "Jean Dupont", email: "jean@example.com", plan: "Pro", status: "active", joined: "15 jan. 2026", cvs: 5, usage: 87 },
  { id: "2", name: "Marie Leblanc", email: "marie@example.com", plan: "Élite", status: "active", joined: "3 fév. 2026", cvs: 12, usage: 95 },
  { id: "3", name: "Paul Martin", email: "paul@example.com", plan: "Starter", status: "active", joined: "20 jan. 2026", cvs: 2, usage: 43 },
  { id: "4", name: "Sophie Renard", email: "sophie@example.com", plan: "Pro", status: "suspended", joined: "10 déc. 2025", cvs: 8, usage: 0 },
  { id: "5", name: "Thomas Bernard", email: "thomas@example.com", plan: "Pro", status: "active", joined: "5 fév. 2026", cvs: 3, usage: 62 },
];

const mockProviders = [
  {
    id: "1",
    name: "OpenAI",
    type: "cloud",
    status: "active",
    url: "https://api.openai.com/v1",
    models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
    activeModel: "gpt-4o",
    requests: 12847,
  },
  {
    id: "2",
    name: "Anthropic",
    type: "cloud",
    status: "active",
    url: "https://api.anthropic.com",
    models: ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"],
    activeModel: "claude-3-5-sonnet-20241022",
    requests: 8432,
  },
  {
    id: "3",
    name: "Ollama (Local)",
    type: "local",
    status: "inactive",
    url: "http://localhost:11434",
    models: ["llama3.2", "mistral", "mixtral"],
    activeModel: "llama3.2",
    requests: 0,
  },
  {
    id: "4",
    name: "Google Gemini",
    type: "cloud",
    status: "active",
    url: "https://generativelanguage.googleapis.com",
    models: ["gemini-1.5-pro", "gemini-1.5-flash"],
    activeModel: "gemini-1.5-pro",
    requests: 3219,
  },
];

const planConfig = {
  Starter: "bg-muted text-muted-foreground border-border",
  Pro: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Élite: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

const providerTypeIcon = { cloud: Globe, local: Server };

export function AdminOverview() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");
  const [showAddProvider, setShowAddProvider] = useState(false);

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="overview" className="gap-2 text-sm">
            <Activity className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2 text-sm">
            <Users className="w-4 h-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2 text-sm">
            <Brain className="w-4 h-4" />
            Gestion IA
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="card-premium p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-1 ${
                    stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {stat.trend === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-display font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Revenue & Usage Charts (simplified) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card-premium p-5">
              <h3 className="font-display font-semibold mb-4">Répartition des abonnements</h3>
              <div className="space-y-3">
                {[
                  { plan: "Pro", users: 8240, pct: 64, color: "bg-amber-500" },
                  { plan: "Élite", users: 2156, pct: 17, color: "bg-teal-500" },
                  { plan: "Starter", users: 2451, pct: 19, color: "bg-muted-foreground" },
                ].map((item) => (
                  <div key={item.plan}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="text-muted-foreground">{item.plan}</span>
                      <span className="font-medium">{item.users.toLocaleString()} ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-premium p-5">
              <h3 className="font-display font-semibold mb-4">Activité de la plateforme</h3>
              <div className="space-y-3">
                {[
                  { label: "CV créés aujourd'hui", value: 142, max: 200 },
                  { label: "Analyses job matcher", value: 89, max: 200 },
                  { label: "Lettres générées", value: 67, max: 200 },
                  { label: "Sessions actives", value: 234, max: 500 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <Progress value={(item.value / item.max) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="card-premium p-5 border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-display font-semibold">Alertes système</h3>
            </div>
            <div className="space-y-2">
              {[
                { msg: "Quota API OpenAI à 78% — envisager une augmentation", type: "warning" },
                { msg: "2 utilisateurs avec paiements en échec depuis 3 jours", type: "error" },
                { msg: "Mise à jour disponible pour le provider Anthropic", type: "info" },
              ].map((alert, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-3 rounded-lg text-xs ${
                  alert.type === "warning" ? "bg-amber-500/10 text-amber-400" :
                  alert.type === "error" ? "bg-red-500/10 text-red-400" :
                  "bg-blue-500/10 text-blue-400"
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  {alert.msg}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 bg-background border-border/60"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-36 border-border/60 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les plans</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="elite">Élite</SelectItem>
              </SelectContent>
            </Select>
            <Button className="btn-gradient font-medium gap-2">
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </div>

          <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Utilisateur</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Plan</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Statut</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">CV</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Usage IA</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Inscrit</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${planConfig[user.plan as keyof typeof planConfig]}`}>
                          {user.plan}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${user.status === "active" ? "badge-active" : "badge-inactive"}`}>
                          {user.status === "active" ? "Actif" : "Suspendu"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{user.cvs}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={user.usage} className="h-1.5 w-16" />
                          <span className="text-xs text-muted-foreground">{user.usage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{user.joined}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="w-7 h-7">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* AI Management Tab */}
        <TabsContent value="ai" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold">Providers IA</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Gérez les fournisseurs d'IA et les modèles actifs
              </p>
            </div>
            <Button className="btn-gradient font-medium gap-2" onClick={() => setShowAddProvider(true)}>
              <Plus className="w-4 h-4" />
              Ajouter un provider
            </Button>
          </div>

          <div className="space-y-3">
            {mockProviders.map((provider) => {
              const TypeIcon = providerTypeIcon[provider.type as keyof typeof providerTypeIcon];
              return (
                <div key={provider.id} className="card-premium p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      provider.status === "active" ? "bg-emerald-500/10" : "bg-muted"
                    }`}>
                      <TypeIcon className={`w-5 h-5 ${provider.status === "active" ? "text-emerald-400" : "text-muted-foreground"}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-sm">{provider.name}</span>
                        <Badge className={provider.status === "active" ? "badge-active text-xs" : "badge-inactive text-xs"}>
                          {provider.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                        <Badge className="bg-muted text-muted-foreground border-border text-xs">
                          {provider.type === "cloud" ? "Cloud" : "Local"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mb-2">{provider.url}</div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">Modèle actif:</span>
                        <Select defaultValue={provider.activeModel}>
                          <SelectTrigger className="h-6 text-xs border-border/60 bg-background w-auto min-w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {provider.models.map((model) => (
                              <SelectItem key={model} value={model} className="text-xs">
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {provider.requests > 0 && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {provider.requests.toLocaleString()} requêtes ce mois
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={provider.status === "active"} />
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Key className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Provider Form */}
          {showAddProvider && (
            <div className="card-premium p-6 border-amber-500/20">
              <h3 className="font-display font-semibold mb-4">Ajouter un nouveau provider</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom du provider</label>
                  <Input placeholder="Ex: OpenAI, Mistral, Ollama..." className="bg-background border-border/60" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select defaultValue="cloud">
                    <SelectTrigger className="bg-background border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud">Cloud</SelectItem>
                      <SelectItem value="local">Local (Ollama, LMStudio, vLLM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">URL de l'API</label>
                  <Input placeholder="https://api.example.com/v1" className="bg-background border-border/60 font-mono text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Clé API</label>
                  <Input type="password" placeholder="sk-..." className="bg-background border-border/60 font-mono text-sm" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button className="btn-gradient font-medium gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Valider et connecter
                </Button>
                <Button variant="outline" className="border-border/60" onClick={() => setShowAddProvider(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
