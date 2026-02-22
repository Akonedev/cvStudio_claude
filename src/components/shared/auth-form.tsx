"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Eye, EyeOff, ArrowRight, Github, Mail } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Card */}
      <div className="card-premium p-8 border-border/60">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-stone-900" />
          </div>
          <span className="font-display font-bold text-xl">
            CV <span className="text-gradient-gold">Studio</span>
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold mb-2">
            {isLogin ? "Bon retour !" : "Créez votre compte"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin
              ? "Connectez-vous à votre espace CV Studio"
              : "Commencez gratuitement, sans carte de crédit"}
          </p>
        </div>

        {/* Social auth */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="outline" className="border-border/60 gap-2 text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          <Button variant="outline" className="border-border/60 gap-2 text-sm">
            <Github className="w-4 h-4" />
            GitHub
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">ou</span>
          <Separator className="flex-1" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Prénom</Label>
                <Input placeholder="Jean" className="bg-background border-border/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nom</Label>
                <Input placeholder="Dupont" className="bg-background border-border/60" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="jean@example.com"
                className="pl-9 bg-background border-border/60"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Mot de passe</Label>
              {isLogin && (
                <Link href="/forgot-password" className="text-xs text-amber-400 hover:underline">
                  Mot de passe oublié ?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={isLogin ? "Votre mot de passe" : "Min. 8 caractères"}
                className="pr-10 bg-background border-border/60"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-0.5" />
              <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                J'accepte les{" "}
                <Link href="/terms" className="text-amber-400 hover:underline">CGU</Link>
                {" "}et la{" "}
                <Link href="/privacy" className="text-amber-400 hover:underline">Politique de confidentialité</Link>
              </label>
            </div>
          )}

          <Button
            type="submit"
            className="w-full btn-gradient font-semibold gap-2 h-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {isLogin ? "Connexion..." : "Création..."}
              </span>
            ) : (
              <>
                {isLogin ? "Se connecter" : "Créer mon compte gratuit"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <Link
            href={isLogin ? "/signup" : "/login"}
            className="text-amber-400 hover:underline font-medium"
          >
            {isLogin ? "S'inscrire gratuitement" : "Se connecter"}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
