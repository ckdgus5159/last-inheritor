import {spawnSync} from 'node:child_process';
for(const name of ['game','api','qr','operations']){const r=spawnSync(process.execPath,[`tests/${name}.test.mjs`],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);}
