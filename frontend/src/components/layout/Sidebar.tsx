import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore, type UserPerfil } from '@/stores/AuthStores';
import { cn } from '@/utils';


interface NavItem {
  to: string;
  label: string;
  allowedPerfis: UserPerfil[];
}


const navItems: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Início',
    allowedPerfis: ['ESTUDANTE', 'PROFESSOR', 'NAPA', 'ADMIN'],
  },
  {
    to: '/prontuarios',
    label: 'Prontuários',
    allowedPerfis: ['ESTUDANTE', 'PROFESSOR', 'ADMIN'],
  },
  {
    to: '/triagem',
    label: 'Fila de Espera',
    allowedPerfis: ['NAPA', 'ADMIN'],
  },
  {
    to: '/agenda',
    label: 'Agenda',
    allowedPerfis: ['ADMIN'],
  },
  {
    to: '/usuarios',
    label: 'Usuários',
    allowedPerfis: ['ADMIN'],
  },
  {
    to: '/perfil',
    label: 'Meu Perfil',
    allowedPerfis: ['ESTUDANTE', 'PROFESSOR', 'NAPA', 'ADMIN'],
  },
];


export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();


  const itemsVisiveis = navItems.filter(
    (item) => user && item.allowedPerfis.includes(user.perfil),
  );


  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-100">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Menu
        </span>
      </div>


      <nav className="flex-1 p-3 flex flex-col gap-1">
        {itemsVisiveis.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
