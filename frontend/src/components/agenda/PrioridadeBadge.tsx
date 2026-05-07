import React from 'react';

interface PrioridadeBadgeProps {
  prioridade: string;
}

export const PrioridadeBadge: React.FC<PrioridadeBadgeProps> = ({ prioridade }) => {
  const p = prioridade?.toUpperCase();
  const cores: Record<string, string> = {
    URGENTE: 'bg-red-100 text-red-800',
    NORMAL: 'bg-yellow-100 text-yellow-800',
    ELETIVO: 'bg-green-100 text-green-800',
  };
  const cor = cores[p] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cor}`}>
      {prioridade || 'N/A'}
    </span>
  );
};