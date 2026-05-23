/** Dados fictícios (Figma Make) — complementam a API */

export type NucleoFilter = 'todos' | 'meier' | 'seropedica'
export type ChamadaStatus = 'P' | 'F' | 'T' | null

export const NUCLEOS = [
  { id: 'meier' as const, label: 'Méier' },
  { id: 'seropedica' as const, label: 'Seropédica' },
]

export interface MuralPost {
  id: string
  authorName: string
  authorAvatar: string
  timeAgo: string
  text: string
  imageUrl: string
  likes: number
  comments: number
  liked?: boolean
}

export const MURAL_HIGHLIGHTS = [
  { id: 'h1', title: 'Campeonato interno', subtitle: 'Turma Méier — destaque da semana' },
  { id: 'h2', title: 'Oficina NEABI', subtitle: 'Letramento tecnológico' },
]

export const MURAL_POSTS: MuralPost[] = [
  {
    id: 'p1',
    authorName: 'Julia Santos',
    authorAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e168dce?w=80&h=80&fit=crop',
    timeAgo: '2h',
    text: 'Hoje treinamos finalização e aprendi muito sobre trabalho em equipe!',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=240&fit=crop',
    likes: 24,
    comments: 5,
  },
  {
    id: 'p2',
    authorName: 'Beatriz Oliveira',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    timeAgo: '5h',
    text: 'Oficina de letramento digital no NEABI — Maria da Graça.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=240&fit=crop',
    likes: 18,
    comments: 3,
  },
]

/** Faltas consecutivas simuladas para alerta de evasão (id da aluna) */
export const MOCK_FALTAS_CONSECUTIVAS: Record<number, number> = {
  3: 4,
}

export const ADMIN_KPI = {
  totalAlunas: 60,
  taxaFrequencia: 87,
  alertasEvasao: 8,
}

export const CHART_MENSAL = [
  { mes: 'Jan', pct: 72 },
  { mes: 'Fev', pct: 78 },
  { mes: 'Mar', pct: 81 },
  { mes: 'Abr', pct: 85 },
  { mes: 'Mai', pct: 87 },
]

export const TIMELINE_LEGADO = [
  { year: '2018', title: 'Fundação do Instituto', desc: 'Início do empoderamento de meninas negras periféricas.' },
  { year: '2022', title: 'Expansão Méier', desc: 'Núcleo Méier com foco em futebol e formação.' },
  { year: '2024', title: 'Seropédica', desc: 'Novo núcleo e parcerias com escolas locais.' },
  { year: '2026', title: 'Digitalização NEABI', desc: 'Maria da Graça — 60 alunas em fase de digitalização.' },
]

export const DEPOIMENTOS = [
  { id: 'd1', author: 'Ana, 12 anos', quote: 'O Gol Girls me mostrou que posso sonhar grande.', role: 'Menina do Projeto' },
  { id: 'd2', author: 'Patrocinadora XYZ', quote: 'Investir nessas meninas é investir no futuro da cidade.', role: 'Patrocinador' },
]

export const GALERIA_CONQUISTAS = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba7a38?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
]

export const ETNIAS = ['Preta', 'Parda', 'Branca', 'Indígena', 'Amarela', 'Prefiro não informar']
export const GENEROS = ['Menina cis', 'Menina trans', 'Não-binárie', 'Outro', 'Prefiro não informar']
export const BAIRROS = ['Méier', 'Seropédica', 'Maria da Graça', 'Penha', 'Madureira', 'Outro']
export const TEMPOS_REDES = ['Menos de 1h/dia', '1–2h/dia', '3–4h/dia', 'Mais de 4h/dia']

export const LIKERT_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Discordo totalmente',
  2: 'Discordo',
  3: 'Concordo',
  4: 'Concordo totalmente',
}

/** Fallback quando não há respostas no localStorage */
export const AUTOESTIMA_FALLBACK = {
  todos: 3.2,
  meier: 3.4,
  seropedica: 2.9,
} as const

export const ROSENBERG_ITEMS = [
  'Eu sinto que sou uma pessoa de valor, pelo menos igual às outras pessoas.',
  'Eu acho que eu tenho várias boas qualidades.',
  'Levo uma atitude positiva em relação a mim mesma.',
  'Eu sou capaz de fazer as coisas tão bem quanto a maioria das pessoas.',
  'Eu sinto orgulho de mim mesma.',
  'Eu tenho uma atitude positiva com relação a mim mesma.',
  'No geral, estou satisfeita comigo mesma.',
  'Eu gostaria de ter mais respeito por mim mesma.',
  'Às vezes eu me sinto inútil.',
  'Às vezes eu acho que não presto para nada.',
]
