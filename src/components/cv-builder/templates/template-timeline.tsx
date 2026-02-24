"use client";

/**
 * Timeline template:
 * - Centered header with name + title + contact breadcrumb
 * - Vertical timeline line for experience/education
 * - Skills as horizontal bar with badges
 * - Visual, chronological emphasis
 */

import { Mail, Phone, MapPin, Linkedin, Github, Globe, User, Briefcase, GraduationCap, Award, Languages, FolderOpen, Heart, Calendar } from "lucide-react";
import type { TemplateRendererProps } from "./template-types";
import { getEnabledSections, fullName, getContactItems, alphaColor } from "./template-types";

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  summary: User, experience: Briefcase, education: GraduationCap,
  skills: Award, languages: Languages, certifications: Award,
  projects: FolderOpen, hobbies: Heart,
};

const CONTACT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail, phone: Phone, address: MapPin, linkedin: Linkedin, github: Github, website: Globe,
};

export function TemplateTimeline({ data, sections, headerConfig, accentColor, fontHeading, fontBody }: TemplateRendererProps) {
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
      {/* ── HEADER ───────────────────────────────────── */}
      <div className="text-center py-6 px-8" style={{ borderBottom: `3px solid ${accentColor}` }}>
        {headerConfig.showName && (
          <h1 className="text-[26pt] font-bold text-stone-900 leading-none" style={{ fontFamily: `'${fontHeading}', serif` }}>
            {name}
          </h1>
        )}
        {headerConfig.showTitle && info.jobTitle && (
          <div className="text-[11pt] mt-2 font-medium" style={{ color: accentColor }}>{info.jobTitle}</div>
        )}
        {/* Contact breadcrumb line */}
        {contactItems.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {contactItems.map((c, i) => {
              const Icon = CONTACT_ICONS[c.type];
              return (
                <span key={i} className="flex items-center gap-1 text-[7.5pt] text-stone-500">
                  {Icon && <Icon className="w-[10px] h-[10px]" />}
                  <span>{c.value}</span>
                  {i < contactItems.length - 1 && <span className="ml-2 text-stone-300">|</span>}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-8 py-6">
        {enabledSections.map((sec) => {
          switch (sec.type) {
            case "summary":
              return summary ? (
                <div key={sec.id} className="mb-6">
                  <SectionTitle label={sec.label} type={sec.type} accent={accentColor} fontHeading={fontHeading} />
                  <p className="text-[8.5pt] text-stone-600 leading-relaxed pl-6">{summary}</p>
                </div>
              ) : null;

            case "skills":
              return skills.length > 0 ? (
                <div key={sec.id} className="mb-6">
                  <SectionTitle label={sec.label} type={sec.type} accent={accentColor} fontHeading={fontHeading} />
                  {/* Group by category */}
                  <div className="pl-6">
                    {(() => {
                      const groups: Record<string, typeof skills> = {};
                      skills.forEach((s) => { const cat = s.category || "Autres"; (groups[cat] ??= []).push(s); });
                      return Object.entries(groups).map(([cat, items]) => (
                        <div key={cat} className="mb-2">
                          <span className="text-[7pt] font-bold text-stone-500 uppercase tracking-wider">{cat}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {items.map((s) => (
                              <span key={s.id} className="text-[6.5pt] rounded-full px-2 py-0.5 font-medium"
                                style={{ backgroundColor: alphaColor(accentColor, 0.1), color: accentColor }}>
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              ) : null;

            case "experience":
              return experience.length > 0 ? (
                <div key={sec.id} className="mb-6">
                  <SectionTitle label={sec.label} type={sec.type} accent={accentColor} fontHeading={fontHeading} />
                  <div className="relative pl-6">
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-0 bottom-0 w-[2px]" style={{ backgroundColor: alphaColor(accentColor, 0.2) }} />
                    <div className="space-y-4">
                      {experience.map((exp) => (
                        <div key={exp.id} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[19px] top-[3px] w-[10px] h-[10px] rounded-full border-2 bg-white z-10"
                            style={{ borderColor: accentColor }} />
                          <div className="flex items-center gap-2 mb-0.5">
                            <Calendar className="w-[9px] h-[9px] text-stone-400" />
                            <span className="text-[7pt] text-stone-400">
                              {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Présent" : ""}
                            </span>
                          </div>
                          <div className="font-bold text-[9pt] text-stone-800">{exp.position}</div>
                          <div className="text-[8pt]" style={{ color: accentColor }}>
                            {exp.company}{exp.location ? ` — ${exp.location}` : ""}
                          </div>
                          {exp.bullets.length > 0 && (
                            <ul className="mt-1 space-y-0.5">
                              {exp.bullets.map((b, j) => (
                                <li key={j} className="text-[7.5pt] text-stone-600 flex items-start gap-1.5">
                                  <span className="w-1 h-1 rounded-full mt-[5px] flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                          {!exp.bullets.length && exp.description && (
                            <p className="text-[7.5pt] text-stone-500 mt-0.5">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null;

            case "education":
              return education.length > 0 ? (
                <div key={sec.id} className="mb-6">
                  <SectionTitle label={sec.label} type={sec.type} accent={accentColor} fontHeading={fontHeading} />
                  <div className="relative pl-6">
                    <div className="absolute left-[7px] top-0 bottom-0 w-[2px]" style={{ backgroundColor: alphaColor(accentColor, 0.2) }} />
                    <div className="space-y-3">
                      {education.map((edu) => (
                        <div key={edu.id} className="relative">
                          <div className="absolute -left-[19px] top-[3px] w-[10px] h-[10px] rounded-full border-2 bg-white z-10"
                            style={{ borderColor: accentColor }} />
                          <div className="flex items-center gap-2 mb-0.5">
                            <Calendar className="w-[9px] h-[9px] text-stone-400" />
                            <span className="text-[7pt] text-stone-400">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</span>
                          </div>
                          <div className="font-semibold text-[9pt] text-stone-800">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</div>
                          <div className="text-[8pt] text-stone-500">{edu.institution}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null;

            case "languages":
              return languages.length > 0 ? (
                <div key={sec.id} className="mb-6">
                  <SectionTitle label={sec.label} type={sec.type} accent={accentColor} fontHeading={fontHeading} />
                  <div className="flex flex-wrap gap-3 pl-6">
                    {languages.map((l) => (
                      <div key={l.id} className="text-[8pt]">
                        <span className="font-medium text-stone-800">{l.name}</span>
                        {l.level && <span className="text-stone-400 ml-1">({l.level})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;

            case "certifications":
              return certifications.length > 0 ? (
                <div key={sec.id} className="mb-6">
                  <SectionTitle label={sec.label} type={sec.type} accent={accentColor} fontHeading={fontHeading} />
                  <div className="space-y-1 pl-6">
                    {certifications.map((c) => (
                      <div key={c.id} className="flex items-start gap-2 text-[8pt]">
                        <Award className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                        <span className="text-stone-700">{c.name}{c.date ? ` (${c.date})` : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;

            case "projects":
              return projects.length > 0 ? (
                <div key={sec.id} className="mb-6">
                  <SectionTitle label={sec.label} type={sec.type} accent={accentColor} fontHeading={fontHeading} />
                  <div className="space-y-3 pl-6">
                    {projects.map((p) => (
                      <div key={p.id}>
                        <div className="font-semibold text-[9pt] text-stone-800">{p.name}</div>
                        {p.description && <p className="text-[7.5pt] text-stone-600">{p.description}</p>}
                        {p.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.technologies.map((t, i) => (
                              <span key={i} className="text-[6pt] rounded px-1.5 py-0.5" style={{ backgroundColor: alphaColor(accentColor, 0.1), color: accentColor }}>{t}</span>
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
                <div key={sec.id} className="mb-6">
                  <SectionTitle label={sec.label} type={sec.type} accent={accentColor} fontHeading={fontHeading} />
                  <div className="pl-6 text-[8pt] text-stone-600">{hobbies.join(" · ")}</div>
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

function SectionTitle({ label, type, accent, fontHeading }: { label: string; type: string; accent: string; fontHeading: string }) {
  const Icon = SECTION_ICONS[type];
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: alphaColor(accent, 0.12) }}>
          <Icon className="w-3 h-3" style={{ color: accent }} />
        </div>
      )}
      <span className="text-[9pt] uppercase tracking-[0.15em] font-bold" style={{ color: accent, fontFamily: `'${fontHeading}', serif` }}>{label}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: alphaColor(accent, 0.15) }} />
    </div>
  );
}
