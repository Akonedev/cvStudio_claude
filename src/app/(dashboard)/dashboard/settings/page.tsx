import { SettingsInterface } from "@/components/settings/settings-interface";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-display font-bold">Paramètres</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configurez votre compte et vos préférences
          </p>
        </div>
      </div>
      <div className="flex-1 p-6">
        <SettingsInterface />
      </div>
    </div>
  );
}
