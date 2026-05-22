import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../components/bottomNavigation'
import { logout, getSessionLabel } from '../services/auth'
import { Mail, School, TrendingUp } from '../components/icons'
import '../styles/apphub.scss'

export const AppAdmin = () => {
  const navigate = useNavigate()
  const sessionLabel = getSessionLabel()

  function handleLogout() {
    logout()
    navigate('/login/admin', { replace: true })
  }

  return (
    <div className="app-hub">
      <header className="app-hub__header">
        <h1>Painel Administrativo</h1>
        <p>Gestão do programa GoLGirls</p>
      </header>

      <div className="app-hub__grid">
        <button type="button" className="app-hub__card" onClick={() => navigate('/admin/painel')}>
          <div className="app-hub__icon app-hub__icon--admin">
            <TrendingUp width="22" height="22" />
          </div>
          <div>
            <h2>Equipe</h2>
            <span>Professores e administradores</span>
          </div>
        </button>

        <button type="button" className="app-hub__card" onClick={() => navigate('/admin/convites')}>
          <div className="app-hub__icon app-hub__icon--admin">
            <Mail width="22" height="22" />
          </div>
          <div>
            <h2>Convites</h2>
            <span>Enviar e acompanhar convites</span>
          </div>
        </button>

        <button type="button" className="app-hub__card" onClick={() => navigate('/admin/sistema')}>
          <div className="app-hub__icon app-hub__icon--admin">
            <School width="22" height="22" />
          </div>
          <div>
            <h2>Sistema</h2>
            <span>Escolas, núcleos e turmas</span>
          </div>
        </button>
      </div>

      {sessionLabel && (
        <p className="app-hub__session">Sessão: {sessionLabel}</p>
      )}

      <button type="button" className="app-hub__logout" onClick={handleLogout}>
        Sair da conta
      </button>

      <BottomNavigation role="admin" />
    </div>
  )
}
