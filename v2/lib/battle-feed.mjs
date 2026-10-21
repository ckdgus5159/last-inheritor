import {TEAMS} from './catalog.mjs';
// Public projection of confirmed outcomes. Never expose tokens, locations, actors or bonus instructions.
export function battleFeed(events=[]){
 const kinds={approve:'titan',qrClaim:'qr',bonusSubmit:'bonus',fieldResult:'bonus',roulette:'bonus',correctBase:'correction',correctExtra:'correction'};
 return events.flatMap(e=>{
  const kind=kinds[e.action];if(!kind||!TEAMS.includes(e.team)||!e.before||!e.after||!Number.isFinite(e.at))return [];
  const delta=key=>(e.after[key]??0)-(e.before[key]??0),points=kind==='titan'?delta('base'):kind==='qr'?delta('qr'):kind==='bonus'?delta('bonus')-delta('penalty'):delta('base')+delta('qr')+delta('bonus')-delta('penalty');
  if((kind==='titan'||kind==='correction')&&points===0)return [];
  return [{id:e.id,at:e.at,team:e.team,kind,title:kind==='correction'?'점수 정정':e.detail||({titan:'거인 토벌 완료',qr:'보급품 확보',bonus:'보너스 결과 확정'}[kind]),points,scoreDelta:delta('total')}];
 }).sort((a,b)=>b.at-a.at).slice(0,12);
}
