// Ephemeral administrator-only snapshots. Never read or mutate persisted game data.
import {initialState,projectState,TEAM_IDS,MISSIONS,assigned,DEFENSE_TASKS} from './game.mjs';
export const REHEARSAL_STAGES=[
 '출정 대기','1라운드 · 첫 계승','3라운드 · 단서 수집',
 '초대형 거인 출현','공동 방어 성공','6라운드 · 전부 계승',
 '최종 퍼즐 · 입력 전','퍼즐 · 교관 승인 대기','퍼즐 · 승인 완료',
 '엔딩 · 계승','엔딩 · 해방','공통 에필로그'
];
export function rehearsalSnapshot({stage=0,team='A',role='leader'}={},now=Date.now()){
 if(!Number.isInteger(stage)||stage<0||stage>=REHEARSAL_STAGES.length)throw new Error('올바르지 않은 리허설 단계');
 if(!TEAM_IDS.includes(team)||!['leader','observer','admin'].includes(role))throw new Error('올바르지 않은 리허설 분대/역할');
 const s=initialState();
 for(const id of TEAM_IDS)s.teams[id].leader='rehearsal-'+id;
 const round=[0,1,3,3,4,6,6,6,6,6,6,6][stage];
 s.round=round;
 s.phase=stage>=6?'finale':round?'round':'briefing';
 s.deadline=round?now+7*60*1000:null;
 s.announcement=stage===0?'네 분대의 출정을 기다려라.':stage===3?'초대형 거인이 방벽에 접근했다! 전 분대 집결!':stage>=6?'여섯 기록을 조합해 거인의 탄생을 밝혀라.':'거인을 쓰러뜨리고 새로운 조사 기록을 수집하라.';
 if(stage===3||stage===4){
  s.emergency={deadline:now+8*60*1000,startedAt:now,resolved:stage===4,result:stage===4?'success':null,
   teams:Object.fromEntries(TEAM_IDS.map(id=>[id,stage===4?'approved':id==='A'?'pending':'waiting']))};
  if(stage===4)s.announcement='방벽 방어 성공! 제어핵에서 제어 시스템 폭주 기록을 확보했다.';
 }
 const completed=stage===0?0:stage===1?1:stage<=3?3:stage===4?4:6;
 for(const id of TEAM_IDS){
  for(let i=1;i<=completed;i++){
   const m=assigned(id,i);
   s.teams[id].missions[m.id]={status:'approved',score:10,submittedAt:new Date(now).toISOString()};
  }
 }
 if(stage>=7){
  s.teams[team].puzzleSubmission={status:stage===7?'pending':'approved',
   answers:{origin:'방벽 내부',purpose:'인류 보호',cause:'제어 시스템 폭주'},
   submittedAt:new Date(now).toISOString(),...(stage>=8?{reviewedAt:new Date(now).toISOString()}:{})};
 }
 if(stage>=8)s.teams[team].puzzle=true;
 if(stage>=9){
  s.teams[team].ending=stage===10?'liberate':'inherit';
  for(const id of TEAM_IDS){if(id!==team){s.teams[id].puzzle=true;s.teams[id].ending=id==='B'?'liberate':'inherit';}}
 }
 if(stage===11){s.phase='epilogue';s.teams[team].ending='liberate';}
 const actor=role==='admin'?{role:'admin',sid:'rehearsal-admin'}:{role,team,sid:'rehearsal-'+team};
 return {...projectState(s,actor,now),rehearsal:true,rehearsalStage:stage,rehearsalStages:REHEARSAL_STAGES};
}
