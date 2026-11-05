-- Authenticate existing schedulers without altering job/credit/retry logic.
-- Set app_config.worker_secret and Edge WORKER_SHARED_SECRET to the same
-- independently generated secret before deploying the hardened workers.
do $migration$
declare
  v_function regprocedure;
  v_definition text;
  v_updated text;
begin
  foreach v_function in array array['public.process_generation_jobs(integer)'::regprocedure, 'public.process_jobs(integer)'::regprocedure]
  loop
    v_definition := pg_get_functiondef(v_function);
    v_updated := replace(v_definition,
      '''Authorization'', ''Bearer '' || v_anon',
      '''Authorization'', ''Bearer '' || v_anon, ''X-Worker-Secret'', coalesce((select value from public.app_config where key = ''worker_secret''), '''')');
    if v_updated = v_definition then raise exception 'worker_scheduler_header_not_found: %', v_function; end if;
    execute v_updated;
  end loop;
end;
$migration$;
