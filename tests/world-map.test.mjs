import test from 'node:test';
import assert from 'node:assert/strict';
import {MAP_REGIONS,exploredRegions,createExplorationMemory,renderWorldMap,REVEAL_DURATION} from '../public/world-map.js';
import {initialState,transition,projectState} from '../lib/game.mjs';
const admin={role:'admin',sid:'command'},leader={role:'leader',team:'A',sid:'captain'};
const actor=team=>({role:'observer',team,sid:'observer-'+team});
function started(){return transition(transition(initialState(),leader,'claim'),admin,'start');}

test('only approved records clear fog; leader reports and other squads cannot reveal a region early',()=>{
 let state=started();
 assert.deepEqual(exploredRegions(projectState(state,actor('A'))),[]);
 state=transition(state,leader,'submit',{mission:'cart'});
 assert.deepEqual(exploredRegions(projectState(state,actor('A'))),[]);
 assert.deepEqual(exploredRegions(projectState(state,admin)),[]);
 state=transition(state,admin,'approve',{team:'A',mission:'cart',score:10});
 assert.deepEqual(exploredRegions(projectState(state,actor('A'))),['cart']);
 assert.deepEqual(exploredRegions(projectState(state,actor('B'))),[]);
 assert.deepEqual(exploredRegions(projectState(state,leader)),['cart']);
 assert.deepEqual(exploredRegions(projectState(state,admin)),['cart']);
});

test('all 64 record combinations reveal their own regions independent of collection order',()=>{
 for(let bits=0;bits<64;bits++){
  const state=initialState(),expected=[];
  for(const [index,region] of MAP_REGIONS.entries())if(bits&(1<<index)){state.teams.A.missions[region.id]={status:'approved',score:10};expected.push(region.id);}
  const projected=projectState(state,actor('A'));
  projected.missions.reverse();assert.deepEqual(exploredRegions(projected),expected);
  const html=renderWorldMap(projected);assert.equal((html.match(/data-region=/g)||[]).length,expected.length);
  assert.ok(html.includes(`data-restored="${expected.length}"`));
  assert.equal(projected.finaleReveal,null,'Restoring the terrain must not disclose the final explanation');
  assert.deepEqual(projected.operations,[]);
 }
});

test('discovery animation survives unchanged polls but never leaks across teams, rehearsal, reload, or reset',()=>{
 const memory=createExplorationMemory();let data=projectState(started(),actor('A'));
 memory.update(data,100);assert.equal(memory.events.size,0);
 data.missions[0].record={title:'record'};memory.update(data,200);assert.equal(memory.events.get('cart'),200);
 memory.update(data,800);assert.equal(memory.events.get('cart'),200);
 memory.update({...data,team:'B'},900);assert.equal(memory.events.size,0);
 memory.update({...data,rehearsal:true},1000);assert.equal(memory.events.size,0);
 memory.update(data,1100);assert.equal(memory.events.size,0);
 data.missions[0].record=null;memory.update(data,1200);assert.equal(memory.events.size,0);
 data.missions[0].record={title:'record'};memory.update(data,1300);assert.equal(memory.events.get('cart'),1300);
 memory.update(data,1300+REVEAL_DURATION);assert.equal(memory.events.size,0);
 memory.reset();memory.update(data,1400+REVEAL_DURATION);assert.equal(memory.events.size,0);
});


test('records reveal clues before landscapes and a future route only after all six records',()=>{
 const state=initialState();
 const stages=['sealed','glimpses','glimpses','connected','connected','landscape','landscape'];
 for(let count=0;count<=6;count++){
  if(count)state.teams.A.missions[MAP_REGIONS[count-1].id]={status:'approved',score:10};
  const html=renderWorldMap(projectState(state,actor('A')));
  assert.ok(html.includes(`data-discovery-stage="${stages[count]}"`));
  assert.equal(html.includes('map-connection'),count>=3);
  assert.equal(html.includes('map-extent'),count>=5);
  assert.equal(html.includes('world-expedition'),count===6);
  assert.ok(!html.includes('탐사 완료')&&!html.includes('모든 경로 확보'));
  if(count===0)assert.ok(html.includes('생존 불가 지역으로 보고됨'));
  if(count===6)assert.ok(html.includes('현장 미확인')&&html.includes('아직 가보지 않은 땅'));
 }
});

test('milestones expand earlier clues while preserving their original discovery timestamps',()=>{
 const memory=createExplorationMemory();const state=initialState();
 const update=at=>memory.update(projectState(state,actor('A')),at);
 update(0);
 state.teams.A.missions.cart={status:'approved',score:10};update(100);
 state.teams.A.missions.beast={status:'approved',score:10};update(200);
 state.teams.A.missions.female={status:'approved',score:10};update(300);
 assert.equal(memory.events.get('cart'),100);
 assert.equal(memory.expansions.get('cart'),300);
 assert.equal(memory.expansions.get('beast'),300);
 update(350);assert.equal(memory.expansions.get('cart'),300);
 state.teams.A.missions.jaw={status:'approved',score:10};update(400);
 assert.equal(memory.expansions.get('cart'),300);
 state.teams.A.missions.armor={status:'approved',score:10};update(500);
 assert.equal(memory.expansions.get('cart'),500);
});
