import React from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MasteryBadge = ({ level, iconUrl, masteryIconUrl, name, isActive, onClick }: { level: number; iconUrl?: string; masteryIconUrl?: string; name: string; isActive?: boolean; onClick?: (e: React.MouseEvent) => void }) => {
  const isUnlocked = level > 0;
  
  // If the API provides the exact mastery badge image, we just use it directly!
  if (masteryIconUrl) {
    return (
      <div 
        className="relative w-full flex items-center justify-center p-1 cursor-pointer transition-transform duration-300"
        onClick={onClick}
      >
        <img 
          src={masteryIconUrl} 
          alt={`${name} Mastery`} 
          className={`scale-125 w-[180%] sm:w-[200%] md:w-[220%] h-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-[1.4] ${level === 0 ? 'grayscale opacity-60 hover:grayscale-[0.5]' : ''}`} 
        />

        <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-50 flex flex-col items-center bg-slate-900 border border-slate-700 text-white rounded-xl shadow-xl p-3 bottom-[80%] mb-2 w-max min-w-[120px] pointer-events-none"
            >
              <span className="text-xs font-black uppercase text-center mb-1 text-slate-100">{name}</span>
              <div className="w-full h-[1px] bg-slate-700 mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {level === 0 ? 'Não Iniciado (L0)' : `Nível ${level}`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  let ribbonBg = "from-slate-300 to-slate-400";
  let starColor = "text-transparent fill-transparent"; // No stars for lvl 0
  let starCount = 0;

  if (level >= 1 && level <= 3) {
    starColor = "text-amber-600 fill-amber-600"; // Bronze
    starCount = level;
    ribbonBg = "from-blue-600 to-blue-800";
  } else if (level >= 4 && level <= 6) {
    starColor = "text-slate-300 fill-slate-300"; // Silver
    starCount = level - 3;
    ribbonBg = "from-blue-500 to-blue-700";
  } else if (level >= 7 && level <= 9) {
    starColor = "text-yellow-400 fill-yellow-400"; // Gold
    starCount = level - 6;
    ribbonBg = "from-blue-400 to-blue-600";
  } else if (level === 10) {
    starColor = "text-fuchsia-300 fill-fuchsia-300"; // Diamond/Amethyst
    starCount = 1; 
    ribbonBg = "from-purple-500 to-purple-800";
  }

  return (
    <div 
      className={`relative w-full flex flex-col items-center justify-start pt-2 cursor-pointer group-hover:-translate-y-1 transition-transform duration-300 ${level === 0 ? 'grayscale opacity-70 hover:grayscale-[0.5]' : ''}`}
      onClick={onClick}
    >
      {/* Curved Shield SVG Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <svg 
          viewBox="0 0 100 130" 
          preserveAspectRatio="none" 
          className="w-[110%] sm:w-[120%] h-full pt-1"
        >
          <path 
            d="M 5 0 H 95 Q 100 0 100 5 V 80 Q 100 110 50 125 Q 0 110 0 80 V 5 Q 0 0 5 0 Z" 
            fill="url(#shieldGrad)" 
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            className="drop-shadow-md"
          />
          <path 
            d="M 8 3 H 92 Q 97 3 97 8 V 78 Q 97 105 50 119 Q 3 105 3 78 V 8 Q 3 3 8 3 Z" 
            fill="none" 
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Card Image */}
      <div className="relative z-10 w-full px-2 flex-grow flex items-center justify-center pt-3 pb-2">
        <img 
          src={iconUrl} 
          alt={name} 
          className="w-[90%] h-auto object-contain drop-shadow-[0_5px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110" 
        />
      </div>

      {/* Stars Area */}
      <div className="relative z-20 h-5 flex items-center justify-center gap-[1px] pb-2">
        {Array.from({ length: starCount }).map((_, i) => (
          <Star key={i} size={level === 10 ? 18 : 14} className={`drop-shadow-md ${starColor}`} />
        ))}
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 flex flex-col items-center bg-slate-900 border border-slate-700 text-white rounded-xl shadow-xl p-3 bottom-[80%] mb-2 w-max min-w-[120px] pointer-events-none"
          >
            <span className="text-xs font-black uppercase text-center mb-1 text-slate-100">{name}</span>
            <div className="w-full h-[1px] bg-slate-700 mb-2" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {level === 0 ? 'Não Iniciado (L0)' : `Nível ${level}`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Level text indicator */}
      {/* <div className="absolute top-1 left-1 z-20 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5 border border-white/10">
        <span className="text-[9px] font-black text-white leading-none">
          L{level}
        </span>
      </div> */}
    </div>
  );
};
