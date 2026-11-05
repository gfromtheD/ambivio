export type WorkerEnvironment = {
  apiUrl: string;
  serviceKey: string;
  workerSecret?: string;
};

async function sameSecret(actual: string, expected: string): Promise<boolean> {
  if (!actual || !expected) return false;
  const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  const [left, right] = await Promise.all([digest(actual), digest(expected)]);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

/** Only a configured internal credential may use the privileged worker client. */
export async function authorizeWorker(request: Request, env: WorkerEnvironment): Promise<
  { ok: true; apiUrl: string; auth: string; apikey: string } |
  { ok: false; status: number; error: string }
> {
  if (!env.serviceKey || !env.apiUrl) return { ok: false, status: 503, error: "worker_not_configured" };
  let url: URL;
  try { url = new URL(env.apiUrl); } catch { return { ok: false, status: 503, error: "worker_not_configured" }; }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    return { ok: false, status: 503, error: "worker_not_configured" };
  }
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const internalSecret = request.headers.get("x-worker-secret") ?? "";
  if (!await sameSecret(bearer, env.serviceKey) && !await sameSecret(internalSecret, env.workerSecret ?? "")) {
    return { ok: false, status: 401, error: "unauthorized_worker" };
  }
  return { ok: true, apiUrl: url.origin, auth: `Bearer ${env.serviceKey}`, apikey: env.serviceKey };
}
