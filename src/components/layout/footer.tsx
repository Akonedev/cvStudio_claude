import Link from "next/link";
import { Sparkles, Twitter, Linkedin, Github, Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  Produit: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Templates", href: "/templates" },
    { label: "API", href: "/api-docs" },
    { label: "Nouveautés", href: "/changelog" },
  ],
  Ressources: [
    { label: "Guide CV", href: "/guide" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Communauté", href: "/community" },
    { label: "Webinaires", href: "/webinars" },
  ],
  Entreprise: [
    { label: "À propos", href: "/about" },
    { label: "Carrières", href: "/careers" },
    { label: "Presse", href: "/press" },
    { label: "Partenariats", href: "/partners" },
    { label: "Contact", href: "/contact" },
  ],
  Légal: [
    { label: "Confidentialité", href: "/privacy" },
    { label: "CGU", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "RGPD", href: "/gdpr" },
  ],
};

const socials = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter/X" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      {/* Newsletter */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-display font-bold mb-3">
              Restez à la <span className="text-gradient-gold">pointe</span>
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Conseils d'experts RH, nouveautés IA et ressources carrière — directement dans votre boîte mail.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input 
                placeholder="votre@email.com" 
                type="email" 
                className="bg-background border-border/60"
              />
              <Button className="btn-gradient whitespace-nowrap font-medium">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-stone-900" />
              </div>
              <span className="font-display font-bold text-lg">
                CV <span className="text-gradient-gold">Studio</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              La plateforme IA de référence pour les professionnels qui prennent leur carrière au sérieux.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 CV Studio. Tous droits réservés. Fait avec ♥ en Europe.
          </p>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
              🟢 Tous les systèmes opérationnels
            </Badge>
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/5">
              RGPD Conforme
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}
