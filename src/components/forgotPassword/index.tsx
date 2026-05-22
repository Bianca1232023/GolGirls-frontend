import { useState } from 'react'
import './styles.scss'
import UserCog from '../icons/user-cog'
import Shield from '../icons/shield'
import { Logo } from '../icons'
import Buttons from '../Button'
import { api } from '../../services/api'
import { isValidEmail } from '../../utils/validation'

type Role = 'professor' | 'admin';

interface ForgotPasswordProps {
    role: Role;
}

const ForgotPasswordComponent: React.FC<ForgotPasswordProps> = ({ role }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        const invalid = !isValidEmail(email);
        setEmailError(invalid);
        if (invalid) return;

        setLoading(true);
        setServerError(null);

        try {
            const endpoint = role === 'admin' ? '/admin/forgot-password' : '/professor/forgot-password';
            await api.post(endpoint, { email });
            setSuccess(true);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao enviar e-mail';
            setServerError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='all-forgot-content'>
            <div className='forgot-header'>
                <Logo width="190" height="147" />
                <div className={`cap-icon-${role}`}>
                    {role === 'professor' ? <UserCog width="28" height="28" /> : <Shield width="28" height="28" />}
                </div>
                <div className='forgot-title'>
                    <h1>Esqueci minha senha</h1>
                </div>
                <span className='forgot-description'>
                    Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha
                </span>
            </div>

            {success ? (
                <div className='forgot-success'>
                    <span>E-mail enviado! Verifique sua caixa de entrada e siga as instruções.</span>
                </div>
            ) : (
                <div className='forgot-form'>
                    <div className='forgot-container'>
                        <span className='label'>E-MAIL</span>
                        <input
                            className={`input-box${emailError ? ' input-box--error' : ''}`}
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && (
                            <span className='input-error-msg'>
                                Digite um e-mail válido
                            </span>
                        )}
                        <Buttons
                            type="login"
                            label={loading ? 'Enviando...' : 'Enviar link'}
                            onClick={handleSubmit}
                            className={`btn-login--${role}`}
                        />
                        {serverError && <span className='server-error-box'>{serverError}</span>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordComponent;
