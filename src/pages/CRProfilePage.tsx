import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Star, Target, Crown, Swords, Gem, Gift, Shield, Zap, Lock, Unlock, TrendingUp, Layers, AlertCircle, RefreshCw, Save, Search, Loader2, Check, Bookmark, Trash2, LayoutGrid, Settings, UserRound, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';

interface GamePageProps {
  activeProfileId?: string;
}

export default function CRProfilePage({ activeProfileId }: GamePageProps) {
  const [playerTag, setPlayerTag] = useState(() => localStorage.getItem('cr_player_tag') || '');
  const [inputTag, setInputTag] = useState(playerTag);
  const [searchInput, setSearchInput] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSavedTagsOpen, setIsSavedTagsOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [savedTags, setSavedTags] = useState<{id: string, tag: string, name?: string, game?: string}[]>([]);
  const [isSavingTag, setIsSavingTag] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showDebug, setShowDebug] = useState(false);
  
  const [playerData, setPlayerData] = useState<any>(null);
  const [chestsData, setChestsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPlayerData = async (tagToFetch: string) => {
    if (!tagToFetch) return;
    setLoading(true);
    setError('');
    try {
      const cleanTag = tagToFetch.replace(/^#/, '');
      
      const [playerRes, chestsRes] = await Promise.all([
        fetch(`/api/clash-royale/player/${cleanTag}`),
        fetch(`/api/clash-royale/player/${cleanTag}/chests`)
      ]);

      let pData;
      let errMessage = 'Failed to fetch player data';
      if (!playerRes.ok) {
        let rawText = '';
        try {
           rawText = await playerRes.text();
           const errData = JSON.parse(rawText);
           errMessage = errData.error || errMessage;
           if (errMessage === 'notFound' || errData.reason === 'notFound') {
               errMessage = 'Jogador não encontrado. Verifique se a tag está correta.';
           }
           if (errMessage === 'accessDenied.invalidIp' || (errData.message && errData.message.includes('API key does not allow access from IP'))) {
               const ipMatch = (errData.message || '').match(/IP ([\d\.]+)/);
               const ip = ipMatch ? ipMatch[1] : '45.79.218.79 (RoyaleAPI Proxy)';
               errMessage = `Sua chave (API Key) não permite acesso deste IP. Para usar o proxy da RoyaleAPI, você DEVE ir ao portal developer.clashroyale.com e criar uma nova chave com o IP exato: ${ip}`;
           }
        } catch(e) {
           errMessage = `API error ${playerRes.status} (non-JSON response): ${rawText.substring(0, 100)}`;
        }
        throw new Error(errMessage);
      }

      try {
        pData = await playerRes.json();
      } catch(e) {
        throw new Error("Invalid response from server (not JSON).");
      }
      
      let cData = null;
      if (chestsRes.ok) {
        try {
          cData = await chestsRes.json();
        } catch(e) {}
      }

      setPlayerData(pData);
      setChestsData(cData);
      
      // Auto-update saved tag with name if it is currently unknown
      if (pData?.name && activeProfileId) {
        setSavedTags(prev => {
          const tagIndex = prev.findIndex(t => t.tag.replace(/^#/, '') === cleanTag && !t.name);
          if (tagIndex !== -1) {
            // Found a matching tag with no name. Update it in DB in background.
            supabase.from('saved_tags')
              .update({ name: pData.name, game: 'clash_royale' })
              .eq('id', prev[tagIndex].id)
              .then(() => console.log('Updated missing name for tag', cleanTag));
             
            // Return updated state 
            const newTags = [...prev];
            newTags[tagIndex] = { ...newTags[tagIndex], name: pData.name, game: 'clash_royale' };
            return newTags;
          }
          return prev;
        });
      }

    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
         setError('Servidor indisponível ou falha de conexão. Tente novamente.');
      } else {
         setError(err.message || 'Houve um erro ao buscar os dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSavedTagsOpen(false);
        setIsActionsMenuOpen(false);
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadSavedTags() {
      if (!activeProfileId) return;
      try {
        const { data, error } = await supabase
          .from('saved_tags')
          .select('id, tag, name, game')
          .eq('profile_id', activeProfileId)
          .or('game.eq.clash_royale,game.is.null')
          .order('created_at', { ascending: false });
          
        if (data) {
          setSavedTags(data);
          if (data.length > 0 && !localStorage.getItem('cr_player_tag')) {
            setPlayerTag(data[0].tag);
            localStorage.setItem('cr_player_tag', data[0].tag);
          }
        }
      } catch (e) {
        console.error("Error loading saved tags from supabase", e);
      }
    }
    loadSavedTags();
  }, [activeProfileId]);

  useEffect(() => {
    if (playerTag) {
      fetchPlayerData(playerTag);
    }
  }, [playerTag]);

  const saveTagToSupabase = async (tag: string, name?: string, game: string = 'clash_royale') => {
    if (!activeProfileId) return;
    
    // Já salvo?
    if (savedTags.some(t => t.tag === tag)) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    setSaveStatus('saving');
    try {
      const { data, error } = await supabase
        .from('saved_tags')
        .insert({ profile_id: activeProfileId, tag: tag, name: name || null, game: game })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        setSavedTags(prev => [data, ...prev]);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      console.error("Failed to save to supabase", e);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = inputTag.trim();
    if (!cleanTag) return;
    
    localStorage.setItem('cr_player_tag', cleanTag);
    setPlayerTag(cleanTag);
    await saveTagToSupabase(cleanTag);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = searchInput.trim().toUpperCase();
    if (!cleanTag) return;
    
    setSearchInput('');
    setIsSearchOpen(false);
    localStorage.setItem('cr_player_tag', cleanTag);
    if (cleanTag === playerTag) {
      fetchPlayerData(cleanTag);
    } else {
      setPlayerTag(cleanTag);
    }
  };

  const handleSelectSavedTag = (tag: string) => {
    if (tag === playerTag) {
      fetchPlayerData(tag);
    } else {
      setPlayerTag(tag);
    }
    localStorage.setItem('cr_player_tag', tag);
    setIsSavedTagsOpen(false);
  };

  const handleDeleteSavedTag = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await supabase.from('saved_tags').delete().eq('id', id);
      setSavedTags(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error('Error deleting tag', e);
    }
  };

  const handleClearTag = async () => {
    localStorage.removeItem('cr_player_tag');
    setPlayerTag('');
    setPlayerData(null);
    setChestsData(null);
    setInputTag('');
  };

  if (!activeProfileId) return null;

  // Mock data for the Clash Royale inspired dashboard
  const kingLevel = playerData ? playerData.expLevel : 8;
  
  const trophies = playerData ? playerData.trophies : 0;
  const maxTrophies = playerData ? playerData.bestTrophies : 0;
  const arenaName = playerData && playerData.arena ? playerData.arena.name : "Arena";
  
  // Rota das Lendas (Path of Legends)
  const getLeagueName = (leagueNum: number | undefined) => {
    if (!leagueNum) return "-";
    const leagues = [
      "Não Ranqueado",
      "Desafiante I",
      "Desafiante II",
      "Desafiante III",
      "Mestre I",
      "Mestre II",
      "Mestre III",
      "Campeão",
      "Gr. Campeão",
      "Camp. Real",
      "C. Definitivo"
    ];
    return leagues[leagueNum] || `Liga ${leagueNum}`;
  };

  const currentPoL = playerData?.currentPathOfLegendSeasonResult?.leagueNumber;
  const bestPoL = playerData?.bestPathOfLegendSeasonResult?.leagueNumber;
  
  const currentLeagueName = currentPoL ? getLeagueName(currentPoL) : (playerData?.leagueStatistics?.currentSeason ? "Liga" : "-");
  const bestLeagueName = bestPoL ? getLeagueName(bestPoL) : (playerData?.leagueStatistics?.bestSeason ? "Liga" : "-");

  // Combinações Táticas (AutoChess) - Buscar dinamicamente
  let autoChessData = null;
  if (playerData?.progress) {
    // Procura por qualquer chave dentro de progress que contenha "AutoChess" (ex: "AutoChess_2026_Season_8")
    const autoChessKey = Object.keys(playerData.progress).find(key => key.toLowerCase().includes('autochess'));
    if (autoChessKey) {
      autoChessData = playerData.progress[autoChessKey];
    }
  }
  
  const autoChessTrophies = autoChessData?.trophies ?? "?";
  const autoChessArena = autoChessData?.arena?.name ?? "Não Ranqueado";
  
  // Função para derivar o número real da arena
  const getArenaNumber = () => {
    if (!playerData) return "?";
    
    // Se a API mandar o número no nome
    const nameMatch = arenaName.match(/Arena\s+(\d+)/i);
    if (nameMatch) return nameMatch[1];
    
    // Mapeamento por ID específico (Ex: 54000117 no novo update) ou por Nome
    const aId = playerData?.arena?.id;
    const nm = arenaName.toLowerCase();
    
    if (aId === 54000117 || nm.includes("lumberlove")) return "25";
    
    // Fallback pelas faixas de troféus (Aproximação do Trophy Road)
    const t = playerData.trophies || 0;
    if (t >= 10000) return "25";
    if (t >= 9500) return "24";
    if (t >= 9000) return "23";
    if (t >= 8500) return "22";
    if (t >= 8000) return "21";
    if (t >= 7500) return "20";
    if (t >= 7000) return "19";
    if (t >= 6500) return "18";
    if (t >= 6000) return "17";
    if (t >= 5500) return "16";
    if (t >= 5000) return "15";
    if (t >= 4600) return "14";
    if (t >= 4200) return "13";
    if (t >= 3800) return "12";
    if (t >= 3400) return "11";
    if (t >= 3000) return "10";
    if (t >= 2600) return "9";
    if (t >= 2300) return "8";
    if (t >= 2000) return "7";
    if (t >= 1600) return "6";
    if (t >= 1300) return "5";
    if (t >= 1000) return "4";
    if (t >= 600) return "3";
    if (t >= 300) return "2";
    return "1";
  };
  
  const formattedArenaNumber = getArenaNumber();
  
  const gems = 0; // Not available via Player Profile
  const gold = 0; // Not available via Player Profile
  const playerName = playerData ? playerData.name : "Carregando...";
  const clanName = playerData && playerData.clan ? playerData.clan.name : "Nenhum clã";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 text-[#0F172A] dark:text-white font-sans">
      
      {/* TOP ACTIONS BAR ALWAYS RENDERED */}
      <div className="flex justify-between items-center px-2 h-12 relative z-30 gap-2" ref={dropdownRef}>
        <div className={`items-center min-w-0 flex-shrink ${isActionsMenuOpen ? 'hidden sm:flex' : 'flex'}`}>
          <span className="font-extrabold text-[#3B82F6] tracking-tight uppercase truncate">Bem Vindo ao Clash Royale</span>
        </div>
        
        <div className="flex items-center gap-2 relative flex-shrink-0">
          
          <AnimatePresence mode="popLayout">
            {isActionsMenuOpen ? (
              <motion.div 
                key="expanded-actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-white dark:bg-[#1E293B]/80 backdrop-blur-md p-1 rounded-full border border-slate-200 dark:border-[#334155] shadow-lg pr-2"
              >
                {/* 1. SEARCH */}
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex bg-white dark:bg-[#1E293B] rounded-full border border-slate-200 dark:border-[#334155] shadow-sm overflow-hidden h-9 transition-all">
                    <input 
                      autoFocus
                      value={searchInput} 
                      onChange={e => setSearchInput(e.target.value)} 
                      placeholder="Tag..."
                      className="px-3 py-1 text-xs font-black uppercase text-slate-700 dark:text-slate-300 focus:outline-none w-24 sm:w-32 placeholder-slate-400"
                    />
                    <button type="button" onClick={() => setIsSearchOpen(false)} className="px-2 hover:bg-slate-100 dark:bg-[#334155] text-slate-400 transition-colors">
                      <X size={12} />
                    </button>
                    <button type="submit" className="bg-[#3B82F6] text-white px-3 hover:bg-[#2563EB] transition-colors border-l border-[#2563EB]">
                      <Search size={14} />
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:bg-[#0F172A]/50 border border-slate-100 dark:border-[#334155] text-slate-600 dark:text-slate-400 rounded-full h-9 w-9 flex items-center justify-center transition-colors"
                    title="Buscar outra Tag"
                  >
                    <Search size={16} />
                  </button>
                )}

                {/* 2. SAVE TAG */}
                {saveStatus !== 'idle' ? (
                  <div className="flex items-center justify-center text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white dark:bg-[#1E293B] px-3 h-9 rounded-full shadow-sm border border-slate-100 dark:border-[#334155] transition-all">
                    {saveStatus === 'saving' ? <Loader2 size={12} className="animate-spin text-[#3B82F6]"/> : <Check size={12} className="text-green-500"/>}
                  </div>
                ) : (
                  <button 
                    onClick={() => playerTag ? saveTagToSupabase(playerTag, playerData?.name) : null}
                    className={`bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-[#334155] text-slate-600 dark:text-slate-400 rounded-full h-9 w-9 flex items-center justify-center transition-colors ${playerTag ? 'hover:bg-slate-50 dark:bg-[#0F172A]/50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    title="Salvar na Nuvem"
                    disabled={!playerTag}
                  >
                    <Save size={16} className={playerTag ? "text-[#3B82F6]" : "text-slate-400"} />
                  </button>
                )}

                {/* 3. BOOKMARKED TAGS */}
                <div className="relative">
                  <button 
                    onClick={() => setIsSavedTagsOpen(!isSavedTagsOpen)}
                    className={`bg-white dark:bg-[#1E293B] border rounded-full h-9 w-9 flex items-center justify-center transition-colors ${
                      isSavedTagsOpen ? 'border-[#3B82F6] text-[#3B82F6]' : 'border-slate-100 dark:border-[#334155] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#0F172A]/50'
                    }`}
                    title="Minhas Contas"
                  >
                    <Bookmark size={16} />
                  </button>
                  
                  {isSavedTagsOpen && (
                    <div className="absolute right-0 top-11 w-64 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-slate-200 dark:border-[#334155] overflow-hidden z-40 py-2">
                       <div className="px-4 py-2 bg-slate-50 dark:bg-[#0F172A]/50 border-b border-slate-100 dark:border-[#334155] mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Contas ({savedTags.length})</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {savedTags.length === 0 ? (
                          <div className="px-4 py-4 text-[10px] text-slate-400 font-bold uppercase text-center tracking-widest opacity-60">Vazio</div>
                        ) : (
                          savedTags.map(tagObj => (
                            <div key={tagObj.id} onClick={() => handleSelectSavedTag(tagObj.tag)} className="group flex gap-2 w-full justify-between items-center px-4 py-2.5 hover:bg-slate-50 dark:bg-slate-800/50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                              <div className="flex flex-col gap-0.5">
                                <span className={`text-sm font-black uppercase tracking-tight ${playerTag === tagObj.tag ? 'text-[#3B82F6]' : 'text-slate-800 dark:text-slate-200'}`}>{tagObj.name || 'Desconhecido'}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-bold uppercase tracking-widest ${playerTag === tagObj.tag ? 'text-[#3B82F6]/70' : 'text-slate-400'}`}>#{tagObj.tag}</span>
                                  {tagObj.game === 'clash_royale' && (
                                    <span className="text-[8px] px-1.5 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] rounded-sm font-black uppercase tracking-wider">CR</span>
                                  )}
                                </div>
                              </div>
                              <Trash2 size={14} className="text-slate-300 hover:text-red-500 transition-colors" onClick={(e) => handleDeleteSavedTag(tagObj.id, e)} />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. SWITCH ACCOUNT */}
                <button 
                  onClick={handleClearTag}
                  className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-[#334155] text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full h-9 w-9 flex items-center justify-center transition-colors"
                  title="Sair / Trocar Conta"
                >
                  <UserRound size={16} />
                </button>

                {/* 5. REFRESH */}
                <button 
                  onClick={() => playerTag ? fetchPlayerData(playerTag) : null} 
                  className={`bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-[#334155] rounded-full h-9 w-9 flex items-center justify-center transition-colors ${playerTag ? 'hover:bg-slate-50 dark:bg-[#0F172A]/50 text-slate-600 dark:text-slate-400 cursor-pointer' : 'opacity-50 text-slate-400 cursor-not-allowed'}`}
                  title="Atualizar"
                  disabled={!playerTag}
                >
                  <RefreshCw size={16} className={loading && playerTag ? "animate-spin text-[#3B82F6]" : ""} />
                </button>

                <div className="w-px h-6 bg-slate-200 mx-1"></div>

                {/* CLOSE TOGGLE */}
                <button 
                  onClick={() => setIsActionsMenuOpen(false)}
                  className="bg-slate-100 dark:bg-[#334155] text-slate-400 hover:bg-slate-200 rounded-full h-8 w-8 flex items-center justify-center transition-colors"
                >
                  <X size={14} />
                </button>

              </motion.div>
            ) : (
              <motion.button 
                key="settings-toggle"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsActionsMenuOpen(true)}
                className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-slate-400 rounded-full h-10 w-10 flex items-center justify-center shadow-sm hover:bg-slate-50 dark:bg-[#0F172A]/50 transition-colors"
                title="Configurações e Ações"
              >
                <Settings size={20} className="hover:rotate-45 transition-transform duration-300" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CONDITIONAL RENDER AREA */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#3B82F6]">
          <RefreshCw size={48} className="animate-spin mb-4" />
          <p className="font-bold uppercase tracking-wider text-sm opacity-80 italic">Carregando dados da arena...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-4 border-red-200 rounded-[32px] p-10 text-center text-red-600 max-w-2xl mx-auto mt-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 opacity-20"></div>
          <AlertCircle size={56} className="mx-auto mb-6 text-red-500 drop-shadow-sm" />
          <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter italic">Falha na Conexão</h3>
          <p className="font-bold mb-8 opacity-70 text-sm max-w-md mx-auto leading-relaxed">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => fetchPlayerData(playerTag)} className="px-8 py-3 bg-white dark:bg-[#1E293B] border-2 border-red-200 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all uppercase tracking-widest text-xs shadow-sm">
              Tentar Novamente
            </button>
            <button onClick={handleClearTag} className="px-8 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all uppercase tracking-widest text-xs shadow-md">
              Limpar Tag
            </button>
          </div>
        </div>
      ) : (!playerTag || (!playerData && !loading && !error)) ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 font-sans relative">
          
          {/* BACKGROUND ELEMENTS */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6] opacity-[0.03] blur-[120px] rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#FBBF24] opacity-[0.02] blur-[100px] rounded-full"></div>
          </div>

          <div className="relative z-10 w-full max-w-2xl">
            <div className="bg-white dark:bg-[#1E293B] rounded-[40px] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-[#334155] overflow-hidden group">
              <div className="bg-gradient-to-br from-white to-slate-50/50 p-10 flex flex-col items-center text-center rounded-[36px]">
                
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-[#3B82F6]/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                  <div className="relative bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] dark:from-slate-700 dark:to-slate-800 p-6 rounded-[28px] shadow-xl border-4 border-white dark:border-slate-600 transform hover:scale-105 transition-transform duration-500 group-hover:rotate-3">
                    <Shield size={64} className="text-[#FBBF24] fill-[#FBBF24] drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] animate-bounce-slow" />
                  </div>
                </div>

                <h2 className="text-4xl font-black text-[#0F172A] dark:text-white tracking-tighter uppercase mb-4 italic leading-none drop-shadow-sm">
                  Vincular<br/>
                  <span className="text-[#3B82F6]">Clash Royale</span>
                </h2>
                
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-8 leading-relaxed font-bold uppercase tracking-wider opacity-80 max-w-sm">
                  Acesse suas conquistas, baús e estatísticas em tempo real informando sua ID de jogador.
                </p>

                <div className="w-full space-y-4">
                   <div 
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full bg-[#f8fafc] border-2 border-dashed border-slate-200 dark:border-[#334155] hover:border-[#3B82F6] hover:bg-blue-50/30 rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center gap-2 group/search"
                   >
                     <div className="bg-white dark:bg-[#1E293B] rounded-full p-3 shadow-sm border border-slate-100 dark:border-[#334155] group-hover/search:scale-110 transition-transform">
                        <Search size={24} className="text-[#3B82F6]" />
                     </div>
                     <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover/search:text-[#3B82F6]">Clique na lupa acima para buscar sua tag</span>
                   </div>

                   {savedTags.length > 0 && (
                     <div className="pt-4 w-full">
                       <div className="flex items-center gap-4 mb-6">
                         <div className="h-px bg-slate-200 flex-1"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Ou escolha uma salva</span>
                         <div className="h-px bg-slate-200 flex-1"></div>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {savedTags.slice(0, 4).map(tagObj => (
                           <button 
                             key={tagObj.id}
                             onClick={() => handleSelectSavedTag(tagObj.tag)}
                             className="bg-white dark:bg-[#1E293B] border-2 border-slate-100 dark:border-[#334155] hover:border-[#FBBF24] hover:bg-amber-50/30 rounded-2xl p-4 flex items-center justify-between group/tag transition-all shadow-sm active:scale-95"
                           >
                             <div className="flex items-center gap-3">
                               <div className="bg-amber-100 p-2 rounded-lg group-hover/tag:bg-amber-500 transition-colors">
                                 <Bookmark size={14} className="text-amber-600 group-hover/tag:text-white" />
                               </div>
                               <span className="font-black text-[#0F172A] dark:text-white tracking-wider uppercase text-sm">#{tagObj.tag}</span>
                             </div>
                             <div className="h-2 w-2 rounded-full bg-[#10B981] opacity-0 group-hover/tag:opacity-100 transition-opacity"></div>
                           </button>
                         ))}
                       </div>
                       
                       {savedTags.length > 4 && (
                         <button 
                          onClick={() => setIsSavedTagsOpen(true)}
                          className="mt-4 text-[10px] font-black uppercase text-slate-400 hover:text-[#3B82F6] transition-colors tracking-widest underline underline-offset-4"
                         >
                            Ver mais {savedTags.length - 4} tags
                         </button>
                       )}
                     </div>
                   )}
                </div>

                <div className="mt-12 w-full pt-8 border-t border-slate-100 dark:border-[#334155]">
                  <div className="bg-slate-900 rounded-3xl p-6 text-left relative overflow-hidden shadow-xl border border-slate-800">
                    <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12">
                       <Gamepad2 size={120} className="text-white" />
                    </div>
                    <div className="relative z-10">
                      <span className="inline-block bg-[#3B82F6] text-white text-[10px] font-black px-2 py-0.5 rounded-md mb-3 uppercase tracking-widest">Tutorial Rápido</span>
                      <h4 className="text-white text-lg font-black uppercase tracking-tight italic mb-2">Onde está minha Tag?</h4>
                      <p className="text-slate-400 text-xs font-bold leading-relaxed">
                        Abra o Clash Royale &gt; Toque no seu nome no menu inicial &gt; Copie a <span className="text-white">Player Tag</span> (ex: <span className="text-[#FBBF24]">#2VQL...</span>) logo abaixo do seu nome de usuário.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>


      {/* HEADER / PLAYER PROFILE */}
      <div className="relative bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] dark:from-slate-800 dark:to-slate-900 p-6 rounded-[24px] shadow-xl border-4 border-[#1E3A8A] dark:border-slate-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col xl:flex-row items-center gap-5 text-center xl:text-left w-full xl:w-auto">
            {/* KING LEVEL SHIELD */}
            <div className="relative flex-shrink-0">
              <div 
                className="h-20 w-20 bg-[#F59E0B] flex items-center justify-center shadow-2xl relative p-1" 
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              >
                <div 
                  className="w-full h-full bg-[#1E40AF] relative flex items-center justify-center overflow-hidden"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  {/* Efeito de Raios (Sunburst) Estilo Supercell */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{ 
                      background: 'conic-gradient(from 0deg, transparent 0%, white 5%, transparent 10%, white 15%, transparent 20%, white 25%, transparent 30%, white 35%, transparent 40%, white 45%, transparent 50%, white 55%, transparent 60%, white 65%, transparent 70%, white 75%, transparent 80%, white 85%, transparent 90%, white 95%, transparent 100%)'
                    }}
                  ></div>
                  
                  {/* Brilho Central */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-blue-400/40"></div>
                  
                  {/* Numero do Nível - Ajuste de compensação visual para o itálico */}
                  <span className="relative z-10 text-white text-4xl font-black drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] italic tracking-tighter leading-none -translate-y-[1px] pr-1.5 transition-transform">{kingLevel}</span>
                </div>
              </div>
              {/* Brilho externo no topo do hexágono */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-white dark:bg-[#1E293B]/20 blur-[2px] rounded-full"></div>
            </div>
            
            <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic drop-shadow-md text-white leading-none mb-1">{playerName}</h2>
              <div className="flex items-center justify-center xl:justify-start gap-2 w-fit mt-1">
                <Shield size={12} className="text-[#94A3B8] fill-[#94A3B8]" />
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">{clanName}</span>
              </div>
              
              {/* ARENA INFO */}
              <div className="flex flex-col items-center xl:items-start mt-2 w-fit gap-0.5">
                 <span className="text-[11px] font-black text-[#FBBF24] uppercase tracking-widest leading-none">Arena {formattedArenaNumber}</span>
                 <span className="text-xs font-black text-white italic tracking-wide truncate max-w-[200px] leading-none">{arenaName}</span>
              </div>
            </div>
          </div>
          
          {/* TROPHIES CARDS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start xl:justify-end gap-3 w-full xl:w-auto">
            {/* CARD 1 */}
            <div className="flex flex-col items-center bg-black/30 rounded-2xl p-4 pt-3 border border-white dark:border-slate-600/10 shadow-inner w-full sm:flex-1 xl:flex-none xl:w-auto min-w-[180px] flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#93C5FD] mb-2 drop-shadow-sm">Caminho de Troféus</span>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={28} className="text-[#F59E0B] fill-[#F59E0B] drop-shadow-lg" />
                <span className="text-3xl font-black text-white drop-shadow-md">{trophies}</span>
              </div>
              <div className="text-sm font-bold text-[#FBBF24] uppercase tracking-wider mb-2">Troféus</div>
              <div className="w-full flex flex-col items-center border-t border-white dark:border-slate-600/10 pt-2 pb-1">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Máximo de Troféus</span>
                <span className="text-sm font-black text-[#FBBF24] mt-0.5">{maxTrophies}</span>
              </div>
            </div>
            
            {/* CARD 2 - Rota das Lendas */}
            <div className="flex flex-col items-center bg-black/30 rounded-2xl p-4 pt-3 border border-white dark:border-slate-600/10 shadow-inner w-full sm:flex-1 xl:flex-none xl:w-auto min-w-[180px] flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C084FC] mb-2 drop-shadow-sm">Rota das Lendas</span>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={24} className="text-[#A855F7] fill-[#A855F7] drop-shadow-lg" />
                <span className="text-xl font-black text-white drop-shadow-md truncate max-w-[140px] text-center" title={currentLeagueName}>{currentLeagueName}</span>
              </div>
              <div className="text-sm font-bold text-[#D8B4FE] uppercase tracking-wider mb-2">Liga Atual</div>
              <div className="w-full flex flex-col items-center border-t border-white dark:border-slate-600/10 pt-2 pb-1">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Maior Liga</span>
                <span className="text-sm font-black text-[#D8B4FE] mt-0.5 truncate max-w-[150px]">{bestLeagueName}</span>
              </div>
            </div>
            
            {/* CARD 3 - Combinações Táticas */}
            <div className="flex flex-col items-center bg-black/30 rounded-2xl p-4 pt-3 border border-white dark:border-slate-600/10 shadow-inner w-full sm:flex-1 xl:flex-none xl:w-auto min-w-[180px] flex-shrink-0 opacity-90">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6EE7B7] mb-2 drop-shadow-sm text-center">Combinações Táticas</span>
              <div className="flex items-center gap-2 mb-1">
                <Swords size={26} className="text-[#10B981] drop-shadow-lg" />
                <span className="text-2xl font-black text-white drop-shadow-md">{autoChessTrophies}</span>
              </div>
              <div className="text-[11px] font-bold text-[#6EE7B7] uppercase tracking-wider mb-2">Pontos</div>
              <div className="w-full flex flex-col items-center border-t border-white dark:border-slate-600/10 pt-2 pb-1">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest text-center">Ranque Atual</span>
                <span className="text-sm font-black text-[#6EE7B7] mt-0.5 max-w-[150px] truncate text-center" title={autoChessArena}>{autoChessArena}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PLAYER STATS BLOCK */}
          <div className="bg-white dark:bg-[#1E293B] rounded-[24px] border-4 border-slate-200 dark:border-[#334155] p-8 shadow-sm relative overflow-hidden flex flex-col items-start justify-center gap-6">
            <div className="absolute inset-0 opacity-5 bg-[#3B82F6]" style={{ backgroundImage: 'radial-gradient(#CBD5E1 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide relative z-10 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#3B82F6]" />
              Estatísticas Royale
            </h3>

            <div className="relative z-10 flex flex-col sm:flex-row w-full gap-8 justify-between">
              
              <div className="flex flex-col gap-6 w-full xl:w-2/3">
                <div className="flex gap-2 sm:gap-8 justify-between sm:justify-start">
                  <div className="flex flex-col items-start flex-1 sm:w-1/3 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate w-full text-left">Vitórias</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#10B981] drop-shadow-sm truncate w-full text-left">{playerData ? playerData.wins : 0}</span>
                  </div>
                  <div className="flex flex-col items-start flex-1 sm:w-1/3 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate w-full text-left">Derrotas</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#EF4444] drop-shadow-sm truncate w-full text-left">{playerData ? playerData.losses : 0}</span>
                  </div>
                  <div className="flex flex-col items-start flex-1 sm:w-1/3 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 whitespace-nowrap overflow-hidden text-ellipsis w-full text-left">3 Coroas</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#F59E0B] drop-shadow-sm truncate w-full text-left">{playerData ? playerData.threeCrownWins : 0}</span>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-8 justify-between sm:justify-start">
                   <div className="flex flex-col items-start flex-1 sm:w-1/3 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate w-full text-left">Taxa de Vitórias</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-700 dark:text-slate-300 drop-shadow-sm truncate w-full text-left">
                      {playerData && (playerData.wins + playerData.losses > 0) ? ((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex flex-col items-start flex-1 sm:w-1/3 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate w-full text-left">Total Doações</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-700 dark:text-slate-300 drop-shadow-sm truncate w-full text-left">{playerData ? playerData.totalDonations : 0}</span>
                  </div>
                  <div className="hidden sm:block sm:w-1/3"></div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-full sm:w-1/3 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-[#334155] pt-6 sm:pt-0 sm:pl-6">
                {playerData ? (
                  <div className="flex flex-col items-center w-full">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Carta Favorita</span>
                    <div className="bg-slate-50 dark:bg-[#0F172A]/50 border-2 border-slate-200 dark:border-[#334155] rounded-xl p-4 w-full flex justify-center shadow-inner">
                      <img src={playerData.currentFavouriteCard?.iconUrls?.medium || "https://api-assets.clashroyale.com/cards/300/Tex1C48UTq9FKtAX-3tzG0FJmc9jzncUZG3bb5Vf-Ds.png"} alt={playerData.currentFavouriteCard?.name || "Desconhecido"} className="h-24 w-auto object-contain drop-shadow-md hover:scale-110 transition-transform" title={playerData.currentFavouriteCard?.name || "Desconhecido"} />
                    </div>
                  </div>
                ) : (
                   <div className="flex flex-col items-center justify-center h-full w-full">
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sem carta</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - CARDS/DECK */}
        <div className="space-y-6">
          <div className="bg-[#1E293B] rounded-[24px] border-4 border-slate-700 p-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Layers size={100} className="text-white" />
             </div>
             
             <div className="flex items-center justify-between mb-5 relative z-10">
               <h3 className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Swords size={20} className="text-[#3B82F6]" />
                  Meu Deck
               </h3>
               {playerData?.currentDeck && (
                 <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 shadow-sm">
                    <svg viewBox="0 0 100 130" className="w-3 h-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                      <path d="M50 0 C50 0 100 40 100 80 C100 107.6 77.6 130 50 130 C22.4 130 0 107.6 0 80 C0 40 50 0 50 0 Z" fill="url(#pink-gradient-deck-avg)" stroke="white" strokeWidth="8" />
                      <defs>
                        <linearGradient id="pink-gradient-deck-avg" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f472b6" />
                          <stop offset="100%" stopColor="#db2777" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-sm font-black text-white">{ (playerData.currentDeck.reduce((acc: number, c: any) => acc + (c.elixirCost || 0), 0) / Math.max(1, playerData.currentDeck.filter((c:any)=>c.elixirCost!==undefined).length)).toFixed(1).replace('.', ',') }</span>
                 </div>
               )}
             </div>

             <div className="grid grid-cols-4 gap-3 relative z-10">
               
               {playerData?.currentDeck?.map((card: any, index: number) => {
                  const allowEvo = index === 0 || index === 2;
                  const allowHero = index === 1 || index === 2;

                  const isEvoSelected = card.evolutionLevel === 1;
                  const isHeroSelected = card.evolutionLevel === 2;

                  const hasEvoImage = !!card.iconUrls?.evolutionMedium;
                  const hasHeroImage = !!card.iconUrls?.heroMedium;

                  const isEvoActivated = allowEvo && isEvoSelected && hasEvoImage;
                  const isHeroActivated = allowHero && isHeroSelected && hasHeroImage;

                  const imageUrl = isHeroActivated 
                    ? card.iconUrls.heroMedium 
                    : isEvoActivated
                      ? card.iconUrls.evolutionMedium 
                      : card.iconUrls.medium;

                  return (
                    <div key={index} className={`aspect-[3/4] relative flex flex-col items-center justify-center transition-transform hover:scale-105 ${isEvoActivated ? 'drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]' : ''}`}>
                      <img 
                        src={imageUrl} 
                        alt={card.name} 
                        className="w-full h-full object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" 
                      />
                      
                      {/* ELIXIR COST DROP */}
                      {card.elixirCost !== undefined && (
                        <div className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 z-20 flex items-center justify-center">
                          <div className="relative w-4 h-[1.125rem] sm:w-6 sm:h-7 flex items-center justify-center">
                            <svg
                              viewBox="0 0 100 130"
                              className="absolute inset-0 w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                            >
                              <path
                                d="M50 0 C50 0 100 40 100 80 C100 107.6 77.6 130 50 130 C22.4 130 0 107.6 0 80 C0 40 50 0 50 0 Z"
                                fill="url(#pink-gradient-deck)"
                                stroke="white"
                                strokeWidth="8"
                              />
                              <defs>
                                <linearGradient
                                  id="pink-gradient-deck"
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
                            <span className="relative z-10 text-[9px] sm:text-[11px] font-black text-white drop-shadow-md leading-none pt-[1px] sm:pt-1">
                              {card.elixirCost}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* LEVEL BADGE */}
                      <div className="absolute -bottom-1 sm:-bottom-2 z-20 flex flex-col items-center">
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white dark:border-slate-600 shadow-md flex items-center justify-center ${
                          card.rarity === 'common' ? 'bg-slate-400' :
                          card.rarity === 'rare' ? 'bg-amber-500' :
                          card.rarity === 'epic' ? 'bg-purple-500' :
                          card.rarity === 'legendary' ? 'bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-600' :
                          card.rarity === 'champion' ? 'bg-gradient-to-br from-yellow-300 via-amber-500 to-red-500' :
                          'bg-slate-50 dark:bg-slate-800/500'
                        }`}>
                          <span className="text-[8px] sm:text-[10px] font-black text-white drop-shadow-sm leading-none">
                            {card.level && card.maxLevel ? 16 - card.maxLevel + card.level : card.level}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
               })}

               {!playerData?.currentDeck && (
                 <div className="col-span-4 text-center text-slate-400 py-10 opacity-50 font-bold uppercase text-xs">
                   Carregando cartas...
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
      </>
      )}



    </div>
  );
}

// Simple chest icons for demonstration
function PackageIcon({ type }: { type: 'wood' | 'silver' | 'gold' | 'magical' }) {
  const getColors = () => {
    switch (type) {
      case 'gold': return { bg: 'bg-yellow-500', inner: 'bg-yellow-400', lock: 'bg-slate-300' };
      case 'silver': return { bg: 'bg-slate-400', inner: 'bg-slate-300', lock: 'bg-yellow-500' };
      default: return { bg: 'bg-amber-700', inner: 'bg-amber-600', lock: 'bg-slate-300' };
    }
  };
  const colors = getColors();
  
  return (
    <div className={`w-14 h-12 ${colors.bg} rounded-md relative shadow-inner border border-black/20 flex flex-col items-center justify-center`}>
      <div className={`w-12 h-6 ${colors.inner} rounded-t-sm absolute top-0.5 border-b border-black/20`}></div>
      <div className={`w-3 h-4 ${colors.lock} absolute top-4 rounded-sm border border-black/30 shadow-sm flex items-center justify-center`}>
        <div className="w-1 h-1.5 bg-black/40 rounded-full"></div>
      </div>
      <div className="w-full h-1 bg-black/10 absolute bottom-2"></div>
    </div>
  );
}
