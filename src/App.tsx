import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.scss'
import { CookieConsent } from './components/CookieConsent'
import { useTokenRefresh } from './hooks/useTokenRefresh'
import { ProtectedRoute } from './components/ProtectedRoute'
import { InitialPage } from './pages/InitialPage'
import { StudentLogin } from './pages/studentlogin'
import { ProfessorLogin } from './pages/professorlogin'
import { AdminLogin } from './pages/adminlogin'
import { AdminRegister } from './pages/adminregister'
import { ProfessorRegister } from './pages/professorregister'
import { ProfessorSetPassword } from './pages/professorsetpassword'
import { AdminSetPassword } from './pages/adminsetpassword'
import { AppAdmin } from './pages/appadmin'
import { AppAluno } from './pages/appaluno'
import { AppProfessor } from './pages/appprofessor'
import { ProfessorForgotPassword } from './pages/professorforgotpassword'
import { AdminForgotPassword } from './pages/adminforgotpassword'
import { ProfessorResetPassword } from './pages/professorresetpassword'
import { AdminResetPassword } from './pages/adminresetpassword'
import { AdminPainel } from './pages/adminpainel'
import { AdminGerenciarConvites } from './pages/admingerenciarconvites'
import { AdminGerenciarSistema } from './pages/admingerenciarsistema'
import { ProfessorPainel } from './pages/professorpainel'
import { ProfessorMural } from './pages/professormural'
import { PrivacidadePage } from './pages/privacidade'

function App() {
  useTokenRefresh()
  return (
    <BrowserRouter>
      <CookieConsent />
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/privacidade" element={<PrivacidadePage />} />

        <Route path="/login/aluno" element={<StudentLogin />} />
        <Route path="/login/professor" element={<ProfessorLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />

        <Route path="/professor/definir-senha" element={<ProfessorSetPassword />} />
        <Route path="/admin/definir-senha" element={<AdminSetPassword />} />
        <Route path="/register/professor" element={<ProfessorRegister />} />
        <Route path="/register/admin" element={<AdminRegister />} />

        <Route path="/professor/esqueci-senha" element={<ProfessorForgotPassword />} />
        <Route path="/admin/esqueci-senha" element={<AdminForgotPassword />} />
        <Route path="/professor/redefinir-senha" element={<ProfessorResetPassword />} />
        <Route path="/admin/redefinir-senha" element={<AdminResetPassword />} />

        <Route
          path="/app/aluno"
          element={
            <ProtectedRoute allowedRoles={['aluno']}>
              <AppAluno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/professor"
          element={
            <ProtectedRoute allowedRoles={['professor']}>
              <AppProfessor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/painel"
          element={
            <ProtectedRoute allowedRoles={['professor']}>
              <ProfessorPainel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/mural"
          element={
            <ProtectedRoute allowedRoles={['professor']}>
              <ProfessorMural />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/painel"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPainel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/convites"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminGerenciarConvites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sistema"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminGerenciarSistema />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
