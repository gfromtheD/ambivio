-- Deletion must go through the existing resumable room cleanup contract.
-- This does not alter credit calculations or payment behavior.
revoke delete on public.properties, public.rooms from authenticated;

create or replace function public.delete_property(p_property_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth, storage
as $$
declare
  v_org uuid;
begin
  v_org := public.current_org_id();
  if v_org is null then raise exception 'not_authenticated'; end if;
  perform 1 from public.properties where id = p_property_id and organization_id = v_org for update;
  if not found then raise exception 'property_not_found'; end if;
  if exists(select 1 from public.rooms where property_id = p_property_id) then
    raise exception 'property_cleanup_required';
  end if;
  if exists(select 1 from storage.objects where bucket_id in ('original-images','staged-images')
    and (storage.foldername(name))[1] = v_org::text
    and (storage.foldername(name))[2] = p_property_id::text) then
    raise exception 'storage_cleanup_incomplete';
  end if;
  delete from public.properties where id = p_property_id and organization_id = v_org;
  return true;
end;
$$;
revoke all on function public.delete_property(uuid) from public, anon;
grant execute on function public.delete_property(uuid) to authenticated, service_role;
