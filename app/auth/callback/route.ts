import { NextResponse } from "next/server";
import { authRedirectOrigin, safeAuthNext } from "@/lib/auth-flow";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeAuthNext(url.searchParams.get("next"));
  const origin = authRedirectOrigin(process.env.NEXT_PUBLIC_SITE_URL, `${url.protocol}//${request.headers.get("host") ?? url.host}`, process.env.NODE_ENV === "development");
  const code = url.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }
  return NextResponse.redirect(new URL(next === "/reset-password" ? "/reset-password?error=expired" : "/login?error=auth_callback_failed", origin));
}
