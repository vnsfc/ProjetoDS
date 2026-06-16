import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { UserPerfil } from '../stores/AuthStores';

export const RegisterForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Cadastro público é exclusivo para ESTUDANTE.
  // PROFESSOR, NAPA e ADMIN só podem ser criados por um ADMIN autenticado.
  const perfil: UserPerfil = 'ESTUDANTE';
  
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
    <form onSubmit={handleSubmit} className="space-y-5 w-full text-left">
      
      {/* Alertas de Erro e Sucesso padronizados com o tema */}
      {error && (
        <p className="text-red-400 text-sm bg-red-950/20 p-3 rounded-lg border border-red-500/30">
          {error}
        </p>
      )}
      {success && (
        <p className="text-emerald-400 text-sm bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/30">
          {success}
        </p>
      )}

      {/* Campo Nome */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#94a3b8]">Nome completo</label>
        <input 
          type="text" 
          required 
          className="w-full px-4 py-3 bg-transparent border border-[#475569] rounded-lg text-[#f8fafc] text-base outline-none transition-all focus:border-[#38bdf8] focus:ring-4 focus:ring-[#38bdf8]/15" 
          placeholder="Digite seu nome"
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
        />
      </div>

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
          placeholder="Crie uma senha"
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
        />
      </div>

      {/* Campo Perfil (Desabilitado) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#94a3b8]">Perfil</label>
        <input
          type="text"
          value="Estudante (Aluno)"
          disabled
          className="w-full px-4 py-3 bg-[#0f172a]/50 border border-[#475569]/50 rounded-lg text-[#94a3b8] text-base outline-none cursor-not-allowed"
        />
        <p className="text-xs text-[#475569] mt-1">
          Outros perfis (Professor, NAPA, Admin) são criados pelo administrador do sistema.
        </p>
      </div>

      {/* Botão de Cadastro Estilo Outline */}
      <button 
        type="submit" 
        className="w-full py-3 mt-4 bg-transparent text-[#38bdf8] border border-[#38bdf8] rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-[#38bdf8] hover:text-[#0f172a]"
      >
        Criar Conta
      </button>
      
    </form>
  );
};
