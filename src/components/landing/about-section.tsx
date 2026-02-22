"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Linkedin, Twitter, Shield, Award, Globe } from "lucide-react";

const team = [
  {
    name: "Élise Fontaine",
    role: "CEO & Co-fondatrice",
    initials: "EF",
    bio: "Ex-DRH chez L'Oréal, 15 ans en recrutement. Passionnée d'IA et de transformation RH.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Marc Rousseau",
    role: "CTO & Co-fondateur",
    initials: "MR",
    bio: "Engineering lead chez Doctolib puis Alan. Architecte de systèmes IA à grande échelle.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Camille Dumont",
    role: "Head of AI",
    initials: "CD",
    bio: "PhD NLP Paris-Saclay. Ex-chercheure Meta AI. Spécialiste des modèles de langage appliqués aux RH.",
    linkedin: "#",
  },
  {
    name: "Antoine Lefebvre",
    role: "Head of Design",
    initials: "AL",
    bio: "Ex-designer principal chez Contentsquare et Malt. Obsédé par l'expérience utilisateur premium.",
    linkedin: "#",
  },
];

const values = [
  {
    icon: Shield,
    title: "Confidentialité d'abord",
    description: "Vos données et vos CV vous appartiennent. Nous ne les partageons jamais avec des tiers ou des recruteurs sans votre accord.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Award,
    title: "Excellence RH",
    description: "Chaque fonctionnalité est validée par nos experts RH seniors pour garantir que vos candidatures respectent les meilleures pratiques du marché.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Globe,
    title: "IA de pointe",
    description: "Nous intégrons les meilleurs modèles de langage disponibles — Claude, GPT-4, Gemini — pour vous offrir les analyses les plus précises.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/4 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-teal-500/15 text-teal-400 border border-teal-500/30 px-4 py-1.5 text-sm mb-6">
              Notre histoire
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Construits par des experts,{" "}
            <span className="text-gradient-gold italic">pour vous</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            CV Studio est né de la frustration de recruteurs et de candidats face à un marché de l'emploi
            opaque et des outils dépassés. Notre mission : donner à chaque professionnel les meilleures
            armes pour sa carrière.
          </motion.p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-premium p-6"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${value.bg}`}>
                <value.icon className={`w-6 h-6 ${value.color}`} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-display font-bold mb-3">L'équipe</h3>
          <p className="text-muted-foreground">
            Des passionnés de technologie et de ressources humaines
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-premium p-6 text-center group"
            >
              <Avatar className="w-16 h-16 mx-auto mb-4 ring-2 ring-border group-hover:ring-primary/30 transition-all duration-300">
                <AvatarFallback className="bg-gradient-to-br from-amber-500/20 to-teal-500/20 text-foreground font-display font-bold text-lg">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-display font-semibold mb-0.5">{member.name}</h4>
              <div className="text-xs text-amber-400 font-medium mb-3">{member.role}</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{member.bio}</p>
              <div className="flex items-center justify-center gap-2">
                {member.linkedin && (
                  <a href={member.linkedin} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
                    <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
                    <Twitter className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
