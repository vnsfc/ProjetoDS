import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchFilaEspera, PacienteFila } from '@/api/agenda.api'; 

export const useFilaEspera = () => {
  const { token } = useAuth();

  // Pega a data de hoje no formato YYYY-MM-DD
  const hoje = new Date().toISOString().split('T')[0];
  const [dataSelecionada, setDataSelecionada] = useState<string>(hoje);

  const [fila, setFila] = useState<PacienteFila[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('');

  const carregarFila = async () => {
    if (!token) return;

    try {
      // Passa a data selecionada para a API
      const data = await fetchFilaEspera(token, dataSelecionada);
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
    
    const intervalId = setInterval(carregarFila, 30000); 
    return () => clearInterval(intervalId);
  }, [token, dataSelecionada]); // Atualiza sempre que a data ou o token mudar

  return { fila, loading, error, ultimaAtualizacao, dataSelecionada, setDataSelecionada };
};