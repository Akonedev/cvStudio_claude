"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export function SubscriptionBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [isPro, setIsPro] = useState(true); // optimistic default — hide until confirmed FREE

  useEffect(() => {
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then((d) => setIsPro(d.data?.plan !== "FREE"))
      .catch(() => {});
  }, []);

  if (dismissed || isPro) return null;

  return (
    <div className="relative rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex items-center gap-4">
      <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
        <Crown className="w-5 h-5 text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold">Passez au Plan Pro</span>
          <Badge className="bg-amber-500 text-stone-900 text-[10px] font-bold px-2">-27% avec le plan annuel</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Accédez à des CV illimités, Job Matcher, préparation d'entretiens et tous les templates premium.
        </p>
      </div>
      <Button size="sm" className="btn-gradient font-medium whitespace-nowrap gap-1.5 flex-shrink-0" asChild>
        <Link href="/dashboard/subscription">
          Passer au Pro
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-7 h-7 flex-shrink-0 text-muted-foreground"
        onClick={() => setDismissed(true)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
