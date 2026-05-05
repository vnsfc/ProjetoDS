import React from 'react';
import { useAuthStore } from '@/stores/AuthStores';
import { perfilLabel } from '@/utils';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
      <h1 className="text-lg font-semibold text-gray-800">ProjetoDS</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">
            {user.nome}
            {' · '}
            <span className="text-blue-600 font-medium">
              {perfilLabel(user.perfil)}
            </span>
          </span>
        )}
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  );
};
