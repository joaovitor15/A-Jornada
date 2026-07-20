import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'SUA_URL_AQUI';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUA_CHAVE_ANON_AQUI';

const isPlaceholder = !supabaseUrl || 
  supabaseUrl === 'SUA_URL_AQUI' || 
  supabaseUrl.includes('your-supabase-url') ||
  supabaseKey === 'SUA_CHAVE_ANON_AQUI' ||
  typeof window === 'undefined';

// --- MOCK SUPABASE CLIENT FOR OFFLINE / LIVE DEMO ---
class MockQueryBuilder {
  private table: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderCol: string | null = null;
  private orderAsc: boolean = true;
  private limitVal: number | null = null;
  private isSingle: boolean = false;
  private isMaybeSingle: boolean = false;
  private insertData: any = null;
  private updateData: any = null;
  private isDelete: boolean = false;
  private isCount: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns?: string, options?: any) {
    if (options?.count) {
      this.isCount = true;
    }
    return this;
  }

  insert(data: any) {
    this.insertData = data;
    return this;
  }

  update(data: any) {
    this.updateData = data;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push(item => item[col] === val);
    return this;
  }

  in(col: string, vals: any[]) {
    this.filters.push(item => vals.includes(item[col]));
    return this;
  }

  gte(col: string, val: any) {
    this.filters.push(item => item[col] >= val);
    return this;
  }

  lte(col: string, val: any) {
    this.filters.push(item => item[col] <= val);
    return this;
  }

  order(col: string, options?: { ascending?: boolean }) {
    this.orderCol = col;
    this.orderAsc = options?.ascending !== false;
    return this;
  }

  limit(num: number) {
    this.limitVal = num;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  or(expr: string) {
    const conditions = expr.split(',');
    this.filters.push(item => {
      return conditions.some(cond => {
        const parts = cond.split('.');
        const col = parts[0];
        const op = parts[1];
        const val = parts[2];
        if (op === 'eq') {
          return String(item[col]) === val;
        }
        return false;
      });
    });
    return this;
  }

  ilike(col: string, val: string) {
    const cleanVal = val.replace(/%/g, '').toLowerCase();
    this.filters.push(item => String(item[col] || '').toLowerCase().includes(cleanVal));
    return this;
  }

  is(col: string, val: any) {
    this.filters.push(item => item[col] === val);
    return this;
  }

  // Thenable pattern
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const res = await this.execute();
      return onfulfilled ? onfulfilled(res) : res;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  private async execute() {
    const key = `mock_sb_${this.table}`;
    let items: any[] = [];
    try {
      items = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      items = [];
    }

    // Default Seed Data
    if (items.length === 0) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

      if (this.table === 'profiles') {
        items = [
          { 
            id: 'p1', 
            name: 'Pessoal', 
            tipo: 'pessoal', 
            cor: '#2563EB', 
            icone: 'User', 
            is_active: true, 
            created_at: now.toISOString() 
          }
        ];
        localStorage.setItem(key, JSON.stringify(items));
      } else if (this.table === 'categories') {
        items = [
          { id: 'cat-alimentacao', profile_id: 'p1', nome: 'Alimentação', tipo: 'despesa', cor: '#EF4444', icone: 'Utensils', archived: false, created_at: now.toISOString() },
          { id: 'cat-moradia', profile_id: 'p1', nome: 'Moradia', tipo: 'despesa', cor: '#3B82F6', icone: 'Home', archived: false, created_at: now.toISOString() },
          { id: 'cat-transporte', profile_id: 'p1', nome: 'Transporte', tipo: 'despesa', cor: '#F59E0B', icone: 'Car', archived: false, created_at: now.toISOString() },
          { id: 'cat-salario', profile_id: 'p1', nome: 'Salário', tipo: 'receita', cor: '#10B981', icone: 'DollarSign', archived: false, created_at: now.toISOString() },
          { id: 'cat-investimentos', profile_id: 'p1', nome: 'Investimentos', tipo: 'despesa', cor: '#10B981', icone: 'TrendingUp', archived: false, created_at: now.toISOString() }
        ];
        localStorage.setItem(key, JSON.stringify(items));
      } else if (this.table === 'tags') {
        items = [
          { id: 'tag-supermercado', profile_id: 'p1', category_id: 'cat-alimentacao', categoria_id: 'cat-alimentacao', nome: 'Supermercado', archived: false, created_at: now.toISOString() },
          { id: 'tag-restaurante', profile_id: 'p1', category_id: 'cat-alimentacao', categoria_id: 'cat-alimentacao', nome: 'Restaurante', archived: false, created_at: now.toISOString() },
          { id: 'tag-aluguel', profile_id: 'p1', category_id: 'cat-moradia', categoria_id: 'cat-moradia', nome: 'Aluguel', archived: false, created_at: now.toISOString() },
          { id: 'tag-combustivel', profile_id: 'p1', category_id: 'cat-transporte', categoria_id: 'cat-transporte', nome: 'Combustível', archived: false, created_at: now.toISOString() },
          { id: 'tag-salarioprincipal', profile_id: 'p1', category_id: 'cat-salario', categoria_id: 'cat-salario', nome: 'Salário Principal', archived: false, created_at: now.toISOString() },
          { id: 'tag-aportes', profile_id: 'p1', category_id: 'cat-investimentos', categoria_id: 'cat-investimentos', nome: 'Aportes', archived: false, created_at: now.toISOString() },
          { id: 'tag-rendimentos', profile_id: 'p1', category_id: 'cat-investimentos', categoria_id: 'cat-investimentos', nome: 'Rendimentos', archived: false, created_at: now.toISOString() }
        ];
        localStorage.setItem(key, JSON.stringify(items));
      } else if (this.table === 'cards') {
        items = [
          { id: 'card-nubank', profile_id: 'p1', nome: 'Nubank', bandeira: 'Mastercard', limite: 5000, dia_vencimento_fatura: 10, dia_fechamento_fatura: 3, cor: '#820AD1', icone: 'CreditCard', tipo: 'credito', created_at: now.toISOString() }
        ];
        localStorage.setItem(key, JSON.stringify(items));
      } else if (this.table === 'transacoes') {
        items = [
          { id: 'tx-1', profile_id: 'p1', tipo: 'despesa', descricao: 'Rancho Mensal', data: `${currentYear}-${currentMonth}-05`, valor: 350.00, forma_pagamento: 'credito', tag_id: 'tag-supermercado', card_id: 'card-nubank', status: 'pago', criado_em: now.toISOString(), atualizado_em: now.toISOString() },
          { id: 'tx-2', profile_id: 'p1', tipo: 'receita', descricao: 'Meu Salário', data: `${currentYear}-${currentMonth}-01`, valor: 6200.00, forma_pagamento: 'dinheiro', tag_id: 'tag-salarioprincipal', status: 'pago', criado_em: now.toISOString(), atualizado_em: now.toISOString() },
          { id: 'tx-3', profile_id: 'p1', tipo: 'despesa', descricao: 'Pagamento Aluguel', data: `${currentYear}-${currentMonth}-10`, valor: 1500.00, forma_pagamento: 'pix', tag_id: 'tag-aluguel', status: 'pago', criado_em: now.toISOString(), atualizado_em: now.toISOString() },
          { id: 'tx-4', profile_id: 'p1', tipo: 'despesa', descricao: 'Combustível Carro', data: `${currentYear}-${currentMonth}-12`, valor: 120.00, forma_pagamento: 'credito', tag_id: 'tag-combustivel', card_id: 'card-nubank', status: 'pago', criado_em: now.toISOString(), atualizado_em: now.toISOString() },
          { id: 'tx-5', profile_id: 'p1', tipo: 'despesa', descricao: 'Jantar', data: `${currentYear}-${currentMonth}-14`, valor: 85.50, forma_pagamento: 'credito', tag_id: 'tag-restaurante', card_id: 'card-nubank', status: 'pago', criado_em: now.toISOString(), atualizado_em: now.toISOString() }
        ];
        localStorage.setItem(key, JSON.stringify(items));
      } else if (this.table === 'ativos_carteira') {
        items = [
          { id: 'at-1', profile_id: 'p1', classe: 'Ações', ticker_original: 'PETR4', ticker_google: 'BVMF:PETR4', qtd: 50, objetivo: 30, created_at: now.toISOString(), updated_at: now.toISOString() },
          { id: 'at-2', profile_id: 'p1', classe: 'Ações', ticker_original: 'VALE3', ticker_google: 'BVMF:VALE3', qtd: 20, objetivo: 30, created_at: now.toISOString(), updated_at: now.toISOString() },
          { id: 'at-3', profile_id: 'p1', classe: 'Fundos Imobiliários', ticker_original: 'MXRF11', ticker_google: 'BVMF:MXRF11', qtd: 100, objetivo: 40, created_at: now.toISOString(), updated_at: now.toISOString() }
        ];
        localStorage.setItem(key, JSON.stringify(items));
      } else if (this.table === 'cofres') {
        items = [
          { id: 'cf-1', profile_id: 'p1', name: 'Reserva de Emergência', local: 'Tesouro Selic', type: 'reserva', saldo_atual: 5000, objetivo_total: 10000, created_at: now.toISOString() },
          { id: 'cf-2', profile_id: 'p1', name: 'Viagem de Fim de Ano', local: 'Caixinha Nubank', type: 'meta', saldo_atual: 1200, objetivo_total: 4000, created_at: now.toISOString() }
        ];
        localStorage.setItem(key, JSON.stringify(items));
      }
    }

    // Filter
    let filtered = items.filter(x => this.filters.every(f => f(x)));

    // Insert
    if (this.insertData) {
      const toInsert = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const inserted = toInsert.map(x => ({
        id: x.id || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...x
      }));
      items = [...items, ...inserted];
      localStorage.setItem(key, JSON.stringify(items));
      return { data: Array.isArray(this.insertData) ? inserted : inserted[0], error: null };
    }

    // Delete
    if (this.isDelete) {
      const matching = items.filter(x => this.filters.every(f => f(x)));
      items = items.filter(x => !this.filters.every(f => f(x)));
      localStorage.setItem(key, JSON.stringify(items));
      return { data: matching, error: null };
    }

    // Update
    if (this.updateData) {
      const updated: any[] = [];
      items = items.map(x => {
        if (this.filters.every(f => f(x))) {
          const u = { ...x, ...this.updateData, updated_at: new Date().toISOString() };
          updated.push(u);
          return u;
        }
        return x;
      });
      localStorage.setItem(key, JSON.stringify(items));
      return { data: this.isSingle || this.isMaybeSingle ? updated[0] || null : updated, error: null };
    }

    // Select with Count
    if (this.isCount) {
      return { count: filtered.length, data: null, error: null };
    }

    // Expansions for 'transacoes' (nested tags, categories, cards)
    if (this.table === 'transacoes') {
      const allCards = JSON.parse(localStorage.getItem('mock_sb_cards') || '[]');
      const allTags = JSON.parse(localStorage.getItem('mock_sb_tags') || '[]');
      const allCategories = JSON.parse(localStorage.getItem('mock_sb_categories') || '[]');

      filtered = filtered.map(item => {
        const itemCard = allCards.find((c: any) => c.id === item.card_id) || null;
        const itemTag = allTags.find((t: any) => t.id === item.tag_id) || null;
        let tagWithCategory = itemTag;
        if (itemTag) {
          const catId = itemTag.category_id || itemTag.categoria_id;
          const itemCategory = allCategories.find((cat: any) => cat.id === catId) || null;
          tagWithCategory = {
            ...itemTag,
            categories: itemCategory
          };
        }
        return {
          ...item,
          cards: itemCard,
          tags: tagWithCategory
        };
      });
    }

    // Sorting
    if (this.orderCol) {
      filtered.sort((a, b) => {
        const valA = a[this.orderCol!];
        const valB = b[this.orderCol!];
        if (valA < valB) return this.orderAsc ? -1 : 1;
        if (valA > valB) return this.orderAsc ? 1 : -1;
        return 0;
      });
    }

    // Limit
    if (this.limitVal !== null) {
      filtered = filtered.slice(0, this.limitVal);
    }

    if (this.isSingle) {
      return { data: filtered[0] || null, error: filtered[0] ? null : { message: 'Not found' } };
    }
    if (this.isMaybeSingle) {
      return { data: filtered[0] || null, error: null };
    }

    return { data: filtered, error: null };
  }
}

