import { PacienteFila } from '@/api/agenda.api';
import { PrioridadeBadge } from './PrioridadeBadge';

export const ModalDetalhesTriagem = ({ paciente, onClose }: { paciente: PacienteFila, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Detalhes da Triagem</h2>
          <PrioridadeBadge prioridade={paciente.prioridade} />
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-500">Paciente</p>
            <p className="text-gray-900 text-lg">{paciente.pacienteNome}</p>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-gray-500">Motivo da Consulta</p>
            <p className="text-gray-800 bg-gray-50 p-3 rounded border border-gray-100">{paciente.motivo || 'Não informado.'}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">Observações Extras</p>
            <p className="text-gray-800 bg-gray-50 p-3 rounded border border-gray-100">{paciente.observacoes || 'Nenhuma observação.'}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Fechar</button>
        </div>
      </div>
    </div>
  );
};