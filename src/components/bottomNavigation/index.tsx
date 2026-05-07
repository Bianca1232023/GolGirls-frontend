import React from 'react'
import './styless.scss'
import Buttons from '../button'
import { Briefcase, Home, Trophy, UserCircle, TrendingUp, Star } from '../icons';

type Role = 'aluno' | 'professor' | 'admin';

interface BottomNavigationProps {
    role: Role
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ role }) => {

    const renderNavigationItems = () => {
        switch (role) {
            case 'aluno':
                return (
                    <>
                        <Buttons type="default" label="Home" icon={<Home width="24" height="24" />} />
                        <Buttons type="default" label="Jornada" icon={<Star width="24" height="24" />} />
                        <Buttons type="default" label="Legado" icon={<Trophy width="24" height="24" />} />
                        <Buttons type="default" label="Perfil" icon={<UserCircle width="24" height="24" />} />
                    </>
                );
            case 'professor':
                return (
                    <>
                        <Buttons type="default" label="Home" icon={<Home width="24" height="24" />} />
                        <Buttons type="default" label="Turmas" icon={<Briefcase width="24" height="24" />} />
                        <Buttons type="default" label="Legado" icon={<Trophy width="24" height="24" />} />
                        <Buttons type="default" label="Perfil" icon={<UserCircle width="24" height="24" />} />
                    </>
                );
            case 'admin':
                return (
                    <>
                        <Buttons type="default" label="Home" icon={<Home width="24" height="24" />} />
                        <Buttons type="default" label="Painel" icon={<TrendingUp width="24" height="24" />} />
                        <Buttons type="default" label="Legado" icon={<Trophy width="24" height="24" />} />
                        <Buttons type="default" label="Perfil" icon={<UserCircle width="24" height="24" />} />
                    </>
                );
            default:
                return null;
        }
    };

  return (
    <div className='bottom-nav'>
        {renderNavigationItems()}
    </div>
  )
}

export default BottomNavigation