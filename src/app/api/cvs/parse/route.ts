import { NextRequest } from "next/server";
import { ok, err, withAuth } from "@/lib/api-response";

// Allow large file uploads (up to 100MB)
export const config = {
  api: { bodyParser: false },
};

// Next.js App Router: increase body size limit
export const maxDuration = 60; // seconds
// Route segment config for body size
export const runtime = "nodejs";

// ─── UTF-8 double-encoding fix ────────────────────────────────────────────────

/**
 * Fix UTF-8 text that was double-encoded (UTF-8 bytes decoded as Latin-1).
 * Common patterns: Ã© → é, â€" → –, Ã  → à, etc.
 */
function fixEncoding(text: string): string {
  // Check for common UTF-8-as-Latin-1 mojibake patterns
  // Quick test for common UTF-8-as-Latin-1 patterns
  const hasMojibake = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}/.test(text) ||
    text.includes("Ã") || text.includes("â€");
  if (!hasMojibake) {
    return text;
  }

  try {
    // Convert each char back to its byte value, then re-decode as UTF-8
    const bytes = new Uint8Array(text.length);
    let hasHighBytes = false;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code > 255) return text; // Genuine Unicode — no fix needed
      bytes[i] = code;
      if (code > 127) hasHighBytes = true;
    }
    if (!hasHighBytes) return text;

    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    // Verify the result looks better (has fewer high bytes / more readable)
    if (decoded.length < text.length) return decoded;
    return text;
  } catch {
    return text; // If decoding fails, keep the original
  }
}

/**
 * POST /api/cvs/parse
 * Accepts a file upload (PDF, DOCX, DOC, TXT, JSON) and returns extracted text + structured data.
 */
