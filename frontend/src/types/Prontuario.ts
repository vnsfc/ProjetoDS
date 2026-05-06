export interface Prontuario {
  id: number;
  pacienteNome: string;
  anamnese?: string | null;
  procedimentos?: string | null;
  assinado: boolean;
  createdAt: string;
  updatedAt: string;
  estudanteId: number;
  professorId?: number | null;
}

export interface CriarProntuarioDTO {
  pacienteNome: string;
  anamnese?: string;
  procedimentos?: string;
}

export interface EditarProntuarioDTO {
  anamnese?: string;
  procedimentos?: string;
}
