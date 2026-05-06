import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { UserPerfil } from '../stores/AuthStores';

export const RegisterForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState<UserPerfil>('ESTUDANTE');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axiosInstance.post('/usuarios/cadastro', { nome, email, senha, perfil });
      setSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      // Mostra a mensagem enviada pelo backend quando existir.
      const mensagemBackend = err.response?.data?.erro;
      setError(mensagemBackend || 'Não foi possível criar a conta. Confira se o backend está rodando.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastro de Usuário</h2>
      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</p>}
      {success && <p className="text-green-600 text-sm bg-green-50 p-2 rounded border border-green-200">{success}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome completo</label>
        <input type="text" required className="mt-1 w-full px-3 py-2 border rounded-md" value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">E-mail</label>
        <input type="email" required className="mt-1 w-full px-3 py-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input type="password" required className="mt-1 w-full px-3 py-2 border rounded-md" value={senha} onChange={(e) => setSenha(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Perfil</label>
        <select value={perfil} onChange={(e) => setPerfil(e.target.value as UserPerfil)} className="mt-1 w-full px-3 py-2 border rounded-md bg-white">
          <option value="ESTUDANTE">Estudante (Aluno)</option>
          <option value="PROFESSOR">Professor (Supervisor)</option>
          <option value="NAPA">NAPA</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">
        Criar Conta
      </button>
      <p className="text-center text-sm text-gray-500">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
          Entrar
        </Link>
      </p>
    </form>
  );
};
