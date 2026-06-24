import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout';
import { AssinaturaSection, ProntuarioForm } from '@/components/prontuarios';
import { Alert, Button, Spinner } from '@/components/ui';
import { prontuariosApi } from '@/api/prontuarios.api';
import { useAuth } from '@/hooks/useAuth';
import { useProntuarios } from '@/hooks/useProntuarios';
import type { CriarProntuarioDTO, EditarProntuarioDTO, Prontuario } from '@/types';

export const ProntuarioDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { atualizarProntuario, assinarProntuario } = useProntuarios(false);
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [assinando, setAssinando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function carregarDetalhe() {
      if (!id) return;

      setLoading(true);
      setError('');

      try {
        const dados = await prontuariosApi.buscarPorId(Number(id));
        setProntuario(dados);
      } catch {
        setError('Não foi possível carregar este prontuário.');
      } finally {
        setLoading(false);
      }
    }

    void carregarDetalhe();
  }, [id]);

  const handleSubmit = async (dados: CriarProntuarioDTO | EditarProntuarioDTO) => {
    if (!prontuario) return;

    setSalvando(true);
    setError('');

    try {
      const atualizado = await atualizarProntuario(
        prontuario.id,
        dados as EditarProntuarioDTO,
      );
      setProntuario(atualizado);
    } catch {
      setError('Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  };

  const handleAssinar = async () => {
    if (!prontuario) return;

    setAssinando(true);
    setError('');

    try {
      const atualizado = await assinarProntuario(prontuario.id);
      setProntuario(atualizado);
    } catch {
      setError('Não foi possível assinar o prontuário.');
    } finally {
      setAssinando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !prontuario) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!prontuario) {
    return <Alert variant="warning">Prontuário não encontrado.</Alert>;
  }

  const podeEditar = user?.perfil === 'ESTUDANTE' && prontuario.status !== 'ASSINADO';
  const podeAssinar = user?.perfil === 'PROFESSOR';

  return (
    <div className="space-y-5">
      <PageHeader
        titulo={prontuario.pacienteNome}
        descricao="Detalhes do prontuário selecionado."
        acao={
          <Button type="button" variant="secondary" onClick={() => navigate('/prontuarios')}>
            Voltar
          </Button>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <AssinaturaSection
        prontuario={prontuario}
        podeAssinar={podeAssinar}
        loading={assinando}
        onAssinar={handleAssinar}
      />

      {podeEditar ? (
        <ProntuarioForm
          prontuario={prontuario}
          loading={salvando}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="font-semibold text-gray-900">Anamnese</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-gray-600">
              {prontuario.evolucaoClinica || 'Sem anamnese registrada.'}
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="font-semibold text-gray-900">Procedimentos</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-gray-600">
              {prontuario.procedimentos || 'Sem procedimentos registrados.'}
            </p>
          </section>
        </div>
      )}
    </div>
  );
};
