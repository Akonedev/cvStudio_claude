"use client";

/**
 * Creative Modern template:
 * - Gradient header with name + title overlay
 * - Card-style sections with subtle shadows
 * - Progress bars for languages
 * - Rounded badges for skills
 * - Icon-rich, colorful, modern aesthetic
 */

import { Mail, Phone, MapPin, Linkedin, Github, Globe, User, Briefcase, GraduationCap, Award, Languages, FolderOpen, Heart, Star, Sparkles } from "lucide-react";
import type { TemplateRendererProps } from "./template-types";
import { getEnabledSections, fullName, getContactItems, alphaColor } from "./template-types";

const CONTACT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail, phone: Phone, address: MapPin, linkedin: Linkedin, github: Github, website: Globe,
};

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  summary: Sparkles, experience: Briefcase, education: GraduationCap,
  skills: Star, languages: Languages, certifications: Award,
  projects: FolderOpen, hobbies: Heart,
};

const LANG_LEVELS: Record<string, number> = {
  "Natif": 100, "Langue maternelle": 100, "Bilingue": 95, "Courant": 85, "Avancé": 75,
  "Intermédiaire": 55, "Intermédiaire supérieur": 65, "Élémentaire": 35, "Débutant": 15,
  "C2": 100, "C1": 85, "B2": 70, "B1": 55, "A2": 35, "A1": 15,
};

