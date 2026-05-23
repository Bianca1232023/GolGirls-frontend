import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Home, UserCircle } from 'lucide-react'
import './styless.scss'

type Role = 'aluno' | 'professor' | 'admin'
type AlunoTab = 'home' | 'jornada' | 'legado' | 'perfil'
type AdminTab = 'home' | 'perfil'
type ProfTab = 'home' | 'chamada' | 'perfil'

interface BottomNavigationProps {
  role: Role
  activeTab?: AlunoTab | AdminTab | ProfTab
  onTabChange?: (tab: string) => void
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ role, activeTab, onTabChange }) => {
  const navigate = useNavigate()

  const itemClass = (active: boolean) =>
    `bottom-nav__item${active ? ' bottom-nav__item--active' : ''}`

  const muralLabel = (
    <span className="bottom-nav__label bottom-nav__label--mural">
      <span>Início</span>
      <span className="bottom-nav__label-sub">/ Mural</span>
    </span>
  )

  if (role === 'aluno') {
    const tab = (activeTab as AlunoTab) ?? 'home'
    return (
      <nav className="bottom-nav">
        <button type="button" className={itemClass(tab === 'home')} onClick={() => onTabChange?.('home')}>
          <Home size={22} />
          {muralLabel}
        </button>
        <button type="button" className={itemClass(tab === 'jornada')} onClick={() => onTabChange?.('jornada')}>
          <Briefcase size={22} /><span>Jornada</span>
        </button>
        <button type="button" className={itemClass(tab === 'legado')} onClick={() => navigate('/legado/aluno')}>
          <UserCircle size={22} /><span>Legado</span>
        </button>
        <button type="button" className={itemClass(tab === 'perfil')} onClick={() => onTabChange?.('perfil')}>
          <UserCircle size={22} /><span>Perfil</span>
        </button>
      </nav>
    )
  }

  if (role === 'professor') {
    const tab = (activeTab as ProfTab) ?? 'home'
    return (
      <nav className="bottom-nav">
        <button type="button" className={itemClass(tab === 'home')} onClick={() => navigate('/professor/mural')}>
          <Home size={22} />
          {muralLabel}
        </button>
        <button type="button" className={itemClass(tab === 'chamada')} onClick={() => navigate('/professor/painel')}>
          <Briefcase size={22} /><span>Chamada</span>
        </button>
        <button type="button" className={itemClass(tab === 'perfil')} onClick={() => navigate('/professor/perfil')}>
          <UserCircle size={22} /><span>Perfil</span>
        </button>
      </nav>
    )
  }

  const tab = (activeTab as AdminTab) ?? 'home'
  return (
    <nav className="bottom-nav">
      <button type="button" className={itemClass(tab === 'home')} onClick={() => onTabChange?.('home')}>
        <Home size={22} />
        {muralLabel}
      </button>
      <button type="button" className={itemClass(false)} onClick={() => navigate('/admin/painel')}>
        <Briefcase size={22} /><span>Gestão</span>
      </button>
      <button type="button" className={itemClass(tab === 'perfil')} onClick={() => onTabChange?.('perfil')}>
        <UserCircle size={22} /><span>Perfil</span>
      </button>
    </nav>
  )
}

export default BottomNavigation