export const POST = withAuth(async (req: NextRequest) => {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (e) {
    const message = (e as Error).message || "";
    if (message.includes("size") || message.includes("limit") || message.includes("too large")) {
      return err("Le fichier est trop volumineux. Taille maximale : 100 Mo.", 413);
    }
    console.error("[parse] FormData error:", message);
    return err("Impossible de lire le fichier envoyé. Vérifiez le format et réessayez.", 400);
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return err("Aucun fichier fourni (champ 'file' requis)", 400);
  }

  const fileName = file.name.toLowerCase();
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return err("Le fichier dépasse la taille maximale de 100 Mo", 400);
  }

  try {
    let rawText = "";
    let fileType = "";

    // ── PDF ──────────────────────────────────────────────────────────────────
    if (fileName.endsWith(".pdf")) {
      fileType = "pdf";
      // pdf-parse v1: test-file workaround handled in Dockerfile (copies test PDF to CWD)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string; numpages: number }>;
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await pdfParse(buffer);
      rawText = fixEncoding(pdfData.text);

      // Detect image-based PDFs where very little text is extracted
      const cleanedText = rawText.replace(/\s+/g, " ").trim();
      if (cleanedText.length < 50 && pdfData.numpages > 0) {
        return err(
          `Ce PDF semble être basé sur des images (${pdfData.numpages} page(s), seulement ${cleanedText.length} caractères extraits). ` +
          "Veuillez convertir le PDF en DOCX (via Word ou un outil en ligne) puis réimporter le fichier DOCX, " +
          "ou coller le texte manuellement dans l'onglet \"Coller\".",
          400
        );
      }
    }
    // ── DOCX / DOC ──────────────────────────────────────────────────────────
    else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      fileType = fileName.endsWith(".docx") ? "docx" : "doc";
      const mammoth = await import("mammoth");
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await mammoth.extractRawText({ buffer });
      rawText = fixEncoding(result.value);
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
    location: string;
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

/**
 * Normalize text for section heading matching:
 * remove accents, lowercase, trim punctuation.
 */
function normalizeForMatch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check if a line looks like a section heading:
 * - All or mostly uppercase
 * - Short (< 60 chars)
 * - Not a bullet point or date
 * - Matches a known heading pattern
 */
function isSectionHeading(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 80 || trimmed.length < 3) return null;
  // Skip lines that are clearly content: bullets, dates, emails, urls
  if (/^[-•▸►➜✓★·○◆]/.test(trimmed)) return null;
  if (/^(https?:|www\.|[a-z]+@)/.test(trimmed)) return null;
  // Skip sub-headings that appear within experience sections
  if (/^projet\s*:/i.test(trimmed)) return null;
  if (/^environnement\s*:/i.test(trimmed)) return null;

  const normalized = normalizeForMatch(trimmed);

  // Patterns ordered by specificity — more specific patterns first
  const sectionPatterns: Array<{ type: string; pattern: RegExp }> = [
    { type: "summary", pattern: /^(profil|resume|summary|a propos|about|objectif|profile|qui suis|presentation|introduction)/i },
    { type: "experience", pattern: /^(experiences?|parcours professionnel|emploi|career|work|historique professionnel)/i },
    // Certifications BEFORE education to catch "formations & certifications techniques"
    { type: "certifications", pattern: /^formations?\s+.*certifications?/i },
    { type: "certifications", pattern: /^formations?\s+(complementaires|techniques)/i },
    { type: "certifications", pattern: /^(certifications?|certificats?|accreditation)/i },
    // Education — "formation(s)" alone or followed by non-certification words
    { type: "education", pattern: /^(formations?|education|etudes|diplomes?|parcours academique|cursus|scolarite)(\s|$)/i },
    { type: "skills", pattern: /^(competences?|skills|aptitudes?|savoir faire|technologies|tech stack|outils|tools|expertise)/i },
    { type: "languages", pattern: /^(langues?|languages?|langues parlees|idiomes)/i },
    { type: "projects", pattern: /^(projets?\s+personnel|realisations?|portfolio)/i },
    { type: "hobbies", pattern: /^(loisirs?|hobbies?|interets?|centres?\s+d\s*interet|activites|passions)/i },
    { type: "references", pattern: /^(references?|recommandations?)/i },
    { type: "volunteering", pattern: /^(benevolat|volunteer|engagement|associatif)/i },
    { type: "awards", pattern: /^(distinctions?|awards?|prix|recompenses?|honours?|honors?)/i },
    { type: "publications", pattern: /^(publications?|articles?|recherche|research)/i },
  ];

  for (const sp of sectionPatterns) {
    if (sp.pattern.test(normalized)) return sp.type;
  }

  // Also detect if the line is ALL CAPS and short (likely a heading)
  const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-ZÀ-Ý]/.test(trimmed) && trimmed.length > 3;
  if (isAllCaps && trimmed.length < 50) {
    for (const sp of sectionPatterns) {
      const words = normalized.split(" ");
      for (const word of words) {
        if (word.length > 4 && sp.pattern.test(word)) return sp.type;
      }
    }
  }

  return null;
}

/**
 * Parse a date/period string to detect start/end.
 */
function parsePeriod(text: string): { raw: string; startDate: string; endDate: string; current: boolean } {
  const raw = text.trim();
  const current = /présent|present|actuel|aujourd'hui|current|en cours|ongoing|now/i.test(raw);
  
  // Match patterns like "Oct. 2022 – Déc. 2024" or "2019 - 2022" or "Depuis 2020" or just "2024"
  const datePattern = /(?:(?:jan|fev|fév|mar|avr|mai|jun|jui|jul|aoû|aou|sep|oct|nov|déc|dec|january|february|march|april|may|june|july|august|september|october|november|december)[\w.]*\s*)?(\d{4})/gi;
  const dates: string[] = [];
  let m;
  while ((m = datePattern.exec(raw))) {
    dates.push(m[0].trim());
  }

  return {
    raw,
    startDate: dates[0] ?? "",
    endDate: current ? "Présent" : (dates[1] ?? dates[0] ?? ""),
    current,
  };
}

