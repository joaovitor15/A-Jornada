import React, { useState, useEffect, useRef } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  AlertCircle,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import { useTransacoes, Transacao } from "../hooks/useTransacoes";
import { useCategories } from "../hooks/useCategories";
import { useCards } from "../hooks/useCards";

import { AnimatePresence, motion } from "motion/react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfilId: string;
  transacaoParaEditar?: Transacao | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  perfilId,
  transacaoParaEditar,
}: TransactionModalProps) {
  const { criarTransacao, editarTransacao } = useTransacoes();
  const { categories, tags } = useCategories(perfilId);
  const { cards } = useCards(perfilId);

  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [descricao, setDescricao] = useState("");
  const [tagBusca, setTagBusca] = useState("");
  const [tagSelecionada, setTagSelecionada] = useState<{
    id: string;
    nome: string;
  } | null>(null);
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [digitosValor, setDigitosValor] = useState("0");
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [cardId, setCardId] = useState<string>("");
  const [erro, setErro] = useState<{ campo: string; mensagem: string } | null>(
    null,
  );

  const [mostrarDropdownTag, setMostrarDropdownTag] = useState(false);
  const containerTagRef = useRef<HTMLDivElement>(null);
  const inputTagRef = useRef<HTMLInputElement>(null);

  const [parcelas, setParcelas] = useState("1");

  useEffect(() => {
    if (isOpen && transacaoParaEditar) {
      setTipo(transacaoParaEditar.tipo);
      setDescricao(transacaoParaEditar.descricao);
      setData(transacaoParaEditar.data);
      const fpOriginal = transacaoParaEditar.forma_pagamento?.toLowerCase() || "";
      const isCardOriginal = fpOriginal.includes("cartao") || !!transacaoParaEditar.card_id;
      
      setFormaPagamento(isCardOriginal ? (transacaoParaEditar.card_id || "cartao_credito") : "dinheiro");
      setCardId(transacaoParaEditar.card_id || "");
      setParcelas(transacaoParaEditar.num_parcelas?.toString() || "1");
      setDigitosValor(Math.round(transacaoParaEditar.valor * 100).toString());

      if (transacaoParaEditar.tags) {
        setTagSelecionada({
          id: transacaoParaEditar.tags.id,
          nome: transacaoParaEditar.tags.nome,
        });
        setTagBusca(transacaoParaEditar.tags.nome);
      } else {
        setTagSelecionada(null);
        setTagBusca("");
      }
    } else if (isOpen) {
      setTipo("despesa");
      setDescricao("");
      setTagBusca("");
      setTagSelecionada(null);
      setData(new Date().toISOString().split("T")[0]);
      setDigitosValor("0");
      setFormaPagamento("dinheiro");
      setCardId("");
      setParcelas("1");
      setErro(null);
    }
  }, [isOpen, transacaoParaEditar]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (
        containerTagRef.current &&
        !containerTagRef.current.contains(e.target as Node)
      ) {
        setMostrarDropdownTag(false);
        if (!tagSelecionada) {
          setTagBusca("");
        } else {
          setTagBusca(tagSelecionada.nome);
        }
      }
    };

    if (mostrarDropdownTag) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickFora);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickFora);
      };
    }
  }, [mostrarDropdownTag, tagSelecionada]);

  // Limpar tag ao mudar de tipo
  useEffect(() => {
    if (!transacaoParaEditar || (isOpen && !transacaoParaEditar)) {
      setTagSelecionada(null);
      setTagBusca("");
      if (tipo === "receita") {
        setFormaPagamento("dinheiro");
        setCardId("");
      }
    }
  }, [tipo, isOpen, transacaoParaEditar]);

  const formatarValor = (digitos: string) => {
    const numero = parseInt(digitos) / 100;
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const valorExibido = formatarValor(digitosValor);
  const valorNumerico = parseInt(digitosValor) / 100;

  const handleValorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" || e.key === "Enter") return;
    e.preventDefault();
    if (e.key === "Backspace") {
      setDigitosValor((prev) => prev.slice(0, -1) || "0");
      return;
    }
    if (!/[0-9]/.test(e.key)) return;
    setDigitosValor((prev) => {
      const novo = prev === "0" ? e.key : prev + e.key;
      if (novo.length > 10) return prev;
      return novo;
    });
  };

  const tagsFiltradas = tags.filter((tag) => {
    const categoria = categories.find((c) => c.id === tag.category_id);
    if (!categoria || categoria.tipo !== tipo) return false;
    return tag.nome.toLowerCase().includes(tagBusca.toLowerCase());
  });

  const selecionarTag = (tag: { id: string; nome: string }) => {
    setTagSelecionada(tag);
    setTagBusca("");
    setMostrarDropdownTag(false);
    setErro((prev) => (prev?.campo === "tag" ? null : prev));
  };

  const limparTag = () => {
    setTagSelecionada(null);
    setTagBusca("");
    setMostrarDropdownTag(true);
    setTimeout(() => {
      inputTagRef.current?.focus();
    }, 50);
  };

  const handleSalvar = async () => {
    setErro(null);

    if (!descricao.trim()) {
      setErro({ campo: "descricao", mensagem: "Informe uma descrição" });
      return;
    }
    if (!tagSelecionada) {
      setErro({ campo: "tag", mensagem: "Selecione uma tag válida da lista" });
      return;
    }
    if (valorNumerico <= 0) {
      setErro({ campo: "valor", mensagem: "Informe um valor maior que zero" });
      return;
    }
    if (!data) {
      setErro({ campo: "data", mensagem: "Informe a data" });
      return;
    }
    if (formaPagamento !== "dinheiro" && !cardId) {
      setErro({ campo: "card_id", mensagem: "Selecione um cartão" });
      return;
    }

    const isCard = tipo === "despesa" && formaPagamento !== "dinheiro";

    const dadosSalvar = {
      profile_id: perfilId,
      tipo,
      descricao,
      tag_id: tagSelecionada.id,
      data,
      valor: valorNumerico,
      forma_pagamento: isCard ? "cartao_credito" : "dinheiro",
      card_id: isCard ? cardId : null,
      num_parcelas: isCard ? parseInt(parcelas) : null,
      recorrente_id: transacaoParaEditar?.recorrente_id || null
    };

    if (transacaoParaEditar) {
      const { success, error } = await editarTransacao(
        transacaoParaEditar.id,
        dadosSalvar,
      );
      if (error) alert(error);
      else onClose();
    } else {
      const parcelasInt = parseInt(parcelas);
      const isCard = formaPagamento !== "dinheiro";

      if (isCard && parcelasInt > 1) {
        const valorParcela = valorNumerico / parcelasInt;
        const [y, m, d] = data.split("-").map(Number);
        const baseDate = new Date(y, m - 1, d);
        let errorOcorreu = null;
        for (let i = 0; i < parcelasInt; i++) {
          const dt = new Date(baseDate);
          dt.setMonth(dt.getMonth() + i);
          const dataFormatada = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

          const { error } = await criarTransacao({
            ...dadosSalvar,
            valor: valorParcela,
            data: dataFormatada,
            descricao: `${descricao} (${i + 1}/${parcelasInt})`,
            num_parcelas: i + 1
          });
          if (error) errorOcorreu = error;
        }
        if (errorOcorreu) alert(errorOcorreu);
        else onClose();
      } else {
        const { success, error } = await criarTransacao(dadosSalvar);
        if (error) alert(error);
        else onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0F172A80] dark:bg-[#0F172AB3] backdrop-blur-[4px] z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-[#FFFFFF] dark:bg-[#1E293B] rounded-[24px] p-[20px] w-full max-w-[420px] shadow-[0_24px_48px_rgba(0,0,0,0.15)] max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-[800] text-[#0F172A] dark:text-white">
            {transacaoParaEditar ? "Editar Transação" : "Nova Transação"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] dark:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-[10px] mb-[18px]">
          <button
            onClick={() => setTipo("receita")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-[100px] py-[8px] px-[16px] text-[14px] font-[700] transition-all duration-200 ${
              tipo === "receita"
                ? "bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A] border-[1.5px] border-[#16A34A] shadow-[0_2px_8px_rgba(22,163,74,0.2)]"
                : "bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] dark:bg-[#334155]"
            }`}
          >
            <TrendingUp size={15} />
            Receita
          </button>
          <button
            onClick={() => setTipo("despesa")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-[100px] py-[8px] px-[16px] text-[14px] font-[700] transition-all duration-200 ${
              tipo === "despesa"
                ? "bg-[#FEE2E2] dark:bg-red-900/30 text-[#EF4444] border-[1.5px] border-[#EF4444] shadow-[0_2px_8px_rgba(239,68,68,0.2)]"
                : "bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#475569] dark:bg-[#334155]"
            }`}
          >
            <TrendingDown size={15} />
            Despesa
          </button>
        </div>

        <div className="space-y-[14px]">
          <div>
            <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
                setErro((prev) => (prev?.campo === "descricao" ? null : prev));
              }}
              placeholder="Ex: Supermercado, Salário..."
              className={`w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]`}
            />
            {erro?.campo === "descricao" && (
              <div className="text-[#EF4444] text-[12px] mt-1.5 flex items-center gap-1 font-[600]">
                <AlertCircle size={13} /> {erro.mensagem}
              </div>
            )}
          </div>

          <div className="relative" ref={containerTagRef}>
            <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
              Tag
            </label>
            <div className="relative">
              {tagSelecionada ? (
                <div
                  className={`inline-flex items-center gap-[6px] rounded-[100px] p-[6px_12px] text-[13px] font-[600] border-[1.5px] w-fit shadow-sm ${
                    tipo === "receita"
                      ? "bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A] border-[#16A34A]"
                      : "bg-[#FEE2E2] dark:bg-red-900/30 text-[#EF4444] border-[#EF4444]"
                  }`}
                >
                  <span>{tagSelecionada.nome}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      limparTag();
                    }}
                    className="p-[2px] rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                  />
                  <input
                    ref={inputTagRef}
                    type="text"
                    value={tagBusca}
                    onChange={(e) => {
                      setTagBusca(e.target.value);
                      setMostrarDropdownTag(true);
                      setErro((prev) => (prev?.campo === "tag" ? null : prev));
                    }}
                    onFocus={() => setMostrarDropdownTag(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setMostrarDropdownTag(false);
                      }
                      if (e.key === "Tab") {
                        setMostrarDropdownTag(false);
                      }
                    }}
                    placeholder="Buscar tag..."
                    className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[12px] p-[10px_12px_10px_34px] text-[14px] font-[500] outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                  />
                </div>
              )}
            </div>

            {erro?.campo === "tag" && (
              <div className="text-[#EF4444] text-[12px] mt-1.5 flex items-center gap-1 font-[600]">
                <AlertCircle size={13} /> {erro.mensagem}
              </div>
            )}

            {mostrarDropdownTag && (
              <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] max-h-[220px] overflow-y-auto z-[60] p-[6px] space-y-[2px]">
                {tagsFiltradas.length > 0 ? (
                  tagsFiltradas.map((tag) => {
                    const categoria = categories.find(
                      (c) => c.id === tag.category_id,
                    );
                    return (
                      <button
                        key={tag.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          selecionarTag({ id: tag.id, nome: tag.nome });
                        }}
                        className="w-full p-[10px_14px] text-[14px] font-[500] rounded-[10px] text-left flex items-center gap-3 transition-colors hover:bg-[#F1F5F9] dark:hover:bg-[#475569] dark:bg-[#334155] text-[#374151] dark:text-[#E2E8F0]"
                      >
                        <span
                          className="w-[8px] h-[8px] rounded-full shrink-0"
                          style={{
                            backgroundColor: categoria?.cor || "#CBD5E1",
                          }}
                        />
                        {tag.nome}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-[20px] text-center">
                    <p className="text-[13px] font-[600] text-[#94A3B8]">
                      Tag não encontrada
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
                Data
              </label>
              <div className="relative">
                <Calendar
                  size={15}
                  className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                />
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_12px_10px_34px] text-[13px] font-[600] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none cursor-pointer transition-all focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
                Valor
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={valorExibido}
                onKeyDown={handleValorKeyDown}
                readOnly
                className={`w-full text-right border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_14px] text-[15px] font-[800] bg-[#F8FAFC] dark:bg-[#0F172A] outline-none transition-all focus:border-[#2563EB] ${
                  tipo === "receita" ? "text-[#16A34A]" : "text-[#EF4444]"
                }`}
              />
            </div>
          </div>

          {tipo === "despesa" && cards.length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[6px]">
                Forma de Pagamento
              </label>
              <div className="relative mb-3">
                <CreditCard
                  size={15}
                  className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <select
                  value={formaPagamento}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormaPagamento(val);
                    if (val === "dinheiro") {
                      setCardId("");
                    } else {
                      setCardId(val);
                    }
                  }}
                  className="w-full border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[14px] p-[10px_12px_10px_34px] text-[14px] font-[500] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white outline-none cursor-pointer appearance-none focus:border-[#2563EB]"
                >
                  <option value="dinheiro">Dinheiro</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              {formaPagamento !== "dinheiro" && !transacaoParaEditar && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200 mt-3 flex items-center gap-3 bg-[#F8FAFC] dark:bg-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
                  <div className="w-[80px]">
                    <label className="block text-[10px] font-[800] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                      Parcelas
                    </label>
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      placeholder="1"
                      value={parcelas}
                      onChange={(e) => setParcelas(e.target.value)}
                      className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0F172A] dark:text-white outline-none focus:border-[#2563EB] transition-all"
                    />
                  </div>

                  {(parseInt(parcelas) || 1) > 1 && (
                    <div className="flex-1 animate-in fade-in slide-in-from-left-2 duration-300">
                      <label className="block text-[10px] font-[800] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
                        Valor p/ Parcela
                      </label>
                      <div className="w-full h-[30px] bg-slate-100/50 dark:bg-slate-800/50 border border-[#E2E8F0] dark:border-[#334155] rounded-lg px-3 flex items-center text-xs font-bold text-[#2563EB] dark:text-blue-400">
                        R$ {(valorNumerico / (parseInt(parcelas) || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-[24px] flex gap-[12px]">
          <button
            onClick={onClose}
            className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] font-[700] text-[14px] rounded-[14px] py-[12px] hover:bg-[#E2E8F0] dark:hover:bg-[#475569] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className={`flex-1 text-white font-[800] text-[14px] rounded-[14px] py-[12px] transition-all shadow-lg active:scale-[0.98] ${
              tipo === "receita"
                ? "bg-[#16A34A] shadow-[0_4px_14px_rgba(22,163,74,0.3)] hover:bg-[#15803D]"
                : "bg-[#EF4444] shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:bg-[#DC2626]"
            }`}
          >
            {transacaoParaEditar ? "Salvar Alterações" : "Confirmar"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}
