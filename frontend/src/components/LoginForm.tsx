import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/AuthStores';
import axiosInstance from '../api/axiosInstance';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('/auth/login', { email, senha });
      // O backend atual devolve "usuario"; este fallback evita erro se mudar para "user".
      const { usuario, user, token } = response.data;
      login(user ?? usuario, token);
      navigate('/dashboard');
    } catch (err: any) {
      // Mostra a mensagem enviada pelo backend quando existir.
      const mensagemBackend = err.response?.data?.erro;
      setError(mensagemBackend || 'Não foi possível fazer login. Confira se o backend está rodando.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Acessar Sistema</h2>
      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">E-mail</label>
        <input type="email" required className="mt-1 w-full px-3 py-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input type="password" required className="mt-1 w-full px-3 py-2 border rounded-md" value={senha} onChange={(e) => setSenha(e.target.value)} />
      </div>
      <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">
        Entrar
      </button>
      <p className="text-center text-sm text-gray-500">
        Ainda não tem conta?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
          Criar cadastro
        </Link>
      </p>
    </form>
  );
};
