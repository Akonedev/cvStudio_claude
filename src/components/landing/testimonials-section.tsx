"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sophie Marchand",
    role: "Lead Developer → CTO",
    company: "Startup Fintech",
    avatar: "SM",
    rating: 5,
    text: "CV Studio a transformé ma recherche d'emploi. En 3 semaines, j'avais 8 entretiens contre 0 avec mon ancien CV. L'analyse ATS et les recommandations IA m'ont permis d'identifier exactement ce qui manquait.",
    metric: "8 entretiens en 3 semaines",
  },
  {
    name: "Thomas Bergeron",
    role: "Reconversion Marketing → Data",
    company: "Cabinet de conseil",
    avatar: "TB",
    rating: 5,
    text: "En reconversion professionnelle, j'avais du mal à valoriser mes compétences. L'IA RH senior de CV Studio a su mettre en valeur mes transferable skills de manière convaincante. J'ai décroché un poste Senior en 6 semaines.",
    metric: "Reconversion réussie en 6 semaines",
  },
  {
    name: "Amira Khelifi",
    role: "Juriste → Legal Tech Manager",
    company: "Scale-up européenne",
    avatar: "AK",
    rating: 5,
    text: "Le Job Matcher est incroyable. Je colle l'URL de l'offre et en 30 secondes j'ai une analyse complète avec un score de compatibilité et une version adaptée de mon CV. Un gain de temps phénoménal.",
    metric: "+340% de réponses aux candidatures",
  },
  {
    name: "Lucas Pereira",
    role: "Product Manager",
    company: "GAFA",
    avatar: "LP",
    rating: 5,
    text: "La préparation d'entretien est le vrai game-changer. Les questions sont ultra-ciblées sur le poste et le secteur. Les réponses types sont réalistes et m'ont aidé à structurer mon discours. J'ai décroché mon poste de rêve.",
    metric: "Offre GAFA acceptée",
  },
  {
    name: "Emma Schulz",
    role: "Designer Senior",
    company: "Agence internationale",
    avatar: "ES",
    rating: 5,
    text: "La qualité des templates est exceptionnelle. Vraiment haut de gamme et différenciants. L'IA comprend très bien les attentes des recruteurs dans le design et le créatif. Mes candidatures sortent clairement du lot.",
    metric: "12 offres pour 15 candidatures",
  },
  {
    name: "Marc Delacroix",
    role: "Directeur Commercial",
    company: "Groupe industriel",
    avatar: "MD",
    rating: 5,
    text: "À mon niveau, chaque détail compte. CV Studio m'a aidé à affiner mon positionnement, mes métriques et mon storytelling. Les résultats sont là : 3 offres en 4 semaines, toutes au-dessus de mes attentes salariales.",
    metric: "3 offres en 4 semaines",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-teal-500/3 blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-4 py-1.5 text-sm mb-6">
              Témoignages
            </Badge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Ils ont transformé leur{" "}
            <span className="text-gradient-gold italic">carrière</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-premium p-6 flex flex-col group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarFallback className="bg-amber-500/10 text-amber-400 text-sm font-semibold">
                      {t.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
                <Quote className="w-5 h-5 text-amber-400/40 group-hover:text-amber-400/70 transition-colors" />
              </div>

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                "{t.text}"
              </p>

              <div className="mt-auto pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t.company}</span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                    {t.metric}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
