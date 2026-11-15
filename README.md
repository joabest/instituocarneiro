# Instituto Carneiro — Portal e doações

Implantação na Vercel com páginas públicas, formulário de contato, checkout de doação **sandbox**, e painel `/admin`.

## Estado dos pagamentos

Este projeto **não cobra cartões nem gera PIX bancário real**. O formulário registra solicitações de doações de teste. Status de transações devem ser confirmados por uma gateway e webhook antes de serem chamados de pagos.

## Banco de dados na Vercel

Para persistência, conecte um banco Redis compatível com a REST API da Upstash (pela integração da Vercel ou diretamente) e configure as variáveis de ambiente:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `ADMIN_PASSWORD` (senha longa e exclusiva)
- `ADMIN_SESSION_SECRET` (string aleatória longa de 32+ caracteres)

**Sem estas variáveis, formulários e admin não conseguem armazenar dados.**

## Rotas

- `/` — site institucional
- `/doar` — checkout sandbox
- `/admin` — doações, leads e indicadores

## Deploy

Importe o repositório na Vercel usando Framework Preset **Other**, mantendo o Root Directory na raiz. Não configure build command. Após o deploy, cadastre as quatro variáveis e faça novo deploy.

## Observação sobre a V8.6

A V8.6 local, com `server.mjs` e SQLite, é uma implementação separada, que não funciona como banco persistente no ambiente serverless da Vercel. Esta versão é uma adaptação para hospedagem, não uma cópia bit a bit da V8.6.

Desenvolvido por BAWERK SOLUTIONS.
