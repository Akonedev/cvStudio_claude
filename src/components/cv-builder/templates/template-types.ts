/**
 * Shared types and helpers for CV template renderers.
 */
import type {
  CVEditorData,
  CVSection,
  HeaderConfig,
  SidebarConfig,
} from "@/store/cv-editor-store";

export interface TemplateRendererProps {
  data: CVEditorData;
  sections: CVSection[];
  headerConfig: HeaderConfig;
  sidebarConfig: SidebarConfig;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
}

/** Utility: get sections that are enabled, sorted by order */
export function getEnabledSections(sections: CVSection[]) {
  return sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order);
}

/** Build full name */
export function fullName(data: CVEditorData): string {
  return [data.personalInfo.firstName, data.personalInfo.lastName]
    .filter(Boolean)
    .join(" ") || "Votre Nom";
}

/** Contact items array */
export function getContactItems(
  info: CVEditorData["personalInfo"],
  hc: HeaderConfig
) {
  return [
    hc.showEmail && info.email && { type: "email" as const, value: info.email },
    hc.showPhone && info.phone && { type: "phone" as const, value: info.phone },
    hc.showAddress &&
      info.address && { type: "address" as const, value: info.address },
    hc.showLinkedin &&
      info.linkedin && { type: "linkedin" as const, value: info.linkedin },
    hc.showGithub &&
      info.github && { type: "github" as const, value: info.github },
    hc.showWebsite &&
      info.website && { type: "website" as const, value: info.website },
  ].filter(Boolean) as Array<{
    type: "email" | "phone" | "address" | "linkedin" | "github" | "website";
    value: string;
  }>;
}

/** Hex color luminance check */
export function isLightColor(color: string): boolean {
  if (!color || color === "transparent") return true;
  const hex = color.replace("#", "");
  if (hex.length !== 6) return true;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

/** Lighten a hex color */
export function lightenColor(hex: string, percent: number): string {
  const c = hex.replace("#", "");
  const r = Math.min(255, parseInt(c.slice(0, 2), 16) + Math.round(255 * percent / 100));
  const g = Math.min(255, parseInt(c.slice(2, 4), 16) + Math.round(255 * percent / 100));
  const b = Math.min(255, parseInt(c.slice(4, 6), 16) + Math.round(255 * percent / 100));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Make a semi-transparent color */
export function alphaColor(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
