import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Pencil, Trash2, X, FolderOpen, Archive, RotateCcw, ChevronDown, Search, Pipette, TrendingUp, Tag, TrendingDown,
  User, Building2, Home, Lock,
  CircleDollarSign, BadgeDollarSign, BanknoteArrowUp, Heart, Signature,
  ShoppingCart, Gamepad2, TvMinimalPlay, CreditCard, TrendingUpDown, HandCoins, TicketCheck,
  CalendarSync, HeartPulse, IdCardLanyard, Wifi, TicketPercent, Zap, Droplet, LayoutPanelLeft, TruckElectric
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { SupabaseProfile } from '../hooks/useProfiles';
import { useCategories, Category } from '../hooks/useCategories';
import { motion, AnimatePresence } from 'motion/react';
import IconPicker from '../components/IconPicker';

interface CategoriesProps {
  activeProfile: SupabaseProfile | null;
}

export const COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#16A34A', '#2563EB', '#7C3AED',
  '#EC4899', '#0F172A', '#06B6D4', '#84CC16', '#F59E0B', '#6B7280'
];

export const ICONS: Array<{ name: string; label: string; component: any }> = [
  { name: 'User', label: 'usuário perfil pessoa', component: User },
  { name: 'Building2', label: 'prédio empresa negócio', component: Building2 },
  { name: 'Home', label: 'casa moradia', component: Home },
  { name: 'CircleDollarSign', label: 'dinheiro cifrão financeiro', component: CircleDollarSign },
  { name: 'BadgeDollarSign', label: 'medalha dólar prêmio', component: BadgeDollarSign },
  { name: 'BanknoteArrowUp', label: 'nota dinheiro enviar pagar', component: BanknoteArrowUp },
  { name: 'Heart', label: 'coração saúde amor', component: Heart },
  { name: 'Signature', label: 'assinatura caneta documento', component: Signature },
  { name: 'ShoppingCart', label: 'carrinho compras loja', component: ShoppingCart },
  { name: 'Gamepad2', label: 'videogame jogo controle', component: Gamepad2 },
  { name: 'TvMinimalPlay', label: 'tv tela vídeo assistir', component: TvMinimalPlay },
  { name: 'CreditCard', label: 'cartão crédito débito', component: CreditCard },
  { name: 'TrendingUpDown', label: 'gráfico tendência oscilação', component: TrendingUpDown },
  { name: 'HandCoins', label: 'mão moedas dar receber', component: HandCoins },
  { name: 'TicketCheck', label: 'ticket ingresso cheque validar', component: TicketCheck },
  { name: 'CalendarSync', label: 'calendário sincronizar data', component: CalendarSync },
  { name: 'HeartPulse', label: 'coração pulso saúde vida', component: HeartPulse },
  { name: 'IdCardLanyard', label: 'crachá documento identificação cordão', component: IdCardLanyard },
  { name: 'Wifi', label: 'wifi internet conexão rede', component: Wifi },
  { name: 'TicketPercent', label: 'ticket cupom desconto porcentagem', component: TicketPercent },
  { name: 'Zap', label: 'raio energia eletricidade rápido', component: Zap },
  { name: 'Droplet', label: 'gota água líquido umidade', component: Droplet },
  { name: 'TruckElectric', label: 'caminhão elétrico frete transporte sustentável', component: TruckElectric }
];

