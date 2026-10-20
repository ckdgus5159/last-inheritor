import test from 'node:test';import assert from 'node:assert/strict';
import {initialState,transition,assigned,TEAM_IDS,projectState} from '../lib/game.mjs';
const admin={role:'admin',sid:'admin'};const actor=id=>({role:'leader',team:id,sid:'captain-'+id});
const ready=()=>TEAM_IDS.reduce((s,id)=>transition(s,actor(id),'claim'),initialState());
test('rotation: each squad visits all six stations; no collisions in any round',()=>{for(const id of TEAM_IDS)assert.equal(new Set(Array.from({length:6},(_,i)=>assigned(id,i+1).id)).size,6);for(let round=1;round<=6;round++)assert.equal(new Set(TEAM_IDS.map(id=>assigned(id,round).id)).size,4);});
test('leader identity and administrator commands are enforced on the server',()=>{let s=ready();assert.throws(()=>transition(s,actor('A'),'start'),/본부/);assert.throws(()=>transition(s,actor('A'),'claim'),/이미/);s=transition(s,admin,'start');assert.throws(()=>transition(s,{...actor('A'),sid:'forged'},'submit',{mission:'cart'}),/지정/);assert.throws(()=>transition(s,{...actor('A'),role:'observer'},'submit',{mission:'cart'}),/분대장/);assert.throws(()=>transition(s,actor('A'),'submit',{mission:'armor'}),/아직/);s=transition(s,admin,'release',{team:'A'});assert.throws(()=>transition(s,actor('A'),'submit',{mission:'cart'}),/분대장/);});
test('full four-squad story: approval, all missions, puzzle, two endings and epilogue',()=>{let s=transition(ready(),admin,'start');for(let round=1;round<=6;round++){for(const id of TEAM_IDS){const m=assigned(id,round);s=transition(s,actor(id),'submit',{mission:m.id});if(m.approval){assert.equal(s.teams[id].missions[m.id].status,'pending');assert.equal(projectState(s,actor(id)).missions.find(x=>x.id===m.id).record,null);s=transition(s,admin,'approve',{team:id,mission:m.id,score:10});}assert.throws(()=>transition(s,actor(id),'submit',{mission:m.id}),/이미/);}if(round<6)s=transition(s,admin,'next');}assert.equal(projectState(s,admin).teams[0].score,60);s=transition(s,admin,'finale');assert.throws(()=>transition(s,actor('A'),'ending',{operation:'inherit'}),/암호/);assert.throws(()=>transition(s,actor('A'),'puzzle',{origin:'벽 밖',purpose:'인류 보호',destination:'푸른 계곡'}),/다시/);for(const [i,id]of TEAM_IDS.entries()){s=transition(s,actor(id),'puzzle',{origin:'방벽 내부',purpose:'인류 보호',destination:'푸른 계곡'});s=transition(s,actor(id),'ending',{operation:['inherit','liberate','inherit','liberate'][i]});assert.throws(()=>transition(s,actor(id),'ending',{operation:'liberate'}),/이미/);}s=transition(s,admin,'epilogue');assert.ok(projectState(s,actor('B')).epilogue);assert.equal(projectState(s,actor('B')).teams[0].ending,'inherit');});
test('shared defense pauses regular missions and requires all reports and approvals',()=>{let s=transition(ready(),admin,'start',{},1000);const original=s.deadline;s=transition(s,admin,'emergency',{},2000);assert.throws(()=>transition(s,actor('A'),'submit',{mission:'cart'},3000),/공동 방어/);assert.throws(()=>transition(s,admin,'defense-approve',{team:'A'},3000),/보고/);for(const id of TEAM_IDS){s=transition(s,actor(id),'defense-submit',{},3000);s=transition(s,admin,'defense-approve',{team:id},4000);}assert.equal(s.emergency.result,'success');assert.equal(s.deadline,original+2000);});
test('expired defense falls back, pause preserves time, clues remain private',()=>{let s=transition(ready(),admin,'start',{},1000);s=transition(s,admin,'pause',{},2000);s=transition(s,admin,'resume',{},5000);assert.equal(s.deadline,424000);s=transition(s,admin,'emergency',{},6000);assert.throws(()=>transition(s,actor('A'),'defense-submit',{},500000),/제한시간/);s=transition(s,admin,'emergency-end',{},500000);assert.equal(s.emergency.result,'fallback');const view=projectState(s,actor('A'));assert.equal(view.audit,undefined);assert.equal(view.missions[0].record,null);assert.deepEqual(view.operations,[]);assert.equal(view.teams[1].missions,undefined);assert.equal(view.teams[0].leader,undefined);});
test('pausing during defense does not count the pause twice in the regular timer',()=>{let s=transition(ready(),admin,'start',{},1000);const original=s.deadline;s=transition(s,admin,'emergency',{},2000);s=transition(s,admin,'pause',{},3000);s=transition(s,admin,'resume',{},5000);s=transition(s,admin,'emergency-end',{},6000);assert.equal(s.deadline,original+4000);});

test('7-minute rounds, wall-origin evidence and two endings',()=>{let s=transition(ready(),admin,'start',{},1000);assert.equal(s.deadline,421000);s=transition(s,admin,'next',{},2000);assert.equal(s.deadline,422000);assert.equal(projectState(s,actor('A')).missions.find(m=>m.id==='jaw').record,null);const data=projectState(s,admin);assert.match(data.missions.find(m=>m.id==='jaw').record.text,/방어 병기/);assert.match(data.missions.find(m=>m.id==='warhammer').record.text,/푸른 계곡/);assert.equal(data.defenseTasks.C.title,'젠가 쌓기 · 방벽 복구');assert.match(data.defenseTasks.A.rule,/5회/);assert.equal(data.operations.length,2);});

test('origin puzzle is grounded in clues and the reveal is gated until solved',()=>{
 let s=transition(ready(),admin,'start');
 for(let round=1;round<=6;round++){
  for(const id of TEAM_IDS){const m=assigned(id,round);s=transition(s,actor(id),'submit',{mission:m.id});if(m.approval)s=transition(s,admin,'approve',{team:id,mission:m.id,score:10});}
  if(round<6)s=transition(s,admin,'next');
 }
 s=transition(s,admin,'finale');
 const locked=projectState(s,actor('A'));
 assert.equal(locked.finaleReveal,null);
 assert.equal(locked.operations.length,0);
 assert.throws(()=>transition(s,actor('A'),'puzzle',{origin:'방벽 밖',purpose:'인류 보호',destination:'푸른 계곡'}),/다시/);
 assert.throws(()=>transition(s,actor('A'),'puzzle',{origin:'방벽 안',purpose:'인류 보호',destination:'죽음의 땅'}),/다시/);
 s=transition(s,actor('A'),'puzzle',{origin:'벽 안',purpose:'주민 보호',destination:'푸른 계곡'});
 const unlocked=projectState(s,actor('A'));
 assert.match(unlocked.finaleReveal,/방벽 안/);
 assert.equal(unlocked.operations.length,2);
 assert.deepEqual(unlocked.operations.map(o=>o.id),['inherit','liberate']);
 assert.equal(projectState(s,actor('B')).finaleReveal,null);
 assert.throws(()=>transition(s,actor('A'),'ending',{operation:'advance'}),/작전을 선택/);
});
