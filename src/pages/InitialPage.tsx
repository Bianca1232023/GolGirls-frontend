import { Link } from 'react-router-dom'
import Logo from '../components/icons/logo'
import AcessCard from '../components/AcessCard'

export function InitialPage() {
  return (
    <div className="main">
        <Logo className="logo" />
        <h1 className="title">Bem-vinda ao GolGirls</h1>
        <span className="subtitle">Selecione seu tipo de acesso</span>

        <AcessCard role="aluno" />
        <AcessCard role="professor" />
        <AcessCard role="admin" />

        <p style={{ marginTop: '2rem', fontSize: '0.8rem', textAlign: 'center' }}>
          <Link to="/privacidade" style={{ color: '#888' }}>Política de Privacidade (LGPD)</Link>
        </p>
    </div>
  )
}
