import React, { useState, useEffect } from "react";
import {
  Loader2,
  Award,
} from "lucide-react";

interface CRBadgesPageProps {
  activeProfileId?: string;
}

export default function CRBadgesPage({ activeProfileId }: CRBadgesPageProps) {
  const [badges, setBadges] = useState<any[]>([]);
  const [playerProfile, setPlayerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const playerTag = localStorage.getItem("cr_player_tag");
      if (!playerTag) {
        throw new Error("Nenhuma tag de jogador encontrada. Acesse a página de Cartas CR para adicionar sua tag.");
      }
      
      const cleanTag = playerTag.replace(/^#/, "");
      const playerRes = await fetch(`/api/clash-royale/player/${cleanTag}`);
      
      if (!playerRes.ok) {
        throw new Error("Falha ao buscar os dados do jogador na API");
      }
      
      const playerData = await playerRes.json();
      setPlayerProfile(playerData);
      
      // Filter out mastery badges
      const filteredBadges = (playerData.badges || []).filter((b: any) => !b.name.toLowerCase().includes('mastery'));

      const sortedBadges = filteredBadges.sort((a: any, b: any) => {
        return a.name.localeCompare(b.name);
      });
      
      setBadges(sortedBadges);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
         setError('Servidor indisponível ou falha de conexão. Tente novamente.');
      } else {
         setError(err.message || 'Erro desconhecido ao carregar emblemas.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLegendaryBadge = (name: string) => {
    const n = name.toLowerCase();
    return n.includes('league') || 
           n.includes('top') || 
           n.includes('grand') || 
           n.includes('crl') || 
           n.includes('path') ||
           n.includes('legend') ||
           n.includes('champion') ||
           n.includes('royal') ||
           n.includes('crazy') ||
           n.includes('triple');
  };

  const legendaryBadges = badges.filter(b => isLegendaryBadge(b.name)).sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    const getWeight = (n: string) => {
      if (n.includes('crazy')) return 1;
      if (n.includes('triple')) return 2;
      return 3;
    };
    
    const weightA = getWeight(nameA);
    const weightB = getWeight(nameB);
    
    if (weightA !== weightB) {
      return weightA - weightB;
    }
    return nameA.localeCompare(nameB);
  });
  const normalBadges = badges.filter(b => !isLegendaryBadge(b.name));

  const renderBadge = (badge: any, index: number) => (
    <div key={index} className="relative group w-full flex items-center justify-center cursor-pointer" title={badge.name.replace(/([A-Z])/g, ' $1').trim()}>
      <div className="relative z-10 w-full px-2 flex items-center justify-center">
        {badge.iconUrls?.large ? (
          <img 
            src={badge.iconUrls.large} 
            alt={badge.name} 
            className="w-[180%] sm:w-[200%] h-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-[1.2]" 
          />
        ) : (
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
            <Award className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-500" />
            Emblemas da Conta
          </h1>
          <p className="text-slate-500 mt-2">
            Veja todos os seus emblemas do Clash Royale.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-semibold uppercase tracking-wider text-sm">Carregando Emblemas...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {legendaryBadges.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-widest uppercase mb-8 flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-3">
                <Award className="w-5 h-5 text-amber-500" /> Emblemas Lendários
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-x-4 sm:gap-x-8 gap-y-12">
                {legendaryBadges.map((badge, index) => renderBadge(badge, index))}
              </div>
            </div>
          )}

          {normalBadges.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-widest uppercase mb-8 flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-3">
                <Award className="w-5 h-5 text-blue-500" /> Emblemas
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-x-4 sm:gap-x-8 gap-y-12">
                {normalBadges.map((badge, index) => renderBadge(badge, index))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
