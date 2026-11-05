import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8" aria-busy="true" aria-label="Cargando contenido">
      <Skeleton className="h-10 w-full max-w-64" />
      <Skeleton className="h-4 w-full max-w-96" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}
