import { CVEditorCanvas } from "@/components/cv-builder/cv-editor-canvas";

export default function CVEditorPage({ params }: { params: { id: string } }) {
  return <CVEditorCanvas cvId={params.id} />;
}
