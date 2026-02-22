"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, LayoutDashboard, Users, CreditCard, Settings, Brain, BarChart3, Shield, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/admin" },
  { icon: Users, label: "Utilisateurs", href: "/admin/users" },
  { icon: CreditCard, label: "Abonnements", href: "/admin/subscriptions" },
  { icon: Brain, label: "Gestion IA", href: "/admin/ai" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Shield, label: "Sécurité", href: "/admin/security" },
  { icon: Settings, label: "Configuration", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 70 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-full border-r border-border bg-card flex-shrink-0 overflow-hidden"
    >
      <div className={cn("flex items-center border-b border-border p-4", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-stone-900" />
            </div>
            <div>
              <span className="font-display font-bold text-sm">CV Studio</span>
              <div className="text-[9px] text-amber-400 uppercase tracking-widest">Admin</div>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex-1 py-4 px-2 space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "nav-item",
                isActive && "nav-item-active",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-amber-400")} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          className={cn("w-full text-muted-foreground hover:text-foreground gap-2", isCollapsed && "justify-center")}
          size="sm"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="text-xs">Déconnexion</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
