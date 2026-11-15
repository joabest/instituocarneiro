import crypto from 'node:crypto';
import {method,sameOrigin,clean,emailOK,redis,fail,noStore,supportedCauses} from './_common.js';
export default async function handler(req,res){noStore(res);
 if(!method(req,res,['POST','GET']))return;
 if(req.method==='GET'){const id=clean(req.query?.id,90);if(!/^[a-f0-9-]{36}$/.test(id))return res.status(400).json({error:'Protocolo inválido'});try{const raw=await redis('GET','ic:donation:'+id);if(!raw)return res.status(404).json({error:'Protocolo não encontrado'});const d=JSON.parse(raw);return res.status(200).json({id:d.id,status:d.status,amount:d.amount,frequency:d.frequency,cause:d.cause,paymentMethod:d.paymentMethod,createdAt:d.createdAt})}catch(e){return fail(res,e)}}
 if(!sameOrigin(req))return res.status(403).json({error:'Origem inválida'});
 const b=req.body||{},name=clean(b.name,120),email=clean(b.email,254).toLowerCase(),cause=clean(b.cause,100),frequency=clean(b.frequency,20),paymentMethod=clean(b.paymentMethod,20),amount=Number(b.amount);
 if(name.length<2||!emailOK(email)||!supportedCauses.includes(cause)||!['once','monthly'].includes(frequency)||!['pix','card'].includes(paymentMethod)||!Number.isFinite(amount)||amount<1||amount>100000||Math.round(amount*100)!==amount*100||b.consent!==true)return res.status(400).json({error:'Confira seus dados, consentimento e valor (R$ 1 a R$ 100.000)'});
 const id=crypto.randomUUID(),d={id,name,email,cause,frequency,paymentMethod,amount,status:'sandbox_pending',createdAt:new Date().toISOString()};
 try{await redis('SET','ic:donation:'+id,JSON.stringify(d));await redis('LPUSH','ic:donation:ids',id);return res.status(201).json({id,status:d.status,message:'Pedido simulado registrado. Nenhuma cobrança realizada.'})}catch(e){return fail(res,e)}
}