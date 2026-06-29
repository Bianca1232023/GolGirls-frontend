import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './styless.scss'
import Buttons from '../Button'
import { Briefcase, Home, Trophy, UserCircle, TrendingUp, Star } from '../icons';

type Role = 'aluno' | 'professor' | 'admin';

interface BottomNavigationProps {
    role: Role
    activeTab?: string
    onTabChange?: (tab: string) => void
}

const NAV_ITEMS: Record<Role, { label: string; path: string; icon: React.ReactNode }[]> = {
    aluno: [
        { label: 'Home',    path: '/app/aluno',            icon: <Home width="24" height="24" /> },
        { label: 'Jornada', path: '/app/aluno?tab=jornada', icon: <Star width="24" height="24" /> },
        { label: 'Legado',  path: '/legado/aluno',          icon: <Trophy width="24" height="24" /> },
        { label: 'Perfil',  path: '/app/aluno?tab=perfil',  icon: <UserCircle width="24" height="24" /> },
    ],
    professor: [
        { label: 'Mural',  path: '/professor/mural',   icon: <Home width="24" height="24" /> },
        { label: 'Gestão', path: '/professor/painel',  icon: <Briefcase width="24" height="24" /> },
        { label: 'Legado', path: '/legado/professor',  icon: <Trophy width="24" height="24" /> },
        { label: 'Perfil', path: '/professor/perfil',  icon: <UserCircle width="24" height="24" /> },
    ],
    admin: [
        { label: 'Home',   path: '/app/admin',            icon: <Home width="24" height="24" /> },
        { label: 'Painel', path: '/admin/painel',          icon: <TrendingUp width="24" height="24" /> },
        { label: 'Legado', path: '/legado/admin',          icon: <Trophy width="24" height="24" /> },
        { label: 'Perfil', path: '/app/admin?tab=perfil',  icon: <UserCircle width="24" height="24" /> },
    ],
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ role }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const current = location.pathname + location.search
    const items = NAV_ITEMS[role] ?? []

    function isActive(path: string): boolean {
        if (current === path) return true
        // exact match without query for root paths
        if (path === '/app/aluno' && location.pathname === '/app/aluno' && !location.search) return true
        if (path === '/app/admin' && location.pathname === '/app/admin' && !location.search) return true
        if (path === '/professor/mural' && location.pathname === '/professor/mural') return true
        return false
    }

    return (
        <div className='bottom-nav'>
            {items.map((item) => (
                <Buttons
                    key={item.path}
                    type="default"
                    label={item.label}
                    icon={item.icon}
                    className={isActive(item.path) ? 'active' : ''}
                    onClick={() => navigate(item.path)}
                />
            ))}
        </div>
    )
}

export default BottomNavigation