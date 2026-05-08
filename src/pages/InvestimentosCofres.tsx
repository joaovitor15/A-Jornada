import React, { useState, useEffect } from 'react';
import { Shield, Plus, ChevronDown, CalendarDays, Flag, PiggyBank, X, Settings, Trash2, ArrowLeftRight, RotateCw, ArrowRight, MoreVertical, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';
import { Cofre, CofreType } from '../types';

interface InvestimentosCofresProps {
  activeProfileId?: string;
}

export function InvestimentosCofres({ activeProfileId }: InvestimentosCofresProps) {
  const [openSection, setOpenSection] = useState<string | null>('reserva');
  
  const [isNewCofreDropdownOpen, setIsNewCofreDropdownOpen] = useState(false);
  const [isCofreModalOpen, setIsCofreModalOpen] = useState(false);
  const [editingCofreId, setEditingCofreId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [cofreType, setCofreType] = useState<'reserva' | 'provisao' | 'meta'>('reserva');
  const [cofreName, setCofreName] = useState('');
  const [cofreLocal, setCofreLocal] = useState('');
  const [cofrePaymentType, setCofrePaymentType] = useState<'mensal' | 'anual'>('mensal');

  const [cofres, setCofres] = useState<Cofre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Modal de Transação
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedCofre, setSelectedCofre] = useState<Cofre | null>(null);
  
  // Modal de Reset de Provisão
  const [resetCofre, setResetCofre] = useState<Cofre | null>(null);
  
  const [operationMode, setOperationMode] = useState<'aportar' | 'resgatar'>('aportar');
  const [paymentMode, setPaymentMode] = useState<'mensal' | 'anual'>('mensal');
  
  const [inputValue, setInputValue] = useState('');
  const [objetivoValue, setObjetivoValue] = useState('');
  const [parcelaValue, setParcelaValue] = useState('');
  const [duracaoValue, setDuracaoValue] = useState('');
  const [vencimentoValue, setVencimentoValue] = useState('');

  useEffect(() => {
    if (activeProfileId) {
      fetchCofres();
    }
  }, [activeProfileId]);

  const confirmResetUtilizado = (c: Cofre) => {
    setResetCofre(c);
  };

  const handleResetUtilizado = async () => {
    if (!resetCofre) return;
    try {
      const { error } = await supabase
        .from('cofres')
        .update({ provisao_ja_utilizado: 0 })
        .eq('id', resetCofre.id);
      
      if (error) throw error;
      setCofres(prev => prev.map(c => c.id === resetCofre.id ? { ...c, provisao_ja_utilizado: 0 } : c));
      setResetCofre(null);
    } catch (err) {
      console.error('Erro ao resetar utilizado:', err);
    }
  };

  const fetchCofres = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cofres')
        .select('*')
        .eq('profile_id', activeProfileId);
      
      if (error && error.code !== 'PGRST205') throw error; // Ignora erro se tabela não existir ainda para não quebrar UI
      setCofres(data || []);
    } catch (error) {
      console.error('Erro ao buscar cofres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.new-cofre-dropdown-container')) {
        setIsNewCofreDropdownOpen(false);
      }
      if (!target.closest('.cofre-card-dropdown')) {
        setOpenDropdownId(null);
      }
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNewCofreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openCofreModal = (type: 'reserva' | 'provisao' | 'meta') => {
    setEditingCofreId(null);
    setCofreType(type);
    setCofreName('');
    setCofreLocal('');
    if (type === 'provisao') setCofrePaymentType('mensal');
    setIsCofreModalOpen(true);
  };

  const handleEditCofre = (cofre: Cofre) => {
    setEditingCofreId(cofre.id);
    setCofreType(cofre.type);
    setCofreName(cofre.name);
    setCofreLocal(cofre.local);
    if (cofre.type === 'provisao' && cofre.provisao_payment_type) {
      setCofrePaymentType(cofre.provisao_payment_type as 'mensal' | 'anual');
    }
    setIsCofreModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteCofre = async (id: string) => {
    try {
      const { error } = await supabase.from('cofres').delete().eq('id', id);
      if (error && error.code !== 'PGRST205') throw error;
      setCofres(prev => prev.filter(c => c.id !== id));
      setOpenDropdownId(null);
    } catch (error) {
      console.error('Erro ao deletar cofre:', error);
    }
  };

  const handleCreateCofre = async () => {
    if (!cofreName || !cofreLocal || !activeProfileId) return;

    const cofreData: any = {
      profile_id: activeProfileId,
      name: cofreName,
      local: cofreLocal,
      type: cofreType,
    };

    if (cofreType === 'provisao') {
      cofreData.provisao_payment_type = cofrePaymentType;
    }

    try {
      if (editingCofreId) {
        const { error } = await supabase
          .from('cofres')
          .update(cofreData)
          .eq('id', editingCofreId);
        
        if (error && error.code !== 'PGRST205') throw error;
        
        if (!error || error.code === 'PGRST205') {
          setCofres(prev => prev.map(c => c.id === editingCofreId ? { ...c, ...cofreData } : c));
        }
      } else {
        cofreData.saldo_atual = 0;
        cofreData.objetivo_total = 0;
        
        const { error } = await supabase
          .from('cofres')
          .insert([cofreData]);
        
        if (error) {
          if (error.code === 'PGRST205') {
            setCofres([{ ...cofreData, id: crypto.randomUUID() } as Cofre, ...cofres]);
          } else {
             throw error;
          }
        } else {
          fetchCofres();
        }
      }
      setIsCofreModalOpen(false);
      setEditingCofreId(null);
    } catch (error) {
      console.error('Erro ao salvar cofre:', error);
    }
  };

  const handleGenericCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (!val) {
      setter('');
      return;
    }
    const floatVal = parseFloat(val) / 100;
    setter(floatVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const formatInitialCurrency = (num: number) => {
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const parseCurrencyToNumber = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  const openTransactionModal = (cofre: Cofre) => {
    setSelectedCofre(cofre);
    setOperationMode('aportar');
    setInputValue('');
  
    if (cofre.type === 'provisao') {
      const isUnico = cofre.provisao_payment_type === 'unico' || cofre.provisao_payment_type === 'anual';
      setPaymentMode(isUnico ? 'anual' : 'mensal');
      if (isUnico) {
        setObjetivoValue(cofre.objetivo_total ? formatInitialCurrency(cofre.objetivo_total) : '');
        setVencimentoValue(cofre.provisao_vencimento || '');
      } else {
        const ciclos = cofre.provisao_total_ciclos || 12;
        const valParcela = (cofre.objetivo_total || 0) / ciclos;
        setParcelaValue(valParcela > 0 ? formatInitialCurrency(valParcela) : '');
        setDuracaoValue(ciclos.toString());
      }
    } else {
      setObjetivoValue(cofre.objetivo_total ? formatInitialCurrency(cofre.objetivo_total) : '');
    }
  
    setIsTransactionModalOpen(true);
  };
  
  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setTimeout(() => setSelectedCofre(null), 300);
  };

  const handleSaveTransaction = async () => {
    if (!selectedCofre) return;
    
    const vlrInput = parseCurrencyToNumber(inputValue);
    const vlrChange = operationMode === 'aportar' ? vlrInput : -vlrInput;
    const newSaldo = (selectedCofre.saldo_atual || 0) + vlrChange;
  
    let updates: any = {
      saldo_atual: newSaldo,
    };
  
    if (selectedCofre.type === 'provisao') {
      if (paymentMode === 'mensal') {
        const pVal = parseCurrencyToNumber(parcelaValue);
        const dVal = parseInt(duracaoValue) || 12;
        updates.provisao_payment_type = 'mensal';
        updates.objetivo_total = pVal * dVal;
        updates.provisao_total_ciclos = dVal;
        
        if (operationMode === 'resgatar') {
          updates.provisao_ja_utilizado = (selectedCofre.provisao_ja_utilizado || 0) + vlrInput;
        }
      } else {
        updates.provisao_payment_type = 'anual';
        updates.objetivo_total = parseCurrencyToNumber(objetivoValue);
        updates.provisao_vencimento = vencimentoValue;
      }
    } else {
      updates.objetivo_total = parseCurrencyToNumber(objetivoValue);
    }
  
    try {
      const { error } = await supabase
        .from('cofres')
        .update(updates)
        .eq('id', selectedCofre.id);
        
      if (error) throw error;
      
      // Update local state temporarily for snappy UI (ideal seria só refetch, mas assim fica mais rapido pro user)
      setCofres(cofres.map(c => c.id === selectedCofre.id ? { ...c, ...updates } : c));
      closeTransactionModal();
    } catch (error) {
      console.error('Erro ao atualizar cofre:', error);
    }
  };

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  const formatCurrency = (value: number) => {
    // Tratamento para evitar TypeError caso receba undefined ou null
    const safeValue = Number(value) || 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(safeValue);
  };

  // Separação dos cofres
  const reservas = cofres.filter(c => c.type === 'reserva');
  const metas = cofres.filter(c => c.type === 'meta');
  const provisoesMensais = cofres.filter(c => c.type === 'provisao' && (!c.provisao_payment_type || c.provisao_payment_type === 'mensal'));
  const provisoesAnuais = cofres.filter(c => c.type === 'provisao' && c.provisao_payment_type && c.provisao_payment_type !== 'mensal');

  // Cálculos agregados
  const totalReserva = reservas.reduce((acc, c) => acc + (Number(c.saldo_atual) || 0), 0);
  const totalReservaObjetivo = reservas.reduce((acc, c) => acc + (Number(c.objetivo_total) || 0), 0);
  
  const totalMeta = metas.reduce((acc, c) => acc + (Number(c.saldo_atual) || 0), 0);
  const totalMetaObjetivo = metas.reduce((acc, c) => acc + (Number(c.objetivo_total) || 0), 0);

  const totalProvisao = (provisoesMensais.reduce((acc, c) => acc + (Number(c.saldo_atual) || 0), 0) + provisoesAnuais.reduce((acc, c) => acc + (Number(c.saldo_atual) || 0), 0));
  const mensalidadeProvisoes = provisoesMensais.reduce((acc, c) => {
    const ciclos = c.provisao_total_ciclos || 12;
    const parcela = ciclos > 0 ? (Number(c.objetivo_total) || 0) / ciclos : 0;
    return acc + parcela;
  }, 0);
  const anualProvisoes = provisoesAnuais.reduce((acc, c) => acc + (Number(c.objetivo_total) || 0), 0);

  const totalGeral = totalReserva + totalMeta;
  const totalGeralObjetivo = totalReservaObjetivo + totalMetaObjetivo;
  const totalGeralPorcentagem = totalGeralObjetivo > 0 ? (totalGeral / totalGeralObjetivo) * 100 : 0;

  const getSaudeColor = (percent: number) => {
    if (percent >= 100) return '#10B981';
    if (percent >= 50) return '#3B82F6';
    if (percent > 0) return '#F59E0B';
    return '#E2E8F0';
  };

  const getTextColor = (type: CofreType) => {
    if (type === 'reserva') return 'text-[#10B981]';
    if (type === 'meta') return 'text-[#3B82F6]';
    return 'text-[#EF4444]';
  };

  const getFormatVencimento = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const [year, month] = dateStr.split('-');
    if (!year || !month) return dateStr;
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const monthName = months[parseInt(month, 10) - 1];
    return `${monthName} de ${year}`;
  };

  const calculateMonthsLeft = (dateStr?: string) => {
    if (!dateStr) return 0;
    const [year, month] = dateStr.split('-');
    if (!year || !month) return 0;
    const targetDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const diffMonths = (targetDate.getFullYear() - currentYear) * 12 + (targetDate.getMonth() - currentMonth);
    return Math.max(0, diffMonths);
  };

  const renderCardTemplate = (c: Cofre) => {
    const isProvisao = c.type === 'provisao';
    const isAnual = isProvisao && c.provisao_payment_type && c.provisao_payment_type !== 'mensal';
    const colorClass = getTextColor(c.type);
    const Icon = c.type === 'reserva' ? Shield : c.type === 'meta' ? Flag : CalendarDays;
    
    const percent = c.objetivo_total > 0 ? (c.saldo_atual / c.objetivo_total) * 100 : 0;
    const saudeColor = getSaudeColor(percent);
    const faltaValue = Math.max(0, c.objetivo_total - (c.saldo_atual || 0));
    
    // Provisão Mensal Calculations
    let valParcela = 0;
    let faltaNoCiclo = 0;
    let saldoCobreMeses = 0;
    let jaUtilizadoMeses = 0;
    let maxCiclos = c.provisao_total_ciclos || 12;

    // Provisão Anual Calculations
    let mesesFaltantes = 0;
    let aporteIdeal = 0;

    if (isProvisao && !isAnual) {
      valParcela = maxCiclos > 0 ? c.objetivo_total / maxCiclos : 0;
      const jaUtilizado = c.provisao_ja_utilizado || 0;
      jaUtilizadoMeses = valParcela > 0 ? Math.floor(jaUtilizado / valParcela) : 0;
      faltaNoCiclo = Math.max(0, c.objetivo_total - c.saldo_atual - jaUtilizado);
      saldoCobreMeses = valParcela > 0 ? Math.floor(c.saldo_atual / valParcela) : 0;
    } else if (isProvisao && isAnual) {
      mesesFaltantes = calculateMonthsLeft(c.provisao_vencimento);
      aporteIdeal = mesesFaltantes > 0 ? faltaValue / mesesFaltantes : faltaValue;
    }

    return (
      <div key={c.id} className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className={`flex items-center gap-2 mb-1 ${colorClass}`}>
              <Icon size={18} strokeWidth={3}/>
              <h3 className="font-[900] text-[14px] uppercase tracking-wider">{c.name}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[#94A3B8] font-[800] text-[10px] uppercase tracking-wider pl-[26px]">
               <PiggyBank size={12} strokeWidth={2.5} />
               {c.local}
            </div>
          </div>
          <div className="relative cofre-card-dropdown">
            <button 
              onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === c.id ? null : c.id); }}
              className="text-[#64748B] hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
            >
              <MoreVertical size={20} strokeWidth={2.5} />
            </button>
            
            <AnimatePresence>
              {openDropdownId === c.id && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-1 bg-white rounded-[12px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1.5 min-w-[140px] z-20"
                >
                  <button 
                    onClick={() => handleEditCofre(c)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-[#64748B] hover:bg-slate-50 hover:text-[#3B82F6] transition-colors"
                  >
                    <Settings size={14} strokeWidth={2.5} />
                    Configuração
                  </button>
                  <button 
                    onClick={() => handleDeleteCofre(c.id)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-[#64748B] hover:bg-red-50 hover:text-[#EF4444] transition-colors whitespace-nowrap"
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                    Excluir
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MIDDLE SECTION FOR PROVISOES */}
        {isProvisao && !isAnual && (
           <div className="grid grid-cols-2 gap-4 mb-6 relative mt-2">
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-slate-100"></div>

              <div className="pe-2 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 line-clamp-1">Falta no ciclo</p>
                <div className="text-[15px] font-black text-[#EF4444] leading-tight mb-0.5">{formatCurrency(faltaNoCiclo)}</div>
                <div className="text-[10px] font-semibold text-[#94A3B8]">(Saldo cobre: {saldoCobreMeses} meses)</div>
              </div>
              <div className="pl-2 text-center flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1 justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Já Utilizado</p>
                  <button onClick={() => confirmResetUtilizado(c)} className="text-[#EF4444] cursor-pointer hover:bg-red-50 p-1 rounded transition-colors" title="Resetar Já Utilizado">
                     <RotateCw size={12} strokeWidth={3} />
                  </button>
                </div>
                <div className="text-[15px] font-black text-[#EF4444] leading-tight mb-0.5">{formatCurrency(c.provisao_ja_utilizado || 0)} <span className="text-[12px] font-bold">({jaUtilizadoMeses}/{maxCiclos})</span></div>
              </div>
           </div>
        )}

        {isProvisao && isAnual && (
           <div className="grid grid-cols-2 gap-4 mb-6 relative mt-2">
               <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-slate-100"></div>
               <div className="pe-2 text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 line-clamp-1">Falta P/ Pagar</p>
                 <div className="text-[15px] font-black text-[#EF4444] leading-tight mb-0.5">{formatCurrency(faltaValue)}</div>
                 <div className="text-[10px] font-semibold text-[#94A3B8]">Faltam {mesesFaltantes} meses</div>
                 <div className="text-[10px] font-semibold text-[#94A3B8]">Ideal: {formatCurrency(aporteIdeal)}/mês</div>
               </div>
               <div className="pl-2 text-center flex flex-col items-center justify-center">
                 <div className="flex items-center gap-1 mb-1 justify-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vencimento</p>
                 </div>
                 <div className="text-[13px] font-black text-[#EF4444] leading-tight mb-0.5 uppercase tracking-wide">{getFormatVencimento(c.provisao_vencimento)}</div>
               </div>
           </div>
        )}

        {/* SALDO & OBJETIVO */}
        <div className="flex items-center justify-between mt-auto mb-8">
          <div className="text-center w-full">
            <p className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider mb-1">Saldo Atual</p>
            <div className="text-[18px] font-black text-[#0F172A] tracking-tight">{formatCurrency(c.saldo_atual)}</div>
          </div>
          
          <button 
            onClick={() => openTransactionModal(c)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#10B981] hover:bg-[#10B981]/10 transition-colors mx-2 shrink-0 cursor-pointer"
          >
             <ArrowLeftRight size={20} strokeWidth={3}/>
          </button>
          
          <div className="text-center w-full">
            <p className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider mb-1">Objetivo Total</p>
             <div className="text-[18px] font-black text-[#0F172A] tracking-tight">{formatCurrency(c.objetivo_total)}</div>
          </div>
        </div>

        {/* SAÚDE PROGRESS */}
        <div>
           <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-slate-600">Saúde do Cofre</span>
              <span className="text-[11px] font-bold text-slate-800">{percent.toFixed(1)}%</span>
           </div>
           {/* Progress Line */}
           <div className="w-full bg-[#F1F5F9] rounded-full h-2 mb-2 overflow-hidden flex">
              {percent > 0 && (
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: saudeColor }}
                />
              )}
           </div>
           <div className="flex justify-end">
              {percent >= 100 ? (
                <span className="text-[11px] font-bold text-slate-600">Objetivo Concluído ✓</span>
              ) : (
                <span className="text-[11px] font-bold text-slate-600 flex gap-1">Falta: <span className="text-slate-500">{formatCurrency(faltaValue > 0 ? faltaValue : 0)}</span></span>
              )}
           </div>
        </div>

      </div>
    );
  };


  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Shield size={24} className="text-[#10B981]" />
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Cofres & Provisões</h2>
          </div>
          <p className="text-[#64748B] text-sm font-medium">Separe o dinheiro da sobrevivência do dinheiro dos sonhos.</p>
        </div>
        
        <div className="relative new-cofre-dropdown-container w-full md:w-auto">
          <button 
            onClick={() => setIsNewCofreDropdownOpen(!isNewCofreDropdownOpen)}
            className="w-full flex items-center justify-center gap-[6px] bg-[#3B82F6] text-white px-[22px] py-[10px] rounded-[100px] text-[14px] font-bold shadow-[0_4px_14px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_18px_rgba(59,130,246,0.45)] hover:-translate-y-[1px] transition-all duration-200 cursor-pointer border-none"
          >
            <Plus size={18} strokeWidth={2.5} />
            NOVO COFRE
            <ChevronDown size={14} className="text-white ml-2" />
          </button>

          <AnimatePresence>
            {isNewCofreDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[100%] mt-2 right-0 md:left-1/2 md:-translate-x-1/2 bg-white rounded-[14px] border border-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-[6px] min-w-[240px] z-[100]"
              >
                <div 
                  onClick={() => {
                    setIsNewCofreDropdownOpen(false);
                    openCofreModal('reserva');
                  }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] hover:bg-[#DCFCE7] transition-all duration-200 cursor-pointer"
                >
                  <Shield size={16} className="text-[#10B981]" />
                  <span className="text-[14px] font-[600] text-[#10B981]">Reserva de Emergência</span>
                </div>
                <div className="border-t border-[#F1F5F9] my-[4px]" />
                <div 
                  onClick={() => {
                    setIsNewCofreDropdownOpen(false);
                    openCofreModal('provisao');
                  }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] hover:bg-[#FEE2E2] transition-all duration-200 cursor-pointer"
                >
                  <CalendarDays size={16} className="text-[#EF4444]" />
                  <span className="text-[14px] font-[600] text-[#EF4444]">Provisões</span>
                </div>
                <div className="border-t border-[#F1F5F9] my-[4px]" />
                <div 
                  onClick={() => {
                    setIsNewCofreDropdownOpen(false);
                    openCofreModal('meta');
                  }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] hover:bg-[#EFF6FF] transition-all duration-200 cursor-pointer"
                >
                  <Flag size={16} className="text-[#3B82F6]" />
                  <span className="text-[14px] font-[600] text-[#3B82F6]">Meta de Longo Prazo</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      {isLoading ? (
        <div className="text-center py-12 text-[#94A3B8] font-bold">Carregando...</div>
      ) : (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL GERAL */}
        <div className="bg-white rounded-[24px] p-6 border-l-[6px] border-l-[#64748B] border border-r-[#E2E8F0] border-t-[#E2E8F0] border-b-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#64748B] font-[800] text-[10px] uppercase tracking-wider mb-2">
              <PiggyBank size={14} />
              Total Geral
            </div>
            <div className="text-3xl font-black text-[#0F172A] tracking-tight mb-4">
              {formatCurrency(totalGeral)}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-[#E2E8F0] pt-4 mt-auto">
            <span className="text-[12px] text-[#64748B] font-bold">Objetivo: {formatCurrency(totalGeralObjetivo)}</span>
            <span className="text-[11px] font-[900] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{totalGeralPorcentagem.toFixed(1)}%</span>
          </div>
        </div>

        {/* RESERVA EMERGÊNCIA */}
        <div className="bg-white rounded-[24px] p-6 border-l-[6px] border-l-[#10B981] border border-r-[#E2E8F0] border-t-[#E2E8F0] border-b-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#94A3B8] font-[800] text-[10px] uppercase tracking-wider mb-2">
              <Shield size={14} className="text-[#10B981]" strokeWidth={3} />
              Reserva Emergência
            </div>
            <div className="text-3xl font-black text-[#0F172A] tracking-tight mb-4">
              {formatCurrency(totalReserva)}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-[#E2E8F0] pt-4 mt-auto">
            <span className="text-[12px] text-[#64748B] font-bold">Objetivo: {formatCurrency(totalReservaObjetivo)}</span>
            <span className="text-[11px] font-[900] bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded-md">
              {totalReservaObjetivo > 0 ? ((totalReserva / totalReservaObjetivo) * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>

        {/* PROVISÕES */}
        <div className="bg-white rounded-[24px] p-6 border-l-[6px] border-l-[#EF4444] border border-r-[#E2E8F0] border-t-[#E2E8F0] border-b-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#94A3B8] font-[800] text-[10px] uppercase tracking-wider mb-2">
              <CalendarDays size={14} className="text-[#EF4444]" strokeWidth={3} />
              Provisões (Saldo)
            </div>
            <div className="text-3xl font-black text-[#0F172A] tracking-tight mb-4">
              {formatCurrency(totalProvisao)}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-[#E2E8F0] pt-4 mt-auto">
            <span className="text-[12px] text-[#64748B] font-bold">Mensal: {formatCurrency(mensalidadeProvisoes)}</span>
            <span className="text-[12px] text-[#64748B] font-bold">Anual: {formatCurrency(anualProvisoes)}</span>
           </div>
        </div>

        {/* METAS */}
        <div className="bg-white rounded-[24px] p-6 border-l-[6px] border-l-[#3B82F6] border border-r-[#E2E8F0] border-t-[#E2E8F0] border-b-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#94A3B8] font-[800] text-[10px] uppercase tracking-wider mb-2">
              <Flag size={14} className="text-[#3B82F6]" strokeWidth={3} />
              Metas (Longo Prazo)
            </div>
            <div className="text-3xl font-black text-[#0F172A] tracking-tight mb-4">
              {formatCurrency(totalMeta)}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-[#E2E8F0] pt-4 mt-auto">
            <span className="text-[12px] text-[#64748B] font-bold">Objetivo: {formatCurrency(totalMetaObjetivo)}</span>
            <span className="text-[11px] font-[900] bg-[#3B82F6]/10 text-[#3B82F6] px-2 py-0.5 rounded-md">
              {totalMetaObjetivo > 0 ? ((totalMeta / totalMetaObjetivo) * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>
      </div>

      {/* LISTAGEM DE SEÇÕES */}
      <div className="space-y-6 pt-4">
        
        {/* RESERVA DE EMERGÊNCIA BLOCO */}
        <div className="bg-white/80 rounded-[24px] border border-[#E2E8F0] shadow-sm">
           <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                   <Shield className="text-[#10B981]" size={20} strokeWidth={2.5}/>
                 </div>
                 <h3 className="font-[900] text-[#0F172A] text-lg">Reserva de Emergência</h3>
              </div>
              <div className="text-right hidden sm:block">
                 <span className="font-bold text-[#10B981]">{formatCurrency(totalReserva)}</span>
                 <span className="text-[#94A3B8] text-sm font-medium"> / {formatCurrency(totalReservaObjetivo)}</span>
              </div>
           </div>
           <div className="p-6 bg-[#F8FAFC]/50 rounded-b-[24px]">
              {reservas.length === 0 ? (
                  <div className="text-center text-[#94A3B8] font-bold py-8">
                    Nenhum cofre de emergência criado ainda.
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reservas.map(renderCardTemplate)}
                  </div>
              )}
           </div>
        </div>

        {/* PROVISÕES BLOCO */}
        <div className="bg-white/80 rounded-[24px] border border-[#E2E8F0] shadow-sm">
           <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                   <CalendarDays className="text-[#EF4444]" size={20} strokeWidth={2.5}/>
                 </div>
                 <h3 className="font-[900] text-[#0F172A] text-lg">Provisões</h3>
              </div>
              <div className="text-right flex items-center gap-3 hidden sm:flex">
                 <span className="font-bold text-[#EF4444]">{formatCurrency(totalProvisao)}</span>
                 <div className="h-4 w-[1px] bg-[#E2E8F0]"></div>
                 <span className="text-xs text-[#94A3B8] font-semibold">Mensal: <span className="text-[#64748B]">{formatCurrency(mensalidadeProvisoes)}</span></span>
                 <span className="text-xs text-[#94A3B8] font-semibold">Anual: <span className="text-[#64748B]">{formatCurrency(anualProvisoes)}</span></span>
              </div>
           </div>
           <div className="p-6 bg-[#F8FAFC]/50 rounded-b-[24px] space-y-10">
              
              {/* Provisões Mensais */}
              <div>
                <div className="flex items-center mb-6">
                   <span className="bg-[#FEF3C7] text-[#F59E0B] text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl rounded-tl-none -ml-6 -mt-2">Planos Mensais</span>
                </div>
                {provisoesMensais.length === 0 ? (
                    <div className="text-center text-[#94A3B8] font-bold py-6">Nenhuma provisão mensal detalhada.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {provisoesMensais.map(renderCardTemplate)}
                    </div>
                )}
              </div>

              {/* Provisões Anuais / Únicas */}
              <div>
                <div className="flex items-center mb-6">
                   <span className="bg-[#FEF3C7] text-[#F59E0B] text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl rounded-tl-none -ml-6 border-t border-slate-100">Pagamentos Únicos / Anuais</span>
                </div>
                {provisoesAnuais.length === 0 ? (
                    <div className="text-center text-[#94A3B8] font-bold py-6">Nenhuma provisão anual detalhada.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {provisoesAnuais.map(renderCardTemplate)}
                    </div>
                )}
              </div>

           </div>
        </div>

        {/* METAS LONG PRAZO BLOCO */}
        <div className="bg-white/80 rounded-[24px] border border-[#E2E8F0] shadow-sm">
           <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                   <Flag className="text-[#3B82F6]" size={20} strokeWidth={2.5}/>
                 </div>
                 <h3 className="font-[900] text-[#0F172A] text-lg">Metas (Longo Prazo)</h3>
              </div>
              <div className="text-right hidden sm:block">
                 <span className="font-bold text-[#3B82F6]">{formatCurrency(totalMeta)}</span>
                 <span className="text-[#94A3B8] text-sm font-medium"> / {formatCurrency(totalMetaObjetivo)}</span>
              </div>
           </div>
           <div className="p-6 bg-[#F8FAFC]/50 rounded-b-[24px]">
              {metas.length === 0 ? (
                  <div className="text-center text-[#94A3B8] font-bold py-8">
                    Nenhuma meta detalhada ainda.
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metas.map(renderCardTemplate)}
                  </div>
              )}
           </div>
        </div>

      </div>
      </>
      )}

      {/* MODAL NOVO COFRE */}
      <AnimatePresence>
        {isCofreModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCofreModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[460px] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              <div className="p-7">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-[44px] h-[44px] rounded-[14px] flex items-center justify-center text-white ${
                      cofreType === 'reserva' ? 'bg-[#10B981]' : cofreType === 'provisao' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'
                    }`}>
                      {cofreType === 'reserva' ? <Shield size={22} strokeWidth={2.5} /> : cofreType === 'provisao' ? <CalendarDays size={22} strokeWidth={2.5} /> : <Flag size={22} strokeWidth={2.5} />}
                    </div>
                    <h2 className="text-[20px] font-black text-[#0F172A]">
                      {cofreType === 'reserva' ? (editingCofreId ? 'Editar Reserva' : 'Reserva de Emergência') : cofreType === 'provisao' ? (editingCofreId ? 'Editar Provisão' : 'Nova Provisão') : (editingCofreId ? 'Editar Meta' : 'Meta de Longo Prazo')}
                    </h2>
                  </div>
                  <button onClick={() => setIsCofreModalOpen(false)} className="text-[#64748B] hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer">
                    <X size={20} strokeWidth={3} />
                  </button>
                </div>

                <div className="space-y-6">
                  {cofreType === 'provisao' && (
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => setCofrePaymentType('mensal')}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-[100px] py-[8px] px-[16px] text-[14px] font-[700] transition-all duration-200 cursor-pointer ${
                          cofrePaymentType === 'mensal' ? 'bg-[#EFF6FF] text-[#3B82F6] border-[1.5px] border-[#3B82F6] shadow-[0_2px_8px_rgba(59,130,246,0.2)]' : 'bg-[#F8FAFC] text-[#64748B] border-[1.5px] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        Mensal
                      </button>
                      <button 
                        onClick={() => setCofrePaymentType('anual')}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-[100px] py-[8px] px-[16px] text-[14px] font-[700] transition-all duration-200 cursor-pointer ${
                          cofrePaymentType === 'anual' ? 'bg-[#EFF6FF] text-[#3B82F6] border-[1.5px] border-[#3B82F6] shadow-[0_2px_8px_rgba(59,130,246,0.2)]' : 'bg-[#F8FAFC] text-[#64748B] border-[1.5px] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        Anual
                      </button>
                    </div>
                  )}

                  {/* NOME */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#64748B] mb-2 uppercase tracking-wider">Nome</label>
                    <input 
                      type="text" 
                      value={cofreName}
                      onChange={e => setCofreName(e.target.value)}
                      placeholder={cofreType === 'reserva' ? 'Ex: Caixa Rápido' : cofreType === 'provisao' ? 'Ex: IPVA' : 'Ex: Viagem Europa'}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] px-5 py-4 text-[15px] font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      autoFocus
                    />
                  </div>

                  {/* LOCAL */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#64748B] mb-2 uppercase tracking-wider">Local/Banco</label>
                    <input 
                      type="text" 
                      value={cofreLocal}
                      onChange={e => setCofreLocal(e.target.value)}
                      placeholder="Ex: Caixinha Nubank"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] px-5 py-4 text-[15px] font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => setIsCofreModalOpen(false)}
                    className="flex-1 px-4 py-4 rounded-[14px] border border-[#E2E8F0] text-[#64748B] font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleCreateCofre}
                    disabled={!cofreName || !cofreLocal}
                    className={`flex-[2] px-4 py-4 rounded-[14px] text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-sm hover:shadow-md ${
                      cofreType === 'reserva' ? 'bg-[#10B981] hover:bg-[#059669]' : cofreType === 'provisao' ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#3B82F6] hover:bg-[#2563EB]'
                    }`}
                  >
                    {editingCofreId ? 'Salvar Alterações' : 'Salvar Cofre'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE TRANSAÇÃO (APORTAR/RESGATAR) */}
      <AnimatePresence>
        {isTransactionModalOpen && selectedCofre && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeTransactionModal}
              className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-7 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-5 relative">
                  <h2 className="text-[18px] font-black text-[#0F172A] w-full text-center uppercase tracking-tight">{selectedCofre.name}</h2>
                  <button onClick={closeTransactionModal} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#64748B] hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer">
                    <X size={20} strokeWidth={3} />
                  </button>
                </div>

                <div className="flex gap-2 w-full mb-6">
                  <button 
                    onClick={() => setOperationMode('aportar')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-[100px] py-[8px] px-[16px] text-[14px] font-[700] transition-all duration-200 cursor-pointer ${
                      operationMode === 'aportar' ? 'bg-[#DCFCE7] text-[#16A34A] border-[1.5px] border-[#16A34A] shadow-[0_2px_8px_rgba(22,163,74,0.2)]' : 'bg-[#F8FAFC] text-[#64748B] border-[1.5px] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    Aportar (Guardar)
                  </button>
                  <button 
                    onClick={() => setOperationMode('resgatar')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-[100px] py-[8px] px-[16px] text-[14px] font-[700] transition-all duration-200 cursor-pointer ${
                      operationMode === 'resgatar' ? 'bg-[#FEE2E2] text-[#EF4444] border-[1.5px] border-[#EF4444] shadow-[0_2px_8px_rgba(239,68,68,0.2)]' : 'bg-[#F8FAFC] text-[#64748B] border-[1.5px] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    Resgatar (Tirar)
                  </button>
                </div>
                
                <div className="w-full space-y-5">
                {selectedCofre.type !== 'provisao' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                      <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">Valor (R$)</label>
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => handleGenericCurrencyChange(e, setInputValue)}
                        placeholder="0,00"
                        className="w-full border-2 border-[#E2E8F0] rounded-full text-center py-3 text-[18px] font-black text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all placeholder:text-[#CBD5E1]"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">Objetivo Total (R$)</label>
                      <input 
                        type="text" 
                        value={objetivoValue}
                        onChange={(e) => handleGenericCurrencyChange(e, setObjetivoValue)}
                        placeholder="0,00"
                        className="w-full border-2 border-[#E2E8F0] rounded-full text-center py-3 text-[18px] font-black text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all placeholder:text-[#CBD5E1]"
                      />
                    </div>
                  </div>
                )}

                {selectedCofre.type === 'provisao' && paymentMode === 'mensal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center">
                        <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">Valor (R$)</label>
                        <input 
                          type="text" 
                          value={inputValue}
                          onChange={(e) => handleGenericCurrencyChange(e, setInputValue)}
                          placeholder="0,00"
                          className="w-full border-2 border-[#E2E8F0] rounded-full text-center py-3 text-[18px] font-black text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all placeholder:text-[#CBD5E1]"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">Valor da Parcela (R$)</label>
                        <input 
                          type="text" 
                          value={parcelaValue}
                          onChange={(e) => handleGenericCurrencyChange(e, setParcelaValue)}
                          placeholder="0,00"
                          className="w-full border-2 border-[#E2E8F0] rounded-full text-center py-3 text-[18px] font-black text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all placeholder:text-[#CBD5E1]"
                        />
                      </div>
                    </div>
                    <div className="px-12">
                      <div className="flex flex-col items-center">
                        <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">Duração (Meses)</label>
                        <input 
                          type="text" 
                          value={duracaoValue}
                          onChange={(e) => setDuracaoValue(e.target.value.replace(/\D/g, ''))}
                          placeholder="12"
                          className="w-full border-2 border-[#E2E8F0] rounded-full text-center py-3 text-[18px] font-black text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all placeholder:text-[#CBD5E1]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedCofre.type === 'provisao' && paymentMode === 'anual' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center">
                        <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">Valor (R$)</label>
                        <input 
                          type="text" 
                          value={inputValue}
                          onChange={(e) => handleGenericCurrencyChange(e, setInputValue)}
                          placeholder="0,00"
                          className="w-full border-2 border-[#E2E8F0] rounded-full text-center py-3 text-[18px] font-black text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all placeholder:text-[#CBD5E1]"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">Valor Total (R$)</label>
                        <input 
                          type="text" 
                          value={objetivoValue}
                          onChange={(e) => handleGenericCurrencyChange(e, setObjetivoValue)}
                          placeholder="0,00"
                          className="w-full border-2 border-[#E2E8F0] rounded-full text-center py-3 text-[18px] font-black text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all placeholder:text-[#CBD5E1]"
                        />
                      </div>
                    </div>
                    <div className="px-4">
                      <div className="flex flex-col items-center">
                        <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">Vencimento</label>
                        <input 
                          type="month" 
                          value={vencimentoValue}
                          onChange={(e) => setVencimentoValue(e.target.value)}
                          className="w-full border-2 border-[#E2E8F0] rounded-full text-center px-4 py-3 text-[16px] font-black text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all uppercase"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(() => {
                  const valChangeNumber = parseCurrencyToNumber(inputValue);
                  const currentSaldoNumber = selectedCofre.saldo_atual || 0;
                  const novoSaldoNumber = currentSaldoNumber + (operationMode === 'aportar' ? valChangeNumber : -valChangeNumber);
                  
                  return (
                    <div className="bg-[#F8FAFC] rounded-[16px] p-4 flex items-center justify-center gap-6 border border-[#E2E8F0]/80">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-1">Saldo Atual</p>
                        <p className="text-[16px] font-black text-[#0F172A]">{formatCurrency(currentSaldoNumber)}</p>
                      </div>
                      <ArrowRight size={20} className="text-[#CBD5E1]" />
                      <div className="text-center">
                        <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider mb-1">Novo Saldo</p>
                        <p className={`text-[16px] font-black ${novoSaldoNumber < 0 ? 'text-[#EF4444]' : 'text-[#0F172A]'}`}>{formatCurrency(novoSaldoNumber)}</p>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-3 w-full mt-2">
                  <button 
                    onClick={closeTransactionModal}
                    className="flex-1 py-4 rounded-[16px] font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button 
                    onClick={handleSaveTransaction}
                    className={`flex-1 py-4 rounded-[16px] font-bold text-white transition-all transform hover:-translate-y-0.5 ${
                      operationMode === 'resgatar' ? 'bg-[#EF4444] hover:bg-[#DC2626] shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)]' : 'bg-[#10B981] hover:bg-[#059669] shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)]'
                    }`}
                  >
                    CONFIRMAR
                  </button>
                </div>
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE CONFIRMAÇÃO DE RESET */}
      <AnimatePresence>
        {resetCofre && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResetCofre(null)}
              className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[400px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col p-7 items-center text-center"
            >
              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <RotateCw size={28} className="text-[#EF4444]" strokeWidth={2.5} />
              </div>
              <h3 className="text-[18px] font-black text-[#0F172A] mb-2 uppercase tracking-tight">Resetar Já Utilizado?</h3>
              <p className="text-[#64748B] text-[14px] leading-relaxed mb-6">
                Você tem certeza que deseja resetar os meses utilizados do cofre <strong>{resetCofre.name}</strong> para zero?
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setResetCofre(null)}
                  className="flex-1 py-3 rounded-[14px] font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handleResetUtilizado}
                  className="flex-1 py-3 rounded-[14px] font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] shadow-[0_4px_14px_rgba(239,68,68,0.3)] transition-all transform hover:-translate-y-0.5"
                >
                  CONFIRMAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
