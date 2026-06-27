-- Adiciona a coluna tipo para separar as observações (Time Ideal / Melhores Cartas)
ALTER TABLE eafc_observacao ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'time_ideal';

-- Atualiza eventuais registros antigos
UPDATE eafc_observacao SET tipo = 'time_ideal' WHERE tipo IS NULL;
