import React from "react";
import {
  upgradeCosts,
  baseLevelByRarity,
  MAX_LEVEL,
  Rarity,
} from "../constants/upgradeData";

interface CardCollectionSummaryProps {
  cards: any[];
}

export function CardCollectionSummary({ 
  cards 
}: CardCollectionSummaryProps) {
  const rarities: {
    id: Rarity;
    label: string;
    iconBaseColor: string;
    iconTopColor: string;
  }[] = [
    {
      id: "common",
      label: "Comuns",
      iconBaseColor: "bg-blue-300",
      iconTopColor: "bg-blue-400",
    },
    {
      id: "rare",
      label: "Raras",
      iconBaseColor: "bg-orange-300",
      iconTopColor: "bg-orange-400",
    },
    {
      id: "epic",
      label: "Épicas",
      iconBaseColor: "bg-purple-400",
      iconTopColor: "bg-purple-500",
    },
    {
      id: "legendary",
      label: "Lendárias",
      iconBaseColor: "bg-blue-200",
      iconTopColor: "bg-sky-200",
    }, // has rainbow later
    {
      id: "champion",
      label: "Campeões",
      iconBaseColor: "bg-yellow-300",
      iconTopColor: "bg-yellow-400",
    },
  ];

  const getCardsToLevel = (
    rarity: string,
    currentLevel: number,
    targetLevel: number,
  ) => {
    const r = rarity.toLowerCase() as Rarity;
    const costs = upgradeCosts[r] || {};
    let count = 0;
    for (let l = currentLevel + 1; l <= targetLevel; l++) {
      count += costs[l]?.cards || 0;
    }
    return count;
  };

  const getSummary = (rarityId: Rarity) => {
    const groupCards = cards.filter((c) => {
      return (c.rarity || "common").toLowerCase() === rarityId;
    });

    let collected = 0;
    let maxTotal = 0;
    let maxedCards = 0;

    groupCards.forEach((c) => {
      const r = (c.rarity || "common").toLowerCase() as Rarity;
      const baseLvl = baseLevelByRarity[r] || 1;

      const cardMaxTotal = getCardsToLevel(r, baseLvl, MAX_LEVEL); // exact sum of upgrade costs
      maxTotal += cardMaxTotal;

      let cardCollected = 0;
      if (c.hasCardOnAccount || c.playerLevelRaw > 0 || c.count > 0) {
        cardCollected += c.count; // cards waiting to be used
        cardCollected += getCardsToLevel(r, baseLvl, c.playerLevel || 1); // upgraded cards

        // ensure collected doesn't exceed maxTotal just in case
        if (cardCollected > cardMaxTotal) cardCollected = cardMaxTotal;
      }
      collected += cardCollected;

      // Maxed logic: cards that reached MAX_LEVEL
      if (c.playerLevel && c.playerLevel >= MAX_LEVEL) {
        maxedCards++;
      }
    });

    return {
      collected,
      maxTotal,
      needed: Math.max(0, maxTotal - collected),
      maxedCards,
    };
  };

  return (
    <div className="mb-8">
      <h2 className="text-[18px] font-black text-slate-800 dark:text-slate-200 mb-4 px-1 uppercase tracking-tight">
        Progresso da Coleção
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {rarities.map((rInfo) => {
          const stats = getSummary(rInfo.id);
          if (stats.maxTotal === 0) return null; // No cards of this rarity

          const progressPct = Math.min(
            100,
            Math.max(0, (stats.collected / stats.maxTotal) * 100),
          );

          return (
            <div
              key={rInfo.id}
              className="flex flex-col gap-3 bg-white dark:bg-[#1E293B] p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-[#334155]"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Simulated Card Stack Icon */}
                  <div
                    className={`relative w-6 h-8 rounded shadow-sm border border-black/10 overflow-hidden ${rInfo.iconBaseColor} ${rInfo.id === "legendary" ? "bg-gradient-to-tr from-cyan-300 via-purple-300 to-yellow-200" : ""}`}
                  >
                    {!["legendary"].includes(rInfo.id) && (
                      <div
                        className={`absolute left-0 right-0 top-0 h-[35%] ${rInfo.iconTopColor}`}
                      ></div>
                    )}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                    {rInfo.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-400">
                  {progressPct.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar under header */}
              <div className="h-1.5 w-full bg-slate-100 dark:bg-[#334155]/80 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${["common"].includes(rInfo.id) ? "bg-blue-400" : ["rare"].includes(rInfo.id) ? "bg-orange-400" : ["epic"].includes(rInfo.id) ? "bg-purple-500" : ["legendary"].includes(rInfo.id) ? "bg-cyan-400" : ["champion"].includes(rInfo.id) ? "bg-yellow-400" : "bg-rose-400"}`}
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>

              {/* Stats Rows */}
              <div className="flex flex-col gap-3 mt-3">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                    Coletadas
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {stats.collected.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                    Necessárias
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {stats.needed.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                    Total Máximo
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {stats.maxTotal.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px] mt-1 pt-3 border-t border-slate-100 dark:border-[#334155]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                    Maximizadas
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {stats.maxedCards}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
