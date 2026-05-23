import { useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { MuralPost } from '../../data/mockData'
import { MURAL_HIGHLIGHTS } from '../../data/mockData'

interface MuralFeedProps {
  initialPosts: MuralPost[]
}

export function MuralFeed({ initialPosts }: MuralFeedProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [commentOpen, setCommentOpen] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')

  function toggleLike(id: string) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const liked = !p.liked
        return { ...p, liked, likes: p.likes + (liked ? 1 : -1) }
      }),
    )
  }

  function addComment(id: string) {
    if (!commentText.trim()) return
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, comments: p.comments + 1 } : p)),
    )
    setCommentText('')
    setCommentOpen(null)
  }

  return (
    <motion.div
      className="gg-mural"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <section className="gg-mural-highlights" aria-label="Destaques da semana">
        <h2 className="gg-mural-highlights__heading">Destaques da Semana</h2>
        <motion.div className="gg-mural-highlights__list">
          {MURAL_HIGHLIGHTS.map((h) => (
            <article key={h.id} className="gg-mural-highlight">
              <span className="gg-mural-highlight__dot" aria-hidden />
              <div>
                <strong className="gg-mural-highlight__title">{h.title}</strong>
                <p className="gg-mural-highlight__subtitle">{h.subtitle}</p>
              </div>
            </article>
          ))}
        </motion.div>
      </section>

      <section className="gg-mural-feed" aria-label="Publicações do mural">
        {posts.map((post) => (
          <motion.article
            key={post.id}
            className="gg-mural-post"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <header className="gg-mural-post__header">
              <img src={post.authorAvatar} alt="" className="gg-mural-post__avatar" />
              <div>
                <strong className="gg-mural-post__author">{post.authorName}</strong>
                <span className="gg-mural-post__time">{post.timeAgo}</span>
              </div>
            </header>

            <p className="gg-mural-post__text">{post.text}</p>

            <img src={post.imageUrl} alt="" className="gg-mural-post__image" loading="lazy" />

            <div className="gg-mural-post__actions">
              <button
                type="button"
                className={`gg-mural-post__action${post.liked ? ' gg-mural-post__action--liked' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
                {post.likes}
              </button>
              <button
                type="button"
                className="gg-mural-post__action"
                onClick={() => setCommentOpen(commentOpen === post.id ? null : post.id)}
              >
                <MessageCircle size={18} />
                {post.comments}
              </button>
            </div>

            {commentOpen === post.id && (
              <div className="gg-mural-post__comment">
                <input
                  className="gg-mural-post__comment-input"
                  placeholder="Escreva um comentário..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                />
                <button type="button" className="gg-btn-primary gg-mural-post__comment-btn" onClick={() => addComment(post.id)}>
                  Enviar
                </button>
              </div>
            )}
          </motion.article>
        ))}
      </section>
    </motion.div>
  )
}
