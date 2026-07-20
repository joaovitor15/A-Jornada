import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight, Search, TrendingUp, TrendingDown, CreditCard, Pencil, Trash2, AlertTriangle, ReceiptText, ChevronDown, Check, RotateCcw, ArrowLeftRight } from 'lucide-react';
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
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'receita' | 'despesa'>('todos');

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
      if (filtroTipo === 'receita' && t.tipo !== 'receita') return false;
      if (filtroTipo === 'despesa' && t.tipo !== 'despesa') return false;

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
          <h1 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-3">
            <ArrowLeftRight size={28} className="text-[#3B82F6]" /> 
            Transações
          </h1>
          <p className="text-[13px] text-[#94A3B8] dark:text-[#64748B] capitalize mt-1">
            {dataAtual.toLocaleString('pt-BR', { month: 'long' })} de {anoAtual}
          </p>
        </div>
        <button
          onClick={() => {
            setTransacaoParaEditar(null);
            setIsModalOpen(true);
          }}
          className="btn-salvar !p-3 lg:!px-[24px] lg:!py-[12px] !rounded-full lg:!rounded-xl flex-shrink-0 ml-4"
        >
          <Plus size={20} strokeWidth={3} className="lg:w-[15px] lg:h-[15px] transition-transform group-hover:scale-110" />
          <span className="hidden lg:inline uppercase">Nova Transação</span>
        </button>
      </div>

      {/* 2. NAVEGAÇÃO TEMPORAL */}
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[16px] p-[16px_20px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm">
        <div className="w-full">
          <div className="flex justify-center items-center gap-[16px] mb-[14px]">
            <button 
              onClick={() => handleMudarAno(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white cursor-pointer transition-colors shadow-sm"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <span className="text-[18px] font-black text-[#0F172A] dark:text-white tracking-tight">
              {anoAtual}
            </span>
            <button 
              onClick={() => handleMudarAno(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white cursor-pointer transition-colors shadow-sm"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Desktop Month Pills */}
          <div className="hidden md:flex gap-[8px] justify-center w-full flex-wrap pb-1">
            {MESES.map((nomeMes, index) => {
              const ativo = index + 1 === mesAtual;
              return (
                <button
                  key={nomeMes}
                  onClick={() => handleMudarMes(index)}
                  className={`px-5 py-2 rounded-full font-bold text-[13px] transition-all whitespace-nowrap ${
                    ativo 
                      ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]' 
                      : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  {nomeMes}
                </button>
              );
            })}
          </div>

          {/* Mobile Month Dropdown */}
          <div className="md:hidden relative w-full" ref={dropdownRef}>
            <button
              onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] text-[14px] font-[600] text-[#0F172A] dark:text-white transition-all focus:border-[#2563EB]"
            >
              <span>{MESES[mesAtual - 1]}</span>
              <ChevronDown size={16} className={`text-[#64748B] dark:text-[#94A3B8] transition-transform ${dropdownMesAberto ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownMesAberto && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] shadow-lg z-20 overflow-hidden flex flex-col">
                <div className="max-h-[240px] overflow-y-auto p-2 flex flex-col gap-1">
                  {MESES.map((nomeMes, index) => {
                    const ativo = index + 1 === mesAtual;
                    return (
                      <button
                        key={nomeMes}
                        onClick={() => {
                          handleMudarMes(index);
                          setDropdownMesAberto(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[14px] font-[600] rounded-xl transition-colors ${
                          ativo
                            ? 'bg-[#E0E7FF] dark:bg-[#1E3A8A]/40 text-[#2563EB] dark:text-[#3B82F6]'
                            : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-white'
                        }`}
                      >
                        {nomeMes}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. FILTROS */}
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[16px] p-[14px_20px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm flex flex-col lg:flex-row lg:items-center gap-[12px]">
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
        
          <div className="flex gap-2 w-full lg:w-auto self-start flex-wrap">
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`flex-1 lg:flex-none min-w-[100px] lg:w-32 py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              filtroTipo === 'todos'
                ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]'
                : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroTipo('receita')}
            className={`flex-1 lg:flex-none min-w-[100px] lg:w-32 py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              filtroTipo === 'receita'
                ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]'
                : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => setFiltroTipo('despesa')}
            className={`flex-1 lg:flex-none min-w-[100px] lg:w-32 py-2 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              filtroTipo === 'despesa'
                ? 'bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#2563EB] dark:text-[#3B82F6] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B]'
                : 'border border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            }`}
          >
            Despesas
          </button>
        </div>
      </div>

      {/* 4. LISTA DE TRANSAÇÕES */}
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[16px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm overflow-hidden">
        
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
                  <div className="bg-[#F8FAFC] dark:bg-[#0F172A]  p-[8px_20px] flex justify-between items-center border-b border-[#E2E8F0] dark:border-[#1E293B]">
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
                      <div key={t.id} className="p-[14px_20px] flex items-center justify-between gap-[14px] border-b border-[#F1F5F9] dark:border-[#0F172A] transition-colors hover:bg-[#FAFAFA] dark:hover:bg-[#0F172A] ">
                        
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
                                      t.forma_pagamento === 'dinheiro' ? 'Conta' :
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
                                className="btn-salvar flex-1"
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
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[20px] p-[24px] w-full max-w-[380px] shadow-[0_24px_48px_rgba(0,0,0,0.15)] flex flex-col border-[1.5px] border-[#F1F5F9] dark:border-[#334155]">
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
                className="btn-cancelar flex-1"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmarEfetivacao}
                className="btn-salvar flex-1"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmDeleteId && (
        <div className="mt-8 flex justify-center">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[16px] p-[24px] w-full max-w-[360px] text-center shadow-[0_24px_48px_rgba(0,0,0,0.15)] flex flex-col items-center">
            <AlertTriangle size={40} className="text-[#EF4444] mb-[12px]" />
            <h3 className="text-[16px] font-[800] text-[#0F172A] dark:text-white mb-1">Excluir transação?</h3>
            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mb-6">
              {transacoes.find(t => t.id === confirmDeleteId)?.descricao}
            </p>
            <div className="flex gap-[10px] w-full">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="btn-cancelar flex-1"
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
