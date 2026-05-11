import React, { useState, useEffect, useMemo } from 'react';
import { Users, Loader2, Trophy, Zap, Flame, Star, Settings, Puzzle, Info, ArrowDownAZ, ArrowDown01, ArrowUp10 } from 'lucide-react';
import { motion } from 'motion/react';

interface GamePageProps {
  activeProfileId?: string;
}

export default function BSBrawlersPage({ activeProfileId }: GamePageProps) {
  const [playerTag, setPlayerTag] = useState(() => localStorage.getItem('bs_player_tag') || '');
  const [brawlers, setBrawlers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('trophies_desc'); // trophies_desc, trophies_asc, name_asc
  
  useEffect(() => {
    if (playerTag) {
      setLoading(true);
      fetch(`/api/brawl-stars/player/${playerTag.replace(/^#/, '')}`)
        .then(res => res.json())
        .then(data => {
            if (data.brawlers) {
                setBrawlers(data.brawlers);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [playerTag]);

  const sortedBrawlers = useMemo(() => {
    return [...brawlers].sort((a, b) => {
      if (sortBy === 'trophies_desc') return b.trophies - a.trophies;
      if (sortBy === 'trophies_asc') return a.trophies - b.trophies;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [brawlers, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 text-[#0F172A] dark:text-white font-sans">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
         <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
           <Users className="text-[#F59E0B]" size={28} />
           Coleção de Brawlers
         </h1>
         {brawlers.length > 0 && (
             <div className="flex items-center gap-3">
               {/* Controls Bar */}
               <div className="flex items-center bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-slate-200 dark:border-[#334155] p-1">
                 <button
                   onClick={() => setSortBy('trophies_desc')}
                   className={`p-2 rounded-lg flex items-center justify-center transition-colors ${sortBy === 'trophies_desc' ? 'bg-[#F59E0B] text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#334155]'}`}
                   title="Mais Troféus"
                 >
                   <ArrowDown01 size={18} />
                 </button>
                 <button
                   onClick={() => setSortBy('trophies_asc')}
                   className={`p-2 rounded-lg flex items-center justify-center transition-colors ${sortBy === 'trophies_asc' ? 'bg-[#F59E0B] text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#334155]'}`}
                   title="Menos Troféus"
                 >
                   <ArrowUp10 size={18} />
                 </button>
                 <button
                   onClick={() => setSortBy('name_asc')}
                   className={`p-2 rounded-lg flex items-center justify-center transition-colors ${sortBy === 'name_asc' ? 'bg-[#F59E0B] text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#334155]'}`}
                   title="Ordem Alfabética"
                 >
                   <ArrowDownAZ size={18} />
                 </button>
               </div>

               {/* Legend / Tooltip */}
               <div className="relative group flex items-center cursor-help bg-slate-100 dark:bg-[#334155] p-2 rounded-full border border-slate-200 dark:border-[#334155] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#475569] transition-colors">
                 <Info size={20} />
                 
                 <div className="absolute left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 top-full mt-2 w-64 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-[#334155] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <h4 className="font-black text-sm uppercase text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-100 dark:border-[#334155] pb-2">Legenda Visual</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center bg-yellow-400/20 px-1.5 py-0.5 rounded text-yellow-500 text-[10px] font-black border border-yellow-400/30 w-8 h-5"><Star size={10} className="fill-yellow-400 mr-0.5"/> 2</div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">Poder de Estrela</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center bg-green-500/20 px-1.5 py-0.5 rounded text-green-500 text-[10px] font-black border border-green-500/30 w-8 h-5"><Puzzle size={10} className="mr-0.5"/> 1</div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">Acessórios</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-500 text-[10px] font-black border border-blue-500/30 w-8 h-5"><Settings size={10} className="mr-0.5"/> 2</div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">Engrenagens</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center bg-fuchsia-500/20 px-1.5 py-0.5 rounded text-fuchsia-500 text-[10px] font-black border border-fuchsia-500/30 w-8 h-5"><Zap size={10} className="fill-fuchsia-400 mr-0.5"/> 1</div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">Hipercarga</span>
                      </div>
                      <div className="flex items-center gap-3 pt-1 border-t border-slate-100 dark:border-[#334155]">
                        <div className="flex items-center justify-center bg-gradient-to-b from-orange-400 to-red-600 rounded text-white text-[10px] font-black border border-orange-300 w-8 h-5 shadow-sm"><Flame size={10} className="fill-yellow-300 text-yellow-300 mr-0.5"/> 5</div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">Vitórias (Máx)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center bg-gradient-to-b from-green-400 to-emerald-600 rounded text-white text-[10px] font-black border border-green-300 w-8 h-5 shadow-sm">W 3</div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">Vitórias (Atual)</span>
                      </div>
                    </div>
                 </div>
               </div>

               <div className="text-sm font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-[#334155] px-3 py-2 rounded-full border border-slate-200 dark:border-[#334155]">
                   {brawlers.length} Brawlers
               </div>
             </div>
         )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
           <Loader2 size={40} className="animate-spin text-[#F59E0B] mb-4" />
           <p className="font-bold tracking-widest uppercase text-sm">Carregando brawlers...</p>
        </div>
      ) : !playerTag ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#1E293B] rounded-3xl border-2 border-dashed border-slate-200 dark:border-[#334155] text-center max-w-2xl mx-auto mt-20">
          <Users className="w-16 h-16 text-[#FBBF24] mb-4 opacity-50" />
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-tight">Buscar Perfil Primeiro</h2>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-6 font-medium">Vá na página de Perfil e busque uma conta para carregar os Brawlers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 z-0">
          {sortedBrawlers.map((brawler, i) => {

            return (
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.5) }}
              key={brawler.id} 
              className="relative bg-gradient-to-b from-blue-500 to-blue-700 dark:from-slate-800 dark:to-slate-900 border border-blue-600 shadow-blue-500/20 p-1 rounded-2xl shadow-lg"
            >
              <div className="bg-white/10 dark:bg-[#0F172A]/40 w-full h-full rounded-xl p-4 flex flex-col items-center relative backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                {brawler.maxWinStreak > 0 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-b from-orange-400 to-red-600 border border-orange-300 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-md z-10" title="Max Win Streak">
                    <Flame size={10} className="fill-yellow-300 text-yellow-300" />
                    {brawler.maxWinStreak}
                  </div>
                )}
                
                {brawler.currentWinStreak > 0 && (
                  <div className="absolute top-2 right-2 bg-gradient-to-b from-green-400 to-emerald-600 border border-green-300 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-md z-10" title="Current Win Streak">
                    W {brawler.currentWinStreak}
                  </div>
                )}

                <h3 className="font-black text-white text-lg tracking-wider uppercase drop-shadow-md mb-1 text-center leading-tight mt-4">{brawler.name}</h3>
                
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 w-full">
                  {brawler.starPowers?.length > 0 && (
                    <div className="flex items-center justify-center gap-0.5 bg-yellow-400/20 px-1.5 py-0.5 rounded text-yellow-300 text-[10px] font-black border border-yellow-400/30 shadow-sm" title="Poderes de Estrela">
                      <Star size={9} className="fill-yellow-400" /> {brawler.starPowers.length}
                    </div>
                  )}
                  {brawler.gadgets?.length > 0 && (
                    <div className="flex items-center gap-0.5 bg-green-500/20 px-1.5 py-0.5 rounded text-green-400 text-[10px] font-black border border-green-500/30 shadow-sm" title="Acessórios (Gadgets)">
                      <Puzzle size={9} /> {brawler.gadgets.length}
                    </div>
                  )}
                  {brawler.gears?.length > 0 && (
                    <div className="flex items-center gap-0.5 bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300 text-[10px] font-black border border-blue-500/30 shadow-sm" title="Engrenagens">
                      <Settings size={9} /> {brawler.gears.length}
                    </div>
                  )}
                  {brawler.hyperCharges?.length > 0 && (
                    <div className="flex items-center gap-0.5 bg-fuchsia-500/20 px-1.5 py-0.5 rounded text-fuchsia-300 text-[10px] font-black border border-fuchsia-500/30 shadow-sm" title="Hipercargas">
                      <Zap size={9} className="fill-fuchsia-400" /> {brawler.hyperCharges.length}
                    </div>
                  )}
                </div>
                
                <div className="w-full flex flex-col gap-1.5 mt-auto">
                  <div className="w-full flex justify-between items-center bg-black/30 rounded-lg px-2 py-1.5 border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Troféus</span>
                    <span className="font-black text-white text-[15px] leading-none flex items-center gap-1"><Trophy size={11} className="text-[#FBBF24]"/> {brawler.trophies || 0}</span>
                  </div>
                  <div className="w-full flex justify-between items-center bg-black/30 rounded-lg px-2 py-1.5 border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Poder</span>
                    <span className="font-black text-[#FCD34D] text-[15px] leading-none flex items-center gap-1"><Zap size={11}/> {brawler.power}</span>
                  </div>
                  <div className="w-full flex justify-between gap-1.5 mt-0.5">
                    <div className="flex-1 flex justify-between items-center bg-black/30 rounded-lg px-2 py-1 border border-white/10">
                      <span className="text-[9px] font-bold uppercase text-white/50">Rank</span>
                      <span className="font-black text-[#A78BFA] text-[13px]">{brawler.rank || 0}</span>
                    </div>
                    <div className="flex-1 flex justify-between items-center bg-black/30 rounded-lg px-2 py-1 border border-white/10">
                      <span className="text-[9px] font-bold uppercase text-white/50">Prest.</span>
                      <span className="font-black text-[#F472B6] text-[13px]">{brawler.prestigeLevel || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )})}
        </div>
      )}
    </div>
  );
}
