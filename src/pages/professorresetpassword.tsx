import Buttons from '../components/Button'
import ResetPasswordFormComponent from '../components/resetPasswordForm'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const ProfessorResetPassword = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/login/professor')
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Buttons type="back" label="Voltar" onClick={handleBack} />
      <ResetPasswordFormComponent role="professor" />
      <Footer text="Link expirado? Solicite um novo na página de recuperação de senha" />
    </div>
  )
}
