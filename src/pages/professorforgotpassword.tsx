import Buttons from '../components/Button'
import ForgotPasswordComponent from '../components/forgotPassword'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import '../styles/golgirls-design.scss'

export const ProfessorForgotPassword = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/login/professor')
  }

  return (
    <AppShell publicPage>
      <div className="gg-login-page">
        <Buttons type="back" label="Voltar" onClick={handleBack} />
        <ForgotPasswordComponent role="professor" />
        <Footer text="Lembrou sua senha? Volte para o login e acesse sua conta" />
      </div>
    </AppShell>
  )
}
