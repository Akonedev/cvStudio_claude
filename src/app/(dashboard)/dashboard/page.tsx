import { DashboardHeader } from "@/components/dashboard/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActiveCVCard } from "@/components/dashboard/active-cv-card";
import { SubscriptionBanner } from "@/components/dashboard/subscription-banner";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Tableau de bord"
        subtitle="Bienvenue, Jean — Votre espace de recherche d'emploi"
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <SubscriptionBanner />
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
          <div>
            <ActiveCVCard />
          </div>
        </div>
      </div>
    </>
  );
}
