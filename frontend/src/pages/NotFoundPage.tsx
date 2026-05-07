import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Página não encontrada
      </h1>
      <p className="text-gray-500 mb-8">
        A página que você está buscando não existe ou foi movida.
      </p>
      <Button onClick={() => navigate('/dashboard')}>Voltar ao início</Button>
    </div>
  );
};
