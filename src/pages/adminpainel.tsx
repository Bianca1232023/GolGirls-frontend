import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, UserPlus } from 'lucide-react'
import BottomNavigation from '../components/bottomNavigation'
import { EngagementLineChart } from '../components/charts/EngagementLineChart'
import { Users, TrendingUp, AlertTriangle, MoreVertical } from '../components/icons'
import { api } from '../services/api'
import { mediaAutoestimaPorNucleo } from '../services/jornadaStorage'
import { ADMIN_KPI, CHART_MENSAL } from '../data/mockData'
import { AppShell } from '../components/layout/AppShell'
import '../styles/golgirls-design.scss'
import '../styles/adminpainel.scss'

interface Member {
  id: number
  name: string
  email: string
  ativo: boolean
  role: 'professor' | 'admin'
}

export const AdminPainel = () => {
  const navigate = useNavigate()
  const [members, setMembers] = useState<Member[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [editAdmin, setEditAdmin] = useState<Member | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [, setStats] = useState({ alunos_ativos: 0, total_presentes: 0 })
  const [nucleoFilter, setNucleoFilter] = useState<'todos' | 'meier' | 'seropedica'>('todos')
  const fetchedRef = useRef(false)

  async function fetchTeam() {
    try {
      const res = await api.get<Member[]>('/admin/team') as { members?: Member[] }
      setMembers(res.members ?? [])
    } catch {
      /* ignore */
    }
  }

  async function fetchStats() {
    try {
      const res = await api.get('/admin/relatorios') as { relatorio?: { alunos_ativos: number; total_presentes: number } }
      if (res.relatorio) setStats(res.relatorio)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    void fetchTeam()
    void fetchStats()
  }, [])

  async function handleSaveAdmin() {
    if (!editAdmin || editAdmin.role !== 'admin') return
    try {
      const body: Record<string, string> = { name: editName.trim(), email: editEmail.trim() }
      if (editPassword.trim()) body.password = editPassword
      await api.patch(`/admins/${editAdmin.id}`, body)
      setEditAdmin(null)
      setEditPassword('')
      void fetchTeam()
    } catch {
      alert('Erro ao atualizar administrador.')
    }
  }

  async function handleDelete(member: Member) {
    const route = member.role === 'professor'
      ? `/admin/professors/${member.id}`
      : `/admins/${member.id}`
    try {
      await api.delete(route)
      setMembers((prev) => prev.filter((m) => !(m.id === member.id && m.role === member.role)))
    } catch {
      alert('Erro ao remover membro.')
    } finally {
      setOpenMenuId(null)
    }
  }

  function menuKey(m: Member) {
    return `${m.role}-${m.id}`
  }

  const indiceAutoestima = mediaAutoestimaPorNucleo(nucleoFilter)
  const totalAlunas = nucleoFilter === 'todos' ? ADMIN_KPI.totalAlunas : nucleoFilter === 'meier' ? 35 : 25

  return (
    <AppShell role="admin">
      <div className="admin-panel">
        <div className="admin-panel__box">
          <header className="admin-panel__header">
            <div className="admin-panel__title">
              <h1>Gestão</h1>
              <p>Visão geral de impacto</p>
            </div>
            <select
              className="admin-panel__filter"
              value={nucleoFilter}
              onChange={(e) => setNucleoFilter(e.target.value as typeof nucleoFilter)}
              aria-label="Filtrar por núcleo"
            >
              <option value="todos">Todos os Núcleos</option>
              <option value="meier">Méier</option>
              <option value="seropedica">Seropédica</option>
            </select>
          </header>

          <div className="admin-panel__grid">
            <section className="admin-panel__stats" aria-label="Indicadores">
              <article className="stat-card">
                <div className="stat-icon-wrap pink">
                  <Users width="20" height="20" />
                </div>
                <span className="stat-label">Total Alunas</span>
                <span className="stat-value">{totalAlunas}</span>
              </article>
              <article className="stat-card">
                <div className="stat-icon-wrap green">
                  <TrendingUp width="20" height="20" />
                </div>
                <span className="stat-label">Taxa de Frequência</span>
                <span className="stat-value">{ADMIN_KPI.taxaFrequencia}%</span>
              </article>
              <article className="stat-card">
                <div className="stat-icon-wrap orange">
                  <AlertTriangle width="20" height="20" />
                </div>
                <span className="stat-label">Alertas de Evasão</span>
                <span className="stat-value">{ADMIN_KPI.alertasEvasao}</span>
              </article>
            </section>

            <aside className="admin-panel__aside">
              <section className="admin-panel__card admin-panel__ear">
                <div className="admin-panel__ear-head">
                  <Brain size={20} color="#a020f0" aria-hidden />
                  <h2 className="admin-panel__card-title">Índice de Autoestima (EAR)</h2>
                </div>
                <p className="admin-panel__ear-value">
                  {indiceAutoestima} <span>/ 4</span>
                </p>
                <p className="admin-panel__ear-note">
                  Dados sensíveis agregados por núcleo — apenas Master Admin (Renata).
                </p>
              </section>
            </aside>

            <section className="admin-panel__card admin-panel__chart">
              <h2 className="admin-panel__card-title">Engajamento mensal</h2>
              <div className="admin-panel__chart-inner">
                <EngagementLineChart data={CHART_MENSAL} filterKey={nucleoFilter} />
              </div>
            </section>
          </div>

          <hr className="admin-panel__divider" />

          <section className="admin-panel__actions" aria-label="Gestão de equipe e sistema">
            <div className="admin-panel__actions-row">
              <section className="admin-panel__action-box admin-panel__action-box--team">
                <div className="admin-panel__action-box-inner admin-panel__team admin-panel__team--footer">
              <div className="docente-header">
                <h2 className="docente-title">Corpo Docente</h2>
                <button
                  type="button"
                  className="docente-add-btn"
                  onClick={() => navigate('/admin/convites')}
                >
                  <UserPlus size={14} aria-hidden />
                  Adicionar Professor
                </button>
              </div>

              {members.length === 0 && (
                <p className="admin-panel__empty">Nenhum membro cadastrado.</p>
              )}

              <ul className="docente-list">
                {members.map((m) => (
                  <li className="docente-item" key={menuKey(m)}>
                    <div className="docente-avatar">{(m.name || '?').charAt(0).toUpperCase()}</div>
                    <div className="docente-info">
                      <div className="docente-name-row">
                        <span className="docente-name">{m.name}</span>
                        <span className={`badge ${m.ativo ? 'ativa' : 'afastada'}`}>
                          {m.ativo ? 'ATIVO' : 'INATIVO'}
                        </span>
                      </div>
                      <span className="docente-nucleo">
                        {m.role === 'professor' ? 'Professor(a)' : 'Admin'} · {m.email}
                      </span>
                    </div>
                    <div className="docente-menu-wrap">
                      <button
                        type="button"
                        className="docente-menu-btn"
                        aria-label={`Opções de ${m.name}`}
                        onClick={() => setOpenMenuId(openMenuId === menuKey(m) ? null : menuKey(m))}
                      >
                        <MoreVertical width="18" height="18" />
                      </button>
                      {openMenuId === menuKey(m) && (
                        <div className="docente-dropdown">
                          {m.role === 'admin' && (
                            <button
                              type="button"
                              className="docente-dropdown-item"
                              onClick={() => {
                                setEditAdmin(m)
                                setEditName(m.name)
                                setEditEmail(m.email)
                                setEditPassword('')
                                setOpenMenuId(null)
                              }}
                            >
                              Editar
                            </button>
                          )}
                          <button type="button" className="docente-dropdown-item danger" onClick={() => handleDelete(m)}>
                            Deletar
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
                </div>
              </section>

              <div className="admin-panel__actions-vbar" role="separator" aria-orientation="vertical" />

              <article className="admin-panel__action-box admin-panel__action-box--sistema">
                <div className="admin-panel__action-box-inner sistema-card">
              <div className="sistema-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                </svg>
              </div>
              <div className="sistema-info">
                <span className="sistema-title">Sistema</span>
                <span className="sistema-desc">Escolas, núcleos e turmas</span>
              </div>
              <button type="button" className="sistema-btn" onClick={() => navigate('/admin/sistema')}>
                Configurar
              </button>
                </div>
            </article>
            </div>
          </section>
        </div>

        {editAdmin && (
          <div className="painel-modal-overlay" onClick={() => setEditAdmin(null)}>
            <div className="painel-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Editar administrador</h3>
              <label>Nome</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} />
              <label>E-mail</label>
              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
              <label>Nova senha (opcional)</label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Mín. 8 caracteres"
              />
              <div className="painel-modal__actions">
                <button type="button" className="evasao-btn" onClick={handleSaveAdmin}>Salvar</button>
                <button type="button" className="evasao-btn painel-modal__cancel" onClick={() => setEditAdmin(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomNavigation role="admin" />
      </div>
    </AppShell>
  )
}