function parseRawTextCV(text: string): ParsedCV {
  const lines = text.split("\n").map((l) => l.trimEnd());
  const nonEmpty = lines.filter((l) => l.trim());

  // ── 1. Extract contact info with regex ────────────────────────────────────
  const emailMatch = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?\d[\d\s.\-()]{7,}\d)/);
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/[\w\-]+)/i);
  const githubMatch = text.match(/(?:github\.com\/[\w\-]+)/i);
  const websiteMatch = text.match(/(?:https?:\/\/(?!linkedin|github)[^\s,|]+)/i);
  const locationMatch = text.match(
    /(\d{1,5}[\s,]+(?:rue|avenue|boulevard|bd|av|place|allée|impasse|chemin|cours)[\s\w',\-]+(?:\d{5})?\s*[\w\s-]*)|(\d{5}\s+[\w\s-]+(?:,\s*\w+)?)|(?:(?:Paris|Lyon|Marseille|Toulouse|Bordeaux|Nantes|Lille|Strasbourg|Nice|Rennes|Montpellier|Grenoble|Genève|Bruxelles|Dakar|Abidjan|Casablanca)[\s\w,-]*)/i
  );

  // ── 2. Determine name and job title ───────────────────────────────────────
  // Name: usually the first non-empty, non-contact line
  let name = "";
  let jobTitle = "";
  let headerEndLine = 0;

  for (let i = 0; i < Math.min(nonEmpty.length, 8); i++) {
    const line = nonEmpty[i].trim();
    // Skip lines that are contact info, dates, or section headings
    if (line.match(/@|https?:|linkedin|github|www\./i)) continue;
    if (line.match(/^\+?\d[\d\s.\-()]{6,}/)) continue;
    if (line.match(/^(né|nee|née|permis|disponibilit)/i)) continue;
    if (isSectionHeading(line)) break;

    if (!name) {
      name = line;
      headerEndLine = lines.indexOf(nonEmpty[i]);
      continue;
    }
    if (!jobTitle && line.length < 120 && !line.match(/^\d{5}/)) {
      jobTitle = line;
      headerEndLine = lines.indexOf(nonEmpty[i]);
      continue;
    }
    break;
  }

  // ── 3. Find section boundaries ────────────────────────────────────────────
  const sectionBounds: Array<{ type: string; title: string; startLine: number }> = [];

  for (let i = headerEndLine + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const sectionType = isSectionHeading(line);
    if (sectionType) {
      sectionBounds.push({ type: sectionType, title: line, startLine: i });
    }
  }

  // ── 4. Extract section content ────────────────────────────────────────────
  const sections: ParsedSection[] = [];
  for (let s = 0; s < sectionBounds.length; s++) {
    const start = sectionBounds[s].startLine + 1;
    const end = s + 1 < sectionBounds.length ? sectionBounds[s + 1].startLine : lines.length;
    const content = lines.slice(start, end).join("\n").trim();
    sections.push({
      type: sectionBounds[s].type,
      title: sectionBounds[s].title,
      content,
    });
  }

  // ── 4b. Merge same-type sections ─────────────────────────────────────────
  // e.g. "Compétences clés" + "Technologies & outils" both → skills
  const mergedContent: Record<string, string> = {};
  for (const section of sections) {
    if (!mergedContent[section.type]) {
      mergedContent[section.type] = section.content;
    } else {
      mergedContent[section.type] += "\n" + section.content;
    }
  }

  // ── 5. Parse summary ─────────────────────────────────────────────────────
  const summary = (mergedContent["summary"] ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");

  // ── 6. Parse experience ───────────────────────────────────────────────────
  const experience = parseExperienceSection(mergedContent["experience"] ?? "");

  // ── 7. Parse education ────────────────────────────────────────────────────
  const education = parseEducationSection(mergedContent["education"] ?? "");

  // ── 8. Parse skills ───────────────────────────────────────────────────────
  const skills = parseSkillsSection(mergedContent["skills"] ?? "");

  // ── 9. Parse languages ────────────────────────────────────────────────────
  const langContent = mergedContent["languages"] ?? "";
  let languages: Array<{ name: string; level: string }> = [];
  if (langContent) {
    languages = langContent
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        // Strip bullet prefix before matching
        const stripped = l.replace(/^[-•▸►➜✓★·○◆]\s*/, "").trim();
        if (!stripped) return null;
        // Match "Français : courant" or "Anglais (professionnel)"
        const match = stripped.match(/^(.+?)\s*[:–\-]\s*(.+)$/);
        if (match) return { name: match[1].trim(), level: match[2].trim() };
        const parenMatch = stripped.match(/^(.+?)\s*\((.+?)\)$/);
        if (parenMatch) return { name: parenMatch[1].trim(), level: parenMatch[2].trim() };
        return { name: stripped, level: "" };
      })
      .filter((l): l is { name: string; level: string } => l !== null);
  } else {
    // Try to find languages in skills section text
    const langInSkills = text.match(/langues?\s*:?\s*([^\n]+)/i);
    if (langInSkills) {
      languages = langInSkills[1]
        .split(/[,;]/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const m = l.match(/^(.+?)\s*\((.+?)\)$/);
          return m ? { name: m[1].trim(), level: m[2].trim() } : { name: l, level: "" };
        });
    }
  }

  // ── 10. Parse certifications ──────────────────────────────────────────────
  const certContent = mergedContent["certifications"] ?? "";
  const certifications = certContent
    ? certContent
        .split(/\n/)
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          // Strip bullet prefix
          const stripped = c.replace(/^[-•▸►]\s*/, "").trim();
          if (!stripped) return null;
          // Match "2022 : Formation Développeur Salesforce" format
          const dateFirst = stripped.match(/^(\d{4})\s*[:–\-]\s*(.*)/);
          if (dateFirst) {
            return { name: dateFirst[2].trim(), issuer: "", date: dateFirst[1] };
          }
          const yearMatch = stripped.match(/(\d{4})/);
          return {
            name: stripped.replace(/\(\d{4}\)/, "").trim(),
            issuer: "",
            date: yearMatch?.[1] ?? "",
          };
        })
        .filter((c): c is { name: string; issuer: string; date: string } => c !== null)
    : [];

  return {
    name,
    email: emailMatch?.[0] ?? "",
    phone: phoneMatch?.[0]?.trim() ?? "",
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

// ─── Experience parser ────────────────────────────────────────────────────────

function parseExperienceSection(content: string): ParsedCV["experience"] {
  if (!content.trim()) return [];

  const lines = content.split("\n");
  const entries: ParsedCV["experience"] = [];
  let current: {
    position: string; company: string; period: string;
    location: string; description: string; bullets: string[];
  } | null = null;

  // Date/period patterns
  const monthNames = "jan|f[eé]v|mar|avr|mai|juin?|juil?|ao[uû]t?|sep|oct|nov|d[eé]c|january|february|march|april|may|june|july|august|september|october|november|december";
  const dateRegex = new RegExp(
    `(?:(?:${monthNames})[\\w.]*[\\s,]*)?(?:19|20)\\d{2}\\s*[-–à]\\s*(?:(?:${monthNames})[\\w.]*[\\s,]*)?(?:(?:19|20)\\d{2}|pr[eé]sent|actuel|aujourd'hui|current|en cours)`,
    "i"
  );
  const isBullet = (l: string) => /^\s*[-•▸►➜✓★·○◆✔→]/.test(l) || /^\s*\d+[.)]\s/.test(l);
  const isEnvLine = (l: string) => /^environnement\s*:/i.test(l.trim());
  const isProjetLine = (l: string) => /^projet\s*:/i.test(l.trim());

  /**
   * Split "COMPANY – Role (Free-lance)" into company and position.
   * Handles " – " (em dash) and " - " (hyphen) separators.
   */
  function splitCompanyAndRole(line: string): { company: string; position: string } {
    const cleaned = line.replace(/^[-•▸►]\s*/, "").trim();
    // Split on " – " or " — " (em/en dash separators)
    const parts = cleaned.split(/\s+[–—]\s+/);
    if (parts.length >= 2) {
      return { company: parts[0].trim(), position: parts.slice(1).join(" – ").trim() };
    }
    // Try split on " - " (regular hyphen) only if the result looks reasonable
    const hyphenParts = cleaned.split(/\s+-\s+/);
    if (hyphenParts.length >= 2 && hyphenParts[0].length > 2) {
      return { company: hyphenParts[0].trim(), position: hyphenParts.slice(1).join(" - ").trim() };
    }
    return { company: "", position: cleaned };
  }

  /**
   * Extract location from date line: "Oct. 2022 – Déc. 2024 – Paris (France)"
   * Returns: { period: "Oct. 2022 – Déc. 2024", location: "Paris (France)" }
   */
  function parseDateLine(dateLine: string): { period: string; location: string } {
    const match = dateLine.match(dateRegex);
    if (!match) return { period: dateLine, location: "" };

    const period = match[0];
    const afterDate = dateLine.substring((match.index ?? 0) + match[0].length);
    // Location comes after the date, separated by " – " or " - "
    const locPart = afterDate.replace(/^\s*[-–—]\s*/, "").trim();
    return { period, location: locPart };
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const hasDate = dateRegex.test(line);

    // Handle "Environnement :" lines — add as description to current entry
    if (isEnvLine(line)) {
      if (current) {
        current.bullets.push(line);
      }
      continue;
    }

    // Handle "Projet :" lines — add as description to current entry
    if (isProjetLine(line) && current) {
      current.description = (current.description ? current.description + ". " : "") + line;
      continue;
    }

    // Check if a bullet line is actually a new entry header
    // Pattern: "- COMPANY – Role" followed by a date on next line
    if (isBullet(line)) {
      const cleanLine = line.replace(/^\s*[-•▸►➜✓★·○◆✔→]\s*/, "").replace(/^\d+[.)]\s*/, "").trim();
      const nextNonEmpty = lines.slice(i + 1).find((l) => l.trim())?.trim() ?? "";
      const nextHasDate = dateRegex.test(nextNonEmpty);

      // Check if this bullet is a compact entry header: has "–" separator and next line has date
      if (cleanLine.includes("–") && cleanLine.length < 120 && nextHasDate) {
        if (current) entries.push(current);
        const { company, position } = splitCompanyAndRole(cleanLine);
        const { period, location } = parseDateLine(nextNonEmpty);
        current = { position, company, period, location, description: "", bullets: [] };
        i++; // skip date line
        continue;
      }

      // Check if this bullet has date inline: "- COMPANY – Role\n  Date – Location"
      if (cleanLine.includes("–") && dateRegex.test(cleanLine)) {
        if (current) entries.push(current);
        const dateMatch = cleanLine.match(dateRegex);
        const beforeDate = dateMatch ? cleanLine.substring(0, dateMatch.index ?? 0).trim() : cleanLine;
        const { company, position } = splitCompanyAndRole(beforeDate.replace(/[-–]\s*$/, "").trim());
        const { period, location } = parseDateLine(cleanLine);
        current = { position, company, period, location, description: "", bullets: [] };
        continue;
      }

      // Regular bullet — add to current entry
      if (current) {
        current.bullets.push(cleanLine);
      }
      continue;
    }

    // Non-bullet lines
    if (line.length < 120) {
      const nextLine = lines.slice(i + 1).find((l) => l.trim())?.trim() ?? "";
      const nextHasDate = dateRegex.test(nextLine);

      // Pattern 1: "COMPANY – Role" on line, "Date – Location" on next line
      if (!hasDate && nextHasDate && !isBullet(nextLine)) {
        if (current) entries.push(current);
        const { company, position } = splitCompanyAndRole(line);
        const { period, location } = parseDateLine(nextLine);
        current = { position, company, period, location, description: "", bullets: [] };
        i++; // skip date line

        // Check for "Projet :" on the line after date
        const afterDateLine = lines.slice(i + 1).find((l) => l.trim())?.trim() ?? "";
        if (afterDateLine && isProjetLine(afterDateLine)) {
          current.description = afterDateLine;
          i++;
        }
        continue;
      }

      // Pattern 2: Single line with date (compound: "Something Date – Location")
      if (hasDate && !isBullet(line)) {
        // Only start a new entry if we have a previous one with some content
        // or this looks like a substantial header (not just a stray date)
        const dateMatch = line.match(dateRegex);
        const beforeDate = dateMatch ? line.substring(0, dateMatch.index ?? 0).trim() : "";

        if (beforeDate.length > 5 || !current) {
          if (current) entries.push(current);
          const { company, position } = splitCompanyAndRole(beforeDate.replace(/[-–]\s*$/, "").trim());
          const { period, location } = parseDateLine(line);
          current = { position, company, period, location, description: "", bullets: [] };
          continue;
        }
      }
    }

    // Content lines — add to current entry
    if (current) {
      if (line.length > 60) {
        current.description = (current.description ? current.description + " " : "") + line;
      } else if (!current.company && !hasDate) {
        current.company = line;
      } else {
        current.description = (current.description ? current.description + ". " : "") + line;
      }
    }
  }

  if (current) entries.push(current);

  // Build final description from bullets if description is empty
  for (const entry of entries) {
    if (!entry.description && entry.bullets.length > 0) {
      entry.description = entry.bullets.join(". ");
    }
    // Clean up trailing pipes/dashes
    entry.company = entry.company.replace(/[\s|–\-]+$/, "").trim();
    entry.position = entry.position.replace(/[\s|–\-]+$/, "").trim();
  }

  return entries;
}

