import DashboardHeader from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Video, FileText, HelpCircle, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

const FAQ = [
  { q: "Comment améliorer mon score ATS ?", a: "Utilisez l'analyseur ATS intégré dans l'éditeur CV. Il identifie les mots-clés manquants et les problèmes de formatage qui bloquent les systèmes ATS." },
  { q: "Combien de CV puis-je créer ?", a: "En plan Gratuit: 2 CV. Plan Pro: 10 CV. Plan Elite: illimité. Vous pouvez définir un CV actif par défaut pour toutes vos analyses." },
  { q: "Comment fonctionne le Job Matcher ?", a: "Collez l'URL d'une offre d'emploi (LinkedIn, Indeed, etc.) ou sa description. L'IA analyse l'adéquation avec votre CV actif et propose des adaptations personnalisées." },
  { q: "Les CV exportés en PDF sont-ils compatibles ATS ?", a: "Oui. Nos templates sont optimisés pour les systèmes ATS. Évitez les templates créatifs avec beaucoup d'éléments graphiques pour maximiser la compatibilité." },
  { q: "Puis-je utiliser CV Studio en anglais ?", a: "Oui. Dans Paramètres > IA & Préférences, sélectionnez la langue de génération. L'interface reste en français mais les contenus générés seront en anglais." },
  { q: "Comment changer mon provider IA ?", a: "Les providers IA sont configurés par l'administrateur de la plateforme. Contactez le support pour toute demande spécifique." },
];

const GUIDES = [
  { icon: FileText, title: "Guide du CV parfait", desc: "Meilleures pratiques pour créer un CV percutant en 2026", href: "#", badge: "Guide" },
  { icon: BookOpen, title: "Optimiser pour les ATS", desc: "Comprendre et passer les filtres automatiques des recruteurs", href: "#", badge: "ATS" },
  { icon: MessageCircle, title: "Lettres de motivation", desc: "Structure, ton et personnalisation: secrets des RH experts", href: "#", badge: "Lettre" },
  { icon: Video, title: "Préparer un entretien", desc: "Méthode STAR, questions pièges et posture professionnelle", href: "#", badge: "Entretien" },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Centre d&apos;aide" subtitle="Documentation, guides et FAQ pour utiliser CV Studio" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Quick help cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="card-premium text-center p-4 cursor-pointer hover:border-amber-500/50 transition-colors">
              <MessageCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="font-semibold">Chat avec l&apos;IA</h3>
              <p className="text-xs text-muted-foreground mt-1">Posez vos questions directement dans n&apos;importe quel outil</p>
            </Card>
            <Card className="card-premium text-center p-4 cursor-pointer hover:border-teal-500/50 transition-colors">
              <Mail className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <h3 className="font-semibold">Support Email</h3>
              <p className="text-xs text-muted-foreground mt-1">support@cvstudio.fr — réponse sous 24h</p>
            </Card>
            <Card className="card-premium text-center p-4 cursor-pointer hover:border-violet-500/50 transition-colors">
              <Video className="w-8 h-8 text-violet-400 mx-auto mb-2" />
              <h3 className="font-semibold">Tutoriels vidéo</h3>
              <p className="text-xs text-muted-foreground mt-1">Guides pas à pas pour chaque fonctionnalité</p>
            </Card>
          </div>

          {/* Resource guides */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" /> Guides & Ressources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GUIDES.map((g) => (
                <Card key={g.title} className="card-premium hover:border-amber-500/50 transition-colors">
                  <CardHeader className="pb-2 flex-row items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <g.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {g.title}
                        <Badge variant="secondary" className="text-xs">{g.badge}</Badge>
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">{g.desc}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="gap-1 text-amber-400 hover:text-amber-300 p-0" asChild>
                      <Link href={g.href}>Lire le guide <ArrowRight className="w-3 h-3" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" /> Questions fréquentes
            </h2>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <Card key={item.q} className="card-premium">
                  <CardContent className="pt-4">
                    <h3 className="font-medium mb-2 text-sm">{item.q}</h3>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
