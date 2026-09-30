export interface PeriodoFatura {
  inicio: Date;
  fim: Date;
  vencimento: Date;
  inicioStr: string;
  fimStr: string;
  vencimentoStr: string;
  label: string;
}

export interface FaturaCalculada {
  cardId: string;
  periodo: PeriodoFatura;
  despesasCiclo: any[];
  despesasTotal: number;
  saldoAnteriorNaoPago: number;
  totalFatura: number;
  pago: number;
  valorPendente: number;
  status: 'ABERTA' | 'FECHADA' | 'VENCIDA' | 'PAGA' | 'FUTURA';
  globalDespesas: number;
  globalCreditos: number;
  globalLimitUsed: number;
  creditoDisponivel: number;
  limiteUsado: number;
  limiteDisponivel: number;
  limiteEfetivo: number;
}

const toLocalISO = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calcula o período exato (início, fim do ciclo e vencimento) da fatura de um cartão
 * para um determinado ano e mês de referência da fatura (mês de fechamento).
 *
 * Ex: Cartão com fechamento dia 25 e vencimento dia 5:
 * Para Outubro (mesRef = 10):
 * - Fechamento (fim): 25/10/2026
 * - Início: 26/09/2026 (dia após o fechamento de setembro)
 * - Vencimento: 05/11/2026 (pois dia vencimento < dia fechamento)
 * - Compras no ciclo: 26 de set. a 25 de out. (Fatura de Outubro)
 */
export const helperCalcularPeriodoParaMes = (
  diaFechamento: number,
  diaVencimento: number,
  anoRef: number,
  mesRef: number
): PeriodoFatura => {
  const mesFimIndex = mesRef - 1; // 0-indexed (ex: 9 para Outubro)
  const lastDayOfClosingMonth = new Date(anoRef, mesRef, 0).getDate();
  const clampedFechamento = Math.min(diaFechamento || 1, lastDayOfClosingMonth);
  const dataFim = new Date(anoRef, mesFimIndex, clampedFechamento);

  // Fechamento da fatura anterior
  let prevAno = anoRef;
  let prevMesIndex = mesFimIndex - 1;
  if (prevMesIndex < 0) {
    prevMesIndex = 11;
    prevAno -= 1;
  }
  const lastDayOfPrevClosingMonth = new Date(prevAno, prevMesIndex + 1, 0).getDate();
  const clampedPrevFechamento = Math.min(diaFechamento || 1, lastDayOfPrevClosingMonth);
  const dataPrevFim = new Date(prevAno, prevMesIndex, clampedPrevFechamento);

  // Início é o dia imediatamente posterior ao fechamento anterior
  const dataInicio = new Date(dataPrevFim.getFullYear(), dataPrevFim.getMonth(), dataPrevFim.getDate() + 1);

  // Vencimento:
  // Se diaVencimento < diaFechamento, a fatura vence no mês seguinte ao fechamento
  // Se diaVencimento >= diaFechamento, a fatura vence no mesmo mês do fechamento
  let dueAno = anoRef;
  let dueMesIndex = mesFimIndex;
  if ((diaVencimento || 10) < (diaFechamento || 1)) {
    dueMesIndex += 1;
    if (dueMesIndex > 11) {
      dueMesIndex = 0;
      dueAno += 1;
    }
  }
  const lastDayOfDueMonth = new Date(dueAno, dueMesIndex + 1, 0).getDate();
  const clampedVencimento = Math.min(diaVencimento || 10, lastDayOfDueMonth);
  const dataVencimento = new Date(dueAno, dueMesIndex, clampedVencimento);

  const label = `${dataInicio.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${dataFim.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`;

  return {
    inicio: dataInicio,
    fim: dataFim,
    vencimento: dataVencimento,
    inicioStr: toLocalISO(dataInicio),
    fimStr: toLocalISO(dataFim),
    vencimentoStr: toLocalISO(dataVencimento),
    label
  };
};

/**
 * Calcula o período relativo ao mês atual com um offset de meses.
 */
export const helperCalcularPeriodo = (
  diaFechamento: number,
  diaVencimento: number,
  offsetMes: number = 0
): PeriodoFatura => {
  const hoje = new Date();
  const targetDate = new Date(hoje.getFullYear(), hoje.getMonth() + offsetMes, 1);
  return helperCalcularPeriodoParaMes(
    diaFechamento,
    diaVencimento,
    targetDate.getFullYear(),
    targetDate.getMonth() + 1
  );
};

