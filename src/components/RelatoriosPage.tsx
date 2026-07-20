import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, BarChart2, Edit, Trash2, TrendingUp, TrendingDown, ChevronDown, MoreVertical, Wallet, ChevronLeft, ChevronRight, Percent, Search, Tag, Pipette, Activity, FileText, X } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCategories } from '../hooks/useCategories';
import { useTransacoes } from '../hooks/useTransacoes';
import { useProfiles } from '../hooks/useProfiles';
import { COLORS, ICONS } from '../pages/Categories';
import IconPicker from './IconPicker';


const CategoryDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string | null; 
  onChange: (val: string | null) => void; 
  options: { value: string; label: string }[]; 
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full sm:w-auto min-w-[180px] z-[60]" ref={containerRef}>
      <div 
        className="w-full border border-[#E2E8F0] dark:border-[#1E293B] rounded-[100px] py-[6px] pl-[16px] pr-[12px] bg-[#F8FAFC] dark:bg-[#0B0F19] text-[13px] font-bold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-2">{selectedOption ? selectedOption.label : (placeholder || 'Todas as categorias')}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-[999] min-w-full w-max max-w-[280px] mt-2 bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[16px] shadow-lg overflow-y-auto max-h-60 flex flex-col py-1.5 custom-scrollbar">
          <div 
             className={`px-4 py-2 cursor-pointer font-bold transition-all text-[12px] uppercase tracking-wider whitespace-nowrap truncate ${value === null ? 'bg-[#F8FAFC] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#3B82F6]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-white'}`}
             onClick={() => { onChange(null); setIsOpen(false); }}
          >
            Todas as categorias
          </div>
          {options.map(opt => {
            const isSelected = value === opt.value;
            return (
              <div 
                key={opt.value}
                className={`px-4 py-2 cursor-pointer font-bold transition-all text-[12px] uppercase tracking-wider whitespace-nowrap truncate ${isSelected ? 'bg-[#F8FAFC] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#3B82F6]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-white'}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

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
  const [selectedCategoriaDespesaTags, setSelectedCategoriaDespesaTags] = useState<string | null>(null);
  const [selectedCategoriaReceitaTags, setSelectedCategoriaReceitaTags] = useState<string | null>(null);

  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [loadingRelatorios, setLoadingRelatorios] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelatorio, setEditingRelatorio] = useState<any>(null);

  // Form State
  const [formNome, setFormNome] = useState('');
  const [formTipo, setFormTipo] = useState<'receita' | 'despesa' | 'lucro'>('despesa');
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

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleSort = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
        dragItem.current = null;
        dragOverItem.current = null;
        return;
    }
    const _relatorios = [...relatorios];
    const draggedItemContent = _relatorios.splice(dragItem.current, 1)[0];
    _relatorios.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setRelatorios(_relatorios);
    
    if (activeProfileId) {
        localStorage.setItem(`relatoriosOrder_${activeProfileId}`, JSON.stringify(_relatorios.map(r => r.id)));
        
        // Tenta salvar no Supabase na coluna 'ordem'
        let hasError = false;
        let errorMessage = '';
        
        await Promise.all(_relatorios.map((rel, idx) => 
           supabase.from('relatorios_personalizados').update({ ordem: idx }).eq('id', rel.id).then(({ error }) => {
               if (error && !hasError) {
                   hasError = true;
                   errorMessage = error.message;
               }
           })
        ));

        if (hasError) {
            if (errorMessage.includes("column \"ordem\" of relation") || errorMessage.includes("Could not find the 'ordem' column")) {
                alert("A ordem está sendo salva apenas no seu navegador atual. Para salvar na nuvem e sincronizar em outros computadores, crie a coluna 'ordem' (tipo número) na tabela 'relatorios_personalizados' do Supabase.");
            } else {
                console.error("Erro ao salvar ordem no Supabase:", errorMessage);
            }
        }
    }
  };

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: string | null} | null>(null);

  const { profiles } = useProfiles();
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const isBusiness = activeProfile?.tipo === 'empresa';

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
      let sortedData = data || [];
      const savedOrderStr = localStorage.getItem(`relatoriosOrder_${activeProfileId}`);
      
      sortedData.sort((a, b) => {
         // Se a coluna ordem existir no banco e não for nula, tem precedência absoluta
         const temOrdemNoBanco = a.ordem !== undefined && a.ordem !== null && b.ordem !== undefined && b.ordem !== null;
         
         if (temOrdemNoBanco) {
            return a.ordem - b.ordem;
         }

         // Fallback para o Local Storage (se não houver coluna ordem no banco)
         if (savedOrderStr) {
             try {
                const savedOrder = JSON.parse(savedOrderStr);
                const indexA = savedOrder.indexOf(a.id);
                const indexB = savedOrder.indexOf(b.id);
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
             } catch (e) {}
         }
         return 0;
      });
      setRelatorios(sortedData);
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
    if (formCategoriasIds.length === 0 && formTipo !== 'lucro') return alert("Selecione pelo menos uma categoria.");
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
      categorias_ids: formTipo === 'lucro' && formCategoriasIds.length === 0 ? ['00000000-0000-0000-0000-000000000000'] : formCategoriasIds,
      calcular_margem: formCalcularMargem,
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
    setFormCategoriasIds((rel.categorias_ids || []).filter((id: string) => id !== '00000000-0000-0000-0000-000000000000'));
    setFormCalcularMargem(rel.calcular_margem || false);
    setFormIcone(rel.icone_representativo || null);
    setFormCor(rel.cor_representativa || null);
    setIsModalOpen(true);
  };

  const handleCreateRelatorio = (tipo: 'receita' | 'despesa' | 'lucro') => {
    setEditingRelatorio(null);
    setFormNome('');
    setFormTipo(tipo);
    setFormCategoriasIds([]);
    setFormCalcularMargem(tipo === 'lucro' ? true : false);
    setFormIcone(tipo === 'lucro' ? 'Wallet' : null);
    setFormCor(tipo === 'lucro' ? '#3B82F6' : null);
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const name = entry.payload?.nome || entry.name || 'Sem classificação';
      const value = Number(entry.value || 0);
      const itemTotal = entry.payload?.totalRef || 1;
      const percentage = (value / itemTotal) * 100;
      return (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-lg text-xs font-bold text-slate-800 dark:text-slate-200 z-[110]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.payload?.cor || entry.color }} />
            <span className="font-extrabold max-w-[150px] truncate" title={name}>{name}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-extrabold ml-4 whitespace-nowrap">
            R$ {formatarMoeda(value)} ({percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#2563EB', '#16A34A', '#EF4444', '#EAB308', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#d946ef'];

  const getChartData = (tipoTransacao: 'receita' | 'despesa', agrupamento: 'categoria' | 'tag', selectedCategoryId?: string | null) => {
    const cardCatIds = categories.filter(c => c.nome.toLowerCase() === 'cartão de crédito').map(c => c.id);
    const investCatIds = categories.filter(c => c.nome.toLowerCase() === 'investimentos').map(c => c.id);

    const txs = transacoes.filter(t => {
      if (t.tipo !== tipoTransacao) return false;
      if (t.tags?.categories?.id && cardCatIds.includes(t.tags.categories.id)) return false;
      
      if (tipoTransacao === 'receita' && isBusiness && t.tags?.categories?.nome) {
         const catNome = t.tags.categories.nome.toLowerCase();
         if (catNome === 'farmácia popular' || catNome === 'farmacia popular') return false;
      }
      
      if (agrupamento === 'tag' && selectedCategoryId) {
         if (t.tags?.categories?.id !== selectedCategoryId) return false;
      }
      return true;
    });

    const mapa = new Map<string, { id: string; nome: string; valor: number; cor: string }>();

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

       const curr = mapa.get(key) || { id: key, nome, valor: 0, cor };
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
    data.forEach(d => {
       (d as any).totalRef = total;
    });

    return { data, total };
  };

  const availableCategories = categories.filter(c => c.tipo === formTipo && c.nome.toLowerCase() !== 'cartão de crédito');
  const cardCatIds = categories.filter(c => c.nome.toLowerCase() === 'cartão de crédito').map(c => c.id);
  
  const totalReceitasPeriodo = transacoes.filter(t => {
    if (t.tipo !== 'receita') return false;
    if (t.tags?.categories?.id && cardCatIds.includes(t.tags.categories.id)) return false;
    if (isBusiness && t.tags?.categories?.nome) {
      const catNome = t.tags.categories.nome.toLowerCase();
      if (catNome === 'farmácia popular' || catNome === 'farmacia popular') return false;
    }
    return true;
  }).reduce((acc, curr) => acc + Number(curr.valor), 0);

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
                   className="flex items-center justify-center gap-0 md:gap-[8px] border border-[#E2E8F0] dark:border-[#1E293B] bg-transparent dark:bg-transparent text-[#2563EB] dark:text-[#3B82F6] hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] rounded-[100px] w-full md:w-auto h-[44px] md:h-auto px-[22px] py-[10px] font-bold text-[14px] shadow-sm transition-all group cursor-pointer"
                 >
                   <Plus size={20} strokeWidth={3} className="md:w-[15px] md:h-[15px] transition-transform group-hover:scale-110 mr-1 md:mr-0" />
                   <span className="uppercase">Novo Relatório</span>
                   <ChevronDown size={14} className={`text-[#64748B] dark:text-[#94A3B8] transition-transform group-hover:scale-110 ml-1 ${showNovoRelatorioMenu ? 'rotate-180' : ''}`} />
                 </button>

                 <AnimatePresence>
                   {showNovoRelatorioMenu && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setShowNovoRelatorioMenu(false)} />
                       <motion.div
                         initial={{ opacity: 0, y: -10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="absolute top-[100%] mt-2 right-0 bg-white dark:bg-[#0B0F19] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-xl p-2 min-w-[220px] z-[100] overflow-hidden"
                       >
                         <div 
                           onClick={() => handleCreateRelatorio('receita')}
                           className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer group"
                         >
                           <TrendingUp size={15} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                           <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Receita</span>
                         </div>
                         <div className="border-t border-slate-100 dark:border-[#1E293B] my-1" />
                         <div 
                           onClick={() => handleCreateRelatorio('despesa')}
                           className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer group"
                         >
                           <TrendingDown size={15} className="text-red-500 group-hover:scale-110 transition-transform" />
                           <span className="text-xs font-bold text-red-600 dark:text-red-400">Despesa</span>
                         </div>
                       </motion.div>
                     </>
                   )}
                 </AnimatePresence>
               </div>
            </div>

            {/* DATE & PERIOD SELECTOR */}
            {/* LADO CENTRO - DATE & PERIOD SELECTOR */}
            <div className="flex flex-col gap-[16px] w-full md:w-auto flex-1 justify-center items-center shrink-0 order-2 md:order-none">
              <div className="flex flex-row items-center gap-[12px] w-full md:w-auto justify-center">
                
                {periodoTipo === 'mensal' && (
                  <div className="relative flex-shrink-0">
                    <button 
                      onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
                      className="flex justify-between md:justify-center items-center gap-[8px] bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-full px-[20px] py-[8px] text-[14px] font-bold text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] hover:border-[#CBD5E1] dark:hover:border-[#334155] shadow-sm transition-all cursor-pointer group"
                    >
                      <span>{MESES[selectedMonth]}</span>
                      <ChevronDown size={14} className={`text-[#64748B] dark:text-[#94A3B8] transition-transform group-hover:scale-110 ${dropdownMesAberto ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {dropdownMesAberto && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setDropdownMesAberto(false)}></div>
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 md:left-1/2 md:-translate-x-1/2 mt-2 min-w-[200px] w-full md:w-auto bg-white dark:bg-[#0B0F19] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#1E293B] p-2 z-30"
                          >
                            <p className="px-3 py-2 text-[10px] font-bold text-[#9CA3AF] dark:text-[#64748B] uppercase tracking-widest">Selecionar Mês</p>
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
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                                      isActive 
                                        ? 'bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] text-[#2563EB] dark:text-[#3B82F6] font-bold shadow-sm' 
                                        : 'text-[#64748B] dark:text-[#94A3B8] font-medium hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-white'
                                    }`}
                                  >
                                    <span className="flex-1 text-left">{nome}</span>
                                    {isActive && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
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

                <div className="flex items-center justify-center">
                  {/* Ano Selector */}
                  <div className="flex justify-between md:justify-center items-center gap-[10px] bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-full px-[16px] py-[8px] w-full md:w-auto shadow-sm">
                    <button onClick={() => setSelectedYear(y => y - 1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-white transition-all cursor-pointer group">
                      <ChevronLeft size={14} className="transition-transform group-hover:scale-110" />
                    </button>
                    <span className="text-[14px] font-bold text-[#0F172A] dark:text-white min-w-[60px] text-center">
                      {selectedYear}
                    </span>
                    <button onClick={() => setSelectedYear(y => y + 1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-white transition-all cursor-pointer group">
                      <ChevronRight size={14} className="transition-transform group-hover:scale-110" />
                    </button>
                  </div>
                </div>

              </div>

              <div className="flex gap-2 justify-center w-full md:w-auto">
                <button
                  onClick={() => setPeriodoTipo('mensal')}
                  className={`flex-1 md:flex-none min-w-[100px] py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      periodoTipo === 'mensal'
                        ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]'
                        : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                    }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setPeriodoTipo('anual')}
                  className={`flex-1 md:flex-none min-w-[100px] py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      periodoTipo === 'anual'
                        ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]'
                        : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                    }`}
                >
                  Anual
                </button>
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
             return true;
           });

           const totalReceitas = validTxs.filter(t => {
             if (t.tipo !== 'receita') return false;
             if (isBusiness && t.tags?.categories?.nome) {
                const catNome = t.tags.categories.nome.toLowerCase();
                if (catNome === 'farmácia popular' || catNome === 'farmacia popular') return false;
             }
             return true;
           }).reduce((acc, curr) => acc + Number(curr.valor), 0);
           const totalDespesas = validTxs.filter(t => t.tipo === 'despesa').reduce((acc, curr) => acc + Number(curr.valor), 0);
           const saldoTotal = totalReceitas - totalDespesas;
           
           return (
             <>
               <div className="bg-gradient-to-b from-[#F0FDF4]/60 to-white dark:from-[#16A34A]/10 dark:to-[#0B0F19] rounded-[16px] p-[20px] border border-[#F1F5F9] dark:border-[#1E293B] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-[12px]">
                   <div className="flex justify-between items-center">
                       <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Receitas</h3>
                       <TrendingUp size={24} className="text-[#16A34A] shrink-0" />
                   </div>
                   <div className="text-[24px] font-[800] text-[#16A34A] mt-1">
                      R$ {formatarMoeda(totalReceitas)}
                   </div>
               </div>
               <div className="bg-gradient-to-b from-[#FEF2F2]/60 to-white dark:from-[#EF4444]/10 dark:to-[#0B0F19] rounded-[16px] p-[20px] border border-[#F1F5F9] dark:border-[#1E293B] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-[12px]">
                   <div className="flex justify-between items-center">
                       <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Despesas</h3>
                       <TrendingDown size={24} className="text-[#EF4444] shrink-0" />
                   </div>
                   <div className="text-[24px] font-[800] text-[#EF4444] mt-1">
                      R$ {formatarMoeda(totalDespesas)}
                   </div>
               </div>
               <div className="bg-gradient-to-b from-[#EFF6FF]/60 to-white dark:from-[#2563EB]/10 dark:to-[#0B0F19] rounded-[16px] p-[20px] border border-[#F1F5F9] dark:border-[#1E293B] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-[12px]">
                   <div className="flex justify-between items-center">
                       <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Saldo Total</h3>
                       <Wallet size={24} className={`${saldoTotal > 0 ? 'text-[#16A34A]' : saldoTotal < 0 ? 'text-[#EF4444]' : 'text-[#0F172A] dark:text-white'} shrink-0`} />
                   </div>
                   <div className="flex items-center gap-3">
                     <div className={`text-[24px] font-[800] mt-1 ${saldoTotal > 0 ? 'text-[#16A34A]' : saldoTotal < 0 ? 'text-[#EF4444]' : 'text-[#0F172A] dark:text-white'}`}>
                        R$ {formatarMoeda(saldoTotal)}
                     </div>
                     {/* removed percentage here as requested */}
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
            {relatorios.map((rel, index) => {
                // Cálculo 
                const catIds = rel.categorias_ids || [];
                let sum = 0;
                let displayCats = '';
                
                if (rel.tipo_relatorio === 'lucro') {
                   const validTxs = transacoes.filter(t => {
                     const catId = t.tags?.categories?.id;
                     const catNome = t.tags?.categories?.nome?.toLowerCase();
                     if (catId && cardCatIds.includes(catId)) return false;
                     if (catNome === 'investimentos') return false;
                     if (isBusiness && (catNome === 'farmácia popular' || catNome === 'farmacia popular')) return false;
                     return true;
                   });
                   const recs = validTxs.filter(t => t.tipo === 'receita').reduce((acc, curr) => acc + Number(curr.valor), 0);
                   const desps = validTxs.filter(t => t.tipo === 'despesa').reduce((acc, curr) => acc + Number(curr.valor), 0);
                   sum = recs - desps;
                   displayCats = 'Receitas - Despesas (Margem baseada nas Receitas)';
                } else {
                   const txs = transacoes.filter(t => {
                      if (t.tipo !== rel.tipo_relatorio) return false;
                      const txCatId = t.tags?.categories?.id;
                      return txCatId && catIds.includes(txCatId);
                   });
                   sum = txs.reduce((acc, curr) => acc + Number(curr.valor), 0);
                   const catsInReport = categories.filter(c => catIds.includes(c.id));
                   const formatList = catsInReport.map(c => c.nome);
                   displayCats = formatList.slice(0, 3).join(', ') + (formatList.length > 3 ? ` e mais ${formatList.length - 3}` : '');
                }
                const isReceita = rel.tipo_relatorio === 'receita' || rel.tipo_relatorio === 'lucro';

                return (
                  <div 
                     key={rel.id} 
                     draggable
                     onDragStart={() => {
                         setOpenMenuId(null);
                         dragItem.current = index;
                     }}
                     onDragEnter={() => dragOverItem.current = index}
                     onDragEnd={handleSort}
                     onDragOver={(e) => e.preventDefault()}
                     className="bg-white dark:bg-[#0B0F19] rounded-[16px] p-[16px] border border-[#F1F5F9] dark:border-[#1E293B] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-[12px] cursor-grab active:cursor-grabbing transition-all hover:border-[#E2E8F0] dark:hover:border-[#334155]"
                  >
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
                                     <div className="fixed inset-0 z-40" onPointerDown={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                                     <motion.div 
                                       initial={{opacity: 0, y: -10, scale: 0.95}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: -10, scale: 0.95}} transition={{duration: 0.15}}
                                       className="absolute top-[calc(100%+8px)] right-0 w-[140px] bg-white dark:bg-[#1E293B] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] p-[8px] z-50 flex flex-col gap-[4px]"
                                     >
                                       <button 
                                         onPointerDown={(e) => e.stopPropagation()}
                                         onClick={() => { setOpenMenuId(null); handleEdit(rel); }}
                                         className="flex items-center gap-[8px] p-[10px_12px] rounded-[10px] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors text-left text-[#64748B] dark:text-[#94A3B8]"
                                       >
                                         <Edit size={16} />
                                         <span className="text-[13px] font-[600]">Editar</span>
                                       </button>
                                       <button 
                                         onPointerDown={(e) => e.stopPropagation()}
                                         onClick={() => { setOpenMenuId(null); setDeleteModal({ isOpen: true, id: rel.id }); }}
                                         className="flex items-center gap-[8px] p-[10px_12px] rounded-[10px] hover:bg-[#FEF2F2] dark:hover:bg-red-500/10 transition-colors text-left text-[#EF4444]"
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
                          {rel.calcular_margem && (() => {
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
           const { data, total } = getChartData('despesa', graficoDespesasAgrupamento, selectedCategoriaDespesaTags);
           const availableCategorias = categories.filter(c => c.tipo === 'despesa' && c.nome.toLowerCase() !== 'cartão de crédito' && c.nome.toLowerCase() !== 'investimentos');
           return (
             <div className="bg-white dark:bg-[#0B0F19] rounded-[16px] p-[20px] border border-[#F1F5F9] dark:border-[#1E293B] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-[16px]">
                <h3 className="text-[18px] font-[700] text-[#0F172A] dark:text-white">Despesas por Categoria/Tag</h3>
                
                <div className="flex items-center gap-[12px] flex-wrap">
                  <div className="flex gap-2 justify-center w-full md:w-auto">
                    <button 
                      onClick={() => {
                        setGraficoDespesasAgrupamento('categoria');
                        setSelectedCategoriaDespesaTags(null);
                      }} 
                      className={`flex-1 md:flex-none min-w-[100px] py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                          graficoDespesasAgrupamento === 'categoria' 
                            ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]' 
                            : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                      }`}
                    >
                      Categoria
                    </button>
                    <button 
                      onClick={() => setGraficoDespesasAgrupamento('tag')} 
                      className={`flex-1 md:flex-none min-w-[100px] py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                          graficoDespesasAgrupamento === 'tag' 
                            ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]' 
                            : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                      }`}
                    >
                      Tags
                    </button>
                  </div>

                  {graficoDespesasAgrupamento === 'tag' && (
                     <CategoryDropdown 
                        value={selectedCategoriaDespesaTags} 
                        onChange={(val) => setSelectedCategoriaDespesaTags(val)} 
                        options={availableCategorias.map(c => ({ value: c.id, label: c.nome }))}
                     />
                  )}
                </div>

                {data.length > 0 ? (
                  <div className="flex flex-col xl:flex-row items-center justify-start gap-[24px] mt-2">
                    <div className="w-[180px] h-[180px] shrink-0 mx-auto xl:mx-0">
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
                            nameKey="nome"
                            style={{ outline: 'none' }}
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-[8px] flex-1 w-full max-h-[180px] overflow-y-auto pr-2 custom-scrollbar text-left">
                      {data.map((item, i) => (
                        <div 
                           key={i} 
                           className={`flex flex-col xl:flex-row xl:items-center xl:justify-between gap-1 xl:gap-4 w-full ${graficoDespesasAgrupamento === 'categoria' ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1E293B]/50 p-2 -ml-2 rounded-xl transition-all' : ''}`}
                           onClick={() => {
                              if (graficoDespesasAgrupamento === 'categoria') {
                                 if (item.id === 'Sem Classificação') {
                                    setSelectedCategoriaDespesaTags(null);
                                 } else {
                                    setSelectedCategoriaDespesaTags(item.id);
                                 }
                                 setGraficoDespesasAgrupamento('tag');
                              }
                           }}
                        >
                          <div className="flex items-center justify-start gap-[8px] truncate">
                            <div className="w-[12px] h-[12px] rounded-full shrink-0" style={{ backgroundColor: item.cor }}></div>
                            <span className="text-[13px] font-[600] text-[#0F172A] dark:text-white truncate" title={item.nome}>
                              {item.nome}
                              <span className="xl:hidden text-[13px] font-[700] text-[#64748B] dark:text-[#94A3B8] ml-2 shrink-0">
                                {((item.valor / total) * 100).toFixed(1)}%
                              </span>
                            </span>
                          </div>
                          <div className="hidden xl:block text-[13px] font-[700] text-[#64748B] dark:text-[#94A3B8] shrink-0">
                             {((item.valor / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-[16px] border border-dashed border-slate-200 dark:border-slate-800/70">
                     <TrendingDown size={24} className="text-[#94A3B8] mb-2" />
                     <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] font-medium">Nenhuma despesa neste período</p>
                  </div>
                )}
             </div>
           );
        })()}

        {/* GRÁFICO RECEITAS */}
        {(() => {
           const { data, total } = getChartData('receita', graficoReceitasAgrupamento, selectedCategoriaReceitaTags);
           const availableCategorias = categories.filter(c => {
             if (c.tipo !== 'receita') return false;
             const cNome = c.nome.toLowerCase();
             if (cNome === 'cartão de crédito' || cNome === 'investimentos') return false;
             if (isBusiness && (cNome === 'farmácia popular' || cNome === 'farmacia popular')) return false;
             return true;
           });
           return (
             <div className="bg-white dark:bg-[#0B0F19] rounded-[16px] p-[20px] border border-[#F1F5F9] dark:border-[#1E293B] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-[16px]">
                <h3 className="text-[18px] font-[700] text-[#0F172A] dark:text-white">Receitas por Categoria/Tag</h3>
                
                <div className="flex items-center gap-[12px] flex-wrap">
                  <div className="flex gap-2 justify-center w-full md:w-auto">
                    <button 
                      onClick={() => {
                        setGraficoReceitasAgrupamento('categoria');
                        setSelectedCategoriaReceitaTags(null);
                      }} 
                      className={`flex-1 md:flex-none min-w-[100px] py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                          graficoReceitasAgrupamento === 'categoria' 
                            ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]' 
                            : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                      }`}
                    >
                      Categoria
                    </button>
                    <button 
                      onClick={() => setGraficoReceitasAgrupamento('tag')} 
                      className={`flex-1 md:flex-none min-w-[100px] py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                          graficoReceitasAgrupamento === 'tag' 
                            ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]' 
                            : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                      }`}
                    >
                      Tags
                    </button>
                  </div>

                  {graficoReceitasAgrupamento === 'tag' && (
                     <CategoryDropdown 
                        value={selectedCategoriaReceitaTags} 
                        onChange={(val) => setSelectedCategoriaReceitaTags(val)} 
                        options={availableCategorias.map(c => ({ value: c.id, label: c.nome }))}
                     />
                  )}
                </div>

                {data.length > 0 ? (
                  <div className="flex flex-col xl:flex-row items-center justify-start gap-[24px] mt-2">
                    <div className="w-[180px] h-[180px] shrink-0 mx-auto xl:mx-0">
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
                            nameKey="nome"
                            style={{ outline: 'none' }}
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-[8px] flex-1 w-full max-h-[180px] overflow-y-auto pr-2 custom-scrollbar text-left">
                      {data.map((item, i) => (
                        <div 
                           key={i} 
                           className={`flex flex-col xl:flex-row xl:items-center xl:justify-between gap-1 xl:gap-4 w-full ${graficoReceitasAgrupamento === 'categoria' ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1E293B]/50 p-2 -ml-2 rounded-xl transition-all' : ''}`}
                           onClick={() => {
                              if (graficoReceitasAgrupamento === 'categoria') {
                                 if (item.id === 'Sem Classificação') {
                                    setSelectedCategoriaReceitaTags(null);
                                 } else {
                                    setSelectedCategoriaReceitaTags(item.id);
                                 }
                                 setGraficoReceitasAgrupamento('tag');
                              }
                           }}
                        >
                          <div className="flex items-center justify-start gap-[8px] truncate">
                            <div className="w-[12px] h-[12px] rounded-full shrink-0" style={{ backgroundColor: item.cor }}></div>
                            <span className="text-[13px] font-[600] text-[#0F172A] dark:text-white truncate" title={item.nome}>
                              {item.nome}
                              <span className="xl:hidden text-[13px] font-[700] text-[#64748B] dark:text-[#94A3B8] ml-2 shrink-0">
                                {((item.valor / total) * 100).toFixed(1)}%
                              </span>
                            </span>
                          </div>
                          <div className="hidden xl:block text-[13px] font-[700] text-[#64748B] dark:text-[#94A3B8] shrink-0">
                             {((item.valor / total) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-[16px] border border-dashed border-slate-200 dark:border-slate-800/70">
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
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px]"
           >
               <div className="absolute inset-0" onClick={() => setDeleteModal(null)} />
               <motion.div 
                  initial={{opacity: 0, scale: 0.95, y: 10}} 
                  animate={{opacity: 1, scale: 1, y: 0}} 
                  exit={{opacity: 0, scale: 0.95, y: 10}}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] p-[24px] w-full max-w-[400px] z-[101] shadow-2xl text-center"
               >
                  <div className="w-[48px] h-[48px] bg-[#FEF2F2] dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-[16px]">
                     <Trash2 className="text-[#EF4444]" size={24} />
                  </div>
                  <h3 className="text-[18px] font-[800] text-[#0F172A] dark:text-white mb-[12px]">Excluir Relatório</h3>
                  <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] font-[500] mb-[24px]">Tem certeza que deseja excluir? Suas transações ficarão intactas.</p>
                  
                  <div className="flex gap-[12px]">
                    <button onClick={() => setDeleteModal(null)} className="btn-cancelar flex-1">Cancelar</button>
                    <button 
                       onClick={() => executeDelete(deleteModal.id!)}
                       className="flex-1 bg-[#EF4444] text-white font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#DC2626] transition-all shadow-[0_4px_14px_rgba(239,68,68,0.3)] active:scale-[0.98]"
                    >
                       Sim, excluir
                    </button>
                  </div>
               </motion.div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px] z-[100] flex items-center justify-center p-4"
          >
            <div
              onClick={() => !submitting && setIsModalOpen(false)}
              className="absolute inset-0"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] w-full max-w-[460px] shadow-2xl z-[101] max-h-[80vh] overflow-y-auto custom-scrollbar"
            >
               <form onSubmit={(e) => { e.preventDefault(); handleSalvar(); }}>
               <div className="p-7">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <div className={`w-[44px] h-[44px] rounded-[14px] flex items-center justify-center text-white ${formTipo === 'receita' ? 'bg-[#10B981]' : formTipo === 'despesa' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'}`}>
                           {formTipo === 'receita' ? <TrendingUp size={22} strokeWidth={2.5} /> : formTipo === 'despesa' ? <TrendingDown size={22} strokeWidth={2.5} /> : <FileText size={22} strokeWidth={2.5} />}
                        </div>
                        <h2 className="text-[20px] font-[800] text-[#0F172A] dark:text-white tracking-tight">
                           {editingRelatorio ? 'Editar Relatório' : 'Novo Relatório'}
                        </h2>
                     </div>
                     <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] transition-colors"
                     >
                        <X size={18} />
                     </button>
                  </div>

                 <div className="space-y-6">
                  {/* NOME */}
                  <div>
                    <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] mb-2 uppercase tracking-wider">Nome do Relatório</label>
                    <input 
                      type="text" 
                      value={formNome}
                      onChange={e => setFormNome(e.target.value)}
                      placeholder="Ex: Custos de Moradia"
                      className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] px-5 py-4 text-[15px] font-[600] text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] transition-all"
                    />
                  </div>

                  {/* COR E ÍCONE REPRESENTATIVOS */}
                  <div className="flex flex-col gap-5">
                    {/* COR */}
                    <div className="flex flex-col gap-2">
                      <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Cor (Opcional)</label>
                      <div className="flex flex-wrap gap-2.5">
                        {COLORS.slice(0, 5).map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={(e) => { e.preventDefault(); setFormCor(color); }}
                            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
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
                            type="button"
                            onClick={(e) => { e.preventDefault(); colorInputRef.current?.click(); }}
                            className="flex items-center gap-1.5 bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-dashed border-[#CBD5E1] dark:border-[#475569] text-[#64748B] dark:text-[#94A3B8] rounded-[8px] py-1.5 px-3 text-[12px] font-bold hover:border-[#2563EB] hover:text-[#2563EB] transition-colors cursor-pointer whitespace-nowrap h-8"
                          >
                            <Pipette size={14} strokeWidth={2.5} /> Cor Livre
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ÍCONE */}
                    <div className="z-[60]">
                      <IconPicker 
                        value={formIcone} 
                        onChange={setFormIcone} 
                        color={formCor} 
                        optional={true}
                      />
                    </div>
                  </div>

                  {/* MULTISELECT CATEGORIAS */}
                  {formTipo !== 'lucro' && (
                  <div>
                    <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] mb-2 uppercase tracking-wider">
                       Categorias Incluídas ({formCategoriasIds.length})
                    </label>
                    {availableCategories.length === 0 ? (
                       <p className="text-[13px] font-medium text-[#94A3B8] bg-slate-50 dark:bg-[#0F172A] p-3 rounded-lg text-center border border-[#E2E8F0] dark:border-[#1E293B]">Nenhuma categoria encontrada para este tipo.</p>
                    ) : (
                       <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                           {availableCategories.map(cat => {
                              const isSelected = formCategoriasIds.includes(cat.id);
                              return (
                                 <button
                                    key={cat.id}
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); toggleCategoria(cat.id); }}
                                    className={`flex items-center gap-[8px] p-3 rounded-[12px] border-[1.5px] text-left transition-colors ${
                                       isSelected ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700 shadow-sm' : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B]'
                                    }`}
                                 >
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.cor }}/>
                                    <span className={`text-[13px] font-[700] truncate ${isSelected ? 'text-blue-900 dark:text-blue-200' : 'text-[#0F172A] dark:text-slate-200'}`}>{cat.nome}</span>
                                    <div className="ml-auto flex items-center justify-center shrink-0">
                                       <div className={`w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors ${
                                          isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#CBD5E1] dark:border-[#475569] bg-white dark:bg-[#0F172A]'
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
                  )}
                  
                  {/* CALCULAR MARGEM */}
                  <div className="flex items-start gap-3 p-4 bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px]">
                    <input 
                      type="checkbox" 
                      id="calcularMargem"
                      checked={formCalcularMargem}
                      onChange={(e) => setFormCalcularMargem(e.target.checked)}
                      className="mt-0.5 w-[18px] h-[18px] rounded-[4px] border-[#CBD5E1] dark:border-[#475569] dark:bg-[#1E293B] text-[#2563EB] focus:ring-[#2563EB] focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="calcularMargem" className="text-[14px] font-[700] text-[#0F172A] dark:text-white cursor-pointer select-none">
                      Calcular Margem 
                      <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] font-[500] block mt-1">Exibe a margem % em relação à receita total do período.</span>
                    </label>
                  </div>
               </div>

               <div className="mt-8 flex gap-[12px]">
                 <button 
                   type="button"
                   onClick={() => setIsModalOpen(false)} 
                   disabled={submitting}
                   className="btn-cancelar flex-1"
                 >
                    Cancelar
                 </button>
                 <button 
                    type="submit"
                    disabled={submitting}
                    className="btn-salvar flex-1"
                 >
                    {submitting ? 'Salvando...' : 'Salvar Relatório'}
                 </button>
               </div>
               </div>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default RelatoriosPage;
