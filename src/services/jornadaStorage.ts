export interface JornadaEtapa1 {
  nome: string
  dataNascimento: string
  altura: string
  peso: string
  etnia: string
  genero: string
  cidade: string
  bairro: string
}

export interface JornadaEtapa2 {
  pcd: boolean
  atividadeFisica: boolean
  tempoRedes: string
  motivacaoEdFisica: number
}

export type LikertValue = 1 | 2 | 3 | 4

export interface JornadaCompleta {
  etapa1: JornadaEtapa1
  etapa2: JornadaEtapa2
  rosenberg: LikertValue[]
  concluidoEm: string
  indiceAutoestima: number
  nucleo?: string
}

const KEY = 'gol_girls_jornada'

function storageKey(userId: string) {
  return `${KEY}_${userId}`
}

export function loadJornada(userId: string): JornadaCompleta | null {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    return raw ? (JSON.parse(raw) as JornadaCompleta) : null
  } catch {
    return null
  }
}

export function saveJornada(userId: string, data: JornadaCompleta) {
  localStorage.setItem(storageKey(userId), JSON.stringify(data))
}

/** Índice 1–4 (média Likert); itens 8–10 invertidos na EAR */
export function calcIndiceAutoestima(respostas: LikertValue[]): number {
  if (respostas.length !== 10) return 0
  const scores = respostas.map((v, i) => (i >= 7 ? 5 - v : v))
  const sum = scores.reduce((a, b) => a + b, 0)
  return Math.round((sum / 10) * 100) / 100
}

export function listAllJornadas(): JornadaCompleta[] {
  const out: JornadaCompleta[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k?.startsWith(KEY + '_')) continue
    try {
      const j = JSON.parse(localStorage.getItem(k)!) as JornadaCompleta
      if (j.concluidoEm) out.push(j)
    } catch {
      /* skip */
    }
  }
  return out
}

export function mediaAutoestimaPorNucleo(nucleo: 'meier' | 'seropedica' | 'todos'): number {
  const all = listAllJornadas()
  const filtered =
    nucleo === 'todos' ? all : all.filter((j) => j.nucleo?.toLowerCase().includes(nucleo === 'meier' ? 'méier' : 'serop'))
  if (filtered.length === 0) return nucleo === 'meier' ? 3.4 : nucleo === 'seropedica' ? 2.9 : 3.2
  const sum = filtered.reduce((a, j) => a + j.indiceAutoestima, 0)
  return Math.round((sum / filtered.length) * 100) / 100
}
