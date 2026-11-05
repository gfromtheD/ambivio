"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, RefreshDouble } from "iconoir-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductIcon } from "@/components/ui/product-icon";
import {
  createPropertyAction,
  updatePropertyAction,
  type PropertyFormState,
} from "@/services/properties";

const initialState: PropertyFormState = { error: null };

export function PropertyForm({
  propertyId,
  initialTitle = "",
  initialAddress = "",
  submitLabel = "Crear propiedad",
}: {
  propertyId?: string;
  initialTitle?: string;
  initialAddress?: string;
  submitLabel?: string;
}) {
  const action = propertyId
    ? updatePropertyAction.bind(null, propertyId)
    : createPropertyAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="workspace-form max-w-xl"
      aria-busy={pending}
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="title">Nombre de la propiedad</Label>
          <Input
            id="title"
            name="title"
            placeholder="Piso en el centro"
            defaultValue={initialTitle}
            disabled={pending}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Dirección <span className="font-normal text-muted-foreground">(opcional)</span></Label>
          <Input
            id="address"
            name="address"
            placeholder="Calle Mayor 12, Madrid"
            defaultValue={initialAddress}
            disabled={pending}
          />
        </div>
        {state.error ? (
          <p
            role="alert"
            className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          >
            {state.error}
          </p>
        ) : null}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center">
          <Button type="submit" disabled={pending}>
            {pending ? (
              <>
                <ProductIcon
                  icon={RefreshDouble}
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
                Guardando…
              </>
            ) : (
              submitLabel
            )}
          </Button>
          <Button asChild variant="ghost">
            <Link href="/properties">
              <ProductIcon icon={ArrowLeft} className="size-4" />
              Cancelar
            </Link>
          </Button>
        </div>
      </div>
    </form>
  );
}
