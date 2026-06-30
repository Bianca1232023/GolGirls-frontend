import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BottomNavigation from '../components/bottomNavigation'
import { MuralFeed } from '../components/mural/MuralFeed'
import { MuralPageHeader } from '../components/mural/MuralPageHeader'
import { JornadaQuestionnaire } from '../components/jornada/JornadaQuestionnaire'
import { PageTransition } from '../components/ui/PageTransition'
import { api } from '../services/api'
import { logoutToLogin, getSessionLabel } from '../services/auth'
import { getDisplayName } from '../contexts/MuralContext'
import { ProfilePublicationsSection } from '../components/profile/ProfilePublicationsSection'
import { EditProfileModal } from '../components/profile/EditProfileModal'
import { AppShell } from '../components/layout/AppShell'
import { Heart, Trophy } from '../components/icons'
import '../styles/apphub.scss'
import '../styles/golgirls-design.scss'

type AlunoTab = 'home' | 'jornada' | 'legado' | 'perfil'

interface AlunoProfile {
  id: number
  nome: string
  matricula: string
  turma_nome?: string | null
  nucleo?: string | null
  bairro: string
  telefone_aluna?: string | null
  nome_responsavel?: string | null
}

interface JornadaData {
  stats: { total_presencas: number; turma?: string | null; nucleo?: string | null }
  historico_presenca: Array<{ data: string; presente: boolean }>
  conquistas: Array<{ id: string; titulo: string; descricao: string }>
}

const TAB_MAP: Record<string, AlunoTab> = {
  home: 'home',
  jornada: 'jornada',
  legado: 'legado',
  perfil: 'perfil',
}

