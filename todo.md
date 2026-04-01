<<<<<<< HEAD
# Sistema de Gestão de Imóveis - TODO

## Banco de Dados & Backend
- [x] Schema: tabelas propriedades, contratos, pagamentos, arquivos
- [x] Migração SQL aplicada
- [x] Seed com dados das planilhas (4 endereços, ~40 inquilinos)
- [x] tRPC: rotas de propriedades, contratos, pagamentos, upload

## Frontend - Layout & Tema
- [x] Tema visual vibrante (azul, verde, laranja) no index.css
- [x] DashboardLayout com sidebar de navegação
- [x] Componente de busca rápida global

## Páginas
- [x] Dashboard: visão geral por endereço, ocupação, receita
- [x] Contratos: listagem com filtros (endereço, inquilino, status, vencimento)
- [x] Detalhe do contrato: dados completos + histórico de pagamentos
- [x] Alertas: contratos vencendo em 30 dias com badges visuais
- [x] Calendário: pagamentos de dez/2025 e jan/2026 com status
- [x] Relatórios: receita mensal, taxa de ocupação, vencimentos futuros
- [x] Upload PDF: upload e download de contrato por inquilino

## Funcionalidades Extras
- [x] Badges de status (Pago, Caução, Pendente, Vencendo)
- [x] Indicadores visuais de contratos próximos do vencimento
- [x] Busca por casa, inquilino ou endereço

## Testes
- [x] Vitest para rotas principais (9 testes passando)

## Melhorias v1.1
- [x] Alteração de status de pagamento via menu dropdown (Pago, Pendente, Atrasado, Caução)
- [x] Substituir status "Encerrado" por badge/aviso "Contrato Vencido" com data de vencimento
- [x] Aviso de contrato vencido visível na listagem, detalhe e dashboard

## Melhorias v1.2
- [ ] Botão de renovação clicável com modal para alterar data de saída
- [ ] Exportação de relatório em PDF e impressão
- [ ] Formulário de adicionar novo inquilino com seleção de condomínio/endereço
- [ ] Gerar automaticamente todos os meses de 2026 para contratos ativos

## Melhorias v1.3 - Recibo de Pagamento
- [ ] Extrair logo Mesquita Administração de Imóveis da imagem
- [ ] Extrair assinatura em caneta da imagem
- [ ] Criar página de gerador de recibo com formulário completo
- [ ] Preview do recibo idêntico ao modelo original
- [ ] Botão imprimir/salvar PDF do recibo
- [ ] Integrar botão "Gerar Recibo" no detalhe do contrato
- [ ] Campo para dados do inquilino (CPF, RG, profissão, estado civil)
- [ ] Seleção de mês de referência do aluguel
- [ ] Valor por extenso automático em português

## Melhorias v1.4 - Recibo aprimorado
- [x] Select de condomínio no recibo com lista de endereços
- [x] Select de inquilino no recibo com preenchimento automático (nome, valor, endereço)
- [x] Remover cabeçalho e rodapé do navegador na impressão (@page CSS)

## Melhorias v1.5 - WhatsApp & Export
- [x] Adicionar campo telefone na tabela contratos (migration SQL)
- [x] Criar página WhatsApp com modelos de mensagem prontos (cobrança, vencimento, recibo)
- [x] Integrar botão WhatsApp no detalhe do contrato e na lista de alertas
- [x] Exportar projeto completo como ZIP (código-fonte, banco, assets, instruções)
=======
# Corretos-v2: Sistema de Gestão de Imóveis - TODO

## Banco de Dados
- [ ] Criar schema Drizzle com tabelas: propriedades, contratos, pagamentos, alertas
- [ ] Configurar migrations e validar conexão DATABASE_URL

## Backend (Express + tRPC)
- [ ] Implementar router de contratos (listar, criar, atualizar, deletar)
- [ ] Implementar router de pagamentos (listar, registrar, atualizar status)
- [ ] Implementar router de alertas (gerar alertas de vencimento)
- [ ] Implementar router de relatórios (receita, ocupação, vencimentos)
- [ ] Implementar router de recibos (gerar PDF)
- [ ] Implementar router de WhatsApp (enviar mensagens)
- [ ] Implementar router de busca (busca rápida por casa/inquilino/endereço)
- [ ] Implementar router de upload/download de PDFs (S3)

## Frontend (React)
- [ ] Criar layout Dashboard com sidebar navigation
- [ ] Criar página Home/Dashboard com visão geral
- [ ] Criar página de Contratos com filtros
- [ ] Criar página de Detalhes do Contrato
- [ ] Criar página de Alertas com badges visuais
- [ ] Criar página de Calendário de Pagamentos
- [ ] Criar página de Relatórios
- [ ] Criar página de Recibos
- [ ] Criar página de WhatsApp
- [ ] Criar página de Busca Rápida
- [ ] Implementar upload/download de PDFs

## Build e Deploy
- [ ] Corrigir erros de build (vite + esbuild)
- [ ] Ajustar servidor para usar process.env.PORT
- [ ] Configurar DATABASE_URL para Render
- [ ] Testar build localmente
- [ ] Atualizar GitHub com código completo
- [ ] Fazer deploy no Render
- [ ] Validar link do deploy

## Dados Iniciais
- [ ] Importar dados de propriedades, contratos e pagamentos de 2026
>>>>>>> 2aff767 (Reconstruir projeto completo com backend, frontend e configuração de deploy)