export function TemplateCreative({ data, sections, headerConfig, accentColor, fontHeading, fontBody }: TemplateRendererProps) {
  const name = fullName(data);
  const info = data.personalInfo;
  const contactItems = getContactItems(info, headerConfig);
  const enabledSections = getEnabledSections(sections);
  const { summary, experience, education, skills, languages, certifications, projects, hobbies } = data;

  return (
    <div
      className="bg-stone-50 text-stone-900 relative overflow-hidden"
      style={{ width: "210mm", minHeight: "297mm", fontFamily: `'${fontBody}', sans-serif`, fontSize: "9pt", lineHeight: "1.5", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      {/* ── GRADIENT HEADER ──────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${alphaColor(accentColor, 0.7)} 50%, ${accentColor}99 100%)` }}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
        <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />

        <div className="relative z-10 px-8 py-7 flex items-center gap-6">
          {headerConfig.showPhoto && (
            <div className="w-[80px] h-[80px] rounded-2xl border-3 border-white/30 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white/10">
              {info.photo ? (
                <img src={info.photo} alt={name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white/60" />
              )}
            </div>
          )}
          <div className="flex-1">
            {headerConfig.showName && (
              <h1 className="text-[24pt] font-bold text-white leading-none" style={{ fontFamily: `'${fontHeading}', serif` }}>
                {name}
              </h1>
            )}
            {headerConfig.showTitle && info.jobTitle && (
              <div className="text-[11pt] text-white/80 mt-1 font-medium">{info.jobTitle}</div>
            )}
            {contactItems.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {contactItems.map((c, i) => {
                  const Icon = CONTACT_ICONS[c.type];
                  return (
                    <span key={i} className="flex items-center gap-1 text-[7pt] text-white/70 bg-white/10 rounded-full px-2.5 py-0.5">
                      {Icon && <Icon className="w-[9px] h-[9px]" />}
                      <span>{c.value}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────── */}
      <div className="px-6 py-5 space-y-4">
        {enabledSections.map((sec) => {
          const Icon = SECTION_ICONS[sec.type];

          switch (sec.type) {
            case "summary":
              return summary ? (
                <Card key={sec.id}>
                  <CreativeHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</CreativeHeading>
                  <p className="text-[8.5pt] text-stone-600 leading-relaxed italic">{summary}</p>
                </Card>
              ) : null;

            case "skills":
              return skills.length > 0 ? (
                <Card key={sec.id}>
                  <CreativeHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</CreativeHeading>
                  {(() => {
                    const groups: Record<string, typeof skills> = {};
                    skills.forEach((s) => { const cat = s.category || "Autres"; (groups[cat] ??= []).push(s); });
                    return (
                      <div className="space-y-3">
                        {Object.entries(groups).map(([cat, items]) => (
                          <div key={cat}>
                            <div className="text-[7pt] font-bold uppercase tracking-wider mb-1.5" style={{ color: accentColor }}>{cat}</div>
                            <div className="flex flex-wrap gap-1.5">
                              {items.map((s) => (
                                <span key={s.id} className="text-[7pt] rounded-full px-2.5 py-1 font-medium border"
                                  style={{ borderColor: alphaColor(accentColor, 0.3), color: accentColor, backgroundColor: alphaColor(accentColor, 0.05) }}>
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </Card>
              ) : null;

            case "experience":
              return experience.length > 0 ? (
                <Card key={sec.id}>
                  <CreativeHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</CreativeHeading>
                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div key={exp.id} className="relative pl-4" style={{ borderLeft: `3px solid ${alphaColor(accentColor, 0.2)}` }}>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="font-bold text-[9pt] text-stone-800">{exp.position}</div>
                            <div className="text-[8pt] flex items-center gap-1">
                              <Briefcase className="w-[9px] h-[9px]" style={{ color: accentColor }} />
                              <span style={{ color: accentColor }}>{exp.company}</span>
                              {exp.location && <span className="text-stone-400"> · {exp.location}</span>}
                            </div>
                          </div>
                          <span className="text-[7pt] text-white font-medium rounded-full px-2 py-0.5 whitespace-nowrap"
                            style={{ backgroundColor: accentColor }}>
                            {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Présent" : ""}
                          </span>
                        </div>
                        {exp.bullets.length > 0 && (
                          <ul className="mt-1.5 space-y-0.5">
                            {exp.bullets.map((b, j) => (
                              <li key={j} className="text-[7.5pt] text-stone-600 flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full mt-[4px] flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                {b}
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
                </Card>
              ) : null;

            case "education":
              return education.length > 0 ? (
                <Card key={sec.id}>
                  <CreativeHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</CreativeHeading>
                  <div className="space-y-2.5">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: alphaColor(accentColor, 0.1) }}>
                          <GraduationCap className="w-4 h-4" style={{ color: accentColor }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[8.5pt] text-stone-800">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</div>
                          <div className="text-[7.5pt] text-stone-500">{edu.institution}</div>
                          <div className="text-[7pt] text-stone-400">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null;

            case "languages":
              return languages.length > 0 ? (
                <Card key={sec.id}>
                  <CreativeHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</CreativeHeading>
                  <div className="space-y-2">
                    {languages.map((l) => {
                      const pct = LANG_LEVELS[l.level || ""] || 50;
                      return (
                        <div key={l.id}>
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className="text-[8pt] font-medium text-stone-700">{l.name}</span>
                            {l.level && <span className="text-[7pt] text-stone-400">{l.level}</span>}
                          </div>
                          <div className="h-1.5 rounded-full bg-stone-200 overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: accentColor }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ) : null;

            case "certifications":
              return certifications.length > 0 ? (
                <Card key={sec.id}>
                  <CreativeHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</CreativeHeading>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((c) => (
                      <div key={c.id} className="flex items-center gap-1.5 text-[7.5pt] rounded-lg px-2.5 py-1"
                        style={{ backgroundColor: alphaColor(accentColor, 0.08), border: `1px solid ${alphaColor(accentColor, 0.15)}` }}>
                        <Award className="w-3 h-3" style={{ color: accentColor }} />
                        <span className="text-stone-700">{c.name}</span>
                        {c.date && <span className="text-stone-400 text-[6pt]">({c.date})</span>}
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null;

            case "projects":
              return projects.length > 0 ? (
                <Card key={sec.id}>
                  <CreativeHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</CreativeHeading>
                  <div className="grid grid-cols-2 gap-3">
                    {projects.map((p) => (
                      <div key={p.id} className="rounded-lg p-3 border border-stone-200 bg-stone-50/50">
                        <div className="font-semibold text-[8.5pt] text-stone-800">{p.name}</div>
                        {p.description && <p className="text-[7pt] text-stone-500 mt-0.5">{p.description}</p>}
                        {p.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.technologies.map((t, i) => (
                              <span key={i} className="text-[6pt] rounded px-1.5 py-0.5 font-medium"
                                style={{ backgroundColor: alphaColor(accentColor, 0.1), color: accentColor }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null;

            case "hobbies":
              return hobbies.length > 0 ? (
                <Card key={sec.id}>
                  <CreativeHeading icon={Icon} accent={accentColor} fontHeading={fontHeading}>{sec.label}</CreativeHeading>
                  <div className="flex flex-wrap gap-2">
                    {hobbies.map((h, i) => (
                      <span key={i} className="text-[7.5pt] rounded-full px-3 py-1 font-medium"
                        style={{ backgroundColor: alphaColor(accentColor, 0.1), color: accentColor }}>
                        {h}
                      </span>
                    ))}
                  </div>
                </Card>
              ) : null;

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  );
}

function CreativeHeading({ children, icon: Icon, accent, fontHeading }: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  fontHeading: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: alphaColor(accent, 0.12) }}>
          <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
        </div>
      )}
      <span className="text-[10pt] font-bold" style={{ color: accent, fontFamily: `'${fontHeading}', serif` }}>{children}</span>
    </div>
  );
}
