import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../components/bottomNavigation'
import Buttons from '../components/Button'
import '../styles/apphub.scss'

export const ProfessorMural = () => {
  const navigate = useNavigate()

  return (
    <div className="app-hub">
      <Buttons type="back" label="Voltar" onClick={() => navigate('/professor/painel')} />
      <header className="app-hub__header">
        <h1>Mural do Professor</h1>
        <p>Avisos e novidades do programa GoLGirls</p>
      </header>
      <div className="app-hub__card" style={{ cursor: 'default' }}>
        <h2>Bem-vinda ao projeto!</h2>
        <span>
          Use a aba Gestão para cadastrar alunas, registrar chamada e consultar relatórios de presença.
        </span>
      </div>
      <BottomNavigation role="professor" />
    </div>
  )
}
