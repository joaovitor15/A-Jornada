import fs from 'fs';

let content = fs.readFileSync('src/components/CalculadoraSalario.tsx', 'utf-8');

// 1. Add lucide icons for edit
content = content.replace(
  "import { Plus, Trash2, Check, Wallet, CheckCircle2, Lock } from 'lucide-react';",
  "import { Plus, Trash2, Check, Wallet, CheckCircle2, Lock, Edit2, X } from 'lucide-react';"
);

// 2. Add state for editing
const stateInsertion = `
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editValor, setEditValor] = useState('');
`;
content = content.replace("  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());", stateInsertion);

// 3. Add handleEdit functions
const editFunctions = `
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
    
    const valorNum = parseFloat(editValor.replace(/\\./g, '').replace(',', '.'));
    if (isNaN(valorNum)) return;

    const { error } = await supabase
      .from('salario_composicao')
      .update({
        descricao: editNome,
        valor: valorNum
      })
      .eq('id', editingId);

    if (!error) {
      setEditingId(null);
      fetchItems();
    }
  };
`;
content = content.replace(`  const handleDeleteItem = async (id: string) => {
    await supabase.from('salario_composicao').delete().eq('id', id);
    fetchItems();
  };`, editFunctions);

// 4. Change Lançar behavior to insert multiple
const handleLancarOld = `    // Insert transaction
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
      });`;

const handleLancarNew = `    // Insert one transaction per selected item
    const transactionsToInsert = items
      .filter(i => selectedIds.has(i.id))
      .map(item => ({
        profile_id: activeProfileId,
        descricao: \`Salário: \${item.descricao}\`,
        tipo: 'receita',
        valor: item.valor,
        data: dataStr,
        status: 'pago',
        forma_pagamento: 'pix'
      }));

    const { error } = await supabase
      .from('transacoes')
      .insert(transactionsToInsert);`;
content = content.replace(handleLancarOld, handleLancarNew);

// 5. Render Edit Mode in the list
const listRenderOld = `                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleSelection(item.id)}
                      className={\`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 \${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-transparent hover:border-slate-400'}\`}
                      title={isSelected ? "Incluído no Lançamento" : "Não será lançado"}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </button>
                    <div className="flex flex-col">
                       <span className={\`text-sm font-semibold transition-colors \${isSelected ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 line-through'}\`}>
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
                </div>`;

const listRenderNew = `                <div key={item.id} className="flex flex-col gap-2">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <input 
                        type="text" 
                        value={editNome}
                        onChange={e => setEditNome(e.target.value)}
                        className="flex-1 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2 py-1.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500"
                      />
                      <input 
                        type="text" 
                        value={editValor}
                        onChange={e => setEditValor(e.target.value)}
                        className="w-20 sm:w-24 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2 py-1.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500"
                      />
                      <button onClick={handleSaveEdit} className="text-emerald-500 p-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleSelection(item.id)}
                          className={\`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 \${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-transparent hover:border-slate-400'}\`}
                          title={isSelected ? "Incluído no Lançamento" : "Não será lançado"}
                        >
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </button>
                        <div className="flex flex-col">
                           <span className={\`text-sm font-semibold transition-colors \${isSelected ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 line-through'}\`}>
                             {item.descricao}
                           </span>
                           {!isSelected && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ignorado no Lançamento</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={\`text-sm font-black transition-colors \${isSelected ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}\`}>{formatarValor(item.valor)}</span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                          <button 
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>`;

content = content.replace(listRenderOld, listRenderNew);

fs.writeFileSync('src/components/CalculadoraSalario.tsx', content);
