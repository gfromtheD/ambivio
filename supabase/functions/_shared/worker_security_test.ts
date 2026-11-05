// No network permissions: requests are authorized before any privileged fetch.
import { authorizeWorker } from "./worker_security.ts";
const env = { apiUrl: "https://project.supabase.co", serviceKey: "private-service-key", workerSecret: "private-worker-secret" };
function assert(value: unknown) { if (!value) throw new Error("Assertion failed"); }
Deno.test("rejects absent, public, user and forged-role credentials", async () => {
  for (const token of ["", "public-anon-key", "user-session", 'eyJyb2xlIjoic2VydmljZV9yb2xlIn0']) {
    const result = await authorizeWorker(new Request("https://worker.test", { headers: { authorization: `Bearer ${token}` } }), env);
    assert(!result.ok && result.status === 401);
  }
});
Deno.test("accepts internal service credentials", async () => {
  const result = await authorizeWorker(new Request("https://worker.test", { headers: { authorization: `Bearer ${env.serviceKey}` } }), env);
  assert(result.ok && result.apiUrl === env.apiUrl);
});
Deno.test("scheduler secret cannot control the privileged destination", async () => {
  const request = new Request("https://worker.test", { method: "POST", headers: { "x-worker-secret": env.workerSecret }, body: JSON.stringify({ api_url: "https://attacker.test" }) });
  const result = await authorizeWorker(request, env);
  assert(result.ok && result.apiUrl === env.apiUrl && result.apikey === env.serviceKey);
});
Deno.test("fails closed when secrets or server URL are invalid", async () => {
  for (const config of [{...env, serviceKey: ""}, {...env, apiUrl: ""}, {...env, apiUrl: "file:///secrets"}, {...env, apiUrl: "https://user:secret@example.com"}]) {
    const result = await authorizeWorker(new Request("https://worker.test"), config);
    assert(!result.ok && result.status === 503);
  }
});
Deno.test("empty worker-secret configuration never authorizes an anonymous request", async () => {
  const result = await authorizeWorker(new Request("https://worker.test"), {...env, workerSecret: ""});
  assert(!result.ok && result.status === 401);
});
