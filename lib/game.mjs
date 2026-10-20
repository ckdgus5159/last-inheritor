export const TEAM_IDS = ['A', 'B', 'C', 'D'];
export const ROUND_DURATION_MS = 7 * 60 * 1000;
export const DEFENSE_DURATION_MS = 8 * 60 * 1000;
export const MISSIONS = [
  {id:'cart',name:'차력 거인',title:'빼앗긴 보급선을 탈환하라',tag:'보급 · 집중',approval:true,icon:'▰',rule:'차력 거인이 아군의 보급선을 장악했다. 놈의 끈질긴 운반 능력을 넘어 흩어진 보급품을 되찾아라. 제한된 시간 안에 물자를 확보하고 차력 거인의 힘을 계승하라!',materials:'마른 콩, 젓가락, 작은 그릇 2개',record:'보급반 보고 01 — 검은 지도 밖의 화물',clue:'차력 거인의 화물에서 방벽 내부 군수창고의 봉인과 낯선 과일이 함께 발견되었다. 과일은 최근에 수확된 것처럼 신선했지만, 출하지는 검게 가려진 외부 지역이었다. 사람이 살 수 없는 죽음의 땅이라는 소문과 맞지 않는다. 거인은 벽 밖에서 왔다고 하면서, 왜 화물에는 내부 군수창고의 봉인이 찍혀 있을까?'},
  {id:'beast',name:'짐승 거인',title:'투척의 지배자를 넘어라',tag:'투척 · 협동',approval:true,icon:'✦',rule:'짐승 거인의 투척 공격으로 조사병단의 진군이 막혔다. 놈에게 맞서려면 동료와의 호흡과 정확한 투척이 필요하다. 목표물을 놓치지 않고 포획해 짐승 거인의 기술을 넘어섰음을 증명하라!',materials:'소쿠리, 참가자 신발',record:'전투기록 02 — 제3공방의 각인',clue:'짐승 거인의 투척 장비에서 방벽 내부 제3공방의 제작 번호가 발견되었다. 장비의 형식은 오래전 인류 방어 계획 도면과 동일하다. 외부에서 침공한 괴물이 왜 우리가 만든 장비를 가지고 있는가? 서로 다른 거인에게서 발견된 표식을 확인할 필요가 있다.'},
  {id:'female',name:'여성형 거인',title:'적의 판단을 교란하라',tag:'심리 · 교란',approval:false,icon:'◈',rule:'여성형 거인은 민첩한 움직임과 예측할 수 없는 전술로 상대의 판단을 흐린다. 적이 보고 들은 것만으로 우리를 파악할 수 없도록 하라. 분대원들과 호흡을 맞춰 상대의 판단을 흔들고 끝까지 속내를 드러내지 마라!',materials:'개인용 컵, 물, 소금, 쟁반',record:'정보부 기록 03 — 두 개의 경로',clue:'여성형 거인의 이동 경로는 알려진 벽 밖 침공로와 달랐다. 경계병의 보고에는 외부에서 몰려왔다고 적혀 있지만, 회수한 기록에는 방벽 안의 제어시설에서 시작된 명령이 남아 있었다. 모든 거인이 같은 명령 체계를 공유한 흔적까지 발견됐다. 거인의 출현을 다시 조사해야 한다.'},
  {id:'jaw',name:'턱 거인',title:'잔해 속 보급품을 회수하라',tag:'돌파 · 수색',approval:false,icon:'⌁',rule:'턱 거인의 강력한 이빨이 아군의 보급 창고를 산산조각 냈다. 잔해 아래에는 아직 회수하지 못한 물자가 묻혀 있다. 장애물을 돌파해 숨겨진 보급품을 찾아내고 턱 거인의 힘을 계승하라!',materials:'쟁반, 밀가루, 사탕, 정리 도구',record:'기술반 기록 04 — 최초의 목적',clue:'턱 거인이 파괴한 보급함에서 인류 방어 계획의 문서가 발견되었다. 제작 목적은 외부 위협에 대비해 사람들을 보호하고 대피 시간을 확보하는 것이었다. 그러나 거인의 시험 운용 부분은 끊겨 있었다. 무기처럼 사용한 것은 분명하지만, 그 다음에 무슨 일이 일어났을까?'},
  {id:'armor',name:'갑옷 거인',title:'경질화된 방어선을 무너뜨려라',tag:'경질화 · 돌파',approval:false,icon:'⬡',rule:'갑옷 거인의 단단한 경질화 능력 앞에서 조사병단의 공격이 막혔다. 아무리 견고한 갑옷에도 반드시 약점은 존재한다. 분대에 남은 경질화 표식을 모두 제거하고 놈의 방어 능력을 계승하라!',materials:'포스트잇, 수거 봉투',record:'방어대 기록 05 — 통제를 잃은 힘',clue:'갑옷 거인의 경질화 구조는 방벽의 보강재 설계와 같았다. 연구소의 마지막 기록에는 「제어 시스템 폭주 — 전 기체 통제 불능」이라는 경고가 적혀 있었다. 이후 거인들은 방벽을 공격하기 시작했고, 외부 침공이라는 보고만 남았다. 벽을 지키려던 계획이 어떻게 이런 결과를 낳았는가?'},
  {id:'warhammer',name:'전퇴 거인',title:'새로운 무기를 창조하라',tag:'창조 · 경질화',approval:false,icon:'⚒',rule:'전퇴 거인은 경질화 능력으로 서로 다른 형태의 무기와 구조물을 만들어 낸다. 정해진 모습에 얽매이지 않는 창조력이 놈의 힘이다. 각자 다른 형태를 완성하고 전퇴 거인의 창조 능력을 계승하라!',materials:'정사각 색종이, 간단한 종이접기 도안, 펜',record:'탐사기록 06 — 지워진 지도',clue:'전퇴 거인의 결정 속에는 오래전 탐사대가 남긴 세계지도 조각이 숨겨져 있었다. 우리가 보던 지도에서 검게 칠해진 지역에 숲과 강, 과수원이 기록되어 있었다. 그 옆에는 「확인되지 않는 지역을 황무지로 단정하지 말 것」이라는 메모가 남아 있다. 이 조각을 다른 조사 기록과 합치면 바깥세상의 모습도 되찾을 수 있을 것이다.'}
];
export const DEFENSE_TASKS = {
  A:{title:'단체줄넘기 · 방어선 동기화',rule:'초대형 거인의 공격으로 방어선의 대형이 무너졌다. 분대원의 호흡을 하나로 모아라. 모두 힘을 합쳐 줄넘기 연속 5회를 성공시켜라!',materials:'긴 줄넘기 1개, 넓고 평평한 공간'},
  B:{title:'퀴즈 풀기 · 통신 해독',rule:'거인의 폭발로 본부 통신이 끊어졌다. 지금 필요한 것은 힘보다 판단력이다. 분대의 지혜를 모아 단 하나의 문제를 풀고 통신을 복구하라!',materials:'문제 영상 또는 인쇄물, 펜'},
  C:{title:'젠가 쌓기 · 방벽 복구',rule:'초대형 거인의 충격으로 방벽 지지대가 무너졌다. 구조물이 무너지기 전에 방어선을 되살려라. 지지대 다섯 개를 수직으로 쌓아 방벽을 복구하라!',materials:'젠가 블록 5개 이상, 평평한 바닥'},
  D:{title:'티스푼 탁구공 릴레이 · 긴급 보급',rule:'전선으로 향하는 보급로가 끊어졌다. 보급이 멈추면 방어선은 오래 버티지 못한다. 작은 운반 도구로 물자를 끝까지 전달하라!',materials:'티스푼(분대원 수만큼), 탁구공'}
};
export const OPERATIONS = [
 {id:'inherit',name:'계승 작전',subtitle:'과거의 힘으로, 새로운 길을 연다',body:'거인의 힘을 봉인하지 않고 엄격한 통제 아래 보급과 개척에 활용한다. 빠르게 길을 열 수 있지만, 과거의 통제 실패가 반복될 위험을 감수해야 한다.',ending:'네 분대는 여섯 거인의 힘을 파괴가 아닌 개척에 사용하기로 했다. 차력의 운반 능력은 보급을 이끌었고, 전퇴의 힘은 끊어진 길 위에 다리를 놓았다. 강력한 힘을 다시 통제해야 한다는 두려움은 남아 있었지만, 동료들은 서로의 판단을 견제하며 앞으로 나아갔다. 한때 우리를 두렵게 했던 힘이 이제는 새로운 가능성을 여는 도구가 되었다.'},
 {id:'liberate',name:'해방 작전',subtitle:'우리의 힘으로, 새로운 길을 연다',body:'거인의 제어 장치를 봉인하고 인간의 힘과 협동으로 미지의 땅에 도전한다. 시간이 더 들고 많은 노력이 필요하지만, 위험한 힘에 의존하지 않는 길을 선택한다.',ending:'네 분대는 거인의 제어 장치를 봉인하고 두 발로 성문을 넘어섰다. 특별한 힘은 내려놓았지만 거인을 이겨내며 배운 끈기와 판단, 협동과 창조력은 남았다. 길을 찾는 데에는 더 많은 시간과 노력이 필요했지만, 동료들은 서로를 믿고 한 걸음씩 앞으로 나아갔다. 우리가 계승한 것은 거인의 힘만이 아니라 벽을 넘어설 용기였다.'}
];
export const EPILOGUE='방벽은 오랫동안 우리를 지켜주었다. 이제 그 벽을 딛고 다음 세계로 나아갈 차례다. 누군가는 거인의 힘으로, 누군가는 동료의 힘으로 길을 연다. 옛 지도는 여기서 끝난다. 그러나 우리의 이야기는 이제부터다!';
export const FINALE_REVEAL='거인은 벽 밖에서 몰려온 존재가 아니었다. 방벽 안 제3공방이 인류를 보호하기 위해 개발한 방어 병기였다. 하지만 제어 시스템이 폭주했고 여섯 거인은 통제를 잃어 방벽을 위협하는 괴물이 됐다. 그 뒤 탐사가 중단되면서 알 수 없는 외부 지역이 검은 위험지대로 표시되었고, 사람들은 그곳을 죽음의 땅이라고 믿게 되었다. 이제 복원된 지도를 보라. 그 너머에는 강과 숲, 과수원과 아직 가보지 못한 길들이 펼쳐져 있다.';
export function initialState(){return {round:0,phase:'briefing',deadline:null,pausedAt:null,announcement:'검게 가려진 지도 너머에서 여섯 거인이 발견되었다. 출정 명령을 기다려라.',emergency:null,teams:Object.fromEntries(TEAM_IDS.map(id=>[id,{leader:null,missions:{},puzzle:false,puzzleSubmission:null,ending:null}])),audit:[]};}
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
 }else if(['start','next','pause','resume','announce','emergency','emergency-end','approve','reject','defense-approve','puzzle-approve','puzzle-reject','finale','release','epilogue','reset'].includes(action)){
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
   if(action==='defense-approve'){check(!s.pausedAt&&s.emergency&&!s.emergency.resolved&&TEAM_IDS.includes(p.team),'진행 중인 방어 임무를 선택하세요.');check(s.emergency.teams[p.team]==='pending','분대의 완료 보고를 먼저 확인하세요.');check(now<=s.emergency.deadline,'방어 제한시간이 지났습니다. 비상 방어로 전환하세요.');s.emergency.teams[p.team]='approved';if(Object.values(s.emergency.teams).every(v=>v==='approved')){s.emergency.resolved=true;s.emergency.result='success';s.deadline+=now-s.emergency.startedAt;s.announcement='방벽 방어 성공! 초대형 거인의 잔해에서 '인류 방어 계획 — 제어 시스템 폭주' 기록을 확보했다.';}}
   if(action==='emergency-end'){check(s.emergency&&!s.emergency.resolved,'진행 중인 공동 방어가 없습니다.');s.emergency.resolved=true;s.emergency.result='fallback';s.deadline+=now-s.emergency.startedAt;s.announcement='비상 방어선 가동. 제3공방의 제어핵에서 폭주 경고가 발견되었다. 조사를 계속하라.';}
   if(action==='puzzle-approve'||action==='puzzle-reject'){
     check(s.phase==='finale'&&TEAM_IDS.includes(p.team),'최종 기록을 검토할 분대를 선택하세요.');
     const target=s.teams[p.team];check(!target.puzzle&&target.puzzleSubmission?.status==='pending','승인 대기 중인 해독 요청이 아닙니다.');
     target.puzzleSubmission.status=action==='puzzle-approve'?'approved':'rejected';
     target.puzzleSubmission.reviewedAt=stamp();
     if(action==='puzzle-approve')target.puzzle=true;
     else target.puzzleSubmission.reason=String(p.reason||'기록을 다시 확인한 뒤 수정하여 제출하세요.').slice(0,200);
   }
   if(action==='approve'||action==='reject'){
     const target=s.teams[p.team];check(target,'분대를 선택하세요.');const m=target.missions[p.mission];check(m?.status==='pending','승인 대기 중인 임무가 아닙니다.');
     if(action==='approve'){const n=Number(p.score??10);check(Number.isInteger(n)&&n>=0&&n<=10,'점수는 0~10 사이 정수입니다.');m.status='approved';m.score=n;m.reviewedAt=stamp();}else{m.status='rejected';m.reason=String(p.reason||'본부의 안내를 확인하고 다시 수행하세요.').slice(0,300);}
   }
   if(action==='finale'){check(s.phase==='round'&&s.round===6,'6라운드까지 진행한 후 열 수 있습니다.');check(!s.emergency||s.emergency.resolved,'공동 방어를 먼저 마쳐주세요.');check(TEAM_IDS.every(id=>completeCount(s.teams[id])===6),'모든 분대가 6개 미션을 완료해야 합니다.');s.phase='finale';s.pausedAt=null;s.deadline=null;s.announcement='여섯 거인의 조사 기록을 결합해 폭주한 방어 병기의 진실을 밝혀라.';}
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
   }else if(action==='puzzle'){
     check(s.phase==='finale'&&completeCount(t)===6,'최종 작전이 아직 열리지 않았습니다.');
     check(!t.puzzle,'이미 본부 승인된 기록입니다.',409);
     check(t.puzzleSubmission?.status!=='pending','이미 교관 검토 대기 중입니다.',409);
     const answers={origin:p.origin,purpose:p.purpose,cause:p.cause};
     for(const [key,value] of Object.entries(answers)){
       check(typeof value==='string'&&value.trim().length>=1&&value.trim().length<=120,'세 답안 모두 1~120자로 입력하세요.');
       answers[key]=value.trim();
     }
     t.puzzleSubmission={status:'pending',answers,submittedAt:stamp()};
   }else if(action==='ending'){check(s.phase==='finale'&&t.puzzle,'최종 암호부터 해독하세요.');check(!t.ending,'이미 작전을 선택했습니다.',409);check(OPERATIONS.some(o=>o.id===p.operation),'작전을 선택하세요.');t.ending=p.operation;
   }else throw new GameError('지원하지 않는 지령입니다.');
 }
 s.audit.push({at:stamp(),actor:admin?'본부':actor.team,action,team:p.team||actor.team||null,mission:p.mission||null});s.audit=s.audit.slice(-100);
 return s;
}
export function projectState(s,actor,now=Date.now()){
 const admin=actor.role==='admin';const t=s.teams[actor.team];const lead=t&&actor.role==='leader'&&actor.sid===t.leader;
 const teams=TEAM_IDS.map(id=>({id,completed:completeCount(s.teams[id]),score:score(s.teams[id]),leaderAssigned:!!s.teams[id].leader,ending:s.phase==='epilogue'?s.teams[id].ending:undefined,...(admin?{missions:s.teams[id].missions,puzzle:s.teams[id].puzzle,puzzleSubmission:s.teams[id].puzzleSubmission||null,ending:s.teams[id].ending}:{})}));
 return {now,role:admin?'admin':lead?'leader':'observer',team:actor.team||null,round:s.round,phase:s.phase,deadline:s.deadline,pausedAt:s.pausedAt,announcement:s.announcement,emergency:s.emergency,defenseTasks:DEFENSE_TASKS,teams,
 missions:MISSIONS.map(m=>{const unlocked=!!t&&Array.from({length:s.round},(_,i)=>assigned(actor.team,i+1).id).includes(m.id);const mine=t?.missions[m.id];return {id:m.id,name:m.name,title:m.title,tag:m.tag,approval:m.approval,icon:m.icon,rule:m.rule,materials:m.materials,unlocked:admin||unlocked,current:s.round>0&&t&&assigned(actor.team,s.round).id===m.id,result:mine,record:admin||mine?.status==='approved'?{title:m.record,text:m.clue}:null};}),
 schedule:TEAM_IDS.map(id=>({team:id,missions:Array.from({length:6},(_,i)=>assigned(id,i+1).id)})),
 puzzle:t?.puzzle||false,puzzleSubmission:t?.puzzleSubmission||null,ending:t?.ending?OPERATIONS.find(o=>o.id===t.ending):null,
 operations:admin||t?.puzzle?OPERATIONS.map(({ending,...o})=>o):[],finaleReveal:admin||t?.puzzle?FINALE_REVEAL:null,epilogue:s.phase==='epilogue'?EPILOGUE:null,audit:admin?s.audit.slice(-20):undefined};
}
