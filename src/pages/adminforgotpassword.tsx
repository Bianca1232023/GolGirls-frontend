import Buttons from '../components/button'
import ForgotPasswordComponent from '../components/forgotPassword'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const AdminForgotPassword = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/login/admin')
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Buttons type="back" label="Voltar" onClick={handleBack} />
      <ForgotPasswordComponent role="admin" />
      <Footer text="Lembrou sua senha? Volte para o login e acesse sua conta" />
    </div>
  )
}
