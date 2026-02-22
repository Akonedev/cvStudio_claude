"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Sparkles,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Parfait pour commencer votre recherche d'emploi",
    color: "border-border",
    badge: null,
    cta: "Commencer gratuitement",
    ctaVariant: "outline" as const,
    features: [
      "2 CV créés",
      "3 analyses ATS",
      "5 analyses d'offres",
      "Templates basiques",
      "Export PDF",
      "Support communauté",
    ],
    limitations: ["1 lettre de motivation/mois", "Pas de préparation entretien", "Pas d'historique"],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    monthlyPrice: 19,
    yearlyPrice: 14,
    description: "Pour les chercheurs d'emploi actifs et ambitieux",
    color: "border-amber-500/40",
    badge: "Le plus populaire",
    cta: "Démarrer le Pro",
    ctaVariant: "default" as const,
    isPopular: true,
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
    limitations: [],
  },
  {
    id: "elite",
    name: "Élite",
    icon: Crown,
    monthlyPrice: 49,
    yearlyPrice: 36,
    description: "Pour les professionnels qui ne font aucun compromis",
    color: "border-teal-500/40",
    badge: "Meilleure valeur",
    cta: "Passer à l'Élite",
    ctaVariant: "outline" as const,
    features: [
      "Tout le plan Pro",
      "Candidature directe aux offres",
      "IA Claude 3 Opus / GPT-4o",
      "Gestion multi-providers IA",
      "Analyse sectorielle avancée",
      "Coaching carrière IA",
      "API access (bientôt)",
      "Rapport de marché personnalisé",
      "Support dédié 24/7",
      "Accès early access features",
    ],
    limitations: [],
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/3 blur-3xl rounded-full" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-4 py-1.5 text-sm mb-6">
              Tarifs
            </Badge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Investissez dans votre{" "}
            <span className="text-gradient-gold italic">carrière</span>
          </motion.h2>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Mensuel
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Annuel
              <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                -27%
              </Badge>
            </span>
          </motion.div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative card-premium p-8 ${plan.color} flex flex-col ${plan.isPopular ? "ring-1 ring-amber-500/30" : ""}`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className={`${plan.isPopular ? "bg-amber-500 text-stone-900" : "bg-teal-500 text-stone-900"} text-xs font-semibold px-3`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.isPopular ? "bg-amber-500/20" : "bg-muted"}`}>
                    <plan.icon className={`w-5 h-5 ${plan.isPopular ? "text-amber-400" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="text-xl font-display font-bold">{plan.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-display font-bold">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}€
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-muted-foreground text-sm mb-1">/mois</span>
                  )}
                </div>
                {isYearly && plan.monthlyPrice > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Facturé {plan.yearlyPrice * 12}€/an
                  </p>
                )}
              </div>

              <Button
                variant={plan.ctaVariant}
                className={`w-full mb-8 ${plan.isPopular ? "btn-gradient font-semibold" : ""}`}
                asChild
              >
                <Link href="/signup">{plan.cta}</Link>
              </Button>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Enterprise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 card-premium p-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-xl font-display font-bold mb-2">Entreprise & Teams</h3>
            <p className="text-muted-foreground text-sm">
              Solutions sur-mesure pour les équipes RH, cabinets de recrutement et organisations.
            </p>
          </div>
          <Button variant="outline" className="whitespace-nowrap border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
            Contacter l'équipe
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
