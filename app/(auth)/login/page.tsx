import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <LoginForm initialError={params.error === "auth_callback_failed" ? "El enlace no es válido o ha caducado. Inicia sesión o solicita un enlace nuevo." : null} />;
}