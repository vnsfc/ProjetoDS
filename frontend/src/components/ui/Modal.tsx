import React, { useEffect } from 'react';
import { cn } from '@/utils';

interface ModalProps {
  aberto: boolean;
  onFechar: () => void;
  titulo?: string;
  children: React.ReactNode;
  tamanho?: 'sm' | 'md' | 'lg';
}

const tamanhoClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export const Modal: React.FC<ModalProps> = ({
  aberto,
  onFechar,
  titulo,
  children,
  tamanho = 'md',
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
    };
    if (aberto) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'bg-white rounded-lg shadow-xl w-full mx-4',
          tamanhoClasses[tamanho],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {titulo && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
            <button
              onClick={onFechar}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};
