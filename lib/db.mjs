export async function gateway(action,payload={}){
 const response=await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/game_gateway`,{method:'POST',headers:{apikey:process.env.SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({p_secret:process.env.DB_GATEWAY_SECRET,p_action:action,p_payload:payload}),signal:AbortSignal.timeout(10000)});
 if(!response.ok){console.error('Database gateway failed:',response.status);throw new Error('데이터베이스 연결을 확인할 수 없습니다. 잠시 후 다시 시도하세요.');}
 return response.json();
}
export async function updateState(transform){
 for(let attempt=0;attempt<6;attempt++){
   const row=await gateway('read');const next=transform(row.data,row.version);const result=await gateway('write',{version:row.version,data:next});if(result.saved)return next;
 }
 const err=new Error('다른 지령이 처리 중입니다. 잠시 후 다시 시도하세요.');err.status=409;throw err;
}
