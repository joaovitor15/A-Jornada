import React from 'react';
import { X, PieChart as PieChartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export function GraficosPosicoesModal({ isOpen, onClose, cardData }: { isOpen: boolean, onClose: () => void, cardData: any[] }) {
  if (!isOpen) return null;

  // Filter out zeros for cleaner charts if we want, but it's fine.
  
  const atualData = cardData.map(c => ({
    name: c.nome,
    value: c.percentualAtual,
    color: c.cor
  })).filter(c => c.value > 0);

  const idealData = cardData.map(c => ({
    name: c.nome,
    value: c.objetivo,
    color: c.cor
  })).filter(c => c.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg p-3 shadow-lg">
          <p className="font-bold text-[#0F172A] dark:text-white text-sm mb-1">{payload[0].name}</p>
          <p className="text-sm font-medium" style={{ color: payload[0].payload.color }}>
            {Number(payload[0].value).toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A80] dark:bg-black/60 backdrop-blur-[4px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] relative group"
      >
        <div className="absolute top-0 left-0 -mt-24 -ml-24 w-64 h-64 bg-[#3B82F6] rounded-full blur-[80px] opacity-[0.10] dark:opacity-[0.15] transition-opacity duration-700 pointer-events-none"></div>

        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]/80 dark:border-[#1E293B]/80 relative z-10">
          <h3 className="font-bold text-[#0F172A] dark:text-white text-lg flex items-center gap-2">
            <PieChartIcon className="text-[#3B82F6]" size={20} />
            Distribuição da Carteira
          </h3>
          <button 
            onClick={onClose}
            className="text-[#94A3B8] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Gráfico Atual */}
            <div className="bg-white dark:bg-[#1E293B]/30 p-6 rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B]/50 shadow-sm">
              <h4 className="text-center font-bold text-[#0F172A] dark:text-white mb-6 uppercase tracking-wider text-[13px]">Atual por Classe</h4>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={atualData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {atualData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 flex flex-col gap-3">
                {cardData.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c.cor }}></div>
                      <span className="text-[14px] font-medium text-[#64748B] dark:text-[#94A3B8]">{c.nome}</span>
                    </div>
                    <span className="font-bold text-[14px] text-[#0F172A] dark:text-white">{c.percentualAtual.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico Ideal (Objetivo) */}
            <div className="bg-white dark:bg-[#1E293B]/30 p-6 rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B]/50 shadow-sm">
              <h4 className="text-center font-bold text-[#0F172A] dark:text-white mb-6 uppercase tracking-wider text-[13px]">Objetivo (Ideal)</h4>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={idealData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {idealData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 flex flex-col gap-3">
                {cardData.map((c, i) => {
                  const dif = c.percentualAtual - c.objetivo;
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c.cor }}></div>
                        <span className="text-[14px] font-medium text-[#64748B] dark:text-[#94A3B8]">{c.nome}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-[14px] text-[#0F172A] dark:text-white">{c.objetivo.toFixed(1)}%</span>
                        <span className={`text-[12px] font-bold w-[50px] text-right rounded-md px-1.5 py-0.5 ${dif > 0 ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : dif < 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-slate-400'}`}>
                          {dif > 0 ? '+' : ''}{dif.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
