import { useState } from 'react'
import { useMural } from '../../contexts/MuralContext'

interface MuralFeedProps {
  role?: 'aluno' | 'professor' | 'admin'
  onJornadaClick?: () => void
}

const DESTAQUES = [
  { id: 'd1', color: 'linear-gradient(135deg, #3b82f6, #6366f1)', title: 'Torneio Regional', subtitle: 'Inscrições abertas!' },
  { id: 'd2', color: 'linear-gradient(135deg, #7c3aed, #a020f0)', title: 'Bolsa Atleta', subtitle: 'Documentos necessários' },
  { id: 'd3', color: 'linear-gradient(135deg, #f97316, #ef4444)', title: 'Destaque da Semana', subtitle: 'Maria (Seropédica)' },
]

export function MuralFeed({ role = 'aluno', onJornadaClick }: MuralFeedProps) {
  const { posts, toggleLike, addComment } = useMural()
  const [commentOpen, setCommentOpen] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')

  function handleAddComment(postId: string) {
    if (!commentText.trim()) return
    addComment(postId, commentText)
    setCommentText('')
  }

  return (
    <div className="gg-mural">
      {/* Jornada card — aluno only */}
      {role === 'aluno' && (
        <button
          type="button"
          className="gg-jornada-card"
          onClick={onJornadaClick}
          aria-label="Acessar Jornada de Autoconhecimento"
        >
          <span className="gg-jornada-card__badge">NOVA ETAPA</span>
          <span className="gg-jornada-card__icon" aria-hidden="true">✨</span>
          <h3 className="gg-jornada-card__title">Jornada de Autoconhecimento</h3>
          <p className="gg-jornada-card__subtitle">Responda ao questionário de saúde psicossocial (EAR).</p>
          <span className="gg-jornada-card__link">Começar agora →</span>
        </button>
      )}

      {/* Destaques da semana */}
      <section>
        <h2 className="gg-mural-highlights__heading">Destaques da Semana</h2>
        <div className="gg-destaques-list">
          {DESTAQUES.map((d) => (
            <div key={d.id} className="gg-destaque-card" style={{ background: d.color }}>
              <span className="gg-destaque-card__icon" aria-hidden="true">⭐</span>
              <div>
                <strong className="gg-destaque-card__title">{d.title}</strong>
                <p className="gg-destaque-card__subtitle">{d.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Publicações recentes */}
      <section>
        <h2 className="gg-mural-highlights__heading">Publicações Recentes</h2>
        <div className="gg-mural-feed">
          {posts.map((post) => (
            <article key={post.id} className="gg-mural-post">
              <header className="gg-mural-post__header">
                {post.authorAvatar ? (
                  <img src={post.authorAvatar} alt="" className="gg-mural-post__avatar" />
                ) : (
                  <div className="gg-mural-post__avatar-initial">{post.initial}</div>
                )}
                <div>
                  <strong className="gg-mural-post__author">{post.authorName}</strong>
                  {post.authorRole && (
                    <span className="gg-mural-post__role">{post.authorRole}</span>
                  )}
                  <span className="gg-mural-post__time">{post.timeAgo}</span>
                </div>
              </header>

              <p className="gg-mural-post__text">{post.text}</p>

              {post.imageUrl && (
                <img src={post.imageUrl} alt="" className="gg-mural-post__image" loading="lazy" />
              )}

              <div className="gg-mural-post__actions">
                <button
                  type="button"
                  className={`gg-mural-post__action${post.liked ? ' gg-mural-post__action--liked' : ''}`}
                  onClick={() => toggleLike(post.id)}
                >
                  {post.liked ? '❤️' : '🤍'} {post.likes}
                </button>
                <button
                  type="button"
                  className="gg-mural-post__action"
                  onClick={() => setCommentOpen(commentOpen === post.id ? null : post.id)}
                >
                  💬 {post.comments.length}
                </button>
                <button
                  type="button"
                  className="gg-mural-post__action"
                  style={{ marginLeft: 'auto' }}
                  aria-label="Compartilhar"
                >↗</button>
              </div>

              {/* Inline comments */}
              {commentOpen === post.id && (
                <div className="gg-mural-post__comments">
                  {post.comments.map((c) => (
                    <div key={c.id} className="gg-mural-post__comment-item">
                      <div
                        className="gg-mural-post__comment-avatar"
                        style={{ background: c.color }}
                      >{c.initial}</div>
                      <div style={{ flex: 1 }}>
                        <p className="gg-mural-post__comment-name">{c.authorName}</p>
                        <p className="gg-mural-post__comment-text">{c.text}</p>
                        <span className="gg-mural-post__comment-time">{c.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                  <div className="gg-mural-post__comment-input-row">
                    <input
                      type="text"
                      className="gg-mural-post__comment-input"
                      placeholder="Escreva um comentário..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    />
                    <button
                      type="button"
                      className="gg-mural-post__comment-send"
                      onClick={() => handleAddComment(post.id)}
                    >→</button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

