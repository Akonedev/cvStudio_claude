"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6 gap-4 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-display font-semibold truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 h-8 text-sm bg-background border-border/60 w-48 focus:w-64 transition-all duration-300"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative w-9 h-9">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
        </Button>

        {/* Action */}
        {action && (
          <Button size="sm" className="btn-gradient font-medium gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {action.label}
          </Button>
        )}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-amber-500/10 text-amber-400 text-xs font-semibold">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="text-sm font-medium">Jean Dupont</div>
              <div className="text-xs text-muted-foreground">jean@example.com</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuItem>
              Abonnement
              <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">Pro</Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400">Se déconnecter</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
