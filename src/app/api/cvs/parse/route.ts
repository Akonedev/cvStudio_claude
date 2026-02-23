import { NextRequest } from "next/server";
import { ok, err, withAuth } from "@/lib/api-response";

/**
 * POST /api/cvs/parse
 * Accepts a file upload (PDF, DOCX, DOC, TXT, JSON) and returns extracted text + structured data.
 */
export const POST = withAuth(async (req: NextRequest) => {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return err("Le corps de la requête doit être un FormData avec un fichier", 400);
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return err("Aucun fichier fourni (champ 'file' requis)", 400);
  }

  const fileName = file.name.toLowerCase();
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return err("Le fichier dépasse la taille maximale de 10 Mo", 400);
  }

  try {
    let rawText = "";
    let fileType = "";

    // ── PDF ──────────────────────────────────────────────────────────────────
    if (fileName.endsWith(".pdf")) {
      fileType = "pdf";
      const pdfModule = await import("pdf-parse");
      const pdfParse = (pdfModule as { default?: (buf: Buffer) => Promise<{ text: string }> }).default ?? pdfModule;
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await (pdfParse as (buf: Buffer) => Promise<{ text: string }>)(buffer);
      rawText = pdfData.text;
    }
    // ── DOCX / DOC ──────────────────────────────────────────────────────────
    else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      fileType = fileName.endsWith(".docx") ? "docx" : "doc";
      const mammoth = await import("mammoth");
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }
    // ── TXT / MD ────────────────────────────────────────────────────────────
    else if (
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md") ||
      fileName.endsWith(".text")
    ) {
      fileType = "txt";
      rawText = await file.text();
    }
    // ── JSON ────────────────────────────────────────────────────────────────
    else if (fileName.endsWith(".json")) {
      fileType = "json";
      const text = await file.text();
      const json = JSON.parse(text);
      return ok({
        fileType,
        fileName: file.name,
        fileSize: file.size,
        rawText: text,
        structured: json,
        parsed: parseStructuredCV(json),
      });
    }
    // ── Unsupported ─────────────────────────────────────────────────────────
    else {
      return err(
        `Format non supporté: ${fileName.split(".").pop()}. Formats acceptés: PDF, DOCX, DOC, TXT, MD, JSON`,
        400
      );
    }

    // Parse raw text into structured CV data
    const parsed = parseRawTextCV(rawText);

    return ok({
      fileType,
      fileName: file.name,
      fileSize: file.size,
      rawText,
      parsed,
    });
  } catch (e) {
    console.error("[parse] Error:", e);
    return err(
      `Erreur lors de l'analyse du fichier: ${(e as Error).message}`,
      500
    );
  }
});

// ─── Smart CV text parser ─────────────────────────────────────────────────────

interface ParsedSection {
  type: string;
  title: string;
  content: string;
  items?: Array<Record<string, unknown>>;
}

interface ParsedCV {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  github: string;
  jobTitle: string;
  summary: string;
  sections: ParsedSection[];
  skills: string[];
  languages: Array<{ name: string; level: string }>;
  experience: Array<{
    position: string;
    company: string;
    period: string;
    description: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    description: string;
  }>;
  certifications: Array<{ name: string; issuer: string; date: string }>;
}

