"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Star, Users, FileText, Zap } from "lucide-react";

const stats = [
  { value: "50K+", label: "CV créés", icon: FileText },
  { value: "94%", label: "Taux de succès", icon: Star },
  { value: "12K+", label: "Utilisateurs", icon: Users },
  { value: "3x", label: "Plus d'entretiens", icon: Zap },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-bg pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/3 blur-3xl" />
        
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex"
          >
            <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-4 py-1.5 text-sm font-medium gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Nouvelle IA Claude 3.5 intégrée — 40% plus précise
              <ArrowRight className="w-3.5 h-3.5" />
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] mb-6 text-balance"
          >
            Votre CV,{" "}
            <span className="text-gradient-gold">réinventé</span>
            {" "}par{" "}
            <span className="italic">l'IA</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            CV Studio combine design haut de gamme et intelligence artificielle pour créer des candidatures 
            qui se démarquent. Analyse ATS, matching d'offres, préparation d'entretiens — tout en un.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button size="lg" className="btn-gradient font-semibold text-base px-8 h-12 rounded-xl gap-2" asChild>
              <Link href="/signup">
                Créer mon CV gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border/60 hover:border-border text-base px-8 h-12 rounded-xl gap-2 group">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <Play className="w-3 h-3 text-amber-400 ml-0.5" />
              </div>
              Voir la démo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="card-premium p-4 flex flex-col items-center gap-1.5"
              >
                <stat.icon className="w-4 h-4 text-amber-400 mb-1" />
                <div className="text-2xl font-display font-bold text-gradient-gold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Hero visual — CV preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden glass border border-border/50 shadow-2xl">
            <div className="bg-surface-2 border-b border-border/50 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-muted rounded px-3 py-1 text-xs text-muted-foreground font-mono text-center max-w-xs mx-auto">
                  cv-studio.app/builder
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8 bg-gradient-to-br from-card to-background min-h-[400px] flex gap-6">
              {/* Sidebar preview */}
              <div className="hidden md:flex flex-col gap-3 w-48 flex-shrink-0">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 mx-auto mb-2" />
                  <div className="h-3 bg-amber-500/30 rounded mb-1.5" />
                  <div className="h-2 bg-muted rounded w-3/4 mx-auto mb-3" />
                  <div className="space-y-1.5">
                    {[70, 85, 60, 90].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-1.5 bg-muted rounded" style={{ width: `${100 - w * 0.3}%` }} />
                        <div className="flex-1 h-1.5 bg-amber-500/30 rounded" style={{ width: `${w}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  {["Expérience", "Formation", "Langues", "Compétences"].map((s) => (
                    <div key={s} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content preview */}
              <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="border-b border-border/50 pb-4">
                  <div className="h-6 bg-gradient-to-r from-foreground/20 to-transparent rounded w-3/4 mb-2" />
                  <div className="h-4 bg-amber-500/20 rounded w-1/2 mb-3" />
                  <div className="flex gap-3">
                    {[3, 4, 5].map((w) => (
                      <div key={w} className="h-2 bg-muted rounded" style={{ width: `${w * 20}px` }} />
                    ))}
                  </div>
                </div>

                {/* Experience section */}
                <div className="space-y-3">
                  <div className="h-3 bg-amber-500/30 rounded w-24" />
                  {[1, 2].map((i) => (
                    <div key={i} className="pl-3 border-l-2 border-amber-500/30 space-y-1">
                      <div className="h-3 bg-foreground/15 rounded w-2/3" />
                      <div className="h-2 bg-muted-foreground/20 rounded w-1/3" />
                      <div className="h-2 bg-muted/50 rounded w-full" />
                      <div className="h-2 bg-muted/50 rounded w-5/6" />
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {["React", "TypeScript", "Node.js", "Leadership", "Agile"].map((skill) => (
                    <div key={skill} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400/80 px-2 py-1 rounded-full">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI assistant panel */}
              <div className="hidden lg:flex flex-col gap-3 w-52 flex-shrink-0">
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 text-xs">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span className="text-teal-400 font-medium">IA Assistant</span>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="bg-muted rounded-lg p-2">
                      Ajoutez des métriques chiffrées pour renforcer l'impact de vos expériences.
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      ✓ Score ATS : <span className="text-emerald-400">87/100</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {["Optimiser pour l'ATS", "Adapter à l'offre", "Corriger le style"].map((action) => (
                    <div key={action} className="text-xs bg-muted border border-border rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <div className="absolute -top-6 -right-6 hidden xl:block">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="glass border border-border/50 rounded-xl p-3 shadow-xl"
            >
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Star className="w-3 h-3 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Score ATS</div>
                  <div className="text-emerald-400">94/100 ✓</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute -bottom-6 -left-6 hidden xl:block">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="glass border border-border/50 rounded-xl p-3 shadow-xl"
            >
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-amber-400" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Match offre</div>
                  <div className="text-amber-400">87% compatible</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
