import React from 'react'
import './styles.scss'
import GraduationCap from '../icons/graduation-cap'
import UserCog from '../icons/user-cog'
import Shield from '../icons/shield'
import { useNavigate } from 'react-router-dom'

type Role = 'aluno' | 'professor' | 'admin';

interface AcessCardProps {
    role: Role;
}

const AcessCard: React.FC<AcessCardProps> = ({ role }) => {

const navigate = useNavigate();

    const roleConfig = {
        aluno: { label: 'Aluna', description: 'Acesse seu portal do aluno' },
        professor: { label: 'Professor', description: 'Gerencie suas turmas' },
        admin: { label: 'Admin', description: 'Dashboard e controle total' }
    }

    const renderIcon = () => {
        switch(role) {
            case 'aluno':
                return <GraduationCap width="28" height="28" />;
            case 'professor':
                return <UserCog width="28" height="28" />;
            case 'admin':
                return <Shield width="28" height="28" />;
        }
    }

    const handleLoginClick = () => {
        switch(role) {
            case 'aluno':
                navigate('/login/aluno');
                break;
            case 'professor':
                navigate('/login/professor');
                break;
            case 'admin':
                navigate('/login/admin');
                break;
        }
    }

    return (
        <div className='acess-card-component'>
            <div className='acess-card-content'>
                <div className='information-card'>
                    <div className={`cap-icon-${role}`}>{renderIcon()}</div>
                    <div className='role-container'>
                        <div className='role-label'>{roleConfig[role].label}</div>
                        <div className='role-description'>{roleConfig[role].description}</div>
                    </div>
                </div>
                <div className={`entry-buttons entry-buttons-${role}`}>
                    <button className='login-button' onClick={handleLoginClick}>
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AcessCard;