import { useCallback, useEffect, useState } from 'react';
import { prontuariosApi } from '@/api/prontuarios.api';
import type { CriarProntuarioDTO, EditarProntuarioDTO, Prontuario } from '@/types';

// Hook simples para centralizar carregamento, erro e ações dos prontuários.
export function useProntuarios(carregarAoAbrir = true) {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [loading, setLoading] = useState(carregarAoAbrir);
  const [error, setError] = useState('');

  const carregarProntuarios = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const dados = await prontuariosApi.listar();
      setProntuarios(dados);
    } catch {
      setError('Não foi possível carregar os prontuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  const criarProntuario = async (dados: CriarProntuarioDTO) => {
    return prontuariosApi.criar(dados);
  };

  const atualizarProntuario = async (id: number, dados: EditarProntuarioDTO) => {
    return prontuariosApi.atualizar(id, dados);
  };

  const assinarProntuario = async (id: number) => {
    const prontuarioAtualizado = await prontuariosApi.assinar(id);

    setProntuarios((listaAtual) =>
      listaAtual.map((item) => (item.id === id ? prontuarioAtualizado : item)),
    );

    return prontuarioAtualizado;
  };

  useEffect(() => {
    if (carregarAoAbrir) {
      void carregarProntuarios();
    }
  }, [carregarAoAbrir, carregarProntuarios]);

  return {
    prontuarios,
    loading,
    error,
    carregarProntuarios,
    criarProntuario,
    atualizarProntuario,
    assinarProntuario,
  };
}
