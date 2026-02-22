import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, notFound, withAuth } from "@/lib/api-response";
import { scrapeJobOffer } from "@/lib/scraper";
import { createCompletion } from "@/lib/ai-service";
import { logHistory } from "@/lib/history";
import { z } from "zod";

const AnalyzeSchema = z.object({
  url: z.string().url().optional(),
  description: z.string().optional(),
  cvId: z.string(),
}).refine((d) => d.url || d.description, { message: "URL ou description requise" });

/**
 * POST /api/job-offers/analyze
 * Scrapes a job offer URL and runs an AI match report against the active CV.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = AnalyzeSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const cv = await prisma.cV.findFirst({ where: { id: parsed.data.cvId, userId: session.user.id } });
  if (!cv) return notFound("CV introuvable");

  // Scrape if URL provided
  let jobText = parsed.data.description || "";
  let scrapedData: { title?: string; company?: string; location?: string } = {};

  if (parsed.data.url) {
    try {
      const scraped = await scrapeJobOffer(parsed.data.url);
      jobText = scraped.description || jobText;
      scrapedData = { title: scraped.title, company: scraped.company, location: scraped.location };
    } catch {
      // Scraping failed — use any provided description
    }
  }

  if (!jobText) return err("Impossible d'extraire le contenu de l'annonce", 422);

  // Save job offer
  const jobOffer = await prisma.jobOffer.create({
    data: {
      userId: session.user.id,
      url: parsed.data.url,
      title: scrapedData.title || "Offre d'emploi",
      company: scrapedData.company,
      location: scrapedData.location,
      description: jobText,
    },
  });

  // AI match analysis
  const messages = [
    {
      role: "system" as const,
      content: `Tu es un expert senior en recrutement et RH. Analyse l'adéquation entre ce CV et cette offre d'emploi.
Retourne un JSON structuré avec:
- matchScore: number (0-100, score global d'adéquation)
- categories: { skills: number, experience: number, education: number, keywords: number, culture: number }
- keywordMatches: { present: string[], missing: string[], recommended: string[] }
- strengths: string[] (points forts du candidat pour ce poste)
- gaps: string[] (lacunes à combler)
- insights: string[] (conseils stratégiques)
- adaptedCVSummary: string (comment adapter le CV pour ce poste)
- urgency: "high"|"medium"|"low" (niveau d'urgence des adaptations)`,
    },
    { role: "user" as const, content: `CV:\n${JSON.stringify(cv.data)}\n\nOffre:\n${jobText}` },
  ];

  const response = await createCompletion({ messages, maxTokens: 2000, temperature: 0.3 }, session.user.id);
  const jsonMatch = response.content.match(/\{[\s\S]*\}/);
  const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { matchScore: 0, summary: response.content };

  // Save match result
  const match = await prisma.jobMatch.create({
    data: {
      userId: session.user.id,
      cvId: cv.id,
      jobOfferId: jobOffer.id,
      matchScore: analysis.matchScore || 0,
      matchDetails: analysis,
    },
  });

  await logHistory(session.user.id, "ANALYZE", "JOB_OFFER", jobOffer.id, { matchScore: analysis.matchScore, cvId: cv.id });

  return ok({ match, jobOffer, analysis });
});
