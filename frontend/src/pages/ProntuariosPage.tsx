import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout';
import { Alert, Button, Spinner } from '@/components/ui';
import { ProntuarioList } from '@/components/prontuarios';
import { useAuth } from '@/hooks/useAuth';
import { useProntuarios } from '@/hooks/useProntuarios';
import type { Prontuario } from '@/types';

type StatusFiltro = 'TODOS' | 'EM_ANDAMENTO' | 'ASSINADO' | 'ARQUIVADO';

export const ProntuariosPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { prontuarios, loading, error } = useProntuarios();

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('TODOS');

  // Filtragem local — busca por nome e filtro por status
  const prontuariosFiltrados: Prontuario[] = prontuarios.filter((p) => {
    const buscaOk = p.pacienteNome.toLowerCase().includes(busca.toLowerCase());
    const statusOk = statusFiltro === 'TODOS' || p.status === statusFiltro;
    return buscaOk && statusOk;
  });

  const statusOpcoes: { valor: StatusFiltro; label: string }[] = [
    { valor: 'TODOS', label: 'Todos' },
    { valor: 'EM_ANDAMENTO', label: 'Em andamento' },
    { valor: 'ASSINADO', label: 'Assinado' },
    { valor: 'ARQUIVADO', label: 'Arquivado' },
  ];

  return (
    <div>
      <PageHeader
        titulo="Prontuários"
        descricao="Consulte os registros clínicos e acompanhe as assinaturas."
        acao={
          user?.perfil === 'ESTUDANTE' ? (
            <Button type="button" onClick={() => navigate('/prontuarios/novo')}>
              Novo prontuário
            </Button>
          ) : null
        }
      />

      {/* Barra de busca e filtro */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome do paciente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 flex-wrap">
          {statusOpcoes.map((opcao) => (
            <button
              key={opcao.valor}
              onClick={() => setStatusFiltro(opcao.valor)}
              className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                statusFiltro === opcao.valor
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {opcao.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && (
        <>
          {prontuariosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">Nenhum prontuário encontrado.</p>
              {busca || statusFiltro !== 'TODOS' ? (
                <button
                  onClick={() => { setBusca(''); setStatusFiltro('TODOS'); }}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  Limpar filtros
                </button>
              ) : null}
            </div>
          ) : (
            <ProntuarioList prontuarios={prontuariosFiltrados} />
          )}
        </>
      )}
    </div>
  );
};
