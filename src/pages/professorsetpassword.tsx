import SetPasswordComponent from '../components/setPassword'
import Buttons from '../components/Button'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const ProfessorSetPassword = () => {
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
      <SetPasswordComponent role="professor" />
      <Footer text="Link expirado? Entre em contato com o Administrativo para receber um novo" />
    </div>
  )
}
