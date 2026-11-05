"use client";
import Link from "next/link";
import { useActionState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthFeedback } from "@/components/auth/auth-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordAction, type AuthState } from "@/services/auth";
const initialState: AuthState = { error: null, success: null };
export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, initialState);
  return <AuthCard title="Nueva contraseña" description="Elige una contraseña segura para volver a tu espacio de trabajo.">
    {state.success ? <div className="space-y-5"><AuthFeedback error={null} success={state.success} /><Button asChild className="w-full"><Link href="/properties">Continuar a mis propiedades</Link></Button></div> : <form action={action} aria-busy={pending} className="grid gap-5">
      <div className="grid gap-2"><Label htmlFor="new-password">Nueva contraseña</Label><Input id="new-password" name="password" type="password" minLength={8} autoComplete="new-password" required disabled={pending} aria-describedby="password-help" /><p id="password-help" className="text-xs text-muted-foreground">Utiliza al menos 8 caracteres.</p></div>
      <div className="grid gap-2"><Label htmlFor="confirm-password">Repetir contraseña</Label><Input id="confirm-password" name="confirm_password" type="password" minLength={8} autoComplete="new-password" required disabled={pending} /></div>
      <AuthFeedback error={state.error} success={null} /><Button type="submit" disabled={pending}>{pending ? "Actualizando…" : "Guardar nueva contraseña"}</Button>
    </form>}
  </AuthCard>;
}
