import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchAgenda, Agendamento } from '@/api/agenda.api';

export const useAgenda = () => {
  const { token } = useAuth();
  
  const [todosAgendamentos, setTodosAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('');

  const carregarAgenda = async () => {
    if (!token) return;

    try {
      const data = await fetchAgenda(token);
      setTodosAgendamentos(data);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao carregar agenda:", err);
      setError(err.message || 'Erro de conexão com o servidor.');
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

    carregarAgenda();
    const intervalId = setInterval(carregarAgenda, 30000); 
    return () => clearInterval(intervalId);
  }, [token]);

  return { todosAgendamentos, loading, error, ultimaAtualizacao };
};