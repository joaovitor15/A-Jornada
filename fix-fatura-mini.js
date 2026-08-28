import fs from 'fs';
let code = fs.readFileSync('src/components/CardFaturaMini.tsx', 'utf-8');

const oldLogic = `let totalPendente = 0;
  let valorFaturaAtualView = 0;
  let unpaidPassado = 0;
  
  if (cards.length > 0) {
    const card = cards[0];
    const transacoesAtivas = transacoesCard.filter(t => t.status !== 'ignorado');

    const globalDespesas = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa').reduce((acc, t) => acc + Number(t.valor), 0);
    const fimDoMesSelecionado = new Date(anoSelecionado, mesSelecionado, 0).toISOString().split('T')[0];
  const globalCreditos = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'receita' && t.data <= fimDoMesSelecionado).reduce((acc, t) => acc + Number(t.valor), 0);

    const periodoCardAtual = helperCalcularPeriodoParaMes(card.dia_fechamento_fatura, card.dia_vencimento_fatura, anoSelecionado, mesSelecionado);

    const despesasPassado = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa' && t.data < periodoCardAtual.inicioStr).reduce((acc, t) => acc + Number(t.valor), 0);
    const despesasAberto = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa' && t.data >= periodoCardAtual.inicioStr && t.data <= periodoCardAtual.fimStr).reduce((acc, t) => acc + Number(t.valor), 0);

    let creditosRestantes = globalCreditos;

    unpaidPassado = Math.max(0, despesasPassado - creditosRestantes);
    creditosRestantes = Math.max(0, creditosRestantes - despesasPassado);

    const unpaidAberto = Math.max(0, despesasAberto - creditosRestantes);
    creditosRestantes = Math.max(0, creditosRestantes - despesasAberto);

    const excedenteCredito = creditosRestantes;

    valorFaturaAtualView = excedenteCredito > 0 ? -excedenteCredito : unpaidAberto;
    totalPendente = unpaidPassado + valorFaturaAtualView;
  }`;

const newLogic = `let valorFaturaAtualView = 0;
  let despesasAberto = 0;
  let receitasAberto = 0;
  
  if (cards.length > 0) {
    const card = cards[0];
    const transacoesAtivas = transacoesCard.filter(t => t.status !== 'ignorado');
    const periodoCardAtual = helperCalcularPeriodoParaMes(card.dia_fechamento_fatura, card.dia_vencimento_fatura, anoSelecionado, mesSelecionado);

    despesasAberto = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'despesa' && t.data >= periodoCardAtual.inicioStr && t.data <= periodoCardAtual.fimStr).reduce((acc, t) => acc + Number(t.valor), 0);
    receitasAberto = transacoesAtivas.filter(t => t.card_id === card.id && t.tipo === 'receita' && t.data >= periodoCardAtual.inicioStr && t.data <= periodoCardAtual.fimStr).reduce((acc, t) => acc + Number(t.valor), 0);

    // O valor da fatura daquele mês específico é o que foi gasto menos o que foi pago dentro daquele mesmo ciclo
    valorFaturaAtualView = Math.max(0, despesasAberto - receitasAberto);
  }`;

code = code.replace(oldLogic, newLogic);

// Replace the return formatting
code = code.replace(
  '{formatarValor(Math.max(0, unpaidPassado + valorFaturaAtualView))}',
  '{formatarValor(valorFaturaAtualView)}'
);

fs.writeFileSync('src/components/CardFaturaMini.tsx', code);
