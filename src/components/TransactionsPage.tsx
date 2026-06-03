import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight, Search, TrendingUp, TrendingDown, CreditCard, Pencil, Trash2, AlertTriangle, ReceiptText, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { useTransacoes, Transacao } from '../hooks/useTransacoes';
import { useProfiles } from '../hooks/useProfiles';
import { TransactionModal } from './TransactionModal';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionsPageProps {
  activeProfileId?: string;
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES_COMPLETOS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function TransactionsPage({ activeProfileId }: TransactionsPageProps) {
  const { profiles } = useProfiles();
  const isBusiness = activeProfileId && profiles.find(p => p.id === activeProfileId)?.tipo === 'empresa';
  const { transacoes, loading, carregarTransacoesMes, excluirTransacao, editarTransacao } = useTransacoes();
  const [dataAtual, setDataAtual] = useState(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transacaoParaEditar, setTransacaoParaEditar] = useState<Transacao | null>(null);
  
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'receitas' | 'despesas'>('todos');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [transacaoParaEfetivar, setTransacaoParaEfetivar] = useState<Transacao | null>(null);
  const [valorEfetivoStr, setValorEfetivoStr] = useState('');

  const mesAtual = dataAtual.getMonth() + 1;
  const anoAtual = dataAtual.getFullYear();

  const [dropdownMesAberto, setDropdownMesAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fecharFora = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownMesAberto(false);
      }
    };
    const fecharEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownMesAberto(false);
      }
    };
    document.addEventListener('mousedown', fecharFora);
    document.addEventListener('keydown', fecharEsc);
    return () => {
      document.removeEventListener('mousedown', fecharFora);
      document.removeEventListener('keydown', fecharEsc);
    };
  }, []);

  useEffect(() => {
    if (activeProfileId) {
      carregarTransacoesMes(activeProfileId, mesAtual, anoAtual);
    }
  }, [activeProfileId, mesAtual, anoAtual]);

  const handleMudarMes = (mesIndex: number) => {
    const novaData = new Date(dataAtual);
    novaData.setMonth(mesIndex);
    setDataAtual(novaData);
  };

  const handleMudarAno = (delta: number) => {
    const novaData = new Date(dataAtual);
    novaData.setFullYear(anoAtual + delta);
    setDataAtual(novaData);
  };

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter(t => {
      // Filtro de tipo
      if (filtroTipo === 'receitas' && t.tipo !== 'receita') return false;
      if (filtroTipo === 'despesas' && t.tipo !== 'despesa') return false;

      // Filtro de busca
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const textoDescricao = t.descricao.toLowerCase();
        const textoValor = t.valor.toString();
        const textoTag = t.tags?.nome?.toLowerCase() || '';

        if (!textoDescricao.includes(termo) && !textoValor.includes(termo) && !textoTag.includes(termo)) {
          return false;
        }
      }

      return true;
    });
  }, [transacoes, filtroTipo, busca]);

  const transacoesAgrupadas = useMemo(() => {
    return transacoesFiltradas.reduce((grupos: Record<string, Transacao[]>, t) => {
      const data = t.data;
      if (!grupos[data]) grupos[data] = [];
      grupos[data].push(t);
      return grupos;
    }, {});
  }, [transacoesFiltradas]);

  const formatarDataCabecalho = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split('-');
    const data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const diaSemana = diasSemana[data.getDay()].toUpperCase();
    
    const nomeMes = data.toLocaleString('pt-BR', { month: 'long' }).toUpperCase();

    return `${diaSemana}, ${dia} DE ${nomeMes}`;
  };

  const calcularTotalDia = (transacoesDia: Transacao[]) => {
    return transacoesDia.reduce((acc, t) => {
      return acc + (t.tipo === 'receita' ? t.valor : -t.valor);
    }, 0);
  };

  const formatarMoeda = (valor: number, mostrarSinal = false) => {
    const abs = Math.abs(valor);
    const formatado = abs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (mostrarSinal) {
      if (valor > 0) return `+R$ ${formatado}`;
      if (valor < 0) return `-R$ ${formatado}`;
      return `R$ ${formatado}`;
    }
    return formatado;
  };

  const formatarValorTransacao = (t: Transacao) => {
    const formatado = t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (t.tipo === 'receita') return `+${formatado}`;
    return `-${formatado}`;
  };

  const handleDelete = async (id: string) => {
    await excluirTransacao(id);
    setConfirmDeleteId(null);
    if (activeProfileId) {
      carregarTransacoesMes(activeProfileId, mesAtual, anoAtual);
    }
  };

  const handleCancelarEfetivacao = async (t: Transacao) => {
    const originalPrevisto = t.valor_previsto !== undefined ? t.valor_previsto : t.valor;
    await editarTransacao(t.id, {
      status: 'previsto',
      valor: originalPrevisto
    });
    if (activeProfileId) {
      carregarTransacoesMes(activeProfileId, mesAtual, anoAtual);
    }
  };

  const handleConfirmarEfetivacao = async () => {
    if (!transacaoParaEfetivar) return;
    
    // Converte vírgula para ponto e remove possíveis milhares
    const parsedValor = parseFloat(valorEfetivoStr.replace(/\s/g, '').replace(/\./g, '').replace(',', '.'));
    if (isNaN(parsedValor) || parsedValor <= 0) {
      alert("Por favor, digite um valor válido.");
      return;
    }

    await editarTransacao(transacaoParaEfetivar.id, {
      status: 'pago',
      valor: parsedValor
    });

    setTransacaoParaEfetivar(null);
    if (activeProfileId) {
      carregarTransacoesMes(activeProfileId, mesAtual, anoAtual);
    }
  };

  return (
    <div className="p-[24px] max-w-[1100px] mx-auto flex flex-col gap-[20px] w-full">
      {/* 1. CABEÇALHO */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[22px] font-[800] text-[#0F172A] dark:text-white">Transações</h1>
          <p className="text-[13px] text-[#94A3B8] dark:text-[#64748B] capitalize">
            {dataAtual.toLocaleString('pt-BR', { month: 'long' })} de {anoAtual}
          </p>
        </div>
        <button
          onClick={() => {
            setTransacaoParaEditar(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-0 lg:gap-[8px] bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] rounded-[100px] w-[44px] h-[44px] lg:w-auto lg:h-auto lg:px-[22px] lg:py-[10px] text-white font-[700] text-[14px] shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-[1px] transition-all"
        >
          <Plus size={20} className="lg:w-[15px] lg:h-[15px]" />
          <span className="hidden lg:inline">Nova Transação</span>
        </button>
      </div>

      {/* 2. NAVEGAÇÃO TEMPORAL */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E293B] rounded-[16px] p-[16px_20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* MOBILE: Dropdown + Ano */}
        <div className="flex md:hidden flex-col gap-[12px] w-full items-center justify-center">
          {/* Ano */}
          <div className="flex justify-between items-center gap-[10px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[16px] py-[8px] w-full">
            <button onClick={() => handleMudarAno(-1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A]  border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] transition-colors cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            <span className="text-[14px] font-[600] text-[#0F172A] dark:text-white min-w-[60px] text-center">
              {anoAtual}
            </span>
            <button onClick={() => handleMudarAno(1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A]  border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] transition-colors cursor-pointer">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Dropdown de Mês */}
          <div className="relative w-full" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
              className="w-full flex justify-between items-center gap-[8px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[20px] py-[8px] text-[14px] font-[600] text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] dark:bg-[#0F172A]  transition-colors cursor-pointer"
            >
              {MESES_COMPLETOS[mesAtual - 1]}
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
                    className="absolute left-0 right-0 mt-2 min-w-[200px] bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2 z-30"
                  >
                    <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Selecionar Mês</p>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1">
                      {MESES_COMPLETOS.map((nome, i) => {
                        const isActive = mesAtual === i + 1;
                        return (
                          <button 
                            key={nome}
                            onClick={() => {
                              handleMudarMes(i);
                              setDropdownMesAberto(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                              isActive 
                                ? 'bg-slate-100 text-slate-700 font-bold' 
                                : 'text-slate-600 font-medium hover:bg-slate-50'
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
        </div>

        {/* TABLET / DESKTOP: Ano centralizado e meses em linha */}
        <div className="hidden md:block w-full">
          <div className="flex justify-center items-center gap-[16px] mb-[14px]">
            <button 
              onClick={() => handleMudarAno(-1)}
              className="p-[4px_8px] rounded-[8px] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] hover:text-[#0F172A] dark:text-white cursor-pointer transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[16px] font-[800] text-[#0F172A] dark:text-white">
              {anoAtual}
            </span>
            <button 
              onClick={() => handleMudarAno(1)}
              className="p-[4px_8px] rounded-[8px] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] hover:text-[#0F172A] dark:text-white cursor-pointer transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="flex gap-[6px] justify-center w-full">
            {MESES.map((nomeMes, index) => {
              const ativo = index + 1 === mesAtual;
              return (
                <button
                  key={nomeMes}
                  onClick={() => handleMudarMes(index)}
                  className={`rounded-[100px] p-[6px_14px] text-[13px] font-[600] cursor-pointer transition-all border-[1.5px] ${
                    ativo 
                      ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#2563EB] border-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.15)]'
                      : 'bg-[#F8FAFC] dark:bg-[#0F172A]  text-[#64748B] dark:text-[#94A3B8] border-transparent dark:border-transparent hover:bg-[#F1F5F9] dark:hover:bg-[#475569] hover:text-[#0F172A] dark:text-white'
                  }`}
                >
                  {nomeMes}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. FILTROS */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E293B] rounded-[16px] p-[14px_20px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row lg:items-center gap-[12px]">
        <div className="relative w-full lg:flex-1">
          <Search size={15} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-[#64748B]" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por descrição, tag ou valor..."
            className="w-full bg-[#F8FAFC] dark:bg-[#0F172A]  border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] p-[9px_12px_9px_36px] text-[13px] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
          />
        </div>
        
        <div className="flex gap-[6px] w-full lg:w-auto pb-1 lg:pb-0">
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`flex-1 lg:flex-none rounded-[100px] py-[7px] px-[8px] sm:px-[16px] text-[11px] sm:text-[13px] font-[600] border-[1.5px] transition-colors ${
              filtroTipo === 'todos'
                ? 'bg-[#0F172A] dark:bg-[#334155] text-[#FFFFFF] dark:text-white border-[#0F172A] dark:border-[#334155]'
                : 'bg-[#F8FAFC] dark:bg-[#0F172A]  text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]'
            }`}
          >
            TODOS
          </button>
          <button
            onClick={() => setFiltroTipo('receitas')}
            className={`flex-1 lg:flex-none rounded-[100px] py-[7px] px-[8px] sm:px-[16px] text-[11px] sm:text-[13px] font-[600] border-[1.5px] transition-colors ${
              filtroTipo === 'receitas'
                ? 'bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A] border-[#16A34A]'
                : 'bg-[#F8FAFC] dark:bg-[#0F172A]  text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]'
            }`}
          >
            RECEITAS
          </button>
          <button
            onClick={() => setFiltroTipo('despesas')}
            className={`flex-1 lg:flex-none rounded-[100px] py-[7px] px-[8px] sm:px-[16px] text-[11px] sm:text-[13px] font-[600] border-[1.5px] transition-colors ${
              filtroTipo === 'despesas'
                ? 'bg-[#FEE2E2] dark:bg-red-900/30 text-[#EF4444] border-[#EF4444]'
                : 'bg-[#F8FAFC] dark:bg-[#0F172A]  text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]'
            }`}
          >
            DESPESAS
          </button>
        </div>
      </div>

      {/* 4. LISTA DE TRANSAÇÕES */}
      <div className="bg-[#FFFFFF] dark:bg-[#1E293B] rounded-[16px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {loading ? (
          <div className="p-[20px] space-y-4">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#F1F5F9] dark:bg-[#334155] h-[40px] rounded-[8px] w-full" />
             ))}
          </div>
        ) : transacoesFiltradas.length === 0 ? (
          <div className="p-[60px_20px] text-center">
            <ReceiptText size={48} className="text-[#E2E8F0] mx-auto mb-4" />
            <h3 className="text-[16px] font-[700] text-[#94A3B8] dark:text-[#64748B]">Nenhuma transação encontrada</h3>
            <p className="text-[13px] text-[#CBD5E1] dark:text-[#64748B]">Clique em + Nova Transação para começar</p>
          </div>
        ) : (
          <div>
            {(Object.entries(transacoesAgrupadas) as [string, Transacao[]][]).sort((a, b) => b[0].localeCompare(a[0])).map(([dataStr, transacoesDia]) => {
              const totalDia = calcularTotalDia(transacoesDia);
              return (
                <div key={dataStr}>
                  {/* SEPARADOR DO DIA */}
                  <div className="bg-[#F8FAFC] dark:bg-[#0F172A]  p-[8px_20px] flex justify-between items-center border-b-[1px] border-[#F1F5F9] dark:border-[#334155]">
                    <span className="text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-[0.05em]">
                      {formatarDataCabecalho(dataStr)}
                    </span>
                    <span className={`text-[12px] font-[700] ${totalDia >= 0 ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                      {formatarMoeda(totalDia, true)}
                    </span>
                  </div>

                  {/* LINHAS DE TRANSAÇÃO */}
                  <div>
                    {transacoesDia.map((t) => (
                      <div key={t.id} className="p-[14px_20px] flex items-center justify-between gap-[14px] border-b-[1px] border-[#F8FAFC] dark:border-[#0F172A] transition-colors hover:bg-[#FAFAFA] dark:hover:bg-[#0F172A] ">
                        
                        <div className="flex items-center gap-[14px] flex-1 min-w-0">
                          {/* CÍRCULO TIPO */}
                          <div className={`w-[36px] h-[36px] rounded-full shrink-0 flex items-center justify-center ${
                            t.tipo === 'receita' ? 'bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A]' : 'bg-[#FEE2E2] dark:bg-red-900/30 text-[#EF4444]'
                          }`}>
                            {t.tipo === 'receita' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          </div>

                          {/* DESCRIÇÃO E DETALHES */}
                          <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                            <div className="text-[14px] font-[600] text-[#0F172A] dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                              {t.descricao.replace(/\s*\(Ref:\s*\d{2}\/\d{4}\)/g, '')}
                            </div>
                            
                            <div className="flex items-center gap-[8px] flex-wrap">
                              {/* TAG */}
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '100px',
                                fontSize: '11px',
                                fontWeight: 600,
                                background: t.tipo === 'receita' ? '#DCFCE7' : '#FEE2E2',
                                color: t.tipo === 'receita' ? '#16A34A' : '#EF4444',
                                border: t.tipo === 'receita' ? '1px solid #16A34A' : '1px solid #EF4444'
                              }}>
                                {t.tags?.nome || 'Sem tag'}
                              </span>

                              {/* SITUAÇÃO BADGE */}
                              {t.status === 'previsto' && (
                                <span className="inline-flex items-center gap-[4px] px-[6px] py-[1.5px] rounded-[100px] text-[10px] font-[800] bg-[#FEF9C3] text-[#CA8A04] border border-[#FEF08A] uppercase tracking-wider dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-900">
                                  Previsto
                                </span>
                              )}

                              {/* VARIância / RESULTADO DE COMPARAÇÃO */}


                              {/* FORMA DE PAGAMENTO */}
                              {t.tipo === 'despesa' && (
                                <div className="flex items-center gap-[4px] text-[12px] text-[#94A3B8] dark:text-[#64748B]">
                                  <CreditCard size={12} />
                                  <span className="italic">
                                    {t.cards?.nome || (
                                      t.forma_pagamento === 'cartao_credito' ? 'Crédito' :
                                      t.forma_pagamento === 'cartao_debito' ? 'Débito' :
                                      t.forma_pagamento === 'pix' ? 'Pix' :
                                      t.forma_pagamento === 'dinheiro' ? (isBusiness ? 'Conta' : 'Dinheiro') :
                                      t.forma_pagamento === 'conta_corrente' ? (isBusiness ? 'Conta' : 'Conta Corrente / Saldo') :
                                      t.forma_pagamento || 'A definir'
                                    )}
                                    {t.num_parcelas && t.num_parcelas > 1 ? ` (${t.num_parcelas}ª parc.)` : ''}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* VALOR E AÇÕES */}
                        <div className="flex items-center gap-[12px] shrink-0">
                          <div className={`text-[15px] font-[700] whitespace-nowrap text-right ${
                            t.tipo === 'receita' ? 'text-[#16A34A]' : 'text-[#EF4444]'
                          }`}>
                            {formatarValorTransacao(t)}
                          </div>
                          
                          <div className="flex items-center gap-[4px]">
                            {t.status === 'previsto' && (
                              <button
                                onClick={() => {
                                  setTransacaoParaEfetivar(t);
                                  setValorEfetivoStr(t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
                                }}
                                className="flex items-center gap-1 p-[4px_10px] rounded-[8px] bg-[#FEF9C3] hover:bg-[#FEF08A] text-[#CA8A04] transition-colors cursor-pointer text-[11px] font-[700]"
                                title="Efetivar Lançamento"
                              >
                                <Check size={11} strokeWidth={3} />
                                <span>Efetivar</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setTransacaoParaEditar(t);
                                setIsModalOpen(true);
                              }}
                              className="p-[6px] rounded-[8px] text-[#CBD5E1] dark:text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:bg-[#1E3A8A] dark:hover:bg-[#1E3A8A] transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(t.id)}
                              className="p-[6px] rounded-[8px] text-[#CBD5E1] dark:text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D] transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE EFETIVAÇÃO DE LANÇAMENTO (PAGO VS PREVISTO) */}
      {transacaoParaEfetivar && (
        <div className="fixed inset-0 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] dark:bg-[#1E293B] rounded-[20px] p-[24px] w-full max-w-[380px] shadow-[0_24px_48px_rgba(0,0,0,0.15)] flex flex-col border-[1.5px] border-[#F1F5F9] dark:border-[#334155]">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${
                transacaoParaEfetivar.tipo === 'receita' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#EF4444]'
              }`}>
                {transacaoParaEfetivar.tipo === 'receita' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </div>
              <div>
                <h3 className="text-[16px] font-[800] text-[#0F172A] dark:text-white">Efetivar Lançamento</h3>
                <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] font-bold">{transacaoParaEfetivar.tipo === 'receita' ? 'Receber previsto' : 'Confirmar pagamento'}</p>
              </div>
            </div>

            <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-3 border border-[#E2E8F0] dark:border-[#334155] mb-4 space-y-1.5">
              <div className="text-[13px] font-[700] text-[#0F172A] dark:text-white line-clamp-1">{transacaoParaEfetivar.descricao.replace(/\s*\(Ref:\s*\d{2}\/\d{4}\)/g, '')}</div>
              <div className="flex justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8] font-bold">
                <span>VALOR PREVISTO:</span>
                <span>R$ {transacaoParaEfetivar.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <label className="block text-[11px] font-[800] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                Valor Efetivo (Pago / Recebido)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-[700] text-[#64748B]">R$</span>
                <input
                  type="text"
                  value={valorEfetivoStr}
                  onChange={(e) => setValorEfetivoStr(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-xl text-[16px] font-[800] text-[#0F172A] dark:text-white outline-none focus:border-[#2563EB]"
                />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Você pode corrigir o valor se o pagamento foi diferente do previsto.</span>
            </div>

            <div className="flex gap-[10px] w-full">
              <button 
                onClick={() => setTransacaoParaEfetivar(null)}
                className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] font-[600] text-[14px] py-[10px] rounded-[12px] hover:bg-[#E2E8F0] dark:hover:bg-[#475569] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmarEfetivacao}
                className={`flex-1 text-white font-[700] text-[14px] py-[10px] rounded-[12px] transition-colors cursor-pointer shadow-md ${
                  transacaoParaEfetivar.tipo === 'receita'
                    ? 'bg-[#16A34A] hover:bg-[#15803D]'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] dark:bg-[#1E293B] rounded-[16px] p-[24px] w-full max-w-[360px] text-center shadow-[0_24px_48px_rgba(0,0,0,0.15)] flex flex-col items-center">
            <AlertTriangle size={40} className="text-[#EF4444] mb-[12px]" />
            <h3 className="text-[16px] font-[800] text-[#0F172A] dark:text-white mb-1">Excluir transação?</h3>
            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mb-6">
              {transacoes.find(t => t.id === confirmDeleteId)?.descricao}
            </p>
            <div className="flex gap-[10px] w-full">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] font-[600] text-[14px] py-[10px] rounded-[12px] hover:bg-[#E2E8F0] dark:hover:bg-[#475569] transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 bg-[#EF4444] text-white font-[600] text-[14px] py-[10px] rounded-[12px] hover:bg-[#DC2626] transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE TRANSAÇÃO */}
      {activeProfileId && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTransacaoParaEditar(null);
            carregarTransacoesMes(activeProfileId, mesAtual, anoAtual);
          }}
          perfilId={activeProfileId}
          transacaoParaEditar={transacaoParaEditar}
        />
      )}
    </div>
  );
}
