import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,transition,projectState} from '../lib/game.mjs';
import handler,{encodeSession} from '../api/game.js';
const admin={role:'admin',sid:'test-admin'};
const leader={role:'leader',team:'A',sid:'test-leader'};
test('reset clears progress and captain authority in every game phase while preserving the input snapshot',()=>{
 for(const phase of ['briefing','round','finale','epilogue']){
  const s=initialState();s.phase=phase;s.round=6;s.deadline=123;s.pausedAt=120;s.emergency={resolved:true};s.teams.A={leader:leader.sid,missions:{cart:{status:'approved',score:10}},puzzle:true,ending:'advance'};
  const snapshot=structuredClone(s);
  assert.throws(()=>transition(s,leader,'reset',{confirmation:'초기화'}),/본부/);
  assert.throws(()=>transition(s,admin,'reset'),/확인/);
  const reset=transition(s,admin,'reset',{confirmation:'초기화'});
  assert.deepEqual({...reset,audit:[]},initialState());assert.deepEqual(s,snapshot);
  assert.equal(reset.audit[0].action,'reset');assert.equal(projectState(reset,leader).role,'observer');
  const started=transition(reset,admin,'start');assert.throws(()=>transition(started,leader,'submit',{mission:'cart'}),/분대장/);
  const newLeader={...leader,sid:'new-session'};assert.equal(projectState(transition(reset,newLeader,'claim'),newLeader).role,'leader');
 }
});
test('reset API requires admin, explicit confirmation and the exact backed-up version',async()=>{
 const originalFetch=globalThis.fetch;const originalEnv={...process.env};
 Object.assign(process.env,{SESSION_SECRET:'test-reset-signature',DB_GATEWAY_SECRET:'test-db-secret',SUPABASE_URL:'https://test.invalid',SUPABASE_PUBLISHABLE_KEY:'test-key',GAME_CODES_JSON:'{"admin":"test-admin-code"}'});
 let row={version:7,data:transition(transition(initialState(),leader,'claim'),admin,'start')};let writes=0;
 globalThis.fetch=async(url,options)=>{
  assert.equal(String(url),'https://test.invalid/rest/v1/rpc/game_gateway');const body=JSON.parse(options.body);let result;
  if(body.p_action==='limit')result={allowed:true};
  else if(body.p_action==='read')result=structuredClone(row);
  else if(body.p_action==='write'){writes++;assert.equal(body.p_payload.version,row.version);row={version:row.version+1,data:body.p_payload.data};result={saved:true};}
  else throw Error('Unexpected gateway operation');
  return new Response(JSON.stringify(result),{status:200});
 };
 async function call(actor,action,payload={}){let result;const res={setHeader(){},status(code){this.code=code;return this;},json(data){result={status:this.code,data};}};await handler({method:'POST',headers:{'content-type':'application/json',cookie:actor?'inheritor='+encodeSession(actor):undefined},body:{action,payload}},res);return result;}
 try{
  assert.equal((await call(null,'reset')).status,401);
  for(const actor of [leader,{...leader,role:'observer'}]){assert.equal((await call(actor,'backup')).status,403);assert.equal((await call(actor,'reset',{confirmation:'초기화',expectedVersion:7})).status,403);}
  const backup=await call(admin,'backup');assert.equal(backup.status,200);assert.deepEqual(backup.data.data,row.data);
  assert.equal((await call(admin,'reset',{expectedVersion:7})).status,400);
  assert.equal((await call(admin,'reset',{confirmation:'초기화',expectedVersion:6})).status,409);
  assert.equal(writes,0);
  const done=await call(admin,'reset',{confirmation:'초기화',expectedVersion:backup.data.version});assert.equal(done.status,200);assert.equal(done.data.phase,'briefing');assert.equal(done.data.round,0);assert.ok(done.data.teams.every(t=>t.completed===0&&!t.leaderAssigned));assert.equal(writes,1);
  assert.equal((await call(admin,'reset',{confirmation:'초기화',expectedVersion:7})).status,409);assert.equal(writes,1);
 }finally{globalThis.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);}
});