function parseRawTextCV(text: string): ParsedCV {
  const lines = text.split("\n").map((l) => l.trim());
  const nonEmpty = lines.filter(Boolean);

  // Extract contact info with regex
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
  );
  const phoneMatch = text.match(
    /(?:\+?\d[\d\s.\-()]{7,}\d)/
  );
  const linkedinMatch = text.match(
    /(?:linkedin\.com\/in\/[\w\-]+|linkedin\.com\/[\w\-]+)/i
  );
  const githubMatch = text.match(
    /(?:github\.com\/[\w\-]+)/i
  );
  const websiteMatch = text.match(
    /(?:https?:\/\/(?!linkedin|github)[^\s]+)/i
  );
  const locationMatch = text.match(
    /(?:\d{5}\s+[\w\s]+|[\w\s]+,\s*(?:France|Paris|Lyon|Marseille|Toulouse|Bordeaux|Nantes|Lille|Strasbourg|Nice|Rennes|Montpellier|[\w\s]+))/i
  );

  // First non-empty line is usually the name
  const name = nonEmpty[0] ?? "";

  // Second line often the job title (if it's not email/phone)
  let jobTitle = "";
  if (nonEmpty[1] && !nonEmpty[1].match(/@|^\+?\d/) && nonEmpty[1].length < 80) {
    jobTitle = nonEmpty[1];
  }

  // Detect sections by common headings
  const sectionPatterns: Array<{ type: string; pattern: RegExp }> = [
    { type: "summary", pattern: /^(profil|résumé|resume|summary|à propos|about|objectif|profile|a propos|qui suis[- ]?je)/i },
    { type: "experience", pattern: /^(expérience|experience|parcours|emploi|career|work|historique professionnel|expérience professionnelle|expériences professionnelles)/i },
    { type: "education", pattern: /^(formation|education|études|diplôme|diplomes|parcours académique|cursus|scolarité)/i },
    { type: "skills", pattern: /^(compétence|skills|aptitude|savoir[- ]?faire|technologies|tech stack|outils|tools|compétences techniques|compétences clés)/i },
    { type: "languages", pattern: /^(langue|language|langues parlées|langues|idiomes)/i },
    { type: "certifications", pattern: /^(certification|certificat|accréditation|certifications|formations complémentaires)/i },
    { type: "projects", pattern: /^(projet|project|réalisation|réalisations|projets personnels|portfolio)/i },
    { type: "hobbies", pattern: /^(loisir|hobby|hobbies|intérêt|centres d'intérêt|activités|passions)/i },
    { type: "references", pattern: /^(référence|reference|recommandation)/i },
    { type: "volunteering", pattern: /^(bénévolat|volunteer|engagement|associatif)/i },
    { type: "awards", pattern: /^(distinction|award|prix|récompense|honours|honors)/i },
    { type: "publications", pattern: /^(publication|article|recherche|research)/i },
  ];

  // Find section boundaries
  const sectionBounds: Array<{
    type: string;
    title: string;
    startLine: number;
  }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    for (const sp of sectionPatterns) {
      if (sp.pattern.test(line)) {
        sectionBounds.push({ type: sp.type, title: line, startLine: i });
        break;
      }
    }
  }

  // Extract section content
  const sections: ParsedSection[] = [];
  for (let s = 0; s < sectionBounds.length; s++) {
    const start = sectionBounds[s].startLine + 1;
    const end =
      s + 1 < sectionBounds.length
        ? sectionBounds[s + 1].startLine
        : lines.length;
    const content = lines.slice(start, end).join("\n").trim();
    sections.push({
      type: sectionBounds[s].type,
      title: sectionBounds[s].title,
      content,
    });
  }

  // Extract summary
  const summarySection = sections.find((s) => s.type === "summary");
  const summary = summarySection?.content ?? "";

  // Extract experience
  const experience = parseExperienceSection(
    sections.find((s) => s.type === "experience")?.content ?? ""
  );

  // Extract education
  const education = parseEducationSection(
    sections.find((s) => s.type === "education")?.content ?? ""
  );

  // Extract skills
  const skillsSection = sections.find((s) => s.type === "skills");
  const skills = skillsSection
    ? skillsSection.content
        .split(/[,;•·|\n\r▸►➜✓✅⬛●○◆★]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 50)
    : [];

  // Extract languages
  const langSection = sections.find((s) => s.type === "languages");
  const languages = langSection
    ? langSection.content
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const match = l.match(/^(.+?)[\s:–\-\(]+(.+?)\)?$/);
          return match
            ? { name: match[1].trim(), level: match[2].trim() }
            : { name: l, level: "" };
        })
    : [];

  // Extract certifications
  const certSection = sections.find((s) => s.type === "certifications");
  const certifications = certSection
    ? certSection.content
        .split(/\n/)
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => ({ name: c, issuer: "", date: "" }))
    : [];

  return {
    name,
    email: emailMatch?.[0] ?? "",
    phone: phoneMatch?.[0] ?? "",
    location: locationMatch?.[0]?.trim() ?? "",
    linkedin: linkedinMatch?.[0] ?? "",
    github: githubMatch?.[0] ?? "",
    website: websiteMatch?.[0] ?? "",
    jobTitle,
    summary,
    sections,
    skills,
    languages,
    experience,
    education,
    certifications,
  };
}

