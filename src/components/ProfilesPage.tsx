import React, { useState, useRef, useEffect } from 'react';
import { 
  UserPlus, Pencil, Trash2, CheckCircle, XCircle, X, Check, Loader2, AlertCircle, User,
  Building2, Gamepad2, Zap, Wallet, TrendingUp, ChevronDown, Search, Pipette, Settings, Home
} from 'lucide-react';
import { useProfiles, SupabaseProfile } from '../hooks/useProfiles';
import { motion, AnimatePresence } from 'motion/react';

const PROFILE_COLORS = [
  '#2563EB', '#7C3AED', '#16A34A', '#EF4444', '#F97316',
  '#EC4899', '#0F172A', '#06B6D4', '#84CC16', '#D97706'
];

const PROFILE_ICONS: Array<{ name: string; component: any }> = [
  { name: 'User', component: User },
  { name: 'Building2', component: Building2 },
  { name: 'Home', component: Home }
];

interface ProfilesPageProps {
  profiles: SupabaseProfile[];
  loading: boolean;
  error: string | null;
  createProfile: (name: string, tipo: 'pessoal' | 'empresa', cor: string, icone: string) => Promise<{ error: any }>;
  updateProfile: (id: string, name: string, tipo: 'pessoal' | 'empresa', cor: string, icone: string) => Promise<{ error: any }>;
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
    tipo: 'pessoal' | 'empresa';
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
        financeiro_show_dashboard: managedProfile.financeiro_show_dashboard ?? true,
        financeiro_show_transacoes: managedProfile.financeiro_show_transacoes ?? true,
        financeiro_show_transacoes_recorrentes: managedProfile.financeiro_show_transacoes_recorrentes ?? true,
        financeiro_show_relatorios: managedProfile.financeiro_show_relatorios ?? true,
        financeiro_show_categorias: managedProfile.financeiro_show_categorias ?? true,
        financeiro_show_cartoes: managedProfile.financeiro_show_cartoes ?? true,
        investimentos_show_ativos: managedProfile.investimentos_show_ativos ?? true,
        investimentos_show_operacoes: managedProfile.investimentos_show_operacoes ?? true,
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
        setSuccessMsg('Páginas atualizadas com sucesso!');
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
            className="btn-salvar group"
          >
            <UserPlus size={18} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
            <span className="uppercase">Novo Perfil</span>
          </button>
        )}
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#F0FDF4] dark:bg-[#0B0F19] border border-[#BBF7D0] dark:border-[#16A34A]/20 text-[#15803D] dark:text-[#4ADE80] px-6 py-4 rounded-[24px] flex items-center gap-3 shadow-sm dark:shadow-lg"
        >
          <Check size={20} className="text-[#22C55E] dark:text-[#4ADE80]" />
          <span className="font-medium text-[15px]">{successMsg}</span>
        </motion.div>
      )}

      {(error || localError) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FEF2F2] dark:bg-[#0B0F19] border border-[#FECACA] dark:border-[#EF4444]/20 text-[#B91C1C] dark:text-[#F87171] px-6 py-4 rounded-[24px] flex items-center gap-3 shadow-sm dark:shadow-lg"
        >
          <AlertCircle size={20} className="text-[#EF4444] dark:text-[#F87171]" />
          <span className="font-medium text-[15px]">{error || localError}</span>
        </motion.div>
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
              className="bg-white dark:bg-[#0B0F19] p-6 lg:p-8 rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm dark:shadow-lg space-y-6 mb-8"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
                      <div
                        onClick={() => setFormData({ ...formData, tipo: 'pessoal' })}
                        className={`flex items-center gap-[10px] p-[12px_14px] rounded-[12px] border-[1.5px] cursor-pointer transition-all group ${
                          formData.tipo === 'pessoal'
                            ? 'border-transparent bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-md'
                            : 'border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0B0F19] hover:border-[#2563EB]/50'
                        }`}
                      >
                        <User size={18} className={formData.tipo === 'pessoal' ? 'text-white' : 'text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#2563EB] transition-colors'} />
                        <div>
                          <div className={`text-[14px] font-semibold ${formData.tipo === 'pessoal' ? 'text-white' : 'text-[#0F172A] dark:text-white group-hover:text-[#2563EB] transition-colors'}`}>Pessoal</div>
                          <div className={`text-[11px] ${formData.tipo === 'pessoal' ? 'text-white/80' : 'text-[#94A3B8]'}`}>Finanças pessoais</div>
                        </div>
                      </div>
                      <div
                        onClick={() => setFormData({ ...formData, tipo: 'empresa' })}
                        className={`flex items-center gap-[10px] p-[12px_14px] rounded-[12px] border-[1.5px] cursor-pointer transition-all group ${
                          formData.tipo === 'empresa'
                            ? 'border-transparent bg-gradient-to-br from-[#F59E0B] to-[#D97706] shadow-md'
                            : 'border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0B0F19] hover:border-[#F59E0B]/50'
                        }`}
                      >
                        <Building2 size={18} className={formData.tipo === 'empresa' ? 'text-white' : 'text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#F59E0B] transition-colors'} />
                        <div>
                          <div className={`text-[14px] font-semibold ${formData.tipo === 'empresa' ? 'text-white' : 'text-[#0F172A] dark:text-white group-hover:text-[#F59E0B] transition-colors'}`}>Empresa</div>
                          <div className={`text-[11px] ${formData.tipo === 'empresa' ? 'text-white/80' : 'text-[#94A3B8]'}`}>Gestão empresarial</div>
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
                    className="btn-salvar flex-1"
                  >
                    {formLoading && <Loader2 size={18} className="animate-spin" />}
                    {editingProfile ? 'Salvar' : 'Criar Perfil'}
                  </button>
                  <button 
                    type="button"
                    onClick={handleCloseForm}
                    className="btn-cancelar flex-1"
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
                  className="btn-cancelar flex-1"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(deletingId)}
                  className="btn-salvar flex-1"
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
              onClick={() => {
                if (!profile.is_active) {
                  setProfileActive(profile.id);
                }
              }}
              className={`border rounded-[24px] p-6 shadow-sm flex flex-col justify-between group transition-all relative overflow-hidden ${
                profile.is_active 
                  ? 'bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B0F19] dark:to-[#0F172A] border-[#2563EB]/30 dark:border-[#2563EB]/30 shadow-md dark:shadow-lg' 
                  : 'bg-white dark:bg-[#0B0F19] border-[#E2E8F0] dark:border-[#1E293B] dark:shadow-lg cursor-pointer hover:border-[#2563EB]/50'
              }`}
            >
              {profile.is_active && (
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-[#2563EB] rounded-full blur-3xl opacity-[0.15] dark:opacity-[0.15] pointer-events-none"></div>
              )}
              <div className="flex items-start justify-between relative z-10">
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
                  <div className="min-w-0 flex flex-col items-start gap-2">
                    <h4 className="font-bold text-[#0F172A] dark:text-white text-[16px] truncate leading-none">{profile.name}</h4>
                    
                    <div className="flex flex-col items-start gap-1">
                      {profile.tipo === 'empresa' ? (
                        <span className="flex items-center gap-1 text-[#D97706] font-[800] text-[10px] uppercase tracking-wider">
                          <Building2 size={12} strokeWidth={3} />
                          Empresa
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#2563EB] font-[800] text-[10px] uppercase tracking-wider">
                          <User size={12} strokeWidth={3} />
                          Pessoal
                        </span>
                      )}
                      
                      {profile.is_active ? (
                        <span className="flex items-center gap-1 text-[#10B981] font-[800] text-[10px] uppercase tracking-wider">
                          <CheckCircle size={12} strokeWidth={3} />
                          Ativo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#94A3B8] font-[800] text-[10px] uppercase tracking-wider">
                          <XCircle size={12} strokeWidth={3} />
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManageModules(profile.id);
                    }}
                    title="Gerenciar Páginas"
                    className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#2563EB] dark:hover:text-[#60A5FA] rounded-lg transition-colors bg-transparent"
                  >
                    <Settings size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenForm(profile);
                    }}
                    title="Editar"
                    className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#2563EB] dark:hover:text-[#60A5FA] rounded-lg transition-colors bg-transparent"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingId(profile.id);
                    }}
                    title="Deletar"
                    className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#EF4444] rounded-lg transition-colors bg-transparent"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {profiles.length === 0 && !loading && (
            <div className="col-span-full bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] rounded-[24px] p-12 text-center shadow-sm dark:shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2563EB] rounded-full blur-3xl opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"></div>
               <div className="mb-4 text-[#3B82F6] relative z-10">
                <User size={48} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 space-y-2 mb-6">
                <h3 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">Nenhum perfil encontrado</h3>
                <p className="text-[#64748B] dark:text-[#94A3B8] text-[15px]">Comece criando seu primeiro perfil financeiro.</p>
              </div>
              <button 
                onClick={() => handleOpenForm()}
                className="btn-salvar relative z-10"
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
            className="bg-white dark:bg-[#0B0F19] rounded-[24px] shadow-sm dark:shadow-lg border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden mt-8"
          >
            <div className="flex items-center justify-between p-6 lg:p-8 bg-transparent border-b border-[#E2E8F0] dark:border-[#1E293B] relative z-10">
              <div className="flex items-center gap-3 text-left">
                <div className="text-[#2563EB] bg-blue-100 dark:bg-[#2563EB]/20 p-2 rounded-lg">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] dark:text-white text-lg">Gerenciar Páginas</h3>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Ative ou desative páginas para o perfil: <span className="font-semibold">{managedProfile.name}</span></p>
                </div>
              </div>
              <button 
                onClick={() => setIsModulesOpen(false)}
                className="p-2 text-[#64748B] dark:text-[#94A3B8] hover:text-red-500 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 lg:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
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
                <label className="flex items-center gap-3 cursor-pointer group">
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
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={modulesFormState.financeiro_show_transacoes_recorrentes ?? true}
                      onChange={(e) => setModulesFormState(prev => ({ ...prev, financeiro_show_transacoes_recorrentes: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                  </div>
                  <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Provisões</span>
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
                  <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Cartões</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={modulesFormState.investimentos_show_ativos ?? true}
                      onChange={(e) => setModulesFormState(prev => ({ ...prev, investimentos_show_ativos: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                  </div>
                  <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Investimentos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={modulesFormState.investimentos_show_operacoes ?? true}
                      onChange={(e) => setModulesFormState(prev => ({ ...prev, investimentos_show_operacoes: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-[#334155] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 dark:bg-[#1E293B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                  </div>
                  <span className="text-sm font-medium text-[#374151] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:text-white">Reserva</span>
                </label>
              </div>

                  <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#334155] flex justify-end">
                    <button
                      onClick={handleSaveModules}
                      disabled={modulesFormLoading}
                      className="btn-salvar flex-1"
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
