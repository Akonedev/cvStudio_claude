"use client";

import { motion } from "framer-motion";
import { FileText, Search, Mail, TrendingUp, Eye, CheckCircle } from "lucide-react";

const stats = [
  { 
    label: "CV créés", value: "3", change: "+1 ce mois",
    icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20"
  },
  { 
    label: "Candidatures", value: "24", change: "+8 cette semaine",
    icon: Search, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20"
  },
  { 
    label: "Entretiens obtenus", value: "7", change: "+3 cette semaine",
    icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20"
  },
  { 
    label: "Score ATS moyen", value: "87%", change: "+5pts cette semaine",
    icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20"
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={`card-premium p-5 border ${stat.border}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
          </div>
          <div className="text-2xl font-display font-bold mb-1">{stat.value}</div>
          <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
          <div className={`text-xs ${stat.color}`}>{stat.change}</div>
        </motion.div>
      ))}
    </div>
  );
}
