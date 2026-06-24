import React from 'react';
import type { Usuario } from '@/hooks/useUsuarios';

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onInativar: (id: string | number) => void;
}

export const UsuariosTable: React.FC<UsuariosTableProps> = ({ usuarios, onEdit, onInativar }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{usuario.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${usuario.perfil === 'ADMIN' ? 'bg-purple-100 text-purple-800' : ''}
                  ${usuario.perfil === 'PROFESSOR' ? 'bg-blue-100 text-blue-800' : ''}
                  ${usuario.perfil === 'ESTUDANTE' ? 'bg-green-100 text-green-800' : ''}
                  ${usuario.perfil === 'NAPA' ? 'bg-orange-100 text-orange-800' : ''}
                `}>
                  {usuario.perfil}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* Botões agora disparam as funções passadas por prop */}
                <button 
                  onClick={() => onEdit(usuario)} 
                  className="text-blue-600 hover:text-blue-900 mx-2"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onInativar(usuario.id)} 
                  className="text-red-600 hover:text-red-900"
                >
                  Inativar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};