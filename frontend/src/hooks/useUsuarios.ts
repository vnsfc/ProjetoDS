import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';

export interface Usuario {
  id: string | number;
  nome: string;
  email: string;
  perfil: 'ESTUDANTE' | 'PROFESSOR' | 'NAPA' | 'ADMIN';
  ativo?: boolean;
}

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Rota definida em app.ts e usuario.routes.ts: GET /usuarios
      const response = await axiosInstance.get('/usuarios');
      setUsuarios(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      setError(
        err.response?.data?.erro || 
        'Não foi possível carregar a lista de usuários.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return { usuarios, loading, error, refetch: fetchUsuarios };
};