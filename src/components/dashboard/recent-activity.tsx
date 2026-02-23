"use client";

import { useEffect, useState } from "react";
import { FileText, Search, Mail, Mic, CheckCircle, Settings, LogIn, LogOut, CreditCard, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoryItem {
  id: string;
  action: string;
  entityType: string;
  entityName: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

const ACTION_META: Record<string, { icon: React.ElementType; iconColor: string; iconBg: string; label: (e: HistoryItem) => string }> = {
  CREATE: { icon: FileText, iconColor: "text-amber-400", iconBg: "bg-amber-500/10", label: (e) => `${e.entityName ?? e.entityType} créé(e)` },
  UPDATE: { icon: Settings, iconColor: "text-teal-400", iconBg: "bg-teal-500/10", label: (e) => `${e.entityName ?? e.entityType} modifié(e)` },
  DELETE: { icon: Trash2, iconColor: "text-red-400", iconBg: "bg-red-500/10", label: (e) => `${e.entityName ?? e.entityType} supprimé(e)` },
  VIEW: { icon: Search, iconColor: "text-blue-400", iconBg: "bg-blue-500/10", label: (e) => `${e.entityName ?? e.entityType} consulté(e)` },
  EXPORT: { icon: FileText, iconColor: "text-violet-400", iconBg: "bg-violet-500/10", label: (e) => `${e.entityName ?? "Fichier"} exporté(e)` },
  GENERATE: { icon: Mail, iconColor: "text-violet-400", iconBg: "bg-violet-500/10", label: (e) => `${e.entityName ?? "Document"} généré(e)` },
  ANALYZE: { icon: Search, iconColor: "text-teal-400", iconBg: "bg-teal-500/10", label: (e) => `Analyse — ${e.entityName ?? e.entityType}` },
  LOGIN: { icon: LogIn, iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10", label: () => "Connexion" },
  LOGOUT: { icon: LogOut, iconColor: "text-muted-foreground", iconBg: "bg-muted/30", label: () => "Déconnexion" },
  PAYMENT: { icon: CreditCard, iconColor: "text-amber-400", iconBg: "bg-amber-500/10", label: () => "Paiement effectué" },
  SUBSCRIBE: { icon: CreditCard, iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10", label: () => "Abonnement activé" },
  CANCEL: { icon: CreditCard, iconColor: "text-red-400", iconBg: "bg-red-500/10", label: () => "Abonnement annulé" },
};

const ENTITY_ICON: Record<string, React.ElementType> = {
  CV: FileText,
  COVER_LETTER: Mail,
  JOB_OFFER: Search,
  INTERVIEW_PREP: Mic,
};

export function RecentActivity() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history?limit=10")
      .then((r) => r.json())
      .then((d) => setItems(d.data?.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-display font-semibold">Activité récente</h2>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          10 dernières actions
        </Badge>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-muted/50 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted/50 rounded w-3/4" />
                <div className="h-2.5 bg-muted/30 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">Aucune activité récente.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-1">
          {items.map((item) => {
            const meta = ACTION_META[item.action] ?? ACTION_META.VIEW;
            const EntityIcon = ENTITY_ICON[item.entityType] ?? meta.icon;
            const Icon = item.action === "CREATE" || item.action === "GENERATE" ? EntityIcon : meta.icon;

            return (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-8 h-8 rounded-lg ${meta.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${meta.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{meta.label(item)}</div>
                  {(() => {
                    const md = item.metadata as Record<string, unknown> | null;
                    const detail = md?.detail;
                    return detail ? <div className="text-xs text-muted-foreground">{String(detail)}</div> : null;
                  })()}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: fr })}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
