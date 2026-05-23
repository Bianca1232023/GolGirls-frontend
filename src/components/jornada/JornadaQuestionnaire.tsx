import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import {
  ROSENBERG_ITEMS,
  ETNIAS,
  GENEROS,
  BAIRROS,
  TEMPOS_REDES,
  LIKERT_LABELS,
} from '../../data/mockData'
import {
  calcIndiceAutoestima,
  loadJornada,
  saveJornada,
  type JornadaCompleta,
  type LikertValue,
} from '../../services/jornadaStorage'

interface JornadaQuestionnaireProps {
  userId: string
  defaultNome?: string
  defaultBairro?: string
  nucleo?: string
  onComplete?: () => void
}

const emptyEtapa1 = (nome = '', bairro = '') => ({
  nome,
  dataNascimento: '',
  altura: '',
  peso: '',
  etnia: '',
  genero: '',
  cidade: 'Rio de Janeiro',
  bairro,
})

export function JornadaQuestionnaire({
  userId,
  defaultNome = '',
  defaultBairro = '',
  nucleo,
  onComplete,
}: JornadaQuestionnaireProps) {
  const existing = loadJornada(userId)
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState<JornadaCompleta | null>(
    existing?.concluidoEm ? existing : null,
  )

  const [e1, setE1] = useState(existing?.etapa1 ?? emptyEtapa1(defaultNome, defaultBairro))
  const [e2, setE2] = useState(
    existing?.etapa2 ?? {
      pcd: false,
      atividadeFisica: false,
      tempoRedes: '',
      motivacaoEdFisica: 3,
    },
  )
  const [rosenberg, setRosenberg] = useState<(LikertValue | 0)[]>(
    existing?.rosenberg ?? Array(10).fill(0),
  )
  const [showValidation, setShowValidation] = useState(false)

  const bairroOptions = [
    ...BAIRROS,
    ...(defaultBairro && !BAIRROS.includes(defaultBairro) ? [defaultBairro] : []),
  ]

  const progress = ((step + 1) / 3) * 100

  function setLikert(index: number, value: LikertValue) {
    setRosenberg((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function getMissingFields(): string[] {
    if (step === 0) {
      const missing: string[] = []
      if (!e1.nome.trim()) missing.push('nome')
      if (!e1.dataNascimento) missing.push('data de nascimento')
      if (!e1.etnia) missing.push('etnia / raça')
      if (!e1.genero) missing.push('identidade de gênero')
      if (!e1.bairro) missing.push('bairro')
      return missing
    }
    if (step === 1) {
      const missing: string[] = []
      if (!e2.tempoRedes) missing.push('tempo em redes sociais')
      return missing
    }
    const unanswered = rosenberg.filter((v) => v < 1 || v > 4).length
    if (unanswered > 0) {
      return [`${unanswered} pergunta(s) da escala de autoestima`]
    }
    return []
  }

  function canAdvance(): boolean {
    return getMissingFields().length === 0
  }

  function handleNext() {
    if (!canAdvance()) {
      setShowValidation(true)
      return
    }
    setShowValidation(false)
    setStep((s) => s + 1)
  }

  function handleFinish() {
    const answers = rosenberg as LikertValue[]
    const indice = calcIndiceAutoestima(answers)
    const data: JornadaCompleta = {
      etapa1: e1,
      etapa2: e2,
      rosenberg: answers,
      concluidoEm: new Date().toISOString(),
      indiceAutoestima: indice,
      nucleo: nucleo ?? e1.bairro,
    }
    saveJornada(userId, data)
    setCompleted(data)
    onComplete?.()
  }

  if (completed) {
    return (
      <div className="gg-jornada-summary gg-card">
        <Sparkles className="text-[#ff1493] mb-2" size={28} />
        <h3 className="text-lg font-bold m-0">Jornada concluída</h3>
        <p className="text-sm text-gray-600">
          Seu índice de autoestima (EAR): <strong className="text-[#ff1493]">{completed.indiceAutoestima}</strong> / 4
        </p>
        <p className="text-xs text-gray-500">
          Dados sensíveis — visíveis apenas para a coordenação (Renata) em relatórios agregados.
        </p>
        <button
          type="button"
          className="gg-btn-primary mt-3"
          onClick={() => {
            setCompleted(null)
            setStep(0)
          }}
        >
          Revisar respostas
        </button>
      </div>
    )
  }

  return (
    <div className="gg-jornada">
      <div className="gg-jornada-progress">
        <div className="gg-jornada-progress__bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-center text-gray-500 mb-1">Etapa {step + 1} de 3</p>
      <p className="text-xs text-center text-gray-500 mb-3">
        {step === 0 && 'Dados pessoais'}
        {step === 1 && 'Hábitos e saúde'}
        {step === 2 && 'Escala de autoestima (EAR)'}
      </p>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="s1"
            className="gg-jornada-step"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
          >
            <h3 className="gg-jornada-title">Quem sou eu</h3>
            <label className={`gg-field${showValidation && !e1.nome.trim() ? ' gg-field--error' : ''}`}>
              Nome *
              <input value={e1.nome} onChange={(ev) => setE1({ ...e1, nome: ev.target.value })} />
            </label>
            <label className={`gg-field${showValidation && !e1.dataNascimento ? ' gg-field--error' : ''}`}>
              Data de nascimento *
              <input type="date" value={e1.dataNascimento} onChange={(ev) => setE1({ ...e1, dataNascimento: ev.target.value })} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="gg-field">
                Altura (cm)
                <input value={e1.altura} onChange={(ev) => setE1({ ...e1, altura: ev.target.value })} placeholder="150" />
              </label>
              <label className="gg-field">
                Peso (kg)
                <input value={e1.peso} onChange={(ev) => setE1({ ...e1, peso: ev.target.value })} placeholder="45" />
              </label>
            </div>
            <label className={`gg-field${showValidation && !e1.etnia ? ' gg-field--error' : ''}`}>
              Etnia / Raça *
              <select value={e1.etnia} onChange={(ev) => setE1({ ...e1, etnia: ev.target.value })}>
                <option value="">Selecione</option>
                {ETNIAS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className={`gg-field${showValidation && !e1.genero ? ' gg-field--error' : ''}`}>
              Identidade de gênero *
              <select value={e1.genero} onChange={(ev) => setE1({ ...e1, genero: ev.target.value })}>
                <option value="">Selecione</option>
                {GENEROS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className={`gg-field${showValidation && !e1.bairro ? ' gg-field--error' : ''}`}>
              Bairro *
              <select value={e1.bairro} onChange={(ev) => setE1({ ...e1, bairro: ev.target.value })}>
                <option value="">Selecione</option>
                {bairroOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="s2"
            className="gg-jornada-step"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
          >
            <h3 className="gg-jornada-title">Meus hábitos e saúde</h3>
            <label className="gg-check">
              <input type="checkbox" checked={e2.pcd} onChange={(ev) => setE2({ ...e2, pcd: ev.target.checked })} />
              Pessoa com deficiência (PCD)
            </label>
            <label className="gg-check">
              <input
                type="checkbox"
                checked={e2.atividadeFisica}
                onChange={(ev) => setE2({ ...e2, atividadeFisica: ev.target.checked })}
              />
              Pratico atividade física fora da escola
            </label>
            <label className={`gg-field${showValidation && !e2.tempoRedes ? ' gg-field--error' : ''}`}>
              Tempo em redes sociais *
              <select value={e2.tempoRedes} onChange={(ev) => setE2({ ...e2, tempoRedes: ev.target.value })}>
                <option value="">Selecione</option>
                {TEMPOS_REDES.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
            <p className="text-sm font-medium mb-2">Motivação nas aulas de Educação Física</p>
            <div className="flex gap-1 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`gg-star-btn ${e2.motivacaoEdFisica >= n ? 'active' : ''}`}
                  onClick={() => setE2({ ...e2, motivacaoEdFisica: n })}
                  aria-label={`${n} estrelas`}
                >
                  ★
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s3"
            className="gg-jornada-step"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
          >
            <h3 className="gg-jornada-title">Escala de autoestima (EAR)</h3>
            {ROSENBERG_ITEMS.map((frase, i) => (
              <div key={i} className="gg-ear-item">
                <p className="text-sm mb-2">{frase}</p>
                <div className="flex flex-wrap gap-1">
                  {([1, 2, 3, 4] as LikertValue[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`gg-likert-btn ${rosenberg[i] === v ? 'active' : ''}`}
                      onClick={() => setLikert(i, v)}
                      title={LIKERT_LABELS[v]}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {showValidation && !canAdvance() && (
        <p className="gg-jornada-hint" role="alert">
          Preencha: {getMissingFields().join(', ')}.
        </p>
      )}

      <div className="flex gap-2 mt-4">
        {step > 0 && (
          <button
            type="button"
            className="gg-btn-outline flex-1"
            onClick={() => {
              setShowValidation(false)
              setStep((s) => s - 1)
            }}
          >
            <ChevronLeft size={18} aria-hidden />
            <span>Voltar</span>
          </button>
        )}
        {step < 2 ? (
          <button type="button" className="gg-btn-primary flex-1" onClick={handleNext}>
            <span>Próximo</span>
            <ChevronRight size={18} aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            className="gg-btn-primary flex-1"
            onClick={() => {
              if (!canAdvance()) {
                setShowValidation(true)
                return
              }
              setShowValidation(false)
              handleFinish()
            }}
          >
            Concluir jornada
          </button>
        )}
      </div>
    </div>
  )
}
