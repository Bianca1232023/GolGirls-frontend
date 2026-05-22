import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BottomNavigation from '../components/bottomNavigation'
import { api } from '../services/api'
import { getSessionLabel, logout } from '../services/auth'
import { GraduationCap, Heart, Trophy, UserCircle } from '../components/icons'
import '../styles/apphub.scss'

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

export const AppAluno = () => {
  const [tab, setTab] = useState<AlunoTab>('home')
  const [perfil, setPerfil] = useState<AlunoProfile | null>(null)
  const [jornada, setJornada] = useState<JornadaData | null>(null)
  const [loading, setLoading] = useState(true)

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
    logout()
    window.location.href = '/login/aluno'
  }

  const matricula = getSessionLabel() ?? perfil?.matricula

  return (
    <div className="app-hub">
      <header className="app-hub__header">
        <h1>Portal da Aluna</h1>
        <p>{perfil?.nome ? `Olá, ${perfil.nome.split(' ')[0]}!` : 'Bem-vinda ao GoLGirls'}</p>
      </header>

      <div className="app-hub__grid" style={{ marginBottom: '1rem' }}>
        {(['home', 'jornada', 'legado', 'perfil'] as AlunoTab[]).map((t) => (
          <button
            key={t}
            type="button"
            className="app-hub__card"
            style={{ borderColor: tab === t ? '#e91e8c' : undefined }}
            onClick={() => setTab(t)}
          >
            <span style={{ textTransform: 'capitalize' }}>{t === 'home' ? 'Início' : t}</span>
          </button>
        ))}
      </div>

      {loading && <p className="app-hub__session">Carregando...</p>}

      {tab === 'home' && !loading && (
        <div className="app-hub__card" style={{ cursor: 'default' }}>
          <div className="app-hub__icon app-hub__icon--aluno">
            <GraduationCap width="22" height="22" />
          </div>
          <div>
            <h2>Matrícula {matricula}</h2>
            <span>{perfil?.turma_nome ? `Turma: ${perfil.turma_nome}` : 'Turma não atribuída'}</span>
          </div>
        </div>
      )}

      {tab === 'jornada' && !loading && jornada && (
        <div>
          <p className="app-hub__session">
            <Heart width="14" height="14" style={{ verticalAlign: 'middle' }} />{' '}
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

      {tab === 'legado' && !loading && jornada && (
        <div className="app-hub__grid">
          {jornada.conquistas.length === 0 ? (
            <p className="app-hub__session">Participe das aulas para desbloquear conquistas!</p>
          ) : (
            jornada.conquistas.map((c) => (
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
        <div className="app-hub__session">
          <p><strong>Nome:</strong> {perfil.nome}</p>
          <p><strong>Matrícula:</strong> {perfil.matricula}</p>
          <p><strong>Bairro:</strong> {perfil.bairro}</p>
          {perfil.nucleo && <p><strong>Núcleo:</strong> {perfil.nucleo}</p>}
          {perfil.telefone_aluna && <p><strong>Telefone:</strong> {perfil.telefone_aluna}</p>}
          {perfil.nome_responsavel && <p><strong>Responsável:</strong> {perfil.nome_responsavel}</p>}
          <p style={{ marginTop: '1rem' }}>
            <UserCircle width="14" height="14" /> Dados tratados conforme{' '}
            <Link to="/privacidade">LGPD</Link>.
          </p>
        </div>
      )}

      <button type="button" className="app-hub__logout" onClick={handleLogout}>
        Sair da conta
      </button>

      <BottomNavigation role="aluno" />
    </div>
  )
}
