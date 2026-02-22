import { InterviewPrepInterface } from "@/components/interview/interview-prep-interface";

export default function InterviewPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold">Préparation Entretien</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Entraînez-vous avec l'IA et décrochez le poste de vos rêves
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <InterviewPrepInterface />
      </div>
    </div>
  );
}
