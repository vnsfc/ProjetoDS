import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuthStore } from '../stores/AuthStores';
import { server } from '../mocks/server';
import { beforeAll, afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogin = vi.fn();
vi.mock('../stores/AuthStores', () => ({
  useAuthStore: vi.fn(),
}));

const mockUseAuthStore = useAuthStore as unknown as ReturnType<typeof vi.fn>;

const renderLoginForm = () => {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({ login: mockLogin });
  });

  it('renderiza os campos de email e senha', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('atualiza os campos ao digitar', () => {
    renderLoginForm();
    const emailInput = screen.getByLabelText(/e-mail/i);
    const senhaInput = screen.getByLabelText(/senha/i);

    fireEvent.change(emailInput, { target: { value: 'estudante@teste.com' } });
    fireEvent.change(senhaInput, { target: { value: '123456' } });

    expect(emailInput).toHaveValue('estudante@teste.com');
    expect(senhaInput).toHaveValue('123456');
  });

  it('faz login com sucesso e navega para /dashboard', async () => {
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'estudante@teste.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'estudante@teste.com' }),
        'fake-jwt-token'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('exibe mensagem de erro com credenciais inválidas', async () => {
    server.use(
      http.post('http://localhost:8080/api/auth/login', () => {
        return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
      })
    );

    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'errado@teste.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senhaerrada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/erro ao fazer login/i)).toBeInTheDocument();
    });
  });
});