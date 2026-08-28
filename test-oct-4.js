import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  const pId = profiles.find(p => p.email && p.email.includes("joao"))?.id;
  
  const { data: recData } = await supabase.from('transacoes_recorrentes').select('id, valor, data_inicio, tipo, categorias!transacoes_recorrentes_categoria_id_fkey(nome)').eq('profile_id', pId);
  const { data: antData } = await supabase.from('transacoes').select('recorrente_id, data, descricao, valor, status, tipo').eq('profile_id', pId);
  
  console.log("Recorrentes:", recData?.map(r => `${r.valor} - ${r.data_inicio} - ${r.tipo}`));
  
  const targetYear = 2026;
  const targetMonth = 10;
  let pastRecorrentesDebt = 0;
  
  recData?.forEach(rec => {
      const parts = rec.data_inicio.split('-');
      const startYear = parseInt(parts[0], 10);
      const startMonth = parseInt(parts[1], 10) - 1;
      for (let y = startYear; y <= targetYear; y++) {
          const mStart = (y === startYear) ? startMonth : 0;
          const mEnd = (y === targetYear) ? (targetMonth - 2) : 11;
          for (let m = mStart; m <= mEnd; m++) {
              const isMatched = antData.some(t => {
                  const refTag = `(Ref: ${String(m + 1).padStart(2, '0')}/${y})`;
                  return t.recorrente_id === rec.id && t.descricao?.includes(refTag);
              });
              if (!isMatched) {
                  console.log(`Unmatched past: ${rec.valor} in ${m+1}/${y}`);
                  if (rec.tipo === 'despesa') pastRecorrentesDebt -= rec.valor;
              }
          }
      }
  });
  console.log("pastRecorrentesDebt:", pastRecorrentesDebt);
}
run();
