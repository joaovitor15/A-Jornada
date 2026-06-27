-- Execute este script no SQL Editor do Supabase para limpar as colunas e tabelas não utilizadas:

-- 1. Remove a tabela de eventos que não será mais utilizada
DROP TABLE IF EXISTS public.eafc_events CASCADE;

-- 2. Remove as colunas desnecessárias da tabela de atletas
ALTER TABLE public.eafc_athletes 
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS event,
DROP COLUMN IF EXISTS base_ger;
