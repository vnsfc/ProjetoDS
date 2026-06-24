import { useState } from 'react';
import { useFilaEspera } from '@/hooks/useFilaEspera';
import { useAuth } from '@/hooks/useAuth';
import { FilaEsperaTable } from '@/components/agenda/TabelaFilaEspera';
import { PageHeader } from '@/components/layout';
import { ModalNovaTriagem } from '@/components/agenda/ModalTriagem';

export const TriagemPage = () => {
  // Agora puxamos o controle de data do hook
  const { fila, loading, error, ultimaAtualizacao, dataSelecionada, setDataSelecionada } = useFilaEspera();
  const { user } = useAuth();
  const [modalAberto, setModalAberto] = useState(false);

  const podeCriarTriagem = user?.perfil === 'NAPA' || user?.perfil === 'ADMIN';

  return (
    <div>
      <PageHeader
        titulo="Fila de Espera (Triagem)"
        descricao="Gerencie a ordem de atendimento e prioridades dos pacientes."
        acao={
          <div className="flex items-center gap-4">
            
            {/* Novo Input de Data para ver Histórico */}
            <input 
              type="date" 
              value={dataSelecionada} 
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
              title="Selecione um dia para ver o histórico"
            />

            {podeCriarTriagem && (
              <button 
                onClick={() => setModalAberto(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors"
              >
                Nova Triagem
              </button>
            )}
            
            <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
              {ultimaAtualizacao && `Última atualização: ${ultimaAtualizacao}`}
            </div>
          </div>
        }
      />

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mt-6">
        <FilaEsperaTable fila={fila} loading={loading} error={error} />
      </div>

      {modalAberto && (
        <ModalNovaTriagem 
          onClose={() => setModalAberto(false)} 
          onSave={() => window.location.reload()} 
        />
      )}
    </div>
  );
};