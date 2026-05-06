export interface PacienteFila {
  id: string | number;
  nome: string;
  horaChegada?: string; 
  prioridade: string;
  status: string;
}

export const fetchFilaEspera = async (token: string): Promise<PacienteFila[]> => {
  const response = await fetch('/agenda/espera', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  }); 

  if (response.status === 401) {
    throw new Error('Acesso negado. Você precisa fazer login para acessar a fila.');
  }

  if (!response.ok) {
    throw new Error('Falha ao buscar os dados da fila.');
  }

  return response.json();
};

export interface Agendamento {
  id: string | number;
  paciente: string;
  data: string; 
  horario: string;
  status: 'CONFIRMADO' | 'PENDENTE' | 'CANCELADO';
}

export const fetchAgenda = async (token: string): Promise<Agendamento[]> => {
  const response = await fetch('/agenda', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  });

  if (response.status === 401) {
    throw new Error('Acesso negado. Sessão expirada, faça login novamente.');
  }

  if (!response.ok) {
    throw new Error('Falha ao buscar os dados da agenda no servidor.');
  }

  return response.json();
};