"use client";

import { useCVEditorStore } from "@/store/cv-editor-store";
import { getTemplateById, getSidebarThemeColor } from "@/lib/cv-templates";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, User } from "lucide-react";
import type { TemplateRendererProps } from "./templates/template-types";
import { TemplateExecutive } from "./templates/template-executive";
import { TemplateClassicSidebar } from "./templates/template-classic-sidebar";
import { TemplateTimeline } from "./templates/template-timeline";
import { TemplateCompact } from "./templates/template-compact";
import { TemplateCreative } from "./templates/template-creative";

// ─── Template renderer registry ────────────────────────────────────────────
const TEMPLATE_RENDERERS: Record<string, React.ComponentType<TemplateRendererProps>> = {
  "executive-v1": TemplateExecutive,
  "classic-sidebar-v1": TemplateClassicSidebar,
  "timeline-v1": TemplateTimeline,
  "compact-v1": TemplateCompact,
  "creative-v1": TemplateCreative,
};

// ─── Sidebar width mapping ─────────────────────────────────────────────────
function sidebarWidthPx(w: string) {
  if (w === "narrow") return "160px";
  if (w === "wide") return "220px";
  return "190px"; // medium
}

// ─── Accent color utility ───────────────────────────────────────────────────
function isLightSidebar(color: string) {
  if (!color || color === "transparent") return true;
  const hex = color.replace("#", "");
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 140;
  }
  return false;
}

export function CVPreviewPanel() {
  const {
    data, headerConfig, sidebarConfig, sections, template,
  } = useCVEditorStore();

  // ── Check for custom template renderer ────────────────────────────────────
  const Renderer = TEMPLATE_RENDERERS[template];
  if (Renderer) {
    const tmpl = getTemplateById(template);
    const props: TemplateRendererProps = {
      data,
      sections,
      headerConfig,
      sidebarConfig,
      accentColor: tmpl.accentColor,
      fontHeading: tmpl.fontHeading,
      fontBody: tmpl.fontBody,
    };
    return <Renderer {...props} />;
  }

  // ── Fallback: legacy default rendering ────────────────────────────────────
  const tmplFallback = getTemplateById(template);
  const accent = tmplFallback.accentColor || "#F59E0B";

  const { personalInfo: info, summary, experience, education, skills, languages, certifications, projects, hobbies } = data;
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(" ") || "Votre Nom";

  const sidebarColor = getSidebarThemeColor(sidebarConfig.theme);
  const sidebarLight = isLightSidebar(sidebarColor);
  const sidebarTextClass = sidebarLight ? "text-stone-800" : "text-white";
  const sidebarMutedClass = sidebarLight ? "text-stone-500" : "text-stone-300";
  const sidebarLabelClass = sidebarLight ? "text-stone-600" : "text-stone-300";
  const sidebarBadgeBg = sidebarLight ? "bg-stone-200 text-stone-700" : "bg-white/10 text-stone-200";

  // Sections logic: sidebar sections vs main sections
  const enabledSections = sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const sidebarSections = enabledSections.filter((s) => s.inSidebar);
  const mainSections = enabledSections.filter((s) => !s.inSidebar);

  // Contact items for sidebar
  const contactItems = [
    headerConfig.showEmail && info.email && { icon: Mail, value: info.email },
    headerConfig.showPhone && info.phone && { icon: Phone, value: info.phone },
    headerConfig.showAddress && info.address && { icon: MapPin, value: info.address },
    headerConfig.showLinkedin && info.linkedin && { icon: Linkedin, value: info.linkedin },
    headerConfig.showGithub && info.github && { icon: Github, value: info.github },
    headerConfig.showWebsite && info.website && { icon: Globe, value: info.website },
  ].filter(Boolean) as Array<{ icon: React.ComponentType<{ className?: string }>; value: string }>;

  // Determine if personal info should be in sidebar
  const infoInSidebar = headerConfig.inSidebar && sidebarConfig.enabled;

  return (
    <div
      className="bg-white text-stone-900 shadow-2xl relative overflow-hidden"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "9pt",
        lineHeight: "1.5",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      <div className={cn("flex min-h-[297mm]", sidebarConfig.position === "right" && "flex-row-reverse")}>

        {/* ── SIDEBAR ────────────────────────────────────────────── */}
        {sidebarConfig.enabled && (
          <div
            className="flex-shrink-0 flex flex-col gap-4 p-5"
            style={{
              width: sidebarWidthPx(sidebarConfig.width),
              backgroundColor: sidebarColor,
              minHeight: sidebarConfig.fullHeight ? "297mm" : "auto",
            }}
          >
            {/* Photo placeholder + Name if in sidebar */}
            {infoInSidebar && (
              <div className="text-center mb-2">
                {headerConfig.showPhoto && (
                  <div className={cn("w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3 border-2",
                    sidebarLight ? "bg-stone-100 border-stone-300" : "border-white/20")}
                    style={!sidebarLight ? { backgroundColor: accent + "30" } : undefined}>
                    {info.photo ? (
                      <img src={info.photo} alt={fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold" style={{ color: accent }}>
                        {info.firstName?.[0]?.toUpperCase() ?? ""}{info.lastName?.[0]?.toUpperCase() ?? ""}
                      </span>
                    )}
                  </div>
                )}
                {headerConfig.showName && (
                  <div className={cn("text-[12pt] font-bold leading-tight", sidebarTextClass)}>
                    {fullName}
                  </div>
                )}
                {headerConfig.showTitle && info.jobTitle && (
                  <div className={cn("text-[9pt] mt-1", sidebarMutedClass)}>{info.jobTitle}</div>
                )}
              </div>
            )}

            {/* Contact section in sidebar */}
            {(sidebarConfig.elements.contact ?? true) && contactItems.length > 0 && (
              <div>
                <div className={cn("text-[7pt] uppercase tracking-widest mb-2 font-semibold", sidebarLabelClass)}>Contact</div>
                <div className="space-y-1.5">
                  {contactItems.map((c, i) => (
                    <div key={i} className={cn("flex items-start gap-1.5 text-[7.5pt]", sidebarMutedClass)}>
                      <c.icon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills in sidebar */}
            {(sidebarConfig.elements.skills ?? true) && skills.length > 0 &&
              sidebarSections.some((s) => s.type === "skills") && (
              <div>
                <div className={cn("text-[7pt] uppercase tracking-widest mb-2 font-semibold", sidebarLabelClass)}>Compétences</div>
                <div className="flex flex-wrap gap-1">
                  {skills.map((s) => (
                    <span key={s.id} className={cn("text-[6.5pt] rounded px-1.5 py-0.5", sidebarBadgeBg)}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages in sidebar */}
            {(sidebarConfig.elements.languages ?? true) && languages.length > 0 &&
              sidebarSections.some((s) => s.type === "languages") && (
              <div>
                <div className={cn("text-[7pt] uppercase tracking-widest mb-2 font-semibold", sidebarLabelClass)}>Langues</div>
                <div className="space-y-1">
                  {languages.map((l) => (
                    <div key={l.id} className={cn("text-[7.5pt]", sidebarMutedClass)}>
                      {l.name}{l.level ? ` (${l.level})` : ""}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hobbies in sidebar */}
            {(sidebarConfig.elements.hobbies ?? false) && hobbies.length > 0 &&
              sidebarSections.some((s) => s.type === "hobbies") && (
              <div>
                <div className={cn("text-[7pt] uppercase tracking-widest mb-2 font-semibold", sidebarLabelClass)}>Centres d&apos;intérêt</div>
                <div className="space-y-1">
                  {hobbies.map((h, i) => (
                    <div key={i} className={cn("text-[7.5pt]", sidebarMutedClass)}>{h}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications in sidebar */}
            {sidebarSections.some((s) => s.type === "certifications") && certifications.length > 0 && (
              <div>
                <div className={cn("text-[7pt] uppercase tracking-widest mb-2 font-semibold", sidebarLabelClass)}>Certifications</div>
                <div className="space-y-1.5">
                  {certifications.map((c) => (
                    <div key={c.id} className={cn("text-[7.5pt]", sidebarMutedClass)}>
                      <div className={cn("font-medium", sidebarTextClass)}>{c.name}</div>
                      {c.issuer && <div>{c.issuer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MAIN CONTENT ──────────────────────────────────────── */}
        <div className="flex-1 p-8 overflow-hidden">
          {/* Header (when not in sidebar) */}
          {!infoInSidebar && (
            <div className={cn("pb-5 mb-6")} style={{ borderBottom: `${headerConfig.style === "bold" ? "4px" : "2px"} solid ${accent}` }}>
              {headerConfig.showPhoto && (
                <div className="float-right ml-4 mb-2">
                  <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
                    {info.photo ? (
                      <img src={info.photo} alt={fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-stone-400" />
                    )}
                  </div>
                </div>
              )}
              {headerConfig.showName && (
                <h1 className="text-[20pt] font-bold leading-none mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {fullName}
                </h1>
              )}
              {headerConfig.showTitle && info.jobTitle && (
                <div className="text-[11pt] font-medium" style={{ color: accent }}>{info.jobTitle}</div>
              )}
              {contactItems.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2 text-[7.5pt] text-stone-500">
                  {contactItems.map((c, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <c.icon className="w-2.5 h-2.5" />
                      {c.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sections */}
          {mainSections.map((sec) => {
            switch (sec.type) {
              case "summary":
                return summary ? (
                  <div key={sec.id} className="mb-5">
                    <SectionTitle accent={accent}>{sec.label}</SectionTitle>
                    <p className="text-[8pt] text-stone-600 leading-relaxed">{summary}</p>
                  </div>
                ) : null;

              case "experience":
                return experience.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <SectionTitle accent={accent}>{sec.label}</SectionTitle>
                    <div className="space-y-4">
                      {experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <div className="font-semibold text-[9pt] text-stone-800">{exp.position}</div>
                              <div className="text-[8pt] text-stone-500">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
                            </div>
                            {(exp.startDate || exp.endDate) && (
                              <div className="text-[7.5pt] text-stone-400 whitespace-nowrap">
                                {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? " – Présent" : ""}
                              </div>
                            )}
                          </div>
                          {exp.bullets.length > 0 ? (
                            <ul className="space-y-0.5">
                              {exp.bullets.map((b, j) => (
                                <li key={j} className="flex items-start gap-1.5 text-[7.5pt] text-stone-600">
                                  <span className="text-amber-500 mt-0.5">▸</span>{b}
                                </li>
                              ))}
                            </ul>
                          ) : exp.description ? (
                            <p className="text-[7.5pt] text-stone-600">{exp.description}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "education":
                return education.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <SectionTitle accent={accent}>{sec.label}</SectionTitle>
                    <div className="space-y-3">
                      {education.map((edu) => (
                        <div key={edu.id} className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-[9pt] text-stone-800">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</div>
                            <div className="text-[8pt] text-stone-500">{edu.institution}</div>
                            {edu.description && <p className="text-[7.5pt] text-stone-500 mt-0.5">{edu.description}</p>}
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
                // Only render in main if not in sidebar
                return !sidebarSections.some((s) => s.type === "skills") && skills.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <SectionTitle accent={accent}>{sec.label}</SectionTitle>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span key={s.id} className="text-[7.5pt] bg-stone-100 text-stone-600 rounded px-2 py-0.5 border border-stone-200">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "languages":
                return !sidebarSections.some((s) => s.type === "languages") && languages.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <SectionTitle accent={accent}>{sec.label}</SectionTitle>
                    <div className="flex flex-wrap gap-3">
                      {languages.map((l) => (
                        <span key={l.id} className="text-[8pt] text-stone-600">
                          {l.name}{l.level ? ` (${l.level})` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "certifications":
                return !sidebarSections.some((s) => s.type === "certifications") && certifications.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <SectionTitle accent={accent}>{sec.label}</SectionTitle>
                    <div className="space-y-2">
                      {certifications.map((c) => (
                        <div key={c.id}>
                          <div className="font-semibold text-[9pt] text-stone-800">{c.name}</div>
                          <div className="text-[7.5pt] text-stone-500">{[c.issuer, c.date].filter(Boolean).join(" · ")}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "projects":
                return projects.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <SectionTitle accent={accent}>{sec.label}</SectionTitle>
                    <div className="space-y-3">
                      {projects.map((p) => (
                        <div key={p.id}>
                          <div className="font-semibold text-[9pt] text-stone-800">{p.name}</div>
                          {p.description && <p className="text-[7.5pt] text-stone-600">{p.description}</p>}
                          {p.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.technologies.map((t, i) => (
                                <span key={i} className="text-[6.5pt] rounded px-1.5 py-0.5" style={{ backgroundColor: accent + "15", color: accent }}>{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "hobbies":
                return !sidebarSections.some((s) => s.type === "hobbies") && hobbies.length > 0 ? (
                  <div key={sec.id} className="mb-5">
                    <SectionTitle accent={accent}>{sec.label}</SectionTitle>
                    <p className="text-[8pt] text-stone-600">{hobbies.join(" · ")}</p>
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

function SectionTitle({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className="text-[7pt] uppercase tracking-widest font-semibold mb-2 pb-1"
      style={{ color: accent || "#D97706", borderBottom: `1px solid ${accent ? accent + "40" : "#FDE68A"}` }}>
      {children}
    </div>
  );
}
