ALTER TABLE eafc_observacao ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'Time Ideal';

-- Drop a policy existente, se houver
DROP POLICY IF EXISTS "Enable all for eafc_observacao" ON eafc_observacao;

-- Cria novamente a política que permite tudo
CREATE POLICY "Enable all for eafc_observacao" 
ON eafc_observacao FOR ALL 
USING (true) WITH CHECK (true);

-- Atualiza eventuais registros antigos
UPDATE eafc_observacao SET tipo = 'Time Ideal' WHERE tipo IS NULL OR tipo = 'time_ideal';

-- Atualiza o cache do Supabase
NOTIFY pgrst, 'reload schema';
