export interface Oferta {
  id: number;
  especialidade: string;
  profissional: string;
  horariosDisponiveis: string[];
  local?: string;
}

export interface Agendamento {
  id: number;
  ofertaId: number;
  pacienteId: number;
  horario: string;
  criadoEm: string;
}

export interface CriarAgendamentoDTO {
  ofertaId: number;
  pacienteId: number;
  horario: string;
}
