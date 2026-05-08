-- Execute este script no SQL Editor do seu Supabase para criar a tabela de Cofres.

-- 1. Criação da tabela
CREATE TABLE IF NOT EXISTS public.cofres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    local TEXT NOT NULL,
    type TEXT NOT NULL, -- 'reserva', 'provisao', ou 'meta'
    saldo_atual NUMERIC DEFAULT 0,
    objetivo_total NUMERIC DEFAULT 0,
    provisao_payment_type TEXT, -- 'mensal', 'anual' ou 'unico'
    provisao_falta_ciclo NUMERIC DEFAULT 0,
    provisao_ja_utilizado NUMERIC DEFAULT 0,
    provisao_utilizado_ciclos INTEGER DEFAULT 0,
    provisao_total_ciclos INTEGER DEFAULT 12,
    provisao_vencimento TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilita o Row Level Security (RLS) para segurança
ALTER TABLE public.cofres ENABLE ROW LEVEL SECURITY;

-- 3. Cria as políticas de segurança para garantir que cada usuário só veja/edite seus próprios cofres
CREATE POLICY "Usuários podem ver seus próprios cofres"
    ON public.cofres FOR SELECT
    USING ( auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profile_id) );

CREATE POLICY "Usuários podem inserir seus próprios cofres"
    ON public.cofres FOR INSERT
    WITH CHECK ( auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profile_id) );

CREATE POLICY "Usuários podem atualizar seus próprios cofres"
    ON public.cofres FOR UPDATE
    USING ( auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profile_id) );

CREATE POLICY "Usuários podem deletar seus próprios cofres"
    ON public.cofres FOR DELETE
    USING ( auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profile_id) );
