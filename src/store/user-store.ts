"use client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  jobTitle: string | null;
  sector: string | null;
  phone: string | null;
  role: string;
}

export interface Subscription {
  id: string;
  plan: "FREE" | "PRO" | "ELITE";
  status: "ACTIVE" | "CANCELED" | "TRIALING" | "PAST_DUE" | "INACTIVE";
  currentPeriodEnd: string | null;
}

interface UserStore {
  user: UserProfile | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;

  setUser: (user: UserProfile | null) => void;
  setSubscription: (sub: Subscription | null) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  setAuthenticated: (v: boolean) => void;
  setLoadingUser: (v: boolean) => void;
  logout: () => void;
  isPro: () => boolean;
  isElite: () => boolean;
  isAdmin: () => boolean;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        subscription: null,
        isAuthenticated: false,
        isLoadingUser: false,

        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setSubscription: (subscription) => set({ subscription }),
        updateUser: (data) =>
          set((s) => ({ user: s.user ? { ...s.user, ...data } : null })),
        setAuthenticated: (v) => set({ isAuthenticated: v }),
        setLoadingUser: (v) => set({ isLoadingUser: v }),
        logout: () => set({ user: null, subscription: null, isAuthenticated: false }),

        isPro: () => {
          const plan = get().subscription?.plan;
          return plan === "PRO" || plan === "ELITE";
        },
        isElite: () => get().subscription?.plan === "ELITE",
        isAdmin: () => ["ADMIN", "SUPER_ADMIN"].includes(get().user?.role ?? ""),
      }),
      {
        name: "cvstudio-user",
        partialize: (s) => ({ user: s.user, subscription: s.subscription }),
      }
    ),
    { name: "UserStore" }
  )
);
