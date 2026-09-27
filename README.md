# Global Job Tracker

Painel pessoal para organizar candidaturas internacionais de Lucas e Fabrina.

## V1
- Dashboard geral
- Lista de candidaturas com filtros
- Central de follow-ups
- Analytics por país
- Estrutura pronta para Supabase
- Modelo preparado para vincular Gmail `message_id` e `thread_id`

## Próximos passos
1. Criar projeto Supabase dedicado.
2. Instalar `@supabase/supabase-js` e `@supabase/ssr`.
3. Aplicar `supabase/schema.sql` e validar RLS.
4. Implementar login privado.
5. Trocar os dados de `lib/seed.ts` por consultas reais.
6. Importar histórico do Gmail e vincular respostas por `gmail_thread_id`.
7. Adicionar classificador de respostas e geração assistida de follow-up.

## Variáveis
Copie `.env.example` para `.env.local` e preencha as chaves do projeto Supabase.
