import {createHmac,timingSafeEqual} from 'node:crypto';
import {TEAM_IDS,GameError} from './game.mjs';
export function captainToken(team,secret=process.env.SESSION_SECRET){
 if(!TEAM_IDS.includes(team)||!secret)throw new Error('Invalid captain link configuration');
 return createHmac('sha256',secret).update('captain-link:v1:'+team).digest('base64url');
}
const equal=(a,b)=>{const x=Buffer.from(String(a??'')),y=Buffer.from(String(b??''));return x.length===y.length&&timingSafeEqual(x,y);};
export function authorizeEntry(payload,codes,secret=process.env.SESSION_SECRET){
 if(!payload||typeof payload!=='object')throw new GameError('입장 정보를 확인해주세요.',400);
 const {role,team}=payload;
 if(role==='admin'){
  if(!codes.admin||!equal(codes.admin,String(payload.code??'').trim()))throw new GameError('관리자 코드를 다시 확인해주세요.',401);
  return {role:'admin',team:null};
 }
 if(!TEAM_IDS.includes(team))throw new GameError('소속 분대를 선택해주세요.',400);
 if(role==='observer')return {role:'observer',team};
 if(role==='leader'&&typeof payload.token==='string'&&payload.token.length===43&&equal(captainToken(team,secret),payload.token))return {role:'leader',team};
 throw new GameError('올바른 분대장 전용 링크로 접속해주세요.',401);
}
