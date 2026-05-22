import React, { useEffect, useState } from 'react';
import { getMe } from '../api/usuarioApi';
import { useAuthStore, Usuario } from '../stores/AuthStores';

const perfilLabel: Record<string, string> = {
  ESTUDANTE: 'Estudante',
  PROFESSOR: 'Professor',
  NAPA: 'NAPA',
  ADMIN: 'Administrador',
};

const perfilColor: Record<string, string> = {
  ESTUDANTE: 'bg-blue-100 text-blue-700',
  PROFESSOR: 'bg-purple-100 text-purple-700',
  NAPA: 'bg-orange-100 text-orange-700',
  ADMIN: 'bg-red-100 text-red-700',
};

const PerfilPage: React.FC = () => {
  const { user: userStore } = useAuthStore();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        const dados = await getMe();
        setUsuario(dados);
      } catch (e) {
        // fallback para os dados do store
        setUsuario(userStore);
        setErro('Não foi possível carregar dados atualizados do servidor.');
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Não foi possível carregar seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Meu Perfil</h1>

      {erro && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {erro}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header com avatar */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold shadow">
            {usuario.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{usuario.nome}</h2>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full mt-1 inline-block ${perfilColor[usuario.perfil] ?? 'bg-gray-100 text-gray-700'}`}>
              {perfilLabel[usuario.perfil] ?? usuario.perfil}
            </span>
          </div>
        </div>

        {/* Dados */}
        <div className="px-6 py-5 divide-y divide-gray-100">
          <div className="py-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">ID</span>
            <span className="text-sm font-medium text-gray-800">#{usuario.id}</span>
          </div>
          <div className="py-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">Nome</span>
            <span className="text-sm font-medium text-gray-800">{usuario.nome}</span>
          </div>
          <div className="py-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">E-mail</span>
            <span className="text-sm font-medium text-gray-800">{usuario.email}</span>
          </div>
          <div className="py-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">Perfil de acesso</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${perfilColor[usuario.perfil] ?? 'bg-gray-100 text-gray-700'}`}>
              {perfilLabel[usuario.perfil] ?? usuario.perfil}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;