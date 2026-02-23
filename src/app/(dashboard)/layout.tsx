import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { GlobalAIChatPanel } from "@/components/shared/global-ai-chat";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      <GlobalAIChatPanel />
      <Toaster richColors position="top-right" />
    </div>
  );
}
