export function safeAuthNext(value: string | null): "/properties" | "/settings" | "/reset-password" {
  return value === "/settings" || value === "/reset-password" ? value : "/properties";
}

export function authRedirectOrigin(siteUrl: string | undefined, requestOrigin: string, development: boolean): string {
  if (development) {
    const requested = new URL(requestOrigin);
    if (["localhost", "127.0.0.1", "[::1]"].includes(requested.hostname) && ["http:", "https:"].includes(requested.protocol)) return requested.origin;
  }
  if (!siteUrl) throw new Error("auth_site_url_not_configured");
  const site = new URL(siteUrl);
  if (site.username || site.password || site.search || site.hash || site.pathname !== "/" || (site.protocol !== "https:" && !(site.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(site.hostname)))) throw new Error("auth_site_url_invalid");
  return site.origin;
}

export function passwordValidationError(password: string, confirmation?: string): string | null {
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (new TextEncoder().encode(password).length > 72) return "La contraseña es demasiado larga. Utiliza una más corta.";
  if (confirmation !== undefined && password !== confirmation) return "Las contraseñas no coinciden.";
  return null;
}
