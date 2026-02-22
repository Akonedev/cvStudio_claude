"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-4 py-1.5 text-sm mb-8">
            Commencez maintenant — Gratuit
          </Badge>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            Votre prochain poste{" "}
            <span className="text-gradient-gold italic">vous attend</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez 12 000+ professionnels qui ont transformé leur recherche d'emploi avec CV Studio. 
            Aucune carte de crédit requise pour commencer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="btn-gradient font-semibold text-base px-10 h-12 rounded-xl gap-2" asChild>
              <Link href="/signup">
                Créer mon compte gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border/60 text-base px-10 h-12 rounded-xl" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Données sécurisées & RGPD</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>IA de dernière génération</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-400" />
              <span>Résultats en quelques minutes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
