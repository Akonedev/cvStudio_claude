"use client";

/**
 * Classic Sidebar template:
 * - Full-height dark sidebar (left) with photo, contact, skills, languages
 * - Main content area: name header, sections
 * - Professional + elegant, dark/light contrast
 */

import { Mail, Phone, MapPin, Linkedin, Github, Globe, User, Briefcase, GraduationCap, Award, FolderOpen, Heart } from "lucide-react";
import type { TemplateRendererProps } from "./template-types";
import { getEnabledSections, fullName, getContactItems, isLightColor } from "./template-types";

const CONTACT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail, phone: Phone, address: MapPin, linkedin: Linkedin, github: Github, website: Globe,
};

export function TemplateClassicSidebar({ data, sections, headerConfig, sidebarConfig, accentColor, fontHeading, fontBody }: TemplateRendererProps) {
  const name = fullName(data);
  const info = data.personalInfo;
  const contactItems = getContactItems(info, headerConfig);
  const enabledSections = getEnabledSections(sections);
  const { summary, experience, education, skills, languages, certifications, projects, hobbies } = data;

  const sidebarBg = sidebarConfig.enabled ? (sidebarConfig.theme === "light-gray" ? "#F4F4F5" : "#1C1917") : "#1C1917";
  const sideLight = isLightColor(sidebarBg);
  const sText = sideLight ? "text-stone-800" : "text-white";
  const sMuted = sideLight ? "text-stone-500" : "text-stone-300";
  const sLabel = sideLight ? "text-stone-600" : "text-stone-400";
  const sBadge = sideLight ? "bg-stone-200 text-stone-700" : "bg-white/10 text-stone-200";

  // Sidebar sections: skills, languages, hobbies, certifications
  const sidebarTypes = new Set(["skills", "languages", "hobbies", "certifications"]);
  const mainSections = enabledSections.filter((s) => !sidebarTypes.has(s.type));

  return (
    <div
      className="bg-white text-stone-900 relative overflow-hidden"
      style={{ width: "210mm", minHeight: "297mm", fontFamily: `'${fontBody}', sans-serif`, fontSize: "9pt", lineHeight: "1.5", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      <div className="flex min-h-[297mm]">
        {/* ── SIDEBAR ──────────────────────────────────────── */}
        <div className="flex-shrink-0 flex flex-col gap-5 p-5" style={{ width: "190px", backgroundColor: sidebarBg, minHeight: "297mm" }}>
          {/* Photo + Name */}
          <div className="text-center mb-1">
            {headerConfig.showPhoto && (
              <div className="w-[72px] h-[72px] rounded-full mx-auto flex items-center justify-center mb-3 border-2 overflow-hidden"
                style={{ borderColor: accentColor, backgroundColor: sideLight ? "#f5f5f4" : "rgba(255,255,255,0.1)" }}>
                {info.photo ? (
                  <img src={info.photo} alt={name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-7 h-7" style={{ color: accentColor }} />
                )}
              </div>
            )}
            {headerConfig.showName && (
              <div className={`text-[11pt] font-bold leading-tight ${sText}`} style={{ fontFamily: `'${fontHeading}', serif` }}>
                {name}
              </div>
            )}
            {headerConfig.showTitle && info.jobTitle && (
              <div className="text-[8pt] mt-1" style={{ color: accentColor }}>{info.jobTitle}</div>
            )}
          </div>

          {/* Contact */}
          {contactItems.length > 0 && (
            <SidebarBlock label="Contact" sLabel={sLabel}>
              <div className="space-y-1.5">
                {contactItems.map((c, i) => {
                  const Icon = CONTACT_ICONS[c.type];
                  return (
                    <div key={i} className={`flex items-start gap-1.5 text-[7pt] ${sMuted}`}>
                      {Icon && <Icon className="w-[10px] h-[10px] mt-0.5 flex-shrink-0" />}
                      <span className="break-all leading-tight">{c.value}</span>
                    </div>
                  );
                })}
              </div>
            </SidebarBlock>
          )}

          {/* Skills */}
          {skills.length > 0 && enabledSections.some((s) => s.type === "skills") && (
            <SidebarBlock label="Compétences" sLabel={sLabel}>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span key={s.id} className={`text-[6pt] rounded px-1.5 py-0.5 ${sBadge}`}>{s.name}</span>
                ))}
              </div>
            </SidebarBlock>
          )}

          {/* Languages */}
          {languages.length > 0 && enabledSections.some((s) => s.type === "languages") && (
            <SidebarBlock label="Langues" sLabel={sLabel}>
              <div className="space-y-1">
                {languages.map((l) => (
                  <div key={l.id} className={`text-[7pt] ${sMuted}`}>
                    <span className={`font-medium ${sText}`}>{l.name}</span>
                    {l.level && <span className="ml-1">({l.level})</span>}
                  </div>
                ))}
              </div>
            </SidebarBlock>
          )}

          {/* Certifications */}
          {certifications.length > 0 && enabledSections.some((s) => s.type === "certifications") && (
            <SidebarBlock label="Certifications" sLabel={sLabel}>
              <div className="space-y-1.5">
                {certifications.map((c) => (
                  <div key={c.id} className="text-[7pt]">
                    <div className={`font-medium ${sText}`}>{c.name}</div>
                    {c.date && <div className={sMuted}>{c.date}</div>}
                  </div>
                ))}
              </div>
            </SidebarBlock>
          )}

          {/* Hobbies */}
          {hobbies.length > 0 && enabledSections.some((s) => s.type === "hobbies") && (
            <SidebarBlock label="Centres d'intérêt" sLabel={sLabel}>
              <div className={`text-[7pt] ${sMuted}`}>{hobbies.join(" · ")}</div>
            </SidebarBlock>
          )}
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <div className="flex-1 p-7 overflow-hidden">
          {/* Header when not in sidebar */}
          {!headerConfig.inSidebar && (
            <div className="mb-6 pb-4" style={{ borderBottom: `3px solid ${accentColor}` }}>
              {headerConfig.showName && (
                <h1 className="text-[22pt] font-bold text-stone-900 leading-none" style={{ fontFamily: `'${fontHeading}', serif` }}>{name}</h1>
              )}
              {headerConfig.showTitle && info.jobTitle && (
                <div className="text-[10pt] mt-1" style={{ color: accentColor }}>{info.jobTitle}</div>
              )}
            </div>
          )}

          {mainSections.map((sec) => {
            const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
              summary: User, experience: Briefcase, education: GraduationCap,
              projects: FolderOpen, hobbies: Heart,
            };
            const Icon = iconMap[sec.type];

            switch (sec.type) {
              case "summary":
                return summary ? (
                  <div key={sec.id} className="mb-5">
                    <MainHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</MainHeading>
                    <p className="text-[8.5pt] text-stone-600 leading-relaxed">{summary}</p>
                  </div>
                ) : null;

              case "experience":
                return experience.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <MainHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</MainHeading>
                    <div className="space-y-4">
                      {experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="font-bold text-[9pt] text-stone-800">{exp.position}</div>
                              <div className="text-[8pt]" style={{ color: accentColor }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
                            </div>
                            <div className="text-[7pt] text-stone-400 whitespace-nowrap">
                              {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Présent" : ""}
                            </div>
                          </div>
                          {exp.bullets.length > 0 && (
                            <ul className="mt-1 space-y-0.5">
                              {exp.bullets.map((b, j) => (
                                <li key={j} className="text-[7.5pt] text-stone-600 pl-3 relative before:absolute before:left-0 before:top-[5px] before:w-[4px] before:h-[4px] before:rounded-full" style={{ ["--tw-before-bg" as string]: accentColor }}>
                                  <span className="inline-block w-1 h-1 rounded-full mr-1.5 -translate-y-[1px]" style={{ backgroundColor: accentColor }} />{b}
                                </li>
                              ))}
                            </ul>
                          )}
                          {!exp.bullets.length && exp.description && (
                            <p className="text-[7.5pt] text-stone-500 mt-1">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "education":
                return education.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <MainHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</MainHeading>
                    <div className="space-y-2">
                      {education.map((edu) => (
                        <div key={edu.id} className="flex justify-between items-start gap-2">
                          <div>
                            <div className="font-semibold text-[9pt] text-stone-800">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</div>
                            <div className="text-[8pt] text-stone-500">{edu.institution}</div>
                          </div>
                          <div className="text-[7pt] text-stone-400 whitespace-nowrap">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "projects":
                return projects.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <MainHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</MainHeading>
                    <div className="space-y-3">
                      {projects.map((p) => (
                        <div key={p.id}>
                          <div className="font-semibold text-[9pt] text-stone-800">{p.name}</div>
                          {p.description && <p className="text-[7.5pt] text-stone-600">{p.description}</p>}
                          {p.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.technologies.map((t, i) => (
                                <span key={i} className="text-[6.5pt] rounded px-1.5 py-0.5" style={{ backgroundColor: `${accentColor}10`, color: accentColor }}>{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}

function SidebarBlock({ label, sLabel, children }: { label: string; sLabel: string; children: React.ReactNode }) {
  return (
    <div>
      <div className={`text-[6.5pt] uppercase tracking-[0.15em] mb-2 font-bold ${sLabel}`}>{label}</div>
      {children}
    </div>
  );
}

function MainHeading({ children, icon: Icon, accent, fontHeading }: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  fontHeading: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-1" style={{ borderBottom: `1.5px solid ${accent}30` }}>
      {Icon && <Icon className="w-[13px] h-[13px]" style={{ color: accent }} />}
      <span className="text-[8pt] uppercase tracking-widest font-bold" style={{ color: accent, fontFamily: `'${fontHeading}', serif` }}>{children}</span>
    </div>
  );
}
