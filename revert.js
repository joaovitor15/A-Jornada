import fs from 'fs';
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Restore pastRecorrentesDebt
code = code.replace(
    'let sumInvesPrevRecorrente = 0;\n      const combinedPending: any[] = [];',
    'let sumInvesPrevRecorrente = 0;\n      let pastRecorrentesDebt = 0;\n      const combinedPending: any[] = [];'
);

// Restore pastRecorrentesDebt logic
code = code.replace(
    `                              const recCatName = rec.categories?.nome?.toLowerCase() || '';\n                          }\n                      }\n                  }\n              }`,
    `                              const recCatName = rec.categories?.nome?.toLowerCase() || '';\n                              if (recCatName !== 'investimentos') {\n                                  if (rec.tipo === 'despesa') pastRecorrentesDebt -= historicValue;\n                              }\n                          }\n                      }\n                  }\n              }`
);

// Restore cartoesBeneficio
code = code.replace(
    `let unpaidTarget = 0;\n\n      if (userCards && transacoesCardsRaw) {`,
    `let unpaidTarget = 0;\n      let cartoesBeneficio = 0;\n\n      if (userCards && transacoesCardsRaw) {`
);

code = code.replace(
    `if (anoVencimento < targetAnoVencimento || (anoVencimento === targetAnoVencimento && mesVencimento <= targetMesVencimento)) {\n                        debtObj.receitas += (vl || 0);\n                    }\n                }\n\n                if (mesVencimento === targetMesVencimento && anoVencimento === targetAnoVencimento) {`,
    `if (anoVencimento < targetAnoVencimento || (anoVencimento === targetAnoVencimento && mesVencimento <= targetMesVencimento)) {\n                        debtObj.receitas += (vl || 0);\n                    }\n                    if (anoVencimento === targetAnoVencimento && mesVencimento === targetMesVencimento) {\n                        debtObj.currReceitas = (debtObj.currReceitas || 0) + (vl || 0);\n                    }\n                }\n\n                if (mesVencimento === targetMesVencimento && anoVencimento === targetAnoVencimento) {`
);

code = code.replace(
    `cardDebts[c.id] = { pastDespesas: 0, targetDespesas: 0, receitas: 0, targetTotalGasto: 0 };`,
    `cardDebts[c.id] = { pastDespesas: 0, targetDespesas: 0, receitas: 0, currReceitas: 0, targetTotalGasto: 0 };`
);

code = code.replace(
    `            unpaidTarget += unpaidCurr;\n            faturaTotalGasto += debt.targetTotalGasto;\n        });\n      }\n\n      setSaldoAnterior(saldoAntCalcAcumulado);\n      setReceitasValor(sumRecsPago + saldoAntCalcAcumulado);`,
    `            unpaidTarget += unpaidCurr;\n            faturaTotalGasto += debt.targetTotalGasto;\n            const currPayments = debt.currReceitas || 0;\n            const extraBenefit = unpaidCurr + currPayments - debt.targetDespesas;\n            cartoesBeneficio += extraBenefit;\n        });\n      }\n\n      setSaldoAnterior(saldoAntCalcAcumulado + pastRecorrentesDebt + cartoesBeneficio);\n      setReceitasValor(sumRecsPago + saldoAntCalcAcumulado + pastRecorrentesDebt + cartoesBeneficio);`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
