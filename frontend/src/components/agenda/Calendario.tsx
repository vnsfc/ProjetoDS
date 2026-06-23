import React, { useState } from 'react'; // 1. Adicionado useState
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
  // 2. Estado para controlar o mês/ano que o usuário está visualizando
  const [dataVisualizada, setDataVisualizada] = useState(new Date());
  const mesAtual = dataVisualizada.getMonth();
  const anoAtual = dataVisualizada.getFullYear();

  const mudarMes = (direcao: number) => {
    setDataVisualizada(new Date(anoAtual, mesAtual + direcao, 1));
  };

  const formatarDataBr = (dia: number, mes: number, ano: number) => {
    return `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`;
  };

  const dataHoje = new Date();
  const dataHojeString = formatarDataBr(dataHoje.getDate(), dataHoje.getMonth(), dataHoje.getFullYear());
  
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1).getDay(); 
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const slotsCalendario = [...Array(primeiroDiaDoMes).fill(null), ...Array.from({ length: diasNoMes }, (_, i) => i + 1)];

  return (
    <div className="w-full lg:w-1/3 bg-white rounded-lg shadow border border-gray-200 p-5 shrink-0">
      <div className="flex justify-between items-center mb-4">
        {/* 3. Botões de navegação adicionados */}
        <button 
          onClick={() => mudarMes(-1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          &lt;
        </button>
        <h2 className="text-lg font-bold text-gray-800">
          {nomesMeses[mesAtual]} {anoAtual}
        </h2>
        <button 
          onClick={() => mudarMes(1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {diasDaSemana.map((dia) => (
          <div key={dia} className="text-xs font-bold text-gray-400 py-1 uppercase">{dia}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {slotsCalendario.map((dia, index) => {
          if (dia === null) return <div key={`vazio-${index}`} className="p-2"></div>;

          const dataDesseDia = formatarDataBr(dia, mesAtual, anoAtual);
          const isSelecionado = dataSelecionada === dataDesseDia;
          const isHoje = dataHojeString === dataDesseDia;
          const temAgendamento = todosAgendamentos.some(a => {
            const d = new Date(a.data);
            return formatarDataBr(d.getDate(), d.getMonth(), d.getFullYear()) === dataDesseDia;
          });

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
              {temAgendamento && (
                <span className={`
                  absolute -bottom-1 left-1/2 -translate-x-1/2
                  flex gap-0.5
                `}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelecionado ? 'bg-white' : 'bg-blue-500'}`}/>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}; 