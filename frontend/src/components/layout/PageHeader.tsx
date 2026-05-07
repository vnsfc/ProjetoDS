import React from 'react';

interface PageHeaderProps {
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode; // slot para botão de ação no canto direito
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  titulo,
  descricao,
  acao,
}) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
        {descricao && (
          <p className="text-sm text-gray-500 mt-1">{descricao}</p>
        )}
      </div>
      {acao && <div className="flex-shrink-0">{acao}</div>}
    </div>
  );
};
