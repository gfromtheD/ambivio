import { authorizeWorker } from "../_shared/worker_security.ts";
// process-job Edge Function — Phase 0 validation worker.
// Receives an enqueue from process_jobs() via pg_net:
//   { job_id, api_url }
// Claims the job atomically, runs the MockAdapter, stores result or error.
// No env vars required: API URL comes in the body, auth is passed through
// from the Authorization header (anon JWT).

import { MockAdapter } from "../_shared/mock_adapter.ts";

const mock = new MockAdapter();

type RpcArgs = Record<string, unknown>;

async function callRpc(apiUrl: string, auth: string, fn: string, args: RpcArgs): Promise<unknown> {
  const res = await fetch(`${apiUrl}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: auth.replace(/^Bearer\s+/i, ""),
      Authorization: auth,
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${fn} failed: ${res.status} ${text.slice(0, 300)}`);
  }
  if (res.status === 204) return null;
  return await res.json();
}

function asRow(payload: unknown): Record<string, unknown> | null {
  if (Array.isArray(payload)) return payload.length > 0 ? (payload[0] as Record<string, unknown>) : null;
  if (payload && typeof payload === "object") return payload as Record<string, unknown>;
  return null;
}

function respond(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return respond({ error: "method_not_allowed" }, 405);
  const access = await authorizeWorker(req, {
    apiUrl: Deno.env.get("SUPABASE_URL") ?? "",
    serviceKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    workerSecret: Deno.env.get("WORKER_SHARED_SECRET"),
  });
  if (!access.ok) return respond({ error: access.error }, access.status);
  const { apiUrl, auth, apikey } = access;


  let body: { job_id?: string; api_url?: string } = {};
  try {
    body = await req.json();
  } catch {
    return respond({ error: "invalid_json" }, 400);
  }

  const jobId = body.job_id;
  if (typeof jobId !== "string" || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(jobId)) return respond({ error: "invalid_job_id" }, 400);
  void apikey;

  // 1. Atomic claim: only one worker can transition pending -> processing.
  let claimed: Record<string, unknown> | null;
  try {
    claimed = asRow(await callRpc(apiUrl, auth, "claim_job", {
      p_job_id: jobId,
      p_worker: "edge-function-1",
    }));
  } catch {
    return respond({ job_id: jobId, ok: false, step: "claim", error: "claim_failed" }, 500);
  }

  if (!claimed) {
    return respond({
      job_id: jobId,
      ok: false,
      claimed: false,
      note: "not claimed (already being processed by another worker)",
    });
  }

  // 2. Provider execution (MockAdapter in this phase).
  try {
    const payload = (claimed.payload as Record<string, unknown>) ?? {};
    const result = await mock.generate(payload, { attempt: claimed.attempt_count as number });
    await callRpc(apiUrl, auth, "complete_job", { p_job_id: jobId, p_result: result });
    return respond({ job_id: jobId, ok: true, claimed: true, result });
  } catch (err) {
    const e = err as Error & { code?: string };
    try {
      await callRpc(apiUrl, auth, "fail_job", {
        p_job_id: jobId,
        p_error_code: e.code ?? "mock_error",
        p_error_message: e.message ?? String(err),
      });
    } catch {
      // Failure recording failed; nothing else to do.
    }
    return respond({ job_id: jobId, ok: false, step: "generate", error: "generation_failed" }, 500);
  }
});
