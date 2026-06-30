import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain } from 'lucide-react'
import BottomNavigation from '../components/bottomNavigation'
import { EngagementLineChart } from '../components/charts/EngagementLineChart'
import { Users, TrendingUp, AlertTriangle, MoreVertical, Filter, Mail, Plus, ShieldAlert } from '../components/icons'
import { api } from '../services/api'
import { mediaAutoestimaPorNucleo } from '../services/jornadaStorage'
import { CHART_MENSAL } from '../data/mockData'
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
  const [nucleos, setNucleos] = useState<Array<{ id: number; nome: string }>>([]
  )
  const [nucleoFilter, setNucleoFilter] = useState<number | 'todos'>('todos')
  const [kpi, setKpi] = useState({ totalAlunas: 0, taxaFrequencia: 0, alertasEvasao: 0, chartMensal: CHART_MENSAL })
  const fetchedRef = useRef(false)

  async function fetchTeam() {
    try {
      const res = await api.get<Member[]>('/admin/team') as { members?: Member[] }
      setMembers(res.members ?? [])
    } catch {
      /* ignore */
    }
  }

  async function fetchNucleos() {
    try {
      const res = await api.get('/nucleos') as { nucleos?: Array<{ id: number; nome: string }> }
      setNucleos(res.nucleos ?? [])
    } catch { /* ignore */ }
  }

  async function fetchStats(nucleoId?: number) {
    try {
      const query = nucleoId ? `?nucleo_id=${nucleoId}` : ''
      const res = await api.get(`/admin/relatorios${query}`) as {
        relatorio?: { totalAlunas: number; taxaFrequencia: number; alertasEvasao: number; chartMensal: Array<{ mes: string; pct: number }> }
      }
      if (res.relatorio) {
        setKpi({
          totalAlunas: res.relatorio.totalAlunas,
          taxaFrequencia: res.relatorio.taxaFrequencia,
          alertasEvasao: res.relatorio.alertasEvasao,
          chartMensal: res.relatorio.chartMensal.length ? res.relatorio.chartMensal : CHART_MENSAL,
        })
      }
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    void fetchTeam()
    void fetchNucleos()
    void fetchStats()
  }, [])

  useEffect(() => {
    void fetchStats(nucleoFilter === 'todos' ? undefined : nucleoFilter)
  }, [nucleoFilter]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const indiceAutoestima = mediaAutoestimaPorNucleo('todos')
  const valorEar = Math.round(indiceAutoestima * 10)
  const classificacaoEar = valorEar < 25 ? 'Baixa' : valorEar <= 32 ? 'Média' : 'Alta'

  return (
    <AppShell role="admin">
      <div className="admin-panel">
        {/* Header */}
        <header className="admin-panel__header">
          <div className="admin-panel__title">
            <h1>Gestão</h1>
            <p>Visão Geral de Impacto</p>
          </div>
          <div className="admin-panel__filter-wrap">
            <Filter width="15" height="15" />
            <select
              className="admin-panel__filter"
              value={nucleoFilter}
              onChange={(e) => setNucleoFilter(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
              aria-label="Filtrar por núcleo"
            >
              <option value="todos">Todos os Núcleos</option>
              {nucleos.map((n) => (
                <option key={n.id} value={n.id}>{n.nome}</option>
              ))}
            </select>
          </div>
        </header>

        {/* KPIs principais */}
        <section className="admin-panel__stats" aria-label="Indicadores">
          <article className="stat-card">
            <div className="stat-icon-wrap pink">
              <Users width="20" height="20" />
            </div>
            <span className="stat-label">Total Alunas</span>
            <span className="stat-value">{kpi.totalAlunas}</span>
          </article>
          <article className="stat-card">
            <div className="stat-icon-wrap green">
              <TrendingUp width="20" height="20" />
            </div>
            <span className="stat-label">Frequência</span>
            <span className="stat-value">{kpi.taxaFrequencia}%</span>
          </article>
        </section>

        {/* Risco de Evasão */}
        <section className="admin-evasao-card">
          <div className="admin-evasao-card__icon">
            <AlertTriangle width="22" height="22" />
          </div>
          <div className="admin-evasao-card__info">
            <span className="admin-evasao-card__label">Risco de Evasão</span>
            <span className="admin-evasao-card__value">{kpi.alertasEvasao}</span>
          </div>
          <button type="button" className="evasao-btn">Ver Meninas</button>
        </section>

        {/* Frequência Mensal */}
        <section className="admin-panel__card admin-chart-card">
          <h2 className="admin-panel__card-title">Frequência Mensal (%)</h2>
          <div className="admin-chart-card__inner">
            <EngagementLineChart data={kpi.chartMensal} filterKey="todos" />
          </div>
        </section>

        {/* Convites */}
        <section className="admin-action-card admin-action-card--convites">
          <div className="admin-action-card__icon convites">
            <Mail width="22" height="22" />
          </div>
          <div className="admin-action-card__info">
            <span className="admin-action-card__title">Convites</span>
            <span className="admin-action-card__desc">Gerencie convites de acesso</span>
          </div>
          <button type="button" className="admin-action-card__btn convites" onClick={() => navigate('/admin/convites')}>
            <Plus width="15" height="15" />
            Gerenciar
          </button>
        </section>

        {/* Sistema */}
        <section className="admin-action-card admin-action-card--sistema">
          <div className="admin-action-card__icon sistema">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div className="admin-action-card__info">
            <span className="admin-action-card__title">Sistema</span>
            <span className="admin-action-card__desc">Escolas, núcleos e turmas</span>
          </div>
          <button type="button" className="admin-action-card__btn sistema" onClick={() => navigate('/admin/sistema')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
            Configurar
          </button>
        </section>

        {/* Bem-estar Psicossocial */}
        <div className="admin-section-head">
          <h2 className="admin-section-head__title">Bem-estar Psicossocial</h2>
          <span className="admin-master-badge">
            <ShieldAlert width="13" height="13" />
            Apenas Master Admin
          </span>
        </div>

        <section className="admin-ear-card">
          <div className="admin-ear-card__icon">
            <Brain size={22} aria-hidden />
          </div>
          <div className="admin-ear-card__info">
            <span className="admin-ear-card__label">Índice de Autoestima (EAR)</span>
            <p className="admin-ear-card__value">
              {valorEar} <span>/40</span> <em>({classificacaoEar})</em>
            </p>
          </div>
          <button type="button" className="admin-ear-card__menu" aria-label="Opções do índice">
            <MoreVertical width="18" height="18" />
          </button>
        </section>

        {/* Corpo Docente */}
        <div className="admin-section-head">
          <h2 className="admin-section-head__title">Corpo Docente</h2>
          <button type="button" className="docente-add-btn" onClick={() => navigate('/admin/convites')}>
            <Plus width="14" height="14" aria-hidden />
            Adicionar
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
                <span className="docente-name">{m.name}</span>
                <span className="docente-nucleo">
                  {m.role === 'professor' ? 'Professor(a)' : 'Admin'} · {m.email}
                </span>
              </div>
              <span className={`badge ${m.ativo ? 'ativa' : 'afastada'}`}>
                {m.ativo ? 'ATIVA' : 'INATIVA'}
              </span>
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
