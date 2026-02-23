import { DashboardHeader } from "@/components/dashboard/header";
import { JobMatcherInterface } from "@/components/job-matcher/job-matcher-interface";

export default function JobMatcherPage() {
  return (
    <>
      <DashboardHeader
        title="Job Matcher"
        subtitle="Analysez des offres et adaptez votre candidature automatiquement"
      />
      <div className="flex-1 overflow-hidden">
        <JobMatcherInterface />
      </div>
    </>
  );
}
