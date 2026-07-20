import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface CotacaoGSheet {
  TICKER: string;
  ULTIMA_COTACAO: number | string;
  DATA_ATUALIZACAO: string;
}

const API_URL = "/api/cotacoes";

export function useCotacoesGSheets() {
  const [data, setData] = useState<CotacaoGSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCotacoesGoogle = async (isForceSync = false) => {
    try {
      let response;
      if (isForceSync) {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sync' })
        });
      } else {
        response = await fetch(`${API_URL}?t=${Date.now()}`);
      }
      
      const resultText = await response.text();
      
      // Checa se a resposta é HTML (login page) ou JSON
      if (resultText.trim().startsWith('<')) {
        throw new Error('Permissão Negada: Mude "Quem tem acesso" para "Qualquer pessoa" na implantação do Apps Script.');
      }
      
      const resultJSON = JSON.parse(resultText);
      if (Array.isArray(resultJSON)) {
        setData(resultJSON);
        
        // Salva na Supabase para cache em 2º plano
        const cotacoesToUpsert = resultJSON.map(c => ({
          ticker: c.TICKER,
          cotacao: parseFloat(String(c.ULTIMA_COTACAO).replace(',', '.')) || 0,
          updated_at: c.DATA_ATUALIZACAO ? new Date(c.DATA_ATUALIZACAO).toISOString() : new Date().toISOString()
        })).filter(c => c.ticker);

        if (cotacoesToUpsert.length > 0) {
          const { error: err } = await supabase.from('cotacoes_globais').upsert(cotacoesToUpsert, { onConflict: 'ticker' });
          if (err) console.error("Erro ao salvar cache de cotações:", err);
        }
      } else if (resultJSON.error) {
         if (resultJSON.error === 'Ação ignorada') {
            throw new Error('Você precisa atualizar o script no Google Apps Script (veja o guia GOOGLE_APPS_SCRIPT.md) para suportar a sincronização forçada.');
         }
         throw new Error(resultJSON.error);
      }
    } catch (err: any) {
      console.error('Erro ao buscar cotações do Google Sheets:', err);
      // fallback
      throw err;
    }
  };

  const fetchCotacoes = async (forceSync = false) => {
    try {
      setLoading(true);
      setError(null);

      // Primeiro, tenta buscar rápido do cache na Supabase
      const { data: cacheData, error: cacheError } = await supabase
        .from('cotacoes_globais')
        .select('*');
        
      if (!cacheError && cacheData && cacheData.length > 0) {
        setData(cacheData.map((row: any) => ({
          TICKER: row.ticker,
          ULTIMA_COTACAO: row.cotacao,
          DATA_ATUALIZACAO: row.updated_at
        })));
        // Se for forceSync, não tira o loading ainda
        if (!forceSync) {
           setLoading(false); 
        }
      }

      // Baixa dados mais recentes pelo GSheets em "background" (já atualizando o state depois)
      await fetchCotacoesGoogle(forceSync);

    } catch (err: any) {
      setError(err.message || 'Erro ao buscar cotações.');
    } finally {
      setLoading(false);
    }
  };

  const addTickerSync = async (ticker: string) => {
    try {
      // Usamos no-cors pois o Google Apps Script faz redirects e isso costuma falhar o fetch padrão POST
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ action: 'add', ticker })
      });
      if (!res.ok) throw new Error('Failed');
      setTimeout(fetchCotacoes, 4000);
      return true;
    } catch(err) {
      console.error('Erro ao syncar ticker com GSheets', err);
      return false;
    }
  }

  const deleteTickerSync = async (ticker: string) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ action: 'delete', ticker })
      });
      if (!res.ok) throw new Error('Failed');
      setTimeout(fetchCotacoes, 2000);
      return true;
    } catch(err) {
      console.error('Erro ao syncar exclusão do ticker com GSheets', err);
      return false;
    }
  }

  useEffect(() => {
    fetchCotacoes();
    // Refresh quotes every 5 mins
    const interval = setInterval(fetchCotacoes, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchCotacoes, addTickerSync, deleteTickerSync };
}

