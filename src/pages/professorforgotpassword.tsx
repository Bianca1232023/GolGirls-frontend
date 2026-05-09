import Buttons from '../components/Button'
import ForgotPasswordComponent from '../components/forgotPassword'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

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
    <div style={{ paddingBottom: '5rem' }}>
      <Buttons type="back" label="Voltar" onClick={handleBack} />
      <ForgotPasswordComponent role="professor" />
      <Footer text="Lembrou sua senha? Volte para o login e acesse sua conta" />
    </div>
  )
}
