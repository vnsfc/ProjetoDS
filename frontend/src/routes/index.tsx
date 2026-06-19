import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './privateRoute'
// ── Pessoa 4 ──────────────────────────────────────────────────────────
import { TriagemPage } from '@/pages/TriagemPage';
import { AgendaPage } from '@/pages/AgendaPage';
import { UsuariosPage }    from '@/pages/UsuariosPage'       

// ── Pessoa 2 ──────────────────────────────────────────────────────────
import { AppLayout } from '@/components/layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { NovoProntuarioPage } from '@/pages/NovoProntuarioPage'
import { ProntuarioDetailPage } from '@/pages/ProntuarioDetailPage'
import { ProntuariosPage } from '@/pages/ProntuariosPage'

// ── Pessoa 1 ──────────────────────────────────────────────────────────

import { RegisterPage } from '@/pages/RegisterPage'
import { PerfilPage } from '@/pages/PerfilPage'
import { LoginPage } from '@/pages/Loginpage'


// ── Outras pessoas (descomentar quando prontos) ────────────────────────
// import { TriagemPage }     from '@/pages/TriagemPage'        // Pessoa 4
// import { AgendaPage }      from '@/pages/AgendaPage'         // Pessoa 5

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/"         element={<Navigate to="/dashboard" replace />} />


        {/* Rotas privadas — todas dentro do AppLayout (Sidebar + Navbar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/perfil"    element={<PerfilPage />} />

            <Route path="/prontuarios" element={<ProntuariosPage />} />
            <Route path="/prontuarios/:id" element={<ProntuarioDetailPage />} />
            <Route element={<PrivateRoute allowedProfiles={['ESTUDANTE']} />}>
              <Route path="/prontuarios/novo" element={<NovoProntuarioPage />} />
            </Route>

            <Route path="/triagem"   element={<TriagemPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />

          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
