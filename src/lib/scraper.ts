import axios from "axios";
import * as cheerio from "cheerio";
import { ScrapedJob } from "@/types";

/**
 * Scrapes a job offer page and extracts structured data.
 * Works with LinkedIn, Indeed, Welcome to the Jungle, Pole Emploi, and generic pages.
 */
export async function scrapeJobOffer(url: string): Promise<ScrapedJob> {
  const { data: html } = await axios.get(url, {
    timeout: 15000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8",
    },
  });

  const $ = cheerio.load(html);

  // Remove noisy elements
  $("script, style, nav, footer, header, iframe, noscript").remove();

  const source = detectSource(url);

  let title = "";
  let company = "";
  let location = "";
  let contractType = "";
  let salary = "";
  let description = "";

  switch (source) {
    case "linkedin":
      title = $(".job-details-jobs-unified-top-card__job-title").text().trim();
      company = $(".job-details-jobs-unified-top-card__company-name").text().trim();
      location = $(".job-details-jobs-unified-top-card__primary-description-container .tvm__text").first().text().trim();
      description = $(".jobs-description__content").text().trim();
      break;

    case "indeed":
      title = $('[data-testid="jobsearch-JobInfoHeader-title"]').text().trim();
      company = $('[data-testid="inlineHeader-companyName"]').text().trim();
      location = $('[data-testid="job-location"]').text().trim();
      description = $("#jobDescriptionText").text().trim();
      break;

    case "pole-emploi":
      title = $(".title").first().text().trim();
      company = $(".enterprise").first().text().trim();
      location = $(".location").first().text().trim();
      description = $(".description").text().trim();
      break;

    default:
      // Generic extraction
      title =
        $("h1").first().text().trim() ||
        $('meta[property="og:title"]').attr("content") ||
        "";
      company =
        $('[class*="company"], [class*="employer"], [itemprop="hiringOrganization"]')
          .first()
          .text()
          .trim();
      location =
        $('[class*="location"], [class*="place"], [itemprop="jobLocation"]')
          .first()
          .text()
          .trim();
      description = $("main, article, [class*='description'], [class*='content']")
        .first()
        .text()
        .trim()
        .slice(0, 10000);
  }

  // Fallback to full body text if description not found
  if (!description) {
    description = $("body").text().replace(/\s\s+/g, " ").trim().slice(0, 10000);
  }

  const keywords = extractKeywords(description);
  const skills = extractSkills(description);
  const requirements = extractRequirements(description);
  contractType = contractType || detectContractType(description);

  return {
    url,
    title: title || "Offre d'emploi",
    company: company || "Entreprise",
    location: location || "",
    contractType,
    salary,
    description,
    requirements,
    skills,
    keywords,
    source,
  };
}

function detectSource(url: string): string {
  if (url.includes("linkedin.com")) return "linkedin";
  if (url.includes("indeed.")) return "indeed";
  if (url.includes("pole-emploi.fr") || url.includes("francetravail.fr"))
    return "pole-emploi";
  if (url.includes("welcometothejungle.com")) return "wttj";
  if (url.includes("apec.fr")) return "apec";
  return "generic";
}

function detectContractType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("cdi")) return "CDI";
  if (lower.includes("cdd")) return "CDD";
  if (lower.includes("freelance") || lower.includes("indépendant")) return "Freelance";
  if (lower.includes("stage")) return "Stage";
  if (lower.includes("alternance") || lower.includes("apprentissage")) return "Alternance";
  if (lower.includes("interim") || lower.includes("intérim")) return "Intérim";
  return "";
}

function extractKeywords(text: string): string[] {
  const skillPatterns =
    /\b(JavaScript|TypeScript|Python|Java|React|Vue|Angular|Node\.js|Next\.js|SQL|PostgreSQL|MongoDB|Docker|Kubernetes|AWS|Azure|GCP|Git|CI\/CD|REST|GraphQL|Agile|Scrum|DevOps|ML|IA|AI|HTML|CSS|PHP|Ruby|Golang|Go|Rust|Swift|Kotlin|C\+\+|C#|\.NET|Spring|Django|FastAPI|Laravel|Symfony)\b/gi;
  const matches = text.match(skillPatterns) ?? [];
  return [...new Set(matches.map((k) => k.trim()))].slice(0, 30);
}

function extractSkills(text: string): string[] {
  const techSkills =
    /\b(JavaScript|TypeScript|Python|Java|React|Vue|Angular|Node\.js|Next\.js|SQL|PostgreSQL|MongoDB|Docker|Kubernetes|AWS|Azure|GCP|Git|CI\/CD|REST|GraphQL|HTML|CSS|PHP|Ruby|Go|Rust)\b/gi;
  const softSkills =
    /\b(leadership|communication|autonomie|rigueur|adaptabilité|créativité|esprit d'équipe|gestion de projet|analyse|synthèse)\b/gi;
  const tech = text.match(techSkills) ?? [];
  const soft = text.match(softSkills) ?? [];
  return [...new Set([...tech, ...soft].map((s) => s.trim()))].slice(0, 20);
}

function extractRequirements(text: string): string[] {
  const lines = text.split(/\n|•|·|-/)
    .map((l) => l.trim())
    .filter(
      (l) =>
        l.length > 20 &&
        l.length < 250 &&
        /expérience|diplôme|bac\+|master|niveau|requis|obligatoire|minimum|ans/i.test(l)
    )
    .slice(0, 10);
  return lines;
}
