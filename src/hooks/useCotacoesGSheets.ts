import { useState, useEffect } from 'react';

export interface CotacaoGSheet {
  TICKER: string;
  ULTIMA_COTACAO: number | string;
  DATA_ATUALIZACAO: string;
}

const API_URL = "https://script.google.com/macros/s/AKfycbzmsz9GdRvOtLFvjqEHWCCqpb9FvbsYXKTjGTEzD9dpIaHWL8WzXthKyHJn2B718lZUwA/exec";

export function useCotacoesGSheets() {
  const [data, setData] = useState<CotacaoGSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCotacoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      const resultText = await response.text();
      
      // Checa se a resposta é HTML (login page) ou JSON
      if (resultText.trim().startsWith('<')) {
        throw new Error('Permissão Negada: Mude "Quem tem acesso" para "Qualquer pessoa" na implantação do Apps Script.');
      }
      
      const resultJSON = JSON.parse(resultText);
      if (Array.isArray(resultJSON)) {
        setData(resultJSON);
      } else if (resultJSON.error) {
         throw new Error(resultJSON.error);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar cotações.');
    } finally {
      setLoading(false);
    }
  };

  const addTickerSync = async (ticker: string) => {
    try {
      // Usamos no-cors pois o Google Apps Script faz redirects e isso costuma falhar o fetch padrão POST
      await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify({ action: 'add', ticker }),
        mode: 'no-cors'
      });
      // Como a resposta é no-cors, o opaco impede ler o JSON.
      // Damos um tempo para o GAS processar e re-buscamos.
      setTimeout(fetchCotacoes, 4000);
      return true;
    } catch(err) {
      console.error('Erro ao syncar ticker com GSheets', err);
      return false;
    }
  }

  const deleteTickerSync = async (ticker: string) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify({ action: 'delete', ticker }),
        mode: 'no-cors'
      });
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

