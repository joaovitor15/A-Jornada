-- Adicição de colunas de configurações da Dashboard na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dashboard_metas_classes JSONB;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dashboard_compras_mes INTEGER DEFAULT 2;

-- Criação da tabela cards
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  bandeira TEXT NOT NULL,
  limite NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  dia_vencimento_fatura INTEGER NOT NULL,
  dia_fechamento_fatura INTEGER NOT NULL,
  cor TEXT NOT NULL DEFAULT '#000000',
  icone TEXT NOT NULL DEFAULT 'CreditCard',
  tipo TEXT NOT NULL DEFAULT 'credito',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS da tabela cards
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cards são visíveis apenas para o dono do perfil"
  ON public.cards FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = cards.profile_id));

CREATE POLICY "Usuários podem inserir cards em seus perfis"
  ON public.cards FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = cards.profile_id));

CREATE POLICY "Usuários podem atualizar seus próprios cards"
  ON public.cards FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = cards.profile_id));

CREATE POLICY "Usuários podem deletar seus próprios cards"
  ON public.cards FOR DELETE
  USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = cards.profile_id));

-- Atualização na tabela transacoes
ALTER TABLE public.transacoes
ADD COLUMN IF NOT EXISTS card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL;

-- Tabela de ativos da carteira (Ações, FIIs, etc)
CREATE TABLE IF NOT EXISTS public.ativos_carteira (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  classe TEXT NOT NULL,
  ticker_original TEXT NOT NULL,
  ticker_google TEXT NOT NULL,
  qtd NUMERIC(15, 6) NOT NULL DEFAULT 0.00,
  objetivo NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.ativos_carteira ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ativos são visíveis apenas para o dono do perfil"
  ON public.ativos_carteira FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = ativos_carteira.profile_id));

CREATE POLICY "Usuários podem inserir ativos em seus perfis"
  ON public.ativos_carteira FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = ativos_carteira.profile_id));

CREATE POLICY "Usuários podem atualizar seus próprios ativos"
  ON public.ativos_carteira FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = ativos_carteira.profile_id));

CREATE POLICY "Usuários podem deletar seus próprios ativos"
  ON public.ativos_carteira FOR DELETE
  USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = ativos_carteira.profile_id));

-- Tabela de cache de cotações globais
CREATE TABLE IF NOT EXISTS public.cotacoes_globais (
  ticker TEXT PRIMARY KEY,
  cotacao NUMERIC(15, 6) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.cotacoes_globais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cotações globais são visíveis para todos os usuários"
  ON public.cotacoes_globais FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem atualizar cotações globais"
  ON public.cotacoes_globais FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem fazer update em cotações globais"
  ON public.cotacoes_globais FOR UPDATE
  USING (auth.role() = 'authenticated');
