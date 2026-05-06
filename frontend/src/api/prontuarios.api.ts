import axiosInstance from './axiosInstance';
import type { CriarProntuarioDTO, EditarProntuarioDTO, Prontuario } from '@/types';

// Funções pequenas para deixar as páginas sem detalhes da API.
export const prontuariosApi = {
  listar: async () => {
    const response = await axiosInstance.get<Prontuario[]>('/prontuarios');
    return response.data;
  },

  buscarPorId: async (id: number) => {
    const response = await axiosInstance.get<Prontuario>(`/prontuarios/${id}`);
    return response.data;
  },

  criar: async (dados: CriarProntuarioDTO) => {
    const response = await axiosInstance.post<Prontuario>('/prontuarios', dados);
    return response.data;
  },

  atualizar: async (id: number, dados: EditarProntuarioDTO) => {
    const response = await axiosInstance.put<Prontuario>(`/prontuarios/${id}`, dados);
    return response.data;
  },

  assinar: async (id: number) => {
    const response = await axiosInstance.post<Prontuario>(`/prontuarios/${id}/assinar`);
    return response.data;
  },
};