export const calcularPeriodoFatura = (diaFechamento: number, diaVencimento: number) => {
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

/**
 * Calcula o estado completo de uma fatura para um cartão em um mês/ano específico.
 * Usa simulação cronológica FIFO para alocar pagamentos e identificar débitos anteriores.
 */
export const calcularFaturaCard = (
  card: { id: string; limite: number; dia_fechamento_fatura: number; dia_vencimento_fatura: number; nome?: string },
  todasTransacoes: any[],
  anoRef: number,
  mesRef: number
): FaturaCalculada => {
  const periodo = helperCalcularPeriodoParaMes(
    card.dia_fechamento_fatura,
    card.dia_vencimento_fatura,
    anoRef,
    mesRef
  );

  const transacoesCard = (todasTransacoes || []).filter(
    (t) => t.card_id === card.id && t.status !== 'ignorado'
  );

  const despesasCiclo = transacoesCard
    .filter((t) => t.tipo === 'despesa' && t.data >= periodo.inicioStr && t.data <= periodo.fimStr)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Dados globais de limite
  const globalDespesas = transacoesCard
    .filter((t) => t.tipo === 'despesa')
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const globalCreditos = transacoesCard
    .filter((t) => t.tipo === 'receita')
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const globalLimitUsed = globalDespesas - globalCreditos;
  const creditoDisponivel = globalLimitUsed < 0 ? Math.abs(globalLimitUsed) : 0;
  const limiteUsado = Math.max(0, globalLimitUsed);
  const limiteDisponivel = Math.max(0, (card.limite || 0) - limiteUsado);
  const limiteEfetivo = (card.limite || 0) + creditoDisponivel;

  // Encontrar data da primeira transação para iniciar a simulação cronológica
  let minTime = anoRef * 12 + mesRef - 24; // Pelo menos 2 anos atrás
  transacoesCard.forEach((t) => {
    if (t.data) {
      const parts = t.data.split('-');
      if (parts.length >= 2) {
        const tTime = parseInt(parts[0], 10) * 12 + parseInt(parts[1], 10);
        if (tTime < minTime) minTime = tTime;
      }
    }
  });

  const targetId = anoRef * 12 + mesRef;
  let remainingPayments = globalCreditos;
  let pastUnpaid = 0;
  let targetDespesas = 0;
  let targetPaid = 0;
  let targetUnpaid = 0;

  for (let mId = minTime; mId <= targetId; mId++) {
    const curAno = Math.floor((mId - 1) / 12);
    const curMes = ((mId - 1) % 12) + 1;
    const curP = helperCalcularPeriodoParaMes(
      card.dia_fechamento_fatura,
      card.dia_vencimento_fatura,
      curAno,
      curMes
    );

    const d = transacoesCard
      .filter((t) => t.tipo === 'despesa' && t.data >= curP.inicioStr && t.data <= curP.fimStr)
      .reduce((acc, t) => acc + Number(t.valor || 0), 0);

    const needed = d + pastUnpaid;
    if (mId < targetId) {
      if (remainingPayments >= needed) {
        remainingPayments -= needed;
        pastUnpaid = 0;
      } else {
        pastUnpaid = needed - remainingPayments;
        remainingPayments = 0;
      }
    } else {
      targetDespesas = d;
      const totalNeeded = d + pastUnpaid;
      targetPaid = Math.min(totalNeeded, remainingPayments);
      targetUnpaid = Math.max(0, totalNeeded - remainingPayments);
    }
  }

  const hoje = new Date();
  let status: 'ABERTA' | 'FECHADA' | 'VENCIDA' | 'PAGA' | 'FUTURA' = 'ABERTA';

  if (targetUnpaid <= 0.001 && (targetDespesas > 0 || pastUnpaid > 0)) {
    status = 'PAGA';
  } else if (targetDespesas <= 0.001 && pastUnpaid <= 0.001) {
    if (hoje < periodo.inicio) {
      status = 'FUTURA';
    } else if (hoje > periodo.vencimento) {
      status = 'PAGA';
    } else if (hoje > periodo.fim) {
      status = 'FECHADA';
    } else {
      status = 'ABERTA';
    }
  } else if (hoje > periodo.vencimento) {
    status = 'VENCIDA';
  } else if (hoje > periodo.fim) {
    status = 'FECHADA';
  } else if (hoje < periodo.inicio) {
    status = 'FUTURA';
  } else {
    status = 'ABERTA';
  }

  return {
    cardId: card.id,
    periodo,
    despesasCiclo,
    despesasTotal: targetDespesas,
    saldoAnteriorNaoPago: pastUnpaid,
    totalFatura: targetDespesas + pastUnpaid,
    pago: targetPaid,
    valorPendente: targetUnpaid,
    status,
    globalDespesas,
    globalCreditos,
    globalLimitUsed,
    creditoDisponivel,
    limiteUsado,
    limiteDisponivel,
    limiteEfetivo
  };
};
