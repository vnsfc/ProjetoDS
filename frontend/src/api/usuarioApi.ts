import axiosInstance from './axiosInstance';
import { Usuario } from '../stores/AuthStores';

export const getMe = async (): Promise<Usuario> => {
  const response = await axiosInstance.get('/usuarios/me');
  return response.data;
};