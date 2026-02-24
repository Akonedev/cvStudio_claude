"use client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
  photo: string;
}

export interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
}

export interface CVSection {
  id: string;
  type: string;
  label: string;
  icon: string;
  enabled: boolean;
  order: number;
  inSidebar: boolean;  // If true, renders in sidebar instead of main
}

// ─── Template types ─────────────────────────────────────────────────────────

export interface CVTemplate {
  id: string;
  name: string;
  category: "professional" | "modern" | "creative" | "executive" | "ats";
  description: string;
  accentColor: string;
  sidebarColor: string;
  hasSidebar: boolean;
  sidebarFullHeight: boolean;
  sidebarWidth: "narrow" | "medium" | "wide";
  headerStyle: string;
  fontHeading: string;
  fontBody: string;
  preview: string; // CSS class for thumbnail
}

export interface HeaderConfig {
  style: string; // "classic" | "modern" | "minimal" | "bold" | "gradient" | "split" | "centered" | "banner"
  showPhoto: boolean;
  photoPosition: "left" | "right" | "center";
  showName: boolean;
  showTitle: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showAddress: boolean;
  showLinkedin: boolean;
  showGithub: boolean;
  showWebsite: boolean;
  inSidebar: boolean; // If true, personal info goes in sidebar
}

export interface SidebarConfig {
  enabled: boolean;
  position: "left" | "right";
  theme: string;
  width: "narrow" | "medium" | "wide";
  fullHeight: boolean;
  elements: Record<string, boolean>; // which sections go to sidebar
}

// ─── CV Editor Data ─────────────────────────────────────────────────────────

export interface CVEditorData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  hobbies: string[];
  references: string[];
  [key: string]: unknown;
}

// ─── Store ──────────────────────────────────────────────────────────────────

interface CVEditorStore {
  // CV metadata
  cvId: string | null;
  cvTitle: string;
  template: string;
  status: string;
  atsScore: number | null;

  // Config
  headerConfig: HeaderConfig;
  sidebarConfig: SidebarConfig;
  sections: CVSection[];

  // Data
  data: CVEditorData;

  // UI state
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  activePanel: string;
  showAIPanel: boolean;
  previewScale: number;

  // Actions
  initFromAPI: (cv: Record<string, unknown>) => void;
  setCvTitle: (title: string) => void;
  setTemplate: (template: string) => void;
  setHeaderConfig: (config: Partial<HeaderConfig>) => void;
  setSidebarConfig: (config: Partial<SidebarConfig>) => void;
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  setSummary: (summary: string) => void;
  setExperience: (items: ExperienceItem[]) => void;
  setEducation: (items: EducationItem[]) => void;
  setSkills: (items: SkillItem[]) => void;
  setLanguages: (items: LanguageItem[]) => void;
  setCertifications: (items: CertificationItem[]) => void;
  setProjects: (items: ProjectItem[]) => void;
  setHobbies: (items: string[]) => void;
  toggleSection: (id: string) => void;
  reorderSections: (from: number, to: number) => void;
  setSectionInSidebar: (id: string, inSidebar: boolean) => void;
  setActivePanel: (panel: string) => void;
  setShowAIPanel: (show: boolean) => void;
  setDirty: (dirty: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  getSerializableData: () => Record<string, unknown>;
}

const DEFAULT_SECTIONS: CVSection[] = [
  { id: "summary", type: "summary", label: "Profil / Résumé", icon: "📝", enabled: true, order: 0, inSidebar: false },
  { id: "experience", type: "experience", label: "Expérience professionnelle", icon: "💼", enabled: true, order: 1, inSidebar: false },
  { id: "education", type: "education", label: "Formation", icon: "🎓", enabled: true, order: 2, inSidebar: false },
  { id: "skills", type: "skills", label: "Compétences", icon: "⚡", enabled: true, order: 3, inSidebar: false },
  { id: "languages", type: "languages", label: "Langues", icon: "🌐", enabled: true, order: 4, inSidebar: false },
  { id: "certifications", type: "certifications", label: "Certifications", icon: "🏆", enabled: false, order: 5, inSidebar: false },
  { id: "projects", type: "projects", label: "Projets", icon: "🚀", enabled: false, order: 6, inSidebar: false },
  { id: "volunteering", type: "volunteering", label: "Bénévolat", icon: "🤝", enabled: false, order: 7, inSidebar: false },
  { id: "publications", type: "publications", label: "Publications", icon: "📚", enabled: false, order: 8, inSidebar: false },
  { id: "awards", type: "awards", label: "Distinctions", icon: "🥇", enabled: false, order: 9, inSidebar: false },
  { id: "hobbies", type: "hobbies", label: "Centres d'intérêt", icon: "🎯", enabled: false, order: 10, inSidebar: false },
  { id: "references", type: "references", label: "Références", icon: "👥", enabled: false, order: 11, inSidebar: false },
];

const DEFAULT_HEADER: HeaderConfig = {
  style: "classic",
  showPhoto: false,
  photoPosition: "left",
  showName: true,
  showTitle: true,
  showEmail: true,
  showPhone: true,
  showAddress: true,
  showLinkedin: false,
  showGithub: false,
  showWebsite: false,
  inSidebar: false,
};

const DEFAULT_SIDEBAR: SidebarConfig = {
  enabled: true,
  position: "left",
  theme: "classic-dark",
  width: "medium",
  fullHeight: true,
  elements: {
    photo: true,
    contact: true,
    skills: true,
    languages: true,
    hobbies: false,
    social: false,
  },
};

const DEFAULT_DATA: CVEditorData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    website: "",
    photo: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  hobbies: [],
  references: [],
};

