"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle } from "lucide-react";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-4 py-1.5 text-sm mb-6">
              Contact
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Parlons de votre{" "}
            <span className="text-gradient-gold italic">projet</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Une question ? Un projet enterprise ? Notre équipe vous répond sous 24h.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-display font-semibold text-xl mb-6">Prenons contact</h3>
              <div className="space-y-5">
                {[
                  { icon: Mail, label: "Email", value: "hello@cv-studio.app", href: "mailto:hello@cv-studio.app" },
                  { icon: MessageSquare, label: "Support", value: "support@cv-studio.app", href: "mailto:support@cv-studio.app" },
                  { icon: MapPin, label: "Adresse", value: "Paris, France", href: null },
                  { icon: Clock, label: "Disponibilité", value: "Lun-Ven, 9h-18h CET", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm font-medium">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise CTA */}
            <div className="card-premium p-6 border-amber-500/20">
              <h4 className="font-display font-semibold mb-2">Solution Enterprise</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Vous êtes un cabinet RH, une entreprise ou une école ? Découvrez nos offres sur-mesure.
              </p>
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 w-full">
                Demander une démo
              </Button>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <div className="card-premium p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Message envoyé !</h3>
                <p className="text-muted-foreground text-sm">
                  Nous vous répondrons dans les 24 heures.
                </p>
              </div>
            ) : (
              <div className="card-premium p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Prénom</Label>
                    <Input placeholder="Jean" className="bg-background border-border/60" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Nom</Label>
                    <Input placeholder="Dupont" className="bg-background border-border/60" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Email</Label>
                  <Input type="email" placeholder="jean@exemple.com" className="bg-background border-border/60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Sujet</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/60">
                      <SelectValue placeholder="Sélectionnez un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Support technique</SelectItem>
                      <SelectItem value="billing">Facturation</SelectItem>
                      <SelectItem value="enterprise">Solution Enterprise</SelectItem>
                      <SelectItem value="partnership">Partenariat</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Message</Label>
                  <Textarea
                    placeholder="Décrivez votre demande..."
                    className="bg-background border-border/60 resize-none min-h-[120px]"
                  />
                </div>
                <Button
                  className="btn-gradient font-medium gap-2 w-full"
                  onClick={() => setSubmitted(true)}
                >
                  <Send className="w-4 h-4" />
                  Envoyer le message
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
