import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {rehearsalSnapshot} from '../lib/rehearsal.mjs';

async function browserClient(){
 const source=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
 const boot=source.lastIndexOf('if(captainEntry){login();}else{');
 assert.ok(boot>0,'Browser bootstrap must be isolated from the test');
 const requests=[];
 const context=vm.createContext({
  URLSearchParams,location:{hash:'',search:''},history:{replaceState(){}},
  document:{querySelector:s=>s==='#app'?{addEventListener(){}}:null,querySelectorAll:()=>[],addEventListener(){}},
  window:{addEventListener(){}},setInterval(){},clearTimeout(){},setTimeout(){},
  fetch:async (_url,options)=>{
   const body=JSON.parse(options.body);requests.push(body);
   return {ok:true,json:async()=>rehearsalSnapshot(body.payload)};
  },renderBusy:[]
 });
 vm.runInContext(source.slice(0,boot),context);
 vm.runInContext('render=()=>renderBusy.push(busy)',context);
 return {context,requests};
}

test('rehearsal blocks every live write at the client request boundary, including announcement forms',async()=>{
 const {context,requests}=await browserClient();
 vm.runInContext('rehearsalActive=true',context);
 for(const action of ['announce','reset','submit','puzzle','puzzle-approve','login','logout']){
  await assert.rejects(vm.runInContext(`api(${JSON.stringify(action)},{message:'rehearsal only'})`,context),/리허설/);
 }
 assert.equal(requests.length,0,'No production request may leave the browser');
 await vm.runInContext("api('rehearsal',{stage:8,role:'leader',team:'A'})",context);
 assert.deepEqual(requests.map(r=>r.action),['rehearsal']);
});

test('rehearsal finishes rendering after clearing busy so approval and ending controls are usable',async()=>{
 const {context,requests}=await browserClient();
 await vm.runInContext("rehearsal(8,'leader','A')",context);
 assert.equal(requests[0].action,'rehearsal');
 assert.equal(vm.runInContext('rehearsalActive',context),true);
 assert.equal(context.renderBusy.at(-1),false);
});
