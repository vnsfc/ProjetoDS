import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchFilaEspera, PacienteFila } from '@/api/agenda.api'; // Ajustar caso o arquivo mude de lugar

export const useFilaEspera = () => {
  const { token } = useAuth();

  const [fila, setFila] = useState<PacienteFila[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('');

  const carregarFila = async () => {
    if (!token) return;

    try {
      const data = await fetchFilaEspera(token);
      setFila(data);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao carregar fila:", err);
      setError(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
      setUltimaAtualizacao(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Aguardando autenticação. Faça login no sistema.');
      setLoading(false);
      return;
    }

    carregarFila();
    
    // Atualiza a lista de espera a cada 30 segundos
    const intervalId = setInterval(carregarFila, 30000); 
    return () => clearInterval(intervalId);
  }, [token]);

  return { fila, loading, error, ultimaAtualizacao };
};