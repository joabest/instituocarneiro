/* Doação em modal · modo demonstrativo sem backend */
(()=>{'use strict';
const $=id=>document.getElementById(id),S=window.ICStore;
let chosen=null,lastFocus=null,currentId=null,amount=25;
const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n)||0);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function projects(){return S.get().projects.filter(p=>p.active!==false)}
function stage(n){for(const [i,id] of ['icDonationSelect','icDonationCheckout','icDonationResult'].entries())$(id).hidden=i!==n;$('icDonationError').textContent='';$('donationOverlay').querySelector('.ic-donation-scroll').scrollTop=0}
function renderProjects(){const items=projects();if(!items.length){$('icDonationProjects').innerHTML='<p>Não há projetos ativos para simular doações.</p>';$('icContinue').disabled=true;return}
if(!chosen||!items.some(p=>p.slug===chosen.slug))chosen=items[0];
$('icDonationProjects').innerHTML=items.map(p=>'<button type="button" data-ic-project="'+esc(p.slug)+'" class="'+(chosen.slug===p.slug?'active':'')+'"><img src="'+esc(p.photo||'')+'" alt="" loading="lazy"><span>'+esc(p.title)+'<small>'+esc(p.cat||'Projeto social')+'</small></span><b>↗</b></button>').join('');
$('icDonationProjects').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{chosen=items.find(p=>p.slug===b.dataset.icProject);renderProjects()}));
$('icDonationDetail').innerHTML='<strong>'+esc(chosen.title)+'</strong><p>'+esc(chosen.summary||'')+'</p><p><b>Objetivo:</b> '+esc(chosen.goal||'Apoiar a causa escolhida')+'</p>';
$('icContinue').disabled=false;
}
function open(e,slug){if(e)e.preventDefault();if(S.get().settings.allowDonations===false){alert('As doações demonstrativas estão temporariamente desativadas nas configurações do protótipo.');return}lastFocus=document.activeElement;chosen=projects().find(p=>p.slug===slug)||null;renderProjects();stage(0);$('donationOverlay').hidden=false;$('donationOverlay').setAttribute('aria-hidden','false');document.body.classList.add('ic-modal-open');$('closeDonation').focus()}
function close(){if($('donationOverlay').hidden)return;$('donationOverlay').hidden=true;$('donationOverlay').setAttribute('aria-hidden','true');document.body.classList.remove('ic-modal-open');if(lastFocus?.focus)lastFocus.focus()}
function setAmount(value){amount=Number(value);$('icCustomAmount').value=amount;document.querySelectorAll('[data-ic-amount]').forEach(b=>b.classList.toggle('active',Number(b.dataset.icAmount)===amount))}
function checkout(){if(!chosen)return;stage(1);$('icSelectedCause').textContent='Projeto selecionado: '+chosen.title;setAmount(25)}
function finish(){const a=Number($('icCustomAmount').value),name=$('icDonorName').value.trim(),email=$('icDonorEmail').value.trim(),consent=$('icDonorConsent').checked,method=document.querySelector('[name="icMethod"]:checked')?.value||'pix';
if(!Number.isFinite(a)||a<1||a>100000||Math.round(a*100)!==Math.round(a*100*100)/100)return $('icDonationError').textContent='Informe um valor entre R$ 1 e R$ 100.000, com até duas casas decimais.';
if(name.length<2||!/^\S+@\S+\.\S+$/.test(email)||!consent)return $('icDonationError').textContent='Use nome e e-mail fictícios válidos e aceite o armazenamento local.';
const record={id:S.uid('DEMO'),createdAt:new Date().toISOString(),name,email,cause:chosen.title,amount:a,frequency:'once',paymentMethod:method,status:'sandbox_pending',mode:'demo'};
if(!S.upsert('donations',record))return $('icDonationError').textContent='Não foi possível salvar. Verifique se o armazenamento do navegador está disponível.';
currentId=record.id;stage(2);$('icResultMessage').textContent=money(a)+' para '+chosen.title+' · protocolo '+record.id+'. Nenhum dinheiro foi enviado.';
$('icQRBox').hidden=method!=='pix';$('icCardBox').hidden=method!=='card';
$('icResultStatus').textContent='Pendente (simulação) — registro salvo neste navegador.';
if(method==='pix'){const code='INSTITUTO CARNEIRO | SIMULACAO NAO PAGAVEL | '+record.id+' | '+money(a);$('icQrText').value=code;$('icQrCode').innerHTML='';if(typeof QRCode==='function'){new QRCode($('icQrCode'),{text:code,width:215,height:215,colorDark:'#163e2e',colorLight:'#fff',correctLevel:QRCode.CorrectLevel.M})}else{$('icQrCode').textContent='QR indisponível neste navegador. Use o código ilustrativo abaixo.';}}
}
function setResult(status){if(!currentId)return;const d=S.get(),item=d.donations.find(x=>x.id===currentId);if(!item)return;item.status=status;if(S.save(d))$('icResultStatus').textContent=status==='sandbox_approved'?'Pagamento aprovado na simulação (sem cobrança).':'Pagamento recusado na simulação (sem cobrança).'}
document.addEventListener('DOMContentLoaded',()=>{
document.querySelectorAll('[data-open-donation]').forEach(b=>b.addEventListener('click',e=>open(e,b.dataset.project)));
$('closeDonation').onclick=close;$('donationOverlay').querySelector('[data-close-donation]').onclick=close;
$('icContinue').onclick=checkout;$('icBackProject').onclick=()=>stage(0);
$('icCustomAmount').oninput=e=>{amount=Number(e.target.value);document.querySelectorAll('[data-ic-amount]').forEach(b=>b.classList.toggle('active',Number(b.dataset.icAmount)===amount))};
document.querySelectorAll('[data-ic-amount]').forEach(b=>b.onclick=()=>setAmount(b.dataset.icAmount));
$('icGenerate').onclick=finish;$('icRestart').onclick=()=>{chosen=null;currentId=null;renderProjects();stage(0)};
document.querySelectorAll('[data-ic-result]').forEach(b=>b.onclick=()=>setResult(b.dataset.icResult));
$('icCopyQr').onclick=async()=>{try{await navigator.clipboard.writeText($('icQrText').value);$('icResultStatus').textContent='Código ilustrativo copiado.'}catch{$('icQrText').select();$('icResultStatus').textContent='Selecione e copie o código.'}};
document.addEventListener('keydown',e=>{if($('donationOverlay').hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){const tabbable=[...$('donationOverlay').querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled])')].filter(el=>el.getClientRects().length);if(!tabbable.length)return;const first=tabbable[0],last=tabbable[tabbable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
});
})();