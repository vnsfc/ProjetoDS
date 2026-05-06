import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout';
import { ProntuarioForm } from '@/components/prontuarios';
import { Alert } from '@/components/ui';
import { useProntuarios } from '@/hooks/useProntuarios';
import type { CriarProntuarioDTO, EditarProntuarioDTO } from '@/types';

export const NovoProntuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const { criarProntuario } = useProntuarios(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (dados: CriarProntuarioDTO | EditarProntuarioDTO) => {
    setLoading(true);
    setError('');

    try {
      const novoProntuario = await criarProntuario(dados as CriarProntuarioDTO);
      navigate(`/prontuarios/${novoProntuario.id}`);
    } catch {
      setError('Não foi possível criar o prontuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        titulo="Novo prontuário"
        descricao="Preencha os dados iniciais do atendimento."
      />

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <ProntuarioForm loading={loading} onSubmit={handleSubmit} />
    </div>
  );
};
