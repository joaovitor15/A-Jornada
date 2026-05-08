export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'champion';

export interface UpgradeCost {
  cards: number;
  gold: number;
}

export const MAX_LEVEL = 16;

export const baseLevelByRarity: Record<Rarity, number> = {
  common: 1,
  rare: 3,
  epic: 6,
  legendary: 9,
  champion: 11,
};

/**
 * Custo para melhorar UMA carta PARA o nível da chave.
 * Exemplo: upgradeCosts.common[2] retorna { cards: 2, gold: 5 }, 
 * que é o custo para elevar uma carta Comum do nível 1 para o nível 2.
 */
export const upgradeCosts: Record<Rarity, Record<number, UpgradeCost>> = {
  common: {
    2: { cards: 2, gold: 5 },
    3: { cards: 4, gold: 20 },
    4: { cards: 10, gold: 50 },
    5: { cards: 20, gold: 150 },
    6: { cards: 50, gold: 400 },
    7: { cards: 100, gold: 1000 },
    8: { cards: 200, gold: 2000 },
    9: { cards: 400, gold: 4000 },
    10: { cards: 800, gold: 8000 },
    11: { cards: 1000, gold: 15000 },
    12: { cards: 1500, gold: 25000 },
    13: { cards: 2500, gold: 40000 },
    14: { cards: 3500, gold: 60000 },
    15: { cards: 5500, gold: 90000 },
    16: { cards: 7500, gold: 120000 },
  },
  rare: {
    4: { cards: 2, gold: 50 },
    5: { cards: 4, gold: 150 },
    6: { cards: 10, gold: 400 },
    7: { cards: 20, gold: 1000 },
    8: { cards: 50, gold: 2000 },
    9: { cards: 100, gold: 4000 },
    10: { cards: 200, gold: 8000 },
    11: { cards: 300, gold: 15000 },
    12: { cards: 400, gold: 25000 },
    13: { cards: 550, gold: 40000 },
    14: { cards: 750, gold: 60000 },
    15: { cards: 1000, gold: 90000 },
    16: { cards: 1400, gold: 120000 },
  },
  epic: {
    7: { cards: 2, gold: 1000 },
    8: { cards: 4, gold: 2000 },
    9: { cards: 10, gold: 4000 },
    10: { cards: 20, gold: 8000 },
    11: { cards: 30, gold: 15000 },
    12: { cards: 50, gold: 25000 },
    13: { cards: 70, gold: 40000 },
    14: { cards: 100, gold: 60000 },
    15: { cards: 130, gold: 90000 },
    16: { cards: 180, gold: 120000 },
  },
  legendary: {
    10: { cards: 2, gold: 5000 },
    11: { cards: 4, gold: 15000 },
    12: { cards: 6, gold: 25000 },
    13: { cards: 9, gold: 40000 },
    14: { cards: 12, gold: 60000 },
    15: { cards: 14, gold: 90000 },
    16: { cards: 20, gold: 120000 },
  },
  champion: {
    12: { cards: 2, gold: 25000 },
    13: { cards: 5, gold: 40000 },
    14: { cards: 8, gold: 60000 },
    15: { cards: 11, gold: 90000 },
    16: { cards: 15, gold: 120000 },
  },
};
