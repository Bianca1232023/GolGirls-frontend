import Buttons from '../components/Button'
import ResetPasswordFormComponent from '../components/resetPasswordForm'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import '../styles/golgirls-design.scss'

export const AdminResetPassword = () => {
  const navigate = useNavigate()

  return (
    <AppShell publicPage>
      <div className="gg-login-page">
        <Buttons type="back" label="Voltar" onClick={() => navigate('/login/admin')} />
        <ResetPasswordFormComponent role="admin" />
        <Footer text="Link expirado? Solicite um novo na página de recuperação de senha" />
      </div>
    </AppShell>
  )
}
