import { useState } from 'react'
import './styles.scss'
import GraduationCap from '../icons/graduation-cap'
import UserCog from '../icons/user-cog'
import Shield from '../icons/shield'
import Buttons from '../Button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../services/api'
import { isValidPassword, passwordsMatch } from '../../utils/validation'

type Role = 'professor' | 'admin' | 'aluno';

interface ResetPasswordFormProps {
    role: Role;
}

const ResetPasswordFormComponent: React.FC<ResetPasswordFormProps> = ({ role }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ password: false, confirmPassword: false });
    const [serverError, setServerError] = useState<string | null>(null);

    if (!token) {
        return (
            <div className='all-resetpwd-content'>
                <div className='error-box'>
                    <span>Link inválido ou expirado</span>
                </div>
            </div>
        );
    }

    const getConfirmError = () => {
        if (!confirmPassword.trim()) return 'Confirme sua nova senha';
        if (confirmPassword !== password) return 'As senhas não coincidem';
        return '';
    };

    const handleReset = async () => {
        const newErrors = {
            password: !isValidPassword(password),
            confirmPassword: !!getConfirmError() || !passwordsMatch(password, confirmPassword),
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        setLoading(true);
        setServerError(null);

        try {
            const endpoint =
              role === 'admin' ? '/admin/reset-password'
              : role === 'aluno' ? '/aluno/reset-password'
              : '/professor/reset-password';
            await api.post(endpoint, { token, password });
            navigate(`/login/${role}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao redefinir senha';
            setServerError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='all-resetpwd-content'>
            <div className='resetpwd-header'>
                <img src="/logo-golgirls.svg" alt="Gol Girls" className="gg-logo gg-logo--login" />
                <div className={`cap-icon-${role}`}>
                    {role === 'professor' ? <UserCog width="28" height="28" />
                      : role === 'aluno' ? <GraduationCap width="28" height="28" />
                      : <Shield width="28" height="28" />}
                </div>
                <div className='resetpwd-title'>
                    <h1>Nova senha</h1>
                </div>
                <span className='resetpwd-description'>Crie uma nova senha para acessar o portal</span>
            </div>

            <div className='resetpwd-form'>
                <div className='resetpwd-container'>
                    <span className='label'>NOVA SENHA</span>
                    <input
                        className={`input-box${errors.password ? ' input-box--error' : ''}`}
                        type="password"
                        placeholder="Digite sua nova senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                        <span className='input-error-msg'>
                            {!password.trim() ? 'Digite sua nova senha' : 'Mínimo 8 caracteres'}
                        </span>
                    )}

                    <span className='label'>CONFIRMAR SENHA</span>
                    <input
                        className={`input-box${errors.confirmPassword ? ' input-box--error' : ''}`}
                        type="password"
                        placeholder="Confirme sua nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <span className='input-error-msg'>{getConfirmError()}</span>}

                    <Buttons
                        type="login"
                        label={loading ? 'Salvando...' : 'Redefinir senha'}
                        onClick={handleReset}
                        className={`btn-login--${role}`}
                    />
                    {serverError && <span className='server-error-box'>{serverError}</span>}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordFormComponent;
