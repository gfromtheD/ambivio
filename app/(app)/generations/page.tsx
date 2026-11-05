import type { Metadata } from "next";
import { WorkspaceHeading } from "@/components/layout/workspace-heading";

import { GenerationsHistoryView } from "@/components/generations/generations-history-view";
import { listAllGenerations } from "@/services/generations";

export const metadata: Metadata = {
  title: "Historial de Generaciones",
};

export default async function GenerationsPage() {
  const generations = await listAllGenerations();

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <WorkspaceHeading title="Tus generaciones" description="Vuelve a cada propuesta, compara el antes y el después y guarda tus resultados." />
      <GenerationsHistoryView initialGenerations={generations} />
    </div>
  );
}
