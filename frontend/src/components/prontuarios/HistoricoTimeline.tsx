import React from 'react';
import { HistoricoRegistro } from '@/types/Prontuario';
import { formatDate } from '@/utils/formatDate';

interface HistoricoTimelineProps {
  historico: HistoricoRegistro[];
}

export const HistoricoTimeline: React.FC<HistoricoTimelineProps> = ({ historico }) => {
  if (!historico || historico.length === 0) {
    return (
      <div className="text-center p-6 border border-[#475569] rounded-lg border-dashed">
        <p className="text-[#94a3b8] text-sm">Nenhum histórico de alterações encontrado.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-[#f8fafc] mb-6">Histórico do Prontuário</h3>
      
      <div className="relative border-l border-[#475569] ml-3 space-y-6">
        {historico.map((item) => (
          <div key={item.id} className="relative pl-6">
            {/* Ponto na linha do tempo (Outline) */}
            <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-[#38bdf8] bg-[#0f172a]" />
            
            {/* Cartão de Alteração (Estilo Transparente com Contorno) */}
            <div className="p-4 bg-transparent border border-[#475569] rounded-lg transition-colors hover:border-[#38bdf8]/50">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                
                {/* Ação e Nome do Utilizador */}
                <div>
                  <span className="text-sm font-medium text-[#f8fafc]">
                    {item.acao === 'CRIACAO' && 'Prontuário Criado'}
                    {item.acao === 'EDICAO' && 'Informações Editadas'}
                    {item.acao === 'ASSINATURA' && 'Validação/Assinatura'}
                    {item.acao === 'ANEXO' && 'Documento Anexado'}
                  </span>
                  <div className="text-xs text-[#94a3b8] mt-1">
                    Por <span className="text-[#38bdf8]">{item.usuarioNome}</span> 
                    <span className="ml-1 opacity-75">({item.perfil})</span>
                  </div>
                </div>

                {/* Data e Hora */}
                <time className="text-xs text-[#475569] font-mono whitespace-nowrap">
                  {/* Se tiver a função formatDate, use-a. Aqui está um fallback simples */}
                  {formatDate(item.dataHora)}
                </time>
              </div>

              {/* Descrição detalhada do que foi alterado */}
              <p className="text-sm text-[#94a3b8] mt-2 border-t border-[#475569]/30 pt-2">
                {item.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};