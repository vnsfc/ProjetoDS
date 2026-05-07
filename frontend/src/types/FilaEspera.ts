export type Prioridade = 'URGENTE' | 'NORMAL' | 'ELETIVO';

export interface FilaEspera {
  id: number;
  paciente: string;
  pacienteId?: number;
  prioridade: Prioridade;
  motivo: string;
  criadoEm: string;
}

export interface AdicionarFilaDTO {
  paciente: string;
  prioridade: Prioridade;
  motivo: string;
}
