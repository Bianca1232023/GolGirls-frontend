import React from 'react'
import Inputs from '../components/inputLogin'
import ArrowLeft from '../components/icons/arrow-left'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import '../styles/golgirls-design.scss'

export const AdminLogin = () => {
  const [value, setValue] = React.useState('')
  const navigate = useNavigate()

  return (
    <AppShell publicPage>
      <div className="gg-login-page">
        <div className="gg-login-shell">
          <button type="button" className="gg-login-back" onClick={() => navigate('/')}>
            <ArrowLeft width="18" height="18" />
            Voltar
          </button>
          <Inputs type="email" value={value} onChange={(e) => setValue(e.target.value)} role="admin" />
        </div>
      </div>
    </AppShell>
  )
}
