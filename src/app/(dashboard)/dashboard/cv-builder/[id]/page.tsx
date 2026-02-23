import { CVEditorCanvas } from "@/components/cv-builder/cv-editor-canvas";

export default async function CVEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CVEditorCanvas cvId={id} />;
}
