import { AppShell } from '../components/layout/AppShell'
import { ProfileMenu } from '../components/profile/ProfileMenu'
import BottomNavigation from '../components/bottomNavigation'
import { MuralFeed } from '../components/mural/MuralFeed'
import { MuralPageHeader } from '../components/mural/MuralPageHeader'
import { MURAL_POSTS } from '../data/mockData'
import { logoutToLogin, getSessionLabel } from '../services/auth'
import '../styles/apphub.scss'
import '../styles/golgirls-design.scss'

export const ProfessorMural = () => (
  <AppShell role="professor">
    <div className="app-hub app-hub--mural">
      <MuralPageHeader subtitle="Avisos e novidades do programa GoLGirls." />
      <MuralFeed initialPosts={MURAL_POSTS.map((p) => ({ ...p }))} />
      <BottomNavigation role="professor" activeTab="home" />
    </div>
  </AppShell>
)

export const ProfessorPerfil = () => {
  const sessionLabel = getSessionLabel()

  function handleLogout() {
    logoutToLogin('/login/professor')
  }

  return (
    <AppShell role="professor">
      <div className="app-hub" style={{ position: 'relative' }}>
        <ProfileMenu onLogout={handleLogout} />
        <header className="app-hub__header">
          <h1>Meu Perfil</h1>
          <p>Professor(a)</p>
        </header>
        <div className="app-hub__session" style={{ marginTop: '2.5rem' }}>
          {sessionLabel && <p><strong>E-mail:</strong> {sessionLabel}</p>}
          <p><strong>Perfil:</strong> Professor(a)</p>
        </div>
        <BottomNavigation role="professor" activeTab="perfil" />
      </div>
    </AppShell>
  )
}
