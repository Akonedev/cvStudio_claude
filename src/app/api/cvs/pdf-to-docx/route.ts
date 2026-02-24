import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-response";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  SectionType,
  TabStopPosition,
  TabStopType,
} from "docx";

// Allow large file uploads
export const maxDuration = 60;
export const runtime = "nodejs";

/**
 * Fix UTF-8 text that was double-encoded (UTF-8 bytes decoded as Latin-1).
 */
function fixEncoding(text: string): string {
  const hasMojibake =
    /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}/.test(text) ||
    text.includes("Ã") ||
    text.includes("â€");
  if (!hasMojibake) return text;
  try {
    const bytes = new Uint8Array(text.length);
    let hasHighBytes = false;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code > 255) return text;
      bytes[i] = code;
      if (code > 127) hasHighBytes = true;
    }
    if (!hasHighBytes) return text;
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    if (decoded.length < text.length) return decoded;
    return text;
  } catch {
    return text;
  }
}

/**
 * POST /api/cvs/pdf-to-docx
 * Accepts a PDF file upload and returns a DOCX file with the extracted text
 * properly formatted for editing.
 */
export const POST = withAuth(async (req: NextRequest) => {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (e) {
    const message = (e as Error).message || "";
    if (
      message.includes("size") ||
      message.includes("limit") ||
      message.includes("too large")
    ) {
      return NextResponse.json(
        { success: false, error: "Le fichier est trop volumineux. Taille maximale : 100 Mo." },
        { status: 413 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Impossible de lire le fichier envoyé." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "Aucun fichier fourni (champ 'file' requis)." },
      { status: 400 }
    );
  }

  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(".pdf")) {
    return NextResponse.json(
      { success: false, error: "Seuls les fichiers PDF sont acceptés pour la conversion." },
      { status: 400 }
    );
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { success: false, error: "Le fichier dépasse la taille maximale de 100 Mo." },
      { status: 400 }
    );
  }

  try {
    // Parse PDF
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse") as (
      buf: Buffer
    ) => Promise<{ text: string; numpages: number; info?: Record<string, string> }>;
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    let rawText = fixEncoding(pdfData.text);

    // Detect image-based PDFs
    const cleanedText = rawText.replace(/\s+/g, " ").trim();
    if (cleanedText.length < 50 && pdfData.numpages > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Ce PDF semble être basé sur des images (${pdfData.numpages} page(s), ` +
            `seulement ${cleanedText.length} caractères extraits). ` +
            "La conversion en DOCX n'est pas possible pour les PDFs scannés. " +
            "Utilisez un outil OCR (comme Adobe Acrobat ou un service en ligne) pour convertir le PDF d'abord.",
        },
        { status: 400 }
      );
    }

    // Split text into lines and generate DOCX
    const lines = rawText.split("\n");
    const paragraphs: Paragraph[] = [];

    // Add document title
    const originalName = file.name.replace(/\.pdf$/i, "");
    paragraphs.push(
      new Paragraph({
        text: `Document converti : ${originalName}`,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Converti depuis ${file.name} (${pdfData.numpages} page(s))`,
            italics: true,
            size: 18,
            color: "888888",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    // Add a separator line
    paragraphs.push(
      new Paragraph({
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        },
        spacing: { after: 300 },
      })
    );

    // Process each line with formatting heuristics
    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines — add spacing
      if (!trimmed) {
        paragraphs.push(new Paragraph({ spacing: { before: 100 } }));
        continue;
      }

      // Detect section headings (ALL CAPS, or known patterns)
      const isHeading = detectHeading(trimmed);

      if (isHeading) {
        paragraphs.push(
          new Paragraph({
            text: trimmed,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
            },
          })
        );
        continue;
      }

      // Detect bullet points
      const bulletMatch = trimmed.match(/^[-•▸►➜✓★·○◆✔→]\s*(.*)/);
      if (bulletMatch) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: "• " }),
              new TextRun({ text: bulletMatch[1] }),
            ],
            indent: { left: 720 }, // 0.5 inch
            spacing: { before: 40, after: 40 },
          })
        );
        continue;
      }

      // Detect dates / periods (likely experience headers)
      const datePattern =
        /(?:jan|fev|fév|mar|avr|mai|jun|jui|jul|aoû|aou|sep|oct|nov|déc|dec|january|february|march|april|may|june|july|august|september|october|november|december)[\w.]*\s*\d{4}/i;
      const hasDate = datePattern.test(trimmed);

      if (hasDate && trimmed.length < 120) {
        // Date line — likely a sub-heading (company/period)
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: trimmed, bold: true, size: 22 }),
            ],
            spacing: { before: 200, after: 60 },
          })
        );
        continue;
      }

      // Regular text
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22 })],
          spacing: { before: 40, after: 40 },
        })
      );
    }

    // Create DOCX document
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Calibri",
              size: 22, // 11pt
            },
          },
          heading2: {
            run: {
              font: "Calibri",
              size: 26, // 13pt
              bold: true,
              color: "2E2E2E",
            },
          },
        },
      },
      sections: [
        {
          properties: {
            type: SectionType.CONTINUOUS,
            page: {
              margin: {
                top: 1134, // 2cm
                bottom: 1134,
                left: 1134,
                right: 1134,
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    // Generate DOCX buffer
    const docxBuffer = await Packer.toBuffer(doc);

    // Return DOCX file
    const outputName = originalName + ".docx";
    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(outputName)}"`,
        "Content-Length": String(docxBuffer.length),
      },
    });
  } catch (e) {
    console.error("[pdf-to-docx] Error:", e);
    return NextResponse.json(
      {
        success: false,
        error: `Erreur lors de la conversion : ${(e as Error).message}`,
      },
      { status: 500 }
    );
  }
});

/**
 * Detect if a line is a section heading.
 */
function detectHeading(line: string): boolean {
  if (line.length > 80 || line.length < 3) return false;
  // Skip lines that are clearly content
  if (/^[-•▸►➜✓★·○◆]/.test(line)) return false;
  if (/^(https?:|www\.|[a-z]+@)/.test(line)) return false;

  // ALL CAPS lines (with at least one letter)
  if (
    line === line.toUpperCase() &&
    /[A-ZÀ-Ý]/.test(line) &&
    line.length > 3 &&
    line.length < 60
  ) {
    return true;
  }

  // Known section patterns
  const normalized = line
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const patterns = [
    /^(profil|resume|summary|a propos|about|objectif|presentation)/,
    /^(experiences?|parcours professionnel|emploi|career|work)/,
    /^(formations?|education|etudes|diplomes?|cursus)/,
    /^(competences?|skills|aptitudes?|savoir faire|technologies|expertise)/,
    /^(langues?|languages?)/,
    /^(certifications?|certificats?)/,
    /^(projets?|realisations?|portfolio)/,
    /^(loisirs?|hobbies?|interets?|centres?\s+d\s*interet)/,
    /^(references?|recommandations?)/,
  ];
  return patterns.some((p) => p.test(normalized));
}
