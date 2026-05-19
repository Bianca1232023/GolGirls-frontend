import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import BottomNavigation from '../components/bottomNavigation'
import FilterChips from '../components/filterChips'
import InputField from '../components/inputField'
import { ArrowLeft, School, MapPin, Users, Share2, Plus, Trash } from '../components/icons'
import '../styles/admingerenciarsistema.scss'

type Tab = 'escolas' | 'nucleos' | 'turmas' | 'vinculos'

interface Escola { id: number; nome: string; endereco?: string }
interface Nucleo { id: number; nome: string; localizacao?: string }
interface Turma  { id: number; nome: string; capacidade?: number; escola_nome?: string; escola_endereco?: string; nucleo_nome?: string; nucleo_localizacao?: string }
interface Vinculo { professor_id: number; professor_nome: string; turma_id: number; turma_nome: string }
interface Professor { id: number; name: string; email: string }

export const AdminGerenciarSistema = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('escolas')

  // Dados
  const [escolas, setEscolas] = useState<Escola[]>([])
  const [nucleos, setNucleos] = useState<Nucleo[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [vinculos, setVinculos] = useState<Vinculo[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])

  // Formulários
  const [escolaNome, setEscolaNome] = useState('')
  const [escolaEndereco, setEscolaEndereco] = useState('')

  const [nucleoNome, setNucleoNome] = useState('')
  const [nucleoLocalizacao, setNucleoLocalizacao] = useState('')

  const [turmaNome, setTurmaNome] = useState('')
  const [turmaEscolaId, setTurmaEscolaId] = useState('')
  const [turmaNucleoId, setTurmaNucleoId] = useState('')
  const [turmaCapacidade, setTurmaCapacidade] = useState('')

  const [vinculoProfId, setVinculoProfId] = useState('')
  const [vinculoTurmaId, setVinculoTurmaId] = useState('')

  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)

  // ── Fetch ────────────────────────────────────────────────────────────────

  async function fetchAll() {
    const [resEscolas, resNucleos, resTurmas, resVinculos, resProfessors] = await Promise.allSettled([
      api.get('/escolas'),
      api.get('/nucleos'),
      api.get('/admin/turmas'),
      api.get('/admin/turmas/vinculos'),
      api.get('/admin/professors'),
    ])

    if (resEscolas.status === 'fulfilled')
      setEscolas((resEscolas.value as { escolas?: Escola[] }).escolas ?? [])
    if (resNucleos.status === 'fulfilled')
      setNucleos((resNucleos.value as { nucleos?: Nucleo[] }).nucleos ?? [])
    if (resTurmas.status === 'fulfilled')
      setTurmas((resTurmas.value as { turmas?: Turma[] }).turmas ?? [])
    if (resVinculos.status === 'fulfilled')
      setVinculos((resVinculos.value as { vinculos?: Vinculo[] }).vinculos ?? [])
    if (resProfessors.status === 'fulfilled')
      setProfessors((resProfessors.value as { professors?: Professor[] }).professors ?? [])
  }

  useEffect(() => {
    void fetchAll()
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────────────

  function showFeedback(type: 'error' | 'success', msg: string) {
    setFeedback({ type, msg })
    setTimeout(() => setFeedback(null), 3500)
  }

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function handleCadastrarEscola(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/admin/escolas', { nome: escolaNome.trim(), endereco: escolaEndereco.trim() || undefined })
      showFeedback('success', 'Escola cadastrada com sucesso!')
      setEscolaNome('')
      setEscolaEndereco('')
      await fetchAll()
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao cadastrar escola')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteEscola(id: number) {
    if (!confirm('Remover esta escola?')) return
    try {
      await api.delete(`/admin/escolas/${id}`)
      setEscolas((prev) => prev.filter((e) => e.id !== id))
    } catch {
      showFeedback('error', 'Erro ao remover escola')
    }
  }

  async function handleCadastrarNucleo(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/admin/nucleos', { nome: nucleoNome.trim(), localizacao: nucleoLocalizacao.trim() || undefined })
      showFeedback('success', 'Núcleo cadastrado com sucesso!')
      setNucleoNome('')
      setNucleoLocalizacao('')
      await fetchAll()
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao cadastrar núcleo')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteNucleo(id: number) {
    if (!confirm('Remover este núcleo?')) return
    try {
      await api.delete(`/admin/nucleos/${id}`)
      setNucleos((prev) => prev.filter((n) => n.id !== id))
    } catch {
      showFeedback('error', 'Erro ao remover núcleo')
    }
  }

  async function handleCadastrarTurma(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/admin/turmas', {
        nome: turmaNome.trim(),
        escola_id: turmaEscolaId ? Number(turmaEscolaId) : undefined,
        nucleo_id: turmaNucleoId ? Number(turmaNucleoId) : undefined,
        capacidade: turmaCapacidade ? Number(turmaCapacidade) : undefined,
      })
      showFeedback('success', 'Turma cadastrada com sucesso!')
      setTurmaNome('')
      setTurmaEscolaId('')
      setTurmaNucleoId('')
      setTurmaCapacidade('')
      await fetchAll()
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao cadastrar turma')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteTurma(id: number) {
    if (!confirm('Remover esta turma?')) return
    try {
      await api.delete(`/admin/turmas/${id}`)
      setTurmas((prev) => prev.filter((t) => t.id !== id))
    } catch {
      showFeedback('error', 'Erro ao remover turma')
    }
  }

  async function handleVincular(e: React.FormEvent) {
    e.preventDefault()
    if (!vinculoProfId || !vinculoTurmaId) {
      showFeedback('error', 'Selecione professor e turma')
      return
    }
    setLoading(true)
    try {
      await api.post(`/admin/turmas/${vinculoTurmaId}/professores`, { professor_id: Number(vinculoProfId) })
      showFeedback('success', 'Professor vinculado com sucesso!')
      setVinculoProfId('')
      setVinculoTurmaId('')
      await fetchAll()
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao vincular professor')
    } finally {
      setLoading(false)
    }
  }

  // ── Chips ─────────────────────────────────────────────────────────────────

  const chips = [
    { key: 'escolas',  label: 'Escolas',  count: escolas.length,  icon: <School  width="14" height="14" /> },
    { key: 'nucleos',  label: 'Núcleos',  count: nucleos.length,  icon: <MapPin  width="14" height="14" /> },
    { key: 'turmas',   label: 'Turmas',   count: turmas.length,   icon: <Users   width="14" height="14" /> },
    { key: 'vinculos', label: 'Vínculos', count: vinculos.length, icon: <Share2  width="14" height="14" /> },
  ]

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="sistema-page">

      {/* Header */}
      <div className="sistema-header">
        <button className="sistema-back-btn" onClick={() => navigate('/admin/painel')}>
          <ArrowLeft width="16" height="16" />
          Voltar
        </button>
        <h1>Gerenciar Sistema</h1>
        <p>Cadastre escolas, núcleos e turmas</p>
      </div>

      {/* Chips */}
      <FilterChips chips={chips} active={tab} onChange={(k) => setTab(k as Tab)} role={'admin'} />

      {/* Feedback */}
      {feedback && (
        <div className={`sistema-feedback sistema-feedback--${feedback.type}`}>
          {feedback.msg}
        </div>
      )}

      {/* ── ESCOLAS ── */}
      {tab === 'escolas' && (
        <>
          <div className="sistema-form-card">
            <h2 className="sistema-form-title">Cadastrar Nova Escola</h2>
            <form onSubmit={handleCadastrarEscola} className="sistema-form">
              <InputField label="Nome da Escola" value={escolaNome} onChange={setEscolaNome} placeholder="Ex: E.M. Paulo Freire" required />
              <InputField label="Endereço" value={escolaEndereco} onChange={setEscolaEndereco} placeholder="Rua, número, bairro" />
              <button className="sistema-submit-btn sistema-submit-btn--blue" type="submit" disabled={loading || !escolaNome.trim()}>
                <Plus width="16" height="16" /> Cadastrar Escola
              </button>
            </form>
          </div>

          <div className="sistema-list-section">
            <span className="sistema-list-label">ESCOLAS CADASTRADAS ({escolas.length})</span>
            {escolas.length === 0 && <p className="sistema-empty">Nenhuma escola cadastrada.</p>}
            {escolas.map((escola) => (
              <div key={escola.id} className="sistema-list-item">
                <div className="sistema-list-info">
                  <span className="sistema-list-name">{escola.nome}</span>
                  {escola.endereco && <span className="sistema-list-sub">{escola.endereco}</span>}
                </div>
                <button className="sistema-delete-btn" onClick={() => handleDeleteEscola(escola.id)} title="Remover">
                  <Trash width="16" height="16" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── NÚCLEOS ── */}
      {tab === 'nucleos' && (
        <>
          <div className="sistema-form-card">
            <h2 className="sistema-form-title">Cadastrar Novo Núcleo</h2>
            <form onSubmit={handleCadastrarNucleo} className="sistema-form">
              <InputField label="Nome do Núcleo" value={nucleoNome} onChange={setNucleoNome} placeholder="Ex: Zona Norte" required />
              <InputField label="Localização" value={nucleoLocalizacao} onChange={setNucleoLocalizacao} placeholder="Ex: Méier" />
              <button className="sistema-submit-btn sistema-submit-btn--purple" type="submit" disabled={loading || !nucleoNome.trim()}>
                <Plus width="16" height="16" /> Cadastrar Núcleo
              </button>
            </form>
          </div>

          <div className="sistema-list-section">
            <span className="sistema-list-label">NÚCLEOS CADASTRADOS ({nucleos.length})</span>
            {nucleos.length === 0 && <p className="sistema-empty">Nenhum núcleo cadastrado.</p>}
            {nucleos.map((nucleo) => (
              <div key={nucleo.id} className="sistema-list-item">
                <div className="sistema-list-info">
                  <span className="sistema-list-name">{nucleo.nome}</span>
                  {nucleo.localizacao && <span className="sistema-list-sub">{nucleo.localizacao}</span>}
                </div>
                <button className="sistema-delete-btn" onClick={() => handleDeleteNucleo(nucleo.id)} title="Remover">
                  <Trash width="16" height="16" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TURMAS ── */}
      {tab === 'turmas' && (
        <>
          <div className="sistema-form-card">
            <h2 className="sistema-form-title">Cadastrar Nova Turma</h2>
            <form onSubmit={handleCadastrarTurma} className="sistema-form">
              <InputField label="Nome da Turma" value={turmaNome} onChange={setTurmaNome} placeholder="Ex: 8º Ano A" required />
              <InputField
                label="Escola"
                value={turmaEscolaId}
                onChange={setTurmaEscolaId}
                placeholder="Selecione uma escola"
                options={escolas.map((e) => ({ value: e.id, label: e.nome }))}
              />
              <InputField
                label="Núcleo"
                value={turmaNucleoId}
                onChange={setTurmaNucleoId}
                placeholder="Selecione um núcleo"
                options={nucleos.map((n) => ({ value: n.id, label: n.nome }))}
              />
              <InputField label="Capacidade" value={turmaCapacidade} onChange={setTurmaCapacidade} placeholder="Ex: 30" type="number" />
              <button className="sistema-submit-btn sistema-submit-btn--green" type="submit" disabled={loading || !turmaNome.trim()}>
                <Plus width="16" height="16" /> Cadastrar Turma
              </button>
            </form>
          </div>

          <div className="sistema-list-section">
            <span className="sistema-list-label">TURMAS CADASTRADAS ({turmas.length})</span>
            {turmas.length === 0 && <p className="sistema-empty">Nenhuma turma cadastrada.</p>}
            {turmas.map((turma) => (
              <div key={turma.id} className="sistema-list-item">
                <div className="sistema-list-info">
                  <span className="sistema-list-name">{turma.nome}</span>
                  <span className="sistema-list-sub">
                    {[
                      turma.escola_nome,
                      turma.escola_endereco,
                      turma.nucleo_nome,
                      turma.nucleo_localizacao,
                      turma.capacidade ? `${turma.capacidade} vagas` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'Sem detalhes'}
                  </span>
                </div>
                <button className="sistema-delete-btn" onClick={() => handleDeleteTurma(turma.id)} title="Remover">
                  <Trash width="16" height="16" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── VÍNCULOS ── */}
      {tab === 'vinculos' && (
        <>
          <div className="sistema-form-card">
            <h2 className="sistema-form-title">Vincular Professor à Turma</h2>
            <form onSubmit={handleVincular} className="sistema-form">
              <InputField
                label="Professor(a)"
                value={vinculoProfId}
                onChange={setVinculoProfId}
                placeholder="Selecione um professor"
                options={professors.map((p) => ({ value: p.id, label: p.name || p.email }))}
              />
              <InputField
                label="Turma"
                value={vinculoTurmaId}
                onChange={setVinculoTurmaId}
                placeholder="Selecione uma turma"
                options={turmas.map((t) => ({ value: t.id, label: t.nome }))}
              />
              <button
                className="sistema-submit-btn sistema-submit-btn--pink"
                type="submit"
                disabled={loading || !vinculoProfId || !vinculoTurmaId}
              >
                <Share2 width="16" height="16" /> Vincular Professor
              </button>
            </form>
          </div>

          <div className="sistema-list-section">
            <span className="sistema-list-label">VÍNCULOS ATIVOS ({vinculos.length})</span>
            {vinculos.length === 0 && <p className="sistema-empty">Nenhum vínculo ativo.</p>}
            {vinculos.map((v) => (
              <div key={`${v.professor_id}-${v.turma_id}`} className="sistema-list-item">
                <div className="sistema-list-info">
                  <span className="sistema-list-name">{v.professor_nome}</span>
                  <span className="sistema-list-sub">Turma: {v.turma_nome}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <BottomNavigation role="admin" />
    </div>
  )
}
