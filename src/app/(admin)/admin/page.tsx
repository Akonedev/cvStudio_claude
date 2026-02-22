import { DashboardHeader } from "@/components/dashboard/header";
import { AdminOverview } from "@/components/admin/admin-overview";

export default function AdminPage() {
  return (
    <>
      <DashboardHeader title="Administration" subtitle="Vue d'ensemble de la plateforme" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminOverview />
      </div>
    </>
  );
}
