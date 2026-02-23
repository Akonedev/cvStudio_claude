import { SubscriptionInterface } from "@/components/subscription/subscription-interface";

export default function SubscriptionPage() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-display font-bold">Abonnement & Facturation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gérez votre plan, vos paiements et vos factures
          </p>
        </div>
      </div>
      <div className="flex-1 p-6">
        <SubscriptionInterface />
      </div>
    </div>
  );
}
