import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('páginas essenciais estáticas',()=>{for(const path of ['public/index.html','public/projetos.html','public/doar.html','public/admin.html','public/store.js','public/app.js','public/projects.js','public/admin.js','public/admin.css','public/style.css','vercel.json'])assert.ok(fs.existsSync(path),path)});
test('Vercel publica as quatro rotas estáticas',()=>{const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));for(const route of ['/','/projetos','/doar','/admin'])assert.ok(config.rewrites.some(x=>x.source===route),route)});
test('sem endpoints de backend',()=>assert.ok(!fs.existsSync('api'),'A pasta api não deve existir no protótipo'));
test('JavaScript de navegador sintaticamente válido',async()=>{const vm=await import('node:vm');for(const name of ['store','app','projects','admin'])assert.doesNotThrow(()=>new vm.Script(fs.readFileSync('public/'+name+'.js','utf8')),name)});
test('QR usa biblioteca JavaScript no navegador',()=>{const s=fs.readFileSync('public/app.js','utf8');assert.ok(s.includes('new QRCode('));assert.ok(!s.includes('api.qrserver.com'))});
test('site e admin usam o mesmo armazenamento',()=>{for(const f of ['app.js','admin.js','projects.js'])assert.ok(fs.readFileSync('public/'+f,'utf8').includes('ICStore'),'faltou store em '+f)});
