import axiosInstance from './axiosInstance';

export interface Oferta {
  id: number;
  titulo: string;
  descricao: string;
  vagasDisponiveis: number;
  professorId: number;
  createdAt?: string;
}

export interface CriarOfertaDTO {
  titulo: string;
  descricao: string;
  vagasDisponiveis: number;
}

export const listarOfertas = async (): Promise<Oferta[]> => {
  const response = await axiosInstance.get('/ofertas');
  return response.data;
};

export const criarOferta = async (dados: CriarOfertaDTO): Promise<Oferta> => {
  const response = await axiosInstance.post('/ofertas', dados);
  return response.data;
};