import { WarningTriangle } from "iconoir-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductIcon } from "@/components/ui/product-icon";

export function ErrorState({
  title = "Algo salió mal",
  description = "No se pudo cargar esta vista. Inténtalo de nuevo.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Card role="alert" className="rounded-2xl border-border/70 shadow-none">
      <CardContent className="flex flex-col items-center gap-5 px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-sm border border-destructive/20 bg-destructive/10">
          <ProductIcon icon={WarningTriangle} className="size-6 text-destructive" />
        </div>
        <h2 className="font-heading text-2xl font-medium tracking-tight">{title}</h2>
        <p className="max-w-sm text-sm leading-7 text-muted-foreground">{description}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
