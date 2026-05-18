import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { X, Check, TrendingUp, TrendingDown, Search, Calendar, AlertCircle, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCards } from '../hooks/useCards';
import { useProfiles } from '../hooks/useProfiles';

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  recorrencia?: any; // null for new
  activeProfileId?: string;
  categories: any[];
  tags: any[];
  initialType?: 'receita' | 'despesa';
}

export const RecurringModal = ({ isOpen, onClose, onSaved, recorrencia, activeProfileId, categories, tags, initialType = 'despesa' }: RecurringModalProps) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');
  const [valorStr, setValorStr] = useState('');
  const [valorVariavel, setValorVariavel] = useState(false);
  const [frequencia, setFrequencia] = useState<'diaria' | 'semanal' | 'mensal' | 'anual'>('mensal');
  const [diaVencimento, setDiaVencimento] = useState<number | ''>('');
  const [diaEmissao, setDiaEmissao] = useState<number | ''>('');
  const [mesVencimento, setMesVencimento] = useState<number | ''>('');
  
  // Tag dropdown state
  const [tagBusca, setTagBusca] = useState('');
  const [tagSelecionada, setTagSelecionada] = useState<{id: string, nome: string} | null>(null);
  const [mostrarDropdownTag, setMostrarDropdownTag] = useState(false);
  
  const { cards } = useCards(activeProfileId || '');
  const { profiles } = useProfiles();
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const isBusiness = activeProfile?.tipo === 'empresa';

  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
  const [cardId, setCardId] = useState<string | null>(null);
  const [numParcelas, setNumParcelas] = useState<number>(1);
  const [ativa, setAtiva] = useState(true);

  const [saving, setSaving] = useState(false);
  const containerTagRef = useRef<HTMLDivElement>(null);
  const inputTagRef = useRef<HTMLInputElement>(null);
  const inputValorRef = useRef<HTMLInputElement>(null);

  const [parcelas, setParcelas] = useState(1); // placeholder for local use if needed

  useEffect(() => {
    if (inputValorRef.current && valorStr !== 'Variável') {
      const length = inputValorRef.current.value.length;
      inputValorRef.current.setSelectionRange(length, length);
    }
  }, [valorStr]);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    setTimeout(() => {
      const length = target.value.length;
      target.setSelectionRange(length, length);
    }, 50);
  };

  useEffect(() => {
    if (isOpen) {
      if (recorrencia) {
        setNome(recorrencia.nome);
        setTipo(recorrencia.tipo);
        setValorVariavel(recorrencia.valor === null);
        setValorStr(recorrencia.valor !== null ? (Math.round(recorrencia.valor * 100).toString()) : '0'); // using string cents for standard mask 
        setFrequencia(recorrencia.frequencia);
        setDiaVencimento(recorrencia.dia_vencimento || '');
        setDiaEmissao(recorrencia.dia_emissao || '');
        setMesVencimento(recorrencia.mes_vencimento || '');
        setFormaPagamento(recorrencia.forma_pagamento || 'dinheiro');
        setCardId(recorrencia.card_id || null);
        setNumParcelas(recorrencia.num_parcelas || 1);
        setAtiva(recorrencia.ativa !== false);

        if (recorrencia.tags) {
           setTagSelecionada({
             id: recorrencia.tags.id,
             nome: recorrencia.tags.nome
           });
           setTagBusca(recorrencia.tags.nome);
        } else {
           setTagSelecionada(null);
           setTagBusca('');
        }
      } else {
        setNome('');
        setTipo(initialType);
        setValorStr('0');
        setValorVariavel(false);
        setFrequencia('mensal');
        setDiaVencimento('');
        setDiaEmissao('');
        setMesVencimento('');
        setTagSelecionada(null);
        setTagBusca('');
        setFormaPagamento('dinheiro');
        setCardId(null);
        setNumParcelas(1);
        setAtiva(true);
      }
    }
  }, [isOpen, recorrencia, initialType]);

  // Handle outside click for tags
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (containerTagRef.current && !containerTagRef.current.contains(e.target as Node)) {
        setMostrarDropdownTag(false);
        if (!tagSelecionada) {
          setTagBusca('');
        } else {
          setTagBusca(tagSelecionada.nome);
        }
      }
    };

    if (mostrarDropdownTag) {
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickFora);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickFora);
      };
    }
  }, [mostrarDropdownTag, tagSelecionada]);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (valorVariavel) return;
    const value = e.target.value.replace(/\D/g, "");
    const cleanedValue = value.replace(/^0+/, "") || "0";
    if (cleanedValue.length > 10) return;
    setValorStr(cleanedValue);
  };

  const handleValorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Enter') return;
  };

  const formatarValor = (digitos: string) => {
    const numero = parseInt(digitos) / 100;
    return numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
  };

  const valorExibido = formatarValor(valorStr);
  const valorNumerico = parseInt(valorStr) / 100;

  const tagsFiltradas = tags.filter(tag => {
    const categoria = categories.find(c => c.id === tag.category_id);
    if (!categoria || categoria.tipo !== tipo) return false;
    return tag.nome.toLowerCase().includes(tagBusca.toLowerCase());
  });

  const handleSave = async () => {
    if (!nome.trim()) return alert('Por favor, informe a descrição.');
    if (!valorVariavel && valorNumerico <= 0) return alert('Por favor, informe um valor maior que zero.');
    if (!tagSelecionada) return alert('Por favor, selecione uma tag válida.');
    if (!activeProfileId) return;

    // Achar Categoria ID da Tag selecionada para inserir (embora não tenhamos o input de categoria, a tabela transacoes_recorrentes requer category_id)
    const tagObj = tags.find(t => t.id === tagSelecionada.id);

    setSaving(true);
    const isCard = tipo === 'despesa' && cards.length > 0 && formaPagamento !== 'Dinheiro';

    const dataObj = {
      profile_id: activeProfileId,
      nome,
      tipo,
      valor: valorVariavel ? null : valorNumerico,
      frequencia,
      dia_vencimento: frequencia !== 'diaria' ? (diaVencimento === '' ? null : Number(diaVencimento)) : null,
      dia_emissao: isBusiness && diaEmissao !== '' ? Number(diaEmissao) : null,
      mes_vencimento: frequencia === 'anual' ? (mesVencimento === '' ? null : Number(mesVencimento)) : null,
      categoria_id: tagObj ? tagObj.category_id : null,
      tag_id: tagSelecionada.id,
      forma_pagamento: isCard ? 'cartao_credito' : 'dinheiro',
      card_id: isCard ? cardId : null,
      num_parcelas: isCard ? numParcelas : null,
      ativa
    };

    if (recorrencia) {
      const { error } = await supabase.from('transacoes_recorrentes').update(dataObj).eq('id', recorrencia.id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase.from('transacoes_recorrentes').insert([dataObj]);
      if (error) console.error(error);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-[#1E293B] max-w-[460px] w-full rounded-[24px] shadow-[0_24px_48px_rgba(0,0,0,0.15)] relative z-10 flex flex-col max-h-[90vh] overflow-y-auto"
          >
            <div className="p-[20px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-[800] text-[#0F172A] dark:text-white">{recorrencia ? 'Editar Recorrência' : `Nova Recorrência (${tipo === 'receita' ? 'Receita' : 'Despesa'})`}</h2>
              <button onClick={onClose} className="p-2 text-[#94A3B8] hover:bg-slate-100 rounded-full transition-colors"><X size={18} /></button>
            </div>

            <div className="space-y-[14px]">
              {/* Nome */}
              <div>
                <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Descrição</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]" 
                  placeholder="Ex: Aluguel" 
                />
              </div>

              {/* Tag com Busca */}
              <div className="relative" ref={containerTagRef}>
                <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Tag</label>
                <div className="relative">
                  {tagSelecionada ? (
                    <div className={`inline-flex items-center gap-[6px] rounded-[100px] p-[6px_12px] text-[13px] font-[600] border-[1.5px] w-fit shadow-sm ${tipo === 'receita' ? 'bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A] border-[#16A34A]' : 'bg-[#FEE2E2] dark:bg-red-900/30 text-[#EF4444] border-[#EF4444]'}`}>
                      <span>{tagSelecionada.nome}</span>
                      <button onClick={(e) => { e.stopPropagation(); setTagSelecionada(null); setTagBusca(''); setMostrarDropdownTag(true); setTimeout(() => inputTagRef.current?.focus(), 50); }} className="p-[2px] rounded-full hover:bg-black/10 transition-colors cursor-pointer"><X size={12} /></button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                      <input
                        ref={inputTagRef}
                        type="text"
                        value={tagBusca}
                        onChange={(e) => { setTagBusca(e.target.value); setMostrarDropdownTag(true); }}
                        onFocus={() => setMostrarDropdownTag(true)}
                        placeholder="Buscar tag..."
                        className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[12px] p-[10px_12px_10px_34px] text-[14px] font-[500] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                      />
                    </div>
                  )}
                </div>

                {mostrarDropdownTag && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] max-h-[220px] overflow-y-auto z-[60] p-[6px] space-y-[2px]">
                    {tagsFiltradas.length > 0 ? (
                      tagsFiltradas.map((tag) => {
                        const categoria = categories.find(c => c.id === tag.category_id);
                        return (
                          <button
                            key={tag.id}
                            onClick={(e) => { e.stopPropagation(); setTagSelecionada({id: tag.id, nome: tag.nome}); setTagBusca(''); setMostrarDropdownTag(false); }}
                            className="w-full p-[10px_14px] text-[14px] font-[500] rounded-[10px] text-left flex items-center gap-3 transition-colors hover:bg-[#F1F5F9] dark:hover:bg-[#475569] dark:bg-[#334155] text-[#374151] dark:text-[#E2E8F0]"
                          >
                            <span className="w-[8px] h-[8px] rounded-full shrink-0" style={{ backgroundColor: categoria?.cor || '#CBD5E1' }} />
                            {tag.nome}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-[20px] text-center"><p className="text-[13px] font-[600] text-[#94A3B8]">Tag não encontrada</p></div>
                    )}
                  </div>
                )}
              </div>

              {/* Valor */}
              <div className="grid grid-cols-2 gap-[12px] items-end">
                <div>
                  <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Valor</label>
                  <input 
                    ref={inputValorRef}
                    type="text" 
                    inputMode="numeric"
                    value={valorVariavel ? 'Variável' : valorExibido} 
                    onChange={handleValorChange}
                    onKeyDown={handleValorKeyDown}
                    onFocus={handleInputFocus}
                    onClick={handleInputFocus}
                    disabled={valorVariavel}
                    className={`w-full text-right border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[15px] font-[800] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] disabled:bg-[#F1F5F9] dark:bg-[#334155] disabled:text-[#94A3B8] disabled:border-[#E2E8F0] dark:border-[#334155] ${!valorVariavel && tipo === 'receita' ? 'text-[#16A34A]' : ''} ${!valorVariavel && tipo === 'despesa' ? 'text-[#EF4444]' : ''}`} 
                  />
                </div>
                <div className="pb-3 flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-colors ${valorVariavel ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-[#CBD5E1] group-hover:border-[#94A3B8]'}`}>
                      {valorVariavel && <Check size={14} className="text-white" />}
                    </div>
                    <input type="checkbox" checked={valorVariavel} onChange={e => setValorVariavel(e.target.checked)} className="hidden" />
                    <span className="text-[13px] font-[600] text-[#475569] select-none">Valor Variável</span>
                  </label>
                </div>
              </div>

              {/* Frequência */}
              <div className="grid grid-cols-2 gap-[12px] items-start">
                  <div>
                    <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Frequência</label>
                    <select value={frequencia} onChange={e => setFrequencia(e.target.value as any)} className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none cursor-pointer appearance-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]">
                      <option value="diaria">Diária</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  
                  {/* Dia/Mês de Vencimento */}
                  {frequencia === 'semanal' && (
                    <div>
                      <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Dia da Semana</label>
                      <select value={diaVencimento} onChange={e => setDiaVencimento(Number(e.target.value))} className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none cursor-pointer appearance-none transition-all focus:border-[#2563EB]">
                        <option value="">Selecione...</option>
                        <option value="1">Segunda-feira</option>
                        <option value="2">Terça-feira</option>
                        <option value="3">Quarta-feira</option>
                        <option value="4">Quinta-feira</option>
                        <option value="5">Sexta-feira</option>
                        <option value="6">Sábado</option>
                        <option value="7">Domingo</option>
                      </select>
                    </div>
                  )}
                  {frequencia === 'mensal' && (
                    <div className="flex gap-[12px]">
                      <div className="flex-1">
                        <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Dia do Mês</label>
                        <input type="number" min="1" max="31" value={diaVencimento} onChange={e => setDiaVencimento(e.target.value ? Number(e.target.value) : '')} className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB]" placeholder="1 a 31" />
                      </div>
                      {isBusiness && (
                        <div className="flex-1">
                          <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Dia de Tirar</label>
                          <input type="number" min="1" max="31" value={diaEmissao} onChange={e => setDiaEmissao(e.target.value ? Number(e.target.value) : '')} className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB]" placeholder="Opcional" />
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {frequencia === 'anual' && (
                  <div className="grid grid-cols-2 gap-[12px] items-start">
                      <div>
                        <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Dia do Mês</label>
                        <input type="number" min="1" max="31" value={diaVencimento} onChange={e => setDiaVencimento(e.target.value ? Number(e.target.value) : '')} className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB]" placeholder="1 a 31" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Mês</label>
                        <select value={mesVencimento} onChange={e => setMesVencimento(e.target.value ? Number(e.target.value) : '')} className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none cursor-pointer appearance-none transition-all focus:border-[#2563EB]">
                          <option value="">Selecione...</option>
                          {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>)}
                        </select>
                      </div>
                  </div>
              )}

              {/* Forma Pagamento e Ativa */}
              <div className="grid grid-cols-2 gap-[12px] items-end">
                {tipo === 'despesa' && cards.length > 0 ? (
                  <div>
                    <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Forma de Pagamento</label>
                    <select 
                      value={formaPagamento === 'dinheiro' ? 'dinheiro' : (cardId || '')} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val === 'dinheiro') {
                          setFormaPagamento('dinheiro');
                          setCardId(null);
                        } else {
                          setFormaPagamento('cartao_credito');
                          setCardId(val);
                        }
                      }} 
                      className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none cursor-pointer appearance-none focus:border-[#2563EB]"
                    >
                      <option value="dinheiro">Dinheiro</option>
                      {cards.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="opacity-0 pointer-events-none"></div>
                )}
                <div className="pb-3 flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-colors ${ativa ? 'bg-[#10B981] border-[#10B981]' : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-[#CBD5E1] group-hover:border-[#94A3B8]'}`}>
                      {ativa && <Check size={14} className="text-white" />}
                    </div>
                    <input type="checkbox" checked={ativa} onChange={e => setAtiva(e.target.checked)} className="hidden" />
                    <span className="text-[13px] font-[600] text-[#475569] select-none">Recorrência Ativa</span>
                  </label>
                </div>
              </div>

              {/* Parcelamento - Só aparece se for cartão */}
              {(formaPagamento === 'cartao_credito' || cardId) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Número de Parcelas</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <CreditCard size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input 
                        type="number" 
                        min="1" 
                        value={numParcelas} 
                        onChange={e => setNumParcelas(Number(e.target.value) || 1)}
                        className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px_10px_36px] text-[14px] font-[500] outline-none transition-all focus:border-[#2563EB]"
                        placeholder="Ex: 12"
                      />
                    </div>
                    <div className="text-[13px] text-[#64748B] dark:text-[#94A3B8] font-[500]">vezes</div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-[24px] flex gap-[12px]">
              <button onClick={onClose} className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#E2E8F0] dark:hover:bg-[#475569] transition-colors">Cancelar</button>
              <button disabled={saving} onClick={handleSave} className={`flex-1 text-white font-[800] text-[14px] rounded-[14px] py-[12px] transition-all shadow-lg active:scale-[0.98] flex justify-center items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''} ${tipo === 'receita' ? 'bg-[#16A34A] shadow-[0_4px_14px_rgba(22,163,74,0.3)] hover:bg-[#15803D]' : 'bg-[#EF4444] shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:bg-[#DC2626]'}`}>
                {saving ? 'Salvando...' : <><Check size={16} /> Confirmar</>}
              </button>
            </div>
            
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

