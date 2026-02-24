"use client";

/**
 * Executive template — Faithful to the model CV:
 * - Full-width dark header band with name + title + contact breadcrumb
 * - Section headings: ALL CAPS, bold, with accent underline
 * - No sidebar — single column, professional layout
 * - Skills organized by category in a compact grid
 * - Experience entries with company, role, dates, bullets
 */

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, Code, Languages, Award, FolderOpen, Heart, User } from "lucide-react";
import type { TemplateRendererProps } from "./template-types";
import { getEnabledSections, fullName, getContactItems } from "./template-types";

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  summary: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code,
  languages: Languages,
  certifications: Award,
  projects: FolderOpen,
  hobbies: Heart,
};

const CONTACT_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  email: Mail,
  phone: Phone,
  address: MapPin,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
};

export function TemplateExecutive({ data, sections, headerConfig, accentColor, fontHeading, fontBody }: TemplateRendererProps) {
  const name = fullName(data);
  const info = data.personalInfo;
  const contactItems = getContactItems(info, headerConfig);
  const enabledSections = getEnabledSections(sections);
  const { summary, experience, education, skills, languages, certifications, projects, hobbies } = data;

  return (
    <div
      className="bg-white text-stone-900 relative overflow-hidden"
      style={{ width: "210mm", minHeight: "297mm", fontFamily: `'${fontBody}', sans-serif`, fontSize: "9pt", lineHeight: "1.5", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      {/* ── HEADER BAND ──────────────────────────────────── */}
      <div style={{ backgroundColor: accentColor, padding: "20px 32px 16px" }}>
        {headerConfig.showPhoto && (
          <div className="float-right ml-4">
            <div className="w-[60px] h-[60px] rounded-full border-2 border-white/30 flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              {info.photo ? (
                <img src={info.photo} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white text-[18pt] font-bold">{info.firstName?.[0]?.toUpperCase() ?? ""}{info.lastName?.[0]?.toUpperCase() ?? ""}</span>
              )}
            </div>
          </div>
        )}
        {headerConfig.showName && (
          <h1 className="text-white text-[22pt] font-bold leading-tight tracking-wide" style={{ fontFamily: `'${fontHeading}', serif` }}>
            {name}
          </h1>
        )}
        {headerConfig.showTitle && info.jobTitle && (
          <div className="text-white/80 text-[10pt] font-medium mt-1">{info.jobTitle}</div>
        )}
        {/* Contact breadcrumb */}
        {contactItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[7.5pt] text-white/70">
            {contactItems.map((c, i) => {
              const Icon = CONTACT_ICONS[c.type];
              return (
                <span key={i} className="flex items-center gap-1">
                  {Icon && <Icon className="w-[10px] h-[10px]" />}
                  {c.value}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className="px-8 py-6">
        {enabledSections.map((sec) => {
          const Icon = SECTION_ICONS[sec.type];

          switch (sec.type) {
            case "summary":
              return summary ? (
                <div key={sec.id} className="mb-5">
                  <SectionHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</SectionHeading>
                  <p className="text-[8.5pt] text-stone-600 leading-relaxed">{summary}</p>
                </div>
              ) : null;

            case "experience":
              return experience.length > 0 ? (
                <div key={sec.id} className="mb-5">
                  <SectionHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</SectionHeading>
                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-bold text-[9.5pt] text-stone-800">{exp.position}</div>
                            <div className="text-[8.5pt] font-medium" style={{ color: accentColor }}>
                              {exp.company}{exp.location ? ` | ${exp.location}` : ""}
                            </div>
                          </div>
                          {(exp.startDate || exp.endDate) && (
                            <div className="text-[7.5pt] text-stone-400 whitespace-nowrap pt-0.5">
                              {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Présent" : ""}
                            </div>
                          )}
                        </div>
                        {exp.description && !exp.bullets.length && (
                          <p className="text-[8pt] text-stone-500 mt-1 italic">{exp.description}</p>
                        )}
                        {exp.bullets.length > 0 && (
                          <ul className="mt-1 space-y-0.5">
                            {exp.bullets.map((b, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-[7.5pt] text-stone-600">
                                <span className="mt-[3px] w-[4px] h-[4px] rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;

            case "education":
              return education.length > 0 ? (
                <div key={sec.id} className="mb-5">
                  <SectionHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</SectionHeading>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-[9pt] text-stone-800">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</div>
                          <div className="text-[8pt] text-stone-500">{edu.institution}</div>
                          {edu.description && <p className="text-[7.5pt] text-stone-400 mt-0.5">{edu.description}</p>}
                        </div>
                        {(edu.startDate || edu.endDate) && (
                          <div className="text-[7.5pt] text-stone-400 whitespace-nowrap">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;

            case "skills":
              return skills.length > 0 ? (
                <div key={sec.id} className="mb-5">
                  <SectionHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</SectionHeading>
                  <SkillsGrid skills={skills} accentColor={accentColor} />
                </div>
              ) : null;

            case "languages":
              return languages.length > 0 ? (
                <div key={sec.id} className="mb-5">
                  <SectionHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</SectionHeading>
                  <div className="flex flex-wrap gap-3">
                    {languages.map((l) => (
                      <div key={l.id} className="flex items-center gap-1.5 text-[8pt]">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                        <span className="text-stone-700 font-medium">{l.name}</span>
                        {l.level && <span className="text-stone-400">({l.level})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;

            case "certifications":
              return certifications.length > 0 ? (
                <div key={sec.id} className="mb-5">
                  <SectionHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</SectionHeading>
                  <div className="space-y-1.5">
                    {certifications.map((c) => (
                      <div key={c.id} className="flex items-start gap-2 text-[8pt]">
                        <span className="mt-[3px] w-[4px] h-[4px] rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                        <div>
                          <span className="font-medium text-stone-700">{c.name}</span>
                          {c.issuer && <span className="text-stone-400"> — {c.issuer}</span>}
                          {c.date && <span className="text-stone-400"> ({c.date})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;

            case "projects":
              return projects.length > 0 ? (
                <div key={sec.id} className="mb-5">
                  <SectionHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</SectionHeading>
                  <div className="space-y-3">
                    {projects.map((p) => (
                      <div key={p.id}>
                        <div className="font-semibold text-[9pt] text-stone-800">{p.name}</div>
                        {p.description && <p className="text-[7.5pt] text-stone-600">{p.description}</p>}
                        {p.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.technologies.map((t, i) => (
                              <span key={i} className="text-[6.5pt] rounded px-1.5 py-0.5 font-medium" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;

            case "hobbies":
              return hobbies.length > 0 ? (
                <div key={sec.id} className="mb-5">
                  <SectionHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</SectionHeading>
                  <p className="text-[8pt] text-stone-600">{hobbies.join(" · ")}</p>
                </div>
              ) : null;

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function SectionHeading({ children, icon: Icon, accent, fontHeading }: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  fontHeading: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-1.5" style={{ borderBottom: `2px solid ${accent}` }}>
      {Icon && <Icon className="w-[14px] h-[14px]" style={{ color: accent }} />}
      <span
        className="text-[8pt] uppercase tracking-[0.15em] font-bold"
        style={{ color: accent, fontFamily: `'${fontHeading}', serif` }}
      >
        {children}
      </span>
    </div>
  );
}

function SkillsGrid({ skills, accentColor }: { skills: TemplateRendererProps["data"]["skills"]; accentColor: string }) {
  // Group skills by category
  const grouped: Record<string, string[]> = {};
  for (const s of skills) {
    const cat = s.category || "Autres";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s.name);
  }

  const categories = Object.entries(grouped);
  if (categories.length <= 1) {
    // No categories — just list as badges
    return (
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span key={s.id} className="text-[7pt] rounded px-2 py-0.5 border" style={{ borderColor: `${accentColor}40`, color: accentColor, backgroundColor: `${accentColor}08` }}>
            {s.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      {categories.map(([cat, items]) => (
        <div key={cat}>
          <div className="font-semibold text-[8pt] text-stone-700 mb-0.5">{cat}</div>
          <div className="text-[7.5pt] text-stone-500">{items.join(", ")}</div>
        </div>
      ))}
    </div>
  );
}
