export type StatusProntuario = 'RASCUNHO' | 'ASSINADO';

export interface Prontuario {
  id: number;
  pacienteId: number;
  queixa: string;
  historico: string;
  status: StatusProntuario;
  criadoEm: string;
  atualizadoEm: string;
  assinadoPor?: number;
  assinadoEm?: string;
}

export interface CriarProntuarioDTO {
  queixa: string;
  historico: string;
}

export interface EditarProntuarioDTO {
  queixa?: string;
  historico?: string;
}
