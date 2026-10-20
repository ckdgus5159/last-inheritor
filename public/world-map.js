// Artwork coordinates: 1536 × 1024. Shared curved boundaries leave no grid seams.
export const CITY_OUTLINE = 'M495 80C495 44 519 25 561 26C605 26 628 48 628 82C813 102 969 231 998 380C1035 379 1069 406 1066 446C1064 481 1044 508 1001 511C983 668 825 793 636 824C637 868 606 896 564 896C523 896 490 868 490 826C305 804 158 677 135 511C93 510 65 488 65 448C65 410 92 384 136 383C166 224 311 102 495 80Z';
export const MAP_REGIONS = [
 {id:'cart',spot:[430,943,82,48],corridor:"M560 450C580 650 560 800 550 890S480 930 430 943",width:210,discovery:"끊어진 옛길 사이로 새싹이 돋아 있다.",titan:'차력',name:'남부 보급로',path:'M560 450C590 650 760 700 740 850C730 970 840 1030 870 1104L-80 1104L-80 850C40 825 20 675 140 680C300 690 380 535 560 450Z'},
 {id:'beast',spot:[1250,100,100,60],corridor:"M560 450C780 290 990 80 1250 100",width:220,discovery:"마른 땅이라던 고지대에서 물이 흘러내린다.",titan:'짐승',name:'북동부 고지대',path:'M560 450C650 230 715 220 740 80C760 15 795-10 810-80L1616-80L1616 120C1520 100 1400 222 1280 205C1040 180 850 425 560 450Z'},
 {id:'female',spot:[170,105,95,65],corridor:"M560 450C410 260 300 160 170 105",width:190,discovery:"검게 표시된 숲 한가운데, 햇빛이 내려앉는다.",titan:'여성형',name:'북서부 숲길',path:'M560 450C450 270 260 250 160 160C70 90 0 140-80 80L-80-80L810-80C795-10 760 15 740 80C715 220 650 230 560 450Z'},
 {id:'jaw',spot:[1400,470,90,75],corridor:"M560 450C800 420 1120 350 1400 470",width:235,discovery:"죽은 강이라던 물길이 맑게 흐르고 있다.",titan:'턱',name:'동부 강 유역',path:'M560 450C850 425 1040 180 1280 205C1400 222 1520 100 1616 120L1616 730C1460 760 1360 550 1200 580C1010 630 820 510 560 450Z'},
 {id:'armor',spot:[60,660,70,90],corridor:"M560 450C340 510 170 550 60 660",width:200,discovery:"버려진 석벽 틈에서 꽃이 피어났다.",titan:'갑옷',name:'서부 방벽 외곽',path:'M560 450C380 535 300 690 140 680C20 675 40 825-80 850L-80 80C0 140 70 90 160 160C260 250 450 270 560 450Z'},
 {id:'warhammer',spot:[1210,840,115,75],corridor:"M560 450C770 620 1010 770 1210 840",width:250,discovery:"오래된 과수원에 아직 열매가 맺혀 있다.",titan:'전퇴',name:'남동부 과수원',path:'M560 450C820 510 1010 630 1200 580C1360 550 1460 760 1616 730L1616 1104L870 1104C840 1030 730 970 740 850C760 700 590 650 560 450Z'}
];


export const REVEAL_DURATION=2200;
export function discoveryStage(count){return count===0?'sealed':count<3?'glimpses':count<5?'connected':'landscape';}
export function exploredRegions(state){
 return MAP_REGIONS.filter(region=>state.role==='admin'
  ?state.teams.some(team=>team.missions?.[region.id]?.status==='approved')
  :state.missions.some(mission=>mission.id===region.id&&!!mission.record)).map(region=>region.id);
}
export function explorationContext(state){return `${state.rehearsal?'rehearsal':'live'}-${state.role==='admin'?'command':state.team}`;}

// Preserve each discovery's start time through polling, but never across teams or resets.
export function createExplorationMemory(){
 let context=null,previous=new Set();const events=new Map(),expansions=new Map();
 return {events,expansions,update(state,now=Date.now()){
  const key=explorationContext(state),next=new Set(exploredRegions(state));
  if(key!==context||[...previous].some(id=>!next.has(id))){events.clear();expansions.clear();}
  else{
   for(const id of next)if(!previous.has(id))events.set(id,now);
   if(discoveryStage(next.size)!==discoveryStage(previous.size))for(const id of next)expansions.set(id,now);
  }
  for(const map of [events,expansions])for(const [id,at] of map)if(now-at>=REVEAL_DURATION)map.delete(id);
  context=key;previous=next;
 },reset(){context=null;previous=new Set();events.clear();expansions.clear();}};
}

