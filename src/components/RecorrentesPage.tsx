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
        <h2 className="text-[22px] font-[800] text-[#0F172A]">Transações Recorrentes</h2>
        <p className="text-[13px] text-[#94A3B8]">Gerencie seus pagamentos e recebimentos agendados.</p>
      </div>

      <div className="flex flex-col items-center gap-[24px]">
        {/* Filtros em Pílulas */}
        <div className="flex p-1 bg-[#E2E8F0]/40 rounded-[100px] w-fit">
          <button 
            onClick={() => setActiveTab('todas')}
            className={`px-[16px] py-[6px] rounded-[100px] text-[13px] font-[600] transition-colors ${activeTab === 'todas' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setActiveTab('diaria')}
            className={`px-[16px] py-[6px] rounded-[100px] text-[13px] font-[600] transition-colors ${activeTab === 'diaria' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
          >
            Diárias
          </button>
          <button 
            onClick={() => setActiveTab('semanal')}
            className={`px-[16px] py-[6px] rounded-[100px] text-[13px] font-[600] transition-colors ${activeTab === 'semanal' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
          >
            Semanais
          </button>
          <button 
            onClick={() => setActiveTab('mensal')}
            className={`px-[16px] py-[6px] rounded-[100px] text-[13px] font-[600] transition-colors ${activeTab === 'mensal' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
          >
            Mensais
          </button>
          <button 
            onClick={() => setActiveTab('anual')}
            className={`px-[16px] py-[6px] rounded-[100px] text-[13px] font-[600] transition-colors ${activeTab === 'anual' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
          >
            Anuais
          </button>
        </div>

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
                className="absolute top-[100%] mt-2 left-1/2 -translate-x-1/2 bg-white rounded-[14px] border border-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-[6px] min-w-[200px] z-[100]"
              >
                <div 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setModalType('receita');
                    setEditingRec(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] hover:bg-[#DCFCE7] transition-all duration-200 cursor-pointer"
                >
                  <TrendingUp size={16} className="text-[#16A34A]" />
                  <span className="text-[14px] font-[600] text-[#16A34A]">Receita</span>
                </div>
                <div className="border-t border-[#F1F5F9] my-[4px]" />
                <div 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setModalType('despesa');
                    setEditingRec(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] hover:bg-[#FEE2E2] transition-all duration-200 cursor-pointer"
                >
                  <TrendingDown size={16} className="text-[#EF4444]" />
                  <span className="text-[14px] font-[600] text-[#EF4444]">Despesa</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[16px]">
        {loading ? (
          <p className="text-sm text-slate-500 col-span-full text-center py-10">Carregando...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-sm text-slate-500 col-span-full text-center py-10">Nenhuma transação recorrente encontrada.</p>
        ) : (
          filtrados.map(rec => {
            const status = getStatus(rec);
            
            return (
              <div key={rec.id} className="bg-white rounded-[20px] p-[20px] border-[1.5px] border-[#F1F5F9] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col gap-[12px]">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-[16px] font-[700] text-[#0F172A] leading-tight flex-1">{rec.nome}</h3>
                  {status === 'pago' && (
                    <span className="bg-[#DCFCE7] text-[#16A34A] text-[11px] font-[600] px-[8px] py-[4px] rounded-[8px] shrink-0">Pago</span>
                  )}
                  {status === 'pendente' && (
                    <span className="bg-[#FEF9C3] text-[#CA8A04] text-[11px] font-[600] px-[8px] py-[4px] rounded-[8px] shrink-0">Pendente</span>
                  )}
                  {status === 'aguardando' && (
                    <span className="bg-[#E2E8F0] text-[#64748B] text-[11px] font-[600] px-[8px] py-[4px] rounded-[8px] shrink-0">Aguardando</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-[6px]">
                  {/* Valor */}
                  {rec.valor === null ? (
                    <div className="text-[20px] font-[800] text-[#0F172A]">Valor Variável</div>
                  ) : (
                    <div className={`text-[20px] font-[800] ${rec.tipo === 'receita' ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                      {rec.tipo === 'receita' ? '+' : '-'} R$ {rec.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )}

                  {/* Vencimento */}
                  <div className="flex items-center gap-[6px] text-[13px] text-[#64748B] mt-1">
                    <Calendar size={14} />
                    <span>{formatPeriodText(rec)}</span>
                  </div>

                  {/* Período & Tags */}
                  <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
                    <div className="flex items-center gap-[6px] text-[13px] text-[#64748B]">
                      <Repeat size={14} />
                      <span className="capitalize">{rec.frequencia}</span>
                    </div>

                    <div className="flex items-center gap-[6px]">
                      {rec.categories && (
                        <div className="flex items-center gap-[4px] bg-[#F8FAFC] px-[6px] py-[2px] rounded-[6px]">
                          <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: rec.categories.cor }} />
                          <span className="text-[11px] text-[#0F172A] font-[600]">{rec.categories.nome}</span>
                        </div>
                      )}
                      {rec.tags && (
                        <div className="flex items-center gap-[4px] bg-[#F8FAFC] px-[6px] py-[2px] rounded-[6px]">
                          <TagIcon size={10} className="text-[#94A3B8]" />
                          <span className="text-[11px] text-[#0F172A] font-[500]">{rec.tags.nome}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Forma Pagamento */}
                  {rec.forma_pagamento && (
                    <div className="flex items-center gap-[6px] text-[13px] text-[#64748B]">
                      <CreditCard size={14} />
                      <span className="capitalize">{rec.forma_pagamento.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-[4px] pt-[12px] border-t border-[#F1F5F9]">
                  <button 
                    onClick={() => iniciarLancamento(rec)}
                    className="flex items-center gap-[6px] bg-[#2563EB] text-white px-[16px] py-[8px] rounded-[10px] text-[13px] font-[600] hover:bg-[#1D4ED8] transition-colors"
                  >
                    <Check size={14} />
                    Lançar
                  </button>
                  <div className="flex items-center gap-[8px]">
                    <button 
                      onClick={() => {
                        setEditingRec(rec);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center justify-center bg-[#F1F5F9] text-[#64748B] w-[34px] h-[34px] rounded-[10px] hover:bg-[#E2E8F0] transition-colors"
                      title="Editar"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleExcluir(rec.id)}
                      className="flex items-center justify-center bg-[#FEF2F2] text-[#EF4444] w-[34px] h-[34px] rounded-[10px] hover:bg-[#FEE2E2] transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {variableValueModal?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0F172A80] backdrop-blur-[4px]" onClick={() => setVariableValueModal(null)} />
            <motion.div 
               initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} 
               className="bg-white rounded-[24px] p-[24px] w-full max-w-[400px] z-[101] shadow-2xl"
            >
               <h3 className="text-[18px] font-[800] text-[#0F172A] mb-[4px]">Informar Valor da Transação</h3>
               <p className="text-[13px] text-[#64748B] mb-[20px]">Esta recorrência tem valor variável. Informe o valor para este lançamento.</p>
               
               <div className="mb-[20px]">
                  <label className="block text-[12px] font-[700] text-[#64748B] uppercase tracking-wider mb-[6px]">Valor</label>
                  <input 
                    type="text" 
                    value={formatarValor(variableValorStr)} 
                    onKeyDown={handleVariableValorKeyDown}
                    readOnly
                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[14px] p-[10px_14px] text-[15px] font-[800] bg-[#F8FAFC] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                    autoFocus
                  />
               </div>

               <div className="flex gap-[12px]">
                 <button onClick={() => setVariableValueModal(null)} className="flex-1 bg-[#F1F5F9] text-[#64748B] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#E2E8F0] transition-colors">Cancelar</button>
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
            <div className="absolute inset-0 bg-[#0F172A80] backdrop-blur-[4px]" onClick={() => setDuplicateModal(null)} />
            <motion.div 
               initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} 
               className="bg-white rounded-[24px] p-[24px] w-full max-w-[400px] z-[101] shadow-2xl text-center"
            >
               <div className="w-[48px] h-[48px] bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                  <TrendingUp className="text-[#EF4444]" size={24} />
               </div>
               <h3 className="text-[18px] font-[800] text-[#0F172A] mb-[12px]">Lançamento Duplicado?</h3>
               <p className="text-[14px] text-[#64748B] mb-[24px]">Esta transação recorrente já foi lançada para o período atual. Deseja lançar novamente?</p>
               
               <div className="flex gap-[12px]">
                 <button onClick={() => setDuplicateModal(null)} className="flex-1 bg-[#F1F5F9] text-[#64748B] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#E2E8F0] transition-colors">Cancelar</button>
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
            <div className="absolute inset-0 bg-[#0F172A80] backdrop-blur-[4px]" onClick={() => setDeleteModal(null)} />
            <motion.div 
               initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} 
               className="bg-white rounded-[24px] p-[24px] w-full max-w-[400px] z-[101] shadow-2xl text-center"
            >
               <div className="w-[48px] h-[48px] bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                  <Trash2 className="text-[#EF4444]" size={24} />
               </div>
               <h3 className="text-[18px] font-[800] text-[#0F172A] mb-[12px]">Excluir Recorrência</h3>
               <p className="text-[14px] text-[#64748B] mb-[24px]">Tem certeza que deseja excluir esta recorrência? Suas transações já lançadas não serão afetadas.</p>
               
               <div className="flex gap-[12px]">
                 <button onClick={() => setDeleteModal(null)} className="flex-1 bg-[#F1F5F9] text-[#64748B] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#E2E8F0] transition-colors">Cancelar</button>
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
