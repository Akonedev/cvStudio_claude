"use client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  timestamp: number;
}

interface UIStore {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;

  // AI Panel
  aiPanelOpen: boolean;
  aiContext: string;
  toggleAIPanel: () => void;
  setAIContext: (ctx: string) => void;

  // In-app notifications
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Global loading
  globalLoading: boolean;
  setGlobalLoading: (v: boolean) => void;

  // Active page context
  activeCVId: string | null;
  activeJobOfferId: string | null;
  setActiveCVId: (id: string | null) => void;
  setActiveJobOfferId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      aiPanelOpen: false,
      aiContext: "general",
      toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
      setAIContext: (ctx) => set({ aiContext: ctx }),

      notifications: [],
      addNotification: (n) =>
        set((s) => ({
          notifications: [
            ...s.notifications,
            { ...n, id: Math.random().toString(36).slice(2), timestamp: Date.now() },
          ].slice(-10), // Keep max 10
        })),
      removeNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      clearNotifications: () => set({ notifications: [] }),

      globalLoading: false,
      setGlobalLoading: (v) => set({ globalLoading: v }),

      activeCVId: null,
      activeJobOfferId: null,
      setActiveCVId: (id) => set({ activeCVId: id }),
      setActiveJobOfferId: (id) => set({ activeJobOfferId: id }),
    }),
    { name: "UIStore" }
  )
);
