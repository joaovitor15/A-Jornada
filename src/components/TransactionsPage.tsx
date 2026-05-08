import React, { useState, useEffect, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, Search, TrendingUp, TrendingDown, CreditCard, Pencil, Trash2, AlertTriangle, ReceiptText } from 'lucide-react';
import { useTransacoes, Transacao } from '../hooks/useTransacoes';
import { TransactionModal } from './TransactionModal';

interface TransactionsPageProps {
  activeProfileId?: string;
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function TransactionsPage({ activeProfileId }: TransactionsPageProps) {
  const { transacoes, loading, carregarTransacoesMes, excluirTransacao } = useTransacoes();
  const [dataAtual, setDataAtual] = useState(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transacaoParaEditar, setTransacaoParaEditar] = useState<Transacao | null>(null);
  
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'receitas' | 'despesas'>('todos');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const mesAtual = dataAtual.getMonth() + 1;
  const anoAtual = dataAtual.getFullYear();

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

  return (
    <div className="p-[24px] max-w-[1100px] mx-auto flex flex-col gap-[20px] w-full">
      {/* 1. CABEÇALHO */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[22px] font-[800] text-[#0F172A]">Transações</h1>
          <p className="text-[13px] text-[#94A3B8] capitalize">
            {dataAtual.toLocaleString('pt-BR', { month: 'long' })} de {anoAtual}
          </p>
        </div>
        <button
          onClick={() => {
            setTransacaoParaEditar(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-[8px] bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] rounded-[100px] px-[22px] py-[10px] text-white font-[700] text-[14px] shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-[1px] transition-all"
        >
          <Plus size={15} />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* 2. NAVEGAÇÃO TEMPORAL */}
      <div className="bg-[#FFFFFF] rounded-[16px] p-[16px_20px] border-[1.5px] border-[#F1F5F9] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-center items-center gap-[16px] mb-[14px]">
          <button 
            onClick={() => handleMudarAno(-1)}
            className="p-[4px_8px] rounded-[8px] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] cursor-pointer transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-[16px] font-[800] text-[#0F172A]">
            {anoAtual}
          </span>
          <button 
            onClick={() => handleMudarAno(1)}
            className="p-[4px_8px] rounded-[8px] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] cursor-pointer transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="flex gap-[6px] flex-nowrap overflow-x-auto justify-center scrollbar-none">
          {MESES.map((nomeMes, index) => {
            const ativo = index + 1 === mesAtual;
            return (
              <button
                key={nomeMes}
                onClick={() => handleMudarMes(index)}
                className={`rounded-[100px] p-[6px_14px] text-[13px] font-[600] cursor-pointer transition-all border-[1.5px] ${
                  ativo 
                    ? 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.15)]'
                    : 'bg-[#F8FAFC] text-[#64748B] border-transparent hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                {nomeMes}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FILTROS */}
      <div className="bg-[#FFFFFF] rounded-[16px] p-[14px_20px] border-[1.5px] border-[#F1F5F9] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-[12px] flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por descrição, tag ou valor..."
            className="w-full bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[100px] p-[9px_12px_9px_36px] text-[13px] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
          />
        </div>
        
        <div className="flex gap-[6px]">
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`rounded-[100px] p-[7px_16px] text-[13px] font-[600] border-[1.5px] transition-colors ${
              filtroTipo === 'todos'
                ? 'bg-[#0F172A] text-[#FFFFFF] border-[#0F172A]'
                : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]'
            }`}
          >
            TODOS
          </button>
          <button
            onClick={() => setFiltroTipo('receitas')}
            className={`rounded-[100px] p-[7px_16px] text-[13px] font-[600] border-[1.5px] transition-colors ${
              filtroTipo === 'receitas'
                ? 'bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]'
                : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]'
            }`}
          >
            RECEITAS
          </button>
          <button
            onClick={() => setFiltroTipo('despesas')}
            className={`rounded-[100px] p-[7px_16px] text-[13px] font-[600] border-[1.5px] transition-colors ${
              filtroTipo === 'despesas'
                ? 'bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]'
                : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]'
            }`}
          >
            DESPESAS
          </button>
        </div>
      </div>

      {/* 4. LISTA DE TRANSAÇÕES */}
      <div className="bg-[#FFFFFF] rounded-[16px] border-[1.5px] border-[#F1F5F9] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {loading ? (
          <div className="p-[20px] space-y-4">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#F1F5F9] h-[40px] rounded-[8px] w-full" />
             ))}
          </div>
        ) : transacoesFiltradas.length === 0 ? (
          <div className="p-[60px_20px] text-center">
            <ReceiptText size={48} className="text-[#E2E8F0] mx-auto mb-4" />
            <h3 className="text-[16px] font-[700] text-[#94A3B8]">Nenhuma transação encontrada</h3>
            <p className="text-[13px] text-[#CBD5E1]">Clique em + Nova Transação para começar</p>
          </div>
        ) : (
          <div>
            {(Object.entries(transacoesAgrupadas) as [string, Transacao[]][]).sort((a, b) => b[0].localeCompare(a[0])).map(([dataStr, transacoesDia]) => {
              const totalDia = calcularTotalDia(transacoesDia);
              return (
                <div key={dataStr}>
                  {/* SEPARADOR DO DIA */}
                  <div className="bg-[#F8FAFC] p-[8px_20px] flex justify-between items-center border-b-[1px] border-[#F1F5F9]">
                    <span className="text-[12px] font-[700] text-[#64748B] uppercase tracking-[0.05em]">
                      {formatarDataCabecalho(dataStr)}
                    </span>
                    <span className={`text-[12px] font-[700] ${totalDia >= 0 ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                      {formatarMoeda(totalDia, true)}
                    </span>
                  </div>

                  {/* LINHAS DE TRANSAÇÃO */}
                  <div>
                    {transacoesDia.map((t) => (
                      <div key={t.id} className="p-[14px_20px] flex items-center justify-between gap-[14px] border-b-[1px] border-[#F8FAFC] transition-colors hover:bg-[#FAFAFA]">
                        
                        <div className="flex items-center gap-[14px] flex-1 min-w-0">
                          {/* CÍRCULO TIPO */}
                          <div className={`w-[36px] h-[36px] rounded-full shrink-0 flex items-center justify-center ${
                            t.tipo === 'receita' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#EF4444]'
                          }`}>
                            {t.tipo === 'receita' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          </div>

                          {/* DESCRIÇÃO E DETALHES */}
                          <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                            <div className="text-[14px] font-[600] text-[#0F172A] whitespace-nowrap overflow-hidden text-ellipsis">
                              {t.descricao}
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

                              {/* FORMA DE PAGAMENTO */}
                              {t.tipo === 'despesa' && (
                                <div className="flex items-center gap-[4px] text-[12px] text-[#94A3B8]">
                                  <CreditCard size={12} />
                                  <span className="italic">
                                    {t.forma_pagamento === 'pix' ? 'Pix' : 
                                     t.forma_pagamento === 'cartao_credito' ? 'Crédito' :
                                     t.forma_pagamento === 'cartao_debito' ? 'Débito' :
                                     t.forma_pagamento === 'dinheiro' ? 'Dinheiro' :
                                     'A definir'}
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
                            <button
                              onClick={() => {
                                setTransacaoParaEditar(t);
                                setIsModalOpen(true);
                              }}
                              className="p-[6px] rounded-[8px] text-[#CBD5E1] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(t.id)}
                              className="p-[6px] rounded-[8px] text-[#CBD5E1] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
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

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-[#0F172A80] backdrop-blur-[4px] z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[16px] p-[24px] w-full max-w-[360px] text-center shadow-[0_24px_48px_rgba(0,0,0,0.15)] flex flex-col items-center">
            <AlertTriangle size={40} className="text-[#EF4444] mb-[12px]" />
            <h3 className="text-[16px] font-[800] text-[#0F172A] mb-1">Excluir transação?</h3>
            <p className="text-[13px] text-[#64748B] mb-6">
              {transacoes.find(t => t.id === confirmDeleteId)?.descricao}
            </p>
            <div className="flex gap-[10px] w-full">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 bg-[#F1F5F9] text-[#64748B] font-[600] text-[14px] py-[10px] rounded-[12px] hover:bg-[#E2E8F0] transition-colors"
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
