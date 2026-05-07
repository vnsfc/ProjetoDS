import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserPerfil = 'ESTUDANTE' | 'PROFESSOR' | 'NAPA' | 'ADMIN';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: UserPerfil;
}

interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: Usuario, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('clinica-ufpe-auth');
      },
    }),
    {
      name: 'clinica-ufpe-auth',
    }
  )
);