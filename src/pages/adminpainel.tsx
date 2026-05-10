import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../components/bottomNavigation'
import { Users, TrendingUp, AlertTriangle, Mail, Filter, MoreVertical, Plus } from '../components/icons'
import { api } from '../services/api'
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
  const fetchedRef = useRef(false)

  async function fetchTeam() {
    try {
      const res = await api.get<Member[]>('/admin/team') as { members?: Member[] }
      setMembers(res.members ?? [])
    } catch {
      // ignora erro silenciosamente
    }
  }

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    void fetchTeam()
  }, [])

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

  return (
    <div className="painel-page">

      {/* Header */}
      <div className="painel-header">
        <div className="painel-title">
          <h1>Gestão</h1>
          <span>Visão Geral de Impacto</span>
        </div>
        <button className="painel-filter-btn">
          <Filter width="14" height="14" />
          Todos os Núcleos ∨
        </button>
      </div>

      {/* Stats */}
      <div className="painel-stats">
        <div className="stat-card">
          <div className="stat-icon-wrap pink">
            <Users width="20" height="20" />
          </div>
          <span className="stat-label">Total Alunas</span>
          <span className="stat-value">0</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap green">
            <TrendingUp width="20" height="20" />
          </div>
          <span className="stat-label">Frequência</span>
          <span className="stat-value">0%</span>
        </div>
      </div>

      {/* Risco de Evasão */}
      <div className="evasao-card">
        <div className="evasao-icon-wrap">
          <AlertTriangle width="20" height="20" />
        </div>
        <div className="evasao-info">
          <span className="evasao-label">Risco de Evasão</span>
          <span className="evasao-value">0</span>
        </div>
        <button className="evasao-btn">Ver Meninas</button>
      </div>

      {/* Convites */}
      <div className="convites-card">
        <div className="convites-icon-wrap">
          <Mail width="22" height="22" />
        </div>
        <div className="convites-info">
          <span className="convites-title">Convites</span>
          <span className="convites-desc">Gerencie convites de acesso</span>
        </div>
        <button className="convites-btn" onClick={() => navigate('/admin/convites')}>
          <Plus width="14" height="14" />
          Gerenciar
        </button>
      </div>

      {/* Corpo Docente */}
      <div className="docente-section">
        <div className="docente-header">
          <span className="docente-title">Corpo Docente</span>
        </div>

        {members.length === 0 && (
          <p style={{ fontSize: '0.82rem', color: '#aaa', textAlign: 'center', padding: '0.75rem 0' }}>
            Nenhum membro cadastrado.
          </p>
        )}

        {members.map((m) => (
          <div className="docente-item" key={menuKey(m)}>
            <div className="docente-avatar">{m.name.charAt(0).toUpperCase()}</div>
            <div className="docente-info">
              <div className="docente-name-row">
                <span className="docente-name">{m.name}</span>
                <span className={`badge ${m.ativo ? 'ativa' : 'afastada'}`}>
                  {m.ativo ? 'ATIVO' : 'INATIVO'}
                </span>
              </div>
              <span className="docente-nucleo">{m.role === 'professor' ? 'Professor(a)' : 'Admin'} · {m.email}</span>
            </div>
            <div className="docente-menu-wrap">
              <button
                className="docente-menu-btn"
                onClick={() => setOpenMenuId(openMenuId === menuKey(m) ? null : menuKey(m))}
              >
                <MoreVertical width="18" height="18" />
              </button>
              {openMenuId === menuKey(m) && (
                <div className="docente-dropdown">
                  <button
                    className="docente-dropdown-item danger"
                    onClick={() => handleDelete(m)}
                  >
                    Deletar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation role="admin" />
    </div>
  )
}

