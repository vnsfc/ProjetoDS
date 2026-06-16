import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '../routes/privateRoute';
import { useAuthStore } from '../stores/AuthStores';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../stores/AuthStores', () => ({
  useAuthStore: vi.fn(),
}));

const mockUseAuthStore = useAuthStore as unknown as ReturnType<typeof vi.fn>;

const renderWithRouter = (ui: React.ReactNode, initialEntry = '/protegida') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Página de Login</div>} />
        <Route path="/unauthorized" element={<div>Acesso Restrito</div>} />
        <Route element={ui}>
          <Route path="/protegida" element={<div>Conteúdo Protegido</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redireciona para /login quando usuário não está autenticado', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null });
    renderWithRouter(<PrivateRoute />);
    expect(screen.getByText('Página de Login')).toBeInTheDocument();
  });

  it('renderiza o conteúdo quando usuário está autenticado e sem restrição de perfil', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, nome: 'Teste', email: 'teste@teste.com', perfil: 'ESTUDANTE' },
    });
    renderWithRouter(<PrivateRoute />);
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });

  it('redireciona para /unauthorized quando perfil não tem permissão', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, nome: 'Teste', email: 'teste@teste.com', perfil: 'ESTUDANTE' },
    });
    renderWithRouter(<PrivateRoute allowedProfiles={['ADMIN', 'NAPA']} />);
    expect(screen.getByText('Acesso Restrito')).toBeInTheDocument();
  });

  it('renderiza o conteúdo quando perfil tem permissão', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, nome: 'Admin', email: 'admin@teste.com', perfil: 'ADMIN' },
    });
    renderWithRouter(<PrivateRoute allowedProfiles={['ADMIN', 'NAPA']} />);
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });

  it('renderiza o conteúdo para perfil PROFESSOR quando permitido', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 2, nome: 'Prof', email: 'prof@teste.com', perfil: 'PROFESSOR' },
    });
    renderWithRouter(<PrivateRoute allowedProfiles={['PROFESSOR', 'ADMIN']} />);
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });
});