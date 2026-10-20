import {createHmac,randomBytes,timingSafeEqual,createHash} from 'node:crypto';
import {gateway,updateState} from '../lib/db.mjs';
import {GameError,transition,projectState,TEAM_IDS} from '../lib/game.mjs';
import {authorizeEntry} from '../lib/access.mjs';
import {rehearsalSnapshot} from '../lib/rehearsal.mjs';
const equal=(a,b)=>{const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y);};
const signature=v=>createHmac('sha256',process.env.SESSION_SECRET).update(v).digest('base64url');
export function encodeSession(actor){const data=Buffer.from(JSON.stringify({...actor,exp:Date.now()+43200000})).toString('base64url');return `${data}.${signature(data)}`;}
export function decodeSession(cookie){try{const token=String(cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('inheritor='))?.slice(10);if(!token)return null;const [v,sig]=token.split('.');if(!sig||!equal(signature(v),sig))return null;const a=JSON.parse(Buffer.from(v,'base64url'));if(!a.exp||a.exp<Date.now())return null;if(a.role!=='admin'&&(!TEAM_IDS.includes(a.team)||!['leader','observer'].includes(a.role)))return null;return a;}catch{return null;}}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');
 const send=(status,body)=>res.status(status).json(body);
 try{
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return send(405,{error:'지원하지 않는 요청입니다.'});}
  const required=['SESSION_SECRET','DB_GATEWAY_SECRET','SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','GAME_CODES_JSON'];if(required.some(k=>!process.env[k]))return send(503,{error:'본부 연결 설정을 준비하고 있습니다.'});
  let actor=decodeSession(req.headers.cookie);
  if(req.method==='GET'){if(!actor)return send(401,{error:'소속 분대를 선택해 입장해주세요.'});const row=await gateway('read');return send(200,projectState(row.data,actor));}
  // Reject cross-site form/JSON writes; credentials never travel in query strings.
  const origin=req.headers.origin;const host=req.headers['x-forwarded-host']||req.headers.host;
  if(origin&&new URL(origin).host!==host)return send(403,{error:'이 사이트에서 직접 요청해주세요.'});
  if(!String(req.headers['content-type']||'').includes('application/json'))return send(415,{error:'JSON 요청이 필요합니다.'});
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!body||JSON.stringify(body).length>4096)return send(400,{error:'요청을 확인해주세요.'});
  const {action,payload={}}=body;
  if(!payload||typeof payload!=='object'||Array.isArray(payload))return send(400,{error:'요청 정보를 확인해주세요.'});
  if(action==='logout'){res.setHeader('Set-Cookie','inheritor=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0; Secure');return send(200,{ok:true});}
  if(action==='login'){
   const ip=String(req.headers['x-forwarded-for']||'local').split(',')[0].trim();const bucket=createHmac('sha256',process.env.SESSION_SECRET).update(ip).digest('hex');
   const limited=await gateway('limit',{bucket,maximum:60});if(!limited.allowed)return send(429,{error:'입장 시도가 많습니다. 5분 후 다시 시도하세요.'});
   const entry=authorizeEntry(payload,JSON.parse(process.env.GAME_CODES_JSON));
   if(entry.role==='leader'&&actor?.role==='leader'&&actor.team===entry.team){
    const row=await gateway('read');
    if(row.data.teams[entry.team].leader===actor.sid)return send(200,projectState(row.data,actor));
   }
   actor={...entry,sid:randomBytes(24).toString('hex')};
   if(entry.role==='leader')await updateState(s=>transition(s,actor,'claim'));
   res.setHeader('Set-Cookie',`inheritor=${encodeSession(actor)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200${process.env.LOCAL_DEV?'':'; Secure'}`);
   const row=await gateway('read');return send(200,projectState(row.data,actor));
  }
  if(!actor)return send(401,{error:'다시 입장해주세요.'});
  const bucket=createHash('sha256').update(actor.sid).digest('hex');const limit=await gateway('limit',{bucket,maximum:100});if(!limit.allowed)return send(429,{error:'요청이 많습니다. 잠시 후 다시 시도하세요.'});
  if(action==='backup'){
   if(actor.role!=='admin')throw new GameError('본부 관리자만 백업할 수 있습니다.',403);
   const row=await gateway('read');return send(200,{format:'last-inheritor-backup-v1',exportedAt:new Date().toISOString(),version:row.version,data:row.data});
  }
  if(action==='rehearsal'){
   if(actor.role!=='admin')throw new GameError('리허설은 본부 관리자만 실행할 수 있습니다.',403);
   const {stage=0,team='A',role='leader'}=payload;
   if(!Number.isInteger(stage)||stage<0||stage>11||!TEAM_IDS.includes(team)||!['admin','leader','observer'].includes(role))throw new GameError('리허설 단계를 확인하세요.');
   return send(200,rehearsalSnapshot({stage,team,role}));
  }
  const state=await updateState((s,version)=>{
   if(action==='reset'){
    if(actor.role!=='admin')throw new GameError('본부 관리자만 초기화할 수 있습니다.',403);
    if(!Number.isInteger(payload.expectedVersion)||payload.expectedVersion!==version)throw new GameError('백업 후 게임 상태가 변경되었습니다. 다시 백업하고 초기화해주세요.',409);
   }
   return transition(s,actor,action,payload);
  });return send(200,projectState(state,actor));
 }catch(e){return send(e.status|| (e instanceof SyntaxError?400:503),{error:e instanceof GameError||e.status?e.message:'본부와의 통신이 지연되고 있습니다. 다시 시도해주세요.'});}
}
