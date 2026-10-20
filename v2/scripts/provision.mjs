import {randomBytes,createHash} from 'node:crypto';import {readFile,writeFile,mkdir} from 'node:fs/promises';import {initialState} from '../lib/game.mjs';
const out=process.argv[2];if(!out)throw Error('저장소 밖의 비공개 출력 디렉터리를 지정하세요.');await mkdir(out,{recursive:true,mode:0o700});const secret=randomBytes(32).toString('hex');
const env={FIELDOPS_DB_SECRET:secret,FIELDOPS_SESSION_SECRET:randomBytes(32).toString('hex'),FIELDOPS_ADMIN_CODE:randomBytes(12).toString('base64url')};
const sql=(await readFile(new URL('../database/schema.sql',import.meta.url),'utf8')).replaceAll('__DB_SECRET_HASH__',createHash('sha256').update(secret).digest('hex')).replaceAll('__LIVE_STATE__',JSON.stringify(initialState()).replaceAll("'","''")).replaceAll('__REHEARSAL_STATE__',JSON.stringify(initialState()).replaceAll("'","''"));
await writeFile(out+'/provision.sql',sql,{mode:0o600});await writeFile(out+'/secrets.json',JSON.stringify(env),{mode:0o600});console.log('비공개 설치 파일 생성 완료. 기존 환경에는 실행하지 마세요.');
