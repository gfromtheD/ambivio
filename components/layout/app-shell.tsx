"use client";

import { useState } from "react";
import { Menu, User, Xmark } from "iconoir-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AmbivioMark } from "@/components/brand/ambivio-mark";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { Button } from "@/components/ui/button";
import { ProductIcon } from "@/components/ui/product-icon";

type AppShellProps = {
  children: React.ReactNode;
  organizationName: string;
  subscriptionPlan: string | null;
  creditsAvailable: number | null;
  userEmail: string | null;
};

export function AppShell({
  children,
  organizationName,
  subscriptionPlan,
  creditsAvailable,
  userEmail,
}: AppShellProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  const sidebarProps = {
    organizationName,
    subscriptionPlan,
    creditsAvailable,
    onNavigate: () => setMobileNavigationOpen(false),
  };

  return (
    <div className="workspace min-h-dvh bg-background">
      <a href="#workspace-content" className="sr-only fixed top-3 left-3 z-[100] rounded-full bg-foreground px-5 py-3 text-sm text-background focus:not-sr-only">Saltar al contenido</a>
      <div className="grid min-h-dvh lg:grid-cols-[17rem_minmax(0,1fr)]">
        <AppSidebar
          {...sidebarProps}
          className="hidden border-r border-sidebar-border lg:flex"
        />

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/90 px-5 backdrop-blur-xl sm:px-8 lg:px-12">
            <div className="flex min-w-0 items-center gap-3">
              <DialogPrimitive.Root
                open={mobileNavigationOpen}
                onOpenChange={setMobileNavigationOpen}
              >
                <DialogPrimitive.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Abrir navegación"
                  >
                    <ProductIcon icon={Menu} className="size-5" />
                  </Button>
                </DialogPrimitive.Trigger>
                <DialogPrimitive.Portal>
                  <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/25 supports-backdrop-filter:backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:backdrop-blur-none" />
                  <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 w-[min(20rem,calc(100vw-2rem))] origin-left bg-sidebar shadow-ambivio outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none">
                    <DialogPrimitive.Title className="sr-only">
                      Navegación principal
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                      Accesos a propiedades, generaciones y configuración.
                    </DialogPrimitive.Description>
                    <DialogPrimitive.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 z-10"
                        aria-label="Cerrar navegación"
                      >
                        <ProductIcon icon={Xmark} className="size-5" />
                      </Button>
                    </DialogPrimitive.Close>
                    <AppSidebar {...sidebarProps} />
                  </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
              </DialogPrimitive.Root>

              <AmbivioMark className="sm:hidden" symbolClassName="size-5" />
              <WorkspaceBreadcrumbs />
            </div>

            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="hidden min-w-0 items-center gap-2 border-r pr-3 text-sm text-muted-foreground sm:flex">
                <ProductIcon icon={User} className="size-4" />
                <span className="max-w-52 truncate">{userEmail}</span>
              </div>
              <SignOutButton compact />
            </div>
          </header>

          <main id="workspace-content" tabIndex={-1} className="min-w-0 flex-1 px-5 pt-9 pb-20 outline-none sm:px-8 sm:pt-12 lg:px-12 lg:pt-14">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
