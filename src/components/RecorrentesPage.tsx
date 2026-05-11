import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Repeat, Plus, Check, Edit, Trash2, Calendar, CreditCard, Tag as TagIcon, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RecurringModal } from './RecurringModal';
import { useCategories } from '../hooks/useCategories';

interface RecorrentesPageProps {
  activeProfileId?: string;
}

type FrequenciaTab = 'todas' | 'diaria' | 'semanal' | 'mensal' | 'anual';

export const RecorrentesPage = ({ activeProfileId }: RecorrentesPageProps) => {
  const [activeTab, setActiveTab] = useState<FrequenciaTab>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState<'receita' | 'despesa'>('despesa');
  const [loading, setLoading] = useState(true);
  const [recorrentes, setRecorrentes] = useState<any[]>([]);
  const [editingRec, setEditingRec] = useState<any>(null);
  
  // New states for validation and launching
  const [duplicateModal, setDuplicateModal] = useState<{isOpen: boolean, rec: any, targetStr: string, valorFinal: number} | null>(null);
  const [variableValueModal, setVariableValueModal] = useState<{isOpen: boolean, rec: any} | null>(null);
  const [variableValorStr, setVariableValorStr] = useState('0');

  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: string | null} | null>(null);

  const { categories, tags } = useCategories(activeProfileId);

  const fetchRecorrentes = async () => {
    if (!activeProfileId) return;
    setLoading(true);
    // Assumindo que categories e tags estão em tabelas separadas... precisamos fazer join ou fetch
    const { data, error } = await supabase
      .from('transacoes_recorrentes')
      .select(`
        *,
        categories ( id, nome, icone, cor ),
        tags ( id, nome )
      `)
      .eq('profile_id', activeProfileId);
      
    if (error) {
      console.error(error);
    } else {
      setRecorrentes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecorrentes();
  }, [activeProfileId]);

  const usedFreqs = Array.from(new Set(recorrentes.map(r => r.frequencia)));
  const freqOptions: { id: FrequenciaTab; label: string }[] = [
    { id: 'diaria', label: 'Diárias' },
    { id: 'semanal', label: 'Semanais' },
    { id: 'mensal', label: 'Mensais' },
    { id: 'anual', label: 'Anuais' }
  ];
  const visibleFreqs = freqOptions.filter(f => usedFreqs.includes(f.id));

  const filtrados = recorrentes.filter(r => {
    if (activeTab === 'todas') return true;
    return r.frequencia === activeTab;
  });

  const now = new Date();

  // Status computation logic extracted here
  const getStatus = (rec: any) => {
    const lastDate = rec.ultima_lancada ? new Date(rec.ultima_lancada) : null;
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    const currentDayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    
    let isPending = false;
    let isPaid = false;

    if (rec.frequencia === 'diaria') {
        if (!lastDate || (lastDate.getDate() !== currentDay || lastDate.getMonth() !== currentMonth || lastDate.getFullYear() !== currentYear)) {
          isPending = true;
        } else {
          isPaid = true;
        }
    } else if (rec.frequencia === 'semanal') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - currentDayOfWeek + 1);
        if (!lastDate || lastDate < startOfWeek) {
          if (rec.dia_vencimento <= currentDayOfWeek) {
            isPending = true;
          }
        } else {
          isPaid = true;
        }
    } else if (rec.frequencia === 'mensal') {
        if (!lastDate || (lastDate.getMonth() !== currentMonth || lastDate.getFullYear() !== currentYear)) {
          if (rec.dia_vencimento && currentDay >= rec.dia_vencimento) {
            isPending = true;
          }
        } else {
          isPaid = true; // Pago esse mês
        }
    } else if (rec.frequencia === 'anual') {
        if (!lastDate || lastDate.getFullYear() !== currentYear) {
          if (rec.mes_vencimento && rec.dia_vencimento) {
            const vencimento = new Date(currentYear, rec.mes_vencimento - 1, rec.dia_vencimento);
            const diffTime = vencimento.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 30 && diffDays >= 0) {
              isPending = true;
            } else if (diffDays < 0) {
               isPending = true;
            }
          }
        } else {
          isPaid = true;
        }
    }

    if (isPaid) return 'pago';
    if (isPending) return 'pendente';
    return 'aguardando';
  };

  const handleVariableValorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Enter') return;
    e.preventDefault();
    if (e.key === 'Backspace') {
      setVariableValorStr(prev => prev.slice(0, -1) || '0');
      return;
    }
    if (!/[0-9]/.test(e.key)) return;
    setVariableValorStr(prev => {
      const novo = prev === '0' ? e.key : prev + e.key;
      if (novo.length > 10) return prev;
      return novo;
    });
  };

  const formatarValor = (digitos: string) => {
    const numero = parseInt(digitos) / 100;
    return numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
  };

  const iniciarLancamento = async (rec: any, providedValue?: number) => {
     let valorCalculado = providedValue !== undefined ? providedValue : rec.valor;

     if (valorCalculado === null) {
       setVariableValorStr('0');
       setVariableValueModal({ isOpen: true, rec });
       return;
     }

     const agora = new Date();
     let ano = agora.getFullYear();
     let mes = agora.getMonth();
     let targetDate = new Date();

     if (rec.frequencia === 'diaria') {
        targetDate = agora;
     } else if (rec.frequencia === 'semanal') {
        let day = agora.getDay();
        let currentDayOfWeek = day === 0 ? 7 : day;
        let diffToMonday = agora.getDate() - currentDayOfWeek + 1;
        let monday = new Date(ano, mes, diffToMonday);
        let targetDayDiff = rec.dia_vencimento - 1;
        targetDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + targetDayDiff);
     } else if (rec.frequencia === 'mensal') {
        let calcDia = rec.dia_vencimento;
        let ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();
        if (calcDia > ultimoDiaMes) calcDia = ultimoDiaMes;
        targetDate = new Date(ano, mes, calcDia);
     } else if (rec.frequencia === 'anual') {
        let mesVenc = (rec.mes_vencimento || 1) - 1;
        let calcDia = rec.dia_vencimento || 1;
        let ultimoDiaMes = new Date(ano, mesVenc + 1, 0).getDate();
        if (calcDia > ultimoDiaMes) calcDia = ultimoDiaMes;
        targetDate = new Date(ano, mesVenc, calcDia);
     }

     // Supabase takes YYYY-MM-DD
     // Use local date parts to prevent timezone shift
     const targetStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth()+1).padStart(2,'0')}-${String(targetDate.getDate()).padStart(2,'0')}`;

     let startStr = targetStr;
     let endStr = targetStr;

     if (rec.frequencia === 'mensal') {
         startStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth()+1).padStart(2,'0')}-01`;
         let lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
         endStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth()+1).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;
     } else if (rec.frequencia === 'anual') {
         startStr = `${targetDate.getFullYear()}-01-01`;
         endStr = `${targetDate.getFullYear()}-12-31`;
     } else if (rec.frequencia === 'semanal') {
         let day = targetDate.getDay();
         let currentDayOfWeek = day === 0 ? 7 : day;
         let diffToMonday = targetDate.getDate() - currentDayOfWeek + 1;
         let start = new Date(targetDate.getFullYear(), targetDate.getMonth(), diffToMonday);
         startStr = `${start.getFullYear()}-${String(start.getMonth()+1).padStart(2,'0')}-${String(start.getDate()).padStart(2,'0')}`;
         let end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
         endStr = `${end.getFullYear()}-${String(end.getMonth()+1).padStart(2,'0')}-${String(end.getDate()).padStart(2,'0')}`;
     }
     
     // Duplication check
     let existing: any[] | null = null;
     const { data: existingWithRecorrenteId, error: checkError } = await supabase
        .from('transacoes')
        .select('id')
        .eq('profile_id', rec.profile_id)
        .eq('recorrente_id', rec.id)
        .gte('data', startStr)
        .lte('data', endStr);
     
     if (checkError && checkError.message.includes('recorrente_id')) {
         const { data: existingFallback } = await supabase
            .from('transacoes')
            .select('id')
            .eq('profile_id', rec.profile_id)
            .eq('descricao', rec.nome)
            // also matching tipo makes it safer
            .eq('tipo', rec.tipo)
            .gte('data', startStr)
            .lte('data', endStr);
         existing = existingFallback;
     } else {
         existing = existingWithRecorrenteId;
     }
     
     if (existing && existing.length > 0) {
        setDuplicateModal({ isOpen: true, rec, targetStr, valorFinal: valorCalculado });
        return;
     }

     await executeLaunch(rec, targetStr, valorCalculado);
  };

  const executeLaunch = async (rec: any, targetStr: string, valorFinal: number) => {
    const novaTransacao = {
      profile_id: rec.profile_id,
      descricao: rec.nome,
      valor: valorFinal,
      tipo: rec.tipo,
      tag_id: rec.tag_id,
      forma_pagamento: rec.forma_pagamento || 'Cartão de Crédito',
      data: targetStr,
      recorrente_id: rec.id
    };
    
    // update data
    const targetISO = `${targetStr}T12:00:00Z`;
    
    const { error: insErr } = await supabase.from('transacoes').insert([novaTransacao]);
    if (!insErr) {
      await supabase.from('transacoes_recorrentes').update({ ultima_lancada: targetISO }).eq('id', rec.id);
      fetchRecorrentes(); 
    } else {
      if (insErr.message.includes('recorrente_id')) {
         const fallbackNovaTransacao = { ...novaTransacao };
         delete (fallbackNovaTransacao as any).recorrente_id;
         const { error: retryErr } = await supabase.from('transacoes').insert([fallbackNovaTransacao]);
         if (!retryErr) {
            await supabase.from('transacoes_recorrentes').update({ ultima_lancada: targetISO }).eq('id', rec.id);
            fetchRecorrentes(); 
         } else {
            console.error(retryErr);
            alert('Erro ao lançar transação.');
         }
      } else {
         console.error(insErr);
         alert('Erro ao lançar transação.');
      }
    }
  };

  const handleExcluir = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const executarExclusao = async (id: string) => {
    setDeleteModal(null);
    // Remover a referência nas transações já lançadas para não dar erro de foreign key
    await supabase.from('transacoes').update({ recorrente_id: null }).eq('recorrente_id', id);
    
    const { error } = await supabase.from('transacoes_recorrentes').delete().eq('id', id);
    if (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir: " + error.message);
    } else {
      fetchRecorrentes();
    }
  };

  const formatPeriodText = (rec: any) => {
    if (rec.frequencia === 'diaria') return 'Todo dia';
    if (rec.frequencia === 'semanal') {
      const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      return `Toda ${dias[rec.dia_vencimento - 1] || 'Semana'}`;
    }
    if (rec.frequencia === 'mensal') return `Dia ${rec.dia_vencimento}`;
    if (rec.frequencia === 'anual') return `${String(rec.dia_vencimento).padStart(2,'0')}/${String(rec.mes_vencimento).padStart(2,'0')}`;
    return '';
  };

  return (
    <div className="p-[24px] max-w-[1200px] mx-auto flex flex-col gap-[24px]">
      <div className="flex flex-col items-center text-center gap-2">
        <h2 className="text-[22px] font-[800] text-[#0F172A] dark:text-white">Transações Recorrentes</h2>
      </div>

      <div className="flex flex-col items-center gap-[24px]">
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-[6px] rounded-[100px] px-[22px] py-[10px] text-white font-[700] text-[14px] shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-[1px] transition-transform cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
          >
            + Nova Recorrência <ChevronDown size={14} className="text-white" />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[100%] mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1E293B] rounded-[14px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-[6px] min-w-[200px] z-[100]"
              >
                <div 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setModalType('receita');
                    setEditingRec(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] hover:bg-[#DCFCE7] dark:bg-green-900/30 transition-all duration-200 cursor-pointer"
                >
                  <TrendingUp size={16} className="text-[#16A34A]" />
                  <span className="text-[14px] font-[600] text-[#16A34A]">Receita</span>
                </div>
                <div className="border-t border-[#F1F5F9] dark:border-[#334155] my-[4px]" />
                <div 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setModalType('despesa');
                    setEditingRec(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] hover:bg-[#FEE2E2] dark:bg-red-900/30 transition-all duration-200 cursor-pointer"
                >
                  <TrendingDown size={16} className="text-[#EF4444]" />
                  <span className="text-[14px] font-[600] text-[#EF4444]">Despesa</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-[40px] w-full">
        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-4 w-20 bg-slate-200 animate-pulse rounded"></div>
              <div className="h-[1px] w-full bg-[#F1F5F9] dark:bg-[#334155]" />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[16px]">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#1E293B] rounded-[24px] p-[20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-[12px] animate-pulse">
                  <div className="flex justify-between items-start gap-2">
                    <div className="h-5 w-32 bg-slate-200 rounded"></div>
                    <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="flex flex-col gap-[4px] mt-2">
                    <div className="h-6 w-24 bg-slate-200 rounded"></div>
                    <div className="h-4 w-28 bg-slate-200 rounded mt-1"></div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#F8FAFC] dark:border-[#0F172A]">
                    <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                    <div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : recorrentes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E293B] rounded-[32px] border-2 border-dashed border-[#E2E8F0] dark:border-[#334155]">
            <Repeat size={48} className="text-[#94A3B8] mb-4 opacity-20" />
            <p className="text-[#64748B] dark:text-[#94A3B8] font-medium">Nenhuma transação recorrente encontrada</p>
          </div>
        ) : (
          freqOptions.map(freq => {
            const items = recorrentes.filter(r => r.frequencia === freq.id);
            if (items.length === 0) return null;

            return (
              <div key={freq.id} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-[13px] font-[700] text-[#94A3B8] uppercase tracking-widest whitespace-nowrap">
                    {freq.label}
                  </h3>
                  <div className="h-[1px] w-full bg-[#F1F5F9] dark:bg-[#334155]" />
                </div>
                
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[16px]">
                  {items.map(rec => {
                    const status = getStatus(rec);
                    return (
                      <div key={rec.id} className="bg-white dark:bg-[#1E293B] rounded-[24px] p-[20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-[12px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all group">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[15px] font-[700] text-[#0F172A] dark:text-white leading-tight flex-1">{rec.nome}</h3>
                          {status === 'pago' && (
                            <span className="bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A] text-[10px] font-[700] px-[8px] py-[3px] rounded-[6px] shrink-0 uppercase tracking-wider">Pago</span>
                          )}
                          {status === 'pendente' && (
                            <span className="bg-[#FEF9C3] text-[#CA8A04] text-[10px] font-[700] px-[8px] py-[3px] rounded-[6px] shrink-0 uppercase tracking-wider">Pendente</span>
                          )}
                          {status === 'aguardando' && (
                            <span className="bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] text-[10px] font-[700] px-[8px] py-[3px] rounded-[6px] shrink-0 uppercase tracking-wider">Esperando</span>
                          )}
                        </div>

                        <div className="flex flex-col gap-[4px]">
                          {rec.valor === null ? (
                            <div className="text-[18px] font-[800] text-[#0F172A] dark:text-white">Valor Variável</div>
                          ) : (
                            <div className={`text-[18px] font-[800] ${rec.tipo === 'receita' ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                              {rec.tipo === 'receita' ? '+' : '-'} R$ {rec.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                          <div className="flex items-center gap-[6px] text-[12px] text-[#94A3B8]">
                            <Calendar size={13} />
                            <span>{formatPeriodText(rec)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#F8FAFC] dark:border-[#0F172A]">
                          <button 
                            onClick={() => iniciarLancamento(rec)}
                            className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] text-[12px] font-[700] transition-colors ${status === 'pendente' ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]' : 'bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#475569]'}`}
                          >
                            <Check size={14} />
                            Lançar
                          </button>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { setEditingRec(rec); setIsModalOpen(true); }}
                              className="p-2 text-[#94A3B8] hover:text-[#0F172A] dark:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#475569] dark:bg-[#334155] rounded-lg transition-colors"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => handleExcluir(rec.id)}
                              className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {variableValueModal?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px]" onClick={() => setVariableValueModal(null)} />
            <motion.div 
               initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} 
               className="bg-white dark:bg-[#1E293B] rounded-[24px] p-[24px] w-full max-w-[400px] z-[101] shadow-2xl"
            >
               <h3 className="text-[18px] font-[800] text-[#0F172A] dark:text-white mb-[4px]">Informar Valor da Transação</h3>
               <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mb-[20px]">Esta recorrência tem valor variável. Informe o valor para este lançamento.</p>
               
               <div className="mb-[20px]">
                  <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Valor</label>
                  <input 
                    type="text" 
                    value={formatarValor(variableValorStr)} 
                    onKeyDown={handleVariableValorKeyDown}
                    readOnly
                    className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[15px] font-[800] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                    autoFocus
                  />
               </div>

               <div className="flex gap-[12px]">
                 <button onClick={() => setVariableValueModal(null)} className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#E2E8F0] dark:hover:bg-[#475569] transition-colors">Cancelar</button>
                 <button 
                    onClick={() => {
                       const num = parseInt(variableValorStr) / 100;
                       if (num <= 0) return alert('Informe um valor acima de zero.');
                       setVariableValueModal(null);
                       iniciarLancamento(variableValueModal.rec, num);
                    }}
                    className="flex-1 bg-[#2563EB] text-white font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#1D4ED8] transition-all shadow-[0_4px_14px_rgba(37,99,235,0.3)] active:scale-[0.98]"
                 >
                    Confirmar Lançamento
                 </button>
               </div>
            </motion.div>
        </div>
      )}

      {duplicateModal?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px]" onClick={() => setDuplicateModal(null)} />
            <motion.div 
               initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} 
               className="bg-white dark:bg-[#1E293B] rounded-[24px] p-[24px] w-full max-w-[400px] z-[101] shadow-2xl text-center"
            >
               <div className="w-[48px] h-[48px] bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                  <TrendingUp className="text-[#EF4444]" size={24} />
               </div>
               <h3 className="text-[18px] font-[800] text-[#0F172A] dark:text-white mb-[12px]">Lançamento Duplicado?</h3>
               <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] mb-[24px]">Esta transação recorrente já foi lançada para o período atual. Deseja lançar novamente?</p>
               
               <div className="flex gap-[12px]">
                 <button onClick={() => setDuplicateModal(null)} className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#E2E8F0] dark:hover:bg-[#475569] transition-colors">Cancelar</button>
                 <button 
                    onClick={() => {
                       setDuplicateModal(null);
                       executeLaunch(duplicateModal.rec, duplicateModal.targetStr, duplicateModal.valorFinal);
                    }}
                    className="flex-1 bg-[#EF4444] text-white font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#DC2626] transition-all shadow-[0_4px_14px_rgba(239,68,68,0.3)] active:scale-[0.98]"
                 >
                    Lançar Mesmo Assim
                 </button>
               </div>
            </motion.div>
        </div>
      )}

      {deleteModal?.isOpen && deleteModal.id && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px]" onClick={() => setDeleteModal(null)} />
            <motion.div 
               initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} 
               className="bg-white dark:bg-[#1E293B] rounded-[24px] p-[24px] w-full max-w-[400px] z-[101] shadow-2xl text-center"
            >
               <div className="w-[48px] h-[48px] bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                  <Trash2 className="text-[#EF4444]" size={24} />
               </div>
               <h3 className="text-[18px] font-[800] text-[#0F172A] dark:text-white mb-[12px]">Excluir Recorrência</h3>
               <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] mb-[24px]">Tem certeza que deseja excluir esta recorrência? Suas transações já lançadas não serão afetadas.</p>
               
               <div className="flex gap-[12px]">
                 <button onClick={() => setDeleteModal(null)} className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#E2E8F0] dark:hover:bg-[#475569] transition-colors">Cancelar</button>
                 <button 
                    onClick={() => executarExclusao(deleteModal.id!)}
                    className="flex-1 bg-[#EF4444] text-white font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#DC2626] transition-all shadow-[0_4px_14px_rgba(239,68,68,0.3)] active:scale-[0.98]"
                 >
                    Sim, excluir
                 </button>
               </div>
            </motion.div>
        </div>
      )}

      <RecurringModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeProfileId={activeProfileId}
        recorrencia={editingRec}
        initialType={modalType}
        onSaved={fetchRecorrentes}
        categories={categories}
        tags={tags}
      />

    </div>
  );
};
