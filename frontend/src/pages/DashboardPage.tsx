import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { perfilLabel } from '@/utils';
import { type UserPerfil } from '@/types';

interface Atalho {
  to: string;
  label: string;
  descricao: string;
}

const atalhosPorPerfil: Record<UserPerfil, Atalho[]> = {
  ESTUDANTE: [
    {
      to: '/prontuarios/novo',
      label: 'Novo Prontuário',
      descricao: 'Criar um novo registro clínico',
    },
    {
      to: '/prontuarios',
      label: 'Meus Prontuários',
      descricao: 'Consultar histórico de atendimentos',
    },
  ],
  PROFESSOR: [
    {
      to: '/prontuarios',
      label: 'Prontuários',
      descricao: 'Prontuários aguardando assinatura',
    },
    {
      to: '/triagem',
      label: 'Fila de Espera',
      descricao: 'Pacientes aguardando atendimento',
    },
    {
      to: '/agenda',
      label: 'Agenda',
      descricao: 'Gerenciar agendamentos',
    },
  ],
  NAPA: [
    {
      to: '/triagem',
      label: 'Fila de Espera',
      descricao: 'Gerenciar pacientes na fila',
    },
    {
      to: '/agenda',
      label: 'Agenda',
      descricao: 'Gerenciar agendamentos e ofertas',
    },
  ],
  ADMIN: [
    {
      to: '/prontuarios',
      label: 'Prontuários',
      descricao: 'Todos os prontuários do sistema',
    },
    {
      to: '/triagem',
      label: 'Fila de Espera',
      descricao: 'Gerenciar fila de atendimento',
    },
    {
      to: '/agenda',
      label: 'Agenda',
      descricao: 'Gerenciar agendamentos',
    },
    {
      to: '/usuarios',
      label: 'Usuários',
      descricao: 'Gerenciar contas do sistema',
    },
  ],
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const primeiroNome = user.nome.split(' ')[0];
  const atalhos = atalhosPorPerfil[user.perfil] ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Seja bem-vindo, {primeiroNome}!
      </h1>
      <p className="text-gray-500 mb-8">
        Você está logado como{' '}
        <strong className="text-blue-600">{perfilLabel(user.perfil)}</strong>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {atalhos.map((atalho) => (
          <Card
            key={atalho.to}
            onClick={() => navigate(atalho.to)}
          >
            <h2 className="font-semibold text-gray-800 mb-1">{atalho.label}</h2>
            <p className="text-sm text-gray-500">{atalho.descricao}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
