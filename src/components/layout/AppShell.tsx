import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../../styles/golgirls-design.scss'

type Role = 'aluno' | 'professor' | 'admin'

interface AppShellProps {
  role?: Role
  children: ReactNode
  publicPage?: boolean
}

const ROLE_LABEL: Record<Role, string> = {
  aluno: 'Aluna',
  professor: 'Professor(a)',
  admin: 'Administrador',
}

const SIDEBAR_NAV: Record<Role, { label: string; path: string }[]> = {
  aluno: [
    { label: 'Início / Mural', path: '/app/aluno' },
    { label: 'Jornada', path: '/app/aluno?tab=jornada' },
    { label: 'Legado', path: '/legado/aluno' },
    { label: 'Perfil', path: '/app/aluno?tab=perfil' },
  ],
  professor: [
    { label: 'Início / Mural', path: '/professor/mural' },
    { label: 'Gestão', path: '/professor/painel' },
    { label: 'Perfil', path: '/professor/perfil' },
  ],
  admin: [
    { label: 'Início / Mural', path: '/app/admin' },
    { label: 'Gestão', path: '/admin/painel' },
    { label: 'Perfil', path: '/app/admin?tab=perfil' },
  ],
}

export function AppShell({ role, children, publicPage }: AppShellProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const frame = (
    <div className={`gg-app-shell__frame${publicPage ? ' gg-app-shell__frame--public' : ''}`}>
      {!publicPage && role && (
        <aside className="gg-app-shell__sidebar">
          <img src="/logo-golgirls.svg" alt="Gol Girls" className="gg-logo" style={{ width: 140 }} />
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>{ROLE_LABEL[role]}</p>
          <nav className="gg-sidebar-nav">
            {SIDEBAR_NAV[role].map((item) => {
              const current = location.pathname + location.search
              const active =
                current === item.path ||
                (item.path === '/app/aluno' && location.pathname === '/app/aluno' && !location.search) ||
                (item.path === '/app/admin' && location.pathname === '/app/admin' && !location.search)
              return (
                <button
                  key={item.path}
                  type="button"
                  className={`nav-item${active ? ' active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>
      )}
      <main className="gg-app-shell__main">{children}</main>
    </div>
  )

  return (
    <div className="gg-app-shell">
      {publicPage ? frame : <div className="gg-app-shell__phone-wrap">{frame}</div>}
    </div>
  )
}
