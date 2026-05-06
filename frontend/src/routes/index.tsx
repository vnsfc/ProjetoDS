import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './privateRoute'
// ── Pessoa 4 ──────────────────────────────────────────────────────────
import { TriagemPage } from '@/pages/TriagemPage';
import { AgendaPage } from '@/pages/AgendaPage';
// ── Pessoa 2 ──────────────────────────────────────────────────────────
import { AppLayout } from '@/components/layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// ── Pessoa 1 ──────────────────────────────────────────────────────────
import { LoginForm } from '@/components/LoginForm'
import { RegisterForm } from '@/components/RegisterForm'

// ── Outras pessoas (descomentar quando prontos) ────────────────────────
// import { ProntuariosPage } from '@/pages/ProntuariosPage'   // Pessoa 3
// import { TriagemPage }     from '@/pages/TriagemPage'        // Pessoa 4
// import { AgendaPage }      from '@/pages/AgendaPage'         // Pessoa 5
// import { UsuariosPage }    from '@/pages/UsuariosPage'       // Pessoa 5

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login"    element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/"         element={<Navigate to="/dashboard" replace />} />


        {/* Rotas privadas — todas dentro do AppLayout (Sidebar + Navbar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/perfil"    element={<div className="p-8">Perfil</div>} />
            <Route path="/triagem"   element={<TriagemPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            {/* Descomentar à medida que as outras pessoas entregam */}
            {/* <Route path="/prontuarios" element={<ProntuariosPage />} /> */}
            {/* <Route path="/usuarios"    element={<UsuariosPage />} /> */}
          </Route>
        </Route>
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

