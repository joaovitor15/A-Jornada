import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, BarChart2, Edit, Trash2, TrendingUp, TrendingDown, ChevronDown, MoreVertical, Wallet, ChevronLeft, ChevronRight, Percent, Search, Tag, Pipette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCategories } from '../hooks/useCategories';
import { useTransacoes } from '../hooks/useTransacoes';
import { COLORS, ICONS } from '../pages/Categories';

interface RelatoriosPageProps {
  activeProfileId?: string;
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const RelatoriosPage = ({ activeProfileId }: RelatoriosPageProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [periodoTipo, setPeriodoTipo] = useState<'mensal' | 'anual'>('mensal');
  const [dropdownMesAberto, setDropdownMesAberto] = useState(false);
  
  const [graficoDespesasAgrupamento, setGraficoDespesasAgrupamento] = useState<'categoria' | 'tag'>('categoria');
  const [graficoReceitasAgrupamento, setGraficoReceitasAgrupamento] = useState<'categoria' | 'tag'>('categoria');

  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [loadingRelatorios, setLoadingRelatorios] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelatorio, setEditingRelatorio] = useState<any>(null);

  // Form State
  const [formNome, setFormNome] = useState('');
  const [formTipo, setFormTipo] = useState<'receita' | 'despesa'>('despesa');
  const [formCategoriasIds, setFormCategoriasIds] = useState<string[]>([]);
  const [formCalcularMargem, setFormCalcularMargem] = useState(false);
  const [formIcone, setFormIcone] = useState<string | null>(null);
  const [formCor, setFormCor] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Icon Selector
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const iconSelectorRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isIconDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (iconSelectorRef.current && !iconSelectorRef.current.contains(e.target as Node)) {
        setIsIconDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isIconDropdownOpen]);

  const [showNovoRelatorioMenu, setShowNovoRelatorioMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: string | null} | null>(null);

  const { categories } = useCategories(activeProfileId);
  const { transacoes, carregarTransacoesMes, carregarTransacoesAno } = useTransacoes();

  const fetchRelatorios = async () => {
    if (!activeProfileId) return;
    setLoadingRelatorios(true);
    const { data, error } = await supabase
      .from('relatorios_personalizados')
      .select('*')
      .eq('profile_id', activeProfileId)
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('Erro ao carregar relatórios', error);
    } else {
      setRelatorios(data || []);
    }
    setLoadingRelatorios(false);
  };

  useEffect(() => {
    fetchRelatorios();
  }, [activeProfileId]);

  useEffect(() => {
    if (activeProfileId) {
      if (periodoTipo === 'mensal') {
        carregarTransacoesMes(activeProfileId, selectedMonth + 1, selectedYear);
      } else {
        carregarTransacoesAno(activeProfileId, selectedYear);
      }
    }
  }, [activeProfileId, selectedMonth, selectedYear, periodoTipo]);

  const toggleCategoria = (catId: string) => {
    setFormCategoriasIds(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSalvar = async () => {
    if (!formNome.trim()) return alert("Informe um nome para o relatório.");
    if (formCategoriasIds.length === 0) return alert("Selecione pelo menos uma categoria.");
    if (!activeProfileId) return;

    setSubmitting(true);
    
    let iconeToSave = formIcone;
    let corToSave = formCor;

    const available = categories.filter(c => c.tipo === formTipo);
    if (!iconeToSave || !corToSave) {
       const firstCategory = available.find(c => c.id === formCategoriasIds[0]);
       if (firstCategory) {
           iconeToSave = iconeToSave || firstCategory.icone;
           corToSave = corToSave || firstCategory.cor;
       }
    }

    const payload = {
      profile_id: activeProfileId,
      nome_relatorio: formNome.trim(),
      tipo_relatorio: formTipo,
      categorias_ids: formCategoriasIds,
      calcular_margem: formTipo === 'despesa' ? formCalcularMargem : false,
      icone_representativo: iconeToSave,
      cor_representativa: corToSave
    };

    if (editingRelatorio) {
      let { error } = await supabase
        .from('relatorios_personalizados')
        .update(payload)
        .eq('id', editingRelatorio.id);

      if (error) {
         let p = { ...payload };
         let msgInfo = [];
         
         if (error.message.includes('calcular_margem')) {
            delete (p as any).calcular_margem;
            msgInfo.push("'calcular_margem'");
         }
         if (error.message.includes('icone_representativo') || error.message.includes('cor_representativa')) {
            delete (p as any).icone_representativo;
            delete (p as any).cor_representativa;
            msgInfo.push("'icone_representativo', 'cor_representativa'");
         }
         
         if (msgInfo.length > 0) {
            const { error: retryError } = await supabase.from('relatorios_personalizados').update(p).eq('id', editingRelatorio.id);
            if (retryError) alert("Erro ao atualizar: " + retryError.message);
            else {
               alert(`Relatório salvo, mas as colunas ${msgInfo.join(' e ')} precisam ser criadas no banco.`);
               setIsModalOpen(false);
               fetchRelatorios();
            }
         } else {
            alert("Erro ao atualizar: " + error.message);
         }
      }
      else {
        setIsModalOpen(false);
        fetchRelatorios();
      }
    } else {
      const { error } = await supabase
        .from('relatorios_personalizados')
        .insert([payload]);

      if (error) {
         let p = { ...payload };
         let msgInfo = [];
         
         if (error.message.includes('calcular_margem')) {
            delete (p as any).calcular_margem;
            msgInfo.push("'calcular_margem'");
         }
         if (error.message.includes('icone_representativo') || error.message.includes('cor_representativa')) {
            delete (p as any).icone_representativo;
            delete (p as any).cor_representativa;
            msgInfo.push("'icone_representativo', 'cor_representativa'");
         }
         
         if (msgInfo.length > 0) {
            const { error: retryError } = await supabase.from('relatorios_personalizados').insert([p]);
            if (retryError) alert("Erro ao criar: " + retryError.message);
            else {
               alert(`Relatório salvo, mas as colunas ${msgInfo.join(' e ')} precisam ser criadas no banco.`);
               setIsModalOpen(false);
               fetchRelatorios();
            }
         } else {
            alert("Erro ao criar: " + error.message);
         }
      }
      else {
        setIsModalOpen(false);
        fetchRelatorios();
      }
    }
    setSubmitting(false);
  };

  const handleEdit = (rel: any) => {
    setEditingRelatorio(rel);
    setFormNome(rel.nome_relatorio);
    setFormTipo(rel.tipo_relatorio);
    setFormCategoriasIds(rel.categorias_ids || []);
    setFormCalcularMargem(rel.calcular_margem || false);
    setFormIcone(rel.icone_representativo || null);
    setFormCor(rel.cor_representativa || null);
    setIsModalOpen(true);
  };

  const handleCreateRelatorio = (tipo: 'receita' | 'despesa') => {
    setEditingRelatorio(null);
    setFormNome('');
    setFormTipo(tipo);
    setFormCategoriasIds([]);
    setFormCalcularMargem(false);
    setFormIcone(null);
    setFormCor(null);
    setShowNovoRelatorioMenu(false);
    setIsModalOpen(true);
  };

  const executeDelete = async (id: string) => {
    const { error } = await supabase.from('relatorios_personalizados').delete().eq('id', id);
    if (!error) {
       fetchRelatorios();
       setDeleteModal(null);
    } else {
       alert("Erro ao excluir: " + error.message);
    }
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const COLORS = ['#2563EB', '#16A34A', '#EF4444', '#EAB308', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#d946ef'];

  const getChartData = (tipoTransacao: 'receita' | 'despesa', agrupamento: 'categoria' | 'tag') => {
    const cardCatIds = categories.filter(c => c.nome.toLowerCase() === 'cartão de crédito').map(c => c.id);
    const investCatIds = categories.filter(c => c.nome.toLowerCase() === 'investimentos').map(c => c.id);

    const txs = transacoes.filter(t => {
      if (t.tipo !== tipoTransacao) return false;
      if (t.tags?.categories?.id && cardCatIds.includes(t.tags.categories.id)) return false;
      if (t.tags?.categories?.id && investCatIds.includes(t.tags.categories.id)) return false;
      return true;
    });

    const mapa = new Map<string, { nome: string; valor: number; cor: string }>();

    txs.forEach(t => {
       let key = 'Sem Classificação';
       let nome = 'Sem Classificação';
       let cor = '#94A3B8';

       if (agrupamento === 'categoria') {
          if (t.tags?.categories?.id) {
             key = t.tags.categories.id;
             nome = t.tags.categories.nome || key;
             cor = t.tags.categories.cor || cor;
          }
       } else {
          if (t.tag_id && t.tags) {
             key = t.tag_id;
             nome = t.tags.nome || key;
          }
       }

       const curr = mapa.get(key) || { nome, valor: 0, cor };
       curr.valor += Number(t.valor);
       mapa.set(key, curr);
    });

    const data = Array.from(mapa.values()).filter(d => d.valor > 0).sort((a, b) => b.valor - a.valor);
    
    if (agrupamento === 'tag') {
       data.forEach((d, i) => {
          if (d.nome !== 'Sem Classificação') {
             d.cor = COLORS[i % COLORS.length];
          }
       });
    }

    const total = data.reduce((acc, curr) => acc + curr.valor, 0);

    return { data, total };
  };

  const availableCategories = categories.filter(c => c.tipo === formTipo && c.nome.toLowerCase() !== 'cartão de crédito');
  const cardCatIds = categories.filter(c => c.nome.toLowerCase() === 'cartão de crédito').map(c => c.id);
  const totalReceitasPeriodo = transacoes.filter(t => t.tipo === 'receita' && (!t.tags?.categories?.id || !cardCatIds.includes(t.tags.categories.id))).reduce((acc, curr) => acc + Number(curr.valor), 0);

  return (
    <div className="p-[24px] max-w-[1200px] mx-auto flex flex-col gap-[24px] pb-24">
      {/* HEADER */}
      <div className="flex flex-col items-start gap-2">
        <h2 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-3">
          <BarChart2 size={28} className="text-[#3B82F6]" /> 
          Relatórios
        </h2>
      </div>

      {/* FILTER & ADD BUTTON */}
      <div className="flex flex-col items-center justify-center gap-[16px] w-full mt-2">
         <div className="flex flex-col md:flex-row items-center justify-center gap-[12px] w-full relative">
            {/* ADD BTN */}
            <div className="order-1 md:order-none md:absolute md:right-0 w-full md:w-auto z-10 flex justify-center">
               <div className="relative w-full md:w-auto">
                 <button 
                   onClick={() => setShowNovoRelatorioMenu(!showNovoRelatorioMenu)}
                   className="w-full md:w-auto flex justify-center items-center gap-[6px] bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white px-[22px] py-[10px] rounded-[100px] text-[14px] font-[700] hover:-translate-y-[1px] transition-all shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                 >
                   <Plus size={16} />
                   Novo Relatório
                   <ChevronDown size={14} className={`transition-transform ml-1 ${showNovoRelatorioMenu ? 'rotate-180' : ''}`} />
                 </button>

                 <AnimatePresence>
                   {showNovoRelatorioMenu && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setShowNovoRelatorioMenu(false)} />
                       <motion.div 
                         initial={{opacity: 0, y: -10, scale: 0.95}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: -10, scale: 0.95}} transition={{duration: 0.15}}
                         className="absolute top-[calc(100%+8px)] w-[180px] left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 md:right-0 bg-white dark:bg-[#1E293B] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] p-[8px] z-50 flex flex-col gap-[4px]"
                       >
                         <button 
                           onClick={() => handleCreateRelatorio('receita')}
                           className="flex items-center gap-[8px] p-[10px_12px] rounded-[10px] hover:bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors text-left"
                         >
                           <TrendingUp size={16} className="text-[#16A34A]" />
                           <span className="text-[13px] font-[600] text-[#0F172A] dark:text-white">Receita</span>
                         </button>
                         <button 
                           onClick={() => handleCreateRelatorio('despesa')}
                           className="flex items-center gap-[8px] p-[10px_12px] rounded-[10px] hover:bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors text-left"
                         >
                           <TrendingDown size={16} className="text-[#EF4444]" />
                           <span className="text-[13px] font-[600] text-[#0F172A] dark:text-white">Despesa</span>
                         </button>
                       </motion.div>
                     </>
                   )}
                 </AnimatePresence>
               </div>
            </div>

            {/* DATE & PERIOD SELECTOR */}
            {/* LADO CENTRO - DATE & PERIOD SELECTOR */}
            <div className="flex flex-col gap-[12px] w-full md:w-auto flex-1 justify-center items-center shrink-0 order-2 md:order-none">
              <div className="flex flex-col md:flex-row items-center gap-[12px] w-full md:w-auto justify-center">

                <div className="order-2 md:order-1 flex items-center justify-center w-full md:w-auto">
                  {/* Mês Dropdown */}
                  {periodoTipo === 'mensal' && (
                    <div className="relative w-full md:w-auto flex-shrink-0">
                        <button 
                          onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
                          className="w-full md:w-auto flex justify-between md:justify-center items-center gap-[8px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[20px] py-[8px] text-[14px] font-[600] text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors cursor-pointer"
                        >
                          {MESES[selectedMonth]}
                          <ChevronDown size={14} className={`text-[#64748B] dark:text-[#94A3B8] transition-transform ${dropdownMesAberto ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {dropdownMesAberto && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setDropdownMesAberto(false)}></div>
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute left-0 right-0 md:right-auto mt-2 min-w-[200px] md:w-auto bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2 z-30"
                              >
                                <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Selecionar Mês</p>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1">
                                  {MESES.map((nome, i) => {
                                    const isActive = selectedMonth === i;
                                    return (
                                      <button 
                                        key={nome}
                                        onClick={() => {
                                          setSelectedMonth(i);
                                          setDropdownMesAberto(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                                          isActive 
                                            ? 'bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-white font-bold' 
                                            : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                      >
                                        <span className="flex-1 text-left">{nome}</span>
                                        {isActive && <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>}
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                  )}
                </div>
                
                <div className="order-1 md:order-2 flex items-center justify-center w-full md:w-auto">
                  {/* Ano Selector */}
                  <div className="flex justify-between md:justify-center items-center gap-[10px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[16px] py-[8px] w-full md:w-auto">
                    <button 
                      onClick={() => setSelectedYear(y => y - 1)} 
                      className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[14px] font-[600] text-[#0F172A] dark:text-white min-w-[60px] text-center">
                      {selectedYear}
                    </span>
                    <button 
                      onClick={() => setSelectedYear(y => y + 1)} 
                      className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-center w-full md:w-auto">
                {/* Toggle Mensal/Anual */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1E293B] p-1 rounded-[100px] border border-slate-200 dark:border-[#334155] shrink-0 w-full sm:w-auto">
                  <button 
                    onClick={() => setPeriodoTipo('mensal')} 
                    className={`flex-1 sm:flex-none px-[16px] py-[6px] rounded-full text-[13px] font-[700] transition-all cursor-pointer ${
                      periodoTipo === 'mensal' 
                        ? 'bg-white dark:bg-[#334155] text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Mensal
                  </button>
                  <button 
                    onClick={() => setPeriodoTipo('anual')} 
                    className={`flex-1 sm:flex-none px-[16px] py-[6px] rounded-full text-[13px] font-[700] transition-all cursor-pointer ${
                      periodoTipo === 'anual' 
                        ? 'bg-white dark:bg-[#334155] text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Anual
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-2">
        {(() => {
           const cardCatIds = categories.filter(c => c.nome.toLowerCase() === 'cartão de crédito').map(c => c.id);
           const investCatIds = categories.filter(c => c.nome.toLowerCase() === 'investimentos').map(c => c.id);
           const validTxs = transacoes.filter(t => {
             if (t.tags?.categories?.id && cardCatIds.includes(t.tags.categories.id)) return false;
             if (t.tags?.categories?.id && investCatIds.includes(t.tags.categories.id)) return false;
             return true;
           });

           const totalReceitas = validTxs.filter(t => t.tipo === 'receita').reduce((acc, curr) => acc + Number(curr.valor), 0);
           const totalDespesas = validTxs.filter(t => t.tipo === 'despesa').reduce((acc, curr) => acc + Number(curr.valor), 0);
           const saldoTotal = totalReceitas - totalDespesas;
           
           return (
             <>
               <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col gap-[12px]">
                   <div className="flex justify-between items-center">
                       <h3 className="text-[16px] font-[700] text-[#0F172A] dark:text-white">Receitas</h3>
                       <TrendingUp size={24} className="text-[#16A34A] shrink-0" />
                   </div>
                   <div className="text-[24px] font-[800] text-[#16A34A] mt-1">
                      R$ {formatarMoeda(totalReceitas)}
                   </div>
               </div>
               <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col gap-[12px]">
                   <div className="flex justify-between items-center">
                       <h3 className="text-[16px] font-[700] text-[#0F172A] dark:text-white">Despesas</h3>
                       <TrendingDown size={24} className="text-[#EF4444] shrink-0" />
                   </div>
                   <div className="text-[24px] font-[800] text-[#EF4444] mt-1">
                      R$ {formatarMoeda(totalDespesas)}
                   </div>
               </div>
               <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col gap-[12px]">
                   <div className="flex justify-between items-center">
                       <h3 className="text-[16px] font-[700] text-[#0F172A] dark:text-white">Saldo Total</h3>
                       <Wallet size={24} className={`${saldoTotal > 0 ? 'text-[#16A34A]' : saldoTotal < 0 ? 'text-[#EF4444]' : 'text-[#0F172A] dark:text-white'} shrink-0`} />
                   </div>
                   <div className={`text-[24px] font-[800] mt-1 ${saldoTotal > 0 ? 'text-[#16A34A]' : saldoTotal < 0 ? 'text-[#EF4444]' : 'text-[#0F172A] dark:text-white'}`}>
                      R$ {formatarMoeda(saldoTotal)}
                   </div>
               </div>
             </>
           );
        })()}
      </div>

      {/* GRID */}
      {loadingRelatorios ? (
        <p className="text-center text-[#94A3B8] text-[14px] py-10">Carregando relatórios...</p>
      ) : relatorios.length === 0 ? (
        <div className="text-center bg-white dark:bg-[#1E293B] p-12 rounded-[20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-sm flex flex-col items-center">
            <div className="w-[48px] h-[48px] bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <BarChart2 className="text-[#94A3B8]" size={24} />
            </div>
            <h3 className="text-[#0F172A] dark:text-white font-bold text-[16px] mb-2">Nenhum relatório criado</h3>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-[13px] max-w-sm">Você ainda não agrupou nenhuma categoria em um relatório personalizado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[16px] mt-2">
            {relatorios.map(rel => {
                // Cálculo 
                const catIds = rel.categorias_ids || [];
                const txs = transacoes.filter(t => {
                   if (t.tipo !== rel.tipo_relatorio) return false;
                   const txCatId = t.tags?.categories?.id;
                   return txCatId && catIds.includes(txCatId);
                });
                const sum = txs.reduce((acc, curr) => acc + Number(curr.valor), 0);

                const isReceita = rel.tipo_relatorio === 'receita';
                const catsInReport = categories.filter(c => catIds.includes(c.id));
                const formatList = catsInReport.map(c => c.nome);
                const displayCats = formatList.slice(0, 3).join(', ') + (formatList.length > 3 ? ` e mais ${formatList.length - 3}` : '');

                return (
                  <div key={rel.id} className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col gap-[12px]">
                      <div className="flex justify-between items-start">
                          {(() => {
                             const IconComponent = rel.icone_representativo ? ICONS.find(i => i.name === rel.icone_representativo)?.component || Tag : null;
                             const iconColor = rel.cor_representativa;
                             return (
                               <div className="flex items-center gap-[8px] w-3/4">
                                 {IconComponent && <IconComponent size={20} color={iconColor} className="shrink-0" />}
                                 <h3 className="text-[16px] font-[700] text-[#0F172A] dark:text-white truncate w-full" title={rel.nome_relatorio}>{rel.nome_relatorio}</h3>
                               </div>
                             );
                          })()}
                          
                          <div className="flex items-center gap-[6px] shrink-0">
                            {isReceita ? <TrendingUp size={20} className="text-[#16A34A] shrink-0 mr-1" /> : <TrendingDown size={20} className="text-[#EF4444] shrink-0 mr-1" />}
                            
                            <div className="relative">
                               <button 
                                 onClick={() => setOpenMenuId(openMenuId === rel.id ? null : rel.id)} 
                                 className="text-[#64748B] hover:text-[#0F172A] dark:text-white transition-colors p-1 -m-1" 
                                 title="Opções"
                               >
                                  <MoreVertical size={18} />
                               </button>

                               <AnimatePresence>
                                 {openMenuId === rel.id && (
                                   <>
                                     <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                     <motion.div 
                                       initial={{opacity: 0, y: -10, scale: 0.95}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: -10, scale: 0.95}} transition={{duration: 0.15}}
                                       className="absolute top-[calc(100%+8px)] right-0 w-[140px] bg-white dark:bg-[#1E293B] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] p-[8px] z-50 flex flex-col gap-[4px]"
                                     >
                                       <button 
                                         onClick={() => { setOpenMenuId(null); handleEdit(rel); }}
                                         className="flex items-center gap-[8px] p-[10px_12px] rounded-[10px] hover:bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors text-left text-[#64748B] dark:text-[#94A3B8]"
                                       >
                                         <Edit size={16} />
                                         <span className="text-[13px] font-[600]">Editar</span>
                                       </button>
                                       <button 
                                         onClick={() => { setOpenMenuId(null); setDeleteModal({ isOpen: true, id: rel.id }); }}
                                         className="flex items-center gap-[8px] p-[10px_12px] rounded-[10px] hover:bg-[#FEF2F2] transition-colors text-left text-[#EF4444]"
                                       >
                                         <Trash2 size={16} />
                                         <span className="text-[13px] font-[600]">Excluir</span>
                                       </button>
                                     </motion.div>
                                   </>
                                 )}
                               </AnimatePresence>
                            </div>
                          </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1 min-h-[36px]">
                          <div className="text-[24px] font-[800] text-[#0F172A] dark:text-white">
                             R$ {formatarMoeda(sum)}
                          </div>
                          {!isReceita && rel.calcular_margem && (() => {
                             const marginRaw = totalReceitasPeriodo > 0 ? (sum / totalReceitasPeriodo) * 100 : 0;
                             const marginStr = totalReceitasPeriodo > 0 ? marginRaw.toFixed(2).replace('.', ',') : "0,00";
                             const colorClass = marginRaw > 0 ? "text-[#16A34A]" : marginRaw < 0 ? "text-[#EF4444]" : "text-[#64748B] dark:text-[#94A3B8]";
                             
                             return (
                               <div className={`text-[24px] font-[800] ${colorClass}`}>
                                  {marginStr}%
                               </div>
                             );
                          })()}
                      </div>
                  </div>
                );
            })}
        </div>
      )}

      {/* SESSÃO DE GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        {/* GRÁFICO DESPESAS */}
        {(() => {
           const { data, total } = getChartData('despesa', graficoDespesasAgrupamento);
           return (
             <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col gap-[16px]">
                <h3 className="text-[18px] font-[700] text-[#0F172A] dark:text-white">Despesas por Categoria/Tag</h3>
                
                <div className="flex items-center gap-[12px]">
                  <button 
                    onClick={() => setGraficoDespesasAgrupamento('categoria')} 
                    className={`flex items-center justify-center rounded-[100px] py-[6px] px-[16px] text-[13px] font-[600] transition-all duration-200 ${
                        graficoDespesasAgrupamento === 'categoria' 
                          ? 'bg-[#EFF6FF] text-[#2563EB] border-[1.5px] border-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.2)]' 
                          : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:bg-[#334155]'
                    }`}
                  >
                    Categoria
                  </button>
                  <button 
                    onClick={() => setGraficoDespesasAgrupamento('tag')} 
                    className={`flex items-center justify-center rounded-[100px] py-[6px] px-[16px] text-[13px] font-[600] transition-all duration-200 ${
                        graficoDespesasAgrupamento === 'tag' 
                          ? 'bg-[#EFF6FF] text-[#2563EB] border-[1.5px] border-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.2)]' 
                          : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:bg-[#334155]'
                    }`}
                  >
                    Tags
                  </button>
                </div>

                {data.length > 0 ? (
                  <div className="flex flex-col sm:flex-row items-center justify-start gap-[24px] mt-2">
                    <div className="w-[180px] h-[180px] shrink-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                        <PieChart style={{ outline: 'none' }}>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="valor"
                            style={{ outline: 'none' }}
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => `R$ ${formatarMoeda(value)}`}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-[8px] flex-1 w-full max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                      {data.map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-[8px] truncate">
                            <div className="w-[12px] h-[12px] rounded-full shrink-0" style={{ backgroundColor: item.cor }}></div>
                            <span className="text-[13px] font-[600] text-[#0F172A] dark:text-white truncate" title={item.nome}>{item.nome}</span>
                          </div>
                          <div className="text-[13px] font-[700] text-[#64748B] dark:text-[#94A3B8] shrink-0">
                             {((item.valor / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-[16px] border border-dashed border-slate-200">
                     <TrendingDown size={24} className="text-[#94A3B8] mb-2" />
                     <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] font-medium">Nenhuma despesa neste período</p>
                  </div>
                )}
             </div>
           );
        })()}

        {/* GRÁFICO RECEITAS */}
        {(() => {
           const { data, total } = getChartData('receita', graficoReceitasAgrupamento);
           return (
             <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col gap-[16px]">
                <h3 className="text-[18px] font-[700] text-[#0F172A] dark:text-white">Receitas por Categoria/Tag</h3>
                
                <div className="flex items-center gap-[12px]">
                  <button 
                    onClick={() => setGraficoReceitasAgrupamento('categoria')} 
                    className={`flex items-center justify-center rounded-[100px] py-[6px] px-[16px] text-[13px] font-[600] transition-all duration-200 ${
                        graficoReceitasAgrupamento === 'categoria' 
                          ? 'bg-[#EFF6FF] text-[#2563EB] border-[1.5px] border-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.2)]' 
                          : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:bg-[#334155]'
                    }`}
                  >
                    Categoria
                  </button>
                  <button 
                    onClick={() => setGraficoReceitasAgrupamento('tag')} 
                    className={`flex items-center justify-center rounded-[100px] py-[6px] px-[16px] text-[13px] font-[600] transition-all duration-200 ${
                        graficoReceitasAgrupamento === 'tag' 
                          ? 'bg-[#EFF6FF] text-[#2563EB] border-[1.5px] border-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.2)]' 
                          : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:bg-[#334155]'
                    }`}
                  >
                    Tags
                  </button>
                </div>

                {data.length > 0 ? (
                  <div className="flex flex-col sm:flex-row items-center justify-start gap-[24px] mt-2">
                    <div className="w-[180px] h-[180px] shrink-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                        <PieChart style={{ outline: 'none' }}>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="valor"
                            style={{ outline: 'none' }}
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => `R$ ${formatarMoeda(value)}`}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-[8px] flex-1 w-full max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                      {data.map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-[8px] truncate">
                            <div className="w-[12px] h-[12px] rounded-full shrink-0" style={{ backgroundColor: item.cor }}></div>
                            <span className="text-[13px] font-[600] text-[#0F172A] dark:text-white truncate" title={item.nome}>{item.nome}</span>
                          </div>
                          <div className="text-[13px] font-[700] text-[#64748B] dark:text-[#94A3B8] shrink-0">
                             {((item.valor / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-[16px] border border-dashed border-slate-200">
                     <TrendingUp size={24} className="text-[#94A3B8] mb-2" />
                     <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] font-medium">Nenhuma receita neste período</p>
                  </div>
                )}
             </div>
           );
        })()}
      </div>

      {/* CONFIRM DELETE MODAL */}
      <AnimatePresence>
         {deleteModal?.isOpen && deleteModal.id && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-[#0F172A80] backdrop-blur-[4px]" onClick={() => setDeleteModal(null)} />
               <motion.div 
                  initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}}
                  className="bg-white dark:bg-[#1E293B] rounded-[24px] p-[24px] w-full max-w-[400px] z-[101] shadow-2xl text-center"
               >
                  <div className="w-[48px] h-[48px] bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-[16px]">
                     <Trash2 className="text-[#EF4444]" size={24} />
                  </div>
                  <h3 className="text-[18px] font-[800] text-[#0F172A] dark:text-white mb-[12px]">Excluir Relatório</h3>
                  <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] mb-[24px]">Tem certeza que deseja excluir? Suas transações ficarão intactas.</p>
                  
                  <div className="flex gap-[12px]">
                    <button onClick={() => setDeleteModal(null)} className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#E2E8F0] transition-colors">Cancelar</button>
                    <button 
                       onClick={() => executeDelete(deleteModal.id!)}
                       className="flex-1 bg-[#EF4444] text-white font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#DC2626] transition-all shadow-[0_4px_14px_rgba(239,68,68,0.3)] active:scale-[0.98]"
                    >
                       Sim, excluir
                    </button>
                  </div>
               </motion.div>
           </div>
         )}
      </AnimatePresence>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-[#0F172A80] backdrop-blur-[4px]" onClick={() => !submitting && setIsModalOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1E293B] rounded-[24px] w-full max-w-[500px] max-h-[90vh] flex flex-col z-[101] shadow-2xl overflow-hidden"
            >
               <div className="p-[24px] pt-[28px] border-b border-[#F1F5F9] dark:border-[#334155] shrink-0">
                  <h2 className="text-[20px] font-[800] text-[#0F172A] dark:text-white">
                     {editingRelatorio ? 'Editar Relatório' : 'Novo Relatório'} <span className="text-[#64748B] dark:text-[#94A3B8] text-[16px] font-medium ml-1">({formTipo === 'receita' ? 'Receita' : 'Despesa'})</span>
                  </h2>
               </div>

               <div className="p-[24px] flex-1 overflow-y-auto space-y-[20px]">
                  {/* NOME */}
                  <div>
                    <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Nome do Relatório</label>
                    <input 
                      type="text" 
                      value={formNome}
                      onChange={e => setFormNome(e.target.value)}
                      placeholder="Ex: Custos de Moradia"
                      className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[12px_14px] text-[15px] font-[600] text-[#0F172A] dark:text-white bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8] placeholder:font-[400] focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                    />
                  </div>

                  {/* COR E ÍCONE REPRESENTATIVOS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    {/* COR */}
                    <div className="flex flex-col gap-[8px]">
                      <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[2px]">Cor (Opcional)</label>
                      <div className="flex flex-wrap gap-[10px]">
                        {COLORS.slice(0, 5).map(color => (
                          <button
                            key={color}
                            onClick={(e) => { e.preventDefault(); setFormCor(color); }}
                            className="w-[28px] h-[28px] rounded-full flex items-center justify-center cursor-pointer transition-all"
                            style={{ 
                              backgroundColor: color,
                              boxShadow: formCor === color ? `0 0 0 3px ${color}` : 'none',
                              border: formCor === color ? '3px solid #FFFFFF' : 'none',
                              transform: formCor === color ? 'scale(1.1)' : 'scale(1)'
                            }}
                          />
                        ))}
                        <div className="relative">
                          <input 
                            ref={colorInputRef}
                            type="color" 
                            value={formCor || '#2563EB'}
                            onChange={e => setFormCor(e.target.value)} 
                            style={{ display: 'none' }}
                          />
                          <button 
                            onClick={(e) => { e.preventDefault(); colorInputRef.current?.click(); }}
                            className="flex items-center gap-1.5 bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-dashed border-[#CBD5E1] text-[#64748B] dark:text-[#94A3B8] rounded-[8px] py-[4px] px-[10px] text-[12px] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Pipette size={14} /> Cor Livre
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ÍCONE */}
                    <div className="flex flex-col gap-[8px]" ref={iconSelectorRef}>
                      <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[2px]">Ícone (Opcional)</label>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsIconDropdownOpen(prev => !prev);
                        }}
                        className="flex items-center justify-between w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[10px] px-[14px] py-[6px] min-h-[40px] cursor-pointer hover:border-[#2563EB] transition-colors"
                      >
                        <div className="flex items-center gap-[10px]">
                          <div 
                            className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center text-white bg-[#94A3B8]"
                            style={formCor ? { backgroundColor: formCor } : {}}
                          >
                            {(() => {
                              const SelectedIcon = formIcone ? ICONS.find(i => i.name === formIcone)?.component || Tag : Tag;
                              return <SelectedIcon size={14} />;
                            })()}
                          </div>
                          <span className="text-[13px] text-[#374151] dark:text-[#E2E8F0] font-medium capitalize">
                            {formIcone || 'Automático'}
                          </span>
                        </div>
                        <ChevronDown size={14} className="text-[#94A3B8]" />
                      </button>

                      <AnimatePresence>
                        {isIconDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full bg-[#FFFFFF] dark:bg-[#1E293B] border-[1px] border-[#E2E8F0] dark:border-[#334155] rounded-[10px] flex flex-col gap-[10px] overflow-hidden p-[12px] shadow-sm transform-origin-top absolute z-10 bottom-[10%]"
                          >
                            <div className="relative w-full">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                              <input
                                type="text"
                                placeholder="Buscar ícone..."
                                value={iconSearchTerm}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setIconSearchTerm(e.target.value)}
                                className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1px] border-[#E2E8F0] dark:border-[#334155] rounded-[8px] py-[8px] pr-[12px] pl-[34px] text-[13px] text-[#0F172A] dark:text-white focus:outline-none focus:border-[#2563EB] transition-all"
                              />
                            </div>
                            <div className="grid grid-cols-6 gap-[6px] overflow-y-auto max-h-[160px] icons-grid-scroll">
                              {ICONS.filter(icon => icon.label.toLowerCase().includes(iconSearchTerm.toLowerCase())).map(icon => {
                                const IconComponent = icon.component;
                                const isSelected = formIcone === icon.name;
                                return (
                                  <button 
                                    key={icon.name}
                                    title={icon.name}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setFormIcone(icon.name);
                                      setIsIconDropdownOpen(false);
                                      setIconSearchTerm('');
                                    }}
                                    className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] transition-all cursor-pointer"
                                    style={isSelected ? {
                                      backgroundColor: formCor || '#2563EB',
                                      color: '#FFFFFF'
                                    } : {
                                      backgroundColor: 'transparent',
                                      color: '#64748B'
                                    }}
                                  >
                                    <IconComponent size={18} />
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* MULTISELECT CATEGORIAS */}
                  <div>
                    <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
                       Categorias Incluídas ({formCategoriasIds.length})
                    </label>
                    {availableCategories.length === 0 ? (
                       <p className="text-[13px] text-[#94A3B8] bg-slate-50 p-3 rounded-lg text-center">Nenhuma categoria encontrada para este tipo.</p>
                    ) : (
                       <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                           {availableCategories.map(cat => {
                              const isSelected = formCategoriasIds.includes(cat.id);
                              return (
                                 <button
                                    key={cat.id}
                                    onClick={() => toggleCategoria(cat.id)}
                                    className={`flex items-center gap-[8px] p-[10px] rounded-[10px] border-[1.5px] text-left transition-colors ${
                                       isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white dark:bg-[#1E293B] border-slate-200 hover:bg-slate-50'
                                    }`}
                                 >
                                    <div className="w-[12px] h-[12px] rounded-full shrink-0" style={{ backgroundColor: cat.cor }}/>
                                    <span className={`text-[13px] font-[600] truncate text-[#0F172A] dark:text-white`}>{cat.nome}</span>
                                    <div className="ml-auto flex items-center justify-center shrink-0">
                                       <div className={`w-[18px] h-[18px] rounded-sm border-[1.5px] flex items-center justify-center transition-colors ${
                                          isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#CBD5E1] bg-white dark:bg-[#1E293B]'
                                       }`}>
                                          {isSelected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                       </div>
                                    </div>
                                 </button>
                              )
                           })}
                       </div>
                    )}
                  </div>
                  
                  {/* CALCULAR MARGEM */}
                  {formTipo === 'despesa' && (
                     <div className="flex items-start gap-[12px] p-[16px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px]">
                       <input 
                         type="checkbox" 
                         id="calcularMargem"
                         checked={formCalcularMargem}
                         onChange={(e) => setFormCalcularMargem(e.target.checked)}
                         className="mt-[2px] w-[18px] h-[18px] rounded-[4px] border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                       />
                       <label htmlFor="calcularMargem" className="text-[14px] font-[600] text-[#0F172A] dark:text-white cursor-pointer select-none">
                         Calcular Margem 
                         <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] font-normal block mt-1">Exibe a margem % em relação à receita total do período.</span>
                       </label>
                     </div>
                  )}
               </div>

               <div className="p-[24px] pt-[16px] bg-[#F8FAFC] dark:bg-[#0F172A] border-t border-[#F1F5F9] dark:border-[#334155] shrink-0 flex gap-[12px]">
                 <button 
                   onClick={() => setIsModalOpen(false)} 
                   disabled={submitting}
                   className="flex-1 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-slate-50 transition-colors disabled:opacity-50"
                 >
                    Cancelar
                 </button>
                 <button 
                    onClick={handleSalvar}
                    disabled={submitting}
                    className="flex-1 bg-[#2563EB] text-white font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#1D4ED8] transition-all shadow-[0_4px_14px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                 >
                    {submitting ? 'Salvando...' : 'Salvar Relatório'}
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