export const useCVEditorStore = create<CVEditorStore>()(
  devtools(
    (set, get) => ({
      cvId: null,
      cvTitle: "",
      template: "modern",
      status: "DRAFT",
      atsScore: null,

      headerConfig: { ...DEFAULT_HEADER },
      sidebarConfig: { ...DEFAULT_SIDEBAR },
      sections: DEFAULT_SECTIONS.map((s) => ({ ...s })),

      data: JSON.parse(JSON.stringify(DEFAULT_DATA)),

      isLoading: false,
      isSaving: false,
      isDirty: false,
      activePanel: "layout",
      showAIPanel: true,
      previewScale: 1,

      initFromAPI: (cv) => {
        const cvData = (cv.data as Record<string, unknown>) ?? {};
        const personal = (cvData.personal as Record<string, unknown>) ??
          (cvData.personalInfo as Record<string, unknown>) ?? {};

        // Parse name - could be "firstName lastName" or just "name"
        let firstName = (personal.firstName as string) ?? "";
        let lastName = (personal.lastName as string) ?? "";
        if (!firstName && !lastName && personal.name) {
          const parts = (personal.name as string).split(" ");
          firstName = parts[0] ?? "";
          lastName = parts.slice(1).join(" ");
        }

        const personalInfo: PersonalInfo = {
          firstName,
          lastName,
          jobTitle: (personal.jobTitle as string) ?? (personal.title as string) ?? "",
          email: (personal.email as string) ?? "",
          phone: (personal.phone as string) ?? "",
          address: (personal.address as string) ?? (personal.location as string) ?? "",
          linkedin: (personal.linkedin as string) ?? "",
          github: (personal.github as string) ?? "",
          website: (personal.website as string) ?? "",
          photo: (personal.photo as string) ?? "",
        };

        // Parse arrays
        const experience = Array.isArray(cvData.experience)
          ? (cvData.experience as Record<string, unknown>[]).map((e, i) => ({
              id: (e.id as string) ?? `exp-${i}`,
              position: (e.position as string) ?? (e.title as string) ?? "",
              company: (e.company as string) ?? "",
              location: (e.location as string) ?? "",
              startDate: (e.startDate as string) ?? "",
              endDate: (e.endDate as string) ?? "",
              current: (e.current as boolean) ?? false,
              description: (e.description as string) ?? "",
              bullets: Array.isArray(e.bullets) ? e.bullets as string[] :
                Array.isArray(e.achievements) ? e.achievements as string[] : [],
            }))
          : [];

        const education = Array.isArray(cvData.education)
          ? (cvData.education as Record<string, unknown>[]).map((e, i) => ({
              id: (e.id as string) ?? `edu-${i}`,
              degree: (e.degree as string) ?? "",
              institution: (e.institution as string) ?? (e.school as string) ?? "",
              field: (e.field as string) ?? "",
              startDate: (e.startDate as string) ?? "",
              endDate: (e.endDate as string) ?? (e.year as string) ?? "",
              description: (e.description as string) ?? "",
            }))
          : [];

        const skills = Array.isArray(cvData.skills)
          ? (cvData.skills as Array<string | Record<string, unknown>>).map((s, i) =>
              typeof s === "string"
                ? { id: `skill-${i}`, name: s, level: 3, category: "" }
                : { id: (s.id as string) ?? `skill-${i}`, name: (s.name as string) ?? "", level: (s.level as number) ?? 3, category: (s.category as string) ?? "" }
            )
          : [];

        const languages = Array.isArray(cvData.languages)
          ? (cvData.languages as Array<string | Record<string, unknown>>).map((l, i) =>
              typeof l === "string"
                ? { id: `lang-${i}`, name: l, level: "" }
                : { id: (l.id as string) ?? `lang-${i}`, name: (l.name as string) ?? "", level: (l.level as string) ?? "" }
            )
          : [];

        const certifications = Array.isArray(cvData.certifications)
          ? (cvData.certifications as Record<string, unknown>[]).map((c, i) => ({
              id: (c.id as string) ?? `cert-${i}`,
              name: (c.name as string) ?? "",
              issuer: (c.issuer as string) ?? "",
              date: (c.date as string) ?? "",
              url: (c.url as string) ?? "",
            }))
          : [];

        const projects = Array.isArray(cvData.projects)
          ? (cvData.projects as Record<string, unknown>[]).map((p, i) => ({
              id: (p.id as string) ?? `proj-${i}`,
              name: (p.name as string) ?? "",
              description: (p.description as string) ?? "",
              technologies: Array.isArray(p.technologies) ? p.technologies as string[] : [],
              url: (p.url as string) ?? "",
            }))
          : [];

        // Parse config from CV
        const headerConfig: HeaderConfig = {
          ...DEFAULT_HEADER,
          ...((cvData.headerConfig as Partial<HeaderConfig>) ?? {}),
        };

        const sidebarConfig: SidebarConfig = {
          ...DEFAULT_SIDEBAR,
          enabled: (cv.hasSidebar as boolean) ?? true,
          position: ((cv.sidebarPos as string)?.toLowerCase() as "left" | "right") ?? "left",
          theme: (cv.sidebarTheme as string) ?? "classic-dark",
          ...((cvData.sidebarConfig as Partial<SidebarConfig>) ?? {}),
        };

        // Parse sections
        const sections = DEFAULT_SECTIONS.map((s) => ({ ...s }));
        if (Array.isArray(cvData.sections)) {
          for (const sec of cvData.sections as Array<Record<string, unknown>>) {
            const existing = sections.find((s) => s.id === sec.id || s.type === sec.type);
            if (existing) {
              existing.enabled = (sec.enabled as boolean) ?? existing.enabled;
              existing.order = (sec.order as number) ?? existing.order;
              existing.inSidebar = (sec.inSidebar as boolean) ?? false;
            }
          }
        } else {
          // Auto-enable sections based on data presence
          const hasData: Record<string, boolean> = {
            summary: !!((cvData.summary as string)?.trim()),
            experience: Array.isArray(cvData.experience) && cvData.experience.length > 0,
            education: Array.isArray(cvData.education) && cvData.education.length > 0,
            skills: skills.length > 0,
            languages: languages.length > 0,
            certifications: certifications.length > 0,
            projects: projects.length > 0,
            hobbies: Array.isArray(cvData.hobbies) && (cvData.hobbies as string[]).length > 0,
            references: Array.isArray(cvData.references) && (cvData.references as string[]).length > 0,
          };
          for (const sec of sections) {
            if (hasData[sec.id]) sec.enabled = true;
          }
        }

        set({
          cvId: cv.id as string,
          cvTitle: (cv.title as string) ?? "",
          template: (cv.template as string) ?? "modern",
          status: (cv.status as string) ?? "DRAFT",
          atsScore: (cv.atsScore as number) ?? null,
          headerConfig,
          sidebarConfig,
          sections: sections.sort((a, b) => a.order - b.order),
          data: {
            personalInfo,
            summary: (cvData.summary as string) ?? (personal.summary as string) ?? "",
            experience,
            education,
            skills,
            languages,
            certifications,
            projects,
            hobbies: Array.isArray(cvData.hobbies) ? cvData.hobbies as string[] : [],
            references: Array.isArray(cvData.references) ? cvData.references as string[] : [],
          },
          isDirty: false,
          isLoading: false,
        });
      },

      setCvTitle: (title) => set({ cvTitle: title, isDirty: true }),

      setTemplate: (templateId) => {
        // Import is lazy to avoid circular dependency at module level
        const { getTemplateById } = require("@/lib/cv-templates");
        const tmpl = getTemplateById(templateId);
        const patch: Partial<CVEditorStore> = {
          template: templateId,
          isDirty: true,
        };
        // Apply template sidebar/header settings
        if (tmpl) {
          patch.sidebarConfig = {
            ...get().sidebarConfig,
            enabled: tmpl.hasSidebar,
            fullHeight: tmpl.sidebarFullHeight,
            width: tmpl.sidebarWidth,
          };
          patch.headerConfig = {
            ...get().headerConfig,
            style: tmpl.headerStyle,
          };
        }
        set(patch);
      },

      setHeaderConfig: (config) =>
        set((s) => ({ headerConfig: { ...s.headerConfig, ...config }, isDirty: true })),

      setSidebarConfig: (config) =>
        set((s) => ({ sidebarConfig: { ...s.sidebarConfig, ...config }, isDirty: true })),

      updatePersonalInfo: (field, value) =>
        set((s) => ({
          data: {
            ...s.data,
            personalInfo: { ...s.data.personalInfo, [field]: value },
          },
          isDirty: true,
        })),

      setSummary: (summary) =>
        set((s) => ({ data: { ...s.data, summary }, isDirty: true })),

      setExperience: (items) =>
        set((s) => ({ data: { ...s.data, experience: items }, isDirty: true })),

      setEducation: (items) =>
        set((s) => ({ data: { ...s.data, education: items }, isDirty: true })),

      setSkills: (items) =>
        set((s) => ({ data: { ...s.data, skills: items }, isDirty: true })),

      setLanguages: (items) =>
        set((s) => ({ data: { ...s.data, languages: items }, isDirty: true })),

      setCertifications: (items) =>
        set((s) => ({ data: { ...s.data, certifications: items }, isDirty: true })),

      setProjects: (items) =>
        set((s) => ({ data: { ...s.data, projects: items }, isDirty: true })),

      setHobbies: (items) =>
        set((s) => ({ data: { ...s.data, hobbies: items }, isDirty: true })),

      toggleSection: (id) =>
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
          ),
          isDirty: true,
        })),

      reorderSections: (from, to) =>
        set((s) => {
          const arr = [...s.sections];
          const [item] = arr.splice(from, 1);
          arr.splice(to, 0, item);
          return {
            sections: arr.map((sec, i) => ({ ...sec, order: i })),
            isDirty: true,
          };
        }),

      setSectionInSidebar: (id, inSidebar) =>
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, inSidebar } : sec
          ),
          isDirty: true,
        })),

      setActivePanel: (panel) => set({ activePanel: panel }),
      setShowAIPanel: (show) => set({ showAIPanel: show }),
      setDirty: (dirty) => set({ isDirty: dirty }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSaving: (saving) => set({ isSaving: saving }),

      getSerializableData: () => {
        const s = get();
        return {
          title: s.cvTitle,
          template: s.template,
          hasSidebar: s.sidebarConfig.enabled,
          sidebarPos: s.sidebarConfig.position.toUpperCase(),
          sidebarTheme: s.sidebarConfig.theme,
          headerStyle: s.headerConfig.style,
          data: {
            personalInfo: s.data.personalInfo,
            summary: s.data.summary,
            experience: s.data.experience,
            education: s.data.education,
            skills: s.data.skills,
            languages: s.data.languages,
            certifications: s.data.certifications,
            projects: s.data.projects,
            hobbies: s.data.hobbies,
            references: s.data.references,
            headerConfig: s.headerConfig,
            sidebarConfig: s.sidebarConfig,
            sections: s.sections,
          },
        };
      },
    }),
    { name: "CVEditorStore" }
  )
);
