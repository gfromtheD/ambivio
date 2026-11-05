import Link from "next/link";
import { Building, Coins, FrameAlt, Settings } from "iconoir-react";

import { SidebarNavLink } from "@/components/layout/sidebar-nav-link";
import { AmbivioMark } from "@/components/brand/ambivio-mark";
import { Badge } from "@/components/ui/badge";
import { ProductIcon } from "@/components/ui/product-icon";
import { SUBSCRIPTION_PLAN_LABELS } from "@/lib/domain";
import { cn } from "@/lib/utils";

export function AppSidebar({
  organizationName,
  subscriptionPlan,
  creditsAvailable,
  className,
  onNavigate,
}: {
  organizationName: string;
  subscriptionPlan: string | null;
  creditsAvailable: number | null;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <aside className={cn("flex h-dvh w-full shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:sticky lg:top-0", className)}>
      <div className="flex min-h-20 items-center px-7">
        <Link
          href="/properties"
          aria-label="Ambivio · ir a propiedades"
          className="outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/30"
        >
          <AmbivioMark symbolClassName="size-5" />
        </Link>
      </div>
      <nav aria-label="Navegación principal" className="flex-1 space-y-2 overflow-y-auto px-4 py-10">
        <SidebarNavLink href="/properties" icon={Building} onNavigate={onNavigate}>
          Propiedades
        </SidebarNavLink>
        <SidebarNavLink href="/generations" icon={FrameAlt} onNavigate={onNavigate}>
          Generaciones
        </SidebarNavLink>
        <SidebarNavLink href="/settings" icon={Settings} onNavigate={onNavigate}>
          Configuración
        </SidebarNavLink>
      </nav>
      <div className="mx-4 mb-5 rounded-2xl border border-sidebar-border/70 bg-background p-4">
        <p className="truncate text-sm font-medium" title={organizationName}>{organizationName}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {subscriptionPlan ? (
            <Badge variant="outline">
              {SUBSCRIPTION_PLAN_LABELS[subscriptionPlan as keyof typeof SUBSCRIPTION_PLAN_LABELS] ??
                subscriptionPlan}
            </Badge>
          ) : null}
          {creditsAvailable !== null ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ProductIcon icon={Coins} className="size-3.5" />
              {creditsAvailable} créditos
            </span>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