const getMockSession = () => {
  const sessionStr = localStorage.getItem('mock_sb_session');
  if (sessionStr) {
    try { return JSON.parse(sessionStr); } catch (e) {}
  }
  const defaultSession = {
    user: { id: 'mock-user-123', email: 'visitante@jornada.com' },
    access_token: 'mock-token'
  };
  localStorage.setItem('mock_sb_session', JSON.stringify(defaultSession));
  return defaultSession;
};

const mockListeners: any[] = [];

const mockSupabaseClient: any = {
  auth: {
    getSession: async () => {
      return { data: { session: getMockSession() }, error: null };
    },
    onAuthStateChange: (callback: any) => {
      const session = getMockSession();
      mockListeners.push(callback);
      setTimeout(() => {
        callback('SIGNED_IN', session);
      }, 0);
      return { data: { subscription: { unsubscribe: () => {
        const idx = mockListeners.indexOf(callback);
        if (idx !== -1) mockListeners.splice(idx, 1);
      } } } };
    },
    getUser: async () => {
      const session = getMockSession();
      return { data: { user: session?.user || null }, error: null };
    },
    signInWithPassword: async ({ email }: any) => {
      const session = {
        user: { id: 'mock-user-123', email: email || 'visitante@jornada.com' },
        access_token: 'mock-token'
      };
      localStorage.setItem('mock_sb_session', JSON.stringify(session));
      mockListeners.forEach(cb => cb('SIGNED_IN', session));
      return { data: { session, user: session.user }, error: null };
    },
    signUp: async ({ email }: any) => {
      const session = {
        user: { id: 'mock-user-123', email: email || 'visitante@jornada.com' },
        access_token: 'mock-token'
      };
      localStorage.setItem('mock_sb_session', JSON.stringify(session));
      mockListeners.forEach(cb => cb('SIGNED_IN', session));
      return { data: { session, user: session.user }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('mock_sb_session');
      mockListeners.forEach(cb => cb('SIGNED_OUT', null));
      return { error: null };
    }
  },
  from: (tableName: string) => {
    return new MockQueryBuilder(tableName);
  }
};

// --- REAL SUPABASE CLIENT INITIALIZATION ---
let realSupabase: any = null;
if (!isPlaceholder) {
  try {
    realSupabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    });
  } catch (e) {
    console.error("Failed to initialize real Supabase client:", e);
  }
}

export const supabase = realSupabase || mockSupabaseClient;
