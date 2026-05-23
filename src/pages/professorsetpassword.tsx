import SetPasswordComponent from '../components/setPassword'
import Buttons from '../components/Button'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import '../styles/golgirls-design.scss'

export const ProfessorSetPassword = () => {
  const navigate = useNavigate()

  return (
    <AppShell publicPage>
      <div className="gg-login-page">
        <Buttons type="back" label="Voltar" onClick={() => navigate('/login/professor')} />
        <SetPasswordComponent role="professor" />
        <Footer text="Link expirado? Entre em contato com o Administrativo para receber um novo" />
      </div>
    </AppShell>
  )
}