// ─── Education parser ─────────────────────────────────────────────────────────

function parseEducationSection(content: string): ParsedCV["education"] {
  if (!content.trim()) return [];

  const lines = content.split("\n");
  const entries: ParsedCV["education"] = [];
  let current: { degree: string; institution: string; period: string; description: string } | null = null;
  const yearRegex = /(?:19|20)\d{2}/;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Strip bullet prefix for analysis
    const isBulletLine = /^\s*[-•▸►➜✓★·○◆]/.test(rawLine);
    const stripped = rawLine.replace(/^\s*[-•▸►➜✓★·○◆]\s*/, "").trim();
    if (!stripped) continue;

    const hasYear = yearRegex.test(stripped);

    // Pattern A: "Year – Degree – Institution, Location" (common French CV format)
    // e.g. "2001 – Master Informatique et Gestion (Management NTIC) – ESG / ESGI, Paris"
    const yearFirstMatch = stripped.match(/^(\d{4})\s*[-–:]\s*(.*)/);
    if (yearFirstMatch) {
      if (current) entries.push(current);
      const year = yearFirstMatch[1];
      const rest = yearFirstMatch[2];
      // Split remaining on " – " to separate degree from institution
      const parts = rest.split(/\s+[-–]\s+/);
      current = {
        degree: parts[0]?.trim() ?? rest,
        institution: parts.slice(1).join(" – ").trim(),
        period: year,
        description: "",
      };
      continue;
    }

    // Pattern B: Non-bullet line that looks like a degree/institution heading
    if (!isBulletLine && stripped.length < 120) {
      if (hasYear) {
        if (current) entries.push(current);
        const period = parsePeriod(stripped);
        const degreeText = stripped.replace(/\(?(?:19|20)\d{2}[\s\-–à]*(?:(?:19|20)\d{2})?\)?/g, "").trim();
        const parts = degreeText.split(/\s+[-–]\s+/);
        current = {
          degree: parts[0]?.trim() ?? degreeText,
          institution: parts.slice(1).join(" – ").trim(),
          period: period.raw,
          description: "",
        };
      } else if (!current) {
        current = { degree: stripped, institution: "", period: "", description: "" };
      } else if (!current.institution) {
        current.institution = stripped;
      } else {
        entries.push(current);
        current = { degree: stripped, institution: "", period: "", description: "" };
      }
      continue;
    }

    // Bullet content lines — add to current entry description
    if (current && isBulletLine) {
      current.description = current.description ? current.description + ". " + stripped : stripped;
    } else if (current) {
      current.description = current.description ? current.description + " " + stripped : stripped;
    }
  }

  if (current && current.degree) entries.push(current);

  return entries;
}

// ─── Skills parser ────────────────────────────────────────────────────────────

function parseSkillsSection(content: string): string[] {
  if (!content.trim()) return [];

  const skills: string[] = [];
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Check if line has "Category: skill1, skill2, skill3" format
    const catMatch = line.match(/^(.+?)\s*:\s*(.+)$/);
    if (catMatch) {
      const items = catMatch[2]
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 60);
      skills.push(...items);
    } else {
      // Split by common delimiters
      const items = line
        .split(/[,;•·|\t▸►➜✓✅⬛●○◆★]/)
        .map((s) => s.replace(/^[-\s]+/, "").trim())
        .filter((s) => s.length > 1 && s.length < 60);
      if (items.length > 1) {
        skills.push(...items);
      } else if (line.length < 60 && line.length > 1) {
        skills.push(line.replace(/^[-•▸►]\s*/, "").trim());
      }
    }
  }

  // Deduplicate
  return [...new Set(skills)];
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
          location: (e.location as string) ?? "",
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
