// 별도 V2 URL에서만 실행. 모든 게임 변경은 리허설에 한정한다.
import assert from 'node:assert/strict';
const base=process.env.FIELDOPS_TEST_URL,code=process.env.FIELDOPS_TEST_ADMIN;if(!base||!new URL(base).hostname.startsWith('last-inheritor-v2'))throw Error('V2 전용 URL과 관리자 테스트 환경변수가 필요합니다.');let cookie='';
async function call(action,payload={},preview='',expect=200){const r=await fetch(base+'/api/ops',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,...(cookie?{Cookie:cookie}:{})},body:JSON.stringify({action,payload,rehearsal:action!=='login',preview})});const data=await r.json();assert.equal(r.status,expect,action+' '+(data.error||''));if(action==='login')cookie=r.headers.get('set-cookie').split(';')[0];return data;}
async function get(rehearsal){const r=await fetch(base+'/api/ops'+(rehearsal?'?rehearsal=1':''),{headers:{Cookie:cookie}});assert.equal(r.status,200);return r.json();}
const fingerprint=x=>JSON.stringify(Object.fromEntries(Object.entries(x).filter(([k])=>!['serverNow','version','mode'].includes(k))));
await call('login',{role:'admin',code});const before=fingerprint(await get(false));let backup=await call('backup');await call('reset',{confirm:'V2 초기화',expectedVersion:backup.version});await call('start');
let s=await get(true),qr=s.qr[6];
const parallel=await Promise.all(['A','B'].map(async team=>{const r=await fetch(base+'/api/ops',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,Cookie:cookie},body:JSON.stringify({action:'qrClaim',payload:{token:qr.token},rehearsal:true,preview:'captain:'+team})});return r.status;}));assert.deepEqual(parallel.sort(),[200,409]);
s=await get(true);while(s.qr.filter(q=>q.claim?.team==='A').length<4){const q=s.qr.find(q=>q.enabled&&!q.claim);await call('qrClaim',{token:q.token},'captain:A');s=await get(true);}const unclaimed=s.qr.find(q=>!q.claim);await call('qrClaim',{token:unclaimed.token},'captain:A',409);assert.equal((await get(true)).qr.find(q=>q.id===unclaimed.id).claim,null);
for(let round=1;round<=6;round++){
 for(const team of ['A','B','C','D']){await call('report',{},'captain:'+team);await call('approve',{team,score:10});await call('issueBonus',{team});}
 s=await get(true);
 const web=[];for(const team of ['A','B','C','D']){const b=s.teams[team].bonuses[round];if(['timer','tap'].includes(b.kind)){const x=await call('bonusStart',{},'captain:'+team);web.push({team,b:x.teams[team].bonuses[round]});}else if(b.kind==='roulette')await call('roulette',{team});else await call('fieldResult',{team,success:true});}
 if(web.length)await new Promise(r=>setTimeout(r,10100));for(const {team,b} of web)await call('bonusSubmit',{attempt:b.attempt,...(b.kind==='timer'?{elapsed:10000}:{taps:Array.from({length:35},(_,i)=>i*250)})},'captain:'+team);
 await call('endRound');if(round===3){await call('bossStart');for(const team of ['A','B','C','D'])await call('bossApprove',{team});assert.equal((await get(true)).boss.hp,0);}if(round<6)await call('nextRound');
}
await call('endGame');s=await call('publish');for(const t of s.ranking){assert.equal(t.base,60);assert.ok(t.total<=80&&t.extra<=20);}assert.equal(s.medals.length,4);assert.equal(fingerprint(await get(false)),before);
backup=await call('backup');await call('reset',{confirm:'V2 초기화',expectedVersion:backup.version});assert.equal(fingerprint(await get(false)),before);console.log('PASS deployed: real auth/API/Supabase, concurrent QR winner, 4-item limit, six rounds/all bonus kinds, boss HP, final scores, reset, live-data unchanged');
