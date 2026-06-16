import React from 'react';
import { PrioridadeBadge } from './PrioridadeBadge';
import { PacienteFila } from '@/api/agenda.api'; // Ajustar o caminho caso ele mude para outra pasta

interface FilaEsperaTableProps {
  fila: PacienteFila[];
  loading: boolean;
  error: string | null;
}

export const FilaEsperaTable: React.FC<FilaEsperaTableProps> = ({ fila, loading, error }) => {
  if (loading && fila.length === 0) {
    return <div className="p-8 text-center text-gray-500">Carregando pacientes...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chegada</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridade</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {fila.length > 0 ? (
          fila.map((paciente) => (
            <tr key={paciente.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paciente.pacienteNome}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {paciente.createdAt ? new Date(paciente.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <PrioridadeBadge prioridade={paciente.prioridade} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  {paciente.status || 'AGUARDANDO'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 font-semibold">Chamar</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
              Não tem ninguém na fila no momento.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};