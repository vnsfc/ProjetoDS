import api from '../api/axiosInstance';

export interface PacienteFila {
  id: string | number;
  pacienteNome: string;  // campo retornado pelo backend
  createdAt?: string;    // horário de entrada na fila
  prioridade: string;
  status?: string;       // não existe no model, mas componente exibe fallback 'AGUARDANDO'
  motivo?: string;       
  observacoes?: string;
}

export const fetchFilaEspera = async (_token: string, data?: string): Promise<PacienteFila[]> => {
  try {
    const url = `/agenda/espera${data ? `?data=${data}` : ''}`;
    const response = await api.get<PacienteFila[]>(url);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Acesso negado. Você precisa fazer login para acessar a fila.');
    }
    throw new Error('Falha ao buscar os dados da fila.');
  }
};

export const atualizarStatusFila = async (id: string | number, novoStatus: string): Promise<void> => {
  try {
    // Usamos PATCH (ou PUT) porque estamos apenas atualizando uma propriedade
    await api.patch(`/agenda/espera/${id}`, { status: novoStatus });
  } catch (error: any) {
    console.error("Erro na API ao atualizar status:", error);
    throw new Error('Falha ao atualizar o status do paciente.');
  }
};

export interface Agendamento {
  id: string | number;
  data: string;
  status: 'DISPONIVEL' | 'AGENDADO' | 'CANCELADO';
  pacienteNome: string;   
  usuarioId: number;      
  usuario?: { nome: string };
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
export const criarTriagem = async (dados: { pacienteNome: string; prioridade: string; motivo: string; observacoes: string }): Promise<void> => {
  try {
    await api.post('/agenda/espera', dados); 
  } catch (error: any) {
    console.error("Erro na API ao criar triagem:", error);
    throw new Error('Falha ao cadastrar paciente na fila.');
  }
};
export const cancelarAgendamento = async (token: string, id: string | number): Promise<void> => {
  try {
    await api.patch(`/agenda/${id}/cancelar`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error: any) {
    console.error("Erro na API ao cancelar agendamento:", error);
    throw new Error('Falha ao cancelar o agendamento.');
  }
};