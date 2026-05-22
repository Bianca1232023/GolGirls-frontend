import React, { useState } from 'react'
import './styles.scss'
import Shield from '../icons/shield'
import { Logo } from '../icons'
import Buttons from '../Button'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { isValidEmail, isValidPassword, passwordsMatch } from '../../utils/validation'

const InputRegister: React.FC = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const getEmailError = () => {
        if (!email.trim()) return 'Digite seu email';
        if (!isValidEmail(email)) return 'Digite um e-mail válido';
        return '';
    };

    const getPasswordError = () => {
        if (!password.trim()) return 'Digite sua senha';
        if (!isValidPassword(password)) return 'A senha deve ter no mínimo 8 caracteres';
        return '';
    };

    const getConfirmPasswordError = () => {
        if (!confirmPassword.trim()) return 'Confirme sua senha';
        if (!passwordsMatch(password, confirmPassword)) return 'As senhas não coincidem';
        return '';
    };

    const handleRegister = async () => {
        const emailError = getEmailError();
        const passwordError = getPasswordError();
        const confirmPasswordError = getConfirmPasswordError();

        const newErrors = {
            name: !name.trim(),
            email: !!emailError,
            password: !!passwordError,
            confirmPassword: !!confirmPasswordError,
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        setLoading(true);
        setServerError(null);

        try {
            await api.post('/admin/register', {
                name: name.trim(),
                email: email.trim(),
                password,
            });
            navigate('/login/admin');
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Erro ao cadastrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='all-register-content'>
            <div className='register-header'>
                <Logo width="190" height="147" />
                <div className='cap-icon-admin'>
                    <Shield width="28" height="28" />
                </div>
                <div className='register-title'>
                    <h1>Cadastro do Administrador</h1>
                </div>
                <span className='register-description'>
                    Disponível apenas na primeira configuração do sistema (banco vazio).
                </span>
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
                        autoComplete="email"
                    />
                    {errors.email && <span className='register-error-msg'>{getEmailError()}</span>}

                    <span className='field-label'>SENHA</span>
                    <input
                        className={`register-input${errors.password ? ' register-input--error' : ''}`}
                        type='password'
                        placeholder='Mínimo 8 caracteres'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    {errors.password && <span className='register-error-msg'>{getPasswordError()}</span>}

                    <span className='field-label'>CONFIRMAR SENHA</span>
                    <input
                        className={`register-input${errors.confirmPassword ? ' register-input--error' : ''}`}
                        type='password'
                        placeholder='Confirme sua senha'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    {errors.confirmPassword && <span className='register-error-msg'>{getConfirmPasswordError()}</span>}

                    {serverError && <span className='register-error-msg'>{serverError}</span>}

                    <Buttons
                        type="login"
                        label={loading ? 'Cadastrando...' : 'Cadastrar'}
                        onClick={handleRegister}
                        className="btn-login--admin"
                    />
                </div>
            </div>
        </div>
    );
};

export default InputRegister;
