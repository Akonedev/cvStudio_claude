"use client";

import { motion } from "framer-motion";
import { 
  FileText, Search, Mail, Mic, BarChart3, Shield, 
  Zap, Globe, Brain, Star, ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: FileText,
    category: "CV Builder",
    title: "Créateur de CV IA",
    description: "Canvas de création avancé avec templates premium, sidebar personnalisable, et optimisation ATS intégrée. L'IA RH senior vous guide à chaque étape.",
    color: "amber",
    gradient: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    features: ["Templates premium exclusifs", "Score ATS en temps réel", "Assistant RH senior IA", "Export PDF/DOCX/ODT"],
  },
  {
    icon: Search,
    category: "Job Matcher",
    title: "Matching d'offres intelligent",
    description: "Analysez n'importe quelle offre en collant son URL. L'IA évalue la compatibilité avec votre profil et adapte automatiquement votre candidature.",
    color: "teal",
    gradient: "from-teal-500/20 to-teal-600/5",
    border: "border-teal-500/20",
    iconBg: "bg-teal-500/20",
    iconColor: "text-teal-400",
    features: ["Analyse d'URL automatique", "Score de compatibilité", "Adaptation du CV", "Veille d'offres en temps réel"],
  },
  {
    icon: Mail,
    category: "Lettre de motivation",
    title: "Lettres sur-mesure",
    description: "Générez des lettres de motivation personnalisées et percutantes adaptées à chaque offre, selon les meilleures pratiques rédactionnelles professionnelles.",
    color: "violet",
    gradient: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    features: ["Personnalisation avancée", "Ton adapté au secteur", "Versions multiples", "Export intégré"],
  },
  {
    icon: Mic,
    category: "Interview Prep",
    title: "Préparation entretiens",
    description: "Simulez vos entretiens avec un coach IA spécialisé. Questions personnalisées, réponses types, conseils comportementaux et feedback en temps réel.",
    color: "rose",
    gradient: "from-rose-500/20 to-rose-600/5",
    border: "border-rose-500/20",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    features: ["Questions personnalisées", "Simulation d'entretien", "Feedback instantané", "Bibliothèque de réponses"],
  },
];

const extraFeatures = [
  { icon: BarChart3, label: "Tableau de bord analytique" },
  { icon: Shield, label: "Score ATS avancé" },
  { icon: Zap, label: "Génération en temps réel" },
  { icon: Globe, label: "Multi-langues" },
  { icon: Brain, label: "IA multi-providers" },
  { icon: Star, label: "Templates exclusifs" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 mesh-bg opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-4 py-1.5 text-sm mb-6">
              Fonctionnalités
            </Badge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
          >
            Tout ce dont vous avez{" "}
            <span className="text-gradient-gold italic">besoin</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Une suite complète d'outils IA pour optimiser chaque étape de votre recherche d'emploi,
            des experts RH seniors intégrés dans chaque fonctionnalité.
          </motion.p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`card-premium p-8 group cursor-pointer relative overflow-hidden`}
            >
              {/* Gradient bg on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[calc(var(--radius)+4px)]`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Badge variant="outline" className={`text-xs ${feature.border} ${feature.iconColor} bg-transparent mb-3`}>
                      {feature.category}
                    </Badge>
                    <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                </div>

                <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{feature.description}</p>

                <ul className="space-y-2">
                  {feature.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full ${feature.iconBg}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra features row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {extraFeatures.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="card-premium p-4 flex flex-col items-center gap-3 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <f.icon className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{f.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
