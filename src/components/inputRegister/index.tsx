import React, { useState } from 'react'
import './styles.scss'
import UserCog from '../icons/user-cog'
import Shield from '../icons/shield'
import { Logo } from '../icons'
import Buttons from '../button'
import { useNavigate } from 'react-router-dom'

type Role = 'professor' | 'admin';

interface RegisterProps {
    role: Role;
}

const InputRegister: React.FC<RegisterProps> = ({ role }) => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const roleConfig = {
        professor: {
            label: 'Cadastro do Professor',
            description: 'Preencha os dados para criar sua conta',
        },
        admin: {
            label: 'Cadastro do Administrador',
            description: 'Preencha os dados para criar sua conta',
        },
    };

    const renderIcon = () => {
        switch (role) {
            case 'professor':
                return <UserCog width="28" height="28" />;
            case 'admin':
                return <Shield width="28" height="28" />;
        }
    };

    const getEmailError = () => {
        if (!email.trim()) return 'Digite seu email';
        if (!email.includes('@gmail.com')) return 'O email deve conter @gmail.com';
        return '';
    };

    const getConfirmPasswordError = () => {
        if (!confirmPassword.trim()) return 'Confirme sua senha';
        if (confirmPassword !== password) return 'As senhas não coincidem';
        return '';
    };

    const handleRegister = () => {
        const emailError = getEmailError();
        const confirmPasswordError = getConfirmPasswordError();

        const newErrors = {
            name: !name.trim(),
            email: !!emailError,
            password: !password.trim(),
            confirmPassword: !!confirmPasswordError,
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) return;

        switch (role) {
            case 'professor':
                navigate('/app/professor');
                break;
            case 'admin':
                navigate('/app/admin');
                break;
        }
    };

    return (
        <div className='all-register-content'>
            <div className='register-header'>
                <Logo width="190" height="147" />
                <div className={`cap-icon-${role}`}>
                    {renderIcon()}
                </div>
                <div className='register-title'>
                    <h1>{roleConfig[role].label}</h1>
                </div>
                <span className='register-description'>{roleConfig[role].description}</span>
            </div>

            <div className='register-form'>
                <div className='register-container'>

                    <span className='field-label'>NOME</span>
                    <input
                        className={`register-input${errors.name ? ' register-input--error' : ''}`}
                        type='text'
                        placeholder='Digite seu nome completo'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span className='register-error-msg'>Digite seu nome</span>}

                    <span className='field-label'>E-MAIL</span>
                    <input
                        className={`register-input${errors.email ? ' register-input--error' : ''}`}
                        type='email'
                        placeholder='Digite seu email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <span className='register-error-msg'>{getEmailError()}</span>}

                    <span className='field-label'>SENHA</span>
                    <input
                        className={`register-input${errors.password ? ' register-input--error' : ''}`}
                        type='password'
                        placeholder='Digite sua senha'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <span className='register-error-msg'>Digite sua senha</span>}

                    <span className='field-label'>CONFIRMAR SENHA</span>
                    <input
                        className={`register-input${errors.confirmPassword ? ' register-input--error' : ''}`}
                        type='password'
                        placeholder='Confirme sua senha'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <span className='register-error-msg'>{getConfirmPasswordError()}</span>}

                    <Buttons type="login" label="Cadastrar" onClick={handleRegister} className={`btn-login--${role}`} />
                </div>
            </div>
        </div>
    );
};

export default InputRegister;
