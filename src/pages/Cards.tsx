import React, { useState, useEffect } from "react";
import { useCards, Card } from "../hooks/useCards";
import { supabase } from "../supabaseClient";
import {
  Plus,
  Pencil,
  Trash2,
  ReceiptText,
  Save,
  X,
  CreditCard,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface CardsPageProps {
  activeProfileId?: string;
}

export function CardsPage({ activeProfileId }: CardsPageProps) {
  const { cards, loading, addCard, updateCard, deleteCard, refresh: refreshCards } =
    useCards(activeProfileId);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [faturaDados, setFaturaDados] = useState<
    Record<string, {
      valor: number;
      inicio: Date;
      fim: Date;
      vencimento: Date;
      status: 'ABERTA' | 'FECHADA' | 'VENCIDA' | 'PAGA';
      label: string;
    }>
  >({});
  const [transacoesCard, setTransacoesCard] = useState<any[]>([]);
  const [digitosLimite, setDigitosLimite] = useState("0");

  const helperCalcularPeriodo = (diaFechamento: number, diaVencimento: number, offsetMes: number = 0) => {
    const hoje = new Date();
    const targetDate = new Date(hoje.getFullYear(), hoje.getMonth() + offsetMes, hoje.getDate());
    const ano = targetDate.getFullYear();
    const mes = targetDate.getMonth();

    let dataFechamentoReferencia = new Date(ano, mes, diaFechamento);
    let dataInicio: Date;
    let dataFim: Date;
    let dataVencimento: Date;

    if (targetDate <= dataFechamentoReferencia) {
      dataInicio = new Date(ano, mes - 1, diaFechamento + 1);
      dataFim = new Date(ano, mes, diaFechamento);
      dataVencimento = new Date(ano, mes, diaVencimento);
      if (diaVencimento < diaFechamento) {
        dataVencimento.setMonth(dataVencimento.getMonth() + 1);
      }
    } else {
      dataInicio = new Date(ano, mes, diaFechamento + 1);
      dataFim = new Date(ano, mes + 1, diaFechamento);
      dataVencimento = new Date(ano, mes + 1, diaVencimento);
      if (diaVencimento < diaFechamento) {
        dataVencimento.setMonth(dataVencimento.getMonth() + 1);
      }
    }

    const label = `${dataInicio.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${dataFim.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`;
    
    const toISO = (d: Date) => d.toISOString().split('T')[0];
    const toLocalISO = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return { 
      inicio: dataInicio, 
      fim: dataFim, 
      vencimento: dataVencimento, 
      label,
      inicioStr: toLocalISO(dataInicio),
      fimStr: toLocalISO(dataFim)
    };
  };

  const calcularPeriodoFatura = (diaFechamento: number, diaVencimento: number) => {
    const hoje = new Date();
    const periodo = helperCalcularPeriodo(diaFechamento, diaVencimento, 0);

    let status: 'ABERTA' | 'FECHADA' | 'VENCIDA' | 'PAGA' = 'ABERTA';
    if (hoje > periodo.fim && hoje < periodo.vencimento) {
      status = 'FECHADA';
    } else if (hoje > periodo.vencimento) {
      status = 'VENCIDA';
    }

    return { ...periodo, status };
  };

  useEffect(() => {
    async function fetchTodosGastos() {
      if (!activeProfileId) return;
      const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .not('card_id', 'is', null);

      if (!error && data) {
         setTransacoesCard(data);
      }
    }
    fetchTodosGastos();
  }, [activeProfileId, cards, refreshTrigger]);

  useEffect(() => {
    if (!activeProfileId || cards.length === 0) return;
    const dadosCalculados: Record<string, any> = {};

    cards.forEach(card => {
      const periodo = calcularPeriodoFatura(
        card.dia_fechamento_fatura,
        card.dia_vencimento_fatura
      );

      const transacoesFaturaAtual = transacoesCard.filter(t => t.card_id === card.id && t.data <= (periodo as any).fimStr);
      
      const despesasFatura = transacoesFaturaAtual
        .filter(t => t.tipo === 'despesa')
        .reduce((acc, t) => acc + Number(t.valor), 0);
        
      const creditosFatura = transacoesFaturaAtual
        .filter(t => t.tipo === 'receita')
        .reduce((acc, t) => acc + Number(t.valor), 0);

      const valorFatura = despesasFatura - creditosFatura;

      const valorFuturo = transacoesCard
        .filter(t => t.card_id === card.id && t.data > (periodo as any).fimStr)
        .reduce((acc, t) => t.tipo === 'despesa' ? acc + Number(t.valor) : acc - Number(t.valor), 0);

      const saldoTotalHistorico = transacoesCard
        .filter(t => t.card_id === card.id)
        .reduce((acc, t) => t.tipo === 'despesa' ? acc + Number(t.valor) : acc - Number(t.valor), 0);
      const globalCredit = saldoTotalHistorico < 0 ? Math.abs(saldoTotalHistorico) : 0;
      const limitUsed = saldoTotalHistorico;

      dadosCalculados[card.id] = {
        ...periodo,
        valor: valorFatura,
        despesas: despesasFatura,
        creditos: creditosFatura,
        valorFuturo: valorFuturo,
        globalCredit: globalCredit,
        limitUsed: limitUsed
      };
    });

    setFaturaDados(dadosCalculados);
  }, [cards, transacoesCard, activeProfileId]);

  const [formData, setFormData] = useState<Partial<Card>>({
    nome: "",
    limite: 0,
    dia_vencimento_fatura: 10,
    dia_fechamento_fatura: 3,
    cor: "#2563EB",
    icone: "CreditCard",
    tipo: "credito",
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      limite: 0,
      dia_vencimento_fatura: 10,
      dia_fechamento_fatura: 3,
      cor: "#2563EB",
      icone: "CreditCard",
      tipo: "credito",
    });
    setDigitosLimite("0");
    setIsAdding(false);
    setEditingId(null);
  };

  const formatarMoeda = (digitos: string) => {
    const numero = parseInt(digitos) / 100;
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleSave = async () => {
    if (!formData.nome) {
      alert("Nome do cartão é obrigatório");
      return;
    }

    const finalLimite = parseInt(digitosLimite) / 100;
    
    // Inserir bandeira automaticamente baseada no nome
    let bandeiraInferred = 'visa';
    const nomeBaixo = formData.nome.toLowerCase();
    if (nomeBaixo.includes('master')) bandeiraInferred = 'mastercard';
    if (nomeBaixo.includes('elo')) bandeiraInferred = 'elo';
    if (nomeBaixo.includes('amex') || nomeBaixo.includes('american')) bandeiraInferred = 'amex';

    const finalData = { 
      ...formData, 
      limite: finalLimite,
      bandeira: bandeiraInferred
    };

    if (
      !finalData.dia_vencimento_fatura ||
      finalData.dia_vencimento_fatura < 1 ||
      finalData.dia_vencimento_fatura > 31
    ) {
      alert("Dia de vencimento da fatura deve ser entre 1 e 31");
      return;
    }

    if (
      !finalData.dia_fechamento_fatura ||
      finalData.dia_fechamento_fatura < 1 ||
      finalData.dia_fechamento_fatura > 31
    ) {
      alert("Dia de fechamento da fatura deve ser entre 1 e 31");
      return;
    }

    if (editingId) {
      const { error } = await updateCard(editingId, finalData);
      if (error) alert("Erro ao atualizar cartão: " + error.message);
      else resetForm();
    } else {
      const { error } = await addCard(finalData as any);
      if (error) alert("Erro ao criar cartão: " + error.message);
      else resetForm();
    }
  };

  const startEdit = (card: Card) => {
    setFormData(card);
    setEditingId(card.id);
    setDigitosLimite(Math.round(card.limite * 100).toString());
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este cartão?")) {
      const { error } = await deleteCard(id);
      if (error) alert("Erro ao excluir cartão: " + error.message);
    }
  };

  const getBandeiraIcon = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes('visa')) return (
      <div className="flex items-center italic font-black text-xl">
        <span className="text-white">VISA</span>
      </div>
    );
    if (n.includes('master')) return (
      <div className="flex -space-x-3 items-center">
        <div className="w-8 h-8 rounded-full bg-[#EB001B]/80"></div>
        <div className="w-8 h-8 rounded-full bg-[#FF5F00]/80"></div>
      </div>
    );
    if (n.includes('elo')) return (
      <div className="flex items-center gap-1">
         <div className="w-3 h-3 rounded-full bg-red-500"></div>
         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
         <div className="w-3 h-3 rounded-full bg-blue-500"></div>
         <span className="font-bold text-xs">elo</span>
      </div>
    );
    return (
      <div className="flex -space-x-4 opacity-80">
        <div className="w-8 h-8 rounded-full bg-slate-400/50"></div>
        <div className="w-8 h-8 rounded-full bg-slate-200/50"></div>
      </div>
    );
  };

  const renderForm = () => (
    <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] p-[20px] lg:p-[24px] shadow-sm mb-6 flex flex-col relative overflow-hidden group">
      <h3 className="text-[18px] font-[800] text-[#0F172A] dark:text-white mb-[20px]">
        {editingId ? "Editar Cartão" : "Novo Cartão"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
        <div>
          <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
            Nome do Cartão
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] placeholder:font-[500] placeholder:text-[#94A3B8]"
            placeholder="Ex: Nubank, Itaú..."
          />
        </div>
        <div>
          <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
            Limite
          </label>
          <div className="relative">
            <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[14px] text-black dark:text-white font-[600]">
              R$
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={formatarMoeda(digitosLimite)}
              readOnly
              onKeyDown={(e) => {
                if (e.key === "Tab" || e.key === "Enter") return;
                e.preventDefault();
                if (e.key === "Backspace") {
                  setDigitosLimite((prev) => prev.slice(0, -1) || "0");
                  return;
                }
                if (!/[0-9]/.test(e.key)) return;
                setDigitosLimite((prev) => {
                  const novo = prev === "0" ? e.key : prev + e.key;
                  if (novo.length > 10) return prev;
                  return novo;
                });
              }}
              className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px_10px_40px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
            />
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
            Cor
          </label>
          <input
            type="color"
            value={formData.cor}
            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
            className="w-full h-[45px] p-[4px] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
            Vencimento Fatura
          </label>
          <input
            type="number"
            min="1"
            max="31"
            value={formData.dia_vencimento_fatura}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              if (val > 31) return;
              setFormData({
                ...formData,
                dia_vencimento_fatura: val,
              });
            }}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] placeholder:font-[500] placeholder:text-[#94A3B8]"
            placeholder="1-31"
          />
        </div>
        <div>
          <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
            Fechamento Fatura
          </label>
          <input
            type="number"
            min="1"
            max="31"
            value={formData.dia_fechamento_fatura}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              if (val > 31) return;
              setFormData({
                ...formData,
                dia_fechamento_fatura: val,
              });
            }}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] placeholder:font-[500] placeholder:text-[#94A3B8]"
            placeholder="1-31"
          />
        </div>
        <div>
          <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
            Tipo
          </label>
          <select
            value={formData.tipo}
            onChange={(e) =>
              setFormData({ ...formData, tipo: e.target.value as any })
            }
            className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
          >
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
            <option value="pre_pago">Pré-pago</option>
          </select>
        </div>
      </div>
      <div className="flex gap-[12px] mt-[24px] shrink-0 border-t border-[#E2E8F0] dark:border-[#334155] pt-[20px]">
        <button
          onClick={resetForm}
          className="btn-cancelar flex-1"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="btn-salvar flex-1"
        >
          <Save size={18} /> Salvar Cartão
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-3">
            <CreditCard size={28} className="text-[#3B82F6]" /> Meus Cartões
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] mt-1">
            Gerencie seus cartões.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-0 lg:gap-[8px] border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#2563EB] dark:text-[#3B82F6] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] rounded-[100px] w-[44px] h-[44px] lg:w-auto lg:h-auto lg:px-[22px] lg:py-[10px] font-bold text-[14px] shadow-sm transition-all group cursor-pointer"
          >
            <Plus size={20} strokeWidth={3} className="lg:w-[15px] lg:h-[15px] transition-transform group-hover:scale-110" />
            <span className="hidden lg:inline uppercase">Novo Cartão</span>
          </button>
        )}
      </div>

      {(isAdding || editingId) && renderForm()}

      {loading && !cards.length && (
        <div className="text-center py-10 text-[#64748B] dark:text-[#94A3B8]">
          Carregando cartões...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const CardIcon =
            (LucideIcons as any)[card.icone || "CreditCard"] || CreditCard;
          
          const dados = faturaDados[card.id] || { 
            valor: 0, 
            valorFuturo: 0,
            globalCredit: 0,
            limitUsed: 0,
            label: "Carregando...", 
            status: "ABERTA", 
            inicio: new Date(), 
            fim: new Date() 
          };

          const limitUsed = Math.max(0, dados.limitUsed || 0);
          const valorParaProgresso = Math.max(0, dados.valor);
          const pctFatura = Math.min((valorParaProgresso / (card.limite || 1)) * 100, 100);
          
          let pctCredito = 0;
          const valorCredito = dados.creditos || 0;
          if (valorCredito > 0) {
             pctCredito = Math.min((valorCredito / (card.limite || 1)) * 100, 100 - pctFatura);
          } else if (dados.valor < 0) {
             pctCredito = Math.min((Math.abs(dados.valor) / (card.limite || 1)) * 100, 100);
          }
          
          const pctFuturo = Math.max(0, Math.min((Math.max(0, limitUsed - valorParaProgresso) / (card.limite || 1)) * 100, 100 - (pctFatura + pctCredito)));
          
          const statusColors = {
            ABERTA: "bg-blue-50 text-blue-600 border-blue-200",
            FECHADA: "bg-red-50 text-red-600 border-red-200",
            VENCIDA: "bg-red-100 text-red-700 border-red-300",
            PAGA: "bg-emerald-50 text-emerald-600 border-emerald-200"
          };

          const barColor = dados.status === 'ABERTA' ? 'bg-blue-500' : 'bg-red-500';

          return (
            <div
              key={card.id}
              className="bg-white dark:bg-[#1E293B] rounded-[24px] border border-[#E2E8F0] dark:border-[#334155] shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md group"
            >
              {/* Header do Card (Visual do Cartão) */}
              <div 
                className="p-6 text-white relative h-[180px] overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${card.cor || "#2563EB"} 0%, color-mix(in srgb, ${card.cor || "#2563EB"} 60%, black) 100%)`
                }}
              >
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-[#1E293B] opacity-10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-5 rounded-full -ml-8 -mb-8 blur-xl"></div>
                


                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-[#1E293B]/20 p-2.5 rounded-xl backdrop-blur-md">
                      <CardIcon size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[17px] tracking-tight truncate max-w-[150px]">
                        {card.nome}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                          {card.tipo}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white dark:bg-[#1E293B]/40"></div>
                        <span className="text-[10px] font-bold opacity-80">
                          venc. dia {card.dia_vencimento_fatura}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(card)}
                      className="p-2 bg-white dark:bg-[#1E293B]/15 hover:bg-white dark:bg-[#1E293B]/30 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-8 relative z-10 w-full overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1 block">
                    Limite Disponível
                  </span>
                  <div className="text-2xl font-black flex items-baseline gap-1">
                    <span className="text-sm font-bold opacity-80">R$</span>
                    {new Intl.NumberFormat("pt-BR", {
                      minimumFractionDigits: 2,
                    }).format(card.limite - limitUsed)}
                  </div>
                </div>

                {/* Card Brand - Simulated Logo */}
                <div className="absolute bottom-6 right-6 opacity-50 mix-blend-overlay">
                   {getBandeiraIcon(card.nome)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && cards.length === 0 && !isAdding && (
        <div className="text-center py-20 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-2xl border border-dashed border-[#CBD5E1] dark:border-[#475569]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] mb-4">
            <CreditCard size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
            Nenhum cartão cadastrado
          </h3>
          <p className="text-[#64748B] dark:text-[#94A3B8] max-w-sm mx-auto mt-2">
            Você ainda não adicionou nenhum cartão. Clique em "Novo Cartão" para
            começar.
          </p>
        </div>
      )}
    </div>
  );
}
