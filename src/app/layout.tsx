import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { AuthSessionProvider } from "@/components/shared/session-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CV Studio — L'IA au service de votre carrière",
  description: "Créez des CV professionnels, trouvez les meilleures offres et préparez vos entretiens avec l'intelligence artificielle de pointe.",
  keywords: "CV, curriculum vitae, emploi, recrutement, IA, intelligence artificielle, lettre de motivation",
  authors: [{ name: "CV Studio" }],
  openGraph: {
    title: "CV Studio — L'IA au service de votre carrière",
    description: "La plateforme SaaS de référence pour votre recherche d'emploi",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthSessionProvider>
            {children}
          </AuthSessionProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
