import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHandler} from '../api/ops.js';
import {memoryStore,atomic} from '../lib/store.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({args:['--no-sandbox']});
const store=memoryStore(),handler=createHandler(store,{secret:'admin-check-secret',admin:'check-admin',femaleRule:'운영진 전용 안내'}),errors=[];
let staleGate=null,writeGate=null,failNext=false,writeCount=0;
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
const ctx=await browser.newContext({viewport:{width:900,height:1000},reducedMotion:'reduce'});
await ctx.route('https://admin.test/**',async route=>{
 const req=route.request(),url=new URL(req.url());
 if(url.pathname==='/api/ops'){
  const input=req.postData()?JSON.parse(req.postData()):{};
  if(req.method()==='POST'&&input.action==='qrEdit'){writeCount++;if(failNext){failNext=false;return route.fulfill({status:503,contentType:'text/html',body:'Service unavailable'});}}
  let status=200,body,headers={'Content-Type':'application/json'};
  await handler({method:req.method(),url:url.pathname+url.search,headers:{...await req.allHeaders(),host:'admin.test'},body:input},{setHeader(k,v){headers[k]=v;},status(n){status=n;return this;},json(v){body=v;}});
  if(req.method()==='GET'&&staleGate){const gate=staleGate;staleGate=null;gate.seen.resolve();await gate.release.promise;}
  if(req.method()==='POST'&&input.action==='qrEdit'&&writeGate){const gate=writeGate;writeGate=null;gate.seen.resolve();await gate.release.promise;}
  return route.fulfill({status,headers,body:JSON.stringify(body)});
 }
 try{const file=url.pathname==='/'?'index.html':url.pathname.slice(1);await route.fulfill({body:await readFile(new URL('../public/'+file,import.meta.url)),contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg'})[path.extname(file)]||'text/plain'});}catch{await route.fulfill({status:404,body:'Not found'});}
});
const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);await mkdir('test-results',{recursive:true});
async function idle(){await page.waitForFunction(()=>document.querySelector('.main')?.getAttribute('aria-busy')==='false');}
async function click(selector){await page.locator(selector).click();await idle();}
async function post(action,payload={},extra={}){return page.evaluate(async({action,payload,extra})=>{const r=await fetch('/api/ops',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,payload,...extra})});const body=await r.json();if(!r.ok)throw Error(body.error);return body;},{action,payload,extra});}
async function changed(){await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.waitForTimeout(100);}
async function open(id){if(!await page.locator('#'+id).evaluate(e=>e.open))await page.locator('#'+id+'>summary').click();}
try{
 await page.goto('https://admin.test/');await page.locator('#role').selectOption('admin');await page.locator('#code').fill('check-admin');await page.locator('#login button').click();await page.locator('.admin-console').waitFor();await idle();await page.evaluate(()=>document.fonts.ready);
 for(const width of [360,390,768,900,1440,1890]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'admin overflow '+width);const buttons=await page.locator('.scorebuttons .btn').evaluateAll(els=>els.map(e=>({h:e.getBoundingClientRect().height,w:e.clientWidth,content:e.scrollWidth,wrap:getComputedStyle(e).whiteSpace})));assert.ok(buttons.every(x=>x.h<=50&&x.w>=x.content&&x.wrap==='nowrap'),'approval buttons fit '+width);if([390,900,1440].includes(width))await page.screenshot({path:'test-results/admin-'+width+'.png',fullPage:true});}
 await page.setViewportSize({width:900,height:1000});await click('[data-ui=jumpqr]');assert.equal(await page.locator('#qr-admin').evaluate(e=>e.open),true);
 await page.locator('#loc-Q02').fill('작성 중인 위치');await open('settings-panel');await page.locator('#roundSeconds').fill('480');await page.locator('[name=criterion-cart-10]').fill('현장에서 합의한 판정');await page.locator('#announcement').fill('작성 중인 본부 지령');await page.locator('[name=urgent]').check();
 await page.locator('#qr-panel').scrollIntoViewIfNeeded();const scrollBefore=await page.evaluate(()=>scrollY);
 for(let i=1;i<=12;i++){await click('#qr-admin [aria-label="Q'+String(i).padStart(2,'0')+' 사용 설정"]');assert.equal(await page.locator('#qr-admin').evaluate(e=>e.open),true);}
 assert.ok((await store.read('live')).data.qr.every(q=>!q.enabled));assert.equal(await page.locator('#loc-Q02').inputValue(),'작성 중인 위치');assert.equal(await page.locator('#roundSeconds').inputValue(),'480');assert.equal(await page.locator('[name=criterion-cart-10]').inputValue(),'현장에서 합의한 판정');assert.equal(await page.locator('#announcement').inputValue(),'작성 중인 본부 지령');assert.equal(await page.locator('[name=urgent]').isChecked(),true);assert.equal(await page.locator('#settings-panel').evaluate(e=>e.open),true);
 await page.getByRole('button',{name:'전체 활성화',exact:true}).click();await idle();
 assert.ok((await store.read('live')).data.qr.every(q=>q.enabled));
 await page.locator('#loc-Q01').fill('중앙 부스');await page.locator('.qr-admin-row').first().getByRole('button',{name:'위치 저장'}).click();await idle();assert.equal((await store.read('live')).data.qr[0].location,'중앙 부스');assert.equal(await page.locator('#loc-Q02').inputValue(),'작성 중인 위치');
 await page.locator('#settings button[type=submit]').click();await idle();assert.equal((await store.read('live')).data.config.roundSeconds,480);assert.equal(await page.locator('#settings-panel').evaluate(e=>e.open),true);
 await page.locator('#ckind').selectOption('bonus');await page.locator('#cpoints').selectOption('3');await click('#qr-admin [aria-label="Q01 사용 설정"]');assert.equal(await page.locator('#ckind').inputValue(),'bonus');assert.equal(await page.locator('#cpoints').inputValue(),'3');assert.equal(await page.locator('#cpenalty').isVisible(),true);assert.equal(await page.locator('#cqid').isVisible(),false);
 await page.locator('#announcement').focus();await page.locator('#announcement').press('End');const oldText=await page.locator('#announcement').inputValue();await post('announce',{text:'다른 운영자의 공지',urgent:false});await changed();assert.equal(await page.locator('#announcement').inputValue(),oldText);assert.equal(await page.locator('#announcement').evaluate(e=>e===document.activeElement),true);
 await page.locator('#announce button[type=submit]').click();await idle();assert.equal(await page.locator('#announcement').inputValue(),'');assert.equal(await page.locator('[name=urgent]').isChecked(),false);assert.equal(await page.locator('#loc-Q02').inputValue(),'작성 중인 위치');
 // Old in-flight polling must not roll back a newer successful write.
 const gate={seen:deferred(),release:deferred()};staleGate=gate;await changed();await gate.seen.promise;await page.getByRole('button',{name:'전체 비활성화',exact:true}).click();await idle();gate.release.resolve();await page.waitForTimeout(250);assert.equal(await page.locator('#qr-admin [role=switch][aria-checked=true]').count(),0);
 // One click in flight disables further writes; an HTML error leaves drafts intact and allows retry.
 const write={seen:deferred(),release:deferred()};writeGate=write;const n=writeCount;await page.locator('#qr-admin [aria-label="Q01 사용 설정"]').click();await write.seen.promise;assert.equal(await page.locator('#qr-admin [aria-label="Q01 사용 설정"]').isDisabled(),true);await page.locator('#qr-admin [aria-label="Q01 사용 설정"]').evaluate(e=>e.click());write.release.resolve();await idle();assert.equal(writeCount,n+1);assert.equal(await page.locator('#qr-admin').evaluate(e=>e.open),true);
 failNext=true;await click('#qr-admin [aria-label="Q02 사용 설정"]');assert.ok((await page.locator('#toast').textContent()).includes('本部')||(await page.locator('#toast').textContent()).includes('본부'));assert.equal(await page.locator('#loc-Q02').inputValue(),'작성 중인 위치');await click('#qr-admin [aria-label="Q02 사용 설정"]');assert.equal((await store.read('live')).data.qr[1].enabled,true);
 await page.locator('#announcement').fill('실운영 초안');await click('[data-ui=mode]');assert.equal(await page.locator('#announcement').inputValue(),'');assert.equal(await page.locator('#qr-admin').evaluate(e=>e.open),false);await page.locator('#announcement').fill('리허설 초안');await click('[data-ui=mode]');assert.equal(await page.locator('#announcement').inputValue(),'실운영 초안');assert.equal(await page.locator('#qr-admin').evaluate(e=>e.open),true);await click('[data-ui=mode]');assert.equal(await page.locator('#announcement').inputValue(),'리허설 초안');
 const liveBefore=(await store.read('live')).data;await page.locator('.command-controls').getByRole('button',{name:'작전 개시',exact:true}).click();await idle();
 for(let round=1;round<=6;round++){
  for(const team of ['A','B','C','D'])await post('report',{}, {rehearsal:true,preview:'captain:'+team});await changed();await page.waitForFunction(()=>[...document.querySelectorAll('.scorebuttons [data-action=approve]')].filter(e=>!e.disabled).length===12);
  for(const team of ['A','B','C','D']){await page.locator('#admin-team-'+team).getByRole('button',{name:'10점 승인',exact:true}).click();await idle();}
  if(round===1){await page.locator('#admin-team-A').getByRole('button',{name:'보너스미션 지급'}).click();await idle();await atomic(store,'rehearsal',s=>{s.teams.A.bonuses[1]={id:'admin-photo',kind:'photo',name:'단체사진',instructions:'함께 경례',status:'issued',points:0,penalty:0};return s;});await changed();await page.locator('#admin-team-A').getByRole('button',{name:'성공 +3'}).click();await idle();assert.equal((await store.read('rehearsal')).data.teams.A.bonuses[1].points,3);}
  await page.locator('.command-controls').getByRole('button',{name:'현재 라운드 종료',exact:true}).click();await idle();
  if(round===3){await page.locator('.command-controls').getByRole('button',{name:'초대형 거인 출현',exact:true}).click();await idle();for(const team of ['A','B','C','D']){await page.locator('.boss-approvals').getByRole('button',{name:({A:'백마부대',B:'홍마부대',C:'흑마부대',D:'청황마부대'})[team]+' 성공',exact:true}).click();await idle();}assert.equal((await store.read('rehearsal')).data.boss.approved.length,4);}
  if(round<6){await page.locator('.command-controls').getByRole('button',{name:'다음 라운드 →',exact:true}).click();await idle();}
 }
 await open('advanced-ops');page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'작전 종료',exact:true}).click();await idle();await page.locator('.command-controls').getByRole('button',{name:'최종 결과 발표',exact:true}).click();await idle();assert.equal((await store.read('rehearsal')).data.published,true);assert.deepEqual((await store.read('live')).data,liveBefore);assert.deepEqual(errors,[]);
 console.log('PASS admin: 360–1890px layout/approval buttons; 12 sequential QR toggles; bulk/save; disclosure/draft/checkbox/select/focus preservation; stale GET and double-click protection; error retry; mode isolation; six rounds, report/score/bonus/boss/publication; no JS errors');
}catch(e){await page.screenshot({path:'test-results/admin-failure.png',fullPage:true});console.error(errors);throw e;}finally{await browser.close();}
