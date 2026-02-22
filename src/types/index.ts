import {
  Role,
  SubscriptionPlan,
  SubscriptionStatus,
  CVStatus,
  SidebarPos,
  ExportFmt,
  CoverLetterStatus,
  JobStatus,
  ApplicationStatus,
  QuestionCategory,
  Difficulty,
  InterviewStatus,
  HistoryAction,
  EntityType,
  AIProviderType,
  NotificationType,
  InvoiceStatus,
} from "@prisma/client";

export type {
  Role,
  SubscriptionPlan,
  SubscriptionStatus,
  CVStatus,
  SidebarPos,
  ExportFmt,
  CoverLetterStatus,
  JobStatus,
  ApplicationStatus,
  QuestionCategory,
  Difficulty,
  InterviewStatus,
  HistoryAction,
  EntityType,
  AIProviderType,
  NotificationType,
  InvoiceStatus,
};

// ─── CV Data JSON Shape ──────────────────────────────────────────────────────

export interface CVPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  photoUrl?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  title?: string;
  summary?: string;
}

export interface CVExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  description: string;
  achievements?: string[];
}

export interface CVEducation {
  id: string;
  school: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: string;
  description?: string;
}

export interface CVSkill {
  id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface CVLanguage {
  id: string;
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native";
}

export interface CVData {
  personalInfo: CVPersonalInfo;
  experiences: CVExperience[];
  educations: CVEducation[];
  skills: CVSkill[];
  languages: CVLanguage[];
  certifications?: { id: string; name: string; issuer?: string; date?: string }[];
  interests?: string[];
  references?: { id: string; name: string; position?: string; contact?: string }[];
  customSections?: { id: string; title: string; content: string }[];
}

// ─── API Response helpers ────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Subscription limits ─────────────────────────────────────────────────────

export interface PlanLimits {
  cvs: number;
  coverLetters: number;
  jobMatches: number;
  aiRequests: number;
  export: string[];
  atsCheck: boolean;
  interviewPrep: boolean;
}

// ─── AI chat ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

// ─── Job scraping ─────────────────────────────────────────────────────────────

export interface ScrapedJob {
  url: string;
  title: string;
  company: string;
  location: string;
  contractType: string;
  salary?: string;
  description: string;
  requirements: string[];
  skills: string[];
  keywords: string[];
  source: string;
}

// ─── ATS analysis ─────────────────────────────────────────────────────────────

export interface ATSResult {
  score: number;
  keywords: {
    matched: string[];
    missing: string[];
  };
  categories: {
    clarity: number;
    format: number;
    keywords: number;
    length: number;
    sections: number;
  };
  suggestions: {
    type: "error" | "warning" | "success" | "info";
    message: string;
    priority: "high" | "medium" | "low";
  }[];
}
