import { useState } from 'react'
import '../setPassword/styles.scss'
import GraduationCap from '../icons/graduation-cap'
import Buttons from '../Button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../services/api'
import { isValidPassword, passwordsMatch } from '../../utils/validation'
import { AppShell } from '../layout/AppShell'

const AlunoSetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ password: false, confirmPassword: false })
  const [serverError, setServerError] = useState<string | null>(null)

  if (!token) {
    return (
      <AppShell publicPage>
        <div className="set-password-container"><span>Link inválido ou expirado</span></div>
      </AppShell>
    )
  }

  async function handleSubmit() {
    const newErrors = {
      password: !isValidPassword(password),
      confirmPassword: !passwordsMatch(password, confirmPassword),
    }
    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return

    setLoading(true)
    setServerError(null)
    try {
      await api.post('/aluno/set-password', { token, password })
      navigate('/login/aluno')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao definir senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell publicPage>
      <div className="gg-login-page">
        <div className="all-setpassword-content">
          <div className="setpassword-header">
          <img src="/logo-golgirls.svg" alt="Gol Girls" className="gg-logo gg-logo--login" />
          <div className="cap-icon-aluno"><GraduationCap width="28" height="28" /></div>
          <h1>Crie sua senha</h1>
          <p className="setpassword-description">Defina a senha para acessar o portal da aluna</p>
        </div>
        <div className="setpassword-form">
          <div className="setpassword-container">
            <span className="field-label">SENHA</span>
            <input
              className={`setpassword-input${errors.password ? ' setpassword-input--error' : ''}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
            <span className="field-label">CONFIRMAR SENHA</span>
            <input
              className={`setpassword-input${errors.confirmPassword ? ' setpassword-input--error' : ''}`}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {serverError && <span className="setpassword-error-msg">{serverError}</span>}
            <Buttons type="login" label={loading ? 'Salvando...' : 'Confirmar'} onClick={handleSubmit} className="btn-login--aluno" />
          </div>
        </div>
      </div>
    </div>
    </AppShell>
  )
}

export default AlunoSetPassword
