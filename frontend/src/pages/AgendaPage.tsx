import React, { useState } from 'react';
import { useAgenda } from '@/hooks/useAgenda';
import { Calendario } from '@/components/agenda/Calendario';
import { AgendaTable } from '@/components/agenda/TabelaAgenda';

export const AgendaPage: React.FC = () => {
  const { todosAgendamentos, loading, error, ultimaAtualizacao } = useAgenda();

  const dataAtual = new Date();
  const formatarDataBr = (dia: number, mes: number, ano: number) => 
    `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`;
  const dataHojeString = formatarDataBr(dataAtual.getDate(), dataAtual.getMonth(), dataAtual.getFullYear());
  
  // Controle de estado local para a data clicada no calendário
  const [dataSelecionada, setDataSelecionada] = useState<string>(dataHojeString);

  const normalizarData = (data: string): string => { //agora vai colocar todas em dd/mm/aaaa
    const d = new Date(data)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

  // Filtra os agendamentos pelo dia selecionado
  const agendamentosDoDia = todosAgendamentos.filter(
    (agendamento) => normalizarData(agendamento.data) === dataSelecionada
  );

  return (
    <div className="p-6 h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minha Agenda</h1>
          <p className="text-gray-500">Selecione um dia no calendário para ver os horários marcados.</p>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {ultimaAtualizacao && `Última atualização: ${ultimaAtualizacao}`}
        </div>
      </header>

      {error && !todosAgendamentos.length ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center text-red-500 font-medium flex-1">
          {error}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">
          <Calendario 
            dataSelecionada={dataSelecionada} 
            setDataSelecionada={setDataSelecionada} 
            todosAgendamentos={todosAgendamentos} 
          />
          <AgendaTable 
            agendamentosDoDia={agendamentosDoDia} 
            dataSelecionada={dataSelecionada} 
            loading={loading} 
          />
        </div>
      )}
    </div>
  );
};