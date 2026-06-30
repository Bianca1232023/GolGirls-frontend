import Buttons from '../components/Button'
import ForgotPasswordComponent from '../components/forgotPassword'
import ResetPasswordFormComponent from '../components/resetPasswordForm'
import AlunoSetPassword from '../components/alunoSetPassword'
import Footer from '../components/footer'
import { AppShell } from '../components/layout/AppShell'
import { Navigate, useNavigate } from 'react-router-dom'
import '../styles/golgirls-design.scss'

export const AlunoSetPasswordPage = () => <AlunoSetPassword />

export const AlunoForgotPassword = () => {
  const navigate = useNavigate()

  return (
    <AppShell publicPage>
      <div className="gg-login-page">
        <Buttons type="back" label="Voltar" onClick={() => navigate('/login/aluno')} />
        <ForgotPasswordComponent role="aluno" />
        <Footer text="Lembrou sua senha? Volte para o login e acesse sua conta" />
      </div>
    </AppShell>
  )
}

export const AlunoResetPassword = () => {
  const navigate = useNavigate()

  return (
    <AppShell publicPage>
      <div className="gg-login-page">
        <Buttons type="back" label="Voltar" onClick={() => navigate('/login/aluno')} />
        <ResetPasswordFormComponent role="aluno" />
        <Footer text="Link expirado? Solicite um novo na página de recuperação de senha" />
      </div>
    </AppShell>
  )
}

export const AdminRegisterRedirect = () => <Navigate to="/login/admin" replace />