function organicOpening([x,y,rx,ry],scale=1){
 rx*=scale;ry*=scale;
 const n=value=>Math.round(value*100)/100;
 return `M${n(x-rx)} ${y}C${n(x-rx*1.12)} ${n(y-ry*.76)} ${n(x-rx*.24)} ${n(y-ry*1.13)} ${n(x+rx*.44)} ${n(y-ry*.92)}S${n(x+rx*1.19)} ${n(y-ry*.24)} ${n(x+rx)} ${n(y+ry*.4)}S${n(x+rx*.21)} ${n(y+ry*1.13)} ${n(x-rx*.47)} ${n(y+ry*.85)}S${n(x-rx*1.02)} ${n(y+ry*.38)} ${n(x-rx)} ${y}Z`;
}
const revealAt=(at,duration=REVEAL_DURATION)=>at===undefined?'':` data-reveal-at="${at}" data-reveal-duration="${duration}"`;

export function discoveryMessage(ids,events=new Map()){
 if(!ids.length)return {title:'본부 보관 기록',text:'방벽 외부 — 생존 불가 지역으로 보고됨',note:'마지막 정찰 이후 지형 정보 없음'};
 const newest=[...events.keys()].reverse().find(id=>ids.includes(id))||ids.at(-1);
 const region=MAP_REGIONS.find(region=>region.id===newest);
 if(ids.length<3)return {title:`${region.titan} 기록에서 발견한 흔적`,text:region.discovery,note:'회수한 기록에서 복원한 모습이다. 아직 직접 확인한 곳은 아니다.'};
 if(ids.length<5)return {title:'흩어진 흔적이 이어진다',text:'서로 다른 기록의 지형이 맞물린다. 생명의 흔적은 한곳에만 남아 있지 않다.',note:'기존 보고: 생존 불가 지역 · 바깥세상은 아직 현장 미확인'};
 if(ids.length<6)return {title:'방벽 너머에 길이 있다',text:'복원된 지형이 성문 밖으로 이어진다. 우리가 믿어 온 보고는 이 풍경을 설명하지 못한다.',note:'기록으로 되찾은 지형 · 직접 확인할 원정은 아직 시작되지 않았다.'};
 return {title:'아직 가보지 않은 땅',text:'지도는 되찾았다. 이제 우리의 눈으로 확인할 차례다.',note:'점선은 앞으로 나아갈 원정 경로다. 우리는 아직 이 길을 밟아보지 않았다.'};
}

function expeditionRoute(state,at){
 const liberation=state.ending?.id==='liberate';
 const path=liberation?'M1045 446C1130 440 1130 540 1170 615S1240 800 1395 795':'M1045 446C1120 440 1200 407 1270 448S1325 625 1395 795';
 return `<svg class="world-expedition" viewBox="0 0 1536 1024" aria-hidden="true" focusable="false"><g class="map-route-reveal"${revealAt(at)}><path class="map-route-shadow" d="${path}"/><path class="map-expedition-path" d="${path}"/><circle class="map-departure" cx="1045" cy="446" r="9"/><path class="map-destination" d="M1395 795V743L1434 752L1395 768M1381 795H1409"/><text class="map-route-label" x="1370" y="835" text-anchor="end">미답의 길</text></g></svg>`;
}

