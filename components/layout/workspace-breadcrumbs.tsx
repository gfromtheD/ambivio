"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function WorkspaceBreadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const items: { label: string; href: string }[] = [];
  if (parts[0] === "properties") {
    items.push({ label: "Propiedades", href: "/properties" });
    if (parts[1] === "new") items.push({ label: "Nueva propiedad", href: pathname });
    else if (parts[1]) {
      items.push({ label: "Inmueble", href: `/properties/${parts[1]}` });
      if (parts[2] === "edit") items.push({ label: "Editar", href: pathname });
      if (parts[2] === "rooms") {
        items.push({ label: "Habitaciones", href: `/properties/${parts[1]}/rooms` });
        if (parts[3]) items.push({ label: parts[3] === "new" ? "Nueva habitación" : "Estancia", href: pathname });
      }
    }
  } else items.push({ label: parts[0] === "generations" ? "Generaciones" : "Configuración", href: pathname });
  return <nav aria-label="Ubicación actual" className="hidden min-w-0 items-center gap-2 overflow-hidden text-sm sm:flex">{items.map((item, index) => <span key={item.href} className="flex min-w-0 items-center gap-2">{index > 0 ? <span aria-hidden="true" className="text-muted-foreground/50">/</span> : null}{index === items.length - 1 ? <span aria-current="page" className="truncate font-medium">{item.label}</span> : <Link href={item.href} className="whitespace-nowrap text-muted-foreground hover:text-foreground hover:underline">{item.label}</Link>}</span>)}</nav>;
}
