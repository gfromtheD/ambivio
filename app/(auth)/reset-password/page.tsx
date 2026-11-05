import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nueva contraseña" };
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || params.error) return <AuthCard title="Solicita un enlace nuevo" description="Este enlace de recuperación no es válido o ha caducado."><Link href="/forgot-password" className="inline-flex rounded-md bg-foreground px-4 py-3 text-sm font-medium text-background">Solicitar otro enlace</Link><Link href="/login" className="mt-5 block text-sm underline underline-offset-4">Volver a iniciar sesión</Link></AuthCard>;
  return <ResetPasswordForm />;
}
