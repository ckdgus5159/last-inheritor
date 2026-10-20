// Artwork coordinates: 1536 × 1024. Shared curved boundaries leave no grid seams.
export const CITY_OUTLINE = 'M495 80C495 44 519 25 561 26C605 26 628 48 628 82C813 102 969 231 998 380C1035 379 1069 406 1066 446C1064 481 1044 508 1001 511C983 668 825 793 636 824C637 868 606 896 564 896C523 896 490 868 490 826C305 804 158 677 135 511C93 510 65 488 65 448C65 410 92 384 136 383C166 224 311 102 495 80Z';
export const MAP_REGIONS = [
 {id:'cart',titan:'차력',name:'남부 보급로',path:'M560 450C590 650 760 700 740 850C730 970 840 1030 870 1104L-80 1104L-80 850C40 825 20 675 140 680C300 690 380 535 560 450Z'},
 {id:'beast',titan:'짐승',name:'북동부 고지대',path:'M560 450C650 230 715 220 740 80C760 15 795-10 810-80L1616-80L1616 120C1520 100 1400 222 1280 205C1040 180 850 425 560 450Z'},
 {id:'female',titan:'여성형',name:'북서부 숲길',path:'M560 450C450 270 260 250 160 160C70 90 0 140-80 80L-80-80L810-80C795-10 760 15 740 80C715 220 650 230 560 450Z'},
 {id:'jaw',titan:'턱',name:'동부 강 유역',path:'M560 450C850 425 1040 180 1280 205C1400 222 1520 100 1616 120L1616 730C1460 760 1360 550 1200 580C1010 630 820 510 560 450Z'},
 {id:'armor',titan:'갑옷',name:'서부 방벽 외곽',path:'M560 450C380 535 300 690 140 680C20 675 40 825-80 850L-80 80C0 140 70 90 160 160C260 250 450 270 560 450Z'},
 {id:'warhammer',titan:'전퇴',name:'남동부 과수원',path:'M560 450C820 510 1010 630 1200 580C1360 550 1460 760 1616 730L1616 1104L870 1104C840 1030 730 970 740 850C760 700 590 650 560 450Z'}
];

export function exploredRegions(state){
 return MAP_REGIONS.filter(region=>state.role==='admin'
  ?state.teams.some(team=>team.missions?.[region.id]?.status==='approved')
  :state.missions.some(mission=>mission.id===region.id&&!!mission.record)).map(region=>region.id);
}

export function explorationContext(state){
 return `${state.rehearsal?'rehearsal':'live'}-${state.role==='admin'?'command':state.team}`;
}

// Keep animation start times across ordinary polling and DOM re-renders.
// A different team, rehearsal, reset, or first load establishes a new baseline.
export function createExplorationMemory(){
 let context=null,previous=new Set();
 const events=new Map();
 return {events,update(state,now=Date.now()){
  const key=explorationContext(state),next=new Set(exploredRegions(state));
  if(key!==context||[...previous].some(id=>!next.has(id)))events.clear();
  else for(const id of next)if(!previous.has(id))events.set(id,now);
  for(const [id,at] of events)if(now-at>=1800)events.delete(id);
  context=key;previous=next;
 },reset(){context=null;previous=new Set();events.clear();}};
}

export function renderWorldMap(state,{full=false,instance='main',events=new Map()}={}){
 // IDs are built only from our fixed view names, never from announcements or answers.
 const prefix='exploration-'+instance.replace(/[^a-z-]/g,'');
 const ids=full?MAP_REGIONS.map(region=>region.id):exploredRegions(state);
 const found=new Set(ids),complete=ids.length===6;
 const holes=MAP_REGIONS.filter(region=>found.has(region.id)).map(region=>
  `<path class="map-clearing" data-region="${region.id}"${events.has(region.id)?` data-reveal-at="${events.get(region.id)}"`:''} d="${region.path}"/>`).join('');
 const heading=full?'지도 밖의 세상, 새롭게 펼쳐지다':'방벽 밖 탐사 지도';
 const status=complete?'모든 경로 확보':ids.length?'새로운 길을 찾아가는 중':'방벽 내부 확보 · 외부 탐사 대기';
 const description=full?'완전 복원 · 새로운 세계로 출정':complete?'지형 복원 완료 · 조사 기록을 연결해 거인의 정체를 밝혀라.':'거인을 제압하고 조사 기록을 확보하면 해당 지역의 안개가 걷힌다.';
 const legend=MAP_REGIONS.map(region=>`<li class="map-region ${found.has(region.id)?'charted':'uncharted'}"><span class="map-region-mark" aria-hidden="true">${found.has(region.id)?'◆':'◇'}</span><span><strong>${region.titan}</strong><small>${found.has(region.id)?region.name:'미탐사 지역'}</small></span><span class="sr-only">${found.has(region.id)?'탐사 완료':'탐사 대기'}</span></li>`).join('');
 return `<section class="world-map ${complete?'charted':''} ${full?'revealed':''}" data-restored="${ids.length}" data-map-context="${explorationContext(state)}" aria-label="${heading}">
 <div class="world-map-title"><span class="eyebrow">${full?'THE WORLD REVEALED':state.role==='admin'?'COMMAND SURVEY':'BEYOND THE WALL'}</span><strong>${heading}</strong></div>
 <div class="world-map-art"><img class="world-map-image" src="/scenes/world-map.jpg" alt="방벽 내부는 처음부터 보이며, 거인별 조사 기록에 따라 바깥 지형이 드러나는 작전 지도" width="1536" height="1024" loading="lazy" decoding="async">
 <svg class="world-fog" viewBox="0 0 1536 1024" aria-hidden="true" focusable="false"><defs>
 <filter id="${prefix}-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="12"/></filter>
 <filter id="${prefix}-clouds" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".006 .009" numOctaves="3" seed="17"/><feColorMatrix type="matrix" values="0 0 0 0 .48 0 0 0 0 .55 0 0 0 0 .48 0 0 0 .27 0"/></filter>
 <radialGradient id="${prefix}-shade" cx="75%" cy="20%" r="95%"><stop stop-color="#23312e"/><stop offset="1" stop-color="#0b1312"/></radialGradient>
 <mask id="${prefix}-mask" mask-type="luminance" maskUnits="userSpaceOnUse" x="-80" y="-80" width="1696" height="1184"><rect x="-80" y="-80" width="1696" height="1184" fill="white"/><g fill="black" filter="url(#${prefix}-soft)"><path d="${CITY_OUTLINE}"/>${holes}</g></mask>
 </defs><g mask="url(#${prefix}-mask)"><rect width="1536" height="1024" fill="url(#${prefix}-shade)"/><rect width="1536" height="1024" filter="url(#${prefix}-clouds)"/></g></svg>
 <span class="map-compass" aria-hidden="true">N<span>✧</span></span></div>
 <div class="world-map-progress"><span class="map-progress-label">${state.role==='admin'?'본부 통합 탐사':'외부 탐사'} <strong>${ids.length} / 6</strong></span><span>${status}</span></div>
 <ul class="map-regions" aria-label="거인별 탐사 현황">${legend}</ul><p class="world-map-bottom">${description}</p></section>`;
}

export function animateMapReveals(root,now=Date.now()){
 if(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 for(const path of root.querySelectorAll('.map-clearing[data-reveal-at]')){
  const elapsed=Math.max(0,now-Number(path.dataset.revealAt));
  if(elapsed>=1800||!path.animate)continue;
  const animation=path.animate([{opacity:0},{opacity:1}],{duration:1800,easing:'ease-out',fill:'both'});
  animation.currentTime=elapsed;
 }
}
