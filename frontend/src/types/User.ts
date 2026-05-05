export type UserPerfil = 'ESTUDANTE' | 'PROFESSOR' | 'NAPA' | 'ADMIN';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: UserPerfil;
}
