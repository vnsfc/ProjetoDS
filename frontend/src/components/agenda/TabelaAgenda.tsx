import React from 'react';
import { Agendamento } from '@/api/agenda.api';

interface AgendaTableProps {
  agendamentosDoDia: Agendamento[];
  dataSelecionada: string;
  loading: boolean;
}

export const AgendaTable: React.FC<AgendaTableProps> = ({ 
  agendamentosDoDia, 
  dataSelecionada, 
  loading 
}) => {
  return (
    <div className="w-full lg:w-2/3 bg-white rounded-lg shadow overflow-hidden border border-gray-200 flex-1">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Consultas do dia {dataSelecionada}</h3>
        <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
          {agendamentosDoDia.length} paciente(s)
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Sincronizando com o servidor...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agendamentosDoDia.length > 0 ? (
                agendamentosDoDia
                  .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                        {new Date(item.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          item.status === 'AGENDADO'  ? 'bg-green-100 text-green-700' :
                          item.status === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 font-semibold">Detalhes</button>
                      </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="font-medium text-gray-600">Nenhum agendamento para esta data.</p>
                      <p className="text-sm mt-1 text-gray-400">Clique em outro dia no calendário ao lado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};