export default function Categories({ activeProfile }: CategoriesProps) {
  const { 
    categories, 
    tags, 
    loading, 
    criarCategoria, 
    editarCategoria, 
    excluirCategoria, 
    criarTag, 
    excluirTag,
    archiveCategory,
    unarchiveCategory,
    setCategories
  } = useCategories(activeProfile?.id);

  const dragCategoryItem = useRef<number | null>(null);
  const dragCategoryOverItem = useRef<number | null>(null);

  const handleSortCategory = async (tipo: 'receita' | 'despesa') => {
    if (dragCategoryItem.current === null || dragCategoryOverItem.current === null) return;
    if (dragCategoryItem.current === dragCategoryOverItem.current) return;

    let itemsToSort = tipo === 'receita' ? [...receitas] : [...despesas];
    
    const draggedItemContent = itemsToSort[dragCategoryItem.current];
    itemsToSort.splice(dragCategoryItem.current, 1);
    itemsToSort.splice(dragCategoryOverItem.current, 0, draggedItemContent);
    
    const updatedSortedItems = itemsToSort.map((item, index) => ({ ...item, ordem: index }));
    
    // Outros itens que não foram reordenados nesta lista
    const otherItems = categories.filter(c => c.tipo !== tipo || (activeTab === 'em_uso' && c.archived) || (activeTab === 'arquivadas' && !c.archived));
    
    setCategories([...updatedSortedItems, ...otherItems]);

    dragCategoryItem.current = null;
    dragCategoryOverItem.current = null;

    try {
      await Promise.all(
        updatedSortedItems.map(item => 
          supabase.from('categories').update({ ordem: item.ordem }).eq('id', item.id)
        )
      );
    } catch(e) {
      console.error("Erro ao salvar ordem de categorias:", e);
    }
  };

  const [activeTab, setActiveTab] = useState<'em_uso' | 'arquivadas'>('em_uso');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void} | null>(null);
  const [openTagPopoverId, setOpenTagPopoverId] = useState<string | null>(null);
  const [isNewCategoryDropdownOpen, setIsNewCategoryDropdownOpen] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const [toast, setToast] = useState<{show: boolean, type: 'archive' | 'delete', title: string, message: string} | null>(null);

  // Auto hide toast
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast(prev => prev ? { ...prev, show: false } : null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Close tag popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.tag-popover-container')) {
        setOpenTagPopoverId(null);
      }
      if (!target.closest('.new-category-dropdown-container')) {
        setIsNewCategoryDropdownOpen(false);
      }
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNewCategoryDropdownOpen(false);
        setOpenTagPopoverId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Estados dos formulários do Modal
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<'receita' | 'despesa'>('despesa');
  const [catColor, setCatColor] = useState(COLORS[4]); // #2563EB default
  const [catIcon, setCatIcon] = useState('ShoppingCart');
  const [tagName, setTagName] = useState('');
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tagError, setTagError] = useState('');
  const colorInputRef = useRef<HTMLInputElement>(null);

  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);
  const iconSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isIconDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      // Verifica se o clique foi fora do container do seletor de ícone
      if (
        iconSelectorRef.current && 
        !iconSelectorRef.current.contains(e.target as Node)
      ) {
        setIsIconDropdownOpen(false);
      }
    };

    // Delay para não capturar o clique que abriu o painel
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isIconDropdownOpen]);

  // Filtros de exibição
  const displayedCategories = categories.filter(c => 
    activeTab === 'em_uso' ? !c.archived : c.archived
  );
  
  const receitas = displayedCategories.filter(c => c.tipo === 'receita').sort((a, b) => {
    if (a.ordem != null && b.ordem != null) return a.ordem - b.ordem;
    return a.nome.localeCompare(b.nome);
  });
  
  const despesas = displayedCategories.filter(c => c.tipo === 'despesa').sort((a, b) => {
    if (a.ordem != null && b.ordem != null) return a.ordem - b.ordem;
    const aIsSys = a.nome.toLowerCase() === 'cartão de crédito' || a.nome.toLowerCase() === 'investimentos';
    const bIsSys = b.nome.toLowerCase() === 'cartão de crédito' || b.nome.toLowerCase() === 'investimentos';
    if (aIsSys && !bIsSys) return 1;
    if (!aIsSys && bIsSys) return -1;
    return a.nome.localeCompare(b.nome);
  });

  const openCategoryModal = (typeOrCategory?: 'receita' | 'despesa' | Category) => {
    if (typeOrCategory && typeof typeOrCategory === 'object') {
      const cat = typeOrCategory as Category;
      setEditingCategory(cat);
      setCatName(cat.nome);
      setCatType(cat.tipo);
      setCatColor(cat.cor);
      setCatIcon(cat.icone);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatType((typeOrCategory as 'receita' | 'despesa') || 'despesa');
      // Cores default por tipo: green para receita, red para despesa
      setCatColor(typeOrCategory === 'receita' ? '#16A34A' : '#EF4444');
      setCatIcon(typeOrCategory === 'receita' ? 'Briefcase' : 'ShoppingCart');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!catName.trim()) return;
    
    const dados = { nome: catName, tipo: catType, cor: catColor, icone: catIcon };
    
    if (editingCategory) {
      await editarCategoria(editingCategory.id, dados);
    } else {
      await criarCategoria(dados);
    }
    setIsCategoryModalOpen(false);
  };

  const handleSaveTag = async () => {
    // Adiciona o que estiver digitado antes de salvar
    let finalTags = [...tagNames];
    if (tagName.trim()) {
      const newTag = tagName.trim();
      if (!finalTags.some(t => t.toLowerCase() === newTag.toLowerCase()) && 
          !tags.some(t => t.nome.toLowerCase() === newTag.toLowerCase() && t.category_id === selectedCategoryId)) {
        finalTags.push(newTag);
      }
    }

    if (finalTags.length === 0 || !selectedCategoryId) return;
    
    // Insert all tags
    for (const tag of finalTags) {
       await criarTag({ nome: tag, category_id: selectedCategoryId });
    }
    
    handleCloseTagModal();
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
    setTagName('');
    setTagNames([]);
    setTagError('');
  };

  const handleAddBadge = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter' && e.key !== ',') return;
    if (e) {
      e.preventDefault();
    }
    
    setTagError('');
    const newTag = tagName.trim().replace(/,$/, ''); // Remove trailing comma if present
    if (!newTag) return;
    
    // Check local duplicate
    if (tagNames.some(t => t.toLowerCase() === newTag.toLowerCase())) {
        setTagError("Esta tag já foi adicionada na lista.");
        return;
    }
    // Check DB duplicate
    if (tags.some(t => t.nome.toLowerCase() === newTag.toLowerCase() && t.category_id === selectedCategoryId)) {
        setTagError("Esta tag já existe para esta categoria.");
        return;
    }

    setTagNames([...tagNames, newTag]);
    setTagName('');
  };

  const removeBadge = (tagToRemove: string) => {
    setTagNames(tagNames.filter(t => t !== tagToRemove));
  };

  const getIcon = (name: string) => {
    const iconObj = ICONS.find(i => i.name === name);
    return iconObj ? iconObj.component : Tag;
  };

  const renderCategoryCard = (category: Category, isArchivedView: boolean, index?: number) => {
    const IconComp = getIcon(category.icone);
    const isDraggable = activeTab === 'em_uso' && index !== undefined;
    
    return (
      <div 
        key={category.id} 
        draggable={isDraggable}
        onDragStart={(e) => {
          if (!isDraggable) {
            e.preventDefault();
            return;
          }
          dragCategoryItem.current = index!;
        }}
        onDragEnter={() => {
          if (!isDraggable) return;
          dragCategoryOverItem.current = index!;
        }}
        onDragEnd={() => {
          if (!isDraggable) return;
          handleSortCategory(category.tipo);
        }}
        onDragOver={(e) => e.preventDefault()}
        className={`bg-white dark:bg-[#1E293B] rounded-[16px] border border-[#F1F5F9] dark:border-[#334155] p-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#E2E8F0] dark:border-[#334155] flex flex-col gap-[10px] relative tag-popover-container ${isArchivedView ? 'opacity-70 bg-[#F8FAFC] dark:bg-[#0F172A]' : ''} ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {isArchivedView && (
           <div>
             <span className="bg-[#F1F5F9] dark:bg-[#334155] text-[#6B7280] dark:text-[#94A3B8] rounded-[100px] px-[10px] py-[3px] text-[11px] font-medium inline-block">
               Arquivada
             </span>
           </div>
        )}

        <div className="flex justify-between items-start">
          {/* LADO ESQUERDO: TOPO DO CARD */}
          <div className="flex items-center gap-[10px]">
            <div 
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-white shrink-0" 
              style={{ backgroundColor: category.cor, boxShadow: `0 2px 8px ${category.cor}59` }}
            >
              <IconComp size={17} />
            </div>
            <span className="text-[14px] font-bold text-[#0F172A] dark:text-white leading-tight break-words">
              {category.nome}
            </span>
          </div>

          {/* LADO DIREITO: TOPO DO CARD */}
          <div className="flex items-center gap-[2px] shrink-0">
            {category.nome.toLowerCase() === 'cartão de crédito' || category.nome.toLowerCase() === 'investimentos' ? (
              <div title="Categoria de Sistema" className="p-[5px] rounded-[7px] text-[#CBD5E1] dark:text-[#475569]">
                <Lock size={13} />
              </div>
            ) : (
              <>
                <button 
                  onClick={() => openCategoryModal(category)}
                  className="p-[5px] rounded-[7px] text-[#CBD5E1] dark:text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all cursor-pointer"
                >
                  <Pencil size={13} />
                </button>
                {isArchivedView ? (
                  <button 
                    title="Desarquivar"
                    onClick={async () => { await unarchiveCategory(category.id); }}
                    className="p-[5px] rounded-[7px] text-[#CBD5E1] dark:text-[#475569] transition-all cursor-pointer hover:text-[#16A34A] dark:text-green-400 hover:bg-[#DCFCE7] dark:bg-green-900/20"
                  >
                    <RotateCcw size={13} />
                  </button>
                ) : (
                  <button 
                    title="Arquivar"
                    onClick={async () => { 
                      await archiveCategory(category.id); 
                      setToast({ show: true, type: 'archive', title: 'Categoria arquivada', message: 'Manualmente pelo usuário' });
                    }}
                    className="p-[5px] rounded-[7px] text-[#CBD5E1] dark:text-[#475569] transition-all cursor-pointer hover:text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:bg-[#0F172A]"
                  >
                    <Archive size={13} />
                  </button>
                )}
                <button 
                  onClick={async () => {
                    const result = (await excluirCategoria(category.id)) as any;
                    
                    if (result.archived) {
                      setToast({ 
                        show: true, 
                        type: 'archive', 
                        title: 'Categoria arquivada', 
                        message: 'Possui transações vinculadas' 
                      });
                      return;
                    }

                    if (result.requireConfirm) {
                      setConfirmModal({
                        isOpen: true,
                        title: "Excluir categoria?",
                        message: "Esta ação não pode ser desfeita",
                        onConfirm: async () => { 
                          const finalResult = (await excluirCategoria(category.id, true)) as any;
                          if (finalResult.deleted) {
                            setToast({ 
                              show: true, 
                              type: 'delete', 
                              title: 'Categoria excluída', 
                              message: '' 
                            });
                          }
                        }
                      });
                    }
                  }}
                  className="p-[5px] rounded-[7px] text-[#CBD5E1] dark:text-[#475569] hover:text-[#EF4444] dark:text-red-400 hover:bg-[#FEF2F2] dark:bg-red-900/20 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ÁREA DE TAGS */}
        <div className="pt-[10px] border-t border-[#F8FAFC] dark:border-[#0F172A] flex items-center gap-[6px] flex-nowrap">
          {(() => {
            const categoryTags = tags.filter(t => t.category_id === category.id && (!activeTab || (activeTab === 'em_uso' ? !t.archived : t.archived)));
            const tagsCount = categoryTags.length;

            return (
              <>
                {tagsCount > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setOpenTagPopoverId(openTagPopoverId === category.id ? null : category.id)}
                      className="bg-[#F1F5F9] dark:bg-[#334155] text-[#475569] dark:text-[#CBD5E1] px-[10px] py-[4px] rounded-[100px] text-[12px] font-[600] hover:bg-[#E2E8F0] dark:bg-[#475569] transition-colors cursor-pointer"
                    >
                      {tagsCount} {tagsCount === 1 ? 'tag' : 'tags'}
                    </button>

                    {/* Popover de Tags */}
                    <AnimatePresence>
                      {openTagPopoverId === category.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute mt-2 left-0 bg-white dark:bg-[#1E293B] rounded-[14px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-[14px] min-w-[220px] max-w-[280px] z-50 cursor-auto"
                        >
                          <div className="flex items-center justify-between mb-0">
                            <span className="text-[11px] font-[700] text-[#94A3B8] dark:text-[#475569] uppercase tracking-[0.08em]">
                              Tags da categoria
                            </span>
                            <button
                              onClick={() => setOpenTagPopoverId(null)}
                              className="text-[#94A3B8] dark:text-[#475569] hover:text-[#374151] dark:text-[#E2E8F0] p-1 cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-[6px] mt-[10px]">
                            {categoryTags.map(tag => (
                              <div 
                                key={tag.id}
                                className="inline-flex items-center gap-[6px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#475569] dark:text-[#CBD5E1] px-[12px] py-[5px] rounded-[100px] text-[12px] font-[500]"
                              >
                                {tag.nome}
                                <button 
                                  onClick={async () => {
                                    const result = (await excluirTag(tag.id)) as any;
                                    
                                    if (result.archived) {
                                      setToast({ 
                                        show: true, 
                                        type: 'archive', 
                                        title: 'Tag arquivada', 
                                        message: 'Possui transações vinculadas' 
                                      });
                                      return;
                                    }

                                    if (result.requireConfirm) {
                                      setConfirmModal({
                                        isOpen: true,
                                        title: "Excluir tag?",
                                        message: result.message || "Esta ação não pode ser desfeita",
                                        onConfirm: async () => { 
                                          const finalResult = (await excluirTag(tag.id, true)) as any;
                                          if (finalResult.deleted) {
                                            setToast({ 
                                              show: true, 
                                              type: 'delete', 
                                              title: 'Tag excluída', 
                                              message: '' 
                                            });
                                          }
                                        }
                                      });
                                    }
                                  }}
                                  className="text-[#CBD5E1] dark:text-[#475569] hover:text-[#EF4444] dark:text-red-400 transition-colors cursor-pointer"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            );
          })()}
          
          {!isArchivedView && (
            <button 
              onClick={() => {
                setSelectedCategoryId(category.id);
                setIsTagModalOpen(true);
              }}
              className="border-[1.5px] border-dashed border-[#CBD5E1] dark:border-[#475569] bg-transparent text-[#94A3B8] dark:text-[#475569] px-[10px] py-[4px] rounded-[100px] text-[12px] font-medium hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all cursor-pointer"
            >
              + Tag
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="px-[24px] py-7 min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
      <div className="w-full">
        {/* CABEÇALHO CENTRALIZADO */}
      <div className="text-center mb-[28px] flex flex-col items-center">
        <h1 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight mb-4 flex items-center gap-3">
          <LayoutPanelLeft size={28} className="text-[#3B82F6]" />
          Categorias & Tags
        </h1>

        <div className="relative new-category-dropdown-container mb-[14px]">
          <button 
            onClick={() => setIsNewCategoryDropdownOpen(!isNewCategoryDropdownOpen)}
            className="flex items-center gap-[6px] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white px-[22px] py-[10px] rounded-[100px] text-[14px] font-bold shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_18px_rgba(37,99,235,0.45)] hover:-translate-y-[1px] transition-all duration-200 cursor-pointer border-none"
          >
            + Nova Categoria <ChevronDown size={14} className="text-white" />
          </button>

          <AnimatePresence>
            {isNewCategoryDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[100%] mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1E293B] rounded-[14px] border border-[#E2E8F0] dark:border-[#334155] shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-[6px] min-w-[200px] z-[100]"
              >
                <div 
                  onClick={() => {
                    setIsNewCategoryDropdownOpen(false);
                    openCategoryModal('receita');
                  }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] hover:bg-[#DCFCE7] dark:bg-green-900/20 transition-all duration-200 cursor-pointer"
                >
                  <TrendingUp size={16} className="text-[#16A34A] dark:text-green-400" />
                  <span className="text-[14px] font-[600] text-[#16A34A] dark:text-green-400">Receita</span>
                </div>
                <div className="border-t border-[#F1F5F9] dark:border-[#334155] my-[4px]" />
                <div 
                  onClick={() => {
                    setIsNewCategoryDropdownOpen(false);
                    openCategoryModal('despesa');
                  }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] hover:bg-[#FEE2E2] dark:bg-red-900/20 transition-all duration-200 cursor-pointer"
                >
                  <TrendingDown size={16} className="text-[#EF4444] dark:text-red-400" />
                  <span className="text-[14px] font-[600] text-[#EF4444] dark:text-red-400">Despesa</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="inline-flex gap-1 p-1 bg-[#F1F5F9] dark:bg-[#334155] rounded-[100px]">
          <button 
            onClick={() => setActiveTab('em_uso')}
            className={`px-[22px] py-2 rounded-[100px] text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'em_uso' 
                ? 'bg-[#0F172A] text-white shadow-[0_2px_8px_rgba(15,23,42,0.25)]' 
                : 'bg-transparent text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:bg-[#475569]'
            }`}
          >
            Em Uso
          </button>
          <button 
            onClick={() => setActiveTab('arquivadas')}
            className={`px-[22px] py-2 rounded-[100px] text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'arquivadas' 
                ? 'bg-[#6B7280] text-white shadow-[0_2px_8px_rgba(107,114,128,0.25)]' 
                : 'bg-transparent text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:bg-[#475569]'
            }`}
          >
            Arquivadas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-10">
          
          {activeTab === 'em_uso' ? (
            <>
              {/* SEÇÃO RECEITAS */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp size={16} className="text-[#16A34A] dark:text-green-400" />
                  <h3 className="text-[13px] font-bold text-[#16A34A] dark:text-green-400 uppercase tracking-[0.08em] whitespace-nowrap">
                    Receitas <span className="text-[#86EFAC] dark:text-green-500">({receitas.length})</span>
                  </h3>
                  <div className="flex-1 border-t-[1.5px] border-[#DCFCE7] dark:border-green-900/40 ml-3" />
                </div>
                
                {receitas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] border-dashed rounded-[16px] col-span-full mx-auto w-full">
                    <FolderOpen size={36} className="text-[#E2E8F0] mb-3" />
                    <span className="text-[13px] text-[#CBD5E1] dark:text-[#475569] font-medium">Nenhuma categoria</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[14px] w-full">
                    {receitas.map((c, idx) => renderCategoryCard(c, false, idx))}
                  </div>
                )}
              </section>

              {/* SEÇÃO DESPESAS */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown size={16} className="text-[#EF4444] dark:text-red-400" />
                  <h3 className="text-[13px] font-bold text-[#EF4444] dark:text-red-400 uppercase tracking-[0.08em] whitespace-nowrap">
                    Despesas <span className="text-[#FCA5A5] dark:text-red-500">({despesas.length})</span>
                  </h3>
                  <div className="flex-1 border-t-[1.5px] border-[#FEE2E2] dark:border-red-900/40 ml-3" />
                </div>
                
                {despesas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] border-dashed rounded-[16px] col-span-full mx-auto w-full">
                    <FolderOpen size={36} className="text-[#E2E8F0] mb-3" />
                    <span className="text-[13px] text-[#CBD5E1] dark:text-[#475569] font-medium">Nenhuma categoria</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[14px] w-full">
                    {despesas.map((c, idx) => renderCategoryCard(c, false, idx))}
                  </div>
                )}
              </section>
            </>
          ) : (
            /* CONTEÚDO ARQUIVADAS */
            <section>
               <div className="flex items-center gap-3 mb-4">
                  <Archive size={16} className="text-[#64748B] dark:text-[#94A3B8]" />
                  <h3 className="text-[13px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-[0.08em] whitespace-nowrap">
                    Categorias Arquivadas <span className="text-[#CBD5E1] dark:text-[#475569]">({displayedCategories.length})</span>
                  </h3>
                  <div className="flex-1 border-t-[1.5px] border-[#E2E8F0] dark:border-[#334155] ml-3" />
               </div>
               
               {displayedCategories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 bg-transparent border border-[#E2E8F0] dark:border-[#334155] border-dashed rounded-[16px] col-span-full mx-auto w-full">
                    <FolderOpen size={36} className="text-[#E2E8F0] mb-3" />
                    <span className="text-[13px] text-[#CBD5E1] dark:text-[#475569] font-medium">Nenhuma categoria</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[14px] w-full">
                    {displayedCategories.map(c => renderCategoryCard(c, true))}
                  </div>
                )}
            </section>
          )}
          
        </div>
      )}

      </div>

      {/* MODAL CATEGORIA */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[460px] bg-white dark:bg-[#1E293B] rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto overflow-x-hidden custom-modal-scroll"
            >
              <style>{`
                .custom-modal-scroll::-webkit-scrollbar { width: 5px; }
                .custom-modal-scroll::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }
                .icons-grid-scroll::-webkit-scrollbar { width: 4px; }
                .icons-grid-scroll::-webkit-scrollbar-track { background: #F8FAFC; }
                .icons-grid-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
              `}</style>
              <div className="p-7">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[18px] font-bold text-[#0F172A] dark:text-white">
                    {editingCategory ? 'Editar Categoria' : `Nova Categoria (${catType === 'receita' ? 'Receita' : 'Despesa'})`}
                  </h2>
                  <button onClick={() => setIsCategoryModalOpen(false)} className="text-[#6B7280] dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-full transition-colors cursor-pointer">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* NOME */}
                  <div>
                    <label className="block text-[13px] font-bold text-[#64748B] dark:text-[#94A3B8] mb-2 uppercase tracking-tight">Nome da Categoria</label>
                    <input 
                      type="text" 
                      value={catName}
                      onChange={e => setCatName(e.target.value)}
                      placeholder="Ex: Mercado"
                      className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-4 py-3 text-[14px] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all font-medium"
                    />
                  </div>

                  {/* CORES */}
                  <div>
                    <label className="block text-[13px] font-bold text-[#64748B] dark:text-[#94A3B8] mb-2 uppercase tracking-tight">Cor</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="grid grid-cols-6 gap-2">
                        {COLORS.map(color => (
                          <button 
                            key={color}
                            onClick={() => setCatColor(color)}
                            className="w-[32px] h-[32px] rounded-full flex items-center justify-center transition-transform duration-150 cursor-pointer"
                            style={{ 
                              backgroundColor: color,
                              boxShadow: catColor === color ? `0 0 0 3px ${color}` : 'none',
                              border: catColor === color ? '3px solid #FFFFFF' : 'none',
                              transform: catColor === color ? 'scale(1.1)' : 'scale(1)'
                            }}
                            onMouseEnter={(e) => {
                              if (catColor !== color) e.currentTarget.style.transform = 'scale(1.15)';
                            }}
                            onMouseLeave={(e) => {
                              if (catColor !== color) e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {!COLORS.includes(catColor) && (
                          <button 
                            key={catColor}
                            onClick={() => setCatColor(catColor)}
                            className="w-[32px] h-[32px] rounded-full flex items-center justify-center cursor-pointer"
                            style={{ 
                              backgroundColor: catColor,
                              boxShadow: `0 0 0 3px ${catColor}`,
                              border: '3px solid #FFFFFF',
                              transform: 'scale(1.1)'
                            }}
                          >
                          </button>
                        )}
                        <div className="relative">
                          <input 
                            ref={colorInputRef}
                            type="color" 
                            value={COLORS.includes(catColor) ? '#2563EB' : catColor}
                            onChange={e => setCatColor(e.target.value)} 
                            style={{ display: 'none' }}
                          />
                          <button 
                            onClick={(e) => { e.preventDefault(); colorInputRef.current?.click(); }}
                            className="flex items-center gap-1.5 bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-dashed border-[#CBD5E1] dark:border-[#475569] text-[#64748B] dark:text-[#94A3B8] rounded-[8px] py-[6px] px-[12px] text-[12px] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Pipette size={14} /> Personalizada
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="z-[60]">
                    <IconPicker 
                      value={catIcon} 
                      onChange={setCatIcon} 
                      color={catColor} 
                      label="Ícone" 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-8">
                  <button 
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#374151] dark:text-[#E2E8F0] font-semibold py-3 rounded-[10px] hover:bg-[#E2E8F0] dark:bg-[#475569] transition-colors cursor-pointer text-[14px]"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveCategory}
                    className="flex-2 bg-[#2563EB] text-white font-semibold py-3 rounded-[10px] hover:bg-[#1D4ED8] transition-colors shadow-md cursor-pointer text-[14px]"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL TAG */}
      <AnimatePresence>
        {isTagModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleCloseTagModal()}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[360px] bg-white dark:bg-[#1E293B] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white">Adicionar Tag</h2>
                  <button onClick={() => handleCloseTagModal()} className="text-[#6B7280] dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-full cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] mb-2 uppercase tracking-tight">Nome da tag</label>
                  <div className={`w-full bg-[#F8FAFC] dark:bg-[#0F172A] border ${tagError ? 'border-[#EF4444]' : 'border-[#E2E8F0] dark:border-[#334155]'} rounded-xl p-[6px] focus-within:ring-2 focus-within:ring-[#2563EB]/20 focus-within:border-[#2563EB] transition-all min-h-[46px] flex flex-wrap gap-[6px] items-center`}>
                    {tagNames.map((tag) => (
                      <div key={tag} className="flex items-center gap-[4px] bg-[#E2E8F0] dark:bg-[#475569] text-[#374151] dark:text-[#E2E8F0] px-[8px] py-[4px] rounded-[8px] text-[13px] font-medium">
                        {tag}
                        <button onClick={() => removeBadge(tag)} className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#EF4444] dark:hover:text-red-400 p-[2px] transition-colors rounded-full hover:bg-white/50 dark:hover:bg-[#1E293B]/50 cursor-pointer">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <input 
                      type="text" 
                      value={tagName}
                      onChange={e => {
                        setTagName(e.target.value);
                        if (tagError) setTagError('');
                      }}
                      placeholder={tagNames.length === 0 ? "Ex: Alimentação, Transporte, Lazer..." : "Adicionar outra..."}
                      autoFocus
                      className="flex-1 bg-transparent min-w-[120px] px-[6px] py-[4px] text-[14px] focus:outline-none font-medium placeholder:text-[#94A3B8] dark:text-[#475569]"
                      onKeyDown={handleAddBadge}
                      onBlur={() => handleAddBadge()}
                    />
                  </div>
                  {tagError && <span className="text-[12px] text-[#EF4444] dark:text-red-400 mt-[6px] block">{tagError}</span>}
                </div>

                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={handleCloseTagModal}
                    className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#374151] dark:text-[#E2E8F0] font-semibold py-2.5 rounded-[10px] hover:bg-[#E2E8F0] dark:bg-[#475569] transition-colors cursor-pointer text-[14px]"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveTag}
                    className="flex-1 bg-[#2563EB] text-white font-semibold py-2.5 rounded-[10px] hover:bg-[#1D4ED8] transition-colors shadow-md cursor-pointer text-[14px]"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast?.show && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed bottom-[24px] right-[24px] z-[200] rounded-[12px] p-[14px_18px] flex items-start gap-[12px] border shadow-lg max-w-[320px] ${
              toast.type === 'archive' 
                ? 'bg-[#FFFBEB] dark:bg-yellow-900/20 border-[#F59E0B] dark:border-amber-500/50' 
                : 'bg-[#F0FDF4] dark:bg-green-900/20 border-[#16A34A] dark:border-green-500/50'
            }`}
          >
            <div className={`mt-0.5 ${toast.type === 'archive' ? 'text-[#F59E0B] dark:text-amber-400' : 'text-[#16A34A] dark:text-green-400'}`}>
              {toast.type === 'archive' ? <Archive size={18} /> : <TrendingUp size={18} />}
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className={`text-[14px] font-[600] ${toast.type === 'archive' ? 'text-[#92400E] dark:text-amber-300' : 'text-[#166534] dark:text-green-400'}`}>
                {toast.title}
              </span>
              <span className={`text-[12px] ${toast.type === 'archive' ? 'text-[#B45309] dark:text-amber-500' : 'text-[#15803D] dark:text-green-300'}`}>
                {toast.message || (toast.type === 'delete' ? 'Categoria excluída' : '')}
              </span>
            </div>
            <button 
              onClick={() => setToast(prev => prev ? { ...prev, show: false } : null)}
              className="text-[#94A3B8] dark:text-[#475569] hover:text-[#374151] dark:text-[#E2E8F0] transition-colors ml-auto"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE CONFIRMAÇÃO */}
      <AnimatePresence>
        {confirmModal?.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
              onClick={() => setConfirmModal(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-[360px] bg-white dark:bg-[#1E293B] rounded-[16px] p-6 shadow-xl text-center"
            >
              <div className="w-[50px] h-[50px] bg-[#FEF2F2] dark:bg-red-900/20 text-[#EF4444] dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-[18px] font-bold text-[#0F172A] dark:text-white mb-2">{confirmModal.title}</h3>
              <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] mb-6 leading-relaxed">{confirmModal.message}</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 bg-[#F1F5F9] dark:bg-[#334155] text-[#475569] dark:text-[#CBD5E1] font-bold py-3 rounded-[12px] hover:bg-[#E2E8F0] dark:bg-[#475569] transition-colors text-[14px]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                  className="flex-1 bg-[#EF4444] text-white font-bold py-3 rounded-[12px] hover:bg-[#DC2626] transition-colors text-[14px]"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

