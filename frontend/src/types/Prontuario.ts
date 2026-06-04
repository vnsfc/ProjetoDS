export interface Prontuario {
  id: number;
  pacienteNome: string;
  evolucaoClinica?: string | null; 
  procedimentos?: string | null;
  status: 'EM_ANDAMENTO' | 'ASSINADO' | 'ARQUIVADO'; 
  examesSolicitados?: string | null;
  prescricoes?: string | null;
  dataAtendimento?: string;
  createdAt: string;
  updatedAt: string;
  estudanteId: number;
  professorId?: number | null;
}

export interface CriarProntuarioDTO {
  pacienteNome: string;
  evolucaoClinica?: string;  
  procedimentos?: string;
}

export interface EditarProntuarioDTO {
  evolucaoClinica?: string;
  procedimentos?: string;
}