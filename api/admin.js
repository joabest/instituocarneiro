import {method,sameOrigin,checkPassword,isAdmin,setSession,clearSession,redis,fail,noStore,clean} from './_common.js';
export default async function handler(req,res){noStore(res);if(!method(req,res,['GET','POST','PATCH','DELETE']))return;
const secure=(req.headers['x-forwarded-proto']||'https')==='https';
if(req.method==='POST'){if(!sameOrigin(req))return res.status(403).json({error:'Origem inválida'});if(!checkPassword(req.body?.password))return res.status(401).json({error:'Credenciais inválidas ou não configuradas'});setSession(res,secure);return res.status(200).json({ok:true})}
if(req.method==='DELETE'){clearSession(res,secure);return res.status(200).json({ok:true})}
if(!isAdmin(req))return res.status(401).json({error:'Faça login no painel'});
try{
 if(req.method==='PATCH'){if(!sameOrigin(req))return res.status(403).json({error:'Origem inválida'});const id=clean(req.body?.id,90),status=clean(req.body?.status,50);if(!['sandbox_pending','sandbox_approved','sandbox_declined'].includes(status))return res.status(400).json({error:'Status de teste inválido'});const raw=await redis('GET','ic:donation:'+id);if(!raw)return res.status(404).json({error:'Doação inexistente'});const d=JSON.parse(raw);d.status=status;await redis('SET','ic:donation:'+id,JSON.stringify(d));return res.status(200).json({ok:true,status})}
 const ids=(await redis('LRANGE','ic:donation:ids',0,199))||[];let ds=[];if(ids.length){const arr=await redis('MGET',...ids.map(x=>'ic:donation:'+x));ds=(arr||[]).filter(Boolean).map(x=>JSON.parse(x))}
 const ls=(await redis('LRANGE','ic:leads',0,199))||[];const leads=ls.map(x=>JSON.parse(x));return res.status(200).json({donations:ds,leads,storage:'Upstash Redis',gatewayMode:'SANDBOX'});
}catch(e){return fail(res,e)}
}
