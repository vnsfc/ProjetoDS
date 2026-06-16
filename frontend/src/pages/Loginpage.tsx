import React from 'react';
import { LoginForm } from '@/components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[400px] p-10 bg-[#1e293b] border border-[#475569] rounded-xl shadow-2xl text-center">
        
        {/* SVG Baseado no Logótipo da Clínica Escola */}
        <div className="flex justify-center mb-6">
          <svg className="w-[72px] height-[72px]" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
            <rect width="180" height="180" rx="20" fill="transparent" stroke="#475569" strokeWidth="2"></rect>
            <rect x="82" y="38" width="16" height="104" rx="4" fill="#38bdf8"></rect>
            <rect x="38" y="82" width="104" height="16" rx="4" fill="#38bdf8"></rect>
          </svg>
        </div>

        <h1 className="text-cd font-semibold tracking-tight mb-1 text-xl">
          Sistema de Odontologia
        </h1>
        <p className="text-[#94a3b8] text-sm mb-8">
          Clínica Escola · UFPE
        </p>

        {/* Formulário de Login com Estética Outline */}
        <LoginForm />

        <div className="mt-8 text-sm">
          <a href="#" className="text-[#94a3b8] no-underline transition-colors duration-200 hover:text-[#f8fafc]">
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
};