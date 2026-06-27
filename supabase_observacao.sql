-- Remove as políticas restritivas
DROP POLICY IF EXISTS "Users can view their own observacao" ON eafc_observacao;
DROP POLICY IF EXISTS "Users can insert their own observacao" ON eafc_observacao;
DROP POLICY IF EXISTS "Users can update their own observacao" ON eafc_observacao;
DROP POLICY IF EXISTS "Users can delete their own observacao" ON eafc_observacao;

-- Cria a política que permite tudo (como nas outras tabelas do projeto)
CREATE POLICY "Enable all for eafc_observacao" 
ON eafc_observacao FOR ALL 
USING (true) WITH CHECK (true);