export const AppAluno = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab: AlunoTab = (tabParam && TAB_MAP[tabParam]) || 'home'
  const [perfil, setPerfil] = useState<AlunoProfile | null>(null)
  const [jornada, setJornada] = useState<JornadaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [nameOverride, setNameOverride] = useState<string | null>(null)
  const [bairroOverride, setBairroOverride] = useState<string | null>(null)

  function setActiveTab(t: string) {
    const next = (['home', 'jornada', 'legado', 'perfil'].includes(t) ? t : 'home') as AlunoTab
    const params = new URLSearchParams(searchParams)
    if (next === 'home') params.delete('tab')
    else params.set('tab', next)
    setSearchParams(params, { replace: true })
  }

  useEffect(() => {
    void (async () => {
      try {
        const meRes = (await api.get('/aluno/me')) as { aluno?: AlunoProfile }
        const jorRes = (await api.get('/aluno/jornada')) as unknown as JornadaData
        setPerfil(meRes.aluno ?? null)
        setJornada(jorRes)
      } catch {
        setPerfil(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function handleLogout() {
    logoutToLogin('/login/aluno')
  }

  const userId = perfil?.matricula ?? 'anon'

  return (
    <AppShell role="aluno">
      <div className={`app-hub${tab === 'home' ? ' app-hub--mural' : ' gg-aluno-page'}`}>
        {tab === 'home' ? (
          <MuralPageHeader
            title="Mural da Aluna"
            subtitle={
              perfil?.nome
                ? `Olá, ${perfil.nome.split(' ')[0]}! Fique por dentro das novidades.`
                : 'Fique por dentro das novidades.'
            }
          />
        ) : (
          <header className="app-hub__header">
            <h1>
              {tab === 'jornada' && 'Jornada'}
              {tab === 'legado' && 'Legado'}
              {tab === 'perfil' && 'Meu Perfil'}
            </h1>
            <p>
              {tab === 'jornada' && 'Conte-nos sobre você e acompanhe sua presença.'}
              {tab === 'legado' && 'Suas conquistas no programa.'}
              {tab === 'perfil' && 'Seus dados cadastrais.'}
            </p>
          </header>
        )}

        {loading && <p className="app-hub__session">Carregando...</p>}

        <PageTransition>
          {tab === 'home' && !loading && (
            <MuralFeed
              role="aluno"
              onJornadaClick={() => setActiveTab('jornada')}
            />
          )}

          {tab === 'jornada' && !loading && (
            <div>
              <JornadaQuestionnaire
                userId={userId}
                defaultNome={perfil?.nome ?? ''}
                defaultBairro={perfil?.bairro ?? ''}
                nucleo={perfil?.nucleo ?? undefined}
              />
              {jornada && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p className="app-hub__session" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Heart width="14" height="14" aria-hidden />
                    {jornada.stats.total_presencas} presenças registradas
                  </p>
                  <h3 style={{ fontSize: '0.95rem', margin: '1rem 0 0.5rem' }}>Histórico recente</h3>
                  {jornada.historico_presenca.length === 0 ? (
                    <p className="app-hub__session">Nenhuma presença registrada ainda.</p>
                  ) : (
                    <ul style={{ padding: 0, listStyle: 'none' }}>
                      {jornada.historico_presenca.map((h, i) => (
                        <li key={i} className="app-hub__session">
                          {new Date(h.data).toLocaleDateString('pt-BR')} — {h.presente ? 'Presente' : 'Falta'}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'legado' && !loading && (
            <div className="app-hub__grid">
              {jornada?.conquistas.length === 0 ? (
                <p className="app-hub__session">
                  Participe das aulas para desbloquear conquistas! Ou acesse a aba{' '}
                  <Link to="/legado/aluno">Legado completo</Link>.
                </p>
              ) : (
                jornada?.conquistas.map((c) => (
                  <div key={c.id} className="app-hub__card" style={{ cursor: 'default' }}>
                    <div className="app-hub__icon app-hub__icon--aluno">
                      <Trophy width="22" height="22" />
                    </div>
                    <div>
                      <h2>{c.titulo}</h2>
                      <span>{c.descricao}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'perfil' && !loading && (
            <div style={{ paddingBottom: '1rem' }}>
              {/* Hero verde */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                height: 120,
                position: 'relative',
                borderRadius: '0 0 1.5rem 1.5rem',
              }}>
                <div style={{
                  position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: '4px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '2rem',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
                }}>
                  {(nameOverride ?? perfil?.nome ?? getDisplayName(getSessionLabel())).charAt(0).toUpperCase()}
                </div>
                {/* Editar */}
                <button type="button" onClick={() => setEditOpen(true)} style={{
                  position: 'absolute', top: 12, right: 16,
                  background: '#fff', border: 'none', borderRadius: 20,
                  padding: '0.35rem 0.85rem', color: '#10b981',
                  fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>✏️ Editar</button>
              </div>

              <div style={{ textAlign: 'center', marginTop: 52, padding: '0 1rem' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', color: '#111' }}>
                  {nameOverride ?? perfil?.nome ?? getDisplayName(getSessionLabel())}
                </h1>
                {perfil?.matricula && (
                  <p style={{ fontSize: '0.78rem', color: '#888', margin: '0 0 0.75rem' }}>
                    Matrícula: {perfil.matricula}
                  </p>
                )}
                <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 20, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
                  Aluna
                </span>
              </div>

              <div style={{ padding: '1.25rem 1rem 0' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.65rem' }}>
                  Informações
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { icon: '📧', label: 'E-mail', value: getSessionLabel() },
                    ...(perfil ? [
                      { icon: '📍', label: 'Bairro', value: perfil.bairro },
                      ...(perfil.nucleo ? [{ icon: '🏡', label: 'Núcleo', value: perfil.nucleo }] : []),
                      ...(perfil.turma_nome ? [{ icon: '👥', label: 'Turma', value: perfil.turma_nome }] : []),
                      ...(perfil.telefone_aluna ? [{ icon: '📱', label: 'Telefone', value: perfil.telefone_aluna }] : []),
                      ...(perfil.nome_responsavel ? [{ icon: '👤', label: 'Responsável', value: perfil.nome_responsavel }] : []),
                    ] : []),
                  ].filter((item) => item.value).map(({ icon, label, value }) => (
                    <div key={label} style={{
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
                  displayName={nameOverride ?? perfil?.nome ?? getDisplayName(getSessionLabel())}
                  initial={(nameOverride ?? perfil?.nome ?? getDisplayName(getSessionLabel())).charAt(0).toUpperCase()}
                  accentColor="#10b981"
                  accentColorEnd="#059669"
                  onLogout={handleLogout}
                />
                {editOpen && (
                  <EditProfileModal
                    role="aluno"
                    currentName={nameOverride ?? perfil?.nome ?? getDisplayName(getSessionLabel())}
                    currentBairro={bairroOverride ?? perfil?.bairro ?? ''}
                    accentColor="#10b981"
                    onClose={() => setEditOpen(false)}
                    onSaved={(updates) => {
                      if (updates.name) setNameOverride(updates.name)
                      if (updates.bairro) setBairroOverride(updates.bairro)
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </PageTransition>

        <BottomNavigation role="aluno" activeTab={tab} onTabChange={setActiveTab} />
      </div>
    </AppShell>
  )
}
