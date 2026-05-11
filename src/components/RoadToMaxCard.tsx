import React from "react";
import { motion } from "motion/react";
import { Coins } from "lucide-react";
import {
  upgradeCosts,
  MAX_LEVEL,
  Rarity,
  baseLevelByRarity,
} from "../constants/upgradeData";

interface RoadToMaxCardProps {
  card: any;
}

export const RoadToMaxCard: React.FC<RoadToMaxCardProps> = ({ card }) => {
  const currentLevel = card.playerLevel || 1;
  const copies = card.count || 0;
  const maxLevel = card.maxLevel || MAX_LEVEL;
  const isMaxed = currentLevel >= MAX_LEVEL;
  const rarity = (card.rarity || "common").toLowerCase() as Rarity;

  if (isMaxed) {
    return null; // Oculta a carta inteira se já estiver no nível máximo
  }

  // Níveis do próximo ao maximo
  const displayLevels: number[] = [];
  for (let l = currentLevel + 1; l <= MAX_LEVEL; l++) {
    displayLevels.push(l);
  }

  // Retorna custo para esse nível no formato {cards, gold}
  const getLevelCost = (lvl: number) => {
    if (upgradeCosts[rarity] && upgradeCosts[rarity][lvl]) {
      return upgradeCosts[rarity][lvl];
    }
    return { cards: 0, gold: 0 };
  };

  // Verifica progresso cumulativo a partir do level atual para cada target level
  // Exemplo: Estou no lv 12, tenho 2500 cartas.
  // Para lv 13 preciso de 2500 cartas. Então para o box do lv 13 será progresso 2500/2500 (cheio) e sobram 0 cartas.

  let leftCopies = copies;

  // Vamos calcular quanto de ouro falta para o 16
  let totalGoldToMax = 0;
  let totalCardsToMax = 0;

  for (let l = currentLevel + 1; l <= MAX_LEVEL; l++) {
    const cost = getLevelCost(l);
    totalGoldToMax += cost.gold;
    totalCardsToMax += cost.cards;
  }

  const cardsNeededToMax = Math.max(0, totalCardsToMax - copies);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-slate-200 dark:border-[#334155] overflow-hidden flex flex-col sm:flex-row mb-4"
    >
      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0F172A]/50 w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-[#334155] shrink-0">
        <div className="w-20 object-contain relative transition-transform hover:scale-105">
          <img
            src={card.iconUrls?.medium}
            alt={card.name}
            className={`w-full ${!card.hasCardOnAccount ? "grayscale opacity-50" : "drop-shadow-lg"}`}
          />
          {card.playerLevel && (
            <div className="absolute -bottom-2 right-0 w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-700 shadow-sm z-10">
              {card.playerLevel}
            </div>
          )}
        </div>
        <div className="mt-3 text-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
            {card.name}
          </h3>
          {totalGoldToMax > 0 && (
            <div className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              Custo até o 16:{" "}
              <span className="text-amber-500 font-black">
                {totalGoldToMax.toLocaleString("pt-BR")}
              </span>
              <Coins className="w-3.5 h-3.5 text-amber-500" />
            </div>
          )}
          {cardsNeededToMax > 0 && (
            <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Cartas para Max:{" "}
              <span className="text-blue-500 font-black">
                {cardsNeededToMax.toLocaleString("pt-BR")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Box de levels */}
      <div className="flex-1 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-center content-center justify-items-center">
        {displayLevels.map((lvl) => {
          const cost = getLevelCost(lvl);

          // Box pode estar em 3 estados: MAXED (já passou), ACTIVE (está precisando dessas cartas agora), LOCK (precisa chegar lá)
          let state = "LOCKED";
          let pct = 0;
          let displayNow = 0;
          const displayTotal = cost.cards;

          if (currentLevel >= lvl) {
            state = "MAXED";
            pct = 100;
          } else {
            // Precisa preencher os níveis passados com as cópias atuais
            // Quantos leveis faltam antes desse pra serem preenchidos pelas rightCopies?
            // Na verdade, precisamos subtrair da rightCopies as cartas necessárias pra upar os lvs anteriores
            let copiesForThisLevel = leftCopies;
            let prevCardsReq = 0;
            for (let k = currentLevel + 1; k < lvl; k++) {
              prevCardsReq += getLevelCost(k).cards;
            }

            const copiesAvailableForThisLevel = leftCopies - prevCardsReq;

            if (copiesAvailableForThisLevel <= 0) {
              state = "LOCKED";
              pct = 0;
              displayNow = 0;
            } else if (copiesAvailableForThisLevel >= cost.cards) {
              state = "READY";
              pct = 100;
              displayNow = cost.cards;
            } else {
              state = "ACTIVE";
              pct = Math.min(
                100,
                Math.max(0, (copiesAvailableForThisLevel / cost.cards) * 100),
              );
              displayNow = copiesAvailableForThisLevel;
            }
          }

          if (state === "MAXED") {
            return null; // Oculta o box se o nível já foi atingido
          }

          // Verifica se não existe custo (para casos onde lvl < baseLevel)
          if (displayTotal === 0 && currentLevel < lvl) {
            return null;
          }

          return (
            <div
              key={lvl}
              className={`w-full max-w-[140px] flex flex-col gap-1 border-2 rounded-lg p-2 ${state === "READY" ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-500/50" : state === "ACTIVE" ? "border-blue-300 bg-blue-50/50 dark:bg-blue-900/30 dark:border-blue-500/50" : "border-slate-100 dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A]/50"}`}
            >
              <div className="text-center font-bold text-slate-400 text-[10px]">
                LEVEL {lvl}
              </div>

              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="w-full relative h-[20px] bg-slate-200 dark:bg-[#475569] rounded-md overflow-hidden text-[9px] font-black tracking-tight border border-slate-300 dark:border-[#475569]/50 flex shadow-inner">
                  <div
                    className={`absolute top-0 left-0 bottom-0 ${state === "READY" ? "bg-emerald-400" : "bg-gradient-to-b from-blue-400 to-blue-500"} transition-all`}
                    style={{ width: `${pct}%` }}
                  ></div>
                  <div
                    className={`absolute inset-0 flex items-center justify-center z-10 ${pct > 45 ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" : "text-slate-700 dark:text-slate-300"}`}
                  >
                    {displayNow.toLocaleString("pt-BR")} /{" "}
                    {displayTotal.toLocaleString("pt-BR")}
                  </div>
                </div>
              </div>
              {cost.gold > 0 && (
                <div className="text-[10px] flex items-center justify-center gap-1 font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {cost.gold.toLocaleString("pt-BR")}
                  <Coins className="w-2.5 h-2.5 text-amber-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
