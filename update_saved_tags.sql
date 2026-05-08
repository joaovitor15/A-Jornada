-- Atualização da tabela saved_tags para incluir name e game
ALTER TABLE public.saved_tags 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS game TEXT DEFAULT 'clash_royale';
