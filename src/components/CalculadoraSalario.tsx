import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Check, Wallet, CheckCircle2, Lock, Edit2, X, ArrowRight, SplitSquareHorizontal, Tag, RefreshCw } from 'lucide-react';
import { getOrCreateSalarioTag, repararTransacoesSalarioErradas, SalarioTagInfo } from '../utils/salarioTagHelper';

interface CalculadoraSalarioProps {
  activeProfileId: string;
  selectedDate?: Date;
}

export function CalculadoraSalario({ activeProfileId, selectedDate = new Date() }: CalculadoraSalarioProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States para Formulários
  const [recNome, setRecNome] = useState('');
  const [recValor, setRecValor] = useState('');
  
  const [descNome, setDescNome] = useState('');
  const [descValor, setDescValor] = useState('');

  const [divNome, setDivNome] = useState('');
  const [divValor, setDivValor] = useState('');
  
  const [isLancando, setIsLancando] = useState(false);
  const [lancadoSucesso, setLancadoSucesso] = useState(false);
  const [jaLancadoMes, setJaLancadoMes] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editValor, setEditValor] = useState('');

  const [salarioTagInfo, setSalarioTagInfo] = useState<SalarioTagInfo | null>(null);
  const [isReparandoTags, setIsReparandoTags] = useState(false);
  const [reparadoMsg, setReparadoMsg] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('salario_composicao')
      .select('*')
      .eq('profile_id', activeProfileId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setItems(data);
    }
    setLoading(false);
  };

  const checkJaLancado = async () => {
    if (!activeProfileId) return;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const ultimoDia = new Date(year, selectedDate.getMonth() + 1, 0).getDate();
    const inicioMes = `${year}-${month}-01`;
    const fimMes = `${year}-${month}-${String(ultimoDia).padStart(2, '0')}`;
    
    const { data } = await supabase
      .from('transacoes')
      .select('id')
      .eq('profile_id', activeProfileId)
      .eq('descricao', 'PIX: Restante do Salário') 
      .gte('data', inicioMes)
      .lte('data', fimMes)
      .limit(1);

    const { data: dataMulti } = await supabase
      .from('transacoes')
      .select('id')
      .eq('profile_id', activeProfileId)
      .ilike('descricao', 'PIX:%') 
      .gte('data', inicioMes)
      .lte('data', fimMes)
      .limit(1);

    const { data: dataOld } = await supabase
      .from('transacoes')
      .select('id')
      .eq('profile_id', activeProfileId)
      .eq('descricao', 'Salário (Composição)') 
      .gte('data', inicioMes)
      .lte('data', fimMes)
      .limit(1);

    setJaLancadoMes(!!((data && data.length > 0) || (dataMulti && dataMulti.length > 0) || (dataOld && dataOld.length > 0)));
  };

  const carregarTagInfo = async () => {
    if (!activeProfileId) return;
    const info = await getOrCreateSalarioTag(activeProfileId);
    if (info) setSalarioTagInfo(info);
  };

  const handleCorrigirTags = async () => {
    if (!activeProfileId) return;
    setIsReparandoTags(true);
    const res = await repararTransacoesSalarioErradas(activeProfileId);
    await carregarTagInfo();
    setIsReparandoTags(false);
    setReparadoMsg(res.updatedCount > 0 
      ? `${res.updatedCount} transação(ões) atualizada(s) para a Tag "Pagamento" (Categoria Salário)!`
      : 'As transações deste perfil já estão corretamente vinculadas à Tag "Pagamento" (Salário).'
    );
    setTimeout(() => setReparadoMsg(null), 4500);
  };

  const handleRefazerLancamento = async () => {
    if (!activeProfileId) return;
    const confirmou = window.confirm(
      "Deseja remover os lançamentos de salário deste mês para relançar com a composição e a tag correta (Pagamento / Salário)?"
    );
    if (!confirmou) return;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const ultimoDia = new Date(year, selectedDate.getMonth() + 1, 0).getDate();
    const inicioMes = `${year}-${month}-01`;
    const fimMes = `${year}-${month}-${String(ultimoDia).padStart(2, '0')}`;

    const { data: txsToDelete } = await supabase
      .from('transacoes')
      .select('id, descricao')
      .eq('profile_id', activeProfileId)
      .eq('tipo', 'receita')
      .gte('data', inicioMes)
      .lte('data', fimMes);

    if (txsToDelete) {
      const ids = txsToDelete
        .filter(t => (t.descricao || '').startsWith('PIX:') || (t.descricao || '').includes('Salário'))
        .map(t => t.id);
      if (ids.length > 0) {
        await supabase.from('transacoes').delete().in('id', ids);
      }
    }
    await checkJaLancado();
  };

  const yearMonth = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}`;

  useEffect(() => {
    if (activeProfileId) {
      fetchItems();
      checkJaLancado();
      carregarTagInfo();
      repararTransacoesSalarioErradas(activeProfileId);
    }
  }, [activeProfileId, yearMonth]);

  const handleAddItem = async (tipo: 'receita' | 'desconto' | 'despesa') => {
    let nome = '';
    let valor = '';
    
    if (tipo === 'receita') {
      nome = recNome;
      valor = recValor;
    } else if (tipo === 'desconto') {
      nome = descNome;
      valor = descValor;
    } else {
      nome = divNome;
      valor = divValor;
    }

    if (!nome || !valor) return;
    const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    if (isNaN(valorNum)) return;

    let dbDescricao = nome;
    let dbTipo = tipo === 'receita' ? 'receita' : 'despesa';
    
    if (nome.toLowerCase().includes('adicional') || nome.toLowerCase().includes('adicionais')) {
      const currentMonthStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
      dbDescricao = `[VAR:${currentMonthStr}] ${dbDescricao}`;
    }

    if (tipo === 'desconto') {
      dbDescricao = `[DESC] ${dbDescricao}`;
    }

    const { data, error } = await supabase
      .from('salario_composicao')
      .insert({
        profile_id: activeProfileId,
        descricao: dbDescricao,
        valor: valorNum,
        tipo: dbTipo
      })
      .select();

    if (!error) {
      if (tipo === 'receita') { setRecNome(''); setRecValor(''); }
      if (tipo === 'desconto') { setDescNome(''); setDescValor(''); }
      if (tipo === 'despesa') { setDivNome(''); setDivValor(''); }
      fetchItems();
    }
  };

  const handleDeleteItem = async (id: string) => {
    await supabase.from('salario_composicao').delete().eq('id', id);
    fetchItems();
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditNome(item.descricao);
    setEditValor(item.valor.toString().replace('.', ','));
  };

  const handleSaveEdit = async () => {
    if (!editNome || !editValor || !editingId) return;
    const valorNum = parseFloat(editValor.replace(/\./g, '').replace(',', '.'));
    if (isNaN(valorNum)) return;

    const originalItem = processedItems.find(i => i.id === editingId);
    if (!originalItem) return;

    let dbDescricao = editNome;

    // Se mudou para "adicional", adiciona a tag do mes atual se não tiver
    if (!originalItem.isVar && editNome.toLowerCase().includes('adicional')) {
      const currentMonthStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
      dbDescricao = `[VAR:${currentMonthStr}] ${dbDescricao}`;
    } else if (originalItem.isVar) {
      dbDescricao = `[VAR:${originalItem.varMonth}] ${dbDescricao}`;
    }

    if (originalItem.descricao.startsWith('[DESC] ') || (items.find(i => i.id === editingId)?.descricao.startsWith('[DESC] '))) {
      dbDescricao = `[DESC] ${dbDescricao}`;
    }

    await supabase
      .from('salario_composicao')
      .update({
        descricao: dbDescricao,
        valor: valorNum
      })
      .eq('id', editingId);
    setEditingId(null);
    fetchItems();
  };

  const formatarValor = (valor: number) => 
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Filter items for the selected month
  const currentMonthStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
  
  const processedItems = items.map(i => {
    let clean = i.descricao;
    let isVar = false;
    let varMonth = '';

    const varMatch = clean.match(/\[VAR:(\d{4}-\d{2})\]\s*/);
    if (varMatch) {
      isVar = true;
      varMonth = varMatch[1];
      clean = clean.replace(varMatch[0], '');
    } else if (clean.toLowerCase().includes('adicional') || clean.toLowerCase().includes('adicionais')) {
      isVar = true;
      const createdDate = new Date(i.created_at || Date.now());
      varMonth = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
    }

    return { ...i, descricao: clean, isVar, varMonth };
  }).filter(i => {
    if (i.isVar) {
      return i.varMonth === currentMonthStr;
    }
    return true; // Fixed items show up everywhere
  });

  // Cálculos com precisão de 2 casas decimais
  const receitas = processedItems.filter(i => i.tipo === 'receita');
  const descontos = processedItems.filter(i => (i.tipo === 'despesa' || i.tipo === 'divisao') && i.descricao.startsWith('[DESC] ')).map(i => ({...i, descricao: i.descricao.replace('[DESC] ', '')}));
  const divisoes = processedItems.filter(i => (i.tipo === 'despesa' || i.tipo === 'divisao') && !i.descricao.startsWith('[DESC] '));

  const totalBruto = Math.round(receitas.reduce((acc, i) => acc + Number(i.valor), 0) * 100) / 100;
  const totalDescontos = Math.round(descontos.reduce((acc, i) => acc + Number(i.valor), 0) * 100) / 100;
  const totalDivisoes = Math.round(divisoes.reduce((acc, i) => acc + Number(i.valor), 0) * 100) / 100;
  const restante = Math.round((totalBruto - totalDescontos - totalDivisoes) * 100) / 100;
  const totalDepositado = Math.round((totalDivisoes + restante) * 100) / 100;

  const handleLancarSalario = async () => {
    if (totalBruto <= 0) return;
    setIsLancando(true);
    
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === selectedDate.getMonth();
    const day = isCurrentMonth ? String(today.getDate()).padStart(2, '0') : '01';
    
    const dataStr = `${year}-${month}-${day}`;
    
    // Obter ou criar tag Salário específica para este perfil
    const salarioInfo = await getOrCreateSalarioTag(activeProfileId);
    const tagId = salarioInfo?.tagId;
    
    const transacoes = [];
    
    // Cria uma transação para cada divisão
    for (const div of divisoes) {
      transacoes.push({
        profile_id: activeProfileId,
        descricao: `PIX: ${div.descricao}`,
        tipo: 'receita',
        valor: Math.round(Number(div.valor) * 100) / 100,
        data: dataStr,
        status: 'pago',
        forma_pagamento: 'pix',
        ...(tagId ? { tag_id: tagId } : {})
      });
    }

    // Cria uma transação para o restante
    if (restante > 0) {
      transacoes.push({
        profile_id: activeProfileId,
        descricao: `PIX: Restante do Salário`,
        tipo: 'receita',
        valor: Math.round(restante * 100) / 100,
        data: dataStr,
        status: 'pago',
        forma_pagamento: 'pix',
        ...(tagId ? { tag_id: tagId } : {})
      });
    } else if (restante < 0) {
      alert("As divisões e descontos ultrapassam o salário bruto! Ajuste os valores.");
      setIsLancando(false);
      return;
    }

    if (transacoes.length > 0) {
      const { error } = await supabase.from('transacoes').insert(transacoes);
      setIsLancando(false);
      if (!error) {
        setLancadoSucesso(true);
        checkJaLancado();
        setTimeout(() => setLancadoSucesso(false), 3000);
      } else {
        alert('Erro ao lançar salário');
      }
    } else {
      setIsLancando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#0B0F19] dark:to-[#0F172A] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm flex flex-col p-6 sm:p-8">
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Wallet size={20} />
            </div>
            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Composição Salarial
            </h4>
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
            Declare seu <strong className="text-slate-700 dark:text-slate-300">Salário Bruto</strong>, remova <strong className="text-slate-700 dark:text-slate-300">Descontos</strong> (que não entram na conta) e crie as <strong className="text-slate-700 dark:text-slate-300">Divisões de PIX</strong>. O sistema calculará o restante e lançará cada parte que cai na sua conta.
          </p>

          {/* 1. Salário Base / Adicionais */}
          <div className="mb-6">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-5 h-5 rounded-full flex items-center justify-center">1</span> 
              Valores a Receber (Bruto)
            </div>
            
            <div className="space-y-2 mb-3">
              {receitas.map(item => (
                <div key={item.id} className="flex flex-col">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2 bg-[#F8FAFC] dark:bg-[#0F172A] p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} className="flex-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-500" placeholder="Nome" />
                      <input type="text" value={editValor} onChange={e => setEditValor(e.target.value)} className="w-28 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-500" placeholder="Valor" />
                      <button onClick={handleSaveEdit} className="text-emerald-600 dark:text-emerald-400 p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"><Check size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors group">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.descricao}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{formatarValor(item.valor)}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleStartEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input type="text" placeholder="Ex: Piso Farmacêutico, Adicionais" value={recNome} onChange={e=>setRecNome(e.target.value)} className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600" />
              <input type="text" placeholder="R$ 0,00" value={recValor} onChange={e=>setRecValor(e.target.value)} className="w-28 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600" />
              <button onClick={() => handleAddItem('receita')} className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl p-2.5 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex items-center justify-center min-w-[44px]"><Plus size={18}/></button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-800/80 mb-6 border-t border-dashed border-slate-300 dark:border-slate-700"></div>

          {/* 2. Descontos na Fonte */}
          <div className="mb-6">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-5 h-5 rounded-full flex items-center justify-center">2</span> 
              Descontos (Não entram na conta)
            </div>
            
            <div className="space-y-2 mb-3">
              {descontos.map(item => (
                <div key={item.id} className="flex flex-col">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2 bg-[#F8FAFC] dark:bg-[#0F172A] p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} className="flex-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-red-500" placeholder="Nome" />
                      <input type="text" value={editValor} onChange={e => setEditValor(e.target.value)} className="w-28 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-red-500" placeholder="Valor" />
                      <button onClick={handleSaveEdit} className="text-emerald-600 dark:text-emerald-400 p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"><Check size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors group">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.descricao}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-base font-black text-red-500">- {formatarValor(item.valor)}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleStartEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input type="text" placeholder="Ex: Mari, INSS" value={descNome} onChange={e=>setDescNome(e.target.value)} className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-red-500 placeholder:text-slate-400 dark:placeholder:text-slate-600" />
              <input type="text" placeholder="R$ 0,00" value={descValor} onChange={e=>setDescValor(e.target.value)} className="w-28 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-red-500 placeholder:text-slate-400 dark:placeholder:text-slate-600" />
              <button onClick={() => handleAddItem('desconto')} className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl p-2.5 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center min-w-[44px]"><Plus size={18}/></button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-800/80 mb-6 border-t border-dashed border-slate-300 dark:border-slate-700"></div>

          {/* 3. Divisões */}
          <div className="mb-8">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-5 h-5 rounded-full flex items-center justify-center">3</span> 
              PIXs Separados (Entram na conta)
            </div>
            
            <div className="space-y-2 mb-3">
              {divisoes.map(item => (
                <div key={item.id} className="flex flex-col">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2 bg-[#F8FAFC] dark:bg-[#0F172A] p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} className="flex-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500" placeholder="Nome" />
                      <input type="text" value={editValor} onChange={e => setEditValor(e.target.value)} className="w-28 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500" placeholder="Valor" />
                      <button onClick={handleSaveEdit} className="text-emerald-600 dark:text-emerald-400 p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"><Check size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors group">
                      <div className="flex items-center gap-3">
                        <SplitSquareHorizontal size={16} className="text-blue-400 dark:text-blue-500" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.descricao}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-base font-black text-slate-800 dark:text-slate-200">{formatarValor(item.valor)}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleStartEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input type="text" placeholder="Ex: Pró-Labore" value={divNome} onChange={e=>setDivNome(e.target.value)} className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 placeholder:text-slate-400 dark:placeholder:text-slate-600" />
              <input type="text" placeholder="R$ 0,00" value={divValor} onChange={e=>setDivValor(e.target.value)} className="w-28 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 placeholder:text-slate-400 dark:placeholder:text-slate-600" />
              <button onClick={() => handleAddItem('despesa')} className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl p-2.5 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center min-w-[44px]"><Plus size={18}/></button>
            </div>
          </div>

          {/* 4. Resumo / Visão */}
          <div className="bg-emerald-50/50 dark:bg-[#0B1519] border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 mb-8">
            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ArrowRight size={14} /> Resumo do Lançamento
            </div>
            
            <div className="space-y-3">
              {/* Badge indicando a Tag e Categoria correta */}
              <div className="flex items-center justify-between text-xs py-2 px-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-emerald-200/70 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 shadow-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <Tag size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Tag vinculada: <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{salarioTagInfo?.tagName || 'Pagamento'}</strong></span>
                </div>
                <span className="text-[11px] opacity-80 font-medium">Categoria: <strong>{salarioTagInfo?.categoryName || 'Salário'}</strong></span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Bruto dos Rendimentos</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatarValor(totalBruto)}</span>
              </div>
              
              {descontos.length > 0 && (
                <div className="flex justify-between items-center pb-2 border-b border-emerald-100 dark:border-emerald-900/30">
                  <span className="text-sm font-medium text-red-500/90">Descontos (Retidos / Não caem na conta)</span>
                  <span className="text-sm font-bold text-red-500">- {formatarValor(totalDescontos)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-1">
                <span>(=) Valor Líquido a Receber</span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-200">{formatarValor(totalDepositado)}</span>
              </div>
              
              <div className="pt-2 border-t border-dashed border-emerald-200 dark:border-emerald-800/40 space-y-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Divisão das Transferências (PIXs):
                </div>
                {divisoes.map(d => (
                  <div key={`res-${d.id}`} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-emerald-700/80 dark:text-emerald-400/80">+ Lançar PIX: {d.descricao}</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">{formatarValor(d.valor)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-700/80 dark:text-emerald-400/80">+ Lançar PIX: Restante do Salário</span>
                  <span className={`text-sm font-bold ${restante < 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                    {formatarValor(restante)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-emerald-900/50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Total Entrando na Carteira</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-500">{formatarValor(totalDepositado)}</span>
              </div>
              <div className="text-[11px] text-right font-medium text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                ({divisoes.map(d => formatarValor(d.valor)).concat([formatarValor(restante)]).join(' + ')} = {formatarValor(totalDepositado)})
              </div>
            </div>
          </div>

          {/* Ação */}
          <div>
            {jaLancadoMes ? (
              <div className="space-y-3">
                <div className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                  <Lock size={18}/> Salário já lançado em {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleCorrigirTags}
                    disabled={isReparandoTags}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={isReparandoTags ? 'animate-spin' : ''} />
                    {isReparandoTags ? 'Atualizando...' : 'Vincular à Tag Pagamento (Salário)'}
                  </button>
                  <button
                    onClick={handleRefazerLancamento}
                    className="py-2.5 px-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Refazer Lançamento
                  </button>
                </div>
              </div>
            ) : lancadoSucesso ? (
              <div className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                <CheckCircle2 size={18}/> Lançamento Concluído com a Tag Pagamento (Salário)!
              </div>
            ) : (
              <button 
                onClick={handleLancarSalario} 
                disabled={isLancando || totalBruto === 0 || restante < 0} 
                className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase transition-all bg-[#10B981] text-white hover:bg-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
              >
                <Check size={18} /> {isLancando ? 'Processando Lançamentos...' : 'Lançar Transferências'}
              </button>
            )}

            {reparadoMsg && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{reparadoMsg}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
