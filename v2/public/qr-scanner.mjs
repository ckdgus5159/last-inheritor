// Decode locally; never navigate to the scanned URL or upload camera frames.
export function supplyTokenFromQR(text,origin){
 try{const url=new URL(text);if(url.origin!==origin||url.pathname!=='/'||url.username||url.password||!['https:','http:'].includes(url.protocol))return null;const params=new URLSearchParams(url.hash.slice(1)),token=params.get('supply');return params.getAll('supply').length===1&&/^[A-Za-z0-9_-]{32}$/.test(token||'')?token:null;}catch{return null;}
}
// Camera labels become available only after permission is granted.
export function preferredRearCamera(devices){return devices.filter(d=>d.kind==='videoinput'&&/back|rear|environment|후면|후방/i.test(d.label)&&!/ultra|초광각|울트라|tele|망원|front|전면|0[.,][56]/i.test(d.label)).sort((a,b)=>rearPriority(b.label)-rearPriority(a.label))[0];}
function rearPriority(label){return /main|기본|^back camera$|^후면 카메라$/i.test(label)?3:/dual|triple|fusion/i.test(label)?0:/wide/i.test(label)?2:1;}
let fallbackPromise;
async function fallbackDecoder(){
 fallbackPromise??=import('./vendor/jsqr-1.4.0.js').then(()=>{if(typeof globalThis.jsQR!=='function')throw Error('decoder');return globalThis.jsQR;}).catch(e=>{fallbackPromise=null;throw e;});
 const decode=await fallbackPromise,canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
 return async video=>{const w=video.videoWidth||video.width,h=video.videoHeight||video.height,scale=Math.min(1,640/Math.max(w,h));canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);ctx.drawImage(video,0,0,canvas.width,canvas.height);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),result=decode(pixels.data,pixels.width,pixels.height,{inversionAttempts:'attemptBoth'});return result?[result.data]:[];};
}
async function decoder(){
 try{if(globalThis.BarcodeDetector){const formats=await globalThis.BarcodeDetector.getSupportedFormats?.();if(!formats||formats.includes('qr_code')){const detector=new globalThis.BarcodeDetector({formats:['qr_code']});let fallback;return async video=>{try{return (await detector.detect(video)).map(q=>q.rawValue);}catch{fallback??=await fallbackDecoder();return fallback(video);}};}}}catch{}
 return fallbackDecoder();
}
const cameraMessage=e=>e?.name==='NotAllowedError'||e?.name==='SecurityError'?'카메라 권한이 필요합니다. 브라우저의 사이트 설정에서 카메라를 허용한 뒤 다시 열어 주세요.':e?.name==='NotFoundError'?'사용할 수 있는 카메라를 찾지 못했습니다.':e?.name==='NotReadableError'?'카메라를 사용하지 못했습니다. 다른 앱의 카메라를 닫고 다시 시도해 주세요.':'카메라를 열지 못했습니다. 연결과 카메라 권한을 확인하고 다시 시도해 주세요.';
export class SupplyScanner{
 constructor({dialog,onToken,canScan,onClose}){
  this.dialog=dialog;this.onToken=onToken;this.canScan=canScan;this.onClose=onClose;this.run=0;this.stream=null;this.busy=false;
  dialog.innerHTML='<div class="scanner-head"><div><small>보급품 수색</small><h2 id="qr-scanner-title">QR 스캔</h2></div><button class="btn light small" type="button" id="close-scanner" aria-label="QR 스캔 닫기">닫기</button></div><div class="scanner-viewport"><video id="qr-video" autoplay muted playsinline aria-label="보급품 QR 카메라"></video><div class="scanner-guide" aria-hidden="true"></div></div><div class="scanner-zoom" hidden><label for="qr-zoom">카메라 배율 <output id="qr-zoom-value" for="qr-zoom">1.0×</output></label><div><button class="btn light small" type="button" id="qr-zoom-reset">기본</button><input id="qr-zoom" type="range" min="1" max="3" step="0.1" value="1" aria-label="카메라 배율"></div><small id="qr-zoom-hint"></small></div><p id="qr-scanner-status" role="status" aria-live="polite">QR코드를 화면 가운데에 맞춰 주세요.</p><button class="btn gold" type="button" id="retry-scanner" hidden>다시 스캔</button>';
  this.video=dialog.querySelector('video');this.status=dialog.querySelector('#qr-scanner-status');this.retry=dialog.querySelector('#retry-scanner');this.zoomPanel=dialog.querySelector('.scanner-zoom');this.zoomInput=dialog.querySelector('#qr-zoom');this.zoomValue=dialog.querySelector('#qr-zoom-value');this.zoomHint=dialog.querySelector('#qr-zoom-hint');this.zoom=1;this.zoomQueue=Promise.resolve();this.crop=document.createElement('canvas');this.zoomInput.oninput=()=>this.requestZoom(Number(this.zoomInput.value));dialog.querySelector('#qr-zoom-reset').onclick=()=>this.requestZoom(this.defaultZoom||1);
  dialog.querySelector('#close-scanner').onclick=()=>this.close();this.retry.onclick=()=>this.start();dialog.oncancel=e=>{e.preventDefault();this.close();};dialog.onclose=()=>{if(!this.open)this.stopCamera();this.onClose?.();};
 }
 get open(){return this.dialog.open;}
 message(text,error=false){if(this.status.textContent!==text)this.status.textContent=text;this.status.classList.toggle('scanner-error',error);}
 stopCamera(){this.run++;clearTimeout(this.timer);this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.video.pause();this.video.srcObject=null;this.zoomPanel.hidden=true;this.video.style.transform='';this.zoom=1;}
 close(){this.stopCamera();if(this.open)this.dialog.close();}
 async start(){
  if(this.busy||!this.canScan())return;this.stopCamera();const run=this.run;this.returnFocus=document.activeElement;if(!this.open)this.dialog.showModal();this.retry.hidden=true;this.dialog.removeAttribute('aria-busy');this.message('카메라를 여는 중…');
  if(!globalThis.isSecureContext||!navigator.mediaDevices?.getUserMedia){this.message('이 브라우저에서 카메라를 사용할 수 없습니다. 최신 Chrome 또는 Safari로 접속해 주세요.',true);this.retry.hidden=false;return;}
  try{
   const camera=this.openCamera(run);
   const [stream,decode]=await Promise.all([camera,decoder()]);if(!stream||run!==this.run||!this.open)return;this.video.srcObject=stream;await this.configureZoom(run);if(run!==this.run||!this.open)return;await this.video.play();if(run!==this.run||!this.open)return;this.message('QR코드를 화면 가운데에 맞춰 주세요. 인식하면 자동으로 확보합니다.');
   const frame=async()=>{
    if(run!==this.run||!this.open)return;if(!this.canScan()){this.close();return;}
    try{if(this.video.readyState>=2&&this.video.videoWidth){const values=await decode(this.scanSource());if(run!==this.run||!this.open)return;const token=values.map(v=>supplyTokenFromQR(v,location.origin)).find(Boolean);if(token){this.stopCamera();this.busy=true;this.dialog.setAttribute('aria-busy','true');this.message('보급품을 확인하고 있습니다…');try{await this.onToken(token);this.close();}catch(e){if(this.open){this.message(e.message||'확보하지 못했습니다. 현황을 확인한 뒤 다시 스캔해 주세요.',true);this.retry.hidden=false;}}finally{this.busy=false;this.dialog.removeAttribute('aria-busy');}return;}if(values.length)this.message('이 행사의 보급품 QR이 아닙니다. 보급품 카드를 다시 비춰 주세요.',true);}}
    catch{if(run===this.run)this.message('QR이 선명하게 보이도록 거리와 밝기를 조절해 주세요.');}
    if(run===this.run)this.timer=setTimeout(frame,180);
   };this.timer=setTimeout(frame,0);
  }catch(e){if(run===this.run){this.stopCamera();this.message(cameraMessage(e),true);this.retry.hidden=false;}}
 }
 async openCamera(run){
  const media=navigator.mediaDevices,base={audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720},zoom:{ideal:1}}};
  const acquire=async constraints=>{const stream=await media.getUserMedia(constraints);if(run!==this.run||!this.open){stream.getTracks().forEach(t=>t.stop());return null;}this.stream=stream;return stream;};
  let stream=await acquire(base);if(!stream)return null;
  try{const preferred=preferredRearCamera(await media.enumerateDevices?.()||[]),current=stream.getVideoTracks()[0]?.getSettings?.().deviceId;if(run!==this.run||!this.open)return null;if(preferred?.deviceId&&current&&preferred.deviceId!==current){stream.getTracks().forEach(t=>t.stop());this.stream=null;try{stream=await acquire({audio:false,video:{...base.video,deviceId:{exact:preferred.deviceId}}});}catch{if(run!==this.run||!this.open)return null;stream=await acquire(base);}}}catch{}
  return stream;
 }
 async configureZoom(run){
  const track=this.stream?.getVideoTracks()[0];let caps={};try{caps=track?.getCapabilities?.()||{};}catch{}
  this.hardwareZoom=!!(Number.isFinite(caps.zoom?.min)&&Number.isFinite(caps.zoom?.max)&&caps.zoom.max>caps.zoom.min&&track.applyConstraints);
  this.defaultZoom=this.hardwareZoom?Math.max(caps.zoom.min,Math.min(1,caps.zoom.max)):1;this.zoomInput.min=this.hardwareZoom?caps.zoom.min:1;this.zoomInput.max=this.hardwareZoom?Math.max(this.defaultZoom,Math.min(3,caps.zoom.max)):3;this.zoomInput.step=this.hardwareZoom?caps.zoom.step||0.1:0.1;
  await this.applyZoom(this.defaultZoom,run);if(run!==this.run||!this.open)return;this.zoomPanel.hidden=false;
 }
 requestZoom(value){const run=this.run;this.zoomQueue=this.zoomQueue.catch(()=>{}).then(()=>{if(run===this.run&&this.stream)return this.applyZoom(value,run);});}
 async applyZoom(value,run){
  let target=Math.max(Number(this.zoomInput.min),Math.min(value,Number(this.zoomInput.max)));if(this.hardwareZoom){try{await this.stream.getVideoTracks()[0].applyConstraints({advanced:[{zoom:target}]});}catch{this.hardwareZoom=false;this.defaultZoom=1;this.zoomInput.min=1;this.zoomInput.max=3;this.zoomInput.step=0.1;target=Math.max(1,Math.min(target,3));}}
  if(run!==this.run||!this.open)return;this.zoom=target;this.zoomInput.value=target;this.zoomValue.value=target.toFixed(1)+'×';this.zoomHint.textContent=this.hardwareZoom?'렌즈 배율을 조절할 수 있어요.':'화면 확대 · QR이 작게 보이면 배율을 높여 주세요.';this.video.style.transform=this.hardwareZoom?'':`scale(${target})`;
 }
 scanSource(){
  if(this.hardwareZoom||this.zoom<=1)return this.video;const video=this.video,w=video.videoWidth,h=video.videoHeight,scale=Math.min(1,640/Math.max(w,h));this.crop.width=Math.round(w*scale);this.crop.height=Math.round(h*scale);this.crop.getContext('2d').drawImage(video,(w-w/this.zoom)/2,(h-h/this.zoom)/2,w/this.zoom,h/this.zoom,0,0,this.crop.width,this.crop.height);return this.crop;
 }

}
