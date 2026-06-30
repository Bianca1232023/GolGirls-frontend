import Buttons from '../components/Button'
import Footer from '../components/footer'
import { Logo, UserCog } from '../components/icons'
import { useNavigate } from 'react-router-dom'

export const ProfessorRegister = () => {
  const navigate = useNavigate()

  return (
    <div className="invite-only-page" style={{ padding: '1.5rem', paddingBottom: '5rem' }}>
      <Buttons type="back" label="Voltar" onClick={() => navigate(-1)} />
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Logo width="160" height="120" />
        <div className="cap-icon-professor" style={{ margin: '1rem auto' }}>
          <UserCog width="28" height="28" />
        </div>
        <h1 style={{ fontSize: '1.25rem' }}>Cadastro por convite</h1>
        <p style={{ color: '#555', lineHeight: 1.5, margin: '1rem 0' }}>
          Professoras são cadastradas pela equipe administrativa. Você receberá um e-mail com link
          para definir sua senha em <strong>/professor/definir-senha</strong>.
        </p>
        <Buttons type="login" label="Ir para login" onClick={() => navigate('/login/professor')} className="btn-login--professor" />
      </div>
      <Footer text="Problemas com o acesso? Entre em contato com o Administrativo" />
    </div>
  )
}
