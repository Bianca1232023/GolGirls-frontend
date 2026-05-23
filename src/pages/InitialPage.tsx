import { Link } from 'react-router-dom'
import AcessCard from '../components/AcessCard'
import { AppShell } from '../components/layout/AppShell'
import '../styles/golgirls-design.scss'
import '../App.scss'

export function InitialPage() {
  return (
    <AppShell publicPage>
      <div className="gg-home-page">
        <img src="/logo-golgirls.svg" alt="Gol Girls" className="gg-logo" />
        <h1 className="title gg-home-title">Bem-vinda ao Gol Girls</h1>
        <span className="subtitle">Selecione o tipo de acesso</span>

        <div className="gg-home-cards">
          <AcessCard role="aluno" />
          <AcessCard role="professor" />
          <AcessCard role="admin" />
        </div>

        <footer className="gg-home-footer">
          <p className="gg-home-tagline">
            Empoderando meninas negras periféricas através da educação.
          </p>
          <p className="gg-home-lgpd">
            <Link to="/privacidade">Política de Privacidade (LGPD)</Link>
          </p>
        </footer>
      </div>
    </AppShell>
  )
}
