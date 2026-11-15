import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('páginas exigidas para deploy',()=>{for(const path of ['public/index.html','public/doar.html','public/admin.html','public/style.css','public/app.js','public/admin.js','api/donations.js','api/leads.js','api/admin.js','vercel.json'])assert.ok(fs.existsSync(path),path)});
test('URLs Vercel',()=>{let v=JSON.parse(fs.readFileSync('vercel.json','utf8'));assert.ok(v.rewrites.some(r=>r.source==='/admin'));assert.ok(v.rewrites.some(r=>r.source==='/doar'))});
test('nenhum token privado versionado',()=>{let env=fs.readFileSync('.env.example','utf8');assert.ok(env.includes('ADMIN_SESSION_SECRET'));assert.ok(!env.includes('sk_live_'))});
