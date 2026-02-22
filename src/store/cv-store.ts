"use client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface CVData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
    photo?: string;
  };
  summary?: string;
  experience?: Array<{
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    achievements?: string[];
  }>;
  education?: Array<{
    id: string;
    institution: string;
    degree: string;
    field?: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  skills?: Array<{ id: string; name: string; level?: number; category?: string }>;
  languages?: Array<{ id: string; name: string; level: string }>;
  certifications?: Array<{ id: string; name: string; issuer?: string; date?: string }>;
  projects?: Array<{ id: string; name: string; description?: string; technologies?: string[]; url?: string }>;
  [key: string]: unknown;
}

export interface CV {
  id: string;
  title: string;
  template: string;
  status: string;
  atsScore: number | null;
  isActive: boolean;
  sidebarEnabled: boolean;
  sidebarPosition: string;
  sidebarStyle?: string;
  headerTemplate?: string;
  data: CVData;
  createdAt: string;
  updatedAt: string;
}

interface CVStore {
  cvs: CV[];
  activeCV: CV | null;
  selectedCV: CV | null;
  isLoading: boolean;
  isSaving: boolean;
  unsavedChanges: boolean;
  atsAnalysis: Record<string, unknown> | null;

  // Actions
  setCVs: (cvs: CV[]) => void;
  setActiveCV: (cv: CV | null) => void;
  setSelectedCV: (cv: CV | null) => void;
  updateSelectedCV: (data: Partial<CV>) => void;
  updateCVData: (path: keyof CVData, value: unknown) => void;
  setUnsavedChanges: (v: boolean) => void;
  setAtsAnalysis: (analysis: Record<string, unknown> | null) => void;
  setLoading: (v: boolean) => void;
  setSaving: (v: boolean) => void;
  removeCVFromList: (id: string) => void;
  addCVToList: (cv: CV) => void;
  updateCVInList: (id: string, data: Partial<CV>) => void;
}

export const useCVStore = create<CVStore>()(
  devtools(
    persist(
      (set, get) => ({
        cvs: [],
        activeCV: null,
        selectedCV: null,
        isLoading: false,
        isSaving: false,
        unsavedChanges: false,
        atsAnalysis: null,

        setCVs: (cvs) => {
          set({ cvs, activeCV: cvs.find((c) => c.isActive) ?? cvs[0] ?? null });
        },
        setActiveCV: (cv) => set({ activeCV: cv }),
        setSelectedCV: (cv) => set({ selectedCV: cv, unsavedChanges: false }),
        updateSelectedCV: (data) =>
          set((s) => ({
            selectedCV: s.selectedCV ? { ...s.selectedCV, ...data } : null,
            unsavedChanges: true,
          })),
        updateCVData: (path, value) =>
          set((s) => {
            if (!s.selectedCV) return s;
            return {
              selectedCV: {
                ...s.selectedCV,
                data: { ...s.selectedCV.data, [path]: value },
              },
              unsavedChanges: true,
            };
          }),
        setUnsavedChanges: (v) => set({ unsavedChanges: v }),
        setAtsAnalysis: (analysis) => set({ atsAnalysis: analysis }),
        setLoading: (v) => set({ isLoading: v }),
        setSaving: (v) => set({ isSaving: v }),
        removeCVFromList: (id) =>
          set((s) => ({ cvs: s.cvs.filter((c) => c.id !== id) })),
        addCVToList: (cv) => set((s) => ({ cvs: [cv, ...s.cvs] })),
        updateCVInList: (id, data) =>
          set((s) => ({
            cvs: s.cvs.map((c) => (c.id === id ? { ...c, ...data } : c)),
          })),
      }),
      { name: "cvstudio-cv", partialize: (s) => ({ activeCV: s.activeCV }) }
    ),
    { name: "CVStore" }
  )
);
