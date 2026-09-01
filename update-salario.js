import fs from 'fs';

const content = `import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Check, Wallet, CheckCircle2, Lock } from 'lucide-react';

interface CalculadoraSalarioProps {
  activeProfileId: string;
  selectedDate?: Date;
}

export function CalculadoraSalario({ activeProfileId, selectedDate = new Date() }: CalculadoraSalarioProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [novoNome, setNovoNome] = useState('');
  const [novoValor, setNovoValor] = useState('');
  
  const [isLancando, setIsLancando] = useState(false);
  const [lancadoSucesso, setLancadoSucesso] = useState(false);
  const [jaLancadoMes, setJaLancadoMes] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('salario_composicao')
      .select('*')
      .eq('profile_id', activeProfileId)
      .eq('tipo', 'receita') // Force only receitas
      .order('created_at', { ascending: true });

    if (!error && data) {
      setItems(data);
      try {
        const savedUnselected = JSON.parse(localStorage.getItem(\`salario_unselected_\${activeProfileId}\`) || '[]');
        const newSelected = new Set(data.map((i: any) => i.id).filter((id: string) => !savedUnselected.includes(id)));
        setSelectedIds(newSelected);
      } catch (e) {
        setSelectedIds(new Set(data.map((i: any) => i.id)));
      }
    }
    setLoading(false);
  };

  const checkJaLancado = async () => {
    if (!activeProfileId) return;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const startOfMonth = \`\${year}-\${month}-01\`;
    const endOfMonth = new Date(year, selectedDate.getMonth() + 1, 0).toISOString().split('T')[0];

    const { data } = await supabase
      .from('transacoes')
      .select('id')
      .eq('profile_id', activeProfileId)
      .eq('descricao', 'Salário (Composição)')
      .gte('data', startOfMonth)
      .lte('data', endOfMonth)
      .limit(1);

    setJaLancadoMes(!!(data && data.length > 0));
  };

  useEffect(() => {
    if (activeProfileId) {
      fetchItems();
      checkJaLancado();
    }
  }, [activeProfileId, selectedDate]);

  const handleAddItem = async () => {
    if (!novoNome || !novoValor) return;
    
    const valorNum = parseFloat(novoValor.replace(/\\./g, '').replace(',', '.'));
    if (isNaN(valorNum)) return;

    const { error, data } = await supabase
      .from('salario_composicao')
      .insert({
        profile_id: activeProfileId,
        descricao: novoNome,
        valor: valorNum,
        tipo: 'receita'
      })
      .select();

    if (!error && data) {
      setNovoNome('');
      setNovoValor('');
      
      // Select by default when adding
      const novoSet = new Set(selectedIds);
      novoSet.add(data[0].id);
      setSelectedIds(novoSet);
      
      const unselected = items.map(i => i.id).filter(i => !novoSet.has(i));
      localStorage.setItem(\`salario_unselected_\${activeProfileId}\`, JSON.stringify(unselected));

      fetchItems();
    }
  };

  const handleDeleteItem = async (id: string) => {
    await supabase.from('salario_composicao').delete().eq('id', id);
    fetchItems();
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
    
    const unselected = items.map(i => i.id).filter(i => !newSet.has(i));
    // include the new toggle logic properly
    if (!newSet.has(id)) unselected.push(id);
    else {
      const idx = unselected.indexOf(id);
      if (idx > -1) unselected.splice(idx, 1);
    }
    
    localStorage.setItem(\`salario_unselected_\${activeProfileId}\`, JSON.stringify(unselected));
  };

  const totalParaLancar = items.filter(i => selectedIds.has(i.id)).reduce((acc, i) => acc + Number(i.valor), 0);
  const totalReceitas = items.reduce((acc, i) => acc + Number(i.valor), 0);

  const handleLancarSalario = async () => {
    if (totalParaLancar <= 0) return;
    setIsLancando(true);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const today = new Date();
    // Default to today's day if we are in the current month, else 1st of the selected month
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === selectedDate.getMonth();
    const day = isCurrentMonth ? String(today.getDate()).padStart(2, '0') : '01';
    
    const dataStr = \`\${year}-\${month}-\${day}\`;

    // Insert transaction
    const { error } = await supabase
      .from('transacoes')
      .insert({
        profile_id: activeProfileId,
        descricao: 'Salário (Composição)',
        tipo: 'receita',
        valor: totalParaLancar,
        data: dataStr,
        status: 'pago',
        forma_pagamento: 'pix'
      });

    setIsLancando(false);
    if (!error) {
      setLancadoSucesso(true);
      checkJaLancado(); // atualiza a trava
      setTimeout(() => setLancadoSucesso(false), 3000);
    } else {
      alert('Erro ao lançar salário');
    }
  };

  const formatarValor = (valor: number) => 
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative flex flex-col overflow-hidden">
          
          <div className="p-6 flex-1 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Wallet size={20} className="text-[#10B981] shrink-0" />
                <h4 className="text-base sm:text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  Composição Salarial
                </h4>
              </div>
            </div>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-700/50 mb-5 border-t border-dashed border-slate-300 dark:border-slate-600"></div>

            {/* List of Components */}
            <div className="space-y-3 mb-6">
              {items.map(item => {
                const isSelected = selectedIds.has(item.id);
                return (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleSelection(item.id)}
                      className={\`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 \${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-transparent hover:border-slate-400'}\`}
                      title={isSelected ? "Incluído no Lançamento" : "Não será lançado"}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </button>
                    <div className="flex flex-col">
                       <span className={\`text-sm font-semibold transition-colors \${isSelected ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}\`}>
                         {item.descricao}
                       </span>
                       {!isSelected && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ignorado no Lançamento</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={\`text-sm font-black transition-colors \${isSelected ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}\`}>{formatarValor(item.valor)}</span>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )})}

              {items.length === 0 && (
                <div className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Nenhuma entrada cadastrada
                </div>
              )}
            </div>

            {/* Form to Add New */}
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Ex: Pró-labore, Piso..."
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
                className="flex-1 bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-3 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500 placeholder:text-slate-400"
              />
              <input 
                type="text" 
                placeholder="Valor"
                value={novoValor}
                onChange={e => setNovoValor(e.target.value)}
                className="w-24 sm:w-32 bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-3 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500 placeholder:text-slate-400"
              />
              <button 
                onClick={handleAddItem}
                className="bg-slate-800 dark:bg-white text-white dark:text-black rounded-xl p-2.5 hover:opacity-80 transition-opacity"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-700/50 mb-6 border-t border-dashed border-slate-300 dark:border-slate-600"></div>

            {/* Total */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                  TOTAL BRUTO (A RECEBER)
                </div>
                <div className="text-xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
                  {formatarValor(totalReceitas)}
                </div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">
                   A LANÇAR NA CARTEIRA
                 </div>
                 <div className="text-3xl font-black text-[#10B981] leading-tight">
                   +{formatarValor(totalParaLancar)}
                 </div>
              </div>
            </div>

            {/* Lançar Button */}
            <div className="mt-auto">
              {jaLancadoMes ? (
                <div className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                  <Lock size={18} /> Já lançado em {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </div>
              ) : lancadoSucesso ? (
                <div className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  <CheckCircle2 size={18} /> Lançado com Sucesso!
                </div>
              ) : (
                <button
                  onClick={handleLancarSalario}
                  disabled={isLancando || totalParaLancar === 0}
                  className={\`w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider transition-all
                    \${totalParaLancar === 0 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                      : 'bg-transparent border border-[#1E293B] text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }\`}
                >
                  <Check size={18} className={totalParaLancar > 0 ? "text-[#10B981]" : ""} /> 
                  {isLancando ? 'Lançando...' : 'Lançar Salário'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
\`;

fs.writeFileSync('src/components/CalculadoraSalario.tsx', content);
