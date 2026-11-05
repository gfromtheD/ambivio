import Link from "next/link";
import { Building, MapPin, NavArrowRight } from "iconoir-react";

import { ProductIcon } from "@/components/ui/product-icon";

export function PropertyCard({
  id,
  title,
  address,
  status,
  createdAt,
}: {
  id: string;
  title: string;
  address: string | null;
  status: string;
  createdAt: string;
}) {
  return (
    <article className="group/property h-full overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground transition-[border-color,box-shadow] duration-[var(--motion-duration-control)] ease-[var(--motion-ease-out)] hover:border-foreground/25 hover:shadow-[0_8px_28px_-18px_#00000030] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
      <Link
        href={`/properties/${id}`}
        aria-label={`Abrir propiedad: ${title}`}
        className="flex h-full flex-col outline-none"
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <span className="grid size-12 place-items-center rounded-xl bg-muted/70">
          <ProductIcon
            icon={Building}
            className="size-6 text-muted-foreground"
          />
          </span>
          <span className="text-xs text-muted-foreground">{status === "active" ? "Activa" : "Archivada"}</span>
        </div>

        <div className="flex min-h-44 flex-1 flex-col gap-1 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="min-w-0 break-words text-xl leading-snug font-medium tracking-tight">{title}</h2>
            <ProductIcon
              icon={NavArrowRight}
              className="mt-0.5 size-4 text-muted-foreground transition-transform duration-[var(--motion-duration-control)] ease-[var(--motion-ease-out)] motion-safe:group-hover/property:translate-x-0.5"
            />
          </div>
          {address ? (
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <ProductIcon icon={MapPin} className="mt-0.5 size-3.5" />
              <span>{address}</span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Sin dirección añadida</p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
            <span>Abrir propiedad</span>
            <span>
              {new Date(createdAt).toLocaleDateString("es-ES", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
