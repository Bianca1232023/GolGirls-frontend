import React, { useState } from 'react'
import './styles.scss'
import GraduationCap from '../icons/graduation-cap'
import UserCog from '../icons/user-cog'
import Shield from '../icons/shield'
import { Logo } from '../icons'
import Buttons from '../button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

type InputType = 'text' | 'password' | 'email';
type Role = 'aluno' | 'professor' | 'admin';

interface InputProps {
    type: InputType;
    role: Role;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const Inputs: React.FC<InputProps> = ( props: InputProps ) => {

    const navigate = useNavigate();
    const { login, loading, serverError } = useAuth();

    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ main: false, password: false });

    const roleConfig = {
        aluno: { label: 'Portal da Aluna', description: 'Faça login para acessar seu portal do aluna', placeholder: 'Digite sua matrícula' },
        professor: { label: 'Portal do Professor', description: 'Acesse a sua area de Gestão', placeholder: 'Digite seu email' },
        admin: { label: 'Painel do Administrativo', description: 'Acesso restrito ao sistema', placeholder: 'Digite seu email' }
    }

    const renderIcon = () => {
        switch(props.role) {
            case 'aluno':
                return <GraduationCap width="28" height="28" />;
            case 'professor':
                return <UserCog width="28" height="28" />;
            case 'admin':
                return <Shield width="28" height="28" />;
        }
    }

    const renderTitle = () => {
        switch(props.role) {
            case 'aluno':
                return roleConfig.aluno.label;
            case 'professor':
                return roleConfig.professor.label;
            case 'admin':
                return roleConfig.admin.label;
        }
    }

    const handleClickEnter = async () => {
        const mainEmpty = !props.value.trim();
        const passwordEmpty = (props.role === 'professor' || props.role === 'admin') && !password.trim();
        const invalidEmail = (props.role === 'professor' || props.role === 'admin') && props.value.trim() && !props.value.includes('@gmail.com');

        if (mainEmpty || passwordEmpty || invalidEmail) {
            setErrors({ main: !!(mainEmpty || invalidEmail), password: passwordEmpty });
            return;
        }

        setErrors({ main: false, password: false });

        const token = await login({ role: props.role, value: props.value, password });
        if (!token) return;

        switch(props.role){
            case 'aluno':
                navigate('/app/aluno');
                break;
            case 'professor':
                navigate('/app/professor');
                break;
            case 'admin':
                navigate('/app/admin');
                break;
        }
    }

    const getMainErrorMsg = () => {
        if (props.role === 'aluno') return 'Digite sua matrícula';
        if (!props.value.trim()) return 'Digite seu email';
        if (!props.value.includes('@gmail.com')) return 'O email deve conter @gmail.com';
        return 'Digite seu email';
    }

    const mainErrorMsg = getMainErrorMsg();

    return (
        <div className='all-login-content'>
            <div className='login-content'>
                <Logo width="190" height="147" />
                <div className={`cap-icon-${props.role}`}>
                    {renderIcon()}
                </div>
                <div className="renderTitle">
                    <h1>{renderTitle()}</h1>
                </div>

                <span className='description'>{roleConfig[props.role].description}</span>
            </div>
            <br />
            <div className='input-content'>
                <div className='input-container'>
                {props.role === 'aluno' && (
                        <span className='matricula'>MATRÍCULA</span>
                    )}

                    {(props.role === 'professor' || props.role === 'admin') && (
                        <span className='email'>E-MAIL</span>
                    )}

                    <input
                        className={`input-box${errors.main ? ' input-box--error' : ''}`}
                        type={props.type}
                        placeholder={roleConfig[props.role].placeholder}
                        value={props.value}
                        onChange={props.onChange}
                        />
                    {errors.main && <span className='input-error-msg'>{mainErrorMsg}</span>}

                    {(props.role === 'professor' || props.role === 'admin') && (
                        <>
                            <span className='senha'>SENHA</span>
                            <input
                                className={`input-box${errors.password ? ' input-box--error' : ''}`}
                                type="password"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            {errors.password && <span className='input-error-msg'>Digite sua senha</span>}
                            {(props.role === 'professor' || props.role === 'admin') && (
                                <button
                                    className='forgot-password-link'
                                    onClick={() => navigate(`/${props.role}/esqueci-senha`)}
                                >
                                    Esqueci minha senha
                                </button>
                            )}
                        </>
                    )}

                    <Buttons type="login" label={loading ? 'Entrando...' : 'Entrar'} onClick={handleClickEnter} className={`btn-login--${props.role}`} />
                    {serverError && <span className='input-error-msg'>{serverError}</span>}

                </div>
            </div>
        </div>
    )
}

export default Inputs