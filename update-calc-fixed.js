import fs from 'fs';

const content = `import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Check, Wallet, CheckCircle2, Lock, Edit2, X, ArrowRight, Divide } from 'lucide-react';

interface CalculadoraSalarioProps {
  activeProfileId: string;
  selectedDate?: Date;
}

export function CalculadoraSalario({ activeProfileId, selectedDate = new Date() }: CalculadoraSalarioProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [novoNome, setNovoNome] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novoTipo, setNovoTipo] = useState<'receita' | 'despesa'>('receita');
  
  const [isLancando, setIsLancando] = useState(false);
  const [lancadoSucesso, setLancadoSucesso] = useState(false);
  const [jaLancadoMes, setJaLancadoMes] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editValor, setEditValor] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('salario_composicao').select('*').eq('profile_id', activeProfileId).order('created_at', { ascending: true });
    if (data) {
      setItems(data);
    }
    setLoading(false);
  };

  const checkJaLancado = async () => {
    if (!activeProfileId) return;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const { data } = await supabase.from('transacoes').select('id').eq('profile_id', activeProfileId).eq('descricao', 'Salário (Lançamento Múltiplo)').gte('data', \`\${year}-\${month}-01\`).limit(1);
    const { data: data2 } = await supabase.from('transacoes').select('id').eq('profile_id', activeProfileId).ilike('descricao', 'PIX:%').gte('data', \`\${year}-\${month}-01\`).limit(1);
    
    setJaLancadoMes(!!((data && data.length > 0) || (data2 && data2.length > 0)));
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

  const receitas = items.filter(i => i.tipo === 'receita'); // Valor total (ex: Piso 4950)
  const despesas = items.filter(i => i.tipo === 'despesa'); // Separações de PIX (ex: Pro-labore 1440)

  const totalBruto = receitas.reduce((acc, i) => acc + Number(i.valor), 0);
  const totalSeparado = despesas.reduce((acc, i) => acc + Number(i.valor), 0);
  const restante = totalBruto - totalSeparado;

  const handleLancarSalario = async () => {
    if (totalBruto <= 0) return;
    setIsLancando(true);
    const day = new Date().getMonth() === selectedDate.getMonth() ? String(new Date().getDate()).padStart(2, '0') : '01';
    const dataStr = \`\${selectedDate.getFullYear()}-\${String(selectedDate.getMonth() + 1).padStart(2, '0')}-\${day}\`;
    
    // Lançar multiplos PIX
    const transacoesParaLancar = [];
    
    // Cada divisão vira uma transação
    for (const d of despesas) {
      transacoesParaLancar.push({
        profile_id: activeProfileId, 
        descricao: \`PIX: \${d.descricao}\`, 
        tipo: 'receita', 
        valor: d.valor, 
        data: dataStr, 
        status: 'pago', 
        forma_pagamento: 'pix'
      });
    }

    // O restante vira outra transação
    if (restante > 0) {
       transacoesParaLancar.push({
        profile_id: activeProfileId, 
        descricao: \`PIX: Restante do Salário\`, 
        tipo: 'receita', 
        valor: restante, 
        data: dataStr, 
        status: 'pago', 
        forma_pagamento: 'pix'
      });
    }

    if (transacoesParaLancar.length > 0) {
      const { error } = await supabase.from('transacoes').insert(transacoesParaLancar);
      setIsLancando(false);
      if (!error) {
        setLancadoSucesso(true); checkJaLancado(); setTimeout(() => setLancadoSucesso(false), 3000);
      } else {
        alert('Erro ao lançar transações');
      }
    } else {
      setIsLancando(false);
    }
  };

  const format = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm flex flex-col p-6">
          
          <div className="flex items-center gap-2 mb-6">
            <Wallet size={20} className="text-[#10B981]" />
            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase">Composição Salarial</h4>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Adicione o seu <strong>Total Bruto</strong> (ex: 4950) na primeira seção, e depois crie as <strong>Divisões de PIX</strong> (ex: Pro-labore de 1440) na segunda seção. O sistema fará a matemática para você visualizar.
          </p>

          {/* 1. Base */}
          <div className="mb-4">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">1. Valor Total a Receber</div>
            {receitas.map(item => (
              <div key={item.id} className="flex flex-col gap-2 mb-2">
                {editingId === item.id ? (
                  <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                    <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} className="flex-1 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500" />
                    <input type="text" value={editValor} onChange={e => setEditValor(e.target.value)} className="w-24 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500" />
                    <button onClick={handleSaveEdit} className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1.5 rounded-md"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-md"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-white dark:bg-[#131B2C] p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.descricao}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-500">{format(item.valor)}</span>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                        <button onClick={() => handleStartEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400"><Edit2 size={14}/></button>
                        <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {receitas.length === 0 && (
              <div className="text-center py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border border-dashed border-slate-200 dark:border-slate-700 rounded-xl mb-2">
                Nenhum valor total cadastrado
              </div>
            )}
          </div>

          {/* 2. Divisões */}
          <div className="mb-6">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">2. Divisões de PIX (Desmembramentos)</div>
            {despesas.map(item => (
                <div key={item.id} className="flex flex-col gap-2 mb-2">
                  {editingId === item.id ? (
                    <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} className="flex-1 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500" />
                      <input type="text" value={editValor} onChange={e => setEditValor(e.target.value)} className="w-24 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500" />
                      <button onClick={handleSaveEdit} className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1.5 rounded-md"><Check size={16} /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-md"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-[#0F172A]/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 group">
                      <div className="flex items-center gap-2">
                        <Divide size={16} className="text-blue-500" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.descricao}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">{format(item.valor)}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button onClick={() => handleStartEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            ))}
            
            {despesas.length === 0 && (
              <div className="text-center py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border border-dashed border-slate-200 dark:border-slate-700 rounded-xl mb-2">
                Nenhum desmembramento cadastrado
              </div>
            )}

            <div className="flex gap-2 mt-4 items-center">
              <input type="text" placeholder="Nome" value={novoNome} onChange={e=>setNovoNome(e.target.value)} className="flex-1 bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-3 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500 placeholder:text-slate-400" />
              <input type="text" placeholder="Valor" value={novoValor} onChange={e=>setNovoValor(e.target.value)} className="w-24 bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-3 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500 placeholder:text-slate-400" />
              <select value={novoTipo} onChange={e=>setNovoTipo(e.target.value as any)} className="bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl px-2 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500">
                <option value="receita">Total (Base)</option>
                <option value="despesa">Divisão PIX</option>
              </select>
              <button onClick={handleAddItem} className="bg-slate-800 dark:bg-white text-white dark:text-black rounded-xl p-2.5 hover:opacity-80"><Plus size={16}/></button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700/50 mb-6 border-t border-dashed border-slate-300 dark:border-slate-600"></div>

          {/* 3. Visão (Resumo) */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4 mb-6">
            <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2"><ArrowRight size={14} /> Como cairá na sua conta:</div>
            
            <div className="space-y-2">
              {despesas.map(d => (
                <div key={\`res-\${d.id}\`} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-600 dark:text-slate-300">PIX: {d.descricao}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{format(d.valor)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-300">PIX: Restante do Salário</span>
                <span className="font-bold text-slate-800 dark:text-white">{format(restante > 0 ? restante : 0)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-200/50 dark:border-blue-800/50 flex justify-between items-center">
              <span className="text-xs font-black text-slate-500 uppercase">Soma Total (Bruto)</span>
              <span className="font-black text-blue-600 dark:text-blue-400">{format(totalBruto)}</span>
            </div>
          </div>

          {jaLancadoMes ? (
            <div className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"><Lock size={18}/> Já Lançado Neste Mês</div>
          ) : lancadoSucesso ? (
            <div className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={18}/> Lançado com Sucesso!</div>
          ) : (
            <button onClick={handleLancarSalario} disabled={isLancando || totalBruto === 0} className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase transition-all bg-[#10B981] text-white hover:bg-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
              <Check size={18} /> {isLancando ? 'Lançando...' : 'Lançar Tudo Junto'}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
\`;

fs.writeFileSync('src/components/CalculadoraSalario.tsx', content);
