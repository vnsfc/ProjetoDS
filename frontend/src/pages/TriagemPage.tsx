import React from 'react';
import { useFilaEspera } from '@/hooks/useFilaEspera';
import { FilaEsperaTable } from '@/components/agenda/TabelaFilaEspera';
import { PageHeader } from '@/components/layout';

export const TriagemPage: React.FC = () => {
  const { fila, loading, error, ultimaAtualizacao } = useFilaEspera();

  return (
    <div>
      <PageHeader
        titulo="Fila de Espera (Triagem)"
        descricao="Gerencie a ordem de atendimento e prioridades dos pacientes."
        acao={
          <div className="text-sm text-gray-500 font-medium">
            {ultimaAtualizacao && `Última atualização: ${ultimaAtualizacao}`}
          </div>
        }
      />

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mt-6">
        <FilaEsperaTable fila={fila} loading={loading} error={error} />
      </div>
    </div>
  );
};