"use client";

/**
 * Compact 2-column template:
 * - Full-width header (name + title + contact inline)
 * - Two equal columns below: left (experience), right (education, skills, languages, certifications, etc.)
 * - Dense, information-packed, ATS-friendly, minimal decoration
 */

import { Mail, Phone, MapPin, Linkedin, Github, Globe, ChevronRight } from "lucide-react";
import type { TemplateRendererProps } from "./template-types";
import { getEnabledSections, fullName, getContactItems, alphaColor } from "./template-types";

const CONTACT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail, phone: Phone, address: MapPin, linkedin: Linkedin, github: Github, website: Globe,
};

export function TemplateCompact({ data, sections, headerConfig, accentColor, fontHeading, fontBody }: TemplateRendererProps) {
  const name = fullName(data);
  const info = data.personalInfo;
  const contactItems = getContactItems(info, headerConfig);
  const enabledSections = getEnabledSections(sections);
  const { summary, experience, education, skills, languages, certifications, projects, hobbies } = data;

  // Split sections: experience + projects go left, rest goes right
  const leftTypes = new Set(["experience", "projects"]);
  const leftSections = enabledSections.filter((s) => leftTypes.has(s.type));
  const rightSections = enabledSections.filter((s) => !leftTypes.has(s.type) && s.type !== "summary");

  return (
    <div
      className="bg-white text-stone-900 relative overflow-hidden"
      style={{ width: "210mm", minHeight: "297mm", fontFamily: `'${fontBody}', sans-serif`, fontSize: "8.5pt", lineHeight: "1.45", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      {/* ── HEADER ───────────────────────────────────── */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            {headerConfig.showName && (
              <h1 className="text-[20pt] font-bold text-stone-900 leading-none" style={{ fontFamily: `'${fontHeading}', serif` }}>
                {name}
              </h1>
            )}
            {headerConfig.showTitle && info.jobTitle && (
              <div className="text-[9pt] mt-1 font-medium" style={{ color: accentColor }}>{info.jobTitle}</div>
            )}
          </div>
          {contactItems.length > 0 && (
            <div className="flex flex-col items-end gap-0.5">
              {contactItems.map((c, i) => {
                const Icon = CONTACT_ICONS[c.type];
                return (
                  <span key={i} className="flex items-center gap-1 text-[7pt] text-stone-500">
                    <span className="break-all">{c.value}</span>
                    {Icon && <span style={{ color: accentColor }}><Icon className="w-[9px] h-[9px] flex-shrink-0" /></span>}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <div className="h-[2px] mt-3" style={{ backgroundColor: accentColor }} />
      </div>

      {/* ── SUMMARY ──────────────────────────────────── */}
      {summary && enabledSections.some((s) => s.type === "summary") && (
        <div className="px-6 pb-3">
          <p className="text-[8pt] text-stone-600 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* ── TWO COLUMNS ─────────────────────────────── */}
      <div className="flex gap-5 px-6 pb-6">
        {/* LEFT: Experience + Projects (larger column) */}
        <div className="flex-[3]">
          {leftSections.map((sec) => {
            switch (sec.type) {
              case "experience":
                return experience.length > 0 ? (
                  <div key={sec.id} className="mb-4">
                    <CompactHeading accent={accentColor} fontHeading={fontHeading}>{sec.label}</CompactHeading>
                    <div className="space-y-2.5">
                      {experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-baseline gap-2">
                            <div className="font-bold text-[8.5pt] text-stone-800">{exp.position}</div>
                            <div className="text-[6.5pt] text-stone-400 whitespace-nowrap flex-shrink-0">
                              {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Présent" : ""}
                            </div>
                          </div>
                          <div className="text-[7.5pt] font-medium" style={{ color: accentColor }}>
                            {exp.company}{exp.location ? ` | ${exp.location}` : ""}
                          </div>
                          {exp.bullets.length > 0 && (
                            <ul className="mt-0.5 space-y-0">
                              {exp.bullets.map((b, j) => (
                                <li key={j} className="text-[7pt] text-stone-600 flex items-start gap-1">
                                  <span style={{ color: accentColor }}><ChevronRight className="w-[8px] h-[8px] mt-[2px] flex-shrink-0" /></span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {!exp.bullets.length && exp.description && (
                            <p className="text-[7pt] text-stone-500 mt-0.5">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "projects":
                return projects.length > 0 ? (
                  <div key={sec.id} className="mb-4">
                    <CompactHeading accent={accentColor} fontHeading={fontHeading}>{sec.label}</CompactHeading>
                    <div className="space-y-2">
                      {projects.map((p) => (
                        <div key={p.id}>
                          <div className="font-semibold text-[8pt] text-stone-800">{p.name}</div>
                          {p.description && <p className="text-[7pt] text-stone-600">{p.description}</p>}
                          {p.technologies.length > 0 && (
                            <div className="text-[6.5pt] text-stone-400 mt-0.5">{p.technologies.join(" · ")}</div>
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

        {/* Vertical separator */}
        <div className="w-px flex-shrink-0" style={{ backgroundColor: alphaColor(accentColor, 0.15) }} />

        {/* RIGHT: Education, Skills, Languages, Certifications, Hobbies */}
        <div className="flex-[2]">
          {rightSections.map((sec) => {
            switch (sec.type) {
              case "education":
                return education.length > 0 ? (
                  <div key={sec.id} className="mb-4">
                    <CompactHeading accent={accentColor} fontHeading={fontHeading}>{sec.label}</CompactHeading>
                    <div className="space-y-1.5">
                      {education.map((edu) => (
                        <div key={edu.id}>
                          <div className="font-semibold text-[8pt] text-stone-800">{edu.degree}</div>
                          {edu.field && <div className="text-[7pt] text-stone-500">{edu.field}</div>}
                          <div className="text-[7pt] text-stone-400">{edu.institution} | {edu.startDate}{edu.endDate ? `–${edu.endDate}` : ""}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "skills":
                return skills.length > 0 ? (
                  <div key={sec.id} className="mb-4">
                    <CompactHeading accent={accentColor} fontHeading={fontHeading}>{sec.label}</CompactHeading>
                    {(() => {
                      const groups: Record<string, typeof skills> = {};
                      skills.forEach((s) => { const cat = s.category || "Autres"; (groups[cat] ??= []).push(s); });
                      return Object.entries(groups).map(([cat, items]) => (
                        <div key={cat} className="mb-1.5">
                          <div className="text-[6.5pt] font-bold text-stone-500 uppercase tracking-wider">{cat}</div>
                          <div className="text-[7pt] text-stone-700">{items.map((i) => i.name).join(" · ")}</div>
                        </div>
                      ));
                    })()}
                  </div>
                ) : null;

              case "languages":
                return languages.length > 0 ? (
                  <div key={sec.id} className="mb-4">
                    <CompactHeading accent={accentColor} fontHeading={fontHeading}>{sec.label}</CompactHeading>
                    <div className="space-y-0.5">
                      {languages.map((l) => (
                        <div key={l.id} className="flex justify-between text-[7.5pt]">
                          <span className="text-stone-700 font-medium">{l.name}</span>
                          {l.level && <span className="text-stone-400">{l.level}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "certifications":
                return certifications.length > 0 ? (
                  <div key={sec.id} className="mb-4">
                    <CompactHeading accent={accentColor} fontHeading={fontHeading}>{sec.label}</CompactHeading>
                    <div className="space-y-1">
                      {certifications.map((c) => (
                        <div key={c.id} className="text-[7pt]">
                          <span className="text-stone-700">{c.name}</span>
                          {c.date && <span className="text-stone-400 ml-1">({c.date})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "hobbies":
                return hobbies.length > 0 ? (
                  <div key={sec.id} className="mb-4">
                    <CompactHeading accent={accentColor} fontHeading={fontHeading}>{sec.label}</CompactHeading>
                    <div className="text-[7pt] text-stone-600">{hobbies.join(" · ")}</div>
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

function CompactHeading({ children, accent, fontHeading }: { children: React.ReactNode; accent: string; fontHeading: string }) {
  return (
    <div className="mb-2 pb-0.5" style={{ borderBottom: `1.5px solid ${accent}` }}>
      <span className="text-[7.5pt] uppercase tracking-[0.18em] font-bold" style={{ color: accent, fontFamily: `'${fontHeading}', serif` }}>
        {children}
      </span>
    </div>
  );
}
