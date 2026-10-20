import {MAP_REGIONS,renderWorldMap,createExplorationMemory,animateMapReveals} from './world-map.js';
const found=new Set(),memory=createExplorationMemory(),root=document.querySelector('#map');let run=0;
const snapshot=()=>({role:'observer',team:'A',rehearsal:true,teams:[],missions:MAP_REGIONS.map(r=>({id:r.id,record:found.has(r.id)?{title:'조사 기록'}:null}))});
function render(){const state=snapshot();memory.update(state);root.innerHTML=renderWorldMap(state,{instance:'preview',events:memory.events,expansions:memory.expansions});animateMapReveals(root);document.querySelector('#region-controls').innerHTML=MAP_REGIONS.map(r=>`<button data-region="${r.id}" aria-pressed="${found.has(r.id)}" class="${found.has(r.id)?'primary':'ghost'}"><span>${r.titan} 거인</span><small>${found.has(r.id)?'기록 확보':'미확보'}</small></button>`).join('');document.querySelector('#preview-status').textContent=found.size===6?'지도 기록 6/6 · 지도는 되찾았다. 원정은 이제 시작이다.':`지도 기록 ${found.size}/6 · 원하는 순서로 거인을 선택하세요.`;}
document.querySelector('#region-controls').addEventListener('click',e=>{const button=e.target.closest('[data-region]');if(!button)return;run++;const id=button.dataset.region;found.has(id)?found.delete(id):found.add(id);render();});
document.querySelector('#reset').addEventListener('click',()=>{run++;found.clear();render();});
document.querySelector('#explore').addEventListener('click',async()=>{const current=++run;found.clear();render();for(const r of MAP_REGIONS){await new Promise(resolve=>setTimeout(resolve,2100));if(run!==current)return;found.add(r.id);render();}});
render();
