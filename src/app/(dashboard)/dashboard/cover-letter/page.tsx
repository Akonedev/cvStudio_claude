import { CoverLetterInterface } from "@/components/cover-letter/cover-letter-interface";

export default function CoverLetterPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold">Lettre de Motivation</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Générez des lettres personnalisées adaptées à chaque offre
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CoverLetterInterface />
      </div>
    </div>
  );
}
