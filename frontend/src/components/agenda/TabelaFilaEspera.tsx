import { useState } from 'react';
import { PrioridadeBadge } from './PrioridadeBadge';
import { PacienteFila, atualizarStatusFila } from '@/api/agenda.api'; 
import { useAuth } from '@/hooks/useAuth'; 
import { ModalDetalhesTriagem } from './ModalDetalhesTriagem';

interface FilaEsperaTableProps {
  fila: PacienteFila[];
  loading: boolean;
  error: string | null;
}

export const FilaEsperaTable = ({ fila, loading, error }: FilaEsperaTableProps) => {
  const { user } = useAuth(); 
  const podeChamar = user?.perfil === 'NAPA' || user?.perfil === 'ADMIN'; 

  const [pacientesChamados, setPacientesChamados] = useState<Set<string | number>>(new Set());
  const [pacienteDetalhe, setPacienteDetalhe] = useState<PacienteFila | null>(null);
  
  // Novo estado para controlar o Filtro de Prioridade
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('TODAS');

  const handleChamar = async (id: string | number) => {
    if (!podeChamar) return; 

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

  // Aplica o filtro na lista ANTES de montar a tabela
  const filaFiltrada = fila.filter(paciente => {
    if (filtroPrioridade === 'TODAS') return true;
    return paciente.prioridade === filtroPrioridade;
  });

  if (loading && fila.length === 0) return <div className="p-8 text-center text-gray-500">Carregando pacientes...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

  return (
    <>
      {/* Nova Barra de Filtro */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">
          Lista de Pacientes 
          <span className="ml-2 text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
            {filaFiltrada.length}
          </span>
        </h3>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Filtrar Prioridade:</span>
          <select 
            className="border border-gray-300 text-sm text-gray-700 rounded-md px-3 py-1.5 outline-none focus:border-blue-500 cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
            value={filtroPrioridade}
            onChange={(e) => setFiltroPrioridade(e.target.value)}
          >
            <option value="TODAS">Mostrar Todas</option>
            <option value="URGENTE">Apenas Urgente</option>
            <option value="NORMAL">Apenas Normal</option>
            <option value="ELETIVO">Apenas Eletivo</option>
          </select>
        </div>
      </div>

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
          {filaFiltrada.length > 0 ? (
            filaFiltrada.map((paciente) => {
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
                    <button 
                      onClick={() => setPacienteDetalhe(paciente)}
                      className="text-gray-500 hover:text-gray-800 mr-4 font-semibold transition-colors"
                    >
                      Detalhes
                    </button>
                    <button 
                      onClick={() => handleChamar(paciente.id)}
                      disabled={isChamado || !podeChamar}
                      className={`${isChamado || !podeChamar ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'} font-semibold transition-colors`}
                    >
                      {isChamado ? 'Já Chamado' : (!podeChamar ? 'Bloqueado' : 'Chamar')}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <p className="font-medium text-gray-600">
                    {fila.length > 0 
                      ? `Nenhum paciente com a prioridade '${filtroPrioridade}'` 
                      : 'Não há registros de triagem para esta data.'}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pacienteDetalhe && (
        <ModalDetalhesTriagem 
          paciente={pacienteDetalhe} 
          onClose={() => setPacienteDetalhe(null)} 
        />
      )}
    </>
  );
};