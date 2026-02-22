"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User, Bell, Shield, Palette, Brain, Globe,
  Camera, Save, Eye, EyeOff, Trash2, LogOut
} from "lucide-react";

export function SettingsInterface() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email_weekly: true,
    email_tips: true,
    email_offers: false,
    push_analysis: true,
    push_updates: false,
  });

  return (
    <div className="max-w-3xl space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="profile" className="gap-2 text-sm">
            <User className="w-4 h-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 text-sm">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 text-sm">
            <Shield className="w-4 h-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2 text-sm">
            <Brain className="w-4 h-4" />
            IA & Préférences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <div className="card-premium p-6">
            <h3 className="font-display font-semibold mb-6">Informations personnelles</h3>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-amber-500/10 text-amber-400 text-2xl font-bold">JD</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                </button>
              </div>
              <div>
                <div className="font-medium mb-1">Jean Dupont</div>
                <div className="text-sm text-muted-foreground mb-2">jean.dupont@email.com</div>
                <Badge className="badge-active text-xs">Plan Pro</Badge>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm">Prénom</Label>
                <Input defaultValue="Jean" className="bg-background border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Nom</Label>
                <Input defaultValue="Dupont" className="bg-background border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Email</Label>
                <Input defaultValue="jean.dupont@email.com" className="bg-background border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Téléphone</Label>
                <Input defaultValue="+33 6 12 34 56 78" className="bg-background border-border/60" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm">Titre professionnel</Label>
                <Input defaultValue="CTO & Lead Architect" placeholder="Ex: Senior Developer, Product Manager..." className="bg-background border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Secteur</Label>
                <Select defaultValue="tech">
                  <SelectTrigger className="bg-background border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technologie / IT</SelectItem>
                    <SelectItem value="finance">Finance / Banque</SelectItem>
                    <SelectItem value="marketing">Marketing / Communication</SelectItem>
                    <SelectItem value="consulting">Conseil</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger className="bg-background border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <Button className="btn-gradient font-medium gap-2">
                <Save className="w-4 h-4" />
                Enregistrer les modifications
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-4">
          <div className="card-premium p-6">
            <h3 className="font-display font-semibold mb-6">Notifications par email</h3>
            <div className="space-y-5">
              {[
                { key: "email_weekly", label: "Rapport hebdomadaire", description: "Résumé de votre activité et conseils personnalisés" },
                { key: "email_tips", label: "Conseils & astuces", description: "Recommandations pour améliorer vos candidatures" },
                { key: "email_offers", label: "Offres d'emploi recommandées", description: "Nouvelles offres correspondant à votre profil" },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="font-display font-semibold mb-6">Notifications push</h3>
            <div className="space-y-5">
              {[
                { key: "push_analysis", label: "Fin d'analyse", description: "Quand une analyse d'offre ou de CV est terminée" },
                { key: "push_updates", label: "Mises à jour produit", description: "Nouvelles fonctionnalités et améliorations" },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-4">
          <div className="card-premium p-6">
            <h3 className="font-display font-semibold mb-6">Changer le mot de passe</h3>
            <div className="space-y-4 max-w-sm">
              <div className="space-y-2">
                <Label className="text-sm">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-background border-border/60 pr-10"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Nouveau mot de passe</Label>
                <Input type="password" placeholder="••••••••" className="bg-background border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Confirmer le nouveau mot de passe</Label>
                <Input type="password" placeholder="••••••••" className="bg-background border-border/60" />
              </div>
              <Button className="btn-gradient font-medium gap-2">
                <Shield className="w-4 h-4" />
                Mettre à jour le mot de passe
              </Button>
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="font-display font-semibold mb-4">Authentification à deux facteurs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez une couche de sécurité supplémentaire à votre compte.
            </p>
            <Button variant="outline" className="border-border/60 gap-2">
              <Shield className="w-4 h-4" />
              Activer la 2FA
            </Button>
          </div>

          <div className="card-premium p-6 border-destructive/20">
            <h3 className="font-display font-semibold mb-2 text-destructive">Zone dangereuse</h3>
            <p className="text-sm text-muted-foreground mb-4">
              La suppression de votre compte est irréversible. Toutes vos données seront effacées.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="border-border/60 gap-2 text-muted-foreground">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
              <Button variant="ghost" className="text-destructive hover:bg-destructive/10 gap-2">
                <Trash2 className="w-4 h-4" />
                Supprimer le compte
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* AI Preferences Tab */}
        <TabsContent value="ai" className="mt-6 space-y-4">
          <div className="card-premium p-6">
            <h3 className="font-display font-semibold mb-6">Préférences IA</h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm">Langue préférée pour les générations</Label>
                <Select defaultValue="fr">
                  <SelectTrigger className="bg-background border-border/60 max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                    <SelectItem value="fr-en">Bilingue FR/EN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Ton d'écriture</Label>
                <Select defaultValue="professional">
                  <SelectTrigger className="bg-background border-border/60 max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professionnel formel</SelectItem>
                    <SelectItem value="dynamic">Dynamique et moderne</SelectItem>
                    <SelectItem value="creative">Créatif et original</SelectItem>
                    <SelectItem value="executive">Executif et concis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Secteur cible (pour personnalisation IA)</Label>
                <Select defaultValue="tech">
                  <SelectTrigger className="bg-background border-border/60 max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technologie</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="health">Santé</SelectItem>
                    <SelectItem value="consulting">Conseil</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Suggestions proactives</div>
                  <div className="text-xs text-muted-foreground">L'IA propose des améliorations automatiquement pendant l'édition</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Analyse ATS en temps réel</div>
                  <div className="text-xs text-muted-foreground">Score ATS mis à jour pendant que vous éditez votre CV</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="mt-6">
              <Button className="btn-gradient font-medium gap-2">
                <Save className="w-4 h-4" />
                Enregistrer les préférences
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
