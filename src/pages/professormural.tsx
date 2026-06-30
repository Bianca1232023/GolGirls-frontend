import { useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import BottomNavigation from '../components/bottomNavigation'
import { MuralFeed } from '../components/mural/MuralFeed'
import { MuralPageHeader } from '../components/mural/MuralPageHeader'
import { logoutToLogin, getSessionLabel } from '../services/auth'
import { getDisplayName } from '../contexts/MuralContext'
import { ProfilePublicationsSection } from '../components/profile/ProfilePublicationsSection'
import { EditProfileModal } from '../components/profile/EditProfileModal'
import '../styles/apphub.scss'
import '../styles/golgirls-design.scss'

export const ProfessorMural = () => (
  <AppShell role="professor">
    <div className="app-hub app-hub--mural">
      <MuralPageHeader subtitle="Avisos e novidades do programa GoLGirls." />
      <MuralFeed role="professor" />
      <BottomNavigation role="professor" activeTab="home" />
    </div>
  </AppShell>
)

export const ProfessorPerfil = () => {
  const email = getSessionLabel()
  const [displayName, setDisplayName] = useState(() => getDisplayName(email))
  const [currentEmail, setCurrentEmail] = useState(email ?? '')
  const [editOpen, setEditOpen] = useState(false)
  const initial = displayName.charAt(0).toUpperCase()

  function handleLogout() {
    logoutToLogin('/login/professor')
  }

  return (
    <AppShell role="professor">
      <div style={{ paddingBottom: '5.5rem' }}>
        {/* Hero rosa */}
        <div style={{
          background: 'linear-gradient(135deg, #ff1493 0%, #a020f0 100%)',
          height: 120,
          position: 'relative',
          borderRadius: '0 0 1.5rem 1.5rem',
        }}>
          <div style={{
            position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff1493, #a020f0)',
            border: '4px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '2rem',
            boxShadow: '0 4px 16px rgba(255,20,147,0.3)',
          }}>
            {initial}
          </div>
          {/* Editar */}
          <button type="button" onClick={() => setEditOpen(true)} style={{
            position: 'absolute', top: 12, right: 16,
            background: '#fff', border: 'none', borderRadius: 20,
            padding: '0.35rem 0.85rem', color: '#ff1493',
            fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>✏️ Editar</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 52, padding: '0 1rem' }}>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', color: '#111' }}>
            {displayName}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#888', margin: '0 0 0.75rem' }}>Professor(a)</p>
          <span style={{
            background: 'linear-gradient(135deg, rgba(255,20,147,0.12), rgba(160,32,240,0.12))',
            color: '#a020f0', borderRadius: 20, padding: '0.2rem 0.75rem',
            fontSize: '0.75rem', fontWeight: 600,
          }}>
            🏆 Corpo Docente
          </span>
        </div>

        <div style={{ padding: '1.25rem 1rem 0' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.65rem' }}>
            Informações
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[
              ['✉️', 'E-mail', currentEmail ?? '-'],
              ['👤', 'Perfil', 'Professor(a)'],
            ].map(([icon, label, value]) => (
              <div key={label as string} style={{
                background: '#f9fafb', border: '1px solid #f0f0f0',
                borderRadius: '0.75rem', padding: '0.7rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 0.1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                  <p style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
          <ProfilePublicationsSection
            displayName={displayName}
            initial={initial}
            accentColor="#ff1493"
            accentColorEnd="#a020f0"
            onLogout={handleLogout}
          />
          {editOpen && (
            <EditProfileModal
              role="professor"
              currentName={displayName}
              currentEmail={currentEmail}
              accentColor="#ff1493"
              onClose={() => setEditOpen(false)}
              onSaved={(updates) => {
                if (updates.name) setDisplayName(updates.name)
                if (updates.email) setCurrentEmail(updates.email)
              }}
            />
          )}
        </div>
        <BottomNavigation role="professor" activeTab="perfil" />
      </div>
    </AppShell>
  )
}
