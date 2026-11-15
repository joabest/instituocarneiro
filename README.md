# Instituto Carneiro — Protótipo responsivo (100% frontend)

Portal social com cinco projetos editáveis, formulários, checkout simulado e painel administrativo interativo. Publicável na Vercel com arquivos estáticos, **sem Supabase, banco, API própria, Node em produção ou backend**.

## Rotas

- `/`: página inicial
- `/projetos`: catálogo e detalhes antes da doação
- `/doar?cause=Lar%20Renovado`: checkout após seleção de projeto
- `/admin`: painel de gestão

## Entrar no painel

Acesse `/admin`, digite **admin**. É um acesso *público de protótipo*, não uma senha segura.

## Recursos funcionais

- Cadastro, edição, ativação/desativação e exclusão de projetos
- Doações simuladas com valor, forma de pagamento e status
- QR Code ilustrativo gerado no navegador, sem PIX real
- Leads e formulário de contato de teste
- Busca, filtros, exportação CSV e indicadores
- Configurações de demonstração e bloqueio de novas doações
- Backup JSON, importação e restauração dos dados
- Layout responsivo de desktop a celular

## Limitações importantes

1. **Os dados são armazenados em localStorage**, separados por navegador, dispositivo e domínio. Não é um CRM multiusuário; administradores de outros dispositivos não visualizarão registros de visitantes.
2. Use **somente dados fictícios**. Sem backend não há autenticação segura, acesso centralizado, proteção contra alterações locais nem captação real de leads.
3. O QR Code contém apenas texto de demonstração e **não pode ser pago**. Cartões nunca são processados. Não há débito recorrente nem dinheiro recebido.
4. Os projetos inicialmente são modelos planejados, e fotos são ilustrativas.
5. A biblioteca JavaScript de geração do QR é carregada pelo CDN jsDelivr; se estiver bloqueado, o sistema exibe o código fictício como alternativa.
6. As alterações feitas no admin aparecem no catálogo público **somente no mesmo navegador**; não se propagam a outros visitantes.
7. O seletor de idiomas traduz parcialmente a interface pública; os novos módulos e cadastros estão em português.

## Desenvolvimento

Arquivos em `public/`, com scripts sem dependências de build. Para testar com URLs sem extensão, use a Vercel e `vercel.json`.

SISTEMA EXCLUSIVO DESENVOLVIDO POR BAWERK SOLUTIONS
