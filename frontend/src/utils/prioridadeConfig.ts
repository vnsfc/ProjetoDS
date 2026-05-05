import { type Prioridade } from '@/types';

interface PrioridadeConfig {
  label: string;
  badgeClass: string;
}

const config: Record<Prioridade, PrioridadeConfig> = {
  URGENTE: {
    label: 'Urgente',
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
  },
  NORMAL: {
    label: 'Normal',
    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  ELETIVO: {
    label: 'Eletivo',
    badgeClass: 'bg-green-100 text-green-800 border-green-300',
  },
};

export function prioridadeConfig(prioridade: Prioridade): PrioridadeConfig {
  return config[prioridade];
}
