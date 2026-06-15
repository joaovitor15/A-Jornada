import React, { useState, useRef, useEffect } from 'react';
import { 
  UserPlus, Pencil, Trash2, CheckCircle, X, Check, Loader2, AlertCircle, User,
  Building2, Users, UserCheck, Briefcase, Home, Star, Crown, Heart, Smile,
  Coffee, Rocket, Shield, Award, Target, Zap, Globe, Landmark, PiggyBank,
  Wallet, TrendingUp, BarChart2, DollarSign, GraduationCap, Baby, Dog, Car,
  Plane, Gamepad2, Camera, Gift, Music, Book, ChevronDown, Search, Pipette, Settings
} from 'lucide-react';
import { useProfiles, SupabaseProfile } from '../hooks/useProfiles';
import { motion, AnimatePresence } from 'motion/react';

const PROFILE_COLORS = [
  '#2563EB', '#7C3AED', '#16A34A', '#EF4444', '#F97316',
  '#EC4899', '#0F172A', '#06B6D4', '#84CC16', '#D97706'
];

const PROFILE_ICONS = [
  { name: 'User', component: User },
  { name: 'Users', component: Users },
  { name: 'UserCheck', component: UserCheck },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Building2', component: Building2 },
  { name: 'Home', component: Home },
  { name: 'Star', component: Star },
  { name: 'Crown', component: Crown },
  { name: 'Heart', component: Heart },
  { name: 'Smile', component: Smile },
  { name: 'Coffee', component: Coffee },
  { name: 'Rocket', component: Rocket },
  { name: 'Shield', component: Shield },
  { name: 'Award', component: Award },
  { name: 'Target', component: Target },
  { name: 'Zap', component: Zap },
  { name: 'Globe', component: Globe },
  { name: 'Landmark', component: Landmark },
  { name: 'PiggyBank', component: PiggyBank },
  { name: 'Wallet', component: Wallet },
  { name: 'TrendingUp', component: TrendingUp },
  { name: 'BarChart2', component: BarChart2 },
  { name: 'DollarSign', component: DollarSign },
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'Baby', component: Baby },
  { name: 'Dog', component: Dog },
  { name: 'Car', component: Car },
  { name: 'Plane', component: Plane },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Camera', component: Camera },
  { name: 'Gift', component: Gift },
  { name: 'Music', component: Music },
  { name: 'Book', component: Book }
];

interface ProfilesPageProps {
  profiles: SupabaseProfile[];
  loading: boolean;
  error: string | null;
  createProfile: (name: string, tipo: 'pessoal' | 'empresa' | 'jogos', cor: string, icone: string) => Promise<{ error: any }>;
  updateProfile: (id: string, name: string, tipo: 'pessoal' | 'empresa' | 'jogos', cor: string, icone: string) => Promise<{ error: any }>;
  updateProfileModules: (id: string, modules: Partial<SupabaseProfile>) => Promise<{ error: any }>;
  deleteProfile: (id: string) => Promise<{ error: any }>;
  setProfileActive: (id: string) => Promise<{ error: any }>;
}

