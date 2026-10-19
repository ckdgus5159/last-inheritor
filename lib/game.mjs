export const TEAM_IDS = ['A', 'B', 'C', 'D'];
export const MISSIONS = [
  {id:'cart',name:'차력 거인',title:'보급 콩을 확보하라',tag:'젓가락 · 집중',approval:true,icon:'▰',rule:'젓가락으로 콩을 한 알씩 집어 옆 그릇으로 옮깁니다. 분대원이 차례로 참여해 2분 동안 20개 옮기기에 도전하세요. 콩 2개당 1점, 최대 10점입니다. 손으로 콩을 잡지 않으며, 종료 후 교관 승인을 요청합니다.',materials:'마른 콩 30개, 개인 젓가락, 작은 그릇 2개',record:'보급반 보고 01',clue:'북동쪽 초소에서 불빛이 목격되었다. 다른 분대가 확인할 것이라 생각해 보고를 넘겼다.'},
  {id:'beast',name:'짐승 거인',title:'신발을 목표 지점으로',tag:'신발 던지기 · 정확도',approval:true,icon:'✦',rule:'출발선에서 자기 신발을 손으로 낮게 던져 소쿠리에 넣습니다. 분대 합계 5회 시도하며 한 번 성공할 때마다 2점입니다. 사람을 향해 던지지 말고 앞이 비어 있을 때만 진행한 뒤 교관 승인을 요청하세요.',materials:'소쿠리 1개, 참가자 신발, 출발선 표시용 테이프',record:'경계일지 02',clue:'한 경계병이 작은 신호를 보았다. 나 하나의 기록은 중요하지 않다고 생각했다. 그 신호는 일곱 번째 초소에서 반복되었다.'},
  {id:'female',name:'여성형 거인',title:'불완전한 정보',tag:'심리 · 추리',approval:false,icon:'◈',rule:'교관의 안내에 따라 스파이를 추리합니다. 지목 결과와 관계없이 미션을 완료할 수 있습니다. 시음은 희망자만 소량 참여하고, 대신 표정 연기로 참여해도 됩니다.',materials:'작은 컵, 물, 소금, 표시용 펜, 받침 쟁반',record:'정보부 기록 03',clue:'한 잔만 소금물이라는 정보부터 틀렸다. 우리가 당연하게 믿어 온 다른 정보도 틀렸다면? 잡음이라던 신호에는 구조를 요청하는 말이 담겨 있었다.'},
  {id:'jaw',name:'턱 거인',title:'가루 속 보급품 수색',tag:'사탕 찾기 · 탐색',approval:false,icon:'⌁',rule:'얕게 펼친 밀가루 속에서 손으로 개별 포장 사탕을 찾습니다. 분대원마다 1개씩 찾으면 완료합니다. 밀가루를 불거나 얼굴·입을 넣지 마세요. 활동 후 손을 씻고 포장을 벗겨 먹을 수 있으며 먹기는 선택입니다.',materials:'얕은 쟁반, 밀가루, 개별 포장 사탕, 손 씻을 물·휴지',record:'미발송 명령서 04',clue:'구조 신호 분석은 다음 원정으로 미뤄졌다. 그사이 응답은 더 짧아졌다. 마지막으로 확인된 인원은 스물네 명이었다.'},
  {id:'armor',name:'갑옷 거인',title:'방벽의 표식을 제거하라',tag:'포스트잇 · 협동',approval:false,icon:'⬡',rule:'분대원 옷의 팔·등에 포스트잇을 3장씩 붙이고 모서리를 살짝 접어 둡니다. 동료가 바람을 불어 모두 떼면 완료합니다. 손으로 떼거나 몸을 털지 말고 얼굴에는 붙이지 않습니다. 입을 가까이 대지 말고 차례로 도전하세요.',materials:'포스트잇 1인 3장, 수거용 봉투',record:'방어대 보고 05',clue:'방벽은 실제로 많은 생명을 지켰다. 하지만 방벽을 지키는 것과 바깥의 사람들을 돕는 것은 언제부터 서로 다른 일이 되었는가?'},
  {id:'warhammer',name:'전퇴 거인',title:'도안을 따라 형태를 복원하라',tag:'종이접기 · 관찰',approval:false,icon:'⚒',rule:'도안을 보고 강아지 얼굴을 접습니다. 삼각형으로 반 접고 양쪽 귀와 아래 코를 접어 분대원마다 1개씩 완성하면 완료합니다. 먼저 완성한 사람은 말로 순서를 설명하며 동료를 도와주세요.',materials:'정사각 색종이 1인 1장 + 여분, 강아지 얼굴 도안, 펜',record:'통신반 최종 기록 06',clue:'북동쪽 제7초소. 신호의 정체는 구조 요청. 생존자 24명. 길이 없었던 것이 아니었다. 우리가 그곳에 아무도 없다고 믿었던 것이다.'}
];
export const DEFENSE_TASKS = {
  "A": {
    "title": "단체줄넘기 · 방어선 동기화",
    "rule": "줄 돌리는 2명과 뛰는 인원(기본 4명)이 호흡을 맞춰 연속 3회 넘으면 완료합니다. 평평하고 미끄럽지 않은 곳에서 낮게 돌리고 걸리면 즉시 멈춘 뒤 재시도하세요.",
    "materials": "긴 줄넘기 1개, 넓고 평평한 공간"
  },
  "B": {
    "title": "퀴즈 풀기 · 통신 해독",
    "rule": "진행자가 제시하는 문제적남자 공식 영상의 문제 1개를 함께 풀고 풀이 이유까지 설명합니다. 3분 뒤 힌트를 받을 수 있습니다. 영상 재생이 어려우면 운영자료의 예비 논리 문제로 진행합니다.",
    "materials": "문제 화면을 보여줄 휴대폰·태블릿 또는 인쇄물, 메모지, 펜"
  },
  "C": {
    "title": "종이컵 쌓기 · 방벽 복구",
    "rule": "종이컵 15개를 아래부터 5·4·3·2·1개로 쌓아 피라미드를 만들고 손을 뗀 채 3초 유지하면 완료합니다. 무너지면 다시 쌓습니다.",
    "materials": "종이컵 15개 + 여분 5개, 평평한 탁자"
  },
  "D": {
    "title": "탁구공 릴레이 · 긴급 보급",
    "rule": "분대원이 종이컵을 하나씩 들고 줄을 섭니다. 손으로 공을 만지지 않고 컵에서 컵으로 전달해 도착 컵에 공 3개를 넣으면 완료합니다. 떨어진 공만 출발 지점에서 다시 시작합니다.",
    "materials": "종이컵 분대 인원수 + 도착용 1개, 탁구공 3개 + 여분 2개"
  }
};
export const OPERATIONS = [
 {id:'advance',name:'진격 작전',subtitle:'지금, 첫 응답을 보낸다',body:'소규모 선발대를 즉시 보냅니다. 가장 빠르게 현장을 확인할 수 있지만, 고립 위험과 부족한 보급을 감수해야 합니다.',ending:'선발대는 제7초소의 생존자를 발견했다. 첫 구조는 시작되었지만, 모두를 데려오려면 보급과 지원이 더 필요했다. 우리가 내디딘 한 걸음이 다음 분대의 길이 되었다.'},
 {id:'pioneer',name:'개척 작전',subtitle:'함께 갈 길을 만든다',body:'방벽 안의 사람들을 설득해 구조대와 보급선을 조직합니다. 더 많은 사람을 도울 수 있지만, 준비하는 동안 신호가 끊길 수 있습니다.',ending:'분대의 보고에 사람들이 움직이기 시작했다. 구조대와 보급선이 만들어졌다. 기다림의 위험은 남아 있었지만, 한 분대의 사명은 이제 모두의 일이 되었다.'},
 {id:'fortress',name:'철벽 작전',subtitle:'지키며, 연결한다',body:'방벽의 방어를 유지하면서 외부 통신과 안전한 구조로를 확보합니다. 내부의 위험은 줄지만, 직접적인 구조가 늦어질 수 있습니다.',ending:'방어선을 지킨 분대는 마침내 외부와 통신을 연결했다. 생존자들에게 길과 시간을 전달했다. 아직 성문 밖으로 나아갈 일이 남았지만, 그들은 더 이상 혼자가 아니었다.'}
];
export const EPILOGUE='벽은 끝이 아니었다. 누군가는 먼저 나아가고, 누군가는 길을 만들고, 누군가는 남아서 지켰다. 서로 다른 선택이 하나의 구조가 될 때, 우리의 사명은 계속된다.';
export function initialState(){return {round:0,phase:'briefing',deadline:null,pausedAt:null,announcement:'조사병단 본부의 작전 개시를 기다리십시오.',emergency:null,teams:Object.fromEntries(TEAM_IDS.map(id=>[id,{leader:null,missions:{},puzzle:false,ending:null}])),audit:[]};}
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
   if(action==='start'){check(s.phase==='briefing','이미 작전이 시작되었습니다.');s.round=1;s.phase='round';s.deadline=now+720000;s.announcement='작전 개시. 현재 배정된 구역으로 이동하십시오.';}
   if(action==='next'){check(s.phase==='round'&&!s.pausedAt,'진행 중인 라운드에서만 이동할 수 있습니다.');check(s.round<6,'마지막 라운드입니다. 최종 작전을 열어주세요.');check(!s.emergency||s.emergency.resolved,'공동 방어를 먼저 마쳐주세요.');s.round++;s.deadline=now+720000;}
   if(action==='pause'){check(s.phase==='round'&&!s.pausedAt,'진행 중인 라운드만 일시정지할 수 있습니다.');s.pausedAt=now;}
   if(action==='resume'){check(s.pausedAt,'일시정지 상태가 아닙니다.');if(s.emergency&&!s.emergency.resolved)s.emergency.deadline+=now-s.pausedAt;else s.deadline+=now-s.pausedAt;s.pausedAt=null;}
   if(action==='announce'){check(typeof p.message==='string'&&p.message.trim().length>0&&p.message.length<=500,'공지는 1~500자로 입력하세요.');s.announcement=p.message.trim();}
   if(action==='emergency'){check(s.phase==='round'&&!s.pausedAt,'라운드 진행 중에 발령하세요.');check(!s.emergency,'공동 방어는 이미 발령되었습니다.');s.emergency={deadline:now+480000,startedAt:now,resolved:false,result:null,teams:Object.fromEntries(TEAM_IDS.map(id=>[id,'waiting']))};s.announcement='초대형 거인 출현! 전 분대는 즉시 방벽 방어에 합류하라.';}
   if(action==='defense-approve'){check(!s.pausedAt&&s.emergency&&!s.emergency.resolved&&TEAM_IDS.includes(p.team),'진행 중인 방어 임무를 선택하세요.');check(s.emergency.teams[p.team]==='pending','분대의 완료 보고를 먼저 확인하세요.');check(now<=s.emergency.deadline,'방어 제한시간이 지났습니다. 비상 방어로 전환하세요.');s.emergency.teams[p.team]='approved';if(Object.values(s.emergency.teams).every(v=>v==='approved')){s.emergency.resolved=true;s.emergency.result='success';s.deadline+=now-s.emergency.startedAt;s.announcement='방벽 방어 성공. 북동쪽에서 미확인 구조 신호가 수신되었습니다.';}}
   if(action==='emergency-end'){check(s.emergency&&!s.emergency.resolved,'진행 중인 공동 방어가 없습니다.');s.emergency.resolved=true;s.emergency.result='fallback';s.deadline+=now-s.emergency.startedAt;s.announcement='본부의 비상 방어선이 가동되었습니다. 북동쪽 미확인 신호를 계속 조사하십시오.';}
   if(action==='approve'||action==='reject'){
     const target=s.teams[p.team];check(target,'분대를 선택하세요.');const m=target.missions[p.mission];check(m?.status==='pending','승인 대기 중인 임무가 아닙니다.');
     if(action==='approve'){const n=Number(p.score??10);check(Number.isInteger(n)&&n>=0&&n<=10,'점수는 0~10 사이 정수입니다.');m.status='approved';m.score=n;m.reviewedAt=stamp();}else{m.status='rejected';m.reason=String(p.reason||'본부의 안내를 확인하고 다시 수행하세요.').slice(0,300);}
   }
   if(action==='finale'){check(s.phase==='round'&&s.round===6,'6라운드까지 진행한 후 열 수 있습니다.');check(!s.emergency||s.emergency.resolved,'공동 방어를 먼저 마쳐주세요.');check(TEAM_IDS.every(id=>completeCount(s.teams[id])===6),'모든 분대가 6개 미션을 완료해야 합니다.');s.phase='finale';s.pausedAt=null;s.deadline=null;s.announcement='마지막 기록이 도착했습니다. 벽 너머의 진실을 해독하십시오.';}
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
   }else if(action==='puzzle'){check(s.phase==='finale'&&completeCount(t)===6,'최종 작전이 아직 열리지 않았습니다.');const norm=v=>String(v??'').replace(/\s/g,'');check(['제7초소','7초소','북동쪽제7초소'].includes(norm(p.location))&&['구조요청','구조신호'].includes(norm(p.signal))&&norm(p.count)==='24','기록들을 다시 연결해 보세요. 세 항목을 모두 해독해야 합니다.');t.puzzle=true;
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
