-- Internal scheduler settings must never be exposed through the public API.
-- Schedulers run as SECURITY DEFINER; service_role retains its existing access.
revoke all on public.app_config from public, anon, authenticated;
