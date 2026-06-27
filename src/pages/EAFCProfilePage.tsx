import React, { useState, useEffect, useMemo } from 'react';
import { Users, Target, Shield, Activity, Save, Plus, Puzzle, Play, ArrowRight, Gift, Clock, UserPlus, Minus, Trash2, Zap, X, Star, Eye, CheckCircle2, Edit2 } from 'lucide-react';
import { SoccerBall } from '../components/SoccerBall';
import { useEAFCProfile } from '../hooks/useEAFCProfile';
import { useEAFCAthletes } from '../hooks/useEAFCAthletes';
import { useEAFCEscalado } from '../hooks/useEAFCEscalado';
import { useEAFCObservacao } from '../hooks/useEAFCObservacao';

interface GamePageProps {
  activeProfileId?: string;
}

export default function EAFCProfilePage({ activeProfileId }: GamePageProps) {
  const { eafcProfile, loading, saveFragmentos, savePercentages } = useEAFCProfile(activeProfileId);
  const { athletes, loading: athletesLoading, addAthlete, updateQuantity } = useEAFCAthletes(activeProfileId);
  const { escalados, loading: escaladosLoading, addEscalado, updateQuantity: updateQuantityEscalado } = useEAFCEscalado(activeProfileId);
  const { observacoes, loading: observacoesLoading, addObservacao, updateObservacao, deleteObservacao } = useEAFCObservacao(activeProfileId);
  
  const [amount, setAmount] = useState<string>('');
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isFragmentoModalOpen, setIsFragmentoModalOpen] = useState(false);
  
  const [editingPercentageType, setEditingPercentageType] = useState<'safe' | null>(null);
  const [safeSpendInput, setSafeSpendInput] = useState('20');
  const [safeSpendValueInput, setSafeSpendValueInput] = useState('');
  const [isSavingPercentages, setIsSavingPercentages] = useState(false);
  
  const [isAddObservacaoModalOpen, setIsAddObservacaoModalOpen] = useState(false);
  const [newObservacaoNome, setNewObservacaoNome] = useState('');
  const [newObservacaoValor, setNewObservacaoValor] = useState('');
  const [isAddingObservacao, setIsAddingObservacao] = useState(false);
  const [newObservacaoTipo, setNewObservacaoTipo] = useState<string>('Time Ideal');

  const [editingTipo, setEditingTipo] = useState<string | null>(null);
  const [newTipoName, setNewTipoName] = useState('');
  const [isUpdatingTipo, setIsUpdatingTipo] = useState(false);
  const [customTipos, setCustomTipos] = useState<string[]>([]);
  const [newListInput, setNewListInput] = useState('');
  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [isDeletingList, setIsDeletingList] = useState(false);

  const [isAthletesDisplayOpen, setIsAthletesDisplayOpen] = useState(false);
  const [isAddAthleteModalOpen, setIsAddAthleteModalOpen] = useState(false);
  const [athleteOperationType, setAthleteOperationType] = useState<'add' | 'remove' | 'transfer_out'>('add');
  const [newGer, setNewGer] = useState('');
  const [newQuantity, setNewQuantity] = useState('1');
  const [isAddingAthlete, setIsAddingAthlete] = useState(false);

  const [isEscaladosDisplayOpen, setIsEscaladosDisplayOpen] = useState(false);
  const [isAddEscaladoModalOpen, setIsAddEscaladoModalOpen] = useState(false);
  const [escaladoOperationType, setEscaladoOperationType] = useState<'add' | 'transfer_out'>('add');
  const [newEscaladoGer, setNewEscaladoGer] = useState('');
  const [newEscaladoQuantity, setNewEscaladoQuantity] = useState('1');
  const [isAddingEscalado, setIsAddingEscalado] = useState(false);

  // Daily Tasks Timer State
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    if (!activeProfileId || loading) return;

    const checkTimer = () => {
      const lastClaim = eafcProfile?.last_daily_claim;
      if (!lastClaim) {
        setCanClaim(true);
        setTimeRemaining(null);
        return;
      }

      const lastClaimDate = new Date(lastClaim);
      const now = new Date();

      const isSameDay = 
        lastClaimDate.getFullYear() === now.getFullYear() &&
        lastClaimDate.getMonth() === now.getMonth() &&
        lastClaimDate.getDate() === now.getDate();

      if (!isSameDay) {
        setCanClaim(true);
        setTimeRemaining(null);
      } else {
        setCanClaim(false);
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        
        const diff = midnight.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [activeProfileId, loading, eafcProfile?.last_daily_claim]);

  const athletesByTier = useMemo(() => {
    const tiers = [
      { label: '110-114', min: 110, max: 114, frag: 150, count: 0 },
      { label: '115', min: 115, max: 115, frag: 300, count: 0 },
      { label: '116', min: 116, max: 116, frag: 600, count: 0 },
      { label: '117', min: 117, max: 117, frag: 1500, count: 0 },
      { label: '118', min: 118, max: 118, frag: 3500, count: 0 },
      { label: '119', min: 119, max: 119, frag: 5000, count: 0 },
      { label: '120', min: 120, max: 120, frag: 10000, count: 0 },
    ];

    athletes.forEach(a => {
      for (const tier of tiers) {
        if (a.ger >= tier.min && a.ger <= tier.max) {
          tier.count += a.quantity;
        }
      }
    });

    return tiers;
  }, [athletes]);

  const escaladosByTier = useMemo(() => {
    const tiers = [
      { label: '110-114', min: 110, max: 114, frag: 150, count: 0 },
      { label: '115', min: 115, max: 115, frag: 300, count: 0 },
      { label: '116', min: 116, max: 116, frag: 600, count: 0 },
      { label: '117', min: 117, max: 117, frag: 1500, count: 0 },
      { label: '118', min: 118, max: 118, frag: 3500, count: 0 },
      { label: '119', min: 119, max: 119, frag: 5000, count: 0 },
      { label: '120', min: 120, max: 120, frag: 10000, count: 0 },
    ];

    escalados.forEach(a => {
      for (const tier of tiers) {
        if (a.ger >= tier.min && a.ger <= tier.max) {
          tier.count += a.quantity;
        }
      }
    });

    return tiers;
  }, [escalados]);

  const totalFragmentsFromAthletes = useMemo(() => {
    return athletesByTier.reduce((total, tier) => total + (tier.count * tier.frag), 0);
  }, [athletesByTier]);

  const totalFragmentsFromEscalados = useMemo(() => {
    return escaladosByTier.reduce((total, tier) => total + (tier.count * tier.frag), 0);
  }, [escaladosByTier]);

  const currentTotal = Number(eafcProfile?.fragmentos || 0);
  const baseTotalForReserve = currentTotal + totalFragmentsFromAthletes;

  useEffect(() => {
    if (eafcProfile) {
      const perc = eafcProfile.safe_spend_percentage ?? 20;
      setSafeSpendInput(perc.toString());
      setSafeSpendValueInput(Math.floor(baseTotalForReserve * (perc / 100)).toString());
    }
  }, [eafcProfile, baseTotalForReserve]);

  const handleAddObservacaoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObservacaoNome || !newObservacaoValor || !activeProfileId) return;
    
    setIsAddingObservacao(true);
    await addObservacao(
      newObservacaoNome.trim(), 
      parseInt(newObservacaoValor, 10),
      observacoes.length + 1,
      newObservacaoTipo
    );
    
    setIsAddingObservacao(false);
    setIsAddObservacaoModalOpen(false);
    setNewObservacaoNome('');
    setNewObservacaoValor('');
    setNewObservacaoTipo('Time Ideal');
  };

  const handleEditTipoSubmit = async (e: React.FormEvent, oldTipo: string) => {
    e.preventDefault();
    if (!newTipoName.trim() || newTipoName === oldTipo) {
      setEditingTipo(null);
      return;
    }
    
    setIsUpdatingTipo(true);
    const obsToUpdate = observacoes.filter(o => (o.tipo || 'Time Ideal') === oldTipo);
    await Promise.all(obsToUpdate.map(obs => updateObservacao(obs.id, { tipo: newTipoName.trim() })));
    setIsUpdatingTipo(false);
    setEditingTipo(null);
  };

  const tiposDeMeta = Array.from(new Set(['Time Ideal', 'Melhores Jogadores', ...observacoes.map(o => o.tipo || 'Time Ideal'), ...customTipos]));

  const handleQuickAdd = async (ger: number) => {
    if (!activeProfileId) return;
    await addAthlete({
      ger,
      quantity: 1
    });
  };

  const handleQuickRemove = async (minGer: number, maxGer: number) => {
    if (!activeProfileId) return;
    const athlete = athletes.find(a => {
      return a.ger >= minGer && a.ger <= maxGer;
    });
    
    if (athlete) {
      await updateQuantity(athlete.id, -1);
    }
  };

  const handleQuickAddEscalado = async (ger: number) => {
    if (!activeProfileId) return;
    await addEscalado({
      ger,
      quantity: 1
    });
  };

  const handleQuickRemoveEscalado = async (minGer: number, maxGer: number) => {
    if (!activeProfileId) return;
    const athlete = escalados.find(a => {
      return a.ger >= minGer && a.ger <= maxGer;
    });
    
    if (athlete) {
      await updateQuantityEscalado(athlete.id, -1);
      await addAthlete({
        ger: athlete.ger,
        quantity: 1
      });
    }
  };

  const handleAddAthleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGer || !activeProfileId) return;
    
    setIsAddingAthlete(true);
    const parsedGer = parseInt(newGer, 10);
    const qty = parseInt(newQuantity, 10) || 1;

    if (athleteOperationType === 'add') {
      await addAthlete({
        ger: parsedGer,
        quantity: qty
      });
    } else if (athleteOperationType === 'transfer_out') {
      const athlete = athletes.find(a => a.ger === parsedGer);
      if (athlete) {
        const moveQty = Math.min(qty, athlete.quantity);
        if (moveQty > 0) {
          await updateQuantity(athlete.id, -moveQty);
          await addEscalado({
            ger: parsedGer,
            quantity: moveQty
          });
        }
      }
    } else {
      const athlete = athletes.find(a => a.ger === parsedGer);
      if (athlete) {
        const removeQty = Math.min(qty, athlete.quantity);
        if (removeQty > 0) {
          await updateQuantity(athlete.id, -removeQty);
          
          const tier = [
            { min: 110, max: 114, frag: 150 },
            { min: 115, max: 115, frag: 300 },
            { min: 116, max: 116, frag: 600 },
            { min: 117, max: 117, frag: 1500 },
            { min: 118, max: 118, frag: 3500 },
            { min: 119, max: 119, frag: 5000 },
            { min: 120, max: 120, frag: 10000 },
          ].find(t => parsedGer >= t.min && parsedGer <= t.max);
          
          if (tier) {
            const fragmentsToAdd = removeQty * tier.frag;
            const novoTotal = Number(eafcProfile?.fragmentos || 0) + fragmentsToAdd;
            await saveFragmentos(novoTotal);
          }
        }
      }
    }
    
    setIsAddingAthlete(false);
    setIsAddAthleteModalOpen(false);
    setNewGer('');
    setNewQuantity('1');
    setAthleteOperationType('add');
  };

  const handleAddEscaladoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEscaladoGer || !activeProfileId) return;
    
    setIsAddingEscalado(true);
    const parsedGer = parseInt(newEscaladoGer, 10);
    const qty = parseInt(newEscaladoQuantity, 10) || 1;

    if (escaladoOperationType === 'add') {
      await addEscalado({
        ger: parsedGer,
        quantity: qty
      });
    } else if (escaladoOperationType === 'transfer_out') {
      const athlete = escalados.find(a => a.ger === parsedGer);
      if (athlete) {
        const moveQty = Math.min(qty, athlete.quantity);
        if (moveQty > 0) {
          await updateQuantityEscalado(athlete.id, -moveQty);
          await addAthlete({
            ger: parsedGer,
            quantity: moveQty
          });
        }
      }
    }
    
    setIsAddingEscalado(false);
    setIsAddEscaladoModalOpen(false);
    setNewEscaladoGer('');
    setNewEscaladoQuantity('1');
    setEscaladoOperationType('add');
  };

  if (!activeProfileId) return null;

  const handleClaimDaily = async () => {
    if (!canClaim || !activeProfileId) return;
    setIsSaving(true);
    
    let novoTotal = Number(eafcProfile?.fragmentos || 0) + 100;
    const nowISO = new Date().toISOString();
    const { error } = await saveFragmentos(novoTotal, nowISO);
    
    if (!error) {
      setCanClaim(false);
    }
    setIsSaving(false);
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSafeSpendInput(val);
    const perc = parseFloat(val);
    if (!isNaN(perc)) {
       setSafeSpendValueInput(Math.floor(baseTotalForReserve * (perc / 100)).toString());
    } else {
       setSafeSpendValueInput('');
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSafeSpendValueInput(val);
    const numVal = parseFloat(val);
    if (!isNaN(numVal) && baseTotalForReserve > 0) {
       const perc = (numVal / baseTotalForReserve) * 100;
       setSafeSpendInput(Math.round(perc).toString());
    } else {
       setSafeSpendInput('');
    }
  };

  const handleSavePercentages = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPercentages(true);
    
    const safe = parseInt(safeSpendInput, 10);
    
    if (isNaN(safe)) {
      setIsSavingPercentages(false);
      return;
    }

    const { error } = await savePercentages(safe);
    if (!error) {
      setEditingPercentageType(null);
    }
    setIsSavingPercentages(false);
  };

  const handleOpenModal = () => {
    setAmount('');
    setOperationType('add');
    setIsFragmentoModalOpen(true);
  };

  const handleSaveFragmentos = async () => {
    if (!activeProfileId) return;
    setIsSaving(true);
    setSaveMessage('');
    
    const delta = parseInt(amount, 10) || 0;
    let novoTotal = Number(eafcProfile?.fragmentos || 0);
    
    if (operationType === 'add') {
      novoTotal += delta;
    } else {
      novoTotal -= delta;
      if (novoTotal < 0) novoTotal = 0;
    }
    
    const { error } = await saveFragmentos(novoTotal);
    
    setIsSaving(false);
    if (error) {
      setSaveMessage('Erro ao salvar.');
    } else {
      setIsFragmentoModalOpen(false);
    }
  };

  const delta = parseInt(amount, 10) || 0;
  let novaQtd = currentTotal;
  if (operationType === 'add') {
    novaQtd += delta;
  } else {
    novaQtd -= delta;
    if (novaQtd < 0) novaQtd = 0;
  }

  const totalGeral = currentTotal + totalFragmentsFromAthletes + totalFragmentsFromEscalados;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 text-[#0F172A] dark:text-white font-sans">
      <div className="flex justify-between items-center px-2 min-h-12 flex-wrap gap-4">
        <div className="items-center min-w-0 flex gap-2">
          <SoccerBall size={24} className="text-[#16a34a]" />
          <span className="font-extrabold text-[#16a34a] tracking-tight uppercase truncate">EA FC Mobile</span>
        </div>
        
        {/* Daily Tasks Pill */}
        {!loading && (
          <div className="flex items-center bg-white dark:bg-[#0F1829] rounded-full p-1.5 pl-2 pr-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="bg-[#16a34a] p-1 rounded-full border-[3px] border-[#15803d] mr-3 flex items-center justify-center w-8 h-8 shadow-[0_0_10px_rgba(22,163,74,0.3)]">
              <Gift size={16} className="text-white fill-white" />
            </div>
            {canClaim ? (
              <button 
                onClick={handleClaimDaily}
                disabled={isSaving}
                className="text-[#16a34a] dark:text-[#bbf7d0] hover:text-[#15803d] dark:hover:text-white font-black text-sm tracking-wider uppercase transition-colors"
              >
                {isSaving ? 'Resgatando...' : 'Resgatar +100'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-500 dark:text-[#94A3B8]" />
                <span className="text-slate-600 dark:text-[#94A3B8] font-mono font-bold text-sm tracking-widest">{timeRemaining}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-[#16a34a] to-[#22c55e] p-8 rounded-[24px] text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <SoccerBall size={160} />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic drop-shadow-md mb-2">Fragmentos</h2>
            <p className="text-[#bbf7d0] font-bold max-w-md">Gerencie seu saldo e calcule o potencial de fragmentos dos seus atletas.</p>
          </div>
        </div>
      </div>
      
      {/* Fragmentos Indicator (Game UI Style) */}
      {!loading && (
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center w-full">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 w-full xl:w-auto">
            <div className="flex items-center justify-between sm:justify-start bg-[#0F1829] rounded-full p-1 sm:p-1.5 pl-1.5 sm:pl-2 pr-1.5 sm:pr-2 border border-[#1E293B] shadow-sm">
            <div className="bg-[#00D1FF] p-1 rounded-full border-2 sm:border-[3px] border-[#0896B7] mr-1 sm:mr-3 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 shadow-[0_0_10px_rgba(0,209,255,0.3)]">
              <Puzzle size={14} className="text-white fill-white sm:w-4 sm:h-4" />
            </div>
            <span className="text-white font-black text-sm sm:text-lg tracking-wider mr-1 sm:mr-3 drop-shadow-md truncate">
              {currentTotal.toLocaleString('pt-BR')}
            </span>
            <button 
              onClick={handleOpenModal} 
              className="bg-[#94A3B8] hover:bg-white text-[#0F1829] rounded-full p-0.5 sm:p-1 transition-colors shadow-sm shrink-0"
              title="Adicionar ou Gastar Fragmentos"
            >
              <Plus size={16} className="sm:w-5 sm:h-5" strokeWidth={4} />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-start bg-[#0F1829] rounded-full p-1 sm:p-1.5 pl-1.5 sm:pl-2 pr-1.5 sm:pr-2 border border-[#1E293B] shadow-sm">
            <button 
              onClick={() => setIsAthletesDisplayOpen(!isAthletesDisplayOpen)}
              className="bg-[#00D1FF] p-1 rounded-full border-2 sm:border-[3px] border-[#0896B7] mr-1 sm:mr-3 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 shadow-[0_0_10px_rgba(0,209,255,0.3)] hover:brightness-110 transition-all shrink-0"
              title="Alternar exibição de atletas"
            >
              <Users size={14} className="text-white fill-white sm:w-4 sm:h-4" />
            </button>
            <span className="text-white font-black text-sm sm:text-lg tracking-wider mr-1 sm:mr-3 drop-shadow-md truncate">
              {totalFragmentsFromAthletes.toLocaleString('pt-BR')}
            </span>
            <button 
              onClick={() => setIsAddAthleteModalOpen(true)} 
              className="bg-[#94A3B8] hover:bg-white text-[#0F1829] rounded-full p-0.5 sm:p-1 transition-colors shadow-sm shrink-0"
              title="Adicionar Atleta Manualmente"
            >
              <Plus size={16} className="sm:w-5 sm:h-5" strokeWidth={4} />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-start bg-[#0F1829] rounded-full p-1 sm:p-1.5 pl-1.5 sm:pl-2 pr-1.5 sm:pr-2 border border-[#1E293B] shadow-sm">
            <button 
              onClick={() => setIsEscaladosDisplayOpen(!isEscaladosDisplayOpen)}
              className="bg-[#EF4444] p-1 rounded-full border-2 sm:border-[3px] border-[#B91C1C] mr-1 sm:mr-3 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:brightness-110 transition-all shrink-0"
              title="Alternar exibição de escalados"
            >
              <Shield size={14} className="text-white fill-white sm:w-4 sm:h-4" />
            </button>
            <span className="text-white font-black text-sm sm:text-lg tracking-wider mr-1 sm:mr-3 drop-shadow-md truncate">
              {totalFragmentsFromEscalados.toLocaleString('pt-BR')}
            </span>
            <button 
              onClick={() => setIsAddEscaladoModalOpen(true)} 
              className="bg-[#94A3B8] hover:bg-white text-[#0F1829] rounded-full p-0.5 sm:p-1 transition-colors shadow-sm shrink-0"
              title="Adicionar Escalado Manualmente"
            >
              <Plus size={16} className="sm:w-5 sm:h-5" strokeWidth={4} />
            </button>
          </div>



          </div>

          <div className="flex flex-wrap gap-4 w-full sm:w-auto mt-2 xl:mt-0">
            {/* Disponível Panel */}
            <div className="flex items-center bg-[#0F1829] rounded-full p-1.5 px-4 border border-[#1E293B] shadow-sm">
              <div className="flex -space-x-3 mr-4">
                <div className="bg-[#00D1FF] p-1.5 rounded-full border-2 border-[#0F1829] flex items-center justify-center w-9 h-9 relative z-20 shadow-md">
                  <Puzzle size={16} className="text-white fill-white" />
                </div>
                <div className="bg-[#00D1FF] p-1.5 rounded-full border-2 border-[#0F1829] flex items-center justify-center w-9 h-9 relative z-10 shadow-md">
                  <Users size={16} className="text-white fill-white" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5">Livre</span>
                <span className="text-[#10B981] font-black text-xl tracking-wider leading-none drop-shadow-md">
                  {(currentTotal + totalFragmentsFromAthletes).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Sum Panel */}
            <div className="flex items-center bg-[#0F1829] rounded-full p-1.5 px-4 border border-[#1E293B] shadow-sm">
              <div className="flex -space-x-3 mr-4">
                <div className="bg-[#00D1FF] p-1.5 rounded-full border-2 border-[#0F1829] flex items-center justify-center w-9 h-9 relative z-30 shadow-md">
                  <Puzzle size={16} className="text-white fill-white" />
                </div>
                <div className="bg-[#00D1FF] p-1.5 rounded-full border-2 border-[#0F1829] flex items-center justify-center w-9 h-9 relative z-20 shadow-md">
                  <Users size={16} className="text-white fill-white" />
                </div>
                <div className="bg-[#EF4444] p-1.5 rounded-full border-2 border-[#0F1829] flex items-center justify-center w-9 h-9 relative z-10 shadow-md">
                  <Shield size={16} className="text-white fill-white" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5">Total Geral</span>
                <span className="text-[#FBBF24] font-black text-xl tracking-wider leading-none drop-shadow-md">
                  {(currentTotal + totalFragmentsFromAthletes + totalFragmentsFromEscalados).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Gastos Conscientes */}
            <button 
              onClick={() => setEditingPercentageType('safe')}
              className="flex items-center bg-[#0F1829] hover:bg-[#1E293B] transition-colors cursor-pointer rounded-full p-1.5 px-4 border border-[#1E293B] shadow-sm text-left"
            >
              <div className="flex mr-4">
                <div className="bg-[#10B981] p-1.5 rounded-full border-2 border-[#0F1829] flex items-center justify-center w-9 h-9 shadow-md">
                  <Target size={16} className="text-white fill-white" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5">Reserva ({eafcProfile?.safe_spend_percentage ?? 20}%)</span>
                <span className="text-[#10B981] font-black text-xl tracking-wider leading-none drop-shadow-md">
                  {Math.floor((currentTotal + totalFragmentsFromAthletes) * ((eafcProfile?.safe_spend_percentage ?? 20) / 100)).toLocaleString('pt-BR')}
                </span>
              </div>
            </button>

            {/* Adicionar Meta */}
            <div className="flex items-center">
                <button 
                  onClick={() => setIsAddListModalOpen(true)}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors p-2 rounded-full border border-[#1E293B] flex items-center justify-center w-10 h-10 shadow-md cursor-pointer"
                  title="Nova Lista"
                >
                  <Plus size={20} className="text-white" strokeWidth={3} />
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Observações Sections by Tipo */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiposDeMeta.length === 0 ? (
          <div className="bg-[#1E293B] rounded-[24px] p-6 border border-[#334155] shadow-xl relative w-full text-center py-8">
             <Eye size={24} className="mx-auto text-slate-500 mb-2" />
             <h4 className="text-slate-400 font-bold mb-1 text-sm">Nenhum jogador na meta</h4>
             <p className="text-slate-600 text-xs">Adicione os próximos jogadores que você deseja comprar.</p>
          </div>
        ) : (
          tiposDeMeta.map(tipo => {
            const lista = observacoes.filter(o => (o.tipo || 'Time Ideal') === tipo);
            return (
              <div key={tipo} className="bg-[#1E293B] rounded-[24px] p-6 border border-[#334155] shadow-xl relative w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 group min-h-[32px]">
                    <Star size={20} className="text-[#8B5CF6] fill-[#8B5CF6] shrink-0" />
                    {editingTipo === tipo ? (
                      <form onSubmit={(e) => handleEditTipoSubmit(e, tipo)} className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <input 
                          autoFocus 
                          value={newTipoName} 
                          onChange={e => setNewTipoName(e.target.value)} 
                          className="bg-[#0F1829] text-white px-3 py-1 rounded-lg border border-[#334155] text-sm font-black uppercase tracking-wider w-full outline-none focus:border-[#8B5CF6]" 
                          placeholder="Nome da categoria"
                        />
                        <button type="submit" disabled={isUpdatingTipo} className="text-green-500 hover:text-green-400 disabled:opacity-50 transition-colors p-1 bg-[#0F1829] rounded-full border border-[#1E293B]">
                          <CheckCircle2 size={18} />
                        </button>
                        <button type="button" onClick={() => setEditingTipo(null)} disabled={isUpdatingTipo} className="text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors p-1 bg-[#0F1829] rounded-full border border-[#1E293B]">
                          <X size={18} />
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="flex flex-col">
                          <h4 className="text-white font-black uppercase tracking-wider text-sm drop-shadow-md">
                            {tipo}
                          </h4>
                          <span className="text-[#FBBF24] flex items-center gap-1 text-xs font-bold mt-0.5 opacity-90 tracking-widest">
                            {lista.reduce((sum, obs) => sum + obs.valor, 0).toLocaleString('pt-BR')} <Puzzle size={12} />
                          </span>
                        </div>
                        <button 
                          onClick={() => { setEditingTipo(tipo); setNewTipoName(tipo); }} 
                          className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F1829] p-1 rounded-full border border-[#1E293B]"
                          title="Renomear categoria"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => {
                            setNewObservacaoTipo(tipo);
                            setIsAddObservacaoModalOpen(true);
                          }}
                          className="text-slate-500 hover:text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F1829] p-1 rounded-full border border-[#1E293B] ml-2"
                          title={`Adicionar jogador a ${tipo}`}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => setListToDelete(tipo)}
                          className="text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F1829] p-1 rounded-full border border-[#1E293B]"
                          title={`Excluir ${tipo}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  {lista.length === 0 ? (
                    <div className="text-center py-6 bg-[#0F1829] rounded-2xl border border-[#1E293B]">
                      <Eye size={24} className="mx-auto text-slate-500 mb-2" />
                      <h4 className="text-slate-400 font-bold mb-1 text-sm">Nenhum jogador</h4>
                      <p className="text-slate-600 text-xs">Adicione jogadores à {tipo}.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lista.map((obs) => {
                        const totalGeralParaCompra = currentTotal + totalFragmentsFromAthletes;
                        const valorReserva = Math.floor(totalGeralParaCompra * ((eafcProfile?.safe_spend_percentage ?? 20) / 100));
                        const saldoAposCompra = totalGeralParaCompra - obs.valor;
                        
                        const podeComprarSeguro = saldoAposCompra >= valorReserva;
                        const podeComprarRisco = !podeComprarSeguro && totalGeralParaCompra >= obs.valor;
                        
                        return (
                          <div 
                            key={obs.id} 
                            className="relative flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all bg-[#0F1829] border-[#1E293B] shadow-xl"
                          >
                            <button 
                              onClick={() => deleteObservacao(obs.id)}
                              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-500 bg-[#1E293B] hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Remover"
                            >
                              <Trash2 size={16} strokeWidth={2} />
                            </button>

                            <h4 className="font-black text-2xl md:text-3xl mt-4 mb-2 text-white">
                              {obs.nome}
                            </h4>
                            
                            <div className="flex flex-col items-center">
                              <span className={`font-black text-xl md:text-2xl flex items-center gap-1.5 ${
                                podeComprarSeguro ? 'text-[#10B981]' : podeComprarRisco ? 'text-[#F59E0B]' : 'text-[#8B5CF6]'
                              }`}>
                                {obs.valor.toLocaleString('pt-BR')} <Puzzle size={20} />
                              </span>
                              <span className={`text-xs mt-1 font-bold uppercase tracking-widest ${
                                podeComprarSeguro ? 'text-[#10B981]' : podeComprarRisco ? 'text-[#F59E0B]' : 'text-slate-500'
                              }`}>
                                {podeComprarSeguro ? 'Compra Segura!' : podeComprarRisco ? 'Risco (Sem Fundo)!' : 'Faltam Fragmentos'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Athletes Section */}
      {isAthletesDisplayOpen && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Users className="text-[#00D1FF]" />
              <h3 className="font-black uppercase text-lg text-slate-800 dark:text-white">Meus Atletas</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F1829] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Adicione rapidamente atletas focando apenas no GER Base para calcular seu potencial de fragmentos estelares.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {athletesByTier.map((tier) => (
                <div key={tier.label} className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center shadow-sm relative overflow-hidden group transition-all hover:border-[#00D1FF]/50">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D1FF]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">GER {tier.label}</span>
                  <div className="flex items-center gap-1 text-[#00D1FF] font-black text-xl mb-4">
                    {tier.frag.toLocaleString('pt-BR')} <Puzzle size={16} className="fill-[#00D1FF]/20" />
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-[#0F1829] rounded-xl p-1.5 w-full justify-between border border-slate-200 dark:border-slate-800 shadow-inner">
                    <button 
                      onClick={() => handleQuickRemove(tier.min, tier.max)} 
                      disabled={tier.count === 0}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Minus size={20} strokeWidth={3} />
                    </button>
                    <span className="font-black text-slate-800 dark:text-white text-xl w-8 text-center">{tier.count}</span>
                    <button 
                      onClick={() => handleQuickAdd(tier.min)} 
                      className="w-10 h-10 flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a]/10 rounded-lg transition-colors"
                    >
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Escalados Section */}
      {isEscaladosDisplayOpen && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Shield className="text-[#EF4444]" />
              <h3 className="font-black uppercase text-lg text-slate-800 dark:text-white">Escalados / Inegociáveis</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F1829] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Adicione os atletas bloqueados que não podem ser liberados para fragmentos estelares.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {escaladosByTier.map((tier) => (
                <div key={tier.label} className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center shadow-sm relative overflow-hidden group transition-all hover:border-[#EF4444]/50">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EF4444]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">GER {tier.label}</span>
                  <div className="flex items-center gap-1 text-[#EF4444] font-black text-xl mb-4">
                    {tier.frag.toLocaleString('pt-BR')} <Puzzle size={16} className="fill-[#EF4444]/20" />
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-[#0F1829] rounded-xl p-1.5 w-full justify-between border border-slate-200 dark:border-slate-800 shadow-inner">
                    <button 
                      onClick={() => handleQuickRemoveEscalado(tier.min, tier.max)} 
                      disabled={tier.count === 0}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Minus size={20} strokeWidth={3} />
                    </button>
                    <span className="font-black text-slate-800 dark:text-white text-xl w-8 text-center">{tier.count}</span>
                    <button 
                      onClick={() => handleQuickAddEscalado(tier.min)} 
                      className="w-10 h-10 flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a]/10 rounded-lg transition-colors"
                    >
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* Modal de Fragmentos */}
      {isFragmentoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0F1829] rounded-[24px] p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="bg-[#00D1FF] p-2 rounded-full border-4 border-[#0896B7] flex items-center justify-center w-16 h-16 shadow-[0_0_15px_rgba(0,209,255,0.4)]">
                <Puzzle size={32} className="text-white fill-white" />
              </div>
            </div>

            <div className="flex gap-3 justify-center mb-6">
              <button
                onClick={() => setOperationType('add')}
                className={`flex-1 py-2 px-4 rounded-full font-bold text-sm transition-all duration-200 border ${
                  operationType === 'add'
                    ? 'border-[#16a34a] text-[#16a34a] bg-[#16a34a]/10'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                + Fragmentos
              </button>
              <button
                onClick={() => setOperationType('subtract')}
                className={`flex-1 py-2 px-4 rounded-full font-bold text-sm transition-all duration-200 border ${
                  operationType === 'subtract'
                    ? 'border-red-500 text-red-500 bg-red-500/10'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                Gastar
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 text-center">Quantidade</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full text-center bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-4 text-3xl font-black outline-none focus:ring-2 transition-all text-slate-800 dark:text-white mb-2 ${
                  operationType === 'add' ? 'focus:ring-[#16a34a]' : 'focus:ring-red-500'
                }`}
                placeholder="0"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-100 dark:bg-[#1E293B] p-4 rounded-xl mb-4 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col items-center">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Atual</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold text-lg">{currentTotal}</span>
              </div>
              <ArrowRight className="text-slate-400" size={20} />
              <div className="flex flex-col items-center">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Nova Qtd</span>
                <span className={`font-bold text-lg ${operationType === 'add' ? 'text-[#16a34a]' : 'text-red-500'}`}>{novaQtd}</span>
              </div>
            </div>
            {saveMessage && (
              <p className="text-red-500 text-xs font-bold text-center mb-4">{saveMessage}</p>
            )}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsFragmentoModalOpen(false)}
                className="flex-1 bg-slate-200 dark:bg-[#1E293B] hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveFragmentos}
                disabled={isSaving}
                className={`flex-1 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center ${
                  operationType === 'add' ? 'bg-[#16a34a] hover:bg-[#15803d]' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Atleta */}
      {isAddAthleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0F1829] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
            <button 
              onClick={() => setIsAddAthleteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={24} strokeWidth={2} />
            </button>
            
            <div className="flex justify-center mb-6 mt-4">
              <div className="bg-[#00D1FF] p-2 rounded-full border-4 border-[#0896B7] flex items-center justify-center w-16 h-16 shadow-[0_0_15px_rgba(0,209,255,0.4)]">
                <Users size={32} className="text-white fill-white" />
              </div>
            </div>

            <div className="flex gap-2 justify-center mb-6">
              <button
                type="button"
                onClick={() => setAthleteOperationType('add')}
                className={`flex-1 min-w-0 py-2 px-1 rounded-xl font-bold text-xs transition-all duration-200 border ${
                  athleteOperationType === 'add'
                    ? 'border-[#16a34a] text-[#16a34a] bg-[#16a34a]/10'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                + Jogador
              </button>
              <button
                type="button"
                onClick={() => setAthleteOperationType('transfer_out')}
                className={`flex-1 min-w-0 py-2 px-1 rounded-xl font-bold text-xs transition-all duration-200 border ${
                  athleteOperationType === 'transfer_out'
                    ? 'border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/10'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                Escalados →
              </button>
              <button
                type="button"
                onClick={() => setAthleteOperationType('remove')}
                className={`flex-1 min-w-0 py-2 px-1 rounded-xl font-bold text-xs transition-all duration-200 border ${
                  athleteOperationType === 'remove'
                    ? 'border-red-500 text-red-500 bg-red-500/10'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                Liberar
              </button>
            </div>
            
            <form onSubmit={handleAddAthleteSubmit}>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">GER</label>
                  <select
                    value={newGer}
                    onChange={(e) => setNewGer(e.target.value)}
                    className="w-full text-center bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-3 font-bold outline-none focus:ring-2 focus:ring-[#00D1FF] text-slate-800 dark:text-white"
                    required
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="110">150 (110-114)</option>
                    <option value="115">300 (115)</option>
                    <option value="116">600 (116)</option>
                    <option value="117">1.500 (117)</option>
                    <option value="118">3.500 (118)</option>
                    <option value="119">5.000 (119)</option>
                    <option value="120">10.000 (120)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full text-center bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-3 font-bold outline-none focus:ring-2 focus:ring-[#00D1FF] text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              {newGer && (
                <div className="flex items-center justify-between bg-slate-100 dark:bg-[#1E293B] p-4 rounded-xl mb-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Atual</span>
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-lg">
                      {athletes.find(a => a.ger === parseInt(newGer, 10))?.quantity || 0}
                    </span>
                  </div>
                  <ArrowRight className="text-slate-400" size={20} />
                  <div className="flex flex-col items-center">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Nova Qtd</span>
                    <span className={`font-bold text-lg ${athleteOperationType === 'remove' || athleteOperationType === 'transfer_out' ? 'text-red-500' : 'text-[#16a34a]'}`}>
                      {athleteOperationType !== 'remove' && athleteOperationType !== 'transfer_out'
                        ? (athletes.find(a => a.ger === parseInt(newGer, 10))?.quantity || 0) + (parseInt(newQuantity, 10) || 0)
                        : Math.max(0, (athletes.find(a => a.ger === parseInt(newGer, 10))?.quantity || 0) - (parseInt(newQuantity, 10) || 0))}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddAthleteModalOpen(false)}
                  className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isAddingAthlete || !newGer}
                  className={`flex-1 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center disabled:opacity-50 ${
                    athleteOperationType === 'remove' ? 'bg-red-500 hover:bg-red-600' : (athleteOperationType === 'transfer_out' ? 'bg-[#f59e0b] hover:bg-[#d97706]' : 'bg-[#16a34a] hover:bg-[#15803d]')
                  }`}
                >
                  {isAddingAthlete ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Escalado */}
      {isAddEscaladoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0F1829] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
            <button 
              onClick={() => setIsAddEscaladoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={24} strokeWidth={2} />
            </button>
            
            <div className="flex justify-center mb-6 mt-4">
              <div className="bg-[#EF4444] p-2 rounded-full border-4 border-[#B91C1C] flex items-center justify-center w-16 h-16 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <Shield size={32} className="text-white fill-white" />
              </div>
            </div>

            <div className="flex gap-2 justify-center mb-6">
              <button
                type="button"
                onClick={() => setEscaladoOperationType('add')}
                className={`flex-1 min-w-0 py-2 px-1 rounded-xl font-bold text-xs transition-all duration-200 border ${
                  escaladoOperationType === 'add'
                    ? 'border-[#16a34a] text-[#16a34a] bg-[#16a34a]/10'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                + Jogador
              </button>
              <button
                type="button"
                onClick={() => setEscaladoOperationType('transfer_out')}
                className={`flex-1 min-w-0 py-2 px-1 rounded-xl font-bold text-xs transition-all duration-200 border ${
                  escaladoOperationType === 'transfer_out'
                    ? 'border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/10'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                Atletas →
              </button>
            </div>
            
            <form onSubmit={handleAddEscaladoSubmit}>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">GER</label>
                  <select
                    value={newEscaladoGer}
                    onChange={(e) => setNewEscaladoGer(e.target.value)}
                    className="w-full text-center bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-3 font-bold outline-none focus:ring-2 focus:ring-[#EF4444] text-slate-800 dark:text-white"
                    required
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="110">150 (110-114)</option>
                    <option value="115">300 (115)</option>
                    <option value="116">600 (116)</option>
                    <option value="117">1.500 (117)</option>
                    <option value="118">3.500 (118)</option>
                    <option value="119">5.000 (119)</option>
                    <option value="120">10.000 (120)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={newEscaladoQuantity}
                    onChange={(e) => setNewEscaladoQuantity(e.target.value)}
                    className="w-full text-center bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-3 font-bold outline-none focus:ring-2 focus:ring-[#EF4444] text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              {newEscaladoGer && (
                <div className="flex items-center justify-between bg-slate-100 dark:bg-[#1E293B] p-4 rounded-xl mb-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Atual</span>
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-lg">
                      {escalados.find(a => a.ger === parseInt(newEscaladoGer, 10))?.quantity || 0}
                    </span>
                  </div>
                  <ArrowRight className="text-slate-400" size={20} />
                  <div className="flex flex-col items-center">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Nova Qtd</span>
                    <span className={`font-bold text-lg ${escaladoOperationType === 'transfer_out' ? 'text-red-500' : 'text-[#16a34a]'}`}>
                      {escaladoOperationType !== 'transfer_out'
                        ? (escalados.find(a => a.ger === parseInt(newEscaladoGer, 10))?.quantity || 0) + (parseInt(newEscaladoQuantity, 10) || 0)
                        : Math.max(0, (escalados.find(a => a.ger === parseInt(newEscaladoGer, 10))?.quantity || 0) - (parseInt(newEscaladoQuantity, 10) || 0))}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEscaladoModalOpen(false)}
                  className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isAddingEscalado || !newEscaladoGer}
                  className={`flex-1 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center disabled:opacity-50 ${
                    escaladoOperationType === 'transfer_out' ? 'bg-[#f59e0b] hover:bg-[#d97706]' : 'bg-[#16a34a] hover:bg-[#15803d]'
                  }`}
                >
                  {isAddingEscalado ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Percentages Modal */}
      {editingPercentageType !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0F1829] rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button 
              onClick={() => setEditingPercentageType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>
            
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full text-white shadow-lg bg-[#10B981]">
                <Target size={32} />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-center text-slate-800 dark:text-white uppercase tracking-wider mb-6">
              Configurar Fundo de Reserva
            </h3>
            
            <form onSubmit={handleSavePercentages}>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Porcentagem (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={safeSpendInput}
                      onChange={handlePercentageChange}
                      placeholder="Ex: 20"
                      className="w-full text-center bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-3 font-bold outline-none focus:ring-2 focus:ring-[#10B981] text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Valor (Frags)</label>
                    <input
                      type="number"
                      min="0"
                      value={safeSpendValueInput}
                      onChange={handleValueChange}
                      placeholder="Ex: 15000"
                      className="w-full text-center bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-3 font-bold outline-none focus:ring-2 focus:ring-[#10B981] text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500 text-center">
                  Defina a porcentagem ou o valor específico dos seus fragmentos que você deseja manter intocável.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPercentageType(null)}
                  className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingPercentages}
                  className="flex-1 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center disabled:opacity-50 bg-[#10B981] hover:bg-[#059669]"
                >
                  {isSavingPercentages ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Observacao Modal */}
      {isAddObservacaoModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0F1829] rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button 
              onClick={() => setIsAddObservacaoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>
            
            <div className="flex justify-center mb-4">
              <div className="bg-[#8B5CF6] p-3 rounded-full text-white shadow-lg">
                <Eye size={32} />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-center text-slate-800 dark:text-white uppercase tracking-wider mb-6">
              Adicionar à {newObservacaoTipo}
            </h3>
            
            <form onSubmit={handleAddObservacaoSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nome do Jogador</label>
                  <input
                    type="text"
                    value={newObservacaoNome}
                    onChange={(e) => setNewObservacaoNome(e.target.value)}
                    placeholder="Nome do jogador..."
                    className="w-full bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Custo (Fragmentos)</label>
                  <input
                    type="number"
                    min="1"
                    value={newObservacaoValor}
                    onChange={(e) => setNewObservacaoValor(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddObservacaoModalOpen(false)}
                  className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isAddingObservacao || !newObservacaoNome || !newObservacaoValor}
                  className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isAddingObservacao ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add List Modal */}
      {isAddListModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0F1829] rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button 
              onClick={() => setIsAddListModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>
            
            <div className="flex justify-center mb-4">
              <div className="bg-[#8B5CF6] p-3 rounded-full text-white shadow-lg">
                <Eye size={32} />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-center text-slate-800 dark:text-white uppercase tracking-wider mb-6">
              Nova Lista
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (newListInput.trim()) {
                setCustomTipos(prev => [...prev, newListInput.trim()]);
                setNewListInput('');
                setIsAddListModalOpen(false);
              }
            }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nome da Lista</label>
                  <input
                    type="text"
                    value={newListInput}
                    onChange={(e) => setNewListInput(e.target.value)}
                    placeholder="Ex: Meus Atacantes..."
                    className="w-full bg-slate-100 dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddListModalOpen(false)}
                  className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newListInput.trim()}
                  className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete List Confirmation Modal */}
      {listToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0F1829] rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button 
              onClick={() => setListToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>
            
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 p-3 rounded-full text-white shadow-lg">
                <Trash2 size={32} />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-center text-slate-800 dark:text-white uppercase tracking-wider mb-2">
              Excluir Lista?
            </h3>
            <p className="text-center text-slate-500 text-sm font-medium mb-6">
              Deseja realmente excluir a lista <strong className="text-white">{listToDelete}</strong> e todos os jogadores nela?
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setListToDelete(null)}
                className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
                disabled={isDeletingList}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsDeletingList(true);
                  try {
                    const obsToUpdate = observacoes.filter(o => (o.tipo || 'Time Ideal') === listToDelete);
                    await Promise.all(obsToUpdate.map(obs => deleteObservacao(obs.id)));
                    setCustomTipos(prev => prev.filter(t => t !== listToDelete));
                    setListToDelete(null);
                  } finally {
                    setIsDeletingList(false);
                  }
                }}
                disabled={isDeletingList}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isDeletingList ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
