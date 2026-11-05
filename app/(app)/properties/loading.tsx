import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-10"
      aria-busy="true"
      aria-label="Cargando propiedades"
    >
      <div className="border-b border-border pb-8">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-4 h-10 w-56" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
