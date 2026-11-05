import { Building } from "iconoir-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  ProductIcon,
  type ProductIconComponent,
} from "@/components/ui/product-icon";

export function EmptyState({
  icon = Building,
  title,
  description,
  action,
}: {
  icon?: ProductIconComponent;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-border/70 bg-muted/20 shadow-none">
      <CardContent className="flex flex-col items-center gap-5 px-6 py-16 text-center sm:py-20">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-background">
          <ProductIcon icon={icon} className="size-6 text-muted-foreground" />
        </div>
        <h2 className="font-heading text-2xl font-medium tracking-tight">{title}</h2>
        <p className="max-w-sm text-sm leading-7 text-muted-foreground">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
