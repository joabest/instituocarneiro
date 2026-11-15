import crypto from 'node:crypto';
export const supportedCauses=['Lar Renovado','Natal Solidário','Diversidade e Direitos Humanos','Educação para Todos','Segurança Alimentar'];
export function method(req,res,allowed){if(!allowed.includes(req.method)){res.setHeader('Allow',allowed.join(', '));res.status(405).json({error:'Método não permitido'});return false;}return true;}
export function sameOrigin(req){const origin=req.headers.origin;if(!origin)return true;try{return new URL(origin).host===req.headers.host}catch{return false}}
export function clean(x,max=150){return typeof x==='string'?x.trim().slice(0,max):'';}
export function emailOK(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)&&e.length<=254}
export function configured(){return !!(process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN)}
export async function redis(...command){if(!configured())throw new Error('DATABASE_NOT_CONFIGURED');let r=await fetch(process.env.UPSTASH_REDIS_REST_URL,{method:'POST',headers:{Authorization:'Bearer '+process.env.UPSTASH_REDIS_REST_TOKEN,'Content-Type':'application/json'},body:JSON.stringify(command),cache:'no-store'});let j=await r.json();if(!r.ok||j.error)throw new Error('DATABASE_ERROR');return j.result}
export function fail(res,err){console.error(err?.message||err);return res.status(err?.message==='DATABASE_NOT_CONFIGURED'?503:500).json({error:err?.message==='DATABASE_NOT_CONFIGURED'?'Banco de dados não configurado':'Erro interno do servidor'});}
function secret(){return process.env.ADMIN_SESSION_SECRET||''}
function hmac(body){return crypto.createHmac('sha256',secret()).update(body).digest('hex')}
export function checkPassword(p){const correct=process.env.ADMIN_PASSWORD||'';if(correct.length<12||secret().length<32||typeof p!=='string')return false;const a=crypto.createHash('sha256').update(p).digest(),b=crypto.createHash('sha256').update(correct).digest();return crypto.timingSafeEqual(a,b)}
export function cookie(req){return (req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('ic_admin='))?.slice(9)||''}
export function isAdmin(req){if(!secret()||secret().length<32)return false;let [expires,signature]=cookie(req).split('.');if(!expires||!signature||!/^[0-9]+$/.test(expires)||Date.now()>Number(expires))return false;const expected=hmac(expires);return signature.length===expected.length&&crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected))}
export function setSession(res,secure){let exp=String(Date.now()+8*3600_000);res.setHeader('Set-Cookie','ic_admin='+exp+'.'+hmac(exp)+'; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800'+(secure?'; Secure':''));}
export function clearSession(res,secure){res.setHeader('Set-Cookie','ic_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'+(secure?'; Secure':''));}
export function noStore(res){res.setHeader('Cache-Control','no-store');}
