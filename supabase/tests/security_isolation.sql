-- Run only against an isolated disposable database. Everything rolls back.
begin;
create temp table security_fixture as
select gen_random_uuid() a, gen_random_uuid() b, gen_random_uuid() pa, gen_random_uuid() pb, gen_random_uuid() ra, gen_random_uuid() rb;
grant select on security_fixture to authenticated;
insert into auth.users(id, email, raw_user_meta_data, created_at, updated_at)
select a, 'security-a@example.invalid', '{}'::jsonb, now(), now() from security_fixture
union all select b, 'security-b@example.invalid', '{}'::jsonb, now(), now() from security_fixture;
insert into public.properties(id, organization_id, title)
select pa, (select organization_id from public.users where id=a), 'Security A' from security_fixture
union all select pb, (select organization_id from public.users where id=b), 'Security B' from security_fixture;
insert into public.rooms(id,organization_id,property_id,room_type)
select ra,(select organization_id from public.users where id=a),pa,'salón' from security_fixture
union all select rb,(select organization_id from public.users where id=b),pb,'salón' from security_fixture;
select set_config('request.jwt.claim.sub', (select a::text from security_fixture), true);
set local role authenticated;
do $$
declare n int; foreign_org uuid; blocked boolean;
begin
  select count(*) into n from public.properties;
  if n <> 1 then raise exception 'FAIL: tenant property reads'; end if;
  select count(*) into n from public.rooms;
  if n <> 1 then raise exception 'FAIL: tenant room reads'; end if;
  update public.properties set title='Intrusion' where id=(select pb from security_fixture);
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FAIL: cross-tenant update'; end if;
  blocked := false;
  begin update public.users set role='owner', organization_id=gen_random_uuid() where id=auth.uid();
  exception when insufficient_privilege then blocked := true; end;
  if not blocked then raise exception 'FAIL: privilege escalation'; end if;
  blocked := false;
  begin delete from public.properties where id=(select pa from security_fixture);
  exception when insufficient_privilege then blocked := true; end;
  if not blocked then raise exception 'FAIL: direct deletion bypass'; end if;
  blocked := false;
  begin perform public.update_room((select rb from security_fixture),'salón','Intrusion');
  exception when others then if sqlerrm in ('room_not_found','room_not_found_or_deleting') then blocked := true; else raise; end if; end;
  if not blocked then raise exception 'FAIL: cross-tenant RPC'; end if;
  blocked := false;
  begin perform public.delete_property((select pa from security_fixture));
  exception when others then if sqlerrm='property_cleanup_required' then blocked := true; else raise; end if; end;
  if not blocked then raise exception 'FAIL: orphaning property deletion'; end if;
  if has_function_privilege('authenticated','public.claim_generation(uuid)','EXECUTE') then raise exception 'FAIL: worker privilege'; end if;
  if has_function_privilege('anon','public.claim_generation(uuid)','EXECUTE') then raise exception 'FAIL: anonymous worker privilege'; end if;
  raise notice 'PASS: tenant reads, cross-tenant writes/RPC, role escalation, deletion cleanup, worker grants';
end $$;
reset role;
do $$ begin
 if exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not c.relrowsecurity) then raise exception 'FAIL: RLS disabled on public table'; end if;
 if has_table_privilege('anon','public.app_config','SELECT') or has_table_privilege('authenticated','public.app_config','SELECT') then raise exception 'FAIL: config privileges'; end if;
 if exists(select 1 from storage.buckets where id in ('original-images','staged-images') and public) then raise exception 'FAIL: public image bucket'; end if;
 raise notice 'PASS: RLS enabled, config private, image buckets private';
end $$;
rollback;

