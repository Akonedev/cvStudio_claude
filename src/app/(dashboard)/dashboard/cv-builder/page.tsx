import { DashboardHeader } from "@/components/dashboard/header";
import { CVList } from "@/components/cv-builder/cv-list";

export default function CVBuilderPage() {
  return (
    <>
      <DashboardHeader
        title="Mes CV"
        subtitle="Créez et gérez vos curriculum vitae"
        action={{ label: "Nouveau CV", href: "/dashboard/cv-builder/new" }}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <CVList />
      </div>
    </>
  );
}
