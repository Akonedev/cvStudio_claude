"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard, Crown, Download, Check, Zap, Shield,
  Receipt, Calendar, ArrowUpRight, ExternalLink,
  AlertCircle, CheckCircle
} from "lucide-react";

const currentPlan = {
  name: "Pro",
  price: 19,
  renewDate: "22 mars 2026",
  status: "active",
  features: [
    "CV illimités",
    "Analyses ATS illimitées",
    "Job Matcher illimité",
    "Lettres de motivation illimitées",
    "Préparation entretiens",
    "Tous les templates premium",
    "Export PDF/DOCX/ODT",
    "Historique complet",
    "Support prioritaire",
    "IA GPT-4 Turbo",
  ],
};

const usage = [
  { label: "CV créés", used: 5, total: Infinity, unit: "" },
  { label: "Analyses ATS", used: 12, total: Infinity, unit: "" },
  { label: "Job Matcher", used: 8, total: Infinity, unit: "" },
  { label: "Lettres générées", used: 8, total: Infinity, unit: "" },
];

const invoices = [
  { id: "INV-2026-02", date: "22 fév. 2026", amount: "19,00 €", status: "paid" },
  { id: "INV-2026-01", date: "22 jan. 2026", amount: "19,00 €", status: "paid" },
  { id: "INV-2025-12", date: "22 déc. 2025", amount: "19,00 €", status: "paid" },
  { id: "INV-2025-11", date: "22 nov. 2025", amount: "19,00 €", status: "paid" },
];

export function SubscriptionInterface() {
  const [activeTab, setActiveTab] = useState("plan");

  return (
    <div className="max-w-4xl space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="plan" className="gap-2 text-sm">
            <Crown className="w-4 h-4" />
            Mon Plan
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 text-sm">
            <CreditCard className="w-4 h-4" />
            Facturation
          </TabsTrigger>
          <TabsTrigger value="invoices" className="gap-2 text-sm">
            <Receipt className="w-4 h-4" />
            Factures
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="mt-6 space-y-6">
          {/* Current plan card */}
          <div className="card-premium p-6 border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold">Plan {currentPlan.name}</h3>
                      <Badge className="badge-active text-xs mt-0.5">Actif</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Renouvellement le <span className="text-foreground font-medium">{currentPlan.renewDate}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display font-bold">{currentPlan.price}€</div>
                  <div className="text-sm text-muted-foreground">/mois</div>
                </div>
              </div>

              {/* Usage stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {usage.map((item) => (
                  <div key={item.label} className="bg-muted rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                    <div className="text-lg font-display font-bold">
                      {item.used}
                      <span className="text-sm text-muted-foreground font-normal ml-1">
                        {item.total === Infinity ? "∞" : `/ ${item.total}`}
                      </span>
                    </div>
                    {item.total !== Infinity && (
                      <Progress value={(item.used / item.total) * 100} className="h-1 mt-2" />
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button className="btn-gradient font-medium gap-2">
                  <Crown className="w-4 h-4" />
                  Passer à l'Élite
                </Button>
                <Button variant="outline" className="border-border/60 gap-2">
                  <Calendar className="w-4 h-4" />
                  Changer le cycle
                </Button>
                <Button variant="ghost" className="text-muted-foreground gap-2 hover:text-destructive">
                  Annuler l'abonnement
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="card-premium p-6">
            <h3 className="font-display font-semibold mb-4">Fonctionnalités incluses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {currentPlan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade card */}
          <div className="card-premium p-6 border-teal-500/20 bg-teal-500/3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold mb-1">Passez au plan Élite</h3>
                <p className="text-sm text-muted-foreground">
                  Candidature directe, IA Claude 3 Opus, coaching carrière et bien plus
                </p>
              </div>
              <Button className="gap-2 border-teal-500/30 text-teal-400 hover:bg-teal-500/10" variant="outline">
                Découvrir l'Élite
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          {/* Payment method */}
          <div className="card-premium p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Moyen de paiement
            </h3>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <div className="text-sm font-medium">•••• •••• •••• 4242</div>
                  <div className="text-xs text-muted-foreground">Expire 12/2027</div>
                </div>
              </div>
              <Badge className="badge-active text-xs">Par défaut</Badge>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-border/60 text-sm gap-2">
                <CreditCard className="w-4 h-4" />
                Modifier la carte
              </Button>
              <Button variant="outline" className="border-border/60 text-sm gap-2">
                Ajouter un moyen de paiement
              </Button>
            </div>
          </div>

          {/* Billing address */}
          <div className="card-premium p-6">
            <h3 className="font-display font-semibold mb-4">Adresse de facturation</h3>
            <div className="text-sm text-muted-foreground space-y-1 mb-4">
              <div>Jean Dupont</div>
              <div>15 Rue de la Paix</div>
              <div>75001 Paris, France</div>
            </div>
            <Button variant="outline" className="border-border/60 text-sm">
              Modifier l'adresse
            </Button>
          </div>

          {/* Security */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              Paiements sécurisés par <span className="text-foreground font-medium">Stripe</span>.
              Vos données bancaires ne sont jamais stockées sur nos serveurs.
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <div className="card-premium overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold">Historique de facturation</h3>
              <Button variant="outline" size="sm" className="border-border/60 text-xs gap-2">
                <Download className="w-3.5 h-3.5" />
                Tout télécharger
              </Button>
            </div>
            <div className="divide-y divide-border">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                      <Receipt className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{invoice.id}</div>
                      <div className="text-xs text-muted-foreground">{invoice.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">{invoice.amount}</div>
                    <Badge className="badge-active text-xs">
                      <Check className="w-2.5 h-2.5 mr-1" />
                      Payé
                    </Badge>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
