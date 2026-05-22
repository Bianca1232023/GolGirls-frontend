import React from 'react'
import { useNavigate } from 'react-router-dom'
import './styless.scss'
import Buttons from '../Button'
import { Briefcase, Home, Trophy, UserCircle, TrendingUp, Star, Mail, School } from '../icons'
import { logout } from '../../services/auth'

type Role = 'aluno' | 'professor' | 'admin'

interface BottomNavigationProps {
  role: Role
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ role }) => {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(`/login/${role}`, { replace: true })
  }

  const renderNavigationItems = () => {
    switch (role) {
      case 'aluno':
        return (
          <>
            <Buttons type="default" label="Home" icon={<Home width="24" height="24" />} onClick={() => navigate('/app/aluno')} />
            <Buttons type="default" label="Jornada" icon={<Star width="24" height="24" />} />
            <Buttons type="default" label="Legado" icon={<Trophy width="24" height="24" />} />
            <Buttons type="default" label="Sair" icon={<UserCircle width="24" height="24" />} onClick={handleLogout} />
          </>
        )
      case 'professor':
        return (
          <>
            <Buttons type="default" label="Mural" icon={<Home width="24" height="24" />} onClick={() => navigate('/professor/mural')} />
            <Buttons type="default" label="Gestão" icon={<Briefcase width="24" height="24" />} onClick={() => navigate('/professor/painel')} />
            <Buttons type="default" label="Legado" icon={<Trophy width="24" height="24" />} />
            <Buttons type="default" label="Sair" icon={<UserCircle width="24" height="24" />} onClick={handleLogout} />
          </>
        )
      case 'admin':
        return (
          <>
            <Buttons type="default" label="Home" icon={<Home width="24" height="24" />} onClick={() => navigate('/app/admin')} />
            <Buttons type="default" label="Painel" icon={<TrendingUp width="24" height="24" />} onClick={() => navigate('/admin/painel')} />
            <Buttons type="default" label="Convites" icon={<Mail width="24" height="24" />} onClick={() => navigate('/admin/convites')} />
            <Buttons type="default" label="Sistema" icon={<School width="24" height="24" />} onClick={() => navigate('/admin/sistema')} />
            <Buttons type="default" label="Sair" icon={<UserCircle width="24" height="24" />} onClick={handleLogout} />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="bottom-nav">
      {renderNavigationItems()}
    </div>
  )
}

export default BottomNavigation
