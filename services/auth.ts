"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authRedirectOrigin, passwordValidationError } from "@/lib/auth-flow";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error: string | null;
  success: string | null;
};

async function getAuthRedirectOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  return authRedirectOrigin(process.env.NEXT_PUBLIC_SITE_URL, `http://${host}`, process.env.NODE_ENV === "development");
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Introduce email y contraseña.", success: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      error: "Credenciales incorrectas. Revisa email y contraseña.",
      success: null,
    };
  }

  redirect("/properties");
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Introduce email y contraseña.", success: null };
  }
  const passwordError = passwordValidationError(password);
  if (passwordError) return { error: passwordError, success: null };

  const origin = await getAuthRedirectOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/properties`,
    },
  });

  if (error) {
    return { error: "No se pudo completar el registro. Inténtalo de nuevo o inicia sesión si ya tienes cuenta.", success: null };
  }

  if (data.session) {
    redirect("/properties");
  }

  return {
    error: null,
    success: "Cuenta creada. Revisa tu email para confirmar el registro.",
  };
}

export async function resetPasswordAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Introduce tu email.", success: null };
  }

  const origin = await getAuthRedirectOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: "No se pudo enviar el enlace. Espera unos minutos y vuelve a intentarlo.", success: null };
  }

  return {
    error: null,
    success: "Si la cuenta existe, recibirás un email para restablecer la contraseña.",
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updatePasswordAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirm_password") ?? "");
  const errorMessage = passwordValidationError(password, confirmation);
  if (errorMessage) return { error: errorMessage, success: null };
  const supabase = await createClient();
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !user) return { error: "El enlace ha caducado. Solicita uno nuevo para continuar.", success: null };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.code === "same_password" ? "Elige una contraseña diferente a la anterior." : "No se pudo actualizar la contraseña. Solicita un enlace nuevo e inténtalo de nuevo.", success: null };
  return { error: null, success: "Contraseña actualizada. Ya puedes continuar con tu cuenta." };
}
