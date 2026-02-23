"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Mail, TrendingUp } from "lucide-react";

const CARD_META = [
  { key: "cvCount",       label: "CV créés",           icon: FileText,   color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  { key: "jobMatchCount", label: "Offres analysées",   icon: Search,     color: "text-teal-400",   bg: "bg-teal-500/10",   border: "border-teal-500/20" },
  { key: "coverLetterCount", label: "Lettres générées", icon: Mail,       color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { key: "avgAtsScore",   label: "Score ATS moyen",    icon: TrendingUp, color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20" },
] as const;

type StatsData = {
  cvCount: number;
  jobMatchCount: number;
  coverLetterCount: number;
  avgAtsScore: number;
};

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.data ?? null))
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_META.map((meta, i) => {
        const rawValue = stats ? stats[meta.key] : null;
        const displayValue =
          rawValue === null
            ? "—"
            : meta.key === "avgAtsScore"
            ? `${rawValue}%`
            : String(rawValue);

        return (
          <motion.div
            key={meta.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`card-premium p-5 border ${meta.border}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center`}>
                <meta.icon className={`w-[18px] h-[18px] ${meta.color}`} />
              </div>
            </div>
            <div className="text-2xl font-display font-bold mb-1">
              {stats === null ? (
                <span className="inline-block w-12 h-7 bg-muted/50 rounded animate-pulse" />
              ) : (
                displayValue
              )}
            </div>
            <div className="text-xs text-muted-foreground">{meta.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
