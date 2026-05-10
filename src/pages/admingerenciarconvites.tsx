import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import BottomNavigation from '../components/bottomNavigation'
import { Mail, CheckCircle, ArrowLeft } from '../components/icons'
import '../styles/adminconvites.scss'

type InviteRole = 'professor' | 'admin'
type InviteStatus = 'aceito' | 'pendente'

interface Invite {
  id: number
  email: string
  role: InviteRole
  created_at: string
  status: InviteStatus
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

function roleLabel(role: InviteRole) {
  return role === 'professor' ? 'Professor(a)' : 'Admin'
}

export const AdminGerenciarConvites = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<InviteRole>('professor')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const [invites, setInvites] = useState<Invite[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const fetchRef = useRef(false)

  async function fetchInvites() {
    setLoadingList(true)
    try {
      const res = await api.get<Invite[]>('/admin/invites')
      setInvites((res as { invites?: Invite[] }).invites ?? [])
    } catch {
      // lista vazia se falhar
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    if (fetchRef.current) return
    fetchRef.current = true
    void fetchInvites()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)
    setLoading(true)
    try {
      await api.post('/admin/send-invite', { email: email.trim(), role })
      setFeedback({ type: 'success', msg: 'Convite enviado com sucesso!' })
      setEmail('')
      await fetchInvites()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao enviar convite'
      setFeedback({ type: 'error', msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="convites-page">

      {/* Header */}
      <div className="convites-page-header">
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#888', fontSize: '0.82rem' }}
          onClick={() => navigate('/admin/painel')}
        >
          <ArrowLeft width="16" height="16" />
          Voltar
        </button>
        <h1>Gerenciar Convites</h1>
        <p>Envie convites para professores e administradores</p>
      </div>

      {/* Form card */}
      <form className="convites-form-card" onSubmit={handleSubmit} noValidate>
        <div className="convites-form-card-header">
          <div className="convites-form-icon">
            <Mail width="22" height="22" />
          </div>
          <div className="convites-form-title">
            <strong>Novo Convite</strong>
            <span>Envie um link de cadastro</span>
          </div>
        </div>

        <div className="convites-field">
          <label htmlFor="invite-email">E-mail do convidado</label>
          <input
            id="invite-email"
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <div className="convites-field">
          <label htmlFor="invite-role">Tipo de acesso</label>
          <div className="select-wrap">
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as InviteRole)}
            >
              <option value="professor">Professor(a)</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {feedback && (
          <div className={`convites-feedback ${feedback.type}`}>{feedback.msg}</div>
        )}

        <button className="convites-submit-btn" type="submit" disabled={loading}>
          <Mail width="16" height="16" />
          {loading ? 'Enviando...' : 'Enviar Convite'}
        </button>
      </form>

      {/* Lista de convites */}
      <div className="convites-list-section">
        <span className="convites-list-title">
          Convites Enviados{!loadingList ? ` (${invites.length})` : ''}
        </span>

        {loadingList ? (
          <p className="convites-empty">Carregando...</p>
        ) : invites.length === 0 ? (
          <p className="convites-empty">Nenhum convite enviado ainda.</p>
        ) : (
          invites.map((inv) => (
            <div className="convite-item" key={inv.id}>
              <div className="convite-info">
                <span className="convite-email">{inv.email}</span>
                <span className="convite-meta">
                  {roleLabel(inv.role)} · {formatDate(inv.created_at)}
                </span>
              </div>
              <span className={`convite-badge ${inv.status}`}>
                {inv.status === 'aceito' && <CheckCircle width="12" height="12" />}
                {inv.status === 'aceito' ? 'Aceito' : 'Pendente'}
              </span>
            </div>
          ))
        )}
      </div>

      <BottomNavigation role="admin" />
    </div>
  )
}
