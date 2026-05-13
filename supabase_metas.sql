CREATE TABLE metas_investimentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'patrimonio' ou 'quantidade'
  nome TEXT NOT NULL,
  ativo TEXT, -- NULL se for patrimonio, ou o ticker se for quantidade
  valor_alvo NUMERIC NOT NULL,
  valor_mensal NUMERIC NOT NULL,
  valor_atual NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE metas_investimentos ENABLE ROW LEVEL SECURITY;

-- Policies for anon/all (just like other tables, assuming app uses anon key)
CREATE POLICY "Enable all for metas_investimentos" 
ON metas_investimentos FOR ALL 
USING (true) WITH CHECK (true);

-- Caso a tabela já exista e você queira adicionar a coluna ativo
-- ALTER TABLE metas_investimentos ADD COLUMN ativo TEXT;
