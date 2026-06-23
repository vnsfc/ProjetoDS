import React, { useState } from 'react';
import { PrioridadeBadge } from './PrioridadeBadge';
import { PacienteFila, atualizarStatusFila } from '@/api/agenda.api'; 
import { useAuth } from '@/hooks/useAuth'; // 1. Importando o hook de autenticação

interface FilaEsperaTableProps {
  fila: PacienteFila[];
  loading: boolean;
  error: string | null;
}

export const FilaEsperaTable: React.FC<FilaEsperaTableProps> = ({ fila, loading, error }) => {
  const { user } = useAuth(); // 2. Pegando o usuário logado
  // 3. Criando a regra de permissão
  const podeChamar = user?.perfil === 'NAPA' || user?.perfil === 'ADMIN'; 

  const [pacientesChamados, setPacientesChamados] = useState<Set<string | number>>(new Set());

  const handleChamar = async (id: string | number) => {
    if (!podeChamar) return; // Trava de segurança extra

    setPacientesChamados(prev => new Set(prev).add(id));

    try {
      await atualizarStatusFila(id, 'CHAMADO');
    } catch (err) {
      alert("Não foi possível salvar o status no servidor.");
      setPacientesChamados(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (loading && fila.length === 0) return <div className="p-8 text-center text-gray-500">Carregando pacientes...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

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
          fila.map((paciente) => {
            const isChamado = pacientesChamados.has(paciente.id) || paciente.status === 'CHAMADO';
            const statusAtual = isChamado ? 'CHAMADO' : (paciente.status || 'AGUARDANDO');

            return (
              <tr key={paciente.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paciente.pacienteNome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {paciente.createdAt ? new Date(paciente.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <PrioridadeBadge prioridade={paciente.prioridade} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={`flex items-center gap-2 ${isChamado ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${isChamado ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></span>
                    {statusAtual}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* 4. Aplicando a trava no botão */}
                  <button 
                    onClick={() => handleChamar(paciente.id)}
                    disabled={isChamado || !podeChamar}
                    className={`${isChamado || !podeChamar ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'} font-semibold transition-colors`}
                  >
                    {isChamado ? 'Já Chamado' : (!podeChamar ? 'Sem Permissão' : 'Chamar')}
                  </button>
                </td>
              </tr>
            );
          })
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