import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getSessionLabel, getRole } from '../services/auth'

export interface MuralComment {
  id: string
  authorName: string
  initial: string
  color: string
  text: string
  timeAgo: string
}

export interface MuralPost {
  id: string
  authorName: string
  authorRole?: string
  authorRoleKey?: string
  initial: string
  authorAvatar?: string
  timeAgo: string
  text: string
  imageUrl?: string
  likes: number
  liked: boolean
  comments: MuralComment[]
}

interface MuralContextValue {
  posts: MuralPost[]
  addPost: (text: string, imageUrl?: string, authorName?: string) => void
  toggleLike: (postId: string) => void
  addComment: (postId: string, text: string) => void
}

const STORAGE_KEY = 'gg_mural_posts_v3'

export function getDisplayName(email: string | null): string {
  if (!email) return 'Usuário'
  const local = email.split('@')[0]
  return local.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function getInitial(name: string): string {
  return (name[0] ?? 'U').toUpperCase()
}

function getRoleColor(role: string | null): string {
  if (role === 'admin') return '#a020f0'
  if (role === 'professor') return '#ff1493'
  return '#6366f1'
}

function getRoleLabel(role: string | null): string {
  if (role === 'admin') return 'Administrador(a)'
  if (role === 'professor') return 'Professor(a)'
  return 'Aluna'
}

const MuralCtx = createContext<MuralContextValue | null>(null)

export function MuralProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<MuralPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved) as MuralPost[]
    } catch { /* ignore */ }
    return []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }, [posts])

  function addPost(text: string, imageUrl?: string, authorName?: string) {
    const email = getSessionLabel()
    const role = getRole()
    const name = authorName ?? getDisplayName(email)
    setPosts((prev) => [
      {
        id: `u${Date.now()}`,
        authorName: name,
        authorRole: getRoleLabel(role),
        authorRoleKey: role ?? 'aluno',
        initial: getInitial(name),
        timeAgo: 'Agora',
        text,
        imageUrl,
        likes: 0,
        liked: false,
        comments: [],
      },
      ...prev,
    ])
  }

  function toggleLike(postId: string) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const liked = !p.liked
        return { ...p, liked, likes: p.likes + (liked ? 1 : -1) }
      })
    )
  }

  function addComment(postId: string, text: string) {
    const email = getSessionLabel()
    const role = getRole()
    const name = getDisplayName(email)
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c${Date.now()}`,
              authorName: name,
              initial: getInitial(name),
              color: getRoleColor(role),
              text,
              timeAgo: 'Agora',
            },
          ],
        }
      })
    )
  }

  return (
    <MuralCtx.Provider value={{ posts, addPost, toggleLike, addComment }}>
      {children}
    </MuralCtx.Provider>
  )
}

export function useMural(): MuralContextValue {
  const ctx = useContext(MuralCtx)
  if (!ctx) throw new Error('useMural must be used inside MuralProvider')
  return ctx
}
