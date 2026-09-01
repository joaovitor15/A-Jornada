import fs from 'fs';

const content = `import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Check, Wallet, CheckCircle2, Lock, Edit2, X, ArrowRight } from 'lucide-react';

interface CalculadoraSalarioProps {
  activeProfileId: string;
  selectedDate?: Date;
}

export function CalculadoraSalario({ activeProfileId, selectedDate = new Date() }: CalculadoraSalarioProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [novoNome, setNovoNome] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novoTipo, setNovoTipo] = useState<'receita' | 'despesa'>('despesa');
  
  const [isLancando, setIsLancando] = useState(false);
  const [lancadoSucesso, setLancadoSucesso] = useState(false);
  const [jaLancadoMes, setJaLancadoMes] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editValor, setEditValor] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('salario_composicao').select('*').eq('profile_id', activeProfileId).order('created_at', { ascending: true });
    if (data) {
      setItems(data);
      try {
        const savedUnselected = JSON.parse(localStorage.getItem(\`salario_uns_\${activeProfileId}\`) || '[]');
        setSelectedIds(new Set(data.map((i: any) => i.id).filter((id: string) => !savedUnselected.includes(id))));
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
    const { data } = await supabase.from('transacoes').select('id').eq('profile_id', activeProfileId).eq('descricao', 'Salário (Composição)').gte('data', \`\${year}-\${month}-01\`).limit(1);
    setJaLancadoMes(!!(data && data.length > 0));
  };

  const yearMonth = \`\${selectedDate.getFullYear()}-\${selectedDate.getMonth()}\`;

  useEffect(() => {
    if (activeProfileId) { fetchItems(); checkJaLancado(); }
  }, [activeProfileId, yearMonth]);

  const handleAddItem = async () => {
    const valorNum = parseFloat(novoValor.replace(/\\./g, '').replace(',', '.'));
    if (!novoNome || isNaN(valorNum)) return;
    const { data } = await supabase.from('salario_composicao').insert({ profile_id: activeProfileId, descricao: novoNome, valor: valorNum, tipo: novoTipo }).select();
    if (data) {
      setNovoNome(''); setNovoValor('');
      const novoSet = new Set(selectedIds); novoSet.add(data[0].id); setSelectedIds(novoSet);
      localStorage.setItem(\`salario_uns_\${activeProfileId}\`, JSON.stringify(items.map(i => i.id).filter(i => !novoSet.has(i))));
      fetchItems();
    }
  };

  const handleDeleteItem = async (id: string) => { await supabase.from('salario_composicao').delete().eq('id', id); fetchItems(); };

  const handleStartEdit = (item: any) => { setEditingId(item.id); setEditNome(item.descricao); setEditValor(item.valor.toString().replace('.', ',')); };

  const handleSaveEdit = async () => {
    const valorNum = parseFloat(editValor.replace(/\\./g, '').replace(',', '.'));
    if (!editNome || isNaN(valorNum) || !editingId) return;
    await supabase.from('salario_composicao').update({ descricao: editNome, valor: valorNum }).eq('id', editingId);
    setEditingId(null); fetchItems();
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedIds(newSet);
    const uns = items.map(i => i.id).filter(i => !newSet.has(i));
    localStorage.setItem(\`salario_uns_\${activeProfileId}\`, JSON.stringify(uns));
  };

  const receitas = items.filter(i => i.tipo === 'receita');
  const despesas = items.filter(i => i.tipo === 'despesa');

  const totalBase = receitas.reduce((acc, i) => acc + Number(i.valor), 0);
  const totalDesmembramento = despesas.reduce((acc, i) => acc + Number(i.valor), 0);
  const restante = totalBase - totalDesmembramento;

  const despesasDesmarcadas = despesas.filter(i => !selectedIds.has(i.id)).reduce((acc, i) => acc + Number(i.valor), 0);
  const totalParaLancar = totalBase - despesasDesmarcadas;

  const handleLancarSalario = async () => {
    if (totalParaLancar <= 0) return;
    setIsLancando(true);
    const day = new Date().getMonth() === selectedDate.getMonth() ? String(new Date().getDate()).padStart(2, '0') : '01';
    const dataStr = \`\${selectedDate.getFullYear()}-\${String(selectedDate.getMonth() + 1).padStart(2, '0')}-\${day}\`;
    
    const { error } = await supabase.from('transacoes').insert({ profile_id: activeProfileId, descricao: 'Salário (Composição)', tipo: 'receita', valor: totalParaLancar, data: dataStr, status: 'pago', forma_pagamento: 'pix' });
    setIsLancando(false);
    if (!error) {
      setLancadoSucesso(true); checkJaLancado(); setTimeout(() => setLancadoSucesso(false), 3000);
    }
  };

  const format = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] border border-[#E2E8F0] shadow-sm flex flex-col p-6">
          
          <div className="flex items-center gap-2 mb-6">
            <Wallet size={20} className="text-[#10B981]" />
            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase">Composição Salarial</h4>
          </div>

          {/* 1. Base */}
          <div className="mb-4">
            <div className="text-[10px] font-black text-slate-400 uppercase mb-3">1. Salário Base (Total Bruto)</div>
            {receitas.map(item => (
              <div key={item.id} className="flex flex-col gap-2 mb-2">
                {editingId === item.id ? (
                  <div className="flex gap-2 bg-slate-50 p-2 rounded-xl border">
                    <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} className="flex-1 rounded-lg px-2 text-xs font-bold" />
                    <input type="text" value={editValor} onChange={e => setEditValor(e.target.value)} className="w-24 rounded-lg px-2 text-xs font-bold" />
                    <button onClick={handleSaveEdit} className="text-emerald-500"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border group">
                    <span className="text-sm font-bold text-slate-700">{item.descricao}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-emerald-600">{format(item.valor)}</span>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                        <button onClick={() => handleStartEdit(item)} className="p-1 text-slate-400"><Edit2 size={14}/></button>
                        <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-slate-400"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="h-px bg-slate-200 mb-5 border-t border-dashed"></div>

          {/* 2. Divisões */}
          <div className="mb-6">
            <div className="text-[10px] font-black text-slate-400 uppercase mb-3">2. Divisões de PIX (Desmembramentos)</div>
            {despesas.map(item => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div key={item.id} className="flex flex-col gap-2 mb-2">
                  {editingId === item.id ? (
                    <div className="flex gap-2 bg-slate-50 p-2 rounded-xl border">
                      <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} className="flex-1 rounded-lg px-2 text-xs font-bold" />
                      <input type="text" value={editValor} onChange={e => setEditValor(e.target.value)} className="w-24 rounded-lg px-2 text-xs font-bold" />
                      <button onClick={handleSaveEdit} className="text-emerald-500"><Check size={16} /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-[#F8FAFC] p-2.5 rounded-xl border group">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleSelection(item.id)} className={\`w-5 h-5 rounded flex items-center justify-center border \${isSelected ? 'bg-blue-500 text-white' : ''}\`}>
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </button>
                        <span className={\`text-sm font-semibold \${!isSelected && 'line-through text-slate-400'}\`}>{item.descricao}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black">{format(item.valor)}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                          <button onClick={() => handleStartEdit(item)} className="p-1 text-slate-400"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-slate-400"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex gap-2 mt-4">
              <input type="text" placeholder="Nome" value={novoNome} onChange={e=>setNovoNome(e.target.value)} className="flex-1 bg-[#F1F5F9] rounded-xl px-3 py-2.5 text-xs font-bold" />
              <input type="text" placeholder="Valor" value={novoValor} onChange={e=>setNovoValor(e.target.value)} className="w-24 bg-[#F1F5F9] rounded-xl px-3 py-2.5 text-xs font-bold" />
              <select value={novoTipo} onChange={e=>setNovoTipo(e.target.value as any)} className="bg-[#F1F5F9] rounded-xl px-2 py-2.5 text-xs font-bold">
                <option value="despesa">Divisão PIX</option>
                <option value="receita">Salário Base</option>
              </select>
              <button onClick={handleAddItem} className="bg-slate-800 text-white rounded-xl p-2.5"><Plus size={16}/></button>
            </div>
          </div>

          {/* 3. Visão */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6">
            <div className="text-[10px] font-black text-blue-600 uppercase mb-3 flex items-center gap-2"><ArrowRight size={14} /> Visão de Transferências</div>
            {despesas.map(d => (
              <div key={d.id} className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-600">PIX: {d.descricao}</span>
                <span className="font-bold">{format(d.valor)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-600">PIX: Restante (Piso)</span>
              <span className="font-bold">{format(restante > 0 ? restante : 0)}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between">
              <span className="text-xs font-black text-slate-500 uppercase">Soma Total</span>
              <span className="font-black text-blue-600">{format(totalBase)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-[10px] font-black text-emerald-600 uppercase mb-1">Lançamento Unificado na Carteira</div>
              <div className="text-3xl font-black text-[#10B981]">+{format(totalParaLancar)}</div>
            </div>
          </div>

          {jaLancadoMes ? (
            <div className="py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-slate-100 text-slate-500"><Lock size={18}/> Lançado</div>
          ) : lancadoSucesso ? (
            <div className="py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-emerald-50 text-emerald-600"><CheckCircle2 size={18}/> Sucesso!</div>
          ) : (
            <button onClick={handleLancarSalario} disabled={isLancando || totalParaLancar === 0} className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase bg-[#10B981] text-white">
              <Check size={18} /> {isLancando ? 'Lançando...' : 'Lançar Tudo Junto'}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/CalculadoraSalario.tsx', content);
