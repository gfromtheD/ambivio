import type { Metadata } from "next";
import { WorkspaceHeading } from "@/components/layout/workspace-heading";
import Link from "next/link";
import { Plus } from "iconoir-react";

import { PropertiesEmptyState } from "@/components/properties/properties-empty-state";
import { PropertyCard } from "@/components/properties/property-card";
import { Button } from "@/components/ui/button";
import { ProductIcon } from "@/components/ui/product-icon";
import { listProperties } from "@/services/properties";

export const metadata: Metadata = {
  title: "Propiedades",
};

export default async function PropertiesPage() {
  const properties = await listProperties();

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <WorkspaceHeading
        title="Propiedades"
        description="Un lugar para cada inmueble. Prepara sus espacios a partir de las fotografías originales."
        action={<Button asChild><Link href="/properties/new"><ProductIcon icon={Plus} className="size-4" />Crear propiedad</Link></Button>}
      />
      {properties.length === 0 ? (
        <PropertiesEmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              address={property.address}
              status={property.status}
              createdAt={property.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
