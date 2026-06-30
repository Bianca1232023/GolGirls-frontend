import { useState } from 'react'
import { api } from '../../services/api'
import { setSessionLabel } from '../../services/auth'

interface Props {
  role: 'aluno' | 'professor' | 'admin'
  currentName: string
  currentEmail?: string
  currentBairro?: string
  accentColor: string
  onClose: () => void
  onSaved: (updates: { name?: string; email?: string; bairro?: string }) => void
}

export function EditProfileModal({
  role,
  currentName,
  currentEmail,
  currentBairro,
  accentColor,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(currentName)
  const [email, setEmail] = useState(currentEmail ?? '')
  const [bairro, setBairro] = useState(currentBairro ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!name.trim()) {
      setError('O nome não pode ficar em branco')
      return
    }
    if (role !== 'aluno' && !email.trim()) {
      setError('O e-mail não pode ficar em branco')
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (role === 'aluno') {
        await api.patch('/aluno/me', { nome: name.trim(), bairro: bairro.trim() })
        onSaved({ name: name.trim(), bairro: bairro.trim() })
      } else if (role === 'professor') {
        await api.patch('/professor/me', { name: name.trim(), email: email.trim() })
        if (email.trim() !== currentEmail) setSessionLabel(email.trim())
        onSaved({ name: name.trim(), email: email.trim() })
      } else {
        await api.patch('/admins/me', { name: name.trim(), email: email.trim() })
        if (email.trim() !== currentEmail) setSessionLabel(email.trim())
        onSaved({ name: name.trim(), email: email.trim() })
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: '0.65rem 0.85rem',
    borderRadius: '0.6rem',
    border: '1.5px solid #e5e7eb',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  }

  const labelTextStyle: React.CSSProperties = {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '1.25rem',
        width: '100%',
        maxWidth: 420,
        padding: '1.5rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>Editar Perfil</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888', padding: 0, lineHeight: 1 }}
          >×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={labelStyle}>
            <span style={labelTextStyle}>Nome</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              placeholder="Seu nome"
            />
          </label>

          {role !== 'aluno' && (
            <label style={labelStyle}>
              <span style={labelTextStyle}>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="seu@email.com"
              />
            </label>
          )}

          {role === 'aluno' && (
            <label style={labelStyle}>
              <span style={labelTextStyle}>Bairro</span>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                style={inputStyle}
                placeholder="Seu bairro"
              />
            </label>
          )}
        </div>

        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: '0.75rem 0 0', textAlign: 'center' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, padding: '0.7rem',
              border: '1.5px solid #e5e7eb',
              borderRadius: '9999px',
              background: '#fff', color: '#374151',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >Cancelar</button>
          <button
            type="button"
            onClick={() => { void handleSave() }}
            disabled={loading}
            style={{
              flex: 2, padding: '0.7rem',
              background: loading ? '#d1d5db' : accentColor,
              color: '#fff', border: 'none',
              borderRadius: '9999px',
              fontWeight: 600, fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >{loading ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
    </div>
  )
}
