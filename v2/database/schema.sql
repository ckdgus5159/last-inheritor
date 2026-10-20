-- 신규 V2 설치용. 이미 설치된 환경에 재실행하지 않는다.
-- 비밀키 해시와 초기 JSON을 안전한 배포 도구로 치환한다. V1 객체는 수정하지 않는다.
create schema field_ops_v2;
revoke all on schema field_ops_v2 from public,anon,authenticated;
create table field_ops_v2.states(mode text primary key check(mode in ('live','rehearsal')),version bigint not null default 1,data jsonb not null,updated_at timestamptz not null default now());
create table field_ops_v2.settings(id integer primary key check(id=1),secret_hash text not null);
create table field_ops_v2.limits(bucket text primary key,window_id bigint not null,hits integer not null);
create table field_ops_v2.qr_claims(mode text not null,epoch text not null,qr_id text not null,team text not null check(team in ('A','B','C','D')),slot integer not null check(slot between 1 and 4),token_hash text not null,primary key(mode,epoch,qr_id),unique(mode,epoch,team,slot),unique(mode,epoch,token_hash));
create table field_ops_v2.bonus_claims(mode text not null,epoch text not null,team text not null check(team in ('A','B','C','D')),round integer not null check(round between 1 and 6),primary key(mode,epoch,team,round));
alter table field_ops_v2.states enable row level security;
alter table field_ops_v2.settings enable row level security;
alter table field_ops_v2.limits enable row level security;
alter table field_ops_v2.qr_claims enable row level security;
alter table field_ops_v2.bonus_claims enable row level security;
revoke all on all tables in schema field_ops_v2 from public,anon,authenticated;
create policy deny_direct_access on field_ops_v2.states for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on field_ops_v2.settings for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on field_ops_v2.limits for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on field_ops_v2.qr_claims for all to anon,authenticated using(false) with check(false);
create policy deny_direct_access on field_ops_v2.bonus_claims for all to anon,authenticated using(false) with check(false);
insert into field_ops_v2.settings values(1,'__DB_SECRET_HASH__');
insert into field_ops_v2.states(mode,data) values('live','__LIVE_STATE__'::jsonb),('rehearsal','__REHEARSAL_STATE__'::jsonb);
create function field_ops_v2.gateway(p_secret text,p_mode text,p_action text,p_payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; v bigint; n integer; wid bigint:=floor(extract(epoch from clock_timestamp())/300); item jsonb; teamid text; epochid text; slotid integer;
begin
 if p_secret is null or length(p_secret)<40 or not exists(select 1 from field_ops_v2.settings where secret_hash=encode(sha256(convert_to(p_secret,'UTF8')),'hex')) then raise insufficient_privilege; end if;
 if p_mode not in ('live','rehearsal') then raise invalid_parameter_value; end if;
 if p_action='read' then select jsonb_build_object('version',version,'data',data) into result from field_ops_v2.states where mode=p_mode;
 elsif p_action='write' then
  if jsonb_typeof(p_payload->'data')<>'object' then raise invalid_parameter_value; end if;
  update field_ops_v2.states set data=p_payload->'data',version=version+1,updated_at=now() where mode=p_mode and version=(p_payload->>'version')::bigint returning version into v;
  if v is null then return jsonb_build_object('saved',false); end if;
  epochid:=p_payload->'data'->>'epoch';
  for teamid in select jsonb_object_keys(p_payload->'data'->'teams') loop
   select count(*) into slotid from field_ops_v2.qr_claims where mode=p_mode and epoch=epochid and team=teamid;
   for item in select value from jsonb_array_elements(p_payload->'data'->'qr') where value->'claim'->>'team'=teamid loop
    if not exists(select 1 from field_ops_v2.qr_claims where mode=p_mode and epoch=epochid and qr_id=item->>'id') then
     slotid:=slotid+1;
     insert into field_ops_v2.qr_claims values(p_mode,epochid,item->>'id',teamid,slotid,encode(sha256(convert_to(item->>'token','UTF8')),'hex'));
    end if;
   end loop;
   for item in select jsonb_build_object('round',key) from jsonb_each(p_payload->'data'->'teams'->teamid->'bonuses') loop
    insert into field_ops_v2.bonus_claims values(p_mode,epochid,teamid,(item->>'round')::integer) on conflict do nothing;
   end loop;
  end loop;
  result:=jsonb_build_object('saved',true,'version',v);
 elsif p_action='limit' then
  if length(p_payload->>'bucket')<>64 then raise invalid_parameter_value; end if;
  insert into field_ops_v2.limits values(p_payload->>'bucket',wid,1) on conflict(bucket) do update set window_id=wid,hits=case when field_ops_v2.limits.window_id=wid then field_ops_v2.limits.hits+1 else 1 end returning hits into n;
  delete from field_ops_v2.limits where window_id<wid-12;
  result:=jsonb_build_object('allowed',n<=least(greatest((p_payload->>'maximum')::integer,1),300));
 else raise invalid_parameter_value; end if;
 return result;
end;$$;
revoke all on function field_ops_v2.gateway(text,text,text,jsonb) from public,anon,authenticated;
grant usage on schema field_ops_v2 to anon;
grant execute on function field_ops_v2.gateway(text,text,text,jsonb) to anon;
create function public.fieldops_v2_gateway(p_secret text,p_mode text,p_action text,p_payload jsonb default '{}'::jsonb) returns jsonb language sql security invoker set search_path='' as $$ select field_ops_v2.gateway(p_secret,p_mode,p_action,p_payload); $$;
revoke all on function public.fieldops_v2_gateway(text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.fieldops_v2_gateway(text,text,text,jsonb) to anon;
notify pgrst,'reload schema';
