// Keep local interaction state separate from the server's game state.
const fieldKey=el=>el.id?'id:'+el.id:el.form?.id&&el.name?'field:'+el.form.id+':'+el.name:null;
const fields=root=>[...root.querySelectorAll('input,select,textarea')].filter(el=>el.type!=='password'&&!el.readOnly&&el.form?.id!=='login'&&el.id!=='preview');
function controlKey(el){
 if(!el)return null;
 if(fieldKey(el))return fieldKey(el);
 if(el.dataset.tab)return 'tab:'+el.dataset.tab;
 if(el.dataset.ui)return 'ui:'+el.dataset.ui;
 if(el.dataset.focusKey)return 'focus:'+el.dataset.focusKey;
 if(el.dataset.action){let p={};try{p=JSON.parse(el.dataset.payload||'{}');}catch{}return ['action',el.dataset.action,p.team,p.id,p.round,p.score,p.tab,p.success].join(':');}
 if(el.type==='submit'&&el.form?.id)return 'submit:'+el.form.id;
 return null;
}
function initialValue(el){if(el.type==='checkbox')return el.defaultChecked;if(el.tagName==='SELECT')return [...el.options].find(o=>o.defaultSelected)?.value||el.options[0]?.value||'';return el.defaultValue;}
export class ViewMemory{
 constructor(){this.views=new Map();}
 clear(){this.views.clear();}
 save(root,key){
  if(!root||!key)return;
  const drafts={};for(const el of fields(root)){const id=fieldKey(el),value=el.type==='checkbox'?el.checked:el.value;if(id&&value!==initialValue(el))drafts[id]=value;}
  const active=root.contains(document.activeElement)?document.activeElement:null;
  this.views.set(key,{drafts,details:Object.fromEntries([...root.querySelectorAll('details[id]')].map(el=>[el.id,el.open])),x:scrollX,y:scrollY,nav:root.querySelector('nav')?.scrollLeft||0,focus:controlKey(active),start:active?.selectionStart,end:active?.selectionEnd,card:active?.closest('.admin-card')?.id});
  if(this.views.size>40)this.views.delete(this.views.keys().next().value);
 }
 restore(root,key){
  const view=this.views.get(key);if(!view)return;
  for(const el of root.querySelectorAll('details[id]'))if(el.id in view.details)el.open=view.details[el.id];
  for(const el of fields(root)){const id=fieldKey(el);if(id in view.drafts){if(el.type==='checkbox')el.checked=view.drafts[id];else el.value=view.drafts[id];}}
  const target=[...root.querySelectorAll('input,select,textarea,button')].find(el=>!el.disabled&&controlKey(el)===view.focus)||root.querySelector('[id="'+view.card+'"]');
  if(target){target.focus({preventScroll:true});if(view.start!=null)try{target.setSelectionRange(view.start,view.end);}catch{}}
  const nav=root.querySelector('nav');if(nav)nav.scrollLeft=view.nav;
  window.scrollTo({left:view.x,top:view.y,behavior:'instant'});
 }
}
