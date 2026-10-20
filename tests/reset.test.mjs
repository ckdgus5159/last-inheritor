import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,transition,projectState} from '../lib/game.mjs';
import handler,{encodeSession} from '../api/game.js';
const admin={role:'admin',sid:'test-admin'};
const leader={role:'leader',team:'A',sid:'test-leader'};
test('reset clears progress and captain authority in every game phase while preserving the input snapshot',()=>{
 for(const phase of ['briefing','round','finale','epilogue']){
  const s=initialState();s.phase=phase;s.round=6;s.deadline=123;s.pausedAt=120;s.emergency={resolved:true};s.teams.A={leader:leader.sid,missions:{cart:{status:'approved',score:10}},puzzle:true,ending:'inherit'};
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


test('admin-only rehearsal API never reads or writes real game state',async()=>{
 const savedEnv={...process.env};
 const savedFetch=globalThis.fetch;
 Object.assign(process.env,{SESSION_SECRET:'test-rehearsal-signature',DB_GATEWAY_SECRET:'rehearsal-db-secret',SUPABASE_URL:'https://mock.invalid',SUPABASE_PUBLISHABLE_KEY:'test',GAME_CODES_JSON:'{"admin":"private"}'});
 let dbReads=0,dbWrites=0,limits=0;
 globalThis.fetch=async (_url,options)=>{
  const body=JSON.parse(options.body);
  if(body.p_action==='limit'){limits++;return new Response(JSON.stringify({allowed:true}),{status:200});}
  if(body.p_action==='read'){dbReads++;throw new Error('Rehearsal may not read persisted state');}
  if(body.p_action==='write'){dbWrites++;throw new Error('Rehearsal may not write persisted state');}
  throw new Error('Unexpected DB access');
 };
 async function call(actor,stage=7){
  let result;
  const res={setHeader(){},status(code){this.code=code;return this;},json(data){result={code:this.code,data};}};
  const cookie=actor?'inheritor='+encodeSession(actor):undefined;
  await handler({method:'POST',headers:{'content-type':'application/json',host:'localhost',cookie},body:{action:'rehearsal',payload:{stage,team:'A',role:stage===7?'admin':'leader'}}},res);
  return result;
 }
 try{
  const admin={role:'admin',sid:'only-admin'},leader={role:'leader',team:'A',sid:'normal-leader'};
  assert.equal((await call(null)).code,401);
  assert.equal((await call(leader)).code,403);
  const pending=await call(admin,7);
  assert.equal(pending.code,200);
  assert.equal(pending.data.role,'admin');
  assert.equal(pending.data.rehearsal,true);
  assert.equal(pending.data.teams[0].puzzleSubmission.status,'pending');
  const approved=await call(admin,8);
  assert.equal(approved.code,200);
  assert.equal(approved.data.puzzle,true);
  const final=await call(admin,11);
  assert.equal(final.code,200);
  assert.match(final.data.epilogue,/우리의 이야기/);
  assert.equal(dbReads,0);
  assert.equal(dbWrites,0);
  assert.ok(limits>=4);
 }finally{
  globalThis.fetch=savedFetch;
  for(const key of Object.keys(process.env))if(!(key in savedEnv))delete process.env[key];
  Object.assign(process.env,savedEnv);
 }
});
