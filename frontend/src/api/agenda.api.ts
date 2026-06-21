import api from '../api/axiosInstance';

export interface PacienteFila {
  id: string | number;
  pacienteNome: string;  // campo retornado pelo backend
  createdAt?: string;    // horário de entrada na fila
  prioridade: string;
  status?: string;       // não existe no model, mas componente exibe fallback 'AGUARDANDO'
}

export const fetchFilaEspera = async (_token: string): Promise<PacienteFila[]> => {
  try {
    const response = await api.get<PacienteFila[]>('/agenda/espera');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Acesso negado. Você precisa fazer login para acessar a fila.');
    }
    throw new Error('Falha ao buscar os dados da fila.');
  }
};

export interface Agendamento {
  id: string | number;
  data: string;
  status: 'DISPONIVEL' | 'AGENDADO' | 'CANCELADO';  
  createdAt?: string;
  updatedAt?: string;
}

export const fetchAgenda = async (_token: string): Promise<Agendamento[]> => {
  try {
    const response = await api.get<Agendamento[]>('/agenda');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Acesso negado. Sessão expirada, faça login novamente.');
    }
    throw new Error('Falha ao buscar os dados da agenda no servidor.');
  }
};