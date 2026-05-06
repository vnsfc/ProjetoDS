import React from 'react';
import { useFilaEspera } from '@/hooks/useFilaEspera';
import { FilaEsperaTable } from '@/components/agenda/TabelaFilaEspera'; // Ajustar o caminho

export const TriagemPage: React.FC = () => {
  const { fila, loading, error, ultimaAtualizacao } = useFilaEspera();

  return (
    <div className="p-6 h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fila de Espera (Triagem)</h1>
          <p className="text-gray-500">Gerencie a ordem de atendimento e prioridades dos pacientes.</p>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {ultimaAtualizacao && `Última atualização: ${ultimaAtualizacao}`}
        </div>
      </header>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 flex-1">
        {/* Passando os dados para a tabela isolada */}
        <FilaEsperaTable fila={fila} loading={loading} error={error} />
      </div>
    </div>
  );
};