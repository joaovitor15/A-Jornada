import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Star, Target, Crown, Swords, Gem, Gift, Shield, Zap, Lock, Unlock, TrendingUp, Layers, AlertCircle, RefreshCw, Save, Search, Loader2, Check, Bookmark, Trash2, LayoutGrid, Settings, UserRound, X, Crosshair, Users, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';

interface GamePageProps {
  activeProfileId?: string;
}

export default function BSProfilePage({ activeProfileId }: GamePageProps) {
  const [playerTag, setPlayerTag] = useState(() => localStorage.getItem('bs_player_tag') || '');
  const [inputTag, setInputTag] = useState(playerTag);
  const [searchInput, setSearchInput] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSavedTagsOpen, setIsSavedTagsOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [savedTags, setSavedTags] = useState<{id: string, tag: string, name?: string, game?: string}[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showDebug, setShowDebug] = useState(false);
  
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClearTag = () => {
    setPlayerTag('');
    setInputTag('');
    setSearchInput('');
    setPlayerData(null);
    localStorage.removeItem('bs_player_tag');
    setIsActionsMenuOpen(false);
  };


  // Mock data for development
  const MOCK_DATA = {
    name: "BrawlerPro",
    tag: "A1B2C3D4",
    trophies: 25430,
    highestTrophies: 27500,
    expLevel: 154,
    "3vs3Victories": 4500,
    soloVictories: 1200,
    duoVictories: 850,
    club: {
      name: "Starr Force"
    },
    brawlers: [] // Not showing images for brawlers here
  };

  const fetchPlayerData = async (tagToFetch: string) => {
    if (!tagToFetch) return;
    setLoading(true);
    setError('');
    try {
      const cleanTag = tagToFetch.replace(/^#/, '');
      
      const response = await fetch(`/api/brawl-stars/player/${cleanTag}`);
      let pData;
      let errMessage = 'Failed to fetch player data';
      
      if (!response.ok) {
        let rawText = '';
        try {
           rawText = await response.text();
           const errData = JSON.parse(rawText);
           errMessage = errData.error || errMessage;
           if (errMessage === 'notFound' || errData.reason === 'notFound') {
               errMessage = 'Jogador não encontrado. Verifique se a tag está correta.';
           }
           if (errMessage === 'accessDenied.invalidIp' || errMessage === 'accessDenied.invalidScope' || (errData.message && errData.message.includes('API key does not allow access'))) {
             errMessage = "A Chave API BRAWL_STARS_API_KEY é inválida ou tem restrição de IP. Vá no painel do desenvolvedor do BRAWL STARS e edite/re-crie a sua chave permitindo o acesso ao endereço IP do proxy: 45.79.218.79";
           }
        } catch(e) { errMessage = await response.text() || errMessage; }
        throw new Error(errMessage);
      }
      
      pData = await response.json();
      setPlayerData(pData);
      
      if (pData.name && activeProfileId) {
        setSavedTags(prev => {
          const tagIndex = prev.findIndex(t => t.tag.replace(/^#/, '') === cleanTag && !t.name);
          if (tagIndex !== -1) {
            supabase.from('saved_tags')
              .update({ name: pData.name, game: 'brawl_stars' })
              .eq('id', prev[tagIndex].id)
              .then(() => console.log('Updated missing name for tag', cleanTag));
             
            const newTags = [...prev];
            newTags[tagIndex] = { ...newTags[tagIndex], name: pData.name, game: 'brawl_stars' };
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
    if (playerTag) {
      fetchPlayerData(playerTag);
    }
  }, [playerTag]);

  useEffect(() => {
    const loadSavedTags = async () => {
      if (!activeProfileId) return;
      try {
        const { data, error } = await supabase
          .from('saved_tags')
          .select('id, tag, name, game')
          .eq('profile_id', activeProfileId)
          .eq('game', 'brawl_stars')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setSavedTags(data);
        }
      } catch (err) {
        console.error("Error loading tags", err);
      }
    };
    loadSavedTags();
  }, [activeProfileId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSavedTagsOpen(false);
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveTagToSupabase = async (tag: string, name?: string, game: string = 'brawl_stars') => {
    if (!activeProfileId) return;
    
    if (savedTags.some(t => t.tag.replace(/^#/, '') === tag.replace(/^#/, ''))) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return;
    }
    
    setSaveStatus('saving');
    try {
      const { data, error } = await supabase
        .from('saved_tags')
        .insert({ profile_id: activeProfileId, tag: tag, name: name || null, game: game })
        .select()
        .single();
        
      if (!error && data) {
        setSavedTags(prev => [data, ...prev]);
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    let cleanTag = searchInput.trim().toUpperCase();
    if (cleanTag.startsWith('#')) {
      cleanTag = cleanTag.substring(1);
    }
    
    if (cleanTag === playerTag) {
      fetchPlayerData(cleanTag);
    } else {
      setPlayerTag(cleanTag);
    }
    
    setInputTag(cleanTag);
    setSearchInput('');
    localStorage.setItem('bs_player_tag', cleanTag);
    setIsSearchOpen(false);
  };

  const handleSelectSavedTag = (tag: string) => {
    let cleanTag = tag.trim().toUpperCase();
    if (cleanTag.startsWith('#')) {
      cleanTag = cleanTag.substring(1);
    }
    
    if (cleanTag === playerTag) {
      fetchPlayerData(cleanTag);
    } else {
      setPlayerTag(cleanTag);
    }
    
    setInputTag(cleanTag);
    setSearchInput('');
    localStorage.setItem('bs_player_tag', cleanTag);
    setIsSavedTagsOpen(false);
  };

  const handleDeleteSavedTag = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await supabase.from('saved_tags').delete().eq('id', id);
      setSavedTags(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erro ao deletar tag", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 text-[#0F172A] dark:text-white font-sans">
      
      {/* TOP ACTIONS BAR ALWAYS RENDERED */}
      <div className="flex justify-between items-center px-2 h-12 relative z-30 gap-2" ref={dropdownRef}>
        <div className={`items-center min-w-0 flex-shrink ${isActionsMenuOpen ? 'hidden sm:flex' : 'flex'}`}>
          <span className="font-extrabold text-[#F59E0B] tracking-tight uppercase truncate">Bem Vindo ao Brawl Stars</span>
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
                  <form onSubmit={handleSearch} className="flex bg-white dark:bg-[#1E293B] rounded-full border border-slate-200 dark:border-[#334155] shadow-sm overflow-hidden h-9 transition-all">
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
                    <button type="submit" className="bg-[#F59E0B] text-white px-3 hover:bg-[#D97706] transition-colors border-l border-[#F59E0B]">
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
                    {saveStatus === 'saving' ? <Loader2 size={12} className="animate-spin text-[#F59E0B]"/> : <Check size={12} className="text-green-500"/>}
                  </div>
                ) : (
                  <button 
                    onClick={() => playerTag ? saveTagToSupabase(playerTag, playerData?.name) : null}
                    className={`bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-[#334155] text-slate-600 dark:text-slate-400 rounded-full h-9 w-9 flex items-center justify-center transition-colors ${playerTag ? 'hover:bg-slate-50 dark:bg-[#0F172A]/50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    title="Salvar na Nuvem"
                    disabled={!playerTag}
                  >
                    <Save size={16} className={playerTag ? "text-[#F59E0B]" : "text-slate-400"} />
                  </button>
                )}

                {/* 3. BOOKMARKED TAGS */}
                <div className="relative">
                  <button 
                    onClick={() => setIsSavedTagsOpen(!isSavedTagsOpen)}
                    className={`bg-white dark:bg-[#1E293B] border rounded-full h-9 w-9 flex items-center justify-center transition-colors ${
                      isSavedTagsOpen ? 'border-[#F59E0B] text-[#F59E0B]' : 'border-slate-100 dark:border-[#334155] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#0F172A]/50'
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
                                <span className={`text-sm font-black uppercase tracking-tight ${playerTag === tagObj.tag ? 'text-[#F59E0B]' : 'text-slate-800 dark:text-slate-200'}`}>{tagObj.name || 'Desconhecido'}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-bold uppercase tracking-widest ${playerTag === tagObj.tag ? 'text-[#F59E0B]/70' : 'text-slate-400'}`}>#{tagObj.tag}</span>
                                  {tagObj.game === 'brawl_stars' && (
                                    <span className="text-[8px] px-1.5 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-sm font-black uppercase tracking-wider">BS</span>
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
                  <RefreshCw size={16} className={loading && playerTag ? "animate-spin text-[#F59E0B]" : ""} />
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

      {loading && !playerData ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
           <Loader2 size={40} className="animate-spin text-[#F59E0B] mb-4" />
           <p className="font-bold tracking-widest uppercase text-sm">Carregando dados...</p>
        </div>
      ) : error ? (
         <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl flex flex-col items-center text-center max-w-2xl mx-auto shadow-sm">
          <AlertCircle size={40} className="mb-4 text-red-500 opacity-80" />
          <h3 className="font-bold mb-2">Erro ao carregar dados do jogador</h3>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      ) : !playerTag ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#1E293B] rounded-3xl border-2 border-dashed border-slate-200 dark:border-[#334155] text-center max-w-2xl mx-auto mt-20">
          <Star className="w-16 h-16 text-[#FBBF24] mb-4 opacity-50" />
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-tight">Buscar Perfil</h2>
          <p className="text-slate-500 mb-6 font-medium">Use do menu acima para procurar por uma Tag de Jogador (ex: #J2R...)</p>
        </div>
      ) : playerData ? (
        <>
          {/* HEADER / PLAYER PROFILE */}
          <div className="relative bg-gradient-to-b from-[#F59E0B] to-[#D97706] dark:from-slate-800 dark:to-slate-900 p-6 rounded-[24px] shadow-xl border-4 border-[#B45309] dark:border-slate-700 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
            
            <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-6">
              
              <div className="flex flex-col xl:flex-row items-center gap-5 text-center xl:text-left w-full xl:w-auto">
                {/* EXP LEVEL */}
                <div className="relative flex-shrink-0">
                  <div className="h-20 w-20 bg-[#FCD34D] flex items-center justify-center shadow-2xl relative p-1 rounded-full border-4 border-[#B45309] dark:border-slate-700">
                    <div className="w-full h-full bg-[#1E3A8A] rounded-full relative flex items-center justify-center overflow-hidden">
                      <span className="relative z-10 text-white text-3xl font-black drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] italic tracking-tighter leading-none">{playerData.expLevel}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic drop-shadow-md text-white leading-none mb-1">{playerData.name}</h2>
                  <div className="flex items-center justify-center xl:justify-start gap-2 bg-black/20 rounded-md px-2 py-0.5 w-fit border border-white/5 mt-1">
                    <Users size={12} className="text-white/80" />
                    <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">{playerData.brawlers?.length || 0} Brawlers Desbloqueados</span>
                  </div>
                </div>
              </div>
              
              {/* TROPHIES CARDS */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start xl:justify-end gap-3 w-full xl:w-auto">
                {/* CARD 1 */}
                <div className="flex flex-col items-center bg-black/30 rounded-2xl p-4 pt-3 border border-white/10 shadow-inner w-full sm:flex-1 xl:flex-none xl:w-auto min-w-[180px] flex-shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FCD34D] mb-2 drop-shadow-sm">Troféus</span>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy size={28} className="text-[#FBBF24] fill-[#FBBF24] drop-shadow-lg" />
                    <span className="text-3xl font-black text-white drop-shadow-md">{playerData.trophies}</span>
                  </div>
                  <div className="w-full flex flex-col items-center border-t border-white/10 pt-2 pb-1 mt-2">
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Máximo de Troféus</span>
                    <span className="text-sm font-black text-[#FBBF24] mt-0.5">{playerData.highestTrophies}</span>
                  </div>
                </div>
                
                {/* CARD 2 - 3V3 */}
                <div className="flex flex-col items-center bg-black/30 rounded-2xl p-4 pt-3 border border-white/10 shadow-inner w-full sm:flex-1 xl:flex-none xl:w-auto min-w-[180px] flex-shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#93C5FD] mb-2 drop-shadow-sm">Modo 3v3</span>
                  <div className="flex items-center gap-2 mb-1 mt-2">
                    <Crosshair size={24} className="text-[#3B82F6] drop-shadow-lg" />
                    <span className="text-2xl font-black text-white drop-shadow-md text-center">{playerData["3vs3Victories"] || playerData["3v3Victories"] || 0}</span>
                  </div>
                  <div className="text-sm font-bold text-[#60A5FA] uppercase tracking-wider mb-2 mt-1">Vitórias</div>
                </div>

                {/* CARD 3 - Solo/Duo */}
                 <div className="flex flex-col items-center bg-black/30 rounded-2xl p-4 pt-3 border border-white/10 shadow-inner w-full sm:flex-1 xl:flex-none xl:w-auto min-w-[180px] flex-shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#86EFAC] mb-2 drop-shadow-sm text-center">Combate</span>
                  <div className="flex items-center gap-2 mb-1">
                    <UserRound size={24} className="text-[#22C55E] drop-shadow-lg" />
                    <span className="text-xl font-black text-white drop-shadow-md text-center">{playerData.soloVictories}</span>
                  </div>
                  <div className="w-full flex justify-between px-2 mt-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-black text-[#86EFAC] uppercase tracking-widest">Solo</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{playerData.duoVictories} Duo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* IN-DEPTH STATS BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* TOP BRAWLERS */}
            {playerData.brawlers && playerData.brawlers.length > 0 && (
              <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-[#334155] xl:col-span-1">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]/20" /> Melhores Brawlers
                </h3>
                <div className="space-y-3">
                  {[...playerData.brawlers].sort((a: any, b: any) => b.trophies - a.trophies).slice(0, 3).map((brawler: any, index: number) => (
                    <div key={brawler.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0F172A]/50 rounded-xl border border-slate-100 dark:border-[#334155]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 text-sm border border-slate-300">
                          {index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black uppercase text-slate-800 dark:text-slate-200 leading-tight">{brawler.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nível {brawler.power}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-[#FBBF24]/10 px-2 py-1 rounded-lg text-[#D97706] font-black text-sm border border-[#FBBF24]/20">
                        <Trophy size={12} className="fill-[#FBBF24]" /> {brawler.trophies}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPECIAL EVENTS RECORD */}
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-[#334155]">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-widest uppercase mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-[#8B5CF6]" /> Recordes de Eventos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-[#0F172A]/50 p-4 rounded-2xl border border-slate-100 dark:border-[#334155] flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-2 rounded-full mb-2">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Robô Chefão</span>
                  <span className="font-black text-slate-800 dark:text-slate-200 text-lg">
                    {playerData.bestRoboRumbleTime ? `Nível ${playerData.bestRoboRumbleTime}` : 'N/A'}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-[#0F172A]/50 p-4 rounded-2xl border border-slate-100 dark:border-[#334155] flex flex-col items-center text-center">
                  <div className="bg-red-100 p-2 rounded-full mb-2">
                    <Swords className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Todos Contra Um</span>
                  <span className="font-black text-slate-800 dark:text-slate-200 text-lg">
                    {playerData.bestTimeAsBigBrawler ? `${playerData.bestTimeAsBigBrawler}s` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* PROGRESS & ACCOUNT */}
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-[#334155]">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-widest uppercase mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#3B82F6]" /> Campeonato Mundial
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0F172A]/50 p-3 rounded-xl border border-slate-100 dark:border-[#334155]">
                  <Crown className={`w-8 h-8 ${playerData.isQualifiedFromChampionshipChallenge ? 'text-yellow-500' : 'text-slate-300'}`} />
                  <div className="flex flex-col">
                    <span className="font-black text-slate-700 dark:text-slate-300 uppercase text-xs">Status da Conta</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${playerData.isQualifiedFromChampionshipChallenge ? 'text-green-500' : 'text-slate-400'}`}>
                      {playerData.isQualifiedFromChampionshipChallenge ? 'Qualificado' : 'Não Qualificado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </>
      ) : null}



    </div>
  );
}
