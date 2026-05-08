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
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm mb-6">
      <h3 className="text-lg font-bold text-[#0F172A] mb-4">
        {editingId ? "Editar Cartão" : "Novo Cartão"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-[#374151] mb-1">
            Nome do Cartão
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
            placeholder="Ex: Nubank, Itaú..."
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#374151] mb-1">
            Limite (R$)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-black font-medium">
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
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg pl-10 pr-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all font-medium"
            />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#374151] mb-1">
            Cor
          </label>
          <input
            type="color"
            value={formData.cor}
            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
            className="w-full h-10 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#374151] mb-1">
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
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
            placeholder="1-31"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#374151] mb-1">
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
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
            placeholder="1-31"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#374151] mb-1">
            Tipo
          </label>
          <select
            value={formData.tipo}
            onChange={(e) =>
              setFormData({ ...formData, tipo: e.target.value as any })
            }
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
          >
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
            <option value="pre_pago">Pré-pago</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 mt-6 justify-end border-t border-[#E2E8F0] pt-4">
        <button
          onClick={resetForm}
          className="px-4 py-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors font-medium text-sm"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#1D4ED8] transition-colors"
        >
          <Save size={16} /> Salvar Cartão
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Meus Cartões
          </h2>
          <p className="text-[#64748B] mt-1">
            Gerencie seus cartões e controle suas faturas.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.2)] cursor-pointer"
          >
            <Plus size={18} /> Novo Cartão
          </button>
        )}
      </div>

      {(isAdding || editingId) && renderForm()}

      {loading && !cards.length && (
        <div className="text-center py-10 text-[#64748B]">
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
              className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md group"
            >
              {/* Header do Card (Visual do Cartão) */}
              <div 
                className="p-6 text-white relative h-[180px] overflow-hidden"
                style={{ backgroundColor: card.cor || "#2563EB" }}
              >
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-5 rounded-full -ml-8 -mb-8 blur-xl"></div>
                


                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
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
                        <div className="w-1 h-1 rounded-full bg-white/40"></div>
                        <span className="text-[10px] font-bold opacity-80">
                          venc. dia {card.dia_vencimento_fatura}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(card)}
                      className="p-2 bg-white/15 hover:bg-white/30 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
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
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#CBD5E1]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F1F5F9] text-[#64748B] mb-4">
            <CreditCard size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">
            Nenhum cartão cadastrado
          </h3>
          <p className="text-[#64748B] max-w-sm mx-auto mt-2">
            Você ainda não adicionou nenhum cartão. Clique em "Novo Cartão" para
            começar.
          </p>
        </div>
      )}
    </div>
  );
}
