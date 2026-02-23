import { HistoryInterface } from "@/components/history/history-interface";

export default function HistoryPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-display font-bold">Historique</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Toutes vos activités, créations et candidatures
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <HistoryInterface />
      </div>
    </div>
  );
}
