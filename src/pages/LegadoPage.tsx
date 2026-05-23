import { AppShell } from '../components/layout/AppShell'
import BottomNavigation from '../components/bottomNavigation'
import { DepoimentosCarousel } from '../components/legado/DepoimentosCarousel'
import { GALERIA_CONQUISTAS, TIMELINE_LEGADO } from '../data/mockData'
import '../styles/golgirls-design.scss'

interface LegadoPageProps {
  role: 'aluno' | 'professor' | 'admin'
}

export function LegadoPage({ role }: LegadoPageProps) {
  return (
    <AppShell role={role}>
      <div style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Legado Gol Girls</h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Nossa história e impacto</p>

        <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Nossa História</h2>
        <div style={{ borderLeft: '3px solid #ff1493', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
          {TIMELINE_LEGADO.map((t) => (
            <div key={t.year} className="gg-card" style={{ marginBottom: '0.75rem' }}>
              <strong>{t.year}</strong>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 600 }}>{t.title}</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Depoimentos</h2>
        <DepoimentosCarousel />

        <h2 style={{ fontSize: '1rem', margin: '1.5rem 0 0.75rem' }}>Galeria de Conquistas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {GALERIA_CONQUISTAS.map((src, i) => (
            <img key={i} src={src} alt="" className="gg-card" style={{ width: '100%', height: 100, objectFit: 'cover', padding: 0 }} />
          ))}
        </div>
      </div>
      <BottomNavigation role={role} />
    </AppShell>
  )
}
