export interface FragmentConversion {
  minOvr: number;
  maxOvr: number;
  fragments: number;
}

export interface SpecialConversion {
  source: string; // ex: "Passe Premium"
  ovr: number;
  fragments: number;
}

export const fragmentConversions: FragmentConversion[] = [
  { minOvr: 110, maxOvr: 114, fragments: 150 },
  { minOvr: 115, maxOvr: 115, fragments: 300 },
  { minOvr: 116, maxOvr: 116, fragments: 600 },
  { minOvr: 117, maxOvr: 117, fragments: 1500 },
  { minOvr: 118, maxOvr: 118, fragments: 3500 },
  { minOvr: 119, maxOvr: 119, fragments: 5000 },
  { minOvr: 120, maxOvr: 120, fragments: 10000 },
];

// Lista de exceções baseada na origem do jogador (ex: Passe Premium, Eventos Especiais)
export const specialConversions: SpecialConversion[] = [
  { source: "Passe Premium", ovr: 117, fragments: 3500 },
];

/**
 * Retorna a quantidade de fragmentos estelares com base no GER (Overall) do jogador e sua origem.
 * @param ovr O GER (Overall) base do atleta
 * @param source (Opcional) A origem do jogador (ex: "Passe Premium") para checar regras especiais
 * @returns A quantidade de fragmentos correspondente, ou 0 se não houver conversão.
 */
export function getFragmentsForOvr(ovr: number, source?: string): number {
  // Verifica se a origem do jogador possui uma regra de conversão especial
  if (source) {
    const special = specialConversions.find(
      s => s.source.toLowerCase() === source.toLowerCase() && s.ovr === ovr
    );
    if (special) {
      return special.fragments;
    }
  }

  // Se não for exceção, segue a tabela de conversão normal
  const conversion = fragmentConversions.find(c => ovr >= c.minOvr && ovr <= c.maxOvr);
  return conversion ? conversion.fragments : 0;
}
