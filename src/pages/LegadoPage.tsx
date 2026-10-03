import { AppShell } from '../components/layout/AppShell'
import { DepoimentosCarousel } from '../components/legado/DepoimentosCarousel'
import { GALERIA_CONQUISTAS, TIMELINE_LEGADO } from '../data/mockData'
import '../styles/golgirls-design.scss'

export function LegadoPage() {
  return (
    <AppShell publicPage>
      <div style={{ padding: '1rem' }}>
        <h1 style={{fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 'bold'}}> Legado Gol Girls</h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Nossa história e impacto</p>

        <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Nossa História</h2>
        <div style={{ position: 'relative', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '3px', backgroundColor: '#d1d5db'}} />
          {TIMELINE_LEGADO.map((t) => ( 
            <div key={t.year} style={{position: 'relative', marginBottom: '1rem'}}>
              <div style={{ position: 'absolute', left: '-1.5rem', top: '8px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#d1d5db', border: '3px solid white', boxShadow: '0 0 0 2px #d1d5db', zIndex: 1}}/>
                <div className="gg-card">
                  <strong style={{ color: '#ff1493', fontSize: '0.9rem'}}> {t.year} </strong>
                  <p style={{ margin: '0.25rem 0 0', fontWeight: 600}}> {t.title}</p>
                  <p style={{margin: 0, fontSize: '0.85rem', color: '#6b7280'}}> {t.desc} </p>
                </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Depoimentos</h2>
        <DepoimentosCarousel />

        <h2 style={{ fontSize: '1rem', margin: '1.5rem 0 0.75rem' }}>Galeria de Conquistas</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem'}}>
          {GALERIA_CONQUISTAS.map((src, i) => (
            <img key={i} src={src} alt={`Conquista ${i + 1}`} className="gg-card" style={{width: '100%', height: 'auto', objectFit: 'contain', padding: 0, display: 'block'}} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
