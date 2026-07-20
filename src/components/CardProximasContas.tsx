import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Clock, CheckCircle2, Loader2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CardProximasContasProps {
  activeProfileId: string;
  ano: number;
  mes: number;
  contas: any[];
  isLoading: boolean;
  onUpdate: () => void;
}

export function CardProximasContas({ activeProfileId, ano, mes, contas = [], isLoading, onUpdate }: CardProximasContasProps) {
  const [pagandoId, setPagandoId] = useState<string | null>(null);
  const [efetivarModal, setEfetivarModal] = useState<{isOpen: boolean, conta: any | null}>({isOpen: false, conta: null});
  const [efetivarValorStr, setEfetivarValorStr] = useState<string>('0');

  const formatCentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setEfetivarValorStr('0');
      return;
    }
    setEfetivarValorStr(val);
  };

  const parseCentsToNumber = (centsStr: string) => {
    return parseFloat(centsStr) / 100 || 0;
  };

  const centsToFormattedCurrency = (centsStr: string) => {
    const valueNum = parseCentsToNumber(centsStr);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valueNum);
  };

  const validContas = contas;
  const displayLimit = 5;
  const filteredContas = validContas.slice(0, displayLimit);

  const abrirModalEfetivar = (conta: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEfetivarModal({ isOpen: true, conta });
    const val = Number(conta.valor) || 0;
    setEfetivarValorStr((val * 100).toFixed(0));
  };

  const handleConfirmarPagamento = async () => {
    if (!efetivarModal.conta) return;
    const conta = efetivarModal.conta;
    const finalValue = parseCentsToNumber(efetivarValorStr);

    try {
      setPagandoId(conta.id);
      
      const insertData = conta.payment_data || conta.data;
      
      if (conta.isRecurrent && conta.recurrentSource) {
        const { error } = await supabase.from('transacoes').insert([{
           profile_id: activeProfileId,
           tipo: conta.recurrentSource.tipo || 'despesa',
           valor: conta.valor === 0 ? finalValue : conta.valor,
           descricao: conta.descricao,
           data: insertData,
           status: 'pago',
           recorrente_id: conta.recorrente_id,
           tag_id: conta.tags?.id || null
        }]);
        if (error) throw error;
      } else {
        const payload: any = { status: 'pago', data: insertData };
        if (conta.valor === 0) payload.valor = finalValue;
        
        const { error } = await supabase
          .from('transacoes')
          .update(payload)
          .eq('id', conta.id);
        if (error) throw error;
      }
      
      setEfetivarModal({ isOpen: false, conta: null });
      onUpdate();
    } catch (err) {
      console.error("Erro ao pagar conta:", err);
      alert("Erro ao efetivar pagamento.");
    } finally {
      setPagandoId(null);
    }
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col h-[280px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">Próximas Contas</h3>
            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8]">Provisões de {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][mes - 1]}</p>
          </div>
        </div>
        <div className="text-[12px] font-semibold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
          {validContas.length} pendentes
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-[#94A3B8] gap-2 py-8">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-sm">Carregando contas...</span>
          </div>
        ) : filteredContas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#94A3B8] gap-3 py-8 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">Tudo limpo!</p>
              <p className="text-sm mt-1">Nenhuma conta pendente para {['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'][mes - 1]}.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContas.map(conta => {
              const dataParts = conta.data.split('-');
              const diaStr = dataParts.length === 3 ? dataParts[2] : '';
              
              return (
                <div key={conta.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex flex-col items-center justify-center min-w-[40px] h-[40px] bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 flex-shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Dia</span>
                      <span className="text-[14px] font-bold leading-none">{diaStr}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[14px] text-slate-800 dark:text-slate-200 truncate" title={conta.descricao}>
                        {conta.descricao}
                      </p>
                      <div className="mt-1">
                        {(() => {
                          const cat = conta.categories || (conta.tags as any)?.categories;
                          const categoryColor = cat?.cor || '#64748B';
                          const catName = cat?.nome || 'Sem categoria';
                          return (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '100px',
                              fontSize: '10px',
                              fontWeight: 600,
                              background: `${categoryColor}20`,
                              color: categoryColor,
                              border: `1px solid ${categoryColor}40`,
                              textTransform: 'uppercase'
                            }}>
                              {catName}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pl-2 flex-shrink-0">
                    <span className={`font-bold text-[14px] ${conta.valor === 0 ? 'text-slate-800 dark:text-slate-200' : (conta.tipo === 'receita' || conta.recurrentSource?.tipo === 'receita' ? 'text-emerald-500' : 'text-[#EF4444]')}`}>
                      {conta.valor !== 0 && (conta.tipo === 'receita' || conta.recurrentSource?.tipo === 'receita') ? '+' : ''}{formatarValor(conta.valor)}
                    </span>
                    <button
                      onClick={(e) => abrirModalEfetivar(conta, e)}
                      disabled={pagandoId === conta.id}
                      className="btn-salvar flex-1"
                      title="Efetivar Pagamento"
                    >
                      {pagandoId === conta.id ? (
                        <Loader2 size={16} className="animate-spin text-green-500" />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EFETIVAR MODAL */}
      <AnimatePresence>
        {efetivarModal.isOpen && efetivarModal.conta && (
          <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-[#334155] max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden"
            >
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Efetivar Provisão</h3>
                <p className="text-xs text-slate-400 font-medium">Confirme o valor para o lançamento real no seu caixa.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Descrição</span>
                  <p className="font-extrabold text-slate-750 dark:text-slate-200 text-sm">
                    {efetivarModal.conta.descricao}
                    {efetivarModal.conta.valor !== 0 && ` - ${efetivarModal.conta.tipo === 'receita' || efetivarModal.conta.recurrentSource?.tipo === 'receita' ? '+' : ''}${formatarValor(efetivarModal.conta.valor)}`}
                  </p>
                </div>

                {efetivarModal.conta.valor === 0 && (
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block mb-1">Valor Efetivado (R$)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 text-[16px]">
                        {efetivarModal.conta.tipo === 'receita' || efetivarModal.conta.recurrentSource?.tipo === 'receita' ? '+' : '-'} R$
                      </span>
                      <input 
                        type="text"
                        value={centsToFormattedCurrency(efetivarValorStr).replace('R$', '').trim()}
                        onChange={formatCentsChange}
                        className="btn-salvar flex-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  onClick={() => setEfetivarModal({isOpen: false, conta: null})}
                  className="btn-cancelar flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarPagamento}
                  disabled={pagandoId !== null}
                  className="btn-salvar flex-1"
                >
                  {pagandoId ? <Loader2 size={16} className="animate-spin" /> : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
