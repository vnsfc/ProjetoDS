import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:8080/api';

const usuariosMock = [
  { id: 1, nome: 'Estudante Teste', email: 'estudante@teste.com', perfil: 'ESTUDANTE' },
  { id: 2, nome: 'Professor Teste', email: 'professor@teste.com', perfil: 'PROFESSOR' },
  { id: 3, nome: 'Admin Teste', email: 'admin@teste.com', perfil: 'ADMIN' },
  { id: 4, nome: 'Napa Teste', email: 'napa@teste.com', perfil: 'NAPA' },
];

const ofertasMock = [
  { id: 1, titulo: 'Atendimento Psicológico', descricao: 'Sessões individuais', vagasDisponiveis: 5, professorId: 2, createdAt: '2026-05-01T10:00:00Z' },
  { id: 2, titulo: 'Apoio Pedagógico', descricao: 'Reforço escolar', vagasDisponiveis: 3, professorId: 2, createdAt: '2026-05-02T10:00:00Z' },
];

let ofertasDb = [...ofertasMock];

export const handlers = [
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; senha: string };
    const usuario = usuariosMock.find((u) => u.email === body.email);
    if (!usuario || body.senha !== '123456') {
      return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }
    return HttpResponse.json({ user: usuario, token: 'fake-jwt-token' });
  }),

  http.post(`${BASE_URL}/usuarios/cadastro`, async ({ request }) => {
    const body = await request.json() as { nome: string; email: string; senha: string; perfil: string };
    const novoUsuario = { id: usuariosMock.length + 1, ...body };
    return HttpResponse.json(novoUsuario, { status: 201 });
  }),

  http.get(`${BASE_URL}/usuarios/me`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json(usuariosMock[0]);
  }),

  http.get(`${BASE_URL}/ofertas`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json(ofertasDb);
  }),

  http.post(`${BASE_URL}/ofertas`, async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    const body = await request.json() as { titulo: string; descricao: string; vagasDisponiveis: number };
    const nova = { id: ofertasDb.length + 1, ...body, professorId: 2, createdAt: new Date().toISOString() };
    ofertasDb = [nova, ...ofertasDb];
    return HttpResponse.json(nova, { status: 201 });
  }),

  http.get(`${BASE_URL}/prontuarios`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json([]);
  }),

  http.get(`${BASE_URL}/fila`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json([]);
  }),

  http.get(`${BASE_URL}/agenda`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json([]);
  }),
];