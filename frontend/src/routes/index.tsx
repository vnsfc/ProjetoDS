import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './privateRoute';
import { useAuthStore } from '../stores/AuthStores';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Seja bem-vindo, {user?.nome}!</h1>
      <p className="text-gray-600 mt-1">Seu nível de acesso atual: <strong className="text-blue-600">{user?.perfil}</strong></p>
      <button onClick={logout} className="mt-6 px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition-colors">Sair</button>
    </div>
  );
};

const Unauthorized = () => (
  <div className="p-8 text-center max-w-md mx-auto mt-20">
    <h1 className="text-2xl font-bold text-red-600">Acesso Restrito</h1>
    <p className="text-gray-600 mt-2">Você não possui permissões suficientes para visualizar esta página.</p>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rotas genéricas para qualquer usuário logado */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Rotas do Prontuário (Estudante, Professor, Admin) */}
        <Route element={<PrivateRoute allowedProfiles={['ESTUDANTE', 'PROFESSOR', 'ADMIN']} />}>
          <Route path="/prontuarios" element={<div className="p-8">Prontuários (Pessoa 5)</div>} />
        </Route>

        {/* Rotas de Triagem e Fila (NAPA e Admin) */}
        <Route element={<PrivateRoute allowedProfiles={['NAPA', 'ADMIN']} />}>
          <Route path="/triagem" element={<div className="p-8">Fila de Espera (Pessoa 3)</div>} />
        </Route>

        {/* Rotas de Ofertas e Horários (Admin) */}
        <Route element={<PrivateRoute allowedProfiles={['ADMIN']} />}>
          <Route path="/agenda" element={<div className="p-8">Agendas e Ofertas (Pessoa 4)</div>} />
          <Route path="/usuarios" element={<div className="p-8">Gestão de Usuários (Pessoa 2)</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};