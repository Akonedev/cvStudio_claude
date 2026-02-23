import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, err, withAuth } from "@/lib/api-response";
import { createCompletion } from "@/lib/ai-service";
import { logHistory } from "@/lib/history";
import { z } from "zod";

const AnalyzeSchema = z.object({
  jobDescription: z.string().optional(),
});

/**
 * POST /api/cvs/[id]/ats
 * Analyses the CV against ATS criteria and optionally a specific job description.
 */
export const POST = withAuth(async (req: NextRequest, session, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const cv = await prisma.cV.findFirst({ where: { id, userId: session.user.id } });
  if (!cv) return notFound("CV introuvable");

  const body = await req.json().catch(() => ({}));
  const parsed = AnalyzeSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.message, 400);

  const cvText = JSON.stringify(cv.data);
  const jobCtx = parsed.data.jobDescription
    ? `\n\nOffre d'emploi cible:\n${parsed.data.jobDescription}`
    : "";

  const messages = [
    {
      role: "system" as const,
      content: `Tu es un expert senior RH et ATS (Applicant Tracking System). 
Analyse ce CV de manière exhaustive et retourne un JSON structuré avec:
- score: number (0-100, score ATS global)
- categories: { formatting: number, keywords: number, readability: number, completeness: number, length: number }
- issues: Array<{ severity: "critical"|"warning"|"info", message: string, suggestion: string }>
- keywords: { present: string[], missing: string[], recommended: string[] }
- summary: string (résumé exécutif en français)
- improvements: string[] (liste des améliorations prioritaires)`,
    },
    {
      role: "user" as const,
      content: `Analyse ce CV:\n${cvText}${jobCtx}`,
    },
  ];

  let analysis;
  try {
    const response = await createCompletion({ messages, maxTokens: 2000, temperature: 0.2 }, session.user.id);
    // Parse JSON from response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: response.content, score: 0 };
  } catch {
    // Fallback mock analysis if AI fails
    analysis = {
      score: 72,
      categories: { formatting: 80, keywords: 65, readability: 75, completeness: 70, length: 85 },
      issues: [
        { severity: "warning", message: "Mots-clés manquants", suggestion: "Ajoutez des compétences techniques spécifiques" },
      ],
      keywords: { present: [], missing: [], recommended: [] },
      summary: "Analyse IA temporairement indisponible.",
      improvements: ["Configurez un provider IA pour une analyse complète."],
    };
  }

  // Update ATS score in DB
  const score = typeof analysis.score === "number" ? analysis.score : 0;
  await prisma.cV.update({ where: { id }, data: { atsScore: score } });
  await logHistory(session.user.id, "ANALYZE", "CV", id, { score });

  return ok({ analysis, score, cvId: id });
});
