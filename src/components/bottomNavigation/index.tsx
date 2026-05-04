import React from 'react'
import './styless.scss'
import Buttons from '../button'
import { Briefcase, Home, Trophy, UserCircle, TrendingUp, School } from '../icons';

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
                        <Buttons type="default" label="Cursos" icon={<School width="24" height="24" />} />
                        <Buttons type="default" label="Desempenho" icon={<TrendingUp width="24" height="24" />} />
                        <Buttons type="default" label="Perfil" icon={<UserCircle width="24" height="24" />} />
                    </>
                );
            case 'professor':
                return (
                    <>
                        <Buttons type="default" label="Home" icon={<Home width="24" height="24" />} />
                        <Buttons type="default" label="Turmas" icon={<Briefcase width="24" height="24" />} />
                        <Buttons type="default" label="Desempenho dos Alunos" icon={<Trophy width="24" height="24" />} />
                        <Buttons type="default" label="Perfil" icon={<UserCircle width="24" height="24" />} />
                    </>
                );
            case 'admin':
                return (
                    <>
                        <Buttons type="default" label="Home" icon={<Home width="24" height="24" />} />
                        <Buttons type="default" label="Gerenciar Professores" icon={<Briefcase width="24" height="24" />} />
                        <Buttons type="default" label="Gerenciar Alunos" icon={<Trophy width="24" height="24" />} />
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