import { type UserPerfil } from '@/types';

const labels: Record<UserPerfil, string> = {
  ESTUDANTE: 'Estudante',
  PROFESSOR: 'Professor',
  NAPA: 'NAPA',
  ADMIN: 'Administrador',
};

export function perfilLabel(perfil: UserPerfil): string {
  return labels[perfil] ?? perfil;
}
