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
      const { usuario, user, token } = response.data;
      login(user ?? usuario, token);
      navigate('/dashboard');
    } catch (err: any) {
      const mensagemBackend = err.response?.data?.erro;
      setError(mensagemBackend || 'Não foi possível fazer login. Confira se o backend está rodando.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full text-left">
      {error && (
        <p className="text-red-400 text-sm bg-red-950/20 p-3 rounded-lg border border-red-500/30">
          {error}
        </p>
      )}

      {/* Campo E-mail */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#94a3b8]">E-mail</label>
        <input 
          type="email" 
          required 
          className="w-full px-4 py-3 bg-transparent border border-[#475569] rounded-lg text-[#f8fafc] text-base outline-none transition-all focus:border-[#38bdf8] focus:ring-4 focus:ring-[#38bdf8]/15" 
          placeholder="Digite seu e-mail"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      {/* Campo Senha */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#94a3b8]">Senha</label>
        <input 
          type="password" 
          required 
          className="w-full px-4 py-3 bg-transparent border border-[#475569] rounded-lg text-[#f8fafc] text-base outline-none transition-all focus:border-[#38bdf8] focus:ring-4 focus:ring-[#38bdf8]/15" 
          placeholder="Digite sua senha"
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
        />
      </div>

      {/* Botão de Acesso Estilo Outline */}
      <button 
        type="submit" 
        className="w-full py-3 mt-4 bg-transparent text-[#38bdf8] border border-[#38bdf8] rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-[#38bdf8] hover:text-[#0f172a]"
      >
        Entrar
      </button>

      {/* Link de Navegação Secundário */}
      <p className="text-center text-sm text-[#94a3b8] mt-4">
        Ainda não tem conta?{' '}
        <Link 
          to="/register" 
          className="text-[#38bdf8] font-medium no-underline transition-colors duration-200 hover:text-[#f8fafc]"
        >
          Criar cadastro
        </Link>
      </p>
    </form>
  );
};