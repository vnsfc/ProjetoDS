import React from 'react';
import { RegisterForm } from '@/components/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[400px] p-10 bg-[#1e293b] border border-[#475569] rounded-xl shadow-2xl text-center">
        
        {/* Mesmo Logótipo Estilizado em Outline da Clínica Escola */}
        <div className="flex justify-center mb-6">
          <svg className="w-[72px] h-[72px]" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
            <rect width="180" height="180" rx="20" fill="transparent" stroke="#475569" strokeWidth="2"></rect>
            <rect x="82" y="38" width="16" height="104" rx="4" fill="#38bdf8"></rect>
            <rect x="38" y="82" width="104" height="16" rx="4" fill="#38bdf8"></rect>
          </svg>
        </div>

        <h1 className="text-xl font-semibold tracking-tight mb-1">
          Criar Nova Conta
        </h1>
        <p className="text-[#94a3b8] text-sm mb-8">
          Clínica Escola · UFPE
        </p>

        {/* Inserção do formulário existente que gerencia os inputs de cadastro */}
        <RegisterForm />

        {/* Link de navegação para retornar ao Login */}
        <div className="mt-8 text-sm">
          <span className="text-[#94a3b8]">Já possui acesso?</span>
          <a 
            href="/login" 
            className="text-[#38bdf8] no-underline font-medium ml-1 transition-colors duration-200 hover:text-[#f8fafc]"
          >
            Faça login
          </a>
        </div>
      </div>
    </div>
  );
};