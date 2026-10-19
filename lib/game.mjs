export const TEAM_IDS = ['A', 'B', 'C', 'D'];
export const ROUND_DURATION_MS = 7 * 60 * 1000;
export const DEFENSE_DURATION_MS = 8 * 60 * 1000;
export const MISSIONS = [
  {id:'cart',name:'차력 거인',title:'빼앗긴 보급선을 탈환하라',tag:'보급 · 집중',approval:true,icon:'▰',rule:'차력 거인이 아군의 보급선을 장악했다. 놈의 끈질긴 운반 능력을 넘어 흩어진 보급품을 되찾아라. 제한된 시간 안에 물자를 확보하고 차력 거인의 힘을 계승하라!',materials:'마른 콩, 젓가락, 작은 그릇 2개',record:'보급반 보고 01 — 정체불명의 보급품',clue:'차력 거인이 운반하던 보급 상자에서 낯선 과일이 발견되었다. 과일에는 거인의 이빨과 달리 작고 가지런한 이 자국이 남아 있었다. 더욱 이상한 것은 이 과일이 방벽 안에서는 발견된 적 없는 품종이라는 점이다. 누가, 어디에서 이 과일을 먹었던 것일까?'},
  {id:'beast',name:'짐승 거인',title:'투척의 지배자를 넘어라',tag:'투척 · 협동',approval:true,icon:'✦',rule:'짐승 거인의 투척 공격으로 조사병단의 진군이 막혔다. 놈에게 맞서려면 동료와의 호흡과 정확한 투척이 필요하다. 목표물을 놓치지 않고 포획해 짐승 거인의 기술을 넘어섰음을 증명하라!',materials:'소쿠리, 참가자 신발',record:'경계일지 02 — 포격 사이의 빛',clue:'짐승 거인이 던진 바위들이 북동쪽 경계 지역에 흩어져 있었다. 포격이 멈춘 틈마다 먼 곳에서 짧은 빛 세 번, 긴 빛 세 번, 다시 짧은 빛 세 번이 반복되었다는 기록이 발견되었다. 당시 경계병들은 이를 전투 중 착시로 판단했다. 그러나 빛의 간격은 이상할 정도로 규칙적이었다.'},
  {id:'female',name:'여성형 거인',title:'적의 판단을 교란하라',tag:'심리 · 교란',approval:false,icon:'◈',rule:'여성형 거인은 민첩한 움직임과 예측할 수 없는 전술로 상대의 판단을 흐린다. 적이 보고 들은 것만으로 우리를 파악할 수 없도록 하라. 분대원들과 호흡을 맞춰 상대의 판단을 흔들고 끝까지 속내를 드러내지 마라!',materials:'개인용 컵, 물, 소금, 쟁반',record:'정보부 기록 03 — 서로 다른 두 보고서',clue:'여성형 거인의 이동 경로를 추적하던 중 서로 다른 정보부 보고서 두 장이 발견되었다. 첫 번째 보고서는 북동쪽에서 들린 소리를 거인의 울음으로 기록했다. 그러나 같은 시각의 두 번째 보고서에는 누군가 반복해서 보내는 신호라고 적혀 있었다. 두 기록 중 어느 쪽이 사실에 가까운 것일까?'},
  {id:'jaw',name:'턱 거인',title:'잔해 속 보급품을 회수하라',tag:'돌파 · 수색',approval:false,icon:'⌁',rule:'턱 거인의 강력한 이빨이 아군의 보급 창고를 산산조각 냈다. 잔해 아래에는 아직 회수하지 못한 물자가 묻혀 있다. 장애물을 돌파해 숨겨진 보급품을 찾아내고 턱 거인의 힘을 계승하라!',materials:'쟁반, 밀가루, 사탕, 정리 도구',record:'미발송 명령서 04 — 파괴된 의료 보급함',clue:'턱 거인이 부순 철제 보급함 안에서 낡은 의료 기록과 약품이 발견되었다. 겉장에는 44분대라는 표식이 있었고, 치료 대상의 번호는 서른을 넘어서까지 이어졌다. 마지막 장에는 식량과 약품이 부족하다는 문구만 남아 있었다. 사람이 살지 않는다고 알려진 지역에 어째서 이런 기록이 남아 있을까?'},
  {id:'armor',name:'갑옷 거인',title:'경질화된 방어선을 무너뜨려라',tag:'경질화 · 돌파',approval:false,icon:'⬡',rule:'갑옷 거인의 단단한 경질화 능력 앞에서 조사병단의 공격이 막혔다. 아무리 견고한 갑옷에도 반드시 약점은 존재한다. 분대에 남은 경질화 표식을 모두 제거하고 놈의 방어 능력을 계승하라!',materials:'포스트잇, 수거 봉투',record:'방어대 보고 05 — 방벽 바깥의 흔적',clue:'갑옷 거인이 지키던 방벽에는 수많은 충격 흔적이 남아 있었다. 방벽 바깥쪽 좁은 공간에서는 거인의 발자국이 아닌 사람 크기의 발자국과 천 조각이 발견되었다. 누군가 오래 머무르며 외부의 위험을 피했던 흔적도 보였다. 방벽이 지키고 있던 것은 과연 누구였을까?'},
  {id:'warhammer',name:'전퇴 거인',title:'새로운 무기를 창조하라',tag:'창조 · 경질화',approval:false,icon:'⚒',rule:'전퇴 거인은 경질화 능력으로 서로 다른 형태의 무기와 구조물을 만들어 낸다. 정해진 모습에 얽매이지 않는 창조력이 놈의 힘이다. 각자 다른 형태를 완성하고 전퇴 거인의 창조 능력을 계승하라!',materials:'정사각 색종이, 간단한 종이접기 도안, 펜',record:'통신반 최종 기록 06 — 결정 속의 지도',clue:'전퇴 거인이 남긴 경질화 결정 안에서 찢어진 지도 조각이 발견되었다. 조각을 맞추자 북동쪽 끝에 오래전 폐쇄되었다는 초소 하나가 나타났다. 초소 옆에는 7이라는 숫자가 적혀 있었고, 그곳으로 이어지는 보급로에는 누군가 최근 고친 흔적이 있었다. 지금까지 발견된 빛과 기록들이 이곳을 가리키는 것일까?'}
];
export const DEFENSE_TASKS = {
  A:{title:'단체줄넘기 · 방어선 동기화',rule:'초대형 거인의 공격으로 방어선의 대형이 무너졌다. 분대원의 호흡을 하나로 모아라. 모두 힘을 합쳐 줄넘기 연속 5회를 성공시켜라!',materials:'긴 줄넘기 1개, 넓고 평평한 공간'},
  B:{title:'퀴즈 풀기 · 통신 해독',rule:'거인의 폭발로 본부 통신이 끊어졌다. 지금 필요한 것은 힘보다 판단력이다. 분대의 지혜를 모아 단 하나의 문제를 풀고 통신을 복구하라!',materials:'문제 영상 또는 인쇄물, 펜'},
  C:{title:'젠가 쌓기 · 방벽 복구',rule:'초대형 거인의 충격으로 방벽 지지대가 무너졌다. 구조물이 무너지기 전에 방어선을 되살려라. 지지대 다섯 개를 수직으로 쌓아 방벽을 복구하라!',materials:'젠가 블록 5개 이상, 평평한 바닥'},
  D:{title:'티스푼 탁구공 릴레이 · 긴급 보급',rule:'전선으로 향하는 보급로가 끊어졌다. 보급이 멈추면 방어선은 오래 버티지 못한다. 작은 운반 도구로 물자를 끝까지 전달하라!',materials:'티스푼(분대원 수만큼), 탁구공'}
};
export const OPERATIONS = [
 {id:'advance',name:'진격 작전',subtitle:'지금, 첫 응답을 보낸다',body:'소규모 선발대를 즉시 보냅니다. 가장 빠르게 현장을 확인할 수 있지만, 고립 위험과 부족한 보급을 감수해야 합니다.',ending:'선발대는 제7초소에 고립된 44분대의 생존자 30여 명을 발견했다. 첫 구조는 시작되었지만, 모두를 데려오려면 보급과 지원이 더 필요했다. 우리가 내디딘 한 걸음이 다음 분대의 길이 되었다.'},
 {id:'pioneer',name:'개척 작전',subtitle:'함께 갈 길을 만든다',body:'방벽 안의 사람들을 설득해 구조대와 보급선을 조직합니다. 더 많은 사람을 도울 수 있지만, 준비하는 동안 신호가 끊길 수 있습니다.',ending:'44분대의 구조 요청을 전해 들은 사람들이 움직이기 시작했다. 구조대와 보급선이 만들어졌다. 기다림의 위험은 남아 있었지만, 한 분대의 사명은 이제 모두의 일이 되었다.'},
 {id:'fortress',name:'철벽 작전',subtitle:'지키며, 연결한다',body:'방벽의 방어를 유지하면서 외부 통신과 안전한 구조로를 확보합니다. 내부의 위험은 줄지만, 직접적인 구조가 늦어질 수 있습니다.',ending:'방어선을 지킨 분대는 마침내 고립된 44분대와 통신을 연결했다. 생존자들에게 길과 시간을 전달했다. 아직 성문 밖으로 나아갈 일이 남았지만, 그들은 더 이상 혼자가 아니었다.'}
];
export const EPILOGUE='벽은 끝이 아니었다. 누군가는 먼저 나아가고, 누군가는 길을 만들고, 누군가는 남아서 지켰다. 서로 다른 선택이 하나의 구조가 될 때, 우리의 사명은 계속된다.';
export function initialState(){return {round:0,phase:'briefing',deadline:null,pausedAt:null,announcement:'방벽 너머에서 거인의 움직임이 감지되었다. 본부의 출정 명령을 기다려라.',emergency:null,teams:Object.fromEntries(TEAM_IDS.map(id=>[id,{leader:null,missions:{},puzzle:false,ending:null}])),audit:[]};}
export function assigned(team,round){return MISSIONS[((round-1)+TEAM_IDS.indexOf(team))%6];}
export class GameError extends Error{constructor(message,status=400){super(message);this.status=status;}}
const check=(ok,msg,status)=>{if(!ok)throw new GameError(msg,status);};
const completeCount=t=>Object.values(t.missions).filter(m=>m.status==='approved').length;
const score=t=>Object.values(t.missions).filter(m=>m.status==='approved').reduce((sum,m)=>sum+m.score,0);
export function transition(input,actor,action,p={},now=Date.now()){
 const s=structuredClone(input); const admin=actor.role==='admin'; const t=s.teams[actor.team];
 const lead=!!t&&actor.role==='leader'&&t.leader===actor.sid;
 const stamp=()=>new Date(now).toISOString();
 if(action==='claim'){
   check(t,'올바른 분대를 선택하세요.');check(!t.leader,'이미 분대장이 지정되어 있습니다. 참관으로 입장하거나 본부에 교체를 요청하세요.',409);t.leader=actor.sid;
 }else if(['start','next','pause','resume','announce','emergency','emergency-end','approve','reject','defense-approve','finale','release','epilogue','reset'].includes(action)){
   check(admin,'본부 관리자만 수행할 수 있습니다.',403);
   if(action==='reset'){
     check(p.confirmation==='초기화','초기화 확인이 필요합니다.');
     return {...initialState(),audit:[{at:stamp(),actor:'본부',action:'reset',team:null,mission:null}]};
   }
   if(action==='start'){check(s.phase==='briefing','이미 작전이 시작되었습니다.');s.round=1;s.phase='round';s.deadline=now+ROUND_DURATION_MS;s.announcement='작전 개시. 각 분대는 지정된 거인 구역으로 이동하라.';}
   if(action==='next'){check(s.phase==='round'&&!s.pausedAt,'진행 중인 라운드에서만 이동할 수 있습니다.');check(s.round<6,'마지막 라운드입니다. 최종 작전을 열어주세요.');check(!s.emergency||s.emergency.resolved,'공동 방어를 먼저 마쳐주세요.');s.round++;s.deadline=now+ROUND_DURATION_MS;}
   if(action==='pause'){check(s.phase==='round'&&!s.pausedAt,'진행 중인 라운드만 일시정지할 수 있습니다.');s.pausedAt=now;}
   if(action==='resume'){check(s.pausedAt,'일시정지 상태가 아닙니다.');if(s.emergency&&!s.emergency.resolved)s.emergency.deadline+=now-s.pausedAt;else s.deadline+=now-s.pausedAt;s.pausedAt=null;}
   if(action==='announce'){check(typeof p.message==='string'&&p.message.trim().length>0&&p.message.length<=500,'공지는 1~500자로 입력하세요.');s.announcement=p.message.trim();}
   if(action==='emergency'){check(s.phase==='round'&&!s.pausedAt,'라운드 진행 중에 발령하세요.');check(!s.emergency,'공동 방어는 이미 발령되었습니다.');s.emergency={deadline:now+DEFENSE_DURATION_MS,startedAt:now,resolved:false,result:null,teams:Object.fromEntries(TEAM_IDS.map(id=>[id,'waiting']))};s.announcement='긴급 지령! 초대형 거인이 방벽에 접근했다. 전 분대는 즉시 방어선에 합류하라!';}
   if(action==='defense-approve'){check(!s.pausedAt&&s.emergency&&!s.emergency.resolved&&TEAM_IDS.includes(p.team),'진행 중인 방어 임무를 선택하세요.');check(s.emergency.teams[p.team]==='pending','분대의 완료 보고를 먼저 확인하세요.');check(now<=s.emergency.deadline,'방어 제한시간이 지났습니다. 비상 방어로 전환하세요.');s.emergency.teams[p.team]='approved';if(Object.values(s.emergency.teams).every(v=>v==='approved')){s.emergency.resolved=true;s.emergency.result='success';s.deadline+=now-s.emergency.startedAt;s.announcement='방벽 방어 성공! 복구된 통신장비에서 북동쪽의 미확인 신호가 포착되었다.';}}
   if(action==='emergency-end'){check(s.emergency&&!s.emergency.resolved,'진행 중인 공동 방어가 없습니다.');s.emergency.resolved=true;s.emergency.result='fallback';s.deadline+=now-s.emergency.startedAt;s.announcement='비상 방어선 가동. 북동쪽에서 포착된 미확인 신호를 계속 조사하라.';}
   if(action==='approve'||action==='reject'){
     const target=s.teams[p.team];check(target,'분대를 선택하세요.');const m=target.missions[p.mission];check(m?.status==='pending','승인 대기 중인 임무가 아닙니다.');
     if(action==='approve'){const n=Number(p.score??10);check(Number.isInteger(n)&&n>=0&&n<=10,'점수는 0~10 사이 정수입니다.');m.status='approved';m.score=n;m.reviewedAt=stamp();}else{m.status='rejected';m.reason=String(p.reason||'본부의 안내를 확인하고 다시 수행하세요.').slice(0,300);}
   }
   if(action==='finale'){check(s.phase==='round'&&s.round===6,'6라운드까지 진행한 후 열 수 있습니다.');check(!s.emergency||s.emergency.resolved,'공동 방어를 먼저 마쳐주세요.');check(TEAM_IDS.every(id=>completeCount(s.teams[id])===6),'모든 분대가 6개 미션을 완료해야 합니다.');s.phase='finale';s.pausedAt=null;s.deadline=null;s.announcement='모든 거인의 힘을 계승했다. 흩어진 조사 기록을 연결해 마지막 통신을 복원하라.';}
   if(action==='release'){check(TEAM_IDS.includes(p.team),'분대를 선택하세요.');s.teams[p.team].leader=null;}
   if(action==='epilogue'){check(s.phase==='finale'&&TEAM_IDS.every(id=>s.teams[id].ending),'모든 분대가 작전을 선택해야 합니다.');s.phase='epilogue';s.announcement='우리의 사명은 이제 시작된다.';}
 }else{
   check(lead,'현재 지정된 분대장만 제출할 수 있습니다.',403);
   if(action==='submit'){
     check(s.phase==='round'&&!s.pausedAt,'지금은 미션을 제출할 수 없습니다.');check(!s.emergency||s.emergency.resolved,'공동 방어 임무를 먼저 확인하세요.');
     const m=MISSIONS.find(m=>m.id===p.mission);check(m,'미션을 선택하세요.');
     // Previously opened missions remain available so a missed round never traps a team.
     check(Array.from({length:s.round},(_,i)=>assigned(actor.team,i+1).id).includes(m.id),'아직 열리지 않은 미션입니다.',403);
     check(!['approved','pending'].includes(t.missions[m.id]?.status),'이미 처리된 미션입니다.',409);
     t.missions[m.id]={status:m.approval?'pending':'approved',score:m.approval?0:10,submittedAt:stamp()};
   }else if(action==='defense-submit'){check(s.phase==='round'&&!s.pausedAt&&s.emergency&&!s.emergency.resolved,'진행 중인 공동 방어가 없습니다.');check(now<=s.emergency.deadline,'방어 제한시간이 지났습니다. 본부 지령을 기다려주세요.');check(s.emergency.teams[actor.team]==='waiting','이미 보고된 임무입니다.');s.emergency.teams[actor.team]='pending';
   }else if(action==='puzzle'){check(s.phase==='finale'&&completeCount(t)===6,'최종 작전이 아직 열리지 않았습니다.');const norm=v=>String(v??'').replace(/\s/g,'');check(['제7초소','7초소','북동쪽제7초소'].includes(norm(p.location))&&['구조요청','구조신호'].includes(norm(p.signal))&&['30여명','약30명','약30여명','30여','30','30명','30명안팎'].includes(norm(p.count)),'기록들을 다시 연결해 보세요. 세 항목을 모두 해독해야 합니다.');t.puzzle=true;
   }else if(action==='ending'){check(s.phase==='finale'&&t.puzzle,'최종 암호부터 해독하세요.');check(!t.ending,'이미 작전을 선택했습니다.',409);check(OPERATIONS.some(o=>o.id===p.operation),'작전을 선택하세요.');t.ending=p.operation;
   }else throw new GameError('지원하지 않는 지령입니다.');
 }
 s.audit.push({at:stamp(),actor:admin?'본부':actor.team,action,team:p.team||actor.team||null,mission:p.mission||null});s.audit=s.audit.slice(-100);
 return s;
}
export function projectState(s,actor,now=Date.now()){
 const admin=actor.role==='admin';const t=s.teams[actor.team];const lead=t&&actor.role==='leader'&&actor.sid===t.leader;
 const teams=TEAM_IDS.map(id=>({id,completed:completeCount(s.teams[id]),score:score(s.teams[id]),leaderAssigned:!!s.teams[id].leader,ending:s.phase==='epilogue'?s.teams[id].ending:undefined,...(admin?{missions:s.teams[id].missions,puzzle:s.teams[id].puzzle,ending:s.teams[id].ending}:{})}));
 return {now,role:admin?'admin':lead?'leader':'observer',team:actor.team||null,round:s.round,phase:s.phase,deadline:s.deadline,pausedAt:s.pausedAt,announcement:s.announcement,emergency:s.emergency,defenseTasks:DEFENSE_TASKS,teams,
 missions:MISSIONS.map(m=>{const unlocked=!!t&&Array.from({length:s.round},(_,i)=>assigned(actor.team,i+1).id).includes(m.id);const mine=t?.missions[m.id];return {id:m.id,name:m.name,title:m.title,tag:m.tag,approval:m.approval,icon:m.icon,rule:m.rule,materials:m.materials,unlocked:admin||unlocked,current:s.round>0&&t&&assigned(actor.team,s.round).id===m.id,result:mine,record:admin||mine?.status==='approved'?{title:m.record,text:m.clue}:null};}),
 schedule:TEAM_IDS.map(id=>({team:id,missions:Array.from({length:6},(_,i)=>assigned(id,i+1).id)})),
 puzzle:t?.puzzle||false,ending:t?.ending?OPERATIONS.find(o=>o.id===t.ending):null,
 operations:admin||t?.puzzle?OPERATIONS.map(({ending,...o})=>o):[],epilogue:s.phase==='epilogue'?EPILOGUE:null,audit:admin?s.audit.slice(-20):undefined};
}
