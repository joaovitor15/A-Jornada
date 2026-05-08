import React, { useState, useEffect } from "react";
import { RoadToMaxCard } from "../components/RoadToMaxCard";
import { CardCollectionSummary } from "../components/CardCollectionSummary";
import { MasteryBadge } from "../components/MasteryBadge";
import {
  Loader2,
  Shield,
  Swords,
  Search,
  X,
  TrendingUp,
  Star,
  Coins,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import starLevelsMap from "../constants/starLevels.json";
import {
  upgradeCosts,
  baseLevelByRarity,
  MAX_LEVEL,
  Rarity,
} from "../constants/upgradeData";

interface CRCardsPageProps {
  activeProfileId?: string;
}

export default function CRCardsPage({ activeProfileId }: CRCardsPageProps) {
  const [cards, setCards] = useState<any[]>([]);
  const [playerProfile, setPlayerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<'progresso' | 'cartas' | 'road_to_max' | 'maestria'>('progresso');
  const [activeMasteryCard, setActiveMasteryCard] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMasteryCard(null);
    };
    if (activeMasteryCard) {
      document.addEventListener("click", handleGlobalClick);
    }
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [activeMasteryCard]);

  const fetchCards = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/clash-royale/cards");
      if (!res.ok) {
        throw new Error("Falha ao buscar as cartas da API");
      }
      const data = await res.json();
      const allCards = [
        ...(data.items || []).map((c: any) => ({ ...c, isTowerTroop: false })),
        ...(data.supportItems || []).map((c: any) => ({
          ...c,
          isTowerTroop: true,
        })),
      ];

      // Remove possible duplicates by ID
      let uniqueCards = Array.from(
        new Map(allCards.map((c) => [c.id, c])).values(),
      );

      // Removed top player fallback for masteries because it brings masteries with stars.
      const masteryNameMapping: Record<string, string> = {
        "MiniPEKKA": "MasteryMiniPekka",
        "DartGoblin": "MasteryBlowdartGoblin",
        "IceSpirit": "MasteryIceSpirits",
        "Furnace": "MasteryFirespiritHut",
        "PEKKA": "MasteryPekka",
        "GiantSnowball": "MasterySnowball",
        "Archers": "MasteryArcher",
        "Zappies": "MasteryMiniSparkys",
        "XBow": "MasteryXbow",
        "GoblinDrill": "MasteryDartBarrell",
        "MagicArcher": "MasteryEliteArcher",
        "GoblinGiant": "MasteryGiantBuffer",
        "Sparky": "MasteryZapMachine",
        "WallBreakers": "MasteryWallbreakers",
        "Guards": "MasterySkeletonWarriors",
        "BarbarianBarrel": "MasteryBarbLog",
        "NightWitch": "MasteryDarkWitch",
        "MotherWitch": "MasteryWitchMother",
        "SkeletonBarrel": "MasterySkeletonBalloon",
        "RoyalGhost": "MasteryGhost",
        "EliteBarbarians": "MasteryAngryBarbarians",
        "Clone": "MasteryDarkMagic"
      };

      // Apply static badge mapping
      uniqueCards = uniqueCards.map((card: any) => {
        return card;
      });

      // Get player possession info if available
      const playerTag = localStorage.getItem("cr_player_tag");
      if (playerTag) {
        try {
          const cleanTag = playerTag.replace(/^#/, "");
          const playerRes = await fetch(`/api/clash-royale/player/${cleanTag}`);
          if (playerRes.ok) {
            const playerData = await playerRes.json();
            setPlayerProfile(playerData);
            const playerCards = [
              ...(playerData.cards || []),
              ...(playerData.supportCards || []),
            ];

            uniqueCards = uniqueCards.map((card: any) => {
              const pCard = playerCards.find((pc: any) => pc.id === card.id);
              
              const cardNameClean = card.name.replace(/[^a-zA-Z0-9]/g, '');
              const masteryBadgeName = masteryNameMapping[cardNameClean] || `Mastery${cardNameClean}`;
              const masteryBadge = playerData.badges?.find(
                (b: any) => b.name === masteryBadgeName
              );
              let masteryLevel = masteryBadge ? masteryBadge.level : 0;
              let masteryIconUrl = masteryBadge?.iconUrls?.large || null;

              if (pCard) {
                const el = pCard.evolutionLevel || 0;
                return {
                  ...card,
                  hasCardOnAccount: true,
                  // evolutionLevel maps: 1 = Evo, 2 = Hero, 3 = Both
                  hasEvoOnAccount: el === 1 || el === 3,
                  hasHeroOnAccount: el === 2 || el === 3,
                  playerLevel:
                    pCard.level && pCard.maxLevel
                      ? 16 - pCard.maxLevel + pCard.level
                      : pCard.level,
                  count: pCard.count || 0,
                  playerLevelRaw: pCard.level || 0,
                  playerMaxLevelRaw: pCard.maxLevel || 0,
                  starLevel: pCard.starLevel || 0,
                  masteryLevel,
                  masteryIconUrl,
                  maxStarLevel: card.isTowerTroop ? 0 : (starLevelsMap[card.id as keyof typeof starLevelsMap] || 1),
                };
              }
              return {
                ...card,
                hasCardOnAccount: false,
                hasEvoOnAccount: false,
                hasHeroOnAccount: false,
                count: 0,
                playerLevel: 1,
                masteryLevel,
                masteryIconUrl,
                maxStarLevel: card.isTowerTroop ? 0 : (starLevelsMap[card.id as keyof typeof starLevelsMap] || 1),
              };
            });
          }
        } catch (e) {
          console.warn("Could not fetch player data for possession", e);
        }
      }

      setCards(uniqueCards);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState<
    "all"
  >("all");

  const stats = {
    all: {
      total: cards.filter((c) => !c.isTowerTroop).length,
      unlocked: cards.filter((c) => !c.isTowerTroop && c.hasCardOnAccount)
        .length,
    },
    max: {
      total: cards.length,
      unlocked: cards.filter((c) => c.hasCardOnAccount).length,
    },
  };

  const filteredCards = cards
    .filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (activeTab === "all") return !c.isTowerTroop;
      if (viewMode === "road_to_max") return true;

      return true;
    })
    .sort((a, b) => {
      // Keep standard sorting for agora
      return 0;
    });

  const rarityOrder = ["common", "rare", "epic", "legendary", "champion"];

  const getRarityTextStyles = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case "common":
        return "text-blue-500";
      case "rare":
        return "text-orange-500";
      case "epic":
        return "text-purple-600";
      case "legendary":
        return "text-emerald-600";
      case "champion":
        return "text-amber-500";
      case "tower":
        return "text-rose-500";
      default:
        return "text-slate-500";
    }
  };

  const getRarityLineStyles = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case "common":
        return "bg-blue-200";
      case "rare":
        return "bg-orange-200";
      case "epic":
        return "bg-purple-200";
      case "legendary":
        return "bg-emerald-200";
      case "champion":
        return "bg-amber-200";
      case "tower":
        return "bg-rose-200";
      default:
        return "bg-slate-200";
    }
  };

  const getRarityTitle = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case "common":
        return "Cartas Comuns";
      case "rare":
        return "Cartas Raras";
      case "epic":
        return "Cartas Épicas";
      case "legendary":
        return "Cartas Lendárias";
      case "champion":
        return "Campeões";
      case "tower":
        return "Tropas de Torre";
      default:
        return `Cartas ${rarity}`;
    }
  };

  const groupedCards =
    activeTab === "all" || viewMode === "road_to_max"
      ? (() => {
          const groups = rarityOrder
            .map((rarity) => {
              const isRoadToMax = viewMode === "road_to_max";
              return {
                rarity,
                cards: filteredCards.filter(
                  (c) =>
                    c.rarity?.toLowerCase() === rarity &&
                    (!isRoadToMax || !c.isTowerTroop),
                ),
              };
            })
            .filter((g) => g.cards.length > 0);

          const otherRarities = Array.from(
            new Set(filteredCards.map((c) => c.rarity?.toLowerCase())),
          ).filter(
            (r): r is string =>
              typeof r === "string" && !rarityOrder.includes(r),
          );
          otherRarities.forEach((rarity) => {
            if (rarity) {
              const isRoadToMax = viewMode === "road_to_max";
              groups.push({
                rarity,
                cards: filteredCards.filter(
                  (c) =>
                    c.rarity?.toLowerCase() === rarity &&
                    (!isRoadToMax || !c.isTowerTroop),
                ),
              });
            }
          });

          if (viewMode === "road_to_max") {
            const towerTroops = filteredCards.filter((c) => c.isTowerTroop);
            if (towerTroops.length > 0) {
              groups.push({
                rarity: "tower",
                cards: towerTroops,
              });
            }
          }

          return groups;
        })()
      : [{ rarity: "none", cards: filteredCards }];

  const getRarityStyles = (rarity: string) => {
    const r = rarity?.toLowerCase() || "";
    switch (r) {
      case "common":
        return "border-blue-400 bg-blue-400/20 shadow-[0_0_10px_-2px_rgba(59,130,246,0.3)]";
      case "rare":
        return "border-orange-400 bg-orange-400/20 shadow-[0_0_10px_-2px_rgba(251,146,60,0.3)]";
      case "epic":
        return "border-purple-400 bg-purple-400/20 shadow-[0_0_10px_-2px_rgba(168,85,247,0.3)]";
      case "legendary":
        return "border-emerald-400 bg-emerald-400/20 shadow-[0_0_15px_-3px_rgba(52,211,153,0.4)] ring-1 ring-emerald-300/30";
      case "champion":
        return "border-amber-400 bg-amber-400/20 shadow-[0_0_20px_-3px_rgba(251,191,36,0.5)] ring-2 ring-amber-300/50";
      default:
        return "border-slate-300 bg-slate-100";
    }
  };

  const getRarityBadgeStyles = (rarity: string) => {
    const r = rarity?.toLowerCase() || "";
    switch (r) {
      case "common":
        return "bg-gradient-to-br from-blue-400 to-blue-600";
      case "rare":
        return "bg-gradient-to-br from-orange-400 to-orange-600";
      case "epic":
        return "bg-gradient-to-br from-purple-400 to-purple-600";
      case "legendary":
        return "bg-gradient-to-br from-emerald-400 to-emerald-600";
      case "champion":
        return "bg-gradient-to-br from-amber-300 to-amber-500";
      default:
        return "bg-gradient-to-br from-slate-400 to-slate-600";
    }
  };

  const getStarPointsCost = (maxStars: number) => {
    if (maxStars === 1) return 5000;
    if (maxStars === 2) return 15000; // 5000 + 10000
    if (maxStars === 3) return 35000; // 5000 + 10000 + 20000
    return 0;
  };

  const getStarPointsCurrent = (currentStars: number) => {
    if (currentStars === 1) return 5000;
    if (currentStars === 2) return 15000;
    if (currentStars === 3) return 35000;
    return 0;
  };

  const getGoldToLevel = (rarity: string, currentLevel: number, targetLevel: number) => {
    const r = (rarity || "common").toLowerCase() as Rarity;
    const costs = upgradeCosts[r] || {};
    let totalGold = 0;
    for (let l = currentLevel + 1; l <= targetLevel; l++) {
      totalGold += costs[l]?.gold || 0;
    }
    return totalGold;
  };

  const totalStarPointsNeeded = cards.reduce((acc, card) => acc + getStarPointsCost(card.maxStarLevel || 0), 0);
  const currentStarPointsInvested = cards.reduce((acc, card) => acc + getStarPointsCurrent(card.starLevel || 0), 0);

  const totalGoldMax = cards.reduce((acc, card) => {
    const r = (card.rarity || "common").toLowerCase() as Rarity;
    const baseLvl = baseLevelByRarity[r] || 1;
    return acc + getGoldToLevel(r, baseLvl, MAX_LEVEL);
  }, 0);

  const totalGoldSpent = cards.reduce((acc, card) => {
    if (!card.hasCardOnAccount) return acc;
    const r = (card.rarity || "common").toLowerCase() as Rarity;
    const baseLvl = baseLevelByRarity[r] || 1;
    return acc + getGoldToLevel(r, baseLvl, card.playerLevel || 1);
  }, 0);

  const totalGoldRequiredTilMax = cards.reduce((acc, card) => {
    const r = (card.rarity || "common").toLowerCase() as Rarity;
    return acc + getGoldToLevel(r, card.playerLevel || 1, MAX_LEVEL);
  }, 0);

  const totalGoldRequiredForAvailableUpgrades = cards.reduce((acc, card) => {
    if (!card.hasCardOnAccount || (card.playerLevel || 1) >= MAX_LEVEL) return acc;
    const r = (card.rarity || "common").toLowerCase() as Rarity;
    const nextLevel = (card.playerLevel || 1) + 1;
    const upgradeInfo = upgradeCosts[r]?.[nextLevel];
    if (upgradeInfo && card.count >= upgradeInfo.cards) {
      return acc + upgradeInfo.gold;
    }
    return acc;
  }, 0);

  useEffect(() => {
    if (cards.length > 0) {
      console.log("--- TESTE DE CÁLCULO DE OURO ---");
      console.log("Total Gold Max (RoyaleAPI style):", totalGoldMax);
      console.log("Total Spent:", totalGoldSpent);
      console.log("Required til max:", totalGoldRequiredTilMax);
      console.log("---------------------------------");
    }
  }, [cards, totalGoldMax, totalGoldSpent, totalGoldRequiredTilMax]);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
            <Swords className="text-blue-500" />
            Coleção Real
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Todas as cartas e itens de suporte
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-slate-200">
        <button
          onClick={() => setViewMode('progresso')}
          className={`px-4 py-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
            viewMode === 'progresso'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Progresso
        </button>
        <button
          onClick={() => setViewMode('cartas')}
          className={`px-4 py-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
            viewMode === 'cartas'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Cartas
        </button>
        <button
          onClick={() => setViewMode('road_to_max')}
          className={`px-4 py-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
            viewMode === 'road_to_max'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Road to Max
        </button>
        <button
          onClick={() => setViewMode('maestria')}
          className={`px-4 py-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
            viewMode === 'maestria'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Maestria
        </button>
      </div>

      {viewMode === 'maestria' && (
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
              Progresso de Maestria
            </h2>
            
            <div className="flex flex-col gap-2">
              <div className="h-6 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(lvl => {
                  const count = cards.filter(c => c.masteryLevel === lvl).length;
                  const width = (count / cards.length) * 100;
                  if (width === 0) return null;
                  return (
                    <div 
                      key={lvl}
                      style={{ width: `${width}%` }}
                      className={`h-full transition-all duration-500 ${
                        lvl === 10 ? "bg-indigo-600" :
                        lvl >= 7 ? "bg-amber-500" :
                        lvl >= 4 ? "bg-slate-400" :
                        "bg-orange-500"
                      }`}
                    />
                  );
                })}
              </div>
              
              <div className="grid grid-cols-12 gap-1 mt-2">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(lvl => (
                  <div key={lvl} className="flex flex-col items-center relative after:content-[''] after:absolute after:right-[-2px] after:top-[4px] after:bottom-[8px] after:w-[1px] after:bg-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">L{lvl}</span>
                    <span className="text-xs font-black text-slate-800">
                      {cards.filter(c => !c.isTowerTroop && (c.masteryLevel || 0) === lvl).length}
                    </span>
                    <div className={`w-11/12 h-[3px] mt-1 rounded-full ${
                      lvl === 10 ? "bg-indigo-600" :
                      lvl >= 7 ? "bg-amber-500" :
                      lvl >= 4 ? "bg-slate-400" :
                      lvl >= 1 ? "bg-orange-500" : "bg-slate-200"
                    }`} />
                  </div>
                ))}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-blue-500 uppercase">Sum</span>
                    <span className="text-xs font-black text-blue-600">
                      {cards.filter(c => !c.isTowerTroop).reduce((acc, c) => acc + (c.masteryLevel || 0), 0)}
                    </span>
                    <div className="w-11/12 h-[3px] mt-1 rounded-full bg-blue-500" />
                  </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-10 gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-8 px-2 lg:px-0 mt-4">
            {cards
              .filter((card) => !card.isTowerTroop && card.masteryLevel && card.masteryLevel > 0)
              .sort((a, b) => {
                const aLevel = a.masteryLevel || 0;
                const bLevel = b.masteryLevel || 0;
                if (aLevel !== bLevel) return bLevel - aLevel;
                return a.name.localeCompare(b.name);
              })
              .map(card => {
                const mastery = card.masteryLevel || 0;
                return (
                  <motion.div 
                    layout
                    key={card.id} 
                    className="relative group flex flex-col items-center"
                  >
                    <MasteryBadge 
                      level={mastery} 
                      iconUrl={card.iconUrls?.medium}
                      masteryIconUrl={card.masteryIconUrl}
                      name={card.name} 
                      isActive={activeMasteryCard === card.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMasteryCard(activeMasteryCard === card.id ? null : card.id);
                      }}
                    />
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}

      {viewMode === 'progresso' && (
        <>
          <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full md:w-64 h-[13rem] p-5 flex flex-col justify-between relative group overflow-hidden">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
          
          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-cyan-200 shadow-inner flex items-center justify-center">
                <Star className="text-cyan-100 fill-cyan-100" size={14} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-slate-500 font-bold text-[11px] tracking-widest uppercase whitespace-nowrap">
                Ponto Estelar
              </h3>
              <p className="text-2xl font-black text-slate-800">
                {playerProfile?.starPoints
                  ? playerProfile.starPoints.toLocaleString("pt-BR")
                  : "0"}
              </p>
            </div>
          </div>

          {/* GLOBAL STAR PROGRESS BAR INTEGRATED */}
          <div className="w-full mt-auto mb-2">
            <div className="flex justify-end mb-1 px-0.5">
              <span className="text-[14px] font-black text-cyan-500 italic">
                {Math.round((currentStarPointsInvested / totalStarPointsNeeded) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full border border-slate-200 overflow-hidden p-[1px] shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500"
                style={{ width: `${(currentStarPointsInvested / totalStarPointsNeeded) * 100}%` }}
              />
            </div>
            <div className="text-center mt-3 mb-1">
              {currentStarPointsInvested >= totalStarPointsNeeded && totalStarPointsNeeded > 0 ? (
                <span className="text-[12px] font-black text-cyan-500 uppercase tracking-tight">
                  Concluído
                </span>
              ) : (
                <span className="text-[12px] font-black text-slate-500 uppercase tracking-tight">
                  Faltam {Math.max(0, (totalStarPointsNeeded - currentStarPointsInvested) - (playerProfile?.starPoints || 0)).toLocaleString("pt-BR")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* GOLD PROGRESS CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full md:w-64 h-[13rem] p-5 flex flex-col justify-between relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
          
          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-amber-200 shadow-inner flex items-center justify-center">
                <Coins className="text-amber-100" size={14} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-slate-500 font-bold text-[11px] tracking-widest uppercase whitespace-nowrap">
                Falta p/ Maximizar
              </h3>
              <p className="text-2xl font-black text-slate-800">
                {totalGoldRequiredTilMax.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="w-full mt-auto mb-2">
            <div className="flex justify-end mb-1 px-0.5">
              <span className="text-[14px] font-black text-amber-600 italic">
                {Math.round((totalGoldSpent / totalGoldMax) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full border border-slate-200 overflow-hidden p-[1px] shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700"
                style={{ width: `${(totalGoldSpent / totalGoldMax) * 100}%` }}
              />
            </div>
            <div className="text-center mt-3 mb-1">
              {totalGoldSpent >= totalGoldMax && totalGoldMax > 0 ? (
                <span className="text-[11px] font-black text-amber-600 uppercase tracking-tight whitespace-nowrap">
                  Concluído
                </span>
              ) : (
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight whitespace-nowrap">
                  Custo Bruto: {totalGoldMax.toLocaleString("pt-BR")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full md:w-64 h-[13rem] p-5 flex flex-col justify-between relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
          
          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-emerald-200 shadow-inner flex items-center justify-center">
                <TrendingUp className="text-emerald-100" size={14} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-slate-500 font-bold text-[11px] tracking-widest uppercase whitespace-nowrap">
                Cartas Maximizadas
              </h3>
              <p className="text-2xl font-black text-slate-800">
                {cards.filter(c => c.hasCardOnAccount && (c.playerLevel || 1) >= MAX_LEVEL).length.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
          
          <div className="w-full mt-auto mb-2">
            <div className="flex justify-end mb-1 px-0.5">
              <span className="text-[14px] font-black text-emerald-600 italic">
                {cards.length > 0 ? Math.round((cards.filter(c => c.hasCardOnAccount && (c.playerLevel || 1) >= MAX_LEVEL).length / cards.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full border border-slate-200 overflow-hidden p-[1px] shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-700"
                style={{ width: `${cards.length > 0 ? (cards.filter(c => c.hasCardOnAccount && (c.playerLevel || 1) >= MAX_LEVEL).length / cards.length) * 100 : 0}%` }}
              />
            </div>
            <div className="text-center mt-3 mb-1">
              {cards.filter(c => c.hasCardOnAccount && (c.playerLevel || 1) >= MAX_LEVEL).length >= cards.length && cards.length > 0 ? (
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-tight whitespace-nowrap">
                  Concluído
                </span>
              ) : (
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight whitespace-nowrap">
                  Total Cartas + Tropas: {cards.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <CardCollectionSummary 
        cards={cards} 
      />

      <div className="mt-8 flex flex-col gap-8 opacity-90">
        {(() => {
          const towerCards = cards.filter(c => c.isTowerTroop);
          const heroCards = cards.filter(c => !!c.iconUrls?.heroMedium);
          const evoCards = cards.filter(c => !!c.iconUrls?.evolutionMedium);

          const SpecialCollectionRow = ({ title, items, isUnlocked, getIcon }: { title: string, items: any[], isUnlocked: (c:any)=>boolean, getIcon: (c:any)=>string, getLevel?: (c:any)=>number|null|undefined }) => {
            if (items.length === 0) return null;
            return (
              <div className="py-2">
                <h3 className="text-[12px] font-black text-slate-400 mb-4 uppercase tracking-widest">{title}</h3>
                <div className="flex flex-wrap gap-x-3 gap-y-4">
                  {items.map(c => {
                    const unlocked = isUnlocked(c);
                    const icon = getIcon(c);
                    return (
                      <div key={c.id} className="flex flex-col items-center w-11">
                        <div className={`relative transition-all duration-300 ${!unlocked ? "grayscale opacity-30 scale-90" : "hover:scale-110"}`}>
                          <img src={icon} alt={c.name} className="w-11 h-auto object-contain drop-shadow-sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          };

          return (
            <>
              <SpecialCollectionRow 
                title="Tower Card Collection" 
                items={towerCards} 
                isUnlocked={c => c.hasCardOnAccount} 
                getIcon={c => c.iconUrls?.medium} 
              />
              <SpecialCollectionRow 
                title="Hero Card Collection" 
                items={heroCards} 
                isUnlocked={c => c.hasHeroOnAccount} 
                getIcon={c => c.iconUrls?.heroMedium || c.iconUrls?.medium} 
              />
              <SpecialCollectionRow 
                title="Evo Card Collection" 
                items={evoCards} 
                isUnlocked={c => c.hasEvoOnAccount} 
                getIcon={c => c.iconUrls?.evolutionMedium || c.iconUrls?.medium} 
              />
            </>
          );
        })()}
      </div>
      </>)}

      {viewMode === 'cartas' && (<>
      <div className="flex justify-end mb-8">
        <div className="relative w-full md:w-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-14">
          <AnimatePresence>
            {groupedCards.map((group) => [
              group.rarity !== "none" && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={`header-${group.rarity}`}
                  className="col-span-full flex items-center gap-4 mt-4 mb-2"
                >
                  <h2
                    className={`text-[16px] font-black uppercase tracking-tight ${getRarityTextStyles(group.rarity)}`}
                  >
                    {getRarityTitle(group.rarity)}
                  </h2>
                  <div
                    className={`flex-1 h-px ${getRarityLineStyles(group.rarity)}`}
                  ></div>
                </motion.div>
              ),
              ...group.cards.map((card) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={card.id}
                  title={`${card.name} (${card.rarity})`}
                  className={`group relative flex flex-col items-center border-2 rounded-lg p-1 pt-2 transition-all hover:scale-105 hover:z-50 cursor-pointer ${getRarityStyles(card.rarity)}`}
                >
                  <img
                    src={
                      activeTab === "evo" && card.iconUrls?.evolutionMedium
                        ? card.iconUrls.evolutionMedium
                        : activeTab === "hero" && card.iconUrls?.heroMedium
                          ? card.iconUrls.heroMedium
                          : card.iconUrls.medium
                    }
                    alt={card.name}
                    className={`w-full h-auto object-contain transition-all ${
                      (
                        activeTab === "evo"
                          ? card.hasEvoOnAccount
                          : activeTab === "hero"
                            ? card.hasHeroOnAccount
                            : card.hasCardOnAccount
                      )
                        ? "drop-shadow-sm group-hover:drop-shadow-lg"
                        : "grayscale opacity-50"
                    }`}
                  />

                  {/* ELIXIR COST DROP */}
                  {card.elixirCost !== undefined && (
                    <div className="absolute top-1 left-1 z-20 flex items-center justify-center">
                      <div className="relative w-6 h-7 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        {/* Pink Drop Shape (CSS) */}
                        <svg
                          viewBox="0 0 100 130"
                          className="absolute inset-0 w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                        >
                          <path
                            d="M50 0 C50 0 100 40 100 80 C100 107.6 77.6 130 50 130 C22.4 130 0 107.6 0 80 C0 40 50 0 50 0 Z"
                            fill="url(#pink-gradient)"
                            stroke="white"
                            strokeWidth="8"
                          />
                          <defs>
                            <linearGradient
                              id="pink-gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#f472b6" />
                              <stop offset="100%" stopColor="#db2777" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="relative z-10 text-[11px] font-black text-white drop-shadow-md leading-none pt-1">
                          {card.elixirCost}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SPECIAL BADGES (EVO / HERO) ONLY VISIBLE ON ALL TAB */}
                  <div className="absolute top-1 right-1 z-20 flex flex-row gap-0.5 items-start justify-end">
                    {activeTab === "all" && !!card.iconUrls?.heroMedium && (
                      <div
                        className={`text-[7px] font-black px-1.5 h-[14px] rounded-sm border shadow-sm uppercase tracking-tighter flex items-center gap-0.5 ${
                          card.hasHeroOnAccount !== false
                            ? "bg-gradient-to-b from-cyan-300 to-blue-600 text-white border-white/50"
                            : "bg-slate-700 text-slate-400 border-slate-600/50"
                        }`}
                      >
                        <Swords size={7} fill="currentColor" />
                        HERÓI
                      </div>
                    )}
                    {activeTab === "all" &&
                      !!card.iconUrls?.evolutionMedium && (
                        <div
                          className={`text-[7px] font-black px-1.5 h-[14px] rounded-sm border shadow-sm uppercase tracking-tighter flex items-center gap-0.5 ${
                            card.hasEvoOnAccount !== false
                              ? "bg-gradient-to-b from-purple-400 to-purple-800 text-white border-white/50"
                              : "bg-slate-700 text-slate-400 border-slate-600/50"
                          }`}
                        >
                          <Swords size={7} fill="currentColor" />
                          EVO
                        </div>
                      )}
                  </div>

                  {/* MAX BADGE FOR MAXED CARDS */}
                  {card.playerLevelRaw > 0 &&
                    card.playerLevelRaw === card.playerMaxLevelRaw && (
                      <div className="absolute bottom-1 right-1 z-20">
                        <div className="bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-600 px-1.5 h-[14px] rounded-sm border border-white/60 shadow-sm flex items-center justify-center">
                          <span className="text-[7px] font-black text-black leading-none uppercase tracking-tighter">
                            MAX
                          </span>
                        </div>
                      </div>
                    )}

                  {/* STAR LEVELS */}
                  {card.maxStarLevel > 0 && (
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex justify-center items-center gap-[1px] z-10">
                      {Array.from({ length: card.maxStarLevel }).map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={
                            i < (card.starLevel || 0)
                              ? "fill-yellow-400 text-yellow-500 drop-shadow-[0_0_3px_rgba(234,179,8,0.8)]"
                              : "fill-black text-black"
                          }
                        />
                      ))}
                    </div>
                  )}

                  {/* PLAYER LEVEL BADGE */}
                  {card.playerLevel !== undefined && (
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full ${getRarityBadgeStyles(card.rarity)} border border-white shadow-md flex items-center justify-center`}
                      >
                        <span className="text-[10px] font-black text-white drop-shadow-sm leading-none">
                          {card.playerLevel}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )),
            ])}
          </AnimatePresence>
          {filteredCards.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 font-bold italic">
              Nenhuma carta encontrada com o termo "{search}".
            </div>
          )}
        </div>
      )}
      </>)}

      {viewMode === 'road_to_max' && (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {groupedCards.map((group) => [
              group.rarity !== "none" && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={`header-${group.rarity}`}
                  className="flex items-center gap-4 mt-6 mb-2"
                >
                  <h2
                    className={`text-[16px] font-black uppercase tracking-tight ${getRarityTextStyles(group.rarity)}`}
                  >
                    {getRarityTitle(group.rarity)}
                  </h2>
                  <div
                    className={`flex-1 h-px ${getRarityLineStyles(group.rarity)}`}
                  ></div>
                </motion.div>
              ),
              ...group.cards.map((card) => (
                <RoadToMaxCard key={card.id} card={card} />
              )),
            ])}
          </AnimatePresence>
          {filteredCards.length === 0 && (
            <div className="py-20 text-center text-slate-500 font-bold italic">
              Nenhuma carta encontrada com o termo "{search}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
