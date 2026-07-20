export const helperCalcularPeriodo = (diaFechamento: number, diaVencimento: number, offsetMes: number = 0) => {
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
