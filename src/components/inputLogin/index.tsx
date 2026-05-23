import React, { useState } from 'react'
import './styles.scss'
import GraduationCap from '../icons/graduation-cap'
import UserCog from '../icons/user-cog'
import Shield from '../icons/shield'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { hasLgpdConsent } from '../../services/auth'
import { isValidEmail } from '../../utils/validation'

type InputType = 'text' | 'password' | 'email'
type Role = 'aluno' | 'professor' | 'admin'

interface InputProps {
  type: InputType
  role: Role
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Inputs: React.FC<InputProps> = (props: InputProps) => {
  const navigate = useNavigate()
  const { login, loading, serverError } = useAuth()

  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ main: false, password: false, lgpd: false })

  const roleConfig = {
    aluno: {
      label: 'Portal da Aluna',
      description: 'Faça login para acessar seu espaço',
      mainLabel: 'E-mail ou matrícula',
      passwordLabel: 'Senha',
      placeholder: 'nome@email.com ou matrícula',
      submitLabel: 'Entrar',
    },
    professor: {
      label: 'Portal do Professor',
      description: 'Acesse sua área de gestão',
      mainLabel: 'E-mail institucional',
      passwordLabel: 'Senha',
      placeholder: 'professor@golgirls.org',
      submitLabel: 'Entrar',
    },
    admin: {
      label: 'Painel Administrativo',
      description: 'Acesso restrito ao sistema',
      mainLabel: 'E-mail administrativo',
      passwordLabel: 'Senha segura',
      placeholder: 'admin@golgirls.org',
      submitLabel: 'Entrar com Credenciais Admin',
    },
  }

  const config = roleConfig[props.role]

  const renderIcon = () => {
    switch (props.role) {
      case 'aluno':
        return <GraduationCap width="28" height="28" />
      case 'professor':
        return <UserCog width="28" height="28" />
      case 'admin':
        return <Shield width="28" height="28" />
    }
  }

  const handleClickEnter = async () => {
    const mainEmpty = !props.value.trim()
    const passwordEmpty = !password.trim()
    const invalidEmail =
      (props.role === 'professor' || props.role === 'admin') &&
      props.value.trim() &&
      !isValidEmail(props.value)
    const lgpdMissing = !hasLgpdConsent()

    if (mainEmpty || passwordEmpty || invalidEmail || lgpdMissing) {
      setErrors({ main: !!(mainEmpty || invalidEmail), password: passwordEmpty, lgpd: lgpdMissing })
      return
    }

    setErrors({ main: false, password: false, lgpd: false })

    const token = await login({ role: props.role, value: props.value, password })
    if (!token) return

    switch (props.role) {
      case 'aluno':
        navigate('/app/aluno')
        break
      case 'professor':
        navigate('/professor/painel')
        break
      case 'admin':
        navigate('/admin/painel')
        break
    }
  }

  const getMainErrorMsg = () => {
    if (props.role === 'aluno') return 'Digite sua matrícula ou e-mail'
    if (!props.value.trim()) return 'Digite seu e-mail'
    if (!isValidEmail(props.value)) return 'Digite um e-mail válido'
    return ''
  }

  const mainErrorMsg = getMainErrorMsg()

  return (
    <div className={`gg-login-card gg-login-form gg-login-form--${props.role}`}>
      <div className="gg-login-card__brand">
        <img src="/logo-golgirls.svg" alt="Gol Girls" className="gg-logo gg-logo--login" />
        <div className={`cap-icon-${props.role}`}>{renderIcon()}</div>
        <h1 className="gg-login-card__title">{config.label}</h1>
        <p className="gg-login-card__desc">{config.description}</p>
      </div>

      <div className="gg-login-card__fields">
        <div className="gg-login-field">
          <label className="gg-login-field__label" htmlFor={`login-main-${props.role}`}>
            {config.mainLabel}
          </label>
          <input
            id={`login-main-${props.role}`}
            className={`gg-login-field__input${errors.main ? ' gg-login-field__input--error' : ''}`}
            type={props.type}
            placeholder={config.placeholder}
            value={props.value}
            onChange={props.onChange}
            autoComplete={props.role === 'aluno' ? 'username' : 'email'}
          />
          {errors.main && <span className="gg-login-error">{mainErrorMsg}</span>}
        </div>

        <div className="gg-login-field">
          <label className="gg-login-field__label" htmlFor={`login-pass-${props.role}`}>
            {config.passwordLabel}
          </label>
          <input
            id={`login-pass-${props.role}`}
            className={`gg-login-field__input${errors.password ? ' gg-login-field__input--error' : ''}`}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {errors.password && <span className="gg-login-error">Digite sua senha</span>}
        </div>

        {(props.role === 'professor' || props.role === 'admin') && (
          <button
            type="button"
            className="gg-login-forgot"
            onClick={() => navigate(`/${props.role}/esqueci-senha`)}
          >
            Esqueci minha senha
          </button>
        )}

        {errors.lgpd && (
          <span className="gg-login-error">
            Aceite a <Link to="/privacidade">Política de Privacidade</Link> para continuar.
          </span>
        )}

        <button
          type="button"
          className={`gg-login-submit gg-login-submit--${props.role}`}
          disabled={loading}
          onClick={() => void handleClickEnter()}
        >
          {loading ? 'Entrando...' : config.submitLabel}
        </button>

        {serverError && <span className="gg-login-error" style={{ textAlign: 'center', marginTop: '0.75rem' }}>{serverError}</span>}

        {props.role === 'professor' && (
          <p className="gg-login-footnote">
            Primeiro acesso?{' '}
            <Link to="/register/professor" className="gg-login-footnote__link">
              Cadastre-se aqui
            </Link>
          </p>
        )}

        {props.role === 'admin' && (
          <p className="gg-login-footnote">
            Solicitar acesso?{' '}
            <span className="gg-login-footnote__link">Cadastro apenas por convite</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default Inputs
