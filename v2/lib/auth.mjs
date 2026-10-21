import {createHmac,timingSafeEqual,randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';import {TEAMS,RuleError,transition} from './game.mjs';
export const safeEqual=(a,b)=>{const x=Buffer.from(String(a??'')),y=Buffer.from(String(b??''));return x.length===y.length&&timingSafeEqual(x,y);};
const codeAlphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function captainCode(team,generation,epoch,secret){const bytes=createHmac('sha256',secret).update(`fieldops-v2:captain-code:${epoch}:${team}:${generation}`).digest();const code=[...bytes.subarray(0,10)].map(n=>codeAlphabet[n&31]).join('');return code.slice(0,5)+'-'+code.slice(5);}
export const normalizeCode=v=>typeof v==='string'?v.replace(/[\s-]/g,'').toUpperCase():'';
const credentialKey=secret=>createHmac('sha256',secret).update('fieldops-v2:captain-credential-key').digest();
const credentialContext=(state,team)=>Buffer.from(`${state.epoch}:${team}:${state.teams[team].generation}`);
export function sealCaptainCode(code,state,team,secret){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',credentialKey(secret),iv);cipher.setAAD(credentialContext(state,team));const encrypted=Buffer.concat([cipher.update(code,'utf8'),cipher.final()]);return [iv,cipher.getAuthTag(),encrypted].map(v=>v.toString('base64url')).join('.');}
export function currentCaptainCode(state,team,secret){const t=state.teams[team];if(!t.captainCredential)return captainCode(team,t.generation,state.epoch,secret);const [iv,tag,data]=t.captainCredential.split('.').map(v=>Buffer.from(v,'base64url'));const decipher=createDecipheriv('aes-256-gcm',credentialKey(secret),iv);decipher.setAAD(credentialContext(state,team));decipher.setAuthTag(tag);return Buffer.concat([decipher.update(data),decipher.final()]).toString('utf8');}
export function setCaptainCode(state,actor,p,secret,adminCode,now){
 if(actor.role!=='admin')throw new RuleError('관리자 전용입니다.',403);
 if(!TEAMS.includes(p.team))throw new RuleError('분대를 확인하세요.',400);
 if(p.epoch!==state.epoch||p.generation!==state.teams[p.team].generation)throw new RuleError('코드가 변경되었습니다. 최신 코드를 확인한 뒤 다시 저장하세요.');
 const code=normalizeCode(p.code);if(typeof p.code!=='string'||p.code.length>64||!/^[A-Z0-9]{4,20}$/.test(code))throw new RuleError('코드는 영문·숫자 4~20자로 입력하세요.',400);
 if(safeEqual(code,normalizeCode(adminCode)))throw new RuleError('관리자 코드와 다른 코드를 입력하세요.',400);
 if(TEAMS.some(team=>team!==p.team&&safeEqual(code,normalizeCode(currentCaptainCode(state,team,secret)))))throw new RuleError('다른 분대와 다른 코드를 입력하세요.',400);
 if(safeEqual(code,normalizeCode(currentCaptainCode(state,p.team,secret))))return state;
 const next=transition(state,actor,'setCaptainCode',{team:p.team},now);next.teams[p.team].captainCredential=sealCaptainCode(code,next,p.team,secret);return next;
}
export function encodeSession(actor,secret){const data=Buffer.from(JSON.stringify({...actor,exp:Date.now()+43200000})).toString('base64url');return data+'.'+createHmac('sha256',secret).update(data).digest('base64url');}
export function decodeSession(cookie,secret){try{const raw=String(cookie??'').split(';').map(v=>v.trim()).find(v=>v.startsWith('fieldops_v2='))?.slice(12);if(!raw)return null;const [data,sig]=raw.split('.');if(!safeEqual(sig,createHmac('sha256',secret).update(data).digest('base64url')))return null;const a=JSON.parse(Buffer.from(data,'base64url'));if(a.exp<Date.now()||!Number.isFinite(a.exp)||!['admin','captain','member'].includes(a.role)||!a.sid)return null;if(a.role!=='admin'&&!TEAMS.includes(a.team))return null;return a;}catch{return null;}}
export function entry(p,state,c,old){if(p.role==='admin'){if(!safeEqual(p.code,c.admin))throw new RuleError('관리자 코드를 확인하세요.',401);return {role:'admin',team:null,sid:randomBytes(24).toString('hex')};}if(!TEAMS.includes(p.team))throw new RuleError('분대를 선택하세요.',400);if(p.role==='member')return {role:'member',team:p.team,sid:randomBytes(24).toString('hex')};const t=state.teams[p.team],code=normalizeCode(p.code);if(p.role!=='captain'||!code||!safeEqual(code,normalizeCode(currentCaptainCode(state,p.team,c.secret))))throw new RuleError('선택한 분대의 분대장 코드를 확인하세요.',401);return {role:'captain',team:p.team,generation:t.generation,sid:old?.role==='captain'&&old.team===p.team&&old.generation===t.generation&&old.sid===t.leader?old.sid:randomBytes(24).toString('hex')};}
