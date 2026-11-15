import crypto from 'node:crypto';
import {method,sameOrigin,clean,emailOK,redis,fail} from './_common.js';
export default async function handler(req,res){if(!method(req,res,['POST']))return;if(!sameOrigin(req))return res.status(403).json({error:'Origem inválida'});
const b=req.body||{},name=clean(b.name,120),email=clean(b.email,254).toLowerCase(),interest=clean(b.interest,100),message=clean(b.message,1200);
if(name.length<2||!emailOK(email)||!interest||b.consent!==true)return res.status(400).json({error:'Preencha nome, e-mail, interesse e consentimento'});
const lead={id:crypto.randomUUID(),name,email,interest,message,status:'novo',createdAt:new Date().toISOString()};
try{await redis('LPUSH','ic:leads',JSON.stringify(lead));return res.status(201).json({ok:true,message:'Contato registrado'})}catch(e){return fail(res,e)}
}