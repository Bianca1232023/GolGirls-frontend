import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProfileMenu } from '../components/profile/ProfileMenu'
import BottomNavigation from '../components/bottomNavigation'
import { MuralFeed } from '../components/mural/MuralFeed'
import { MuralPageHeader } from '../components/mural/MuralPageHeader'
import { JornadaQuestionnaire } from '../components/jornada/JornadaQuestionnaire'
import { PageTransition } from '../components/ui/PageTransition'
import { api } from '../services/api'
import { logoutToLogin } from '../services/auth'
import { MURAL_POSTS } from '../data/mockData'
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
            subtitle={
              perfil?.nome
                ? `Olá, ${perfil.nome.split(' ')[0]}! Avisos e novidades do programa.`
                : 'Bem-vinda ao GoLGirls — avisos e novidades do programa.'
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
          {tab === 'home' && !loading && <MuralFeed initialPosts={MURAL_POSTS.map((p) => ({ ...p }))} />}

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

          {tab === 'perfil' && !loading && perfil && (
            <div className="app-hub__session" style={{ position: 'relative', marginTop: '2rem' }}>
              <ProfileMenu onLogout={handleLogout} />
              <p><strong>Nome:</strong> {perfil.nome}</p>
              <p><strong>Matrícula:</strong> {perfil.matricula}</p>
              <p><strong>Bairro:</strong> {perfil.bairro}</p>
              {perfil.nucleo && <p><strong>Núcleo:</strong> {perfil.nucleo}</p>}
              {perfil.telefone_aluna && <p><strong>Telefone:</strong> {perfil.telefone_aluna}</p>}
              {perfil.nome_responsavel && <p><strong>Responsável:</strong> {perfil.nome_responsavel}</p>}
              <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                Dados tratados conforme <Link to="/privacidade">LGPD</Link>.
              </p>
            </div>
          )}
        </PageTransition>

        <BottomNavigation role="aluno" activeTab={tab} onTabChange={setActiveTab} />
      </div>
    </AppShell>
  )
}
