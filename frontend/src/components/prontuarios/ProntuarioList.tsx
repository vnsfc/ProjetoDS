import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Card } from '@/components/ui';
import type { Prontuario } from '@/types';
import { formatDateTime } from '@/utils';

interface ProntuarioListProps {
  prontuarios: Prontuario[];
}

export const ProntuarioList: React.FC<ProntuarioListProps> = ({ prontuarios }) => {
  const navigate = useNavigate();

  if (prontuarios.length === 0) {
    return (
      <Card>
        <p className="text-sm text-gray-500">Nenhum prontuário encontrado.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {prontuarios.map((prontuario) => (
        <Card
          key={prontuario.id}
          onClick={() => navigate(`/prontuarios/${prontuario.id}`)}
          className="hover:bg-gray-50"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {prontuario.pacienteNome}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Criado em {formatDateTime(prontuario.createdAt)}
              </p>
            </div>

            <Badge variant={prontuario.status === 'ASSINADO' ? 'success' : 'warning'}>
              {prontuario.status === 'ASSINADO' ? 'Assinado' : 'Pendente'}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Anamnese</p>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {prontuario.evolucaoClinica || 'Sem anamnese registrada.'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Procedimentos</p>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {prontuario.procedimentos || 'Sem procedimentos registrados.'}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
