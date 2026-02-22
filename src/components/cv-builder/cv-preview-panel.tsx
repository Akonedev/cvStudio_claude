"use client";

import { cn } from "@/lib/utils";

interface CVPreviewPanelProps {
  showSidebar: boolean;
  sidebarPosition: "left" | "right";
}

const mockData = {
  name: "Jean Dupont",
  title: "Senior Full-Stack Developer",
  email: "jean@example.com",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  linkedin: "linkedin.com/in/jean",
  summary: "Développeur Full-Stack passionné avec 8 ans d'expérience dans la conception et le développement d'applications web scalables. Expert React, Node.js et architectures cloud. Leader technique reconnu, j'ai guidé des équipes jusqu'à 12 développeurs dans des environnements Agile.",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL", "Leadership"],
  experience: [
    {
      title: "Lead Developer",
      company: "TechStartup SAS",
      period: "2021 – Présent",
      bullets: [
        "Architecturé et livré une plateforme SaaS générant 2M€ ARR",
        "Réduit le temps de chargement de 60% via l'optimisation des requêtes",
        "Managé une équipe de 8 développeurs juniors et seniors",
      ],
    },
    {
      title: "Développeur Senior",
      company: "Digital Agency",
      period: "2018 – 2021",
      bullets: [
        "Développé 15+ applications web pour des clients Fortune 500",
        "Mis en place des pratiques CI/CD réduisant les bugs de 40%",
      ],
    },
  ],
  education: [
    { degree: "Master Informatique", school: "École Polytechnique", year: "2017" },
  ],
  languages: ["Français (natif)", "Anglais (C2)", "Espagnol (B2)"],
};

export function CVPreviewPanel({ showSidebar, sidebarPosition }: CVPreviewPanelProps) {
  return (
    <div
      className="bg-white text-stone-900 shadow-2xl"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "9pt",
        lineHeight: "1.5",
      }}
    >
      <div className={cn("flex h-full", sidebarPosition === "right" && "flex-row-reverse")}>
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-48 bg-stone-900 text-white flex-shrink-0 p-5 flex flex-col gap-5">
            {/* Photo placeholder */}
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/40 mx-auto flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-amber-400">JD</span>
            </div>

            {/* Contact */}
            <div>
              <div className="text-[7pt] uppercase tracking-widest text-amber-400 mb-2 font-semibold">Contact</div>
              <div className="space-y-1.5 text-[7.5pt] text-stone-300">
                <div>{mockData.email}</div>
                <div>{mockData.phone}</div>
                <div>{mockData.location}</div>
                <div>{mockData.linkedin}</div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="text-[7pt] uppercase tracking-widest text-amber-400 mb-2 font-semibold">Compétences</div>
              <div className="flex flex-wrap gap-1">
                {mockData.skills.map((skill) => (
                  <span key={skill} className="text-[6.5pt] bg-stone-700 text-stone-200 rounded px-1.5 py-0.5">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="text-[7pt] uppercase tracking-widest text-amber-400 mb-2 font-semibold">Langues</div>
              <div className="space-y-1">
                {mockData.languages.map((lang) => (
                  <div key={lang} className="text-[7.5pt] text-stone-300">{lang}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="border-b-2 border-amber-400 pb-5 mb-6">
            <h1 className="text-[20pt] font-display font-bold text-stone-900 leading-none mb-1">
              {mockData.name}
            </h1>
            <div className="text-[11pt] text-amber-600 font-medium">{mockData.title}</div>
            {!showSidebar && (
              <div className="flex flex-wrap gap-3 mt-2 text-[7.5pt] text-stone-500">
                <span>{mockData.email}</span>
                <span>·</span>
                <span>{mockData.phone}</span>
                <span>·</span>
                <span>{mockData.location}</span>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mb-5">
            <div className="text-[7pt] uppercase tracking-widest text-amber-600 font-semibold mb-2">Profil</div>
            <p className="text-[8pt] text-stone-600 leading-relaxed">{mockData.summary}</p>
          </div>

          {/* Experience */}
          <div className="mb-5">
            <div className="text-[7pt] uppercase tracking-widest text-amber-600 font-semibold mb-3">Expérience professionnelle</div>
            <div className="space-y-4">
              {mockData.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="font-semibold text-[9pt] text-stone-800">{exp.title}</div>
                      <div className="text-[8pt] text-stone-500">{exp.company}</div>
                    </div>
                    <div className="text-[7.5pt] text-stone-400 whitespace-nowrap">{exp.period}</div>
                  </div>
                  <ul className="space-y-0.5">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-[7.5pt] text-stone-600">
                        <span className="text-amber-500 mt-0.5">▸</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="text-[7pt] uppercase tracking-widest text-amber-600 font-semibold mb-3">Formation</div>
            {mockData.education.map((edu, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[9pt] text-stone-800">{edu.degree}</div>
                  <div className="text-[8pt] text-stone-500">{edu.school}</div>
                </div>
                <div className="text-[7.5pt] text-stone-400">{edu.year}</div>
              </div>
            ))}
          </div>

          {/* Skills row if no sidebar */}
          {!showSidebar && (
            <div className="mt-5">
              <div className="text-[7pt] uppercase tracking-widest text-amber-600 font-semibold mb-2">Compétences</div>
              <div className="flex flex-wrap gap-1.5">
                {mockData.skills.map((skill) => (
                  <span key={skill} className="text-[7.5pt] bg-stone-100 text-stone-600 rounded px-2 py-0.5 border border-stone-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
