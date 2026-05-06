import React from 'react';
import { Agendamento } from '@/api/agenda.api';

interface CalendarioProps {
  dataSelecionada: string;
  setDataSelecionada: (data: string) => void;
  todosAgendamentos: Agendamento[];
}

export const Calendario: React.FC<CalendarioProps> = ({ 
  dataSelecionada, 
  setDataSelecionada, 
  todosAgendamentos 
}) => {
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();

  const formatarDataBr = (dia: number, mes: number, ano: number) => {
    return `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`;
  };

  const dataHojeString = formatarDataBr(dataAtual.getDate(), mesAtual, anoAtual);
  
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1).getDay(); 
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const espacosVazios = Array(primeiroDiaDoMes).fill(null);
  const diasDoMesArray = Array.from({ length: diasNoMes }, (_, i) => i + 1);
  const slotsCalendario = [...espacosVazios, ...diasDoMesArray];

  return (
    <div className="w-full lg:w-1/3 bg-white rounded-lg shadow border border-gray-200 p-5 shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {nomesMeses[mesAtual]} {anoAtual}
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {diasDaSemana.map((dia) => (
          <div key={dia} className="text-xs font-bold text-gray-400 py-1 uppercase">{dia}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {slotsCalendario.map((dia, index) => {
          if (dia === null) {
            return <div key={`vazio-${index}`} className="p-2"></div>;
          }

          const dataDesseDia = formatarDataBr(dia, mesAtual, anoAtual);
          const isSelecionado = dataSelecionada === dataDesseDia;
          const isHoje = dataHojeString === dataDesseDia;
          const temAgendamento = todosAgendamentos.some(a => a.data === dataDesseDia);

          return (
            <button
              key={dia}
              onClick={() => setDataSelecionada(dataDesseDia)}
              className={`
                relative w-10 h-10 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-colors
                ${isSelecionado ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50'}
                ${isHoje && !isSelecionado ? 'bg-gray-100 border border-gray-300' : ''}
              `}
            >
              {dia}
              {temAgendamento && !isSelecionado && (
                <span className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></span>
              )}
              {temAgendamento && isSelecionado && (
                <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};