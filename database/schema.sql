create schema if not exists app_private;
revoke all on schema app_private from public;
create table app_private.game_state(id integer primary key check(id=1), version bigint not null default 1, data jsonb not null, updated_at timestamptz not null default now());
create table app_private.gateway_settings(id integer primary key check(id=1), secret_hash text not null);
create table app_private.request_limits(bucket text primary key, window_id bigint not null, hits integer not null);
alter table app_private.game_state enable row level security;
alter table app_private.gateway_settings enable row level security;
alter table app_private.request_limits enable row level security;
create policy deny_direct_access on app_private.game_state for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on app_private.gateway_settings for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on app_private.request_limits for all to anon,authenticated using(false) with check(false);
revoke all on all tables in schema app_private from public, anon, authenticated;
insert into app_private.gateway_settings(id,secret_hash) values(1,'__SECRET_HASH__');
insert into app_private.game_state(id,data) values(1,'__INITIAL_STATE__'::jsonb);

-- Privileged code stays in an unexposed schema. All requests need the separate,
-- server-only 256-bit gateway secret; a Supabase publishable key is insufficient.
create function app_private.gateway(p_secret text,p_action text,p_payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; n integer; wid bigint := floor(extract(epoch from clock_timestamp())/300); v bigint;
begin
 if p_secret is null or length(p_secret)<40 or not exists(select 1 from app_private.gateway_settings where id=1 and secret_hash=encode(sha256(convert_to(p_secret,'UTF8')),'hex')) then
  raise insufficient_privilege using message='Gateway authentication required';
 end if;
 if p_action='read' then
  select jsonb_build_object('version',version,'data',data) into result from app_private.game_state where id=1;
 elsif p_action='write' then
  if jsonb_typeof(p_payload->'data')<>'object' then raise invalid_parameter_value; end if;
  update app_private.game_state set data=p_payload->'data',version=version+1,updated_at=now() where id=1 and version=(p_payload->>'version')::bigint returning version into v;
  result=jsonb_build_object('saved',v is not null,'version',v);
 elsif p_action='limit' then
  if length(p_payload->>'bucket')<>64 then raise invalid_parameter_value; end if;
  insert into app_private.request_limits(bucket,window_id,hits) values(p_payload->>'bucket',wid,1)
   on conflict(bucket) do update set window_id=wid,hits=case when app_private.request_limits.window_id=wid then app_private.request_limits.hits+1 else 1 end returning hits into n;
  delete from app_private.request_limits where window_id<wid-288;
  result=jsonb_build_object('allowed',n<=least(greatest((p_payload->>'maximum')::integer,1),100));
 else raise invalid_parameter_value using message='Unsupported operation';
 end if;
 return result;
end;$$;
revoke all on function app_private.gateway(text,text,jsonb) from public,anon,authenticated;
grant usage on schema app_private to anon;
grant execute on function app_private.gateway(text,text,jsonb) to anon;
create function public.game_gateway(p_secret text,p_action text,p_payload jsonb default '{}'::jsonb)
returns jsonb language sql security invoker set search_path='' as $$select app_private.gateway(p_secret,p_action,p_payload);$$;
revoke all on function public.game_gateway(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.game_gateway(text,text,jsonb) to anon;
notify pgrst,'reload schema';
