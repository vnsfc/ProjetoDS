import React, { useState } from 'react';
import { useAgenda } from '@/hooks/useAgenda';
import { useAuth } from '@/hooks/useAuth'; // Importado hook de auth
import { Calendario } from '@/components/agenda/Calendario';
import { AgendaTable } from '@/components/agenda/TabelaAgenda';
import { PageHeader } from '@/components/layout';
import { ModalAgendamento } from '@/components/agenda/ModalAgendamento'; 

export const AgendaPage: React.FC = () => {
  const { todosAgendamentos, loading, error, ultimaAtualizacao, refetch } = useAgenda();
  const { user } = useAuth(); // Identifica quem é o usuário
  const [modalAberto, setModalAberto] = useState(false); 

  const dataAtual = new Date();
  const formatarDataBr = (dia: number, mes: number, ano: number) => 
    `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`;
  const dataHojeString = formatarDataBr(dataAtual.getDate(), dataAtual.getMonth(), dataAtual.getFullYear());
  
  const [dataSelecionada, setDataSelecionada] = useState<string>(dataHojeString);

  const normalizarData = (data: string): string => { 
    const d = new Date(data);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const agendamentosDoDia = todosAgendamentos.filter(
    (agendamento) => normalizarData(agendamento.data) === dataSelecionada
  );

  return (
    <div>
      <PageHeader
        titulo="Minha Agenda"
        descricao="Selecione um dia no calendário para ver os horários marcados."
        acao={
          <div className="flex items-center gap-4">
            {/* O Botão agora só renderiza se o perfil for NAPA */}
            {user?.perfil === 'NAPA' && (
              <button 
                onClick={() => setModalAberto(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Novo Agendamento
              </button>
            )}
            <div className="text-sm text-gray-500 font-medium">
              {ultimaAtualizacao && `Última atualização: ${ultimaAtualizacao}`}
            </div>
          </div>
        }
      />

      {error && !todosAgendamentos.length ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center text-red-500 font-medium">
          {error}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
          <Calendario 
            dataSelecionada={dataSelecionada} 
            setDataSelecionada={setDataSelecionada} 
            todosAgendamentos={todosAgendamentos} 
          />
          <AgendaTable 
            agendamentosDoDia={agendamentosDoDia} 
            dataSelecionada={dataSelecionada} 
            loading={loading} 
            refetch={refetch} 
          />
        </div>
      )}

      {modalAberto && (
        <ModalAgendamento 
          onClose={() => setModalAberto(false)} 
          onSave={() => {
            refetch(); 
            setModalAberto(false);
          }} 
        />
      )}
    </div>
  );
};