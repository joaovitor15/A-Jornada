import React, { useState, useEffect, useRef } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, ChevronDown, Check, PieChart, Clock, CreditCard } from 'lucide-react';
import { TransactionModal } from './TransactionModal';
import { supabase } from '../supabaseClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { CardFaturaDashboard } from './CardFaturaDashboard';
import { CardProximasContas } from './CardProximasContas';
import { CardLancamentosRapidos } from './CardLancamentosRapidos';

interface DashboardProps {
  activeProfileName: string;
  activeProfileId: string;
  activeProfileType?: string;
}

export const Dashboard = ({ activeProfileName, activeProfileId, activeProfileType }: DashboardProps) => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);

  const [dropdownMesAberto, setDropdownMesAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora ou apertar Escape
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

  const selecionarMes = (index: number) => {
    setMesSelecionado(index + 1);
    setDropdownMesAberto(false);
  };

  const [saldoAnterior, setSaldoAnterior] = useState(0);
  const [receitasValor, setReceitasValor] = useState(0);
  const [despesasValor, setDespesasValor] = useState(0);
  const [investimentosValor, setInvestimentosValor] = useState(0);
  const [cartoesValor, setCartoesValor] = useState(0);
  const [receitasPago, setReceitasPago] = useState(0);
  const [receitasPrevisto, setReceitasPrevisto] = useState(0);
  const [despesasPago, setDespesasPago] = useState(0);
  const [despesasPrevisto, setDespesasPrevisto] = useState(0);
  const [economiaDespesas, setEconomiaDespesas] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);

  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [pendingProvisions, setPendingProvisions] = useState<any[]>([]);
  const [lancamentosRapidos, setLancamentosRapidos] = useState<any[]>([]);

  // Carregar dados dos Cards
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchCards = async () => {
      setIsCardsLoading(true);
      const ms = mesSelecionado;
      const an = anoSelecionado;
      const mesStr = ms.toString().padStart(2, '0');
      const ultimoDia = new Date(an, ms, 0).getDate();

      const { data: antData } = await supabase
        .from('transacoes')
        .select(`valor, valor_previsto, tipo, status, descricao, data, recorrente_id, tags ( categories!tags_category_id_fkey ( nome, cor ) )`)
        .eq('profile_id', activeProfileId)
        .is('card_id', null)
        .lt('data', `${an}-${mesStr}-01`);

      let saldoAntCalcAcumulado = 0;
      if (activeProfileType !== 'empresa' && antData) {
          antData.forEach(t => {
              const vl = t.status === 'previsto' && t.valor_previsto !== undefined && t.valor_previsto !== null ? t.valor_previsto : t.valor;
              const tagCat = (t.tags as any)?.categories?.nome?.toLowerCase();
              if (tagCat === 'investimentos') {
                  saldoAntCalcAcumulado -= (vl || 0);
              } else {
                  if (t.tipo === 'receita') saldoAntCalcAcumulado += (vl || 0);
                  else if (t.tipo === 'despesa') saldoAntCalcAcumulado -= (vl || 0);
              }
          });
      }
      // setSaldoAnterior será chamado no final, após contabilizar faturas

      const { data: receitas } = await supabase
        .from('transacoes')
        .select(`
          *,
          tags ( id, nome, categories!tags_category_id_fkey ( id, nome, cor ) )
        `)
        .eq('profile_id', activeProfileId)
        .eq('tipo', 'receita')
        .is('card_id', null)
        .gte('data', `${an}-${mesStr}-01`)
        .lte('data', `${an}-${mesStr}-${ultimoDia}`);

      const { data: despesas } = await supabase
        .from('transacoes')
        .select(`
          *,
          tags ( id, nome, categories!tags_category_id_fkey ( id, nome, cor ) )
        `)
        .eq('profile_id', activeProfileId)
        .eq('tipo', 'despesa')
        .is('card_id', null)
        .gte('data', `${an}-${mesStr}-01`)
        .lte('data', `${an}-${mesStr}-${ultimoDia}`);

      // Separar receitas por pago vs previsto
      const recsArrOriginal = receitas || [];
      const dspsArrOriginal = despesas || [];

      const recsArr = recsArrOriginal.filter(r => r.tags?.categories?.nome?.toLowerCase() !== 'investimentos');
      const dspsArr = dspsArrOriginal.filter(d => d.tags?.categories?.nome?.toLowerCase() !== 'investimentos');

      const invesArr = [
        ...recsArrOriginal.filter(r => r.tags?.categories?.nome?.toLowerCase() === 'investimentos'),
        ...dspsArrOriginal.filter(d => d.tags?.categories?.nome?.toLowerCase() === 'investimentos')
      ];

      const sumRecsPago = recsArr.filter(r => r.status !== 'previsto').reduce((acc, obj) => acc + (obj.valor || 0), 0);
      const sumRecsPrev = recsArr.filter(r => r.status === 'previsto').reduce((acc, obj) => acc + (obj.valor || 0), 0);

      const sumDspsPago = dspsArr.filter(d => d.status !== 'previsto' && !d.card_id).reduce((acc, obj) => acc + (obj.valor || 0), 0);
      const sumDspsPrev = dspsArr.filter(d => d.status === 'previsto' && !d.card_id).reduce((acc, obj) => acc + (obj.valor || 0), 0);

      // Separar investimentos por pago
      const sumInvesPago = invesArr.filter(d => d.status !== 'previsto').reduce((acc, obj) => acc + (obj.valor || 0), 0);

      // Calcular economia (valor_previsto - valor) para despesas ja pagas
      const paidDespesasWithPrev = dspsArr.filter(d => d.status !== 'previsto' && d.valor_previsto !== undefined && d.valor_previsto !== null);
      const calcEconomia = paidDespesasWithPrev.reduce((acc, d) => acc + ((d.valor_previsto || d.valor) - d.valor), 0);

      // --- FETCH RECORRENTES PARA INCLUIR NA PROVISÃO ---
      const { data: recorrentesRaw, error: recError } = await supabase
        .from('transacoes_recorrentes')
        .select('*, categories (id, nome, cor), tags (id, nome)')
        .eq('profile_id', activeProfileId)
        .eq('ativa', true);

      if (recError) {
        console.error("Error fetching recorrentes for dashboard:", recError);
      }

      let sumDspsPrevRecorrente = 0;
      let sumRecsPrevRecorrente = 0;
      let pastRecorrentesDebt = 0;
      const combinedPending: any[] = [];
      const lancamentosRapidos: any[] = [];

      if (recorrentesRaw) {
          recorrentesRaw.forEach(rec => {
              if (rec.lancamento_rapido) {
                  lancamentosRapidos.push({
                      id: `rec-${rec.id}`,
                      recorrente_id: rec.id,
                      descricao: rec.nome,
                      valor: Number(rec.valor) || 0,
                      tags: rec.tags,
                      categories: rec.categories,
                      isRecurrent: true,
                      tipo: rec.tipo,
                      recurrentSource: rec
                  });
                  return;
              }
              const recCatName = rec.categories?.nome || '';

              const launchDateStr = rec.ultima_lancada;
              let startYear = new Date().getFullYear();
              let startMonth = new Date().getMonth();
              let shouldRender = true;

              if (!launchDateStr) {
                  shouldRender = false;
              } else {
                  const launchDate = new Date(launchDateStr);
                  startYear = launchDate.getFullYear();
                  startMonth = launchDate.getMonth();

                  if (rec.dia_vencimento) {
                      const launchDay = launchDate.getDate();
                      if (launchDay > Number(rec.dia_vencimento)) {
                          startMonth += 1;
                          if (startMonth > 11) {
                              startMonth = 0;
                              startYear += 1;
                          }
                      }
                  }
              }

              const activeYear = launchDateStr ? new Date(launchDateStr).getFullYear() : startYear;

              const targetYear = anoSelecionado;
              const monthIdx = mesSelecionado - 1;
              const monthDiff = (targetYear - startYear) * 12 + (monthIdx - startMonth);

              if (rec.num_parcelas && rec.num_parcelas > 1) {
                  if (monthDiff < 0 || monthDiff >= rec.num_parcelas) shouldRender = false;
              }
              if (rec.frequencia === 'anual') {
                  const tMonth = rec.mes_vencimento ? (rec.mes_vencimento - 1) : 0;
                  if (monthIdx !== tMonth) shouldRender = false;
              }

              const effStartYear = isNaN(startYear) ? new Date().getFullYear() : startYear;
              const effStartMonth = isNaN(startMonth) ? new Date().getMonth() : startMonth;
              
              for (let y = effStartYear; y <= targetYear; y++) {
                  const mStart = (y === effStartYear) ? effStartMonth : 0;
                  const mEnd = (y === targetYear) ? (monthIdx - 1) : 11;
                  for (let m = mStart; m <= mEnd; m++) {
                      let shouldExist = true;
                      const diffM = (y - effStartYear) * 12 + (m - effStartMonth);
                      if (rec.num_parcelas && rec.num_parcelas > 1) {
                          if (diffM < 0 || diffM >= rec.num_parcelas) shouldExist = false;
                      }
                      if (rec.frequencia === 'anual') {
                          const tMonth = rec.mes_vencimento ? (rec.mes_vencimento - 1) : 0;
                          if (m !== tMonth) shouldExist = false;
                      }
                      if (!shouldExist) continue;

                      const isMatchedInPast = antData?.find(t => {
                          if (!t.data) return false;
                          const tDate = new Date(t.data + 'T12:00:00Z');
                          if (tDate.getFullYear() !== y || tDate.getMonth() !== m) return false;
                          
                          if (t.recorrente_id === rec.id) return true;
                          if (t.recorrente_id) return false;
                          
                          const safeDesc = t.descricao || '';
                          const cleanRecName = rec.nome || '';
                          const nameMatch = safeDesc.toLowerCase().includes(cleanRecName.toLowerCase()) || 
                                            cleanRecName.toLowerCase().includes(safeDesc.toLowerCase());
                          if (nameMatch) {
                              let diffOk = true;
                              if (rec.valor !== null && rec.valor !== 0) {
                                  const diff = Math.abs((t.valor || 0) - Number(rec.valor));
                                  if (diff > 0.01) diffOk = false;
                              }
                              
                              if (diffOk) {
                                  if (rec.dia_vencimento) {
                                      try {
                                          if (tDate.getUTCDate() === Number(rec.dia_vencimento)) return true;
                                      } catch(e) {}
                                  } else {
                                      return true;
                                  }
                              }
                          }
                          return false;
                      });

                      if (!isMatchedInPast && activeProfileType !== 'empresa') {
                          if (rec.tipo === 'despesa') pastRecorrentesDebt -= (Number(rec.valor) || 0);
                          else if (rec.tipo === 'receita') pastRecorrentesDebt += (Number(rec.valor) || 0);
                      }
                  }
              }

              const projectedTimeId = targetYear * 12 + monthIdx;
              const creationTimeId = effStartYear * 12 + effStartMonth;

              if (projectedTimeId < creationTimeId) shouldRender = false;
              else if (targetYear !== activeYear) shouldRender = false;

              if (!shouldRender) return;

              if (rec.tipo === 'despesa') {
                  // Compare with existing dspsArr
                  const matched = dspsArr.find(t => {
                       if (t.recorrente_id === rec.id) return true;
                       if (t.recorrente_id) return false;
                       
                       const safeDesc = t.descricao || '';
                       const cleanRecName = rec.nome || '';
                       const nameMatch = safeDesc.toLowerCase().includes(cleanRecName.toLowerCase()) || 
                                         cleanRecName.toLowerCase().includes(safeDesc.toLowerCase());
                       if (nameMatch) {
                           let diffOk = true;
                           if (rec.valor !== null && rec.valor !== 0) {
                               const diff = Math.abs((t.valor || 0) - Number(rec.valor));
                               if (diff > 0.01) diffOk = false;
                           }
                           
                           if (diffOk) {
                               if (rec.dia_vencimento) {
                                   try {
                                       const tDay = new Date(t.data + 'T12:00:00Z').getUTCDate();
                                       if (tDay === Number(rec.dia_vencimento)) return true;
                                   } catch(e) {}
                               } else {
                                   return true;
                               }
                           }
                       }
                       return false;
                  });

                  if (!matched) {
                      if (recCatName.toLowerCase() !== 'investimentos') {
                          sumDspsPrevRecorrente += Number(rec.valor) || 0;
                      }
                      combinedPending.push({
                          id: `rec-${rec.id}`,
                          recorrente_id: rec.id,
                          descricao: rec.nome,
                          valor: Number(rec.valor) || 0,
                          data: `${anoSelecionado}-${mesStr}-${rec.dia_vencimento ? String(rec.dia_vencimento).padStart(2, '0') : '01'}`,
                          tags: rec.tags,
                          categories: rec.categories,
                          isRecurrent: true,
                          recurrentSource: rec
                      });
                  }
              } else if (rec.tipo === 'receita') {
                  // Compare with existing recsArr
                  const matched = recsArr.find(t => {
                       if (t.recorrente_id === rec.id) return true;
                       if (t.recorrente_id) return false;

                       const safeDesc = t.descricao || '';
                       const cleanRecName = rec.nome || '';
                       const nameMatch = safeDesc.toLowerCase().includes(cleanRecName.toLowerCase()) || 
                                         cleanRecName.toLowerCase().includes(safeDesc.toLowerCase());
                       if (nameMatch) {
                           let diffOk = true;
                           if (rec.valor !== null && rec.valor !== 0) {
                               const diff = Math.abs((t.valor || 0) - Number(rec.valor));
                               if (diff > 0.01) diffOk = false;
                           }
                           
                           if (diffOk) {
                               if (rec.dia_vencimento) {
                                   try {
                                       const tDay = new Date(t.data + 'T12:00:00Z').getUTCDate();
                                       if (tDay === Number(rec.dia_vencimento)) return true;
                                   } catch(e) {}
                               } else {
                                   return true;
                               }
                           }
                       }
                       return false;
                  });

                  if (!matched) {
                      sumRecsPrevRecorrente += Number(rec.valor) || 0;
                      combinedPending.push({
                          id: `rec-${rec.id}`,
                          recorrente_id: rec.id,
                          descricao: rec.nome,
                          valor: Number(rec.valor) || 0,
                          data: `${anoSelecionado}-${mesStr}-${rec.dia_vencimento ? String(rec.dia_vencimento).padStart(2, '0') : '01'}`,
                          tags: rec.tags,
                          categories: rec.categories,
                          isRecurrent: true,
                          recurrentSource: rec
                      });
                  }
              }
          });
      }

      setReceitasPago(sumRecsPago);
      setReceitasPrevisto(sumRecsPrev + sumRecsPrevRecorrente);
      setDespesasPago(sumDspsPago);
      setDespesasPrevisto(sumDspsPrev + sumDspsPrevRecorrente);
      setEconomiaDespesas(calcEconomia);

      // receitasValor e despesasValor representam o que de fato ocorreu para manter a integridade do saldo e graficos
      // receitasValor será atualizado no final
      setDespesasValor(sumDspsPago);
      setInvestimentosValor(sumInvesPago);

      // --- LOGICA DO CARTAO ---
      const { data: userCards } = await supabase
        .from('cards')
        .select('*')
        .eq('profile_id', activeProfileId);

      const { data: transacoesCardsRaw } = await supabase
        .from('transacoes')
        .select('*')
        .eq('profile_id', activeProfileId)
        .not('card_id', 'is', null);

      let faturaNoMesSoma = 0;

      if (userCards && transacoesCardsRaw) {
        transacoesCardsRaw.forEach(t => {
          const cardInfo = userCards.find(c => c.id === t.card_id);
          if (cardInfo) {
            const dateParts = t.data.split('-');
            if(dateParts.length >= 3) {
                const year = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10);
                const day = parseInt(dateParts[2], 10);

                let mesFechamento = month;
                let anoFechamento = year;
                if (day > cardInfo.dia_fechamento_fatura) {
                    mesFechamento++;
                    if (mesFechamento > 12) {
                        mesFechamento = 1;
                        anoFechamento++;
                    }
                }
                
                let mesVencimento = mesFechamento;
                let anoVencimento = anoFechamento;
                if (cardInfo.dia_vencimento_fatura < cardInfo.dia_fechamento_fatura) {
                    mesVencimento++;
                    if (mesVencimento > 12) {
                        mesVencimento = 1;
                        anoVencimento++;
                    }
                }

                // A fatura que vencera no mesSelecionado
                let targetMesVencimento = mesSelecionado;
                let targetAnoVencimento = anoSelecionado;

                const vl = t.status === 'previsto' && t.valor_previsto !== undefined && t.valor_previsto !== null ? t.valor_previsto : t.valor;

                if (mesVencimento === targetMesVencimento && anoVencimento === targetAnoVencimento) {
                    if (t.tipo === 'despesa') {
                        faturaNoMesSoma += (vl || 0);
                    } else if (t.tipo === 'receita') {
                        faturaNoMesSoma -= (vl || 0);
                    }
                } else if (activeProfileType !== 'empresa' && (anoVencimento < targetAnoVencimento || (anoVencimento === targetAnoVencimento && mesVencimento < targetMesVencimento))) {
                    if (t.tipo === 'despesa') {
                        saldoAntCalcAcumulado -= (vl || 0);
                    } else if (t.tipo === 'receita') {
                        saldoAntCalcAcumulado += (vl || 0);
                    }
                }
            }
          }
        });
      }

      setSaldoAnterior(saldoAntCalcAcumulado + pastRecorrentesDebt);
      setReceitasValor(sumRecsPago + saldoAntCalcAcumulado + pastRecorrentesDebt);
      setCartoesValor(faturaNoMesSoma > 0 ? faturaNoMesSoma : 0);

      if (dspsArr) {
        dspsArr.forEach(d => {
            if (d.status === 'previsto') combinedPending.push(d);
        });
      }
      
      if (recsArr) {
        recsArr.forEach(d => {
            if (d.status === 'previsto') combinedPending.push(d);
        });
      }
      
      if (invesArr) {
        invesArr.forEach(d => {
            // Only investments of type "despesa" that are predicted
            if (d.status === 'previsto' && d.tipo === 'despesa') combinedPending.push(d);
        });
      }
      combinedPending.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      setPendingProvisions(combinedPending);
      setLancamentosRapidos(lancamentosRapidos);

      setIsCardsLoading(false);
    };

    fetchCards();
  }, [activeProfileId, mesSelecionado, anoSelecionado, isTransactionModalOpen, refreshTrigger]);

  // Carregar dados do Gráfico Anual
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchGrafico = async () => {
      setIsChartLoading(true);
      const { data: transacoesAno } = await supabase
        .from('transacoes')
        .select(`
          *,
          tags ( categories!tags_category_id_fkey ( nome ) )
        `)
        .eq('profile_id', activeProfileId)
        .is('card_id', null)
        .gte('data', `${anoSelecionado}-01-01`)
        .lte('data', `${anoSelecionado}-12-31`);

      const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      const dados = Array.from({ length: 12 }, (_, i) => ({
        mes: meses[i],
        mesIndex: i + 1,
        receitas: 0,
        despesas: 0,
        investimentos: 0,
        saldoFinal: 0,
        mesCompleto: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][i]
      }));

      (transacoesAno || []).forEach(t => {
        // Ignorar previsões futuras do gráfico de fluxo financeiro realizado
        if (t.status === 'previsto') return;

        const dateParts = t.data.split('-');
        if (dateParts.length >= 2) {
          const mes = parseInt(dateParts[1], 10) - 1;
          if (mes >= 0 && mes < 12) {
            if (t.tipo === 'despesa' && t.tags?.categories?.nome?.toLowerCase() === 'investimentos') {
               dados[mes].investimentos += t.valor || 0;
            } else if (t.tipo === 'receita') {
              dados[mes].receitas += t.valor || 0;
            } else {
              dados[mes].despesas += t.valor || 0;
            }
          }
        }
      });

      dados.forEach(d => {
        d.saldoFinal = d.receitas - d.despesas - d.investimentos;
      });

      setDadosGrafico(dados);
      setIsChartLoading(false);
    };

    fetchGrafico();
  }, [activeProfileId, anoSelecionado, isTransactionModalOpen, refreshTrigger]);
  
  const targetMesVencimento = mesSelecionado;
  const targetAnoVencimento = anoSelecionado;
  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const saldoTotal = receitasValor - despesasValor - investimentosValor - despesasPrevisto + receitasPrevisto - cartoesValor;

  const formatarValor = (valor: number) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  const mesesCompletos = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const CustomDot = (props: any) => {
    const { cx, cy, payload, color } = props;
    if (payload.mesIndex === mesSelecionado) {
      let activeColor = color;
      if (color === '#16A34A') activeColor = '#15803D';
      if (color === '#EF4444') activeColor = '#DC2626';
      
      return (
        <circle cx={cx} cy={cy} r={6} fill={activeColor} stroke="#fff" strokeWidth={2} className="cursor-pointer focus:outline-none" style={{ outline: 'none' }} />
      );
    }
    return <circle cx={cx} cy={cy} r={4} fill={color} className="cursor-pointer focus:outline-none" style={{ outline: 'none' }} />;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1E293B] p-[12px] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#E2E8F0] dark:border-[#334155] min-w-[200px]">
          <p className="font-bold text-[#0F172A] dark:text-white mb-[8px]">{payload[0].payload.mesCompleto} {anoSelecionado}</p>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#16A34A] dark:text-green-400 font-semibold flex items-center justify-between gap-[16px]">
              Receitas: <span>{formatarValor(payload[0].payload.receitas)}</span>
            </p>
            <p className="text-[13px] text-[#EF4444] dark:text-red-400 font-semibold flex items-center justify-between gap-[16px]">
              Despesas: <span>{formatarValor(payload[0].payload.despesas)}</span>
            </p>
            <p className="text-[13px] text-[#CA8A04] dark:text-yellow-400 font-semibold flex items-center justify-between gap-[16px]">
              Investimentos: <span>{formatarValor(payload[0].payload.investimentos)}</span>
            </p>
            <p className="text-[13px] text-[#3B82F6] dark:text-blue-400 font-semibold flex items-center justify-between gap-[16px]">
              Saldo Final: <span>{formatarValor(payload[0].payload.saldoFinal)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-[24px] max-w-[1200px] mx-auto flex flex-col gap-[24px] bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen">
      {/* 1. CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row items-center md:justify-center gap-[12px] md:relative mb-[24px]">
        
        {/* Nova Transação - mobile: order 1, desktop: absolute right */}
        <div className="order-1 md:order-none md:absolute md:right-0 w-full md:w-auto">
          <button 
            onClick={() => setIsTransactionModalOpen(true)}
            className="w-full md:w-auto flex justify-center items-center gap-[6px] rounded-[100px] px-[22px] py-[10px] text-white font-[700] text-[14px] shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-[1px] transition-transform cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
          >
            <Plus size={15} />
            Nova Transação
          </button>
        </div>

        {/* LADO CENTRO - Filtros de período - mobile: order 2, desktop: center */}
        <div className="order-2 md:order-none flex flex-col md:flex-row gap-[12px] w-full md:w-auto">
          {/* Ano - mobile: order 1, desktop: order 2 */}
          <div className="order-1 md:order-2 flex justify-between md:justify-center items-center gap-[10px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[16px] py-[8px]">
            <button onClick={() => setAnoSelecionado(prev => prev - 1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            <span className="text-[14px] font-[600] text-[#0F172A] dark:text-white min-w-[60px] text-center">
              {anoSelecionado}
            </span>
            <button onClick={() => setAnoSelecionado(prev => prev + 1)} className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors cursor-pointer">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Dropdown de Mês - mobile: order 2, desktop: order 1 */}
          <div className="relative order-2 md:order-1 w-full md:w-auto" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownMesAberto(!dropdownMesAberto)}
              className="w-full md:w-auto flex justify-between md:justify-center items-center gap-[8px] bg-white dark:bg-[#1E293B] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[100px] px-[20px] py-[8px] text-[14px] font-[600] text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors cursor-pointer"
            >
              {mesesCompletos[mesSelecionado - 1]}
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
                    className="absolute left-0 mt-2 min-w-[200px] w-full md:w-auto bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2 z-30"
                  >
                    <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Selecionar Mês</p>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1">
                      {mesesCompletos.map((nome, i) => {
                        const isActive = mesSelecionado === i + 1;
                        return (
                          <button 
                            key={nome}
                            onClick={() => selecionarMes(i)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                              isActive 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold' 
                                : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50'
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
        </div>
      </div>

      {/* 2. CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
        {/* CARD 1 — RECEITAS */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="p-[6px] bg-[#F0FDF4] dark:bg-green-900/20 rounded-full text-[#16A34A] dark:text-green-500 w-[32px] h-[32px] flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              Receitas
            </span>
          </div>
          <div className="flex flex-col">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#16A34A] dark:text-green-500 leading-tight flex-wrap break-all">{formatarValor(receitasValor)}</span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#16A34A] dark:bg-green-500" />
        </div>

        {/* CARD 2 — INVESTIMENTOS */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="p-[6px] bg-[#ECFDF5] dark:bg-emerald-900/20 rounded-full text-[#10B981] dark:text-emerald-500 w-[32px] h-[32px] flex items-center justify-center">
              <PieChart size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              Investimentos
            </span>
          </div>
          <div className="flex flex-col">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#10B981] dark:text-emerald-500 leading-tight flex-wrap break-all">{formatarValor(investimentosValor)}</span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#10B981] dark:bg-emerald-500" />
        </div>

        {/* CARD 3 — PROVISÃO */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="p-[6px] bg-amber-50 dark:bg-amber-900/20 rounded-full text-amber-500 dark:text-amber-400 w-[32px] h-[32px] flex items-center justify-center">
              <Clock size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              Provisão
            </span>
          </div>
          <div className="flex flex-col">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[20px] 2xl:text-[24px] font-[800] text-amber-500 dark:text-amber-400 leading-tight flex-wrap break-all">{formatarValor(despesasPrevisto)}</span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-amber-500 dark:bg-amber-400" />
        </div>

        {/* CARD 4 — CARTÃO */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="p-[6px] bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-500 dark:text-purple-400 w-[32px] h-[32px] flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              {`Fatura de ${nomesMeses[targetMesVencimento - 1]} de ${targetAnoVencimento}`}
            </span>
          </div>
          <div className="flex flex-col">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[20px] 2xl:text-[24px] font-[800] text-purple-500 dark:text-purple-400 leading-tight flex-wrap break-all">{formatarValor(cartoesValor)}</span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-purple-500 dark:bg-purple-400" />
        </div>

        {/* CARD 5 — DESPESAS */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="p-[6px] bg-[#FEF2F2] dark:bg-red-900/20 rounded-full text-[#EF4444] dark:text-red-500 w-[32px] h-[32px] flex items-center justify-center">
              <TrendingDown size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider">
              Despesas
            </span>
          </div>
          <div className="flex flex-col">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className="text-[20px] 2xl:text-[24px] font-[800] text-[#EF4444] dark:text-red-500 leading-tight flex-wrap break-all">{formatarValor(despesasValor)}</span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#EF4444] dark:bg-red-500" />
        </div>

        {/* CARD 6 — SALDO TOTAL */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="p-[6px] bg-[#EFF6FF] dark:bg-blue-900/20 rounded-full text-[#2563EB] dark:text-blue-500 w-[32px] h-[32px] flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <span className="uppercase text-[11px] text-[#94A3B8] dark:text-[#64748B] font-bold tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
              Saldo Final
            </span>
          </div>
          <div className="flex flex-col">
            {isCardsLoading ? (
               <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <span className={`text-[20px] 2xl:text-[24px] font-[800] leading-tight flex-wrap break-all ${saldoTotal === 0 ? 'text-slate-800 dark:text-white' : (saldoTotal < 0 ? 'text-[#EF4444] dark:text-red-500' : 'text-[#2563EB] dark:text-blue-500')}`}>
                {formatarValor(saldoTotal)}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#2563EB] dark:bg-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <CardFaturaDashboard activeProfileId={activeProfileId} />
        <CardProximasContas activeProfileId={activeProfileId} ano={anoSelecionado} mes={mesSelecionado} contas={pendingProvisions} isLoading={isCardsLoading} onUpdate={() => setRefreshTrigger(prev => prev + 1)} />
        <CardLancamentosRapidos activeProfileId={activeProfileId} contas={lancamentosRapidos} isLoading={isCardsLoading} onUpdate={() => setRefreshTrigger(prev => prev + 1)} />
      </div>

      {/* 3. GRÁFICO ANUAL */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-[24px] border-[1.5px] border-[#F1F5F9] dark:border-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-[24px]">
          <div>
            <h3 className="text-[16px] font-[700] text-[#0F172A] dark:text-white">Resumo Financeiro</h3>
            <p className="text-[12px] text-[#94A3B8] dark:text-[#64748B] dark:text-[#94A3B8]">{anoSelecionado}</p>
          </div>

          <div className="flex items-center gap-[16px] flex-wrap">
            <div className="flex gap-[16px] flex-wrap">
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#16A34A] dark:bg-green-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Receitas</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#EF4444] dark:bg-red-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Despesas</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#CA8A04] dark:bg-yellow-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Investimentos</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#3B82F6] dark:bg-blue-500"></div>
                <span className="text-[12px] font-[600] text-[#64748B] dark:text-[#94A3B8]">— Saldo Final</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .dashboard-chart-container .recharts-wrapper, 
          .dashboard-chart-container .recharts-wrapper *, 
          .dashboard-chart-container .recharts-surface, 
          .dashboard-chart-container .recharts-surface:focus,
          .dashboard-chart-container svg { 
            outline: none !important; 
          }
        `}</style>
        <div className="w-full dashboard-chart-container relative" style={{ height: 280, minHeight: 280 }}>
          {isChartLoading ? (
            <div className="absolute inset-0 flex items-end justify-between gap-2 px-1 pb-[30px] pt-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex-1 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-t-md" style={{ height: `${Math.max(15, Math.random() * 85 + 15)}%`, opacity: 0.7 }}></div>
              ))}
              {/* x-axis fake labels */}
              <div className="absolute bottom-0 left-0 right-0 h-6 flex justify-between px-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-6 h-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280} minWidth={1} minHeight={1}>
              <AreaChart 
                data={dadosGrafico} 
                onClick={(e) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    const clickMes = Number(e.activeTooltipIndex) + 1;
                    setMesSelecionado(clickMes);
                  }
                }} 
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0FDF4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F0FDF4" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FEF2F2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FEF2F2" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorInvestimentos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FEF9C3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FEF9C3" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorSaldoFinal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DBEAFE" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#DBEAFE" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="mes" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94A3B8' }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94A3B8' }} 
                tickFormatter={(val) => `R$ ${val.toLocaleString('pt-BR')}`} 
              />
              <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip />} />
              
              <Area 
                type="monotone" 
                dataKey="receitas" 
                stroke="#16A34A" 
                strokeWidth={2.5} 
                fillOpacity={0.3} 
                fill="url(#colorReceitas)" 
                activeDot={{ r: 6 }}
                dot={(props) => <CustomDot {...props} color="#16A34A" />}
              />
              <Area 
                type="monotone" 
                dataKey="despesas" 
                stroke="#EF4444" 
                strokeWidth={2.5} 
                fillOpacity={0.3} 
                fill="url(#colorDespesas)" 
                activeDot={{ r: 6 }}
                dot={(props) => <CustomDot {...props} color="#EF4444" />}
              />
              <Area 
                type="monotone" 
                dataKey="investimentos" 
                stroke="#CA8A04" 
                strokeWidth={2.5} 
                fillOpacity={0.3} 
                fill="url(#colorInvestimentos)" 
                activeDot={{ r: 6 }}
                dot={(props) => <CustomDot {...props} color="#CA8A04" />}
              />
              <Area 
                type="monotone" 
                dataKey="saldoFinal" 
                stroke="#3B82F6" 
                strokeWidth={2.5} 
                fillOpacity={0.3} 
                fill="url(#colorSaldoFinal)" 
                activeDot={{ r: 6 }}
                dot={(props) => <CustomDot {...props} color="#3B82F6" />}
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {activeProfileId && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          perfilId={activeProfileId}
        />
      )}
    </div>
  );
};


