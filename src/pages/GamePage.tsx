import React from 'react';
import { Gamepad2, Star, Shield } from 'lucide-react';
import { Page } from '../types';

interface GamePageProps {
  activeProfileId?: string;
  onPageChange: (page: Page) => void;
  onSelectGame: (game: 'cr' | 'bs' | null) => void;
}

export default function GamePage({ activeProfileId, onPageChange, onSelectGame }: GamePageProps) {
  const handleGameSelect = (game: 'cr' | 'bs') => {
    localStorage.setItem('selected_game', game);
    onSelectGame(game);
    if (game === 'cr') {
      onPageChange('cr_profile');
    } else if (game === 'bs') {
      onPageChange('bs_profile');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 text-[#0F172A] font-sans">
      <div className="text-center mt-8 mb-8">
        <h1 className="text-3xl font-black text-[#0F172A] mb-2 uppercase tracking-tight">Selecione o Jogo</h1>
        <p className="text-[#64748B] font-medium">Qual universo vamos gerenciar hoje?</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-8">
        
        {/* Clash Royale Card */}
        <div 
          onClick={() => handleGameSelect('cr')}
          className="w-[230px] h-[300px] rounded-[24px] overflow-hidden cursor-pointer relative shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] border-4 border-transparent hover:border-[#fbbf24] group"
        >
          <Shield size={70} className="text-[#fbbf24] drop-shadow-md mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
          <div className="text-white text-xl font-black uppercase tracking-wide text-shadow-sm text-center">Clash Royale</div>
          <div className="text-[#93c5fd] text-xs font-bold mt-1 uppercase tracking-wider">Entrar no Painel</div>
        </div>

        {/* Brawl Stars Card */}
        <div 
          onClick={() => handleGameSelect('bs')}
          className="w-[230px] h-[300px] rounded-[24px] overflow-hidden cursor-pointer relative shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 flex flex-col items-center justify-center bg-gradient-to-br from-[#ea580c] to-[#f59e0b] border-4 border-transparent hover:border-[#fef08a] group"
        >
          <Star size={70} className="text-[#fef08a] drop-shadow-md mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
          <div className="text-white text-xl font-black uppercase tracking-wide text-shadow-sm text-center">Brawl Stars</div>
          <div className="text-[#fde68a] text-xs font-bold mt-1 uppercase tracking-wider">Entrar no Painel</div>
        </div>

      </div>
    </div>
  );
}
