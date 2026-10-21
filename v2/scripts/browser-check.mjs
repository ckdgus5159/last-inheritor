import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHandler} from '../api/ops.js';
import {memoryStore,atomic} from '../lib/store.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
const root=new URL('../public/',import.meta.url),store=memoryStore();
const handler=createHandler(store,{secret:'browser-test-secret',admin:'browser-admin',femaleRule:'operator-only'}),errors=[];
await mkdir('test-results',{recursive:true});
async function newPage(width=390,height=844){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
 await context.route('https://ops.test/**',async route=>{
  const req=route.request(),u=new URL(req.url());
  if(u.pathname==='/api/ops'){
   let status=200,body,headers={'Content-Type':'application/json'};
   await handler({method:req.method(),url:u.pathname+u.search,headers:{...await req.allHeaders(),host:'ops.test'},body:req.postData()||'{}'},{setHeader(k,v){headers[k]=v;},status(n){status=n;return this;},json(v){body=v;}});
   await route.fulfill({status,headers,body:JSON.stringify(body)});return;
  }
  try{const file=u.pathname==='/'?'index.html':u.pathname.slice(1),ext=path.extname(file);await route.fulfill({body:await readFile(new URL(file,root)),contentType:({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json','.svg':'image/svg+xml'})[ext]||'text/plain'});}catch{await route.fulfill({status:404,body:'Not found'});}
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);return page;
}
async function post(page,action,payload={},extra={}){
 return page.evaluate(async({action,payload,extra})=>{const r=await fetch('/api/ops',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,payload,...extra})});const data=await r.json();if(!r.ok)throw Error(data.error);return data;},{action,payload,extra});
}
async function clearCelebration(page){await page.waitForFunction(()=>!document.querySelector('#celebration')?.textContent);}
async function dismissBonus(page){if(await page.locator('#bonus-alert').evaluate(el=>el.open))await page.locator('#dismiss-bonus').click();}
async function noOverflow(page,label){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,label+' horizontal overflow');}
const page=await newPage();
try{
 await page.goto('https://ops.test/');
 const loaded=await page.evaluate(async()=>{const {SCENES}=await import('/scenes.mjs');return Promise.all(SCENES.map(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img.naturalWidth>0);img.onerror=()=>resolve(false);img.src=src;})));});
 const fontStatus=await page.evaluate(async()=>{const samples=[['400 32px "Field Ops Display"','조사병단의 사명!!! 너의 심장을 바쳐라'],['400 14px "Field Ops Text"','분대에 합류하기'],['400 14px "Field Ops Text"','힣'],['700 32px "Field Ops Score"','0123456789:.-+']];return Promise.all(samples.map(async([font,text])=>{const faces=await document.fonts.load(font,text);return faces.length>0&&faces.every(f=>f.status==='loaded');}));});assert.ok(fontStatus.every(Boolean),'self-hosted display, body, extended Korean and score fonts load');assert.ok(await page.locator('.login-story h1').evaluate(el=>getComputedStyle(el).fontFamily.includes('Field Ops Display')));assert.ok((await page.locator('.login-motto').innerText()).includes('조사병단의 사명!!!'));assert.ok((await page.locator('.login-motto').innerText()).includes('너의 심장을 바쳐라'));
 assert.equal(loaded.length,12);assert.ok(loaded.every(Boolean),'12 anime scenes load');
 for(const width of [360,390,768,1440,1890]){
  await page.setViewportSize({width,height:width>1000?921:844});await noOverflow(page,'login '+width);
  const g=await page.evaluate(()=>{const b=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,width:r.width,right:r.right};};return {role:b('#role'),label:b('label[for=role]'),team:b('#team'),button:b('#login button[type=submit]')};});
  for(const k of ['label','team','button']){assert.ok(Math.abs(g[k].x-g.role.x)<1,`${width}: ${k} aligned`);assert.ok(Math.abs(g[k].width-g.role.width)<1,`${width}: ${k} same width`);}
  if(width>720)assert.ok(g.button.width<=370,'desktop form is contained');
  await page.locator('#role').selectOption('admin');assert.equal(await page.locator('#team').isDisabled(),true);await page.locator('#code').fill('browser-admin');await page.locator('#role').selectOption('member');
  if([390,1890].includes(width))await page.screenshot({path:`test-results/login-${width}.png`,fullPage:true});
 }
 assert.equal(await page.locator('.login h1').textContent(),'심장을 바쳐라');assert.ok((await page.title()).includes('신조 44게오'));
 assert.equal(await page.getByText(/READY TO SORTIE|OPERATION HEADQUARTERS|소리 없이 즐기는/).count(),0);
 await page.setViewportSize({width:390,height:844});await page.locator('#role').selectOption('admin');await page.locator('#code').fill('browser-admin');await page.locator('button[type=submit]').click();await page.locator('[data-tab="admin"]').waitFor();
 await page.getByRole('button',{name:'독립 리허설 열기',exact:true}).click();await page.getByText('● 리허설 · 실제 점수와 별도').waitFor();await page.getByRole('button',{name:'작전 개시',exact:true}).click();
 await page.locator('#preview').selectOption('captain:A');await page.locator('[data-tab="titans"]').click();
 assert.equal(await page.locator('[data-tab="collection"]').count(),0);assert.equal(await page.locator('.inherited-ability').count(),6);assert.equal(await page.getByText(/준비물 ·|분대장 보고 후 본부가/).count(),0);
 await page.locator('.titan-cards').getByRole('button',{name:'미션 완료 보고',exact:true}).click();await page.getByRole('button',{name:'완료 보고 접수됨'}).waitFor();
 await page.locator('#preview').selectOption('');await page.locator('[data-tab="admin"]').click();await page.locator('.admin-card').first().getByRole('button',{name:'10점 승인',exact:true}).click();await page.locator('.admin-card').first().getByRole('button',{name:'보너스미션 지급',exact:true}).click();
 await page.locator('#preview').selectOption('captain:A');await page.locator('#bonus-alert[open]').waitFor();await page.locator('#dismiss-bonus').click();
 await page.locator('[data-tab="supply"]').click();await page.getByRole('button',{name:'가상 QR 스캔 시험'}).click();await page.waitForFunction(()=>document.querySelector('.qr-feedback')?.textContent.includes('보급품을 확보했습니다'));assert.equal(await page.getByRole('button',{name:'보급품 확보',exact:true}).count(),0);
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:1000});
  for(const tab of ['dashboard','titans','supply','results']){await page.locator(`[data-tab="${tab}"]`).click();await noOverflow(page,width+' '+tab);if(tab==='results'){assert.equal(await page.getByRole('heading',{name:'백마부대 점수 상세',exact:true}).count(),1);assert.equal(await page.getByText(/추가 = min/).count(),0);}if(tab==='supply')assert.equal(await page.getByText('공원 곳곳의 보급품을 찾아라! 확보(스캔)는 분대장 기기에서 가능해요.',{exact:true}).count(),1);}
 }
 await page.locator('[data-tab="dashboard"]').click();await clearCelebration(page);
 assert.equal(await page.locator('.dashboard-stats .stat').count(),3);assert.equal(await page.locator('.sector-tile.undefeated').count(),5);
 assert.equal(await page.locator('.sector-tile.undefeated .scene-image').first().evaluate(el=>getComputedStyle(el).filter),'grayscale(1)');
 assert.equal(await page.locator('.sector-tile.done .scene-image').evaluate(el=>getComputedStyle(el).filter),'none');
 assert.ok(await page.evaluate(()=>document.querySelector('.headquarters').getBoundingClientRect().top<document.querySelector('.scene-banner').getBoundingClientRect().top));
 assert.equal(await page.locator('.bonus-dispatch').count(),1);
 await page.screenshot({path:'test-results/dashboard-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/dashboard-mobile.png',fullPage:true});
 await page.locator('[data-tab="titans"]').click();await page.screenshot({path:'test-results/titans-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.locator('#preview').selectOption('');await page.locator('[data-tab="admin"]').click();await page.locator('#qr-admin>summary').click();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'QR 카드 HTML 내려받기'}).click();const download=await downloadPromise;await download.saveAs('test-results/qr-cards.html');assert.equal((await readFile('test-results/qr-cards.html','utf8')).split('<article').length-1,12);
 await page.screenshot({path:'test-results/admin-desktop.png',fullPage:true});
 const before=(await store.read('live')).data;assert.equal(before.phase,'lobby');assert.equal(before.qr.filter(q=>q.claim).length,0);
 for(const kind of ['timer','tap']){
  await atomic(store,'rehearsal',s=>{s.teams.A.bonuses[1]={id:'test-'+kind,kind,name:kind,instructions:'브라우저 검증',status:'issued',points:0,penalty:0};return s;});
  await page.locator('#preview').selectOption('captain:A');await page.locator('#bonus-alert[open]').waitFor();await page.locator('#open-bonus').click();
  await page.getByRole('button',{name:'한 번의 도전 시작!'}).click();await page.locator('[data-tab=dashboard]').click();await page.locator('[data-tab=supply]').click();await page.locator('[data-ui=miniact]').waitFor();if(kind==='tap'){assert.equal((await store.read('rehearsal')).data.teams.A.bonuses[1].durationMs,10000);assert.equal(await page.getByRole('heading',{name:'10초 연타',exact:true}).count(),1);}
  if(kind==='timer'){await page.waitForTimeout(10000);await page.getByRole('button',{name:'지금 멈추기'}).click();}
  else {for(let i=0;i<36;i++){await page.getByRole('button',{name:'빠르게 터치!'}).click();await page.waitForTimeout(40);}await page.waitForTimeout(10000);}
  await page.getByText('측정 결과',{exact:false}).waitFor();assert.ok(['success','failed'].includes((await store.read('rehearsal')).data.teams.A.bonuses[1].status));await page.locator('#preview').selectOption('');
 }
 assert.deepEqual((await store.read('live')).data,before,'rehearsal leaves live unchanged');
 // Separate authenticated browser sessions verify delivery to the whole squad, including late arrivals.
 const memberA=await newPage(),memberB=await newPage(),captainA=await newPage(1440,1000);
 for(const [p,team] of [[memberA,'A'],[memberB,'B']]){await p.goto('https://ops.test/');await p.locator('#team').selectOption(team);await p.locator('button[type=submit]').click();await p.locator('[data-tab="dashboard"]').waitFor();}
 const {codes}=await post(page,'captainCodes');const c=codes.find(c=>c.team==='A');await captainA.goto('https://ops.test/');await captainA.locator('#role').selectOption('captain');await captainA.locator('#team').selectOption('A');await captainA.locator('#code').fill(c.code);await captainA.locator('button[type=submit]').click();await captainA.locator('[data-tab="dashboard"]').waitFor();
 await post(page,'start');await post(captainA,'report');await post(page,'approve',{team:'A',score:10});await post(page,'issueBonus',{team:'A'});
 for(const p of [memberA,captainA]){await p.locator('#bonus-alert[open]').waitFor();await p.locator('#dismiss-bonus').click();await p.locator('.bonus-dispatch').waitFor();}
 assert.equal(await memberB.locator('#bonus-alert').evaluate(el=>el.open),false,'other squad has no popup');assert.equal(await memberB.locator('.bonus-dispatch').count(),0);
 await memberA.reload();await memberA.locator('.bonus-dispatch').waitFor();assert.equal(await memberA.locator('#bonus-alert').evaluate(el=>el.open),false,'acknowledged popup stays dismissed after reload');
 const lateA=await newPage();await lateA.goto('https://ops.test/');await lateA.locator('button[type=submit]').click();await lateA.locator('#bonus-alert[open]').waitFor();
 await lateA.screenshot({path:'test-results/bonus-popup-mobile.png',fullPage:true});await lateA.keyboard.press('Escape');await lateA.locator('[data-tab="supply"]').click();assert.equal(await lateA.getByRole('button',{name:'한 번의 도전 시작!'}).count(),0,'member cannot start a minigame');
 await atomic(store,'live',s=>{s.clock.end=Date.now()-1;return s;});await memberA.waitForFunction(()=>!document.querySelector('.bonus-dispatch'));assert.equal(await memberA.locator('#bonus-alert').evaluate(el=>el.open),false);
 assert.deepEqual(errors,[]);console.log('PASS browser: login 360/390/768/1440/1890 alignment; 4 menus PC/mobile; merged collection and grayscale; top HQ; squad-wide bonus popup, persistence, isolation, expiry; report/approval, QR/12 cards, timer/tap, rehearsal isolation; no JS errors');
}catch(e){await page.screenshot({path:'test-results/failure.png',fullPage:true});console.error('BROWSER:',errors);throw e;}finally{await browser.close();}