export function renderWorldMap(state,{full=false,instance='main',events=new Map(),expansions=new Map()}={}){
 const prefix='discovery-'+instance.replace(/[^a-z-]/g,'');
 const ids=full?MAP_REGIONS.map(region=>region.id):exploredRegions(state);
 const found=new Set(ids),complete=ids.length===6,stage=discoveryStage(ids.length);
 const regionClips=MAP_REGIONS.map(region=>`<clipPath id="${prefix}-${region.id}"><path d="${region.path}"/></clipPath>`).join('');
 const holes=MAP_REGIONS.filter(region=>found.has(region.id)).map(region=>{
  const newAt=events.get(region.id),expandAt=expansions.get(region.id)??newAt;
  const glimpse=`<path class="map-clearing map-glimpse"${revealAt(newAt,1200)} d="${organicOpening(region.spot)}"/>`;
  const connected=stage==='connected'||stage==='landscape'?`<g class="map-clearing map-connection"${revealAt(expandAt)}><path d="${region.corridor}" stroke="black" stroke-width="${region.width}" stroke-linecap="round" fill="none"/><path d="${organicOpening(region.spot,1.65)}"/></g>`:'';
  const extent=stage==='landscape'?`<path class="map-clearing map-extent"${revealAt(expandAt)} d="${region.path}"/>`:'';
  return `<g data-region="${region.id}" clip-path="url(#${prefix}-${region.id})">${glimpse}${connected}${extent}</g>`;
 }).join('');
 const heading=full?'성문 너머, 우리의 첫 원정':'방벽 너머의 기록';
 const status=complete?'방벽 너머의 지형 복원':ids.length>=5?'바깥 지형 복원 중':ids.length>=3?'흩어진 지형 연결 중':ids.length?'생명의 흔적 발견':'방벽 내부만 확인됨';
 const message=discoveryMessage(ids,events);
 const description=complete?'예상 원정 경로 · 현장 미확인':ids.length?'기록을 더 모아 지워진 풍경을 이어 보라.':'방벽 안은 우리의 세계다. 그 밖은 오래된 보고에만 남아 있다.';
 const legend=MAP_REGIONS.map(region=>`<li class="map-region ${found.has(region.id)?'charted':'uncharted'}"><span class="map-region-mark" aria-hidden="true">${found.has(region.id)?'◆':'◇'}</span><span><strong>${region.titan}</strong><small>${found.has(region.id)?ids.length<3?'생명의 흔적':region.name:'미확인 지형'}</small></span><span class="sr-only">${found.has(region.id)?'지도 기록 확보 · 현장 미확인':'기록 미확보'}</span></li>`).join('');
 const routeAt=complete?Math.max(0,...events.values()):0;
 return `<section class="world-map ${complete?'charted':''} ${full?'revealed':''}" data-restored="${ids.length}" data-discovery-stage="${stage}" data-map-context="${explorationContext(state)}" aria-label="${heading}">
 <div class="world-map-title"><span class="eyebrow">${full?'OUR FIRST EXPEDITION':state.role==='admin'?'RECOVERED INTELLIGENCE':'BEYOND THE WALL'}</span><strong>${heading}</strong></div>
 <div class="world-map-art"><img class="world-map-image" src="/scenes/world-map.jpg" alt="단일 방벽 도시와 안개 너머에 남아 있는 야생 숲, 맑은 강과 버려진 과수원의 기록 지도" width="1536" height="1024" loading="lazy" decoding="async">
 <svg class="world-fog" viewBox="0 0 1536 1024" aria-hidden="true" focusable="false"><defs>${regionClips}
 <filter id="${prefix}-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="12"/></filter>
 <filter id="${prefix}-clouds" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".006 .009" numOctaves="3" seed="17"/><feColorMatrix type="matrix" values="0 0 0 0 .48 0 0 0 0 .55 0 0 0 0 .48 0 0 0 .27 0"/></filter>
 <radialGradient id="${prefix}-shade" cx="75%" cy="20%" r="95%"><stop stop-color="#23312e"/><stop offset="1" stop-color="#0b1312"/></radialGradient>
 <mask id="${prefix}-mask" mask-type="luminance" maskUnits="userSpaceOnUse" x="-80" y="-80" width="1696" height="1184"><rect x="-80" y="-80" width="1696" height="1184" fill="white"/><g fill="black" filter="url(#${prefix}-soft)"><path d="${CITY_OUTLINE}"/>${holes}</g></mask>
 </defs><g mask="url(#${prefix}-mask)"><rect width="1536" height="1024" fill="url(#${prefix}-shade)"/><rect width="1536" height="1024" filter="url(#${prefix}-clouds)"/></g></svg>
 ${complete?expeditionRoute(state,routeAt||undefined):''}<span class="map-compass" aria-hidden="true">N<span>✧</span></span></div>
 <div class="world-map-progress"><span class="map-progress-label">${state.role==='admin'?'본부 지도 기록':'지도 기록'} <strong>${ids.length} / 6</strong></span><span>${status}</span></div>
 <div class="map-discovery ${ids.length?'has-evidence':'old-report'}"><p class="map-discovery-label">${message.title}</p><p class="map-discovery-text">${message.text}</p><p class="map-discovery-note">${message.note}</p></div>
 <ul class="map-regions" aria-label="거인별 지도 기록">${legend}</ul><p class="world-map-bottom">${description}</p></section>`;
}

export function animateMapReveals(root,now=Date.now()){
 if(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 for(const path of root.querySelectorAll('[data-reveal-at]')){
  const elapsed=Math.max(0,now-Number(path.dataset.revealAt)),duration=Number(path.dataset.revealDuration)||REVEAL_DURATION;
  if(elapsed>=duration||!path.animate)continue;
  const animation=path.animate([{opacity:0},{opacity:1}],{duration,easing:'ease-out',fill:'both'});
  animation.currentTime=elapsed;
 }
}
