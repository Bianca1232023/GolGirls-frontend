import React, { useState } from 'react'
import './styles.scss'
import UserCog from '../icons/user-cog'
import Shield from '../icons/shield'
import Buttons from '../Button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../services/api'
import { isValidPassword, passwordsMatch } from '../../utils/validation'

type Role = 'professor' | 'admin';

interface SetPasswordProps {
    role: Role;
}

const SetPasswordComponent: React.FC<SetPasswordProps> = ({ role }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ name: false, password: false, confirmPassword: false });
    const [serverError, setServerError] = useState<string | null>(null);

    if (!token) {
        return (
            <div className='set-password-container'>
                <div className='error-box'>
                    <span>Link inválido ou expirado</span>
                </div>
            </div>
        );
    }

    const getConfirmPasswordError = () => {
        if (!confirmPassword.trim()) return 'Confirme sua senha';
        if (confirmPassword !== password) return 'As senhas não coincidem';
        return '';
    };

    const handleSetPassword = async () => {
        const newErrors = {
            name: !name.trim(),
            password: !isValidPassword(password),
            confirmPassword: !!getConfirmPasswordError() || !passwordsMatch(password, confirmPassword),
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) return;

        setLoading(true);
        setServerError(null);

        try {
            const endpoint = role === 'admin' ? '/admin/set-password' : '/professor/set-password';
            await api.post(endpoint, { token, name, password });
            navigate(`/login/${role}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao definir senha';
            setServerError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='all-setpassword-content'>
            <div className='setpassword-header'>
                <img src="/logo-golgirls.svg" alt="Gol Girls" className="gg-logo gg-logo--login" />
                <div className={`cap-icon-${role}`}>
                    {role === 'professor' ? <UserCog width="28" height="28" /> : <Shield width="28" height="28" />}
                </div>
                <div className='setpassword-title'>
                    <h1>Complete seu cadastro</h1>
                </div>
                <span className='setpassword-description'>Defina seu nome e senha para acessar o portal</span>
            </div>

            <div className='setpassword-form'>
                <div className='setpassword-container'>

                    <span className='field-label'>NOME</span>
                    <input
                        className={`setpassword-input${errors.name ? ' setpassword-input--error' : ''}`}
                        type='text'
                        placeholder='Digite seu nome completo'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span className='setpassword-error-msg'>Digite seu nome</span>}

                    <span className='field-label'>SENHA</span>
                    <input
                        className={`setpassword-input${errors.password ? ' setpassword-input--error' : ''}`}
                        type='password'
                        placeholder='Digite sua senha'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                        <span className='setpassword-error-msg'>
                            {!password.trim() ? 'Digite sua senha' : 'Mínimo 8 caracteres'}
                        </span>
                    )}

                    <span className='field-label'>CONFIRMAR SENHA</span>
                    <input
                        className={`setpassword-input${errors.confirmPassword ? ' setpassword-input--error' : ''}`}
                        type='password'
                        placeholder='Confirme sua senha'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <span className='setpassword-error-msg'>{getConfirmPasswordError()}</span>}

                    {serverError && <span className='setpassword-error-msg setpassword-error-server'>{serverError}</span>}

                    <Buttons type="login" label={loading ? 'Definindo...' : 'Confirmar'} onClick={handleSetPassword} className={`btn-login--${role}`} />
                </div>
            </div>
        </div>
    );
};

export default SetPasswordComponent;
