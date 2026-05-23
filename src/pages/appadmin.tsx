import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { MuralFeed } from '../components/mural/MuralFeed'
import { MuralPageHeader } from '../components/mural/MuralPageHeader'
import { ProfileMenu } from '../components/profile/ProfileMenu'
import BottomNavigation from '../components/bottomNavigation'
import { MURAL_POSTS } from '../data/mockData'
import { logoutToLogin, getSessionLabel } from '../services/auth'
import '../styles/apphub.scss'
import '../styles/golgirls-design.scss'

type AdminTab = 'home' | 'perfil'

export const AppAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab: AdminTab = tabParam === 'perfil' ? 'perfil' : 'home'
  const sessionLabel = getSessionLabel()

  function setActiveTab(t: string) {
    const tab = t === 'perfil' ? 'perfil' : 'home'
    if (tab === 'home') searchParams.delete('tab')
    else searchParams.set('tab', tab)
    setSearchParams(searchParams, { replace: true })
  }

  function handleLogout() {
    logoutToLogin('/login/admin')
  }

  return (
    <AppShell role="admin">
      <div className={`app-hub${tab === 'home' ? ' app-hub--mural' : ''}`} style={{ position: 'relative' }}>
        {tab === 'perfil' && <ProfileMenu onLogout={handleLogout} />}
        {tab === 'home' ? (
          <MuralPageHeader subtitle="Novidades e conteúdo do instituto." />
        ) : (
          <header className="app-hub__header">
            <h1>Meu Perfil</h1>
            <p>Administrador(a)</p>
          </header>
        )}

        {tab === 'home' && <MuralFeed initialPosts={MURAL_POSTS.map((p) => ({ ...p }))} />}

        {tab === 'perfil' && (
          <div className="app-hub__session" style={{ marginTop: '2.5rem' }}>
            {sessionLabel && <p><strong>E-mail:</strong> {sessionLabel}</p>}
            <p><strong>Perfil:</strong> Administrador(a)</p>
            <p style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
              Gestão de equipe, convites e sistema em <strong>Painel → Gestão</strong>.
            </p>
          </div>
        )}

        <BottomNavigation role="admin" activeTab={tab} onTabChange={setActiveTab} />
      </div>
    </AppShell>
  )
}