function parseExperienceSection(content: string) {
  if (!content) return [];
  const blocks = content.split(/\n(?=\S.*(?:20\d{2}|19\d{2}|présent|present|actuel|aujourd'hui|current))/i);
  return blocks
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return null;
      const firstLine = lines[0];
      const periodMatch = firstLine.match(/((?:(?:jan|fév|mar|avr|mai|jun|jul|aoû|sep|oct|nov|déc|january|february|march|april|may|june|july|august|september|october|november|december)\w*[\s.]*)?\d{4}\s*[-–à]\s*(?:(?:jan|fév|mar|avr|mai|jun|jul|aoû|sep|oct|nov|déc|january|february|march|april|may|june|july|august|september|october|november|december)\w*[\s.]*)?\d{0,4}\s*|présent|present|actuel|aujourd'hui|current)/i);
      const period = periodMatch?.[0]?.trim() ?? "";
      const position = firstLine.replace(period, "").replace(/[–\-|,]+$/, "").trim();
      const company = lines[1] && !lines[1].startsWith("•") && !lines[1].startsWith("-") ? lines[1] : "";
      const bulletStart = company ? 2 : 1;
      const bullets = lines
        .slice(bulletStart)
        .map((l) => l.replace(/^[•\-▸►➜✓★·○◆]+\s*/, "").trim())
        .filter((l) => l.length > 5);

      return {
        position: position || firstLine,
        company,
        period,
        description: bullets.join(". "),
        bullets,
      };
    })
    .filter(Boolean) as ParsedCV["experience"];
}

function parseEducationSection(content: string) {
  if (!content) return [];
  const blocks = content.split(/\n(?=\S)/);
  return blocks
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return null;
      const degree = lines[0] ?? "";
      const institution = lines[1] ?? "";
      const periodMatch = block.match(/(\d{4}[\s\-–à]*\d{0,4})/);
      return {
        degree,
        institution,
        period: periodMatch?.[0] ?? "",
        description: lines.slice(2).join(" "),
      };
    })
    .filter(Boolean) as ParsedCV["education"];
}

function parseStructuredCV(json: Record<string, unknown>): ParsedCV {
  const data = (json.data as Record<string, unknown>) ?? json;
  const personal = (data.personal as Record<string, unknown>) ??
    (data.personalInfo as Record<string, unknown>) ?? {};

  const name =
    (personal.name as string | undefined) ??
    (personal.firstName && personal.lastName
      ? `${personal.firstName} ${personal.lastName}`
      : null) ??
    (json.name as string | undefined) ??
    "";

  return {
    name,
    email: (personal.email as string) ?? "",
    phone: (personal.phone as string) ?? "",
    location: (personal.location as string) ?? (personal.address as string) ?? "",
    linkedin: (personal.linkedin as string) ?? "",
    github: (personal.github as string) ?? "",
    website: (personal.website as string) ?? "",
    jobTitle: (personal.jobTitle as string) ?? (personal.title as string) ?? "",
    summary: (data.summary as string) ?? (personal.summary as string) ?? "",
    sections: [],
    skills: Array.isArray(data.skills)
      ? (data.skills as Array<{ name?: string }>).map((s) =>
          typeof s === "string" ? s : s.name ?? ""
        )
      : [],
    languages: Array.isArray(data.languages)
      ? (data.languages as Array<{ name?: string; level?: string }>).map((l) =>
          typeof l === "string" ? { name: l, level: "" } : { name: l.name ?? "", level: l.level ?? "" }
        )
      : [],
    experience: Array.isArray(data.experience)
      ? (data.experience as Array<Record<string, unknown>>).map((e) => ({
          position: (e.position as string) ?? (e.title as string) ?? "",
          company: (e.company as string) ?? "",
          period: (e.period as string) ?? `${e.startDate ?? ""}${e.endDate ? ` – ${e.endDate}` : ""}`,
          description: (e.description as string) ?? "",
          bullets: Array.isArray(e.bullets)
            ? (e.bullets as string[])
            : Array.isArray(e.achievements)
              ? (e.achievements as string[])
              : [],
        }))
      : [],
    education: Array.isArray(data.education)
      ? (data.education as Array<Record<string, unknown>>).map((e) => ({
          degree: (e.degree as string) ?? "",
          institution: (e.institution as string) ?? (e.school as string) ?? "",
          period: (e.period as string) ?? (e.year as string) ?? "",
          description: (e.description as string) ?? "",
        }))
      : [],
    certifications: Array.isArray(data.certifications)
      ? (data.certifications as Array<Record<string, unknown>>).map((c) => ({
          name: (c.name as string) ?? "",
          issuer: (c.issuer as string) ?? "",
          date: (c.date as string) ?? "",
        }))
      : [],
  };
}