export default function ProfilesPage({
  profiles,
  loading,
  error,
  createProfile,
  updateProfile,
  updateProfileModules,
  deleteProfile,
  setProfileActive
}: ProfilesPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SupabaseProfile | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    tipo: 'pessoal' | 'empresa' | 'jogos';
    cor: string;
    icone: string;
  }>({
    name: '',
    tipo: 'pessoal',
    cor: '#2563EB',
    icone: 'User'
  });
  
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const iconSelectorRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeProfile = profiles.find(p => p.is_active);
  const [managedProfileId, setManagedProfileId] = useState<string | null>(null);
  const managedProfile = managedProfileId ? profiles.find(p => p.id === managedProfileId) : activeProfile;

  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [modulesFormLoading, setModulesFormLoading] = useState(false);
  const [modulesFormState, setModulesFormState] = useState<Partial<SupabaseProfile>>({});

  useEffect(() => {
    if (managedProfile) {
      setModulesFormState({
        enable_sistema_financeiro: managedProfile.enable_sistema_financeiro ?? true,
        financeiro_show_dashboard: managedProfile.financeiro_show_dashboard ?? true,
        financeiro_show_transacoes: managedProfile.financeiro_show_transacoes ?? true,
        financeiro_show_transacoes_recorrentes: managedProfile.financeiro_show_transacoes_recorrentes ?? true,
        financeiro_show_relatorios: managedProfile.financeiro_show_relatorios ?? true,
        financeiro_show_categorias: managedProfile.financeiro_show_categorias ?? true,
        financeiro_show_cartoes: managedProfile.financeiro_show_cartoes ?? true,
        investimentos_ativo: managedProfile.investimentos_ativo ?? false,
        investimentos_show_dashboard: managedProfile.investimentos_show_dashboard ?? true,
        investimentos_show_ativos: managedProfile.investimentos_show_ativos ?? true,
        investimentos_show_operacoes: managedProfile.investimentos_show_operacoes ?? true,
        game_ativo: managedProfile.game_ativo ?? false,
        game_show_clash_royale: managedProfile.game_show_clash_royale ?? true,
        game_show_brawl_stars: managedProfile.game_show_brawl_stars ?? true,
      });
    }
  }, [managedProfile]);

  const handleSaveModules = async () => {
    if (!managedProfile) return;
    setModulesFormLoading(true);
    setLocalError(null);
    try {
      const { error } = await updateProfileModules(managedProfile.id, modulesFormState);
      if (error) {
        setLocalError(error.message);
      } else {
        setSuccessMsg('Módulos atualizados com sucesso!');
        setIsModulesOpen(false); // Fechar a seção de módulos
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setLocalError('Erro ao atualizar os módulos.');
    } finally {
      setModulesFormLoading(false);
    }
  };

  const handleManageModules = (id: string) => {
    setManagedProfileId(id);
    setIsModulesOpen(true);
    setTimeout(() => {
      document.getElementById('modulos-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  useEffect(() => {
    if (!isIconDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        iconSelectorRef.current && 
        !iconSelectorRef.current.contains(e.target as Node)
      ) {
        setIsIconDropdownOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isIconDropdownOpen]);

  const handleOpenForm = (profile?: SupabaseProfile) => {
    setFormError('');
    if (profile) {
      setEditingProfile(profile);
      setFormData({
        name: profile.name,
        tipo: profile.tipo || 'pessoal',
        cor: profile.cor || '#2563EB',
        icone: profile.icone || 'User'
      });
    } else {
      setEditingProfile(null);
      setFormData({
        name: '',
        tipo: 'pessoal',
        cor: '#2563EB',
        icone: 'User'
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProfile(null);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Verificação de segurança para as chaves
    if (import.meta.env.VITE_SUPABASE_URL === 'SUA_URL_AQUI' || !import.meta.env.VITE_SUPABASE_URL) {
      setFormError('ERRO: Supabase não configurado corretamente.');
      return;
    }

    if (!formData.name) {
      setFormError('Por favor, digite um nome para o perfil.');
      return;
    }

    setFormLoading(true);
    
    try {
      let result;
      if (editingProfile) {
        result = await updateProfile(editingProfile.id, formData.name, formData.tipo, formData.cor, formData.icone);
      } else {
        result = await createProfile(formData.name, formData.tipo, formData.cor, formData.icone);
      }

      if (result && result.error) {
        setFormError(`Erro: ${result.error.message}`);
      } else {
        setSuccessMsg(editingProfile ? 'Alterações salvas!' : 'Perfil criado com sucesso!');
        handleCloseForm();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      setFormError('Erro de conexão. Verifique sua rede.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLocalError(null);
    try {
      const { error } = await deleteProfile(id);
      if (error) {
        setLocalError(error.message);
      } else {
        setSuccessMsg('Perfil excluído com sucesso!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      setLocalError('Erro ao excluir perfil. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white">Meus Perfis</h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">Gerencie seus perfis financeiros</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#1D4ED8] transition-all shadow-md"
          >
            <UserPlus size={18} />
            Novo Perfil
          </button>
        )}
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <Check size={18} />
          {successMsg}
        </motion.div>
      )}

      {(error || localError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={18} />
          {error || localError}
        </div>
      )}

      {/* FORMULÁRIO SIMPLIFICADO */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm space-y-6 mb-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#0F172A] dark:text-white">
                  {editingProfile ? 'Editar Perfil' : 'Novo Perfil'}
                </h3>
                <button type="button" onClick={handleCloseForm} className="text-[#64748B] dark:text-[#94A3B8] hover:text-red-500">
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}

              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#64748B] dark:text-[#94A3B8]">Nome do Perfil</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#334155] focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#374151] dark:text-[#94A3B8] block mb-2">Tipo de Perfil</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
                      <div
                        onClick={() => setFormData({ ...formData, tipo: 'pessoal' })}
                        className={`flex items-center gap-[10px] p-[12px_14px] rounded-[12px] border-[1.5px] cursor-pointer transition-all ${
                          formData.tipo === 'pessoal'
                            ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#2563EB] shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
                            : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]'
                        }`}
                      >
                        <User size={18} className={formData.tipo === 'pessoal' ? 'text-[#2563EB]' : 'text-[#64748B] dark:text-[#94A3B8]'} />
                        <div>
                          <div className={`text-[14px] font-semibold ${formData.tipo === 'pessoal' ? 'text-[#2563EB]' : 'text-[#0F172A] dark:text-white'}`}>Pessoal</div>
                          <div className="text-[11px] text-[#94A3B8]">Finanças pessoais</div>
                        </div>
                      </div>
                      <div
                        onClick={() => setFormData({ ...formData, tipo: 'empresa' })}
                        className={`flex items-center gap-[10px] p-[12px_14px] rounded-[12px] border-[1.5px] cursor-pointer transition-all ${
                          formData.tipo === 'empresa'
                            ? 'border-[#D97706] bg-[#FFFBEB] text-[#D97706] shadow-[0_0_0_3px_rgba(217,119,6,0.1)]'
                            : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]'
                        }`}
                      >
                        <Building2 size={18} className={formData.tipo === 'empresa' ? 'text-[#D97706]' : 'text-[#64748B] dark:text-[#94A3B8]'} />
                        <div>
                          <div className={`text-[14px] font-semibold ${formData.tipo === 'empresa' ? 'text-[#D97706]' : 'text-[#0F172A] dark:text-white'}`}>Empresa</div>
                          <div className="text-[11px] text-[#94A3B8]">Gestão empresarial</div>
                        </div>
                      </div>
                      <div
                        onClick={() => setFormData({ ...formData, tipo: 'jogos' })}
                        className={`flex items-center gap-[10px] p-[12px_14px] rounded-[12px] border-[1.5px] cursor-pointer transition-all ${
                          formData.tipo === 'jogos'
                            ? 'border-[#DC2626] bg-[#FEF2F2] text-[#DC2626] shadow-[0_0_0_3px_rgba(220,38,38,0.1)]'
                            : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]'
                        }`}
                      >
                        <Gamepad2 size={18} className={formData.tipo === 'jogos' ? 'text-[#DC2626]' : 'text-[#64748B] dark:text-[#94A3B8]'} />
                        <div>
                          <div className={`text-[14px] font-semibold ${formData.tipo === 'jogos' ? 'text-[#DC2626]' : 'text-[#0F172A] dark:text-white'}`}>Jogos</div>
                          <div className="text-[11px] text-[#94A3B8]">Gestão de jogos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#374151] dark:text-[#94A3B8] block mb-2">Cor do Perfil</label>
                    <div className="flex gap-[10px] flex-wrap items-center">
                      {PROFILE_COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormData({ ...formData, cor: c })}
                          className="w-[30px] h-[30px] rounded-full cursor-pointer transition-transform duration-150 ease-in-out hover:scale-110"
                          style={{
                            backgroundColor: c,
                            boxShadow: formData.cor === c 
                              ? `0 0 0 3px white, 0 0 0 5px ${c}` 
                              : 'none',
                            transform: formData.cor === c ? 'scale(1.1)' : 'scale(1)'
                          }}
                        />
                      ))}
                      
                      {!PROFILE_COLORS.includes(formData.cor) && (
                        <button
                          type="button"
                          className="w-[30px] h-[30px] rounded-full cursor-pointer transition-all scale-110"
                          style={{
                            backgroundColor: formData.cor,
                            boxShadow: `0 0 0 3px white, 0 0 0 5px ${formData.cor}`
                          }}
                        />
                      )}

                      <div className="relative flex items-center">
                        <input 
                          type="color" 
                          ref={colorInputRef} 
                          className="hidden" 
                          value={formData.cor}
                          onChange={(e) => setFormData({ ...formData, cor: e.target.value })} 
                        />
                        <button
                          type="button"
                          onClick={() => colorInputRef.current?.click()}
                          className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-dashed border-[#CBD5E1] dark:border-[#475569] rounded-full px-[12px] py-[5px] text-[12px] text-[#64748B] dark:text-[#94A3B8] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                        >
                          <Pipette size={13} />
                          Personalizada
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2" ref={iconSelectorRef}>
                    <label className="text-[13px] font-semibold text-[#374151] dark:text-[#94A3B8] block mb-2">Ícone do Perfil</label>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsIconDropdownOpen(prev => !prev);
                      }}
                      className="flex items-center justify-between w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1px] border-[#E2E8F0] dark:border-[#334155] rounded-[10px] px-[14px] py-[10px] min-h-[44px] cursor-pointer hover:border-[#2563EB] transition-colors"
                    >
                      <div className="flex items-center gap-[10px]">
                        <div 
                          className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-white"
                          style={{ backgroundColor: formData.cor }}
                        >
                          {(() => {
                            const SelectedIcon = PROFILE_ICONS.find(i => i.name === formData.icone)?.component || User;
                            return <SelectedIcon size={18} />;
                          })()}
                        </div>
                        <span className="text-[14px] text-[#374151] dark:text-[#94A3B8] font-medium capitalize">
                          {formData.icone}
                        </span>
                      </div>
                      <ChevronDown size={14} className="text-[#94A3B8]" />
                    </button>

                    <AnimatePresence>
                      {isIconDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="w-full bg-[#FFFFFF] dark:bg-[#1E293B] border-[1px] border-[#E2E8F0] dark:border-[#334155] rounded-[10px] flex flex-col gap-[10px] overflow-hidden p-[12px] shadow-sm transform-origin-top"
                        >
                          <div className="relative w-full">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                            <input
                              type="text"
                              placeholder="Buscar ícone..."
                              value={iconSearchTerm}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => setIconSearchTerm(e.target.value)}
                              className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1px] border-[#E2E8F0] dark:border-[#334155] rounded-[8px] py-[8px] pr-[12px] pl-[34px] text-[16px] sm:text-[13px] text-[#0F172A] dark:text-white focus:outline-none focus:border-[#2563EB] transition-all"
                            />
                          </div>

                          <div className="grid grid-cols-7 gap-[6px] overflow-y-auto max-h-[160px] icons-grid-scroll">
                            {PROFILE_ICONS.filter(icon => icon.name.toLowerCase().includes(iconSearchTerm.toLowerCase())).map(icon => {
                              const IconComponent = icon.component;
                              const isSelected = formData.icone === icon.name;
                              return (
                                <button 
                                  key={icon.name}
                                  title={icon.name}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFormData({ ...formData, icone: icon.name });
                                    setIsIconDropdownOpen(false);
                                    setIconSearchTerm('');
                                  }}
                                  className="w-[36px] h-[36px] flex items-center justify-center rounded-[8px] transition-all cursor-pointer"
                                  style={isSelected ? {
                                    backgroundColor: formData.cor,
                                    color: '#FFFFFF',
                                    boxShadow: `0 2px 6px ${formData.cor}66`
                                  } : {
                                    backgroundColor: 'transparent',
                                    color: '#64748B'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = '#F1F5F9';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                  }}
                                >
                                  <IconComponent size={18} />
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="bg-[#2563EB] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1D4ED8] transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {formLoading && <Loader2 size={18} className="animate-spin" />}
                    {editingProfile ? 'Salvar' : 'Criar Perfil'}
                  </button>
                  <button 
                    type="button"
                    onClick={handleCloseForm}
                    className="bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] px-6 py-2 rounded-lg font-semibold hover:bg-[#E2E8F0] dark:hover:bg-[#475569] transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#E2E8F0] dark:border-[#334155] space-y-4"
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-[#0F172A] dark:text-white text-lg">Excluir Perfil?</h3>
                <p className="text-[#64748B] dark:text-[#94A3B8]">Isso apagará permanentemente este perfil e todos os dados vinculados a ele.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2 bg-[#F1F5F9] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] rounded-lg font-semibold hover:bg-[#E2E8F0] dark:hover:bg-[#475569] transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LISTAGEM DE PERFIS */}
      {loading && !isFormOpen ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#64748B] dark:text-[#94A3B8] gap-3">
          <Loader2 size={40} className="animate-spin text-[#2563EB]" />
          <p>Carregando seus perfis...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {profiles.map((profile) => (
            <motion.div 
              layout
              key={profile.id}
              className={`bg-white dark:bg-[#1E293B] p-6 rounded-xl border transition-all group ${
                profile.is_active 
                  ? 'border-[#2563EB] border-2 shadow-[0_0_0_3px_rgba(37,99,235,0.10)]' 
                  : 'border-[#E2E8F0] dark:border-[#334155] shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                    style={{ backgroundColor: profile.cor || '#2563EB' }}
                  >
                    {(() => {
                      const SelectedIcon = PROFILE_ICONS.find(i => i.name === profile.icone)?.component || User;
                      return <SelectedIcon size={22} color="#FFFFFF" />;
                    })()}
                  </div>
                  <div className="min-w-0 flex flex-col items-start gap-1">
                    <h4 className="font-bold text-[#0F172A] dark:text-white text-[16px] truncate">{profile.name}</h4>
                    
                    {profile.tipo === 'empresa' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full bg-[#FEF9C3] text-[#854D0E] text-[11px] font-semibold">
                        <Building2 size={10} />
                        Empresa
                      </span>
                    ) : profile.tipo === 'jogos' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full bg-[#FEE2E2] text-[#DC2626] text-[11px] font-semibold">
                        <Gamepad2 size={10} />
                        Jogos
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full bg-[#DBEAFE] text-[#1D4ED8] text-[11px] font-semibold">
                        <User size={10} />
                        Pessoal
                      </span>
                    )}
                    
                    {profile.is_active ? (
                      <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-[#DCFCE7] text-[#16A34A] text-[11px] font-semibold">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-[#F1F5F9] dark:bg-[#334155] text-[#94A3B8] text-[11px] font-semibold">
                        Inativo
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {!profile.is_active && (
                    <button 
                      onClick={() => setProfileActive(profile.id)}
                      title="Ativar Perfil"
                      className="p-2 text-[#2563EB] hover:bg-[#EFF6FF] dark:bg-[#1E3A8A] rounded-lg transition-colors"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleManageModules(profile.id)}
                    title="Gerenciar Módulos"
                    className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F1F5F9] dark:bg-[#334155] rounded-lg transition-colors"
                  >
                    <Settings size={16} />
                  </button>
                  <button 
                    onClick={() => handleOpenForm(profile)}
                    title="Editar"
                    className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F1F5F9] dark:bg-[#334155] rounded-lg transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => setDeletingId(profile.id)}
                    title="Deletar"
                    className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {profiles.length === 0 && !loading && (
            <div className="col-span-full bg-white dark:bg-[#1E293B] p-12 rounded-2xl border-2 border-dashed border-[#E2E8F0] dark:border-[#334155] text-center space-y-4">
              <div className="w-16 h-16 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-full flex items-center justify-center mx-auto text-[#CBD5E1] dark:text-[#64748B]">
                <User size={32} />
              </div>
              <div>
                <p className="font-bold text-[#1E293B] dark:text-white">Nenhum perfil encontrado</p>
                <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">Comece criando seu primeiro perfil financeiro.</p>
              </div>
              <button 
                onClick={() => handleOpenForm()}
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1D4ED8] transition-all"
              >
                Criar Meu Primeiro Perfil
              </button>
            </div>
          )}
        </div>
      )}
      {/* SEÇÃO DE MÓDULOS */}
      <AnimatePresence>
        {managedProfile && isModulesOpen && (
          <motion.div
            id="modulos-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#334155] overflow-hidden mt-8"
          >
            <div className="flex items-center justify-between p-6 bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#334155]">
              <div className="flex items-center gap-3 text-left">
                <div className="text-[#2563EB] bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] dark:text-white text-lg">Gerenciar Módulos do Sistema</h3>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Ative ou desative funcionalidades para o perfil: <span className="font-semibold">{managedProfile.name}</span></p>
                </div>
              </div>
              <button 
                onClick={() => setIsModulesOpen(false)}
                className="p-2 text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#475569] rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
                  {/* SISTEMA FINANCEIRO */}
                  <div className={`border rounded-xl p-5 transition-colors ${modulesFormState.enable_sistema_financeiro ? 'border-[#2563EB]/40 bg-[#EFF6FF] dark:bg-[#1E3A8A]/30' : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <Wallet size={20} className={modulesFormState.enable_sistema_financeiro ? 'text-[#2563EB]' : 'text-[#94A3B8]'} />
                        <div>
                          <h4 className={`font-bold ${modulesFormState.enable_sistema_financeiro ? 'text-[#0F172A] dark:text-white' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>Sistema Financeiro</h4>
                          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Gestão de transações, categorias e relatórios financeiros.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={modulesFormState.enable_sistema_financeiro ?? true}
                          onChange={(e) => setModulesFormState(prev => ({ ...prev, enable_sistema_financeiro: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                      </label>
                    </div>

                    <AnimatePresence>
                      {modulesFormState.enable_sistema_financeiro && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-9 pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-[#2563EB]/10 mt-4"
                        >
                          <label className="flex items-center gap-3 cursor-pointer group mt-4">
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulesFormState.financeiro_show_dashboard ?? true}
                                onChange={(e) => setModulesFormState(prev => ({ ...prev, financeiro_show_dashboard: e.target.checked }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                            </div>
                            <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Dashboard</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group mt-4">
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulesFormState.financeiro_show_transacoes ?? true}
                                onChange={(e) => setModulesFormState(prev => ({ ...prev, financeiro_show_transacoes: e.target.checked }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                            </div>
                            <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Transações</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group mt-4">
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulesFormState.financeiro_show_transacoes_recorrentes ?? true}
                                onChange={(e) => setModulesFormState(prev => ({ ...prev, financeiro_show_transacoes_recorrentes: e.target.checked }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                            </div>
                            <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Transações Recorrentes</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulesFormState.financeiro_show_relatorios ?? true}
                                onChange={(e) => setModulesFormState(prev => ({ ...prev, financeiro_show_relatorios: e.target.checked }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                            </div>
                            <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Relatórios</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulesFormState.financeiro_show_categorias ?? true}
                                onChange={(e) => setModulesFormState(prev => ({ ...prev, financeiro_show_categorias: e.target.checked }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                            </div>
                            <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Categorias</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulesFormState.financeiro_show_cartoes ?? true}
                                onChange={(e) => setModulesFormState(prev => ({ ...prev, financeiro_show_cartoes: e.target.checked }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                            </div>
                            <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Meus Cartões</span>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* SISTEMA DE INVESTIMENTOS */}
                  <div className={`border rounded-xl p-5 transition-colors ${modulesFormState.investimentos_ativo ? 'border-[#16A34A]/40 bg-[#DCFCE7]/30' : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp size={20} className={modulesFormState.investimentos_ativo ? 'text-[#16A34A]' : 'text-[#94A3B8]'} />
                        <div>
                          <h4 className={`font-bold ${modulesFormState.investimentos_ativo ? 'text-[#0F172A] dark:text-white' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>Sistema de Investimentos</h4>
                          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Gestão e acompanhamento de seus investimentos.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer" title="Ativar Sistema de Investimentos">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={modulesFormState.investimentos_ativo ?? false}
                          onChange={(e) => setModulesFormState(prev => ({ ...prev, investimentos_ativo: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
                      </label>
                    </div>

                    <AnimatePresence>
                      {modulesFormState.investimentos_ativo && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-9 pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-[#16A34A]/10 mt-4"
                        >
                          <label className="flex items-center gap-3 cursor-pointer group mt-4">
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulesFormState.investimentos_show_dashboard ?? true}
                                onChange={(e) => setModulesFormState(prev => ({ ...prev, investimentos_show_dashboard: e.target.checked }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
                            </div>
                            <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Visão Geral</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group mt-4">
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulesFormState.investimentos_show_ativos ?? true}
                                onChange={(e) => setModulesFormState(prev => ({ ...prev, investimentos_show_ativos: e.target.checked }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
                            </div>
                            <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Meus Ativos</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group mt-4">
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={modulesFormState.investimentos_show_operacoes ?? true}
                                onChange={(e) => setModulesFormState(prev => ({ ...prev, investimentos_show_operacoes: e.target.checked }))}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
                            </div>
                            <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Reservas</span>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* SISTEMA DE GAME */}
                  <div className={`border rounded-xl p-5 transition-colors ${modulesFormState.game_ativo ? 'border-[#8B5CF6]/40 bg-[#F5F3FF]/30' : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Gamepad2 size={20} className={modulesFormState.game_ativo ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'} />
                        <div>
                          <h4 className={`font-bold ${modulesFormState.game_ativo ? 'text-[#0F172A] dark:text-white' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>Sistema Game</h4>
                          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Módulo de jogos e entretenimento financeiro.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer" title="Ativar Sistema Game">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={modulesFormState.game_ativo ?? false}
                          onChange={(e) => setModulesFormState(prev => ({ ...prev, game_ativo: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                      </label>
                    </div>

                    {modulesFormState.game_ativo && (
                      <div className="mt-4 pl-4 border-l-2 border-[#E2E8F0] dark:border-[#334155] space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#0F172A] dark:text-white">Clash Royale</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={modulesFormState.game_show_clash_royale ?? true}
                              onChange={(e) => setModulesFormState(prev => ({ ...prev, game_show_clash_royale: e.target.checked }))}
                            />
                            <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
                          </label>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#0F172A] dark:text-white">Brawl Stars</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={modulesFormState.game_show_brawl_stars ?? true}
                              onChange={(e) => setModulesFormState(prev => ({ ...prev, game_show_brawl_stars: e.target.checked }))}
                            />
                            <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#334155] flex justify-end">
                    <button
                      onClick={handleSaveModules}
                      disabled={modulesFormLoading}
                      className="bg-[#2563EB] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1D4ED8] transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.2)] disabled:opacity-50 cursor-pointer"
                    >
                      {modulesFormLoading && <Loader2 size={18} className="animate-spin" />}
                      {!modulesFormLoading && <CheckCircle size={18} />}
                      Salvar Configurações
                    </button>
                  </div>
                </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
