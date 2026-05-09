import Buttons from '../components/Button'
import ResetPasswordFormComponent from '../components/resetPasswordForm'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const AdminResetPassword = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/login/admin')
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Buttons type="back" label="Voltar" onClick={handleBack} />
      <ResetPasswordFormComponent role="admin" />
      <Footer text="Link expirado? Solicite um novo na página de recuperação de senha" />
    </div>
  )
}
