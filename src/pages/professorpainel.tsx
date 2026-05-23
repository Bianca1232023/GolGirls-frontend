import { useState, useEffect } from 'react'
import { api } from '../services/api'
import BottomNavigation from '../components/bottomNavigation'
import FilterChips from '../components/filterChips'
import InputField from '../components/inputField'
import { AppShell } from '../components/layout/AppShell'
import { MapPin, UserPlus, Search, Filter } from '../components/icons'
import { MOCK_FALTAS_CONSECUTIVAS, type ChamadaStatus } from '../data/mockData'
import '../styles/professorpainel.scss'
import '../styles/golgirls-design.scss'

type ProfessorTab = 'chamada' | 'buscar' | 'cadastrar' | 'relatorios'

interface Turma {
  id: number
  nome: string
  escola_id: number | null
  nucleo_id: number | null
  nucleo_localizacao: string | null
}

interface Nucleo {
  id: number
  nome: string
  localizacao?: string
}

interface Aluna {
  id: number
  nome: string
  matricula: string
  idade?: number
  ativo: boolean
  bairro: string
  turma_id: number | null
  turma_nome: string | null
  nucleo_id: number | null
  nucleo: string | null
  escola: string | null
}

export const ProfessorPainel = () => {
  const [tab, setTab] = useState<ProfessorTab>('chamada')
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [nucleos, setNucleos] = useState<Nucleo[]>([])

  // Buscar state
  const [alunos, setAlunos] = useState<Aluna[]>([])
  const [busca, setBusca] = useState('')
  const [showFiltros, setShowFiltros] = useState(false)
  const [filtraTurmaId, setFiltraTurmaId] = useState('')
  const [filtraNucleoId, setFiltraNucleoId] = useState('')
  const [filtraBairro, setFiltraBairro] = useState('')
  const [loadingAlunos, setLoadingAlunos] = useState(false)

  // Cadastrar form state
  const [nome, setNome] = useState('')
  const [matricula, setMatricula] = useState('')
  const [email, setEmail] = useState('')
  const [dataNasc, setDataNasc] = useState('')
  const [nucleoId, setNucleoId] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [bairro, setBairro] = useState('')
  const [telefoneAluna, setTelefoneAluna] = useState('')
  const [nomeResp, setNomeResp] = useState('')
  const [telefoneResp, setTelefoneResp] = useState('')

  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  const [chamadaTurmaId, setChamadaTurmaId] = useState('')
  const [chamadaData, setChamadaData] = useState(new Date().toISOString().slice(0, 10))
  const [chamadaAlunos, setChamadaAlunos] = useState<Aluna[]>([])
  const [statusMap, setStatusMap] = useState<Record<number, ChamadaStatus>>({})
  const [nucleoChamada, setNucleoChamada] = useState<'meier' | 'seropedica'>('meier')
  const [showChamadaModal, setShowChamadaModal] = useState(false)
  const [relatorio, setRelatorio] = useState<{ turmas?: Array<{ turma_nome: string; alunos_total: number; total_presentes: number }> } | null>(null)

  const localizacaoDisplay =
    turmas.find((t) => t.nucleo_localizacao)?.nucleo_localizacao ?? 'Localização'

  async function fetchData() {
    const [resTurmas, resNucleos] = await Promise.allSettled([
      api.get('/professor/turmas'),
      api.get('/nucleos'),
    ])
    if (resTurmas.status === 'fulfilled')
      setTurmas((resTurmas.value as { turmas?: Turma[] }).turmas ?? [])
    if (resNucleos.status === 'fulfilled')
      setNucleos((resNucleos.value as { nucleos?: Nucleo[] }).nucleos ?? [])
  }

  async function fetchAlunos() {
    setLoadingAlunos(true)
    try {
      const params = new URLSearchParams()
      if (filtraTurmaId) params.set('turma_id', filtraTurmaId)
      if (filtraNucleoId) params.set('nucleo_id', filtraNucleoId)
      if (filtraBairro.trim()) params.set('bairro', filtraBairro.trim())
      const query = params.toString()
      const res = await api.get(`/alunos${query ? `?${query}` : ''}`) as { alunos?: Aluna[] }
      setAlunos(res.alunos ?? [])
    } catch {
      setAlunos([])
    } finally {
      setLoadingAlunos(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  useEffect(() => {
    if (tab === 'buscar') void fetchAlunos()
    if (tab === 'relatorios') void fetchRelatorios()
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadChamadaAlunos(turmaId: string) {
    if (!turmaId) {
      setChamadaAlunos([])
      return
    }
    try {
      const res = await api.get(`/alunos?turma_id=${turmaId}`) as { alunos?: Aluna[] }
      const list = res.alunos ?? []
      setChamadaAlunos(list)
      const map: Record<number, ChamadaStatus> = {}
      list.forEach((a) => { map[a.id] = null })
      setStatusMap(map)
    } catch {
      setChamadaAlunos([])
    }
  }

  async function fetchRelatorios() {
    try {
      const res = await api.get('/professor/relatorios') as { turmas?: Array<{ turma_nome: string; alunos_total: number; total_presentes: number; total_registros: number }> }
      setRelatorio(res)
    } catch {
      setRelatorio(null)
    }
  }

  async function handleSalvarChamada() {
    if (!chamadaTurmaId) {
      showFeedback('error', 'Selecione uma turma')
      return
    }
    const pendentes = chamadaAlunos.filter((a) => !statusMap[a.id])
    if (pendentes.length) {
      showFeedback('error', `Marque P, F ou T para ${pendentes.length} aluna(s)`)
      return
    }
    setLoading(true)
    try {
      await api.post('/professor/chamada', {
        turma_id: Number(chamadaTurmaId),
        data_aula: chamadaData,
        registros: chamadaAlunos.map((a) => ({
          aluno_id: a.id,
          presente: statusMap[a.id] === 'P',
        })),
      })
      setShowChamadaModal(false)
      showFeedback('success', 'Chamada finalizada com sucesso!')
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao salvar chamada')
    } finally {
      setLoading(false)
    }
  }

  const chamadaResumo = {
    p: chamadaAlunos.filter((a) => statusMap[a.id] === 'P').length,
    f: chamadaAlunos.filter((a) => statusMap[a.id] === 'F').length,
    t: chamadaAlunos.filter((a) => statusMap[a.id] === 'T').length,
    pendentes: chamadaAlunos.filter((a) => !statusMap[a.id]).length,
  }

  function setStatus(alunoId: number, s: ChamadaStatus) {
    setStatusMap((m) => ({ ...m, [alunoId]: s }))
  }

  function hasEvasionRisk(alunoId: number) {
    return (MOCK_FALTAS_CONSECUTIVAS[alunoId] ?? 0) >= 3
  }

  function showFeedback(type: 'error' | 'success', msg: string) {
    setFeedback({ type, msg })
    setTimeout(() => setFeedback(null), 3500)
  }

  function calcIdade(data: string): number | undefined {
    if (!data) return undefined
    const [year, month, day] = data.split('-').map(Number)
    const today = new Date()
    let age = today.getFullYear() - year
    if (
      today.getMonth() + 1 < month ||
      (today.getMonth() + 1 === month && today.getDate() < day)
    ) age--
    return age > 0 ? age : undefined
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault()
    const selectedTurma = turmas.find((t) => t.id === Number(turmaId))
    if (!selectedTurma?.escola_id) {
      showFeedback('error', 'Turma sem escola vinculada. Peça ao administrativo para configurar a turma.')
      return
    }
    setLoading(true)
    try {
      await api.post('/professor/createaluno', {
        nome: nome.trim(),
        matricula: matricula.trim(),
        email: email.trim(),
        nucleo_id: Number(nucleoId),
        escola_id: selectedTurma.escola_id,
        turma_id: Number(turmaId),
        bairro: bairro.trim(),
        idade: calcIdade(dataNasc),
        telefone_aluna: telefoneAluna.trim() || undefined,
        nome_responsavel: nomeResp.trim(),
        telefone_responsavel: telefoneResp.trim(),
      })
      showFeedback('success', 'Aluna cadastrada! E-mail enviado para definir a senha.')
      setNome(''); setMatricula(''); setEmail(''); setDataNasc('')
      setNucleoId(''); setTurmaId(''); setBairro('')
      setTelefoneAluna(''); setNomeResp(''); setTelefoneResp('')
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao cadastrar aluna')
    } finally {
      setLoading(false)
    }
  }

  function aplicarFiltros() {
    void fetchAlunos()
    setShowFiltros(false)
  }

  function limparFiltros() {
    setFiltraTurmaId('')
    setFiltraNucleoId('')
    setFiltraBairro('')
  }

  const turmaIds = new Set(turmas.map((t) => t.id))

  const alunasFiltradas = alunos.filter((a) => {
    if (!busca.trim()) return true
    const q = busca.toLowerCase()
    return (
      a.nome.toLowerCase().includes(q) ||
      a.matricula.toLowerCase().includes(q)
    )
  })

  return (
    <AppShell role="professor">
    <div className="prof-page">

      {/* Header */}
      <div className="prof-header">
        <div className="prof-header__titles">
          <h1>Portal do<br />Professor</h1>
          <p>Gestão de turmas e alunas</p>
        </div>
        <div className="prof-header__location">
          <MapPin width="14" height="14" />
          <span>{localizacaoDisplay}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Tabs */}
      <FilterChips role="professor" active={tab} onChange={(k) => setTab(k as ProfessorTab)} />

      {/* Feedback */}
      {feedback && (
        <div className={`prof-feedback prof-feedback--${feedback.type}`}>
          {feedback.msg}
        </div>
      )}

      {/* ── BUSCAR ── */}
      {tab === 'buscar' && (
        <div className="prof-content">
          <p className="prof-buscar-desc">
            Consulta avançada por matrícula, núcleo, escola, turma e bairro
          </p>

          {/* Campo de busca */}
          <div className="prof-search-wrap">
            <Search width="16" height="16" />
            <input
              className="prof-search-input"
              type="text"
              placeholder="Nome ou matrícula..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {/* Botão filtros avançados */}
          <button
            className="prof-filtros-btn"
            type="button"
            onClick={() => setShowFiltros((v) => !v)}
          >
            <Filter width="16" height="16" />
            Filtros Avançados
          </button>

          {/* Painel de filtros */}
          {showFiltros && (
            <div className="prof-filtros-panel">
              <InputField
                label="Turma"
                value={filtraTurmaId}
                onChange={setFiltraTurmaId}
                placeholder="Todas as turmas"
                options={turmas.map((t) => ({ value: t.id, label: t.nome }))}
              />
              <InputField
                label="Núcleo"
                value={filtraNucleoId}
                onChange={setFiltraNucleoId}
                placeholder="Todos os núcleos"
                options={nucleos.map((n) => ({ value: n.id, label: n.nome }))}
              />
              <InputField
                label="Bairro"
                value={filtraBairro}
                onChange={setFiltraBairro}
                placeholder="Ex: Méier"
              />
              <div className="prof-filtros-actions">
                <button className="prof-filtros-limpar" type="button" onClick={limparFiltros}>
                  Limpar
                </button>
                <button className="prof-filtros-aplicar" type="button" onClick={aplicarFiltros}>
                  Aplicar
                </button>
              </div>
            </div>
          )}

          {/* Contagem */}
          {!loadingAlunos && (
            <p className="prof-count">
              <strong>{alunasFiltradas.length}</strong> aluna(s) encontrada(s)
            </p>
          )}

          {/* Lista de alunas */}
          {loadingAlunos ? (
            <p className="prof-empty">Carregando...</p>
          ) : alunasFiltradas.length === 0 ? (
            <p className="prof-empty">Nenhuma aluna encontrada.</p>
          ) : (
            <div className="prof-aluna-list">
              {alunasFiltradas.map((a) => (
                <div key={a.id} className="prof-aluna-card">
                  <div className="prof-aluna-card__top">
                    <span className="prof-aluna-card__nome">{a.nome}</span>
                    <div className="prof-aluna-card__badges">
                      <span className={`prof-badge ${a.ativo ? 'prof-badge--ativa' : 'prof-badge--inativa'}`}>
                        {a.ativo ? 'Ativa' : 'Inativa'}
                      </span>
                      {a.turma_id && turmaIds.has(a.turma_id) && (
                        <span className="prof-badge prof-badge--turma">Minha Turma</span>
                      )}
                    </div>
                  </div>
                  <span className="prof-aluna-card__mat">Mat. {a.matricula}</span>
                  {(a.turma_nome || a.nucleo) && (
                    <span className="prof-aluna-card__sub">
                      {[a.turma_nome, a.nucleo].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'chamada' && (
        <div className="prof-chamada">
          <div className="prof-chamada__body">
            <div className="gg-card" style={{ marginBottom: '1rem' }}>
              <label className="input-field__label">Núcleo</label>
              <select className="input-field__control" value={nucleoChamada} onChange={(e) => setNucleoChamada(e.target.value as 'meier' | 'seropedica')}>
                <option value="meier">Méier</option>
                <option value="seropedica">Seropédica</option>
              </select>
            </div>
            <InputField label="Turma *" value={chamadaTurmaId} onChange={(v) => { setChamadaTurmaId(v); void loadChamadaAlunos(v) }} placeholder="Selecione a turma" options={turmas.map((t) => ({ value: t.id, label: t.nome }))} />
            <div className="input-field" style={{ marginTop: '0.75rem' }}>
              <label className="input-field__label">Data da aula *</label>
              <input className="input-field__control" type="date" value={chamadaData} onChange={(e) => setChamadaData(e.target.value)} />
            </div>
            {chamadaAlunos.length === 0 ? (
              <p className="prof-empty">Selecione uma turma para listar alunas.</p>
            ) : (
              <div className="prof-aluna-list prof-chamada__list">
                {chamadaAlunos.map((a) => (
                  <div key={a.id} className={`prof-aluna-card gg-card ${hasEvasionRisk(a.id) ? 'gg-evasion' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="prof-aluna-card__nome">{a.nome}{hasEvasionRisk(a.id) && <span className="gg-evasion-tag">Risco de Evasão</span>}</span>
                    <div className="gg-toggle-group">
                      <button type="button" className={`--p ${statusMap[a.id] === 'P' ? 'active' : ''}`} onClick={() => setStatus(a.id, 'P')}>P</button>
                      <button type="button" className={`--f ${statusMap[a.id] === 'F' ? 'active' : ''}`} onClick={() => setStatus(a.id, 'F')}>F</button>
                      <button type="button" className={`--t ${statusMap[a.id] === 'T' ? 'active' : ''}`} onClick={() => setStatus(a.id, 'T')}>T</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {chamadaAlunos.length > 0 && (
            <div className="prof-chamada__footer">
              <button
                type="button"
                className="gg-btn-primary prof-chamada__submit"
                onClick={() => setShowChamadaModal(true)}
              >
                {chamadaResumo.pendentes > 0 ? `Finalizar Chamada (${chamadaResumo.pendentes} pendente(s))` : 'Finalizar Chamada'}
              </button>
            </div>
          )}
          {showChamadaModal && (
            <div className="gg-modal-overlay" role="presentation" onClick={() => setShowChamadaModal(false)}>
              <div className="gg-modal" role="dialog" onClick={(e) => e.stopPropagation()}>
                <h3>Confirmar chamada</h3>
                <p>Presentes: {chamadaResumo.p} · Faltas: {chamadaResumo.f} · Trancamentos: {chamadaResumo.t}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="button" className="gg-btn-primary" disabled={loading} onClick={() => void handleSalvarChamada()}>Confirmar</button>
                  <button type="button" onClick={() => setShowChamadaModal(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'relatorios' && (
        <div className="prof-content">
          <h3 style={{ marginBottom: '1rem' }}>Relatórios por turma</h3>
          {!relatorio?.turmas?.length ? (
            <p className="prof-empty">Nenhum dado disponível.</p>
          ) : (
            <div className="prof-aluna-list">
              {relatorio.turmas.map((t, i) => (
                <div key={i} className="prof-aluna-card">
                  <span className="prof-aluna-card__nome">{t.turma_nome}</span>
                  <span className="prof-aluna-card__sub">
                    {t.alunos_total} alunas · {t.total_presentes} presenças registradas
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CADASTRAR ── */}
      {tab === 'cadastrar' && (
        <div className="prof-content">
          <div className="prof-section-header">
            <div className="prof-section-icon">
              <UserPlus width="22" height="22" />
            </div>
            <div>
              <h2>Cadastrar Nova Aluna</h2>
              <p>Preencha todos os dados obrigatórios</p>
            </div>
          </div>

          <form className="prof-form" onSubmit={handleCadastrar}>
            <InputField
              label="Nome Completo *"
              value={nome}
              onChange={setNome}
              placeholder="Nome completo da aluna"
              required
            />

            <InputField
              label="E-mail *"
              value={email}
              onChange={setEmail}
              placeholder="e-mail da aluna"
              required
            />

            <div className="prof-form__row">
              <InputField
                label="Matrícula *"
                value={matricula}
                onChange={setMatricula}
                placeholder="Ex: 2024001"
                required
              />
              <div className="input-field">
                <label className="input-field__label">Data Nasc. *</label>
                <input
                  className="input-field__control"
                  type="date"
                  value={dataNasc}
                  onChange={(e) => setDataNasc(e.target.value)}
                  required
                />
              </div>
            </div>

            <InputField
              label="Núcleo de Atuação *"
              value={nucleoId}
              onChange={setNucleoId}
              placeholder="Selecione o núcleo"
              options={nucleos.map((n) => ({ value: n.id, label: n.nome }))}
              required
            />

            <div className="prof-form__row">
              <InputField
                label="Turma *"
                value={turmaId}
                onChange={setTurmaId}
                placeholder="Turma"
                options={turmas.map((t) => ({ value: t.id, label: t.nome }))}
                required
              />
              <InputField
                label="Bairro *"
                value={bairro}
                onChange={setBairro}
                placeholder="Bairro"
                required
              />
            </div>

            <InputField
              label="Telefone da Aluna (Opcional)"
              value={telefoneAluna}
              onChange={setTelefoneAluna}
              placeholder="(00) 00000-0000"
            />

            <div className="prof-form__section">
              <h3>Dados do Responsável</h3>
            </div>

            <InputField
              label="Nome do Responsável *"
              value={nomeResp}
              onChange={setNomeResp}
              placeholder="Nome completo do responsável"
              required
            />

            <InputField
              label="Telefone do Responsável *"
              value={telefoneResp}
              onChange={setTelefoneResp}
              placeholder="(00) 00000-0000"
              required
            />

            <button className="prof-submit-btn" type="submit" disabled={loading}>
              <UserPlus width="18" height="18" />
              Cadastrar Aluna
            </button>
          </form>
        </div>
      )}

      <BottomNavigation role="professor" />
    </div>
    </AppShell>
  )
}
