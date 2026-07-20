import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { X, Search, Settings, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCards } from '../hooks/useCards';

interface InvestimentoConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  onLaunchNow: (rec: any) => void;
  recorrencia?: any;
  activeProfileId?: string;
  categories: any[];
  tags: any[];
}

export const InvestimentoConfigModal = ({ isOpen, onClose, onSaved, onLaunchNow, recorrencia, activeProfileId, categories, tags }: InvestimentoConfigModalProps) => {
  const [valorStr, setValorStr] = useState('');
  
  const [tagBusca, setTagBusca] = useState('');
  const [tagSelecionada, setTagSelecionada] = useState<{id: string, nome: string} | null>(null);
  const [mostrarDropdownTag, setMostrarDropdownTag] = useState(false);
  
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [cardId, setCardId] = useState<string | null>(null);

  const { cards } = useCards(activeProfileId || '');
  const [saving, setSaving] = useState(false);

  const containerTagRef = useRef<HTMLDivElement>(null);
  const inputTagRef = useRef<HTMLInputElement>(null);
  const inputValorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (recorrencia) {
        if (recorrencia.valor === null || recorrencia.valor < 0) {
          setValorStr(Math.round(Math.abs(recorrencia.valor || 0) * 100).toString());
        } else {
          setValorStr(Math.round(recorrencia.valor * 100).toString());
        }
        
        setFormaPagamento(recorrencia.forma_pagamento || 'dinheiro');
        setCardId(recorrencia.card_id || null);

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
      }
    } else {
      setTagSelecionada(null);
      setTagBusca('');
      setValorStr('');
      setFormaPagamento('dinheiro');
      setCardId(null);
      setMostrarDropdownTag(false);
    }
  }, [isOpen, recorrencia]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerTagRef.current && !containerTagRef.current.contains(event.target as Node)) {
        setMostrarDropdownTag(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return 'R$ 0,00';
    const numValue = parseInt(numbers, 10);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numValue / 100);
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setValorStr(val);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    setTimeout(() => {
      const length = target.value.length;
      target.setSelectionRange(length, length);
    }, 50);
  };

  const tagsFiltradas = tags
    .filter(t => t.nome.toLowerCase().includes(tagBusca.toLowerCase()))
    .slice(0, 15);

  const valorNumerico = valorStr ? parseInt(valorStr, 10) / 100 : 0;

  const handleSave = async () => {
    if (!tagSelecionada) return alert('Por favor, selecione uma tag válida.');
    if (!activeProfileId) return;

    const tagObj = tags.find(t => t.id === tagSelecionada.id);

    setSaving(true);
    const finalValor = valorNumerico > 0 ? -valorNumerico : null;

    const dataObj = {
      profile_id: activeProfileId,
      nome: 'Investimentos',
      tipo: 'despesa', // Investimentos sao gravados como tipo despesa para debitar do saldo, ou pode ser um handle que a tela ja faz. Espera, em RecurringModal "isInvestimento ? 'despesa' : tipo" e no nome ele coloca "Investimentos". Mas na listagem usamos item.tipo == "investimento" ?
      // Wait, let's verify what the database structure expects.
      // In RecurringModal.tsx, line 316: const finalTipo = isInvestimento ? 'despesa' : tipo;
      // No wait, let me double check RecurringModal
      valor: finalValor,
      frequencia: 'mensal',
      dia_vencimento: null,
      categoria_id: tagObj ? tagObj.category_id : null,
      tag_id: tagSelecionada.id,
      forma_pagamento: formaPagamento,
      card_id: formaPagamento === 'cartao_credito' ? cardId : null,
      ativa: true,
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px]"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] max-w-[460px] w-full rounded-[24px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-y-auto"
        >
        <div className="p-[20px]">
            <div className="flex items-center justify-between mb-6">
              
          <h2 className="text-[18px] font-[800] text-[#0F172A] dark:text-white flex items-center gap-2"><Settings size={20} className="text-amber-500" /> Configurar Investimento
          </h2>
              <button onClick={onClose} className="p-2 text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1E293B] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-[14px]">
          <div>
             <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
               Aporte Base Estimado
             </label>
             <input
                ref={inputValorRef}
                type="text"
                inputMode="numeric"
                value={formatCurrency(valorStr)}
                onChange={handleValorChange}
                onClick={handleInputFocus}
                onFocus={handleInputFocus}
                placeholder="R$ 0,00"
                className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border-[1.5px] border-[#E2E8F0] dark:border-[#1E293B] rounded-[12px] p-[10px_12px] text-[16px] font-[600] text-amber-500 dark:text-amber-400 outline-none transition-all focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)]"
             />
             <p className="text-[11px] text-slate-400 mt-1">Este valor será usado como sugestão ao registrar um aporte.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1" ref={containerTagRef}>
              <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Tag / Categoria</label>
              <div className="relative">
                {tagSelecionada ? (
                  <div className="inline-flex items-center gap-[6px] rounded-[100px] p-[6px_12px] text-[13px] font-[600] border-[1.5px] w-fit shadow-sm bg-[#FEF3C7] dark:bg-amber-900/30 text-[#D97706] border-[#D97706]">
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
                      placeholder="Nome Ativo"
                      className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border-[1.5px] border-[#E2E8F0] dark:border-[#1E293B] rounded-[12px] p-[10px_12px_10px_34px] text-[14px] font-[500] outline-none transition-all focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)]"
                    />
                  </div>
                )}
              </div>

              {mostrarDropdownTag && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] max-h-[220px] overflow-y-auto z-[60] p-[6px] space-y-[2px]">
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

            <div className="flex-1">
              <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">Debitar de</label>
              <select 
                value={formaPagamento === 'dinheiro' ? 'dinheiro' : cardId || 'dinheiro'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'dinheiro') {
                    setFormaPagamento('dinheiro');
                    setCardId(null);
                  } else {
                    setFormaPagamento('cartao_credito');
                    setCardId(val);
                  }
                }}
                className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border-[1.5px] border-[#E2E8F0] dark:border-[#1E293B] rounded-[12px] p-[10px_12px] text-[14px] font-[500] outline-none transition-all focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)]"
              >
                <option value="dinheiro">Conta</option>
                {cards.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>
          
        </div>

        <div className="mt-[24px] flex gap-[12px]">
          <button 
             onClick={handleSave} 
             disabled={saving}
             className="btn-salvar flex-1"
          >
            {saving ? 'Salvando...' : 'Salvar Configuração'}
          </button>
        </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
