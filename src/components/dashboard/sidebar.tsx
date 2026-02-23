"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles, FileText, Search, Mail, Mic, History, 
  CreditCard, Settings, ChevronLeft, ChevronRight,
  LayoutDashboard, Users, Database, Shield, BarChart3,
  LogOut, Bell, HelpCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const userNavItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard", badge: null },
  { icon: FileText, label: "Mes CV", href: "/dashboard/cv-builder", badge: null },
  { icon: Search, label: "Job Matcher", href: "/dashboard/job-matcher", badge: "NEW" },
  { icon: Mail, label: "Lettre de motivation", href: "/dashboard/cover-letter", badge: null },
  { icon: Mic, label: "Préparation entretien", href: "/dashboard/interview", badge: null },
  { icon: History, label: "Historique", href: "/dashboard/history", badge: null },
];

const secondaryItems = [
  { icon: CreditCard, label: "Abonnement", href: "/dashboard/subscription", badge: null },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings", badge: null },
  { icon: HelpCircle, label: "Aide & Support", href: "/dashboard/help", badge: null },
];

interface DashboardSidebarProps {
  isAdmin?: boolean;
}

export function DashboardSidebar({ isAdmin = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();

  const userName = session?.user?.name ?? "Utilisateur";
  const userEmail = session?.user?.email ?? "";
  const initials = (session?.user?.name ?? "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join("");

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 70 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-full bg-card border-r border-border overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className={cn("flex items-center border-b border-border p-4", isCollapsed ? "justify-center" : "gap-3 justify-between")}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-stone-900" />
            </div>
            <span className="font-display font-bold text-base">
              CV <span className="text-gradient-gold">Studio</span>
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-stone-900" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 flex-shrink-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {!isCollapsed && (
          <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
            {isAdmin ? "Administration" : "Workspace"}
          </p>
        )}
        
        {userNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <NavItem key={item.href} item={item} isActive={isActive} isCollapsed={isCollapsed} />
          );
        })}

        {!isCollapsed && <div className="divider-gold my-3" />}
        
        {userNavItems.length > 0 && secondaryItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavItem key={item.href} item={item} isActive={isActive} isCollapsed={isCollapsed} />
          );
        })}
      </div>

      {/* User profile */}
      <div className={cn("border-t border-border p-3", isCollapsed ? "flex justify-center" : "")}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarFallback className="bg-amber-500/10 text-amber-400 text-sm font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{userName}</div>
              <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-muted-foreground hover:text-red-400"
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-amber-500/10 text-amber-400 text-sm font-semibold">{initials}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </motion.aside>
  );
}

function NavItem({ 
  item, isActive, isCollapsed 
}: { 
  item: typeof userNavItems[0]; 
  isActive: boolean; 
  isCollapsed: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "nav-item",
        isActive && "nav-item-active",
        isCollapsed && "justify-center px-0 py-2.5"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-amber-400" : "")} />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/30 text-[9px] px-1.5 py-0">
                {item.badge}
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
