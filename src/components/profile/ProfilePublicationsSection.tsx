import { useState, type ChangeEvent } from 'react'
import { useMural } from '../../contexts/MuralContext'

interface Props {
  displayName: string
  initial: string
  accentColor: string
  accentColorEnd?: string
  onLogout?: () => void
}

export function ProfilePublicationsSection({
  displayName,
  initial,
  accentColor,
  accentColorEnd,
  onLogout,
}: Props) {
  const { posts: allPosts, addPost, toggleLike, addComment } = useMural()
  // Filtra posts pelo displayName OU pelo nome derivado da sessão (compatibilidade)
  const myPosts = allPosts.filter((p) => p.authorName === displayName)

  const [commentOpen, setCommentOpen] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostText, setNewPostText] = useState('')
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const gradientEnd = accentColorEnd ?? accentColor
  const gradient = `linear-gradient(135deg, ${accentColor}, ${gradientEnd})`

  function handleAddComment(postId: string) {
    if (!commentText.trim()) return
    addComment(postId, commentText)
    setCommentText('')
  }

  function createPost() {
    if (!newPostText.trim()) return
    addPost(newPostText, newPostImage ?? undefined, displayName)
    setNewPostText('')
    setNewPostImage(null)
    setShowNewPost(false)
  }

  function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setNewPostImage(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const activePost = commentOpen ? allPosts.find((p) => p.id === commentOpen) : null
  const activeComments = activePost?.comments ?? []

  return (
    <>
      {/* Publicações header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.25rem 0 1rem' }}>
        <div>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111', margin: 0 }}>Publicações</p>
          <p style={{ fontSize: '0.72rem', color: '#888', margin: 0 }}>{myPosts.length} posts</p>
        </div>
        <button type="button" onClick={() => setShowNewPost(true)} style={{
          background: gradient,
          color: '#fff', border: 'none', borderRadius: 20,
          padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: 600,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          + Nova Publicação
        </button>
      </div>

      {/* Posts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {myPosts.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', padding: '1.5rem 0' }}>
            Nenhuma publicação ainda. Compartilhe algo com a comunidade!
          </p>
        )}
        {myPosts.map((post) => (
          <div key={post.id} style={{
            background: '#fff', border: '1px solid #f0e0ec',
            borderRadius: '0.75rem', padding: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: gradient, color: '#fff',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
              }}>{initial}</div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: '#111' }}>{post.authorName}</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#888' }}>{post.timeAgo}</p>
              </div>
            </div>
            <p style={{ fontSize: '0.87rem', color: '#374151', margin: '0 0 0.5rem', lineHeight: 1.5 }}>{post.text}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                onClick={() => setLightboxSrc(post.imageUrl!)}
                style={{
                  width: '100%', aspectRatio: '16/9', objectFit: 'cover',
                  borderRadius: '0.65rem', display: 'block', marginBottom: '0.5rem',
                  cursor: 'zoom-in',
                }}
              />
            )}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button type="button" onClick={() => toggleLike(post.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                display: 'inline-flex', alignItems: 'center', gap: 4,
                color: post.liked ? '#ff1493' : '#888', fontSize: '0.82rem', fontWeight: 500,
              }}>
                {post.liked ? '❤️' : '🤍'} {post.likes}
              </button>
              <button type="button" onClick={() => setCommentOpen(post.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                display: 'inline-flex', alignItems: 'center', gap: 4,
                color: '#888', fontSize: '0.82rem', fontWeight: 500,
              }}>
                💬 {post.comments.length}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Logout button */}
      {onLogout && (
        <button type="button" onClick={onLogout} style={{
          width: '100%', marginTop: '1.5rem',
          padding: '0.85rem 1rem', border: '2px solid #ef4444',
          borderRadius: '9999px', background: 'transparent',
          color: '#ef4444', fontWeight: 600, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}>Sair da conta</button>
      )}

      {/* Comments Modal */}
      {commentOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: '1.25rem 1.25rem 0 0',
            width: '100%', maxWidth: 480, maxHeight: '80vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid #f0f0f0',
            }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>Comentários</span>
              <button type="button" onClick={() => setCommentOpen(null)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1.1rem', lineHeight: 1,
              }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.25rem' }}>
              {activeComments.length === 0 && (
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', padding: '1rem 0' }}>
                  Nenhum comentário ainda.
                </p>
              )}
              {activeComments.map((c) => (
                <div key={c.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: c.color,
                    color: '#fff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                  }}>{c.initial}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.2rem', fontWeight: 600, fontSize: '0.88rem', color: '#111' }}>{c.authorName}</p>
                    <p style={{ margin: '0 0 0.3rem', fontSize: '0.83rem', color: '#374151', lineHeight: 1.4 }}>{c.text}</p>
                    <span style={{ fontSize: '0.72rem', color: '#aaa' }}>{c.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              padding: '0.75rem 1.25rem 1.25rem', borderTop: '1px solid #f0f0f0',
              display: 'flex', gap: '0.5rem', alignItems: 'center',
            }}>
              <input
                type="text"
                placeholder="Escreva um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(commentOpen)}
                style={{
                  flex: 1, border: '1px solid #e5e7eb', borderRadius: 20,
                  padding: '0.6rem 1rem', fontSize: '0.85rem',
                  outline: 'none', background: '#f9fafb', fontFamily: 'inherit',
                }}
              />
              <button type="button" onClick={() => handleAddComment(commentOpen)} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff1493, #a020f0)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', flexShrink: 0, fontSize: '1rem',
              }}>→</button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: '1.25rem 1.25rem 0 0',
            width: '100%', maxWidth: 480, boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid #f0f0f0',
            }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>Nova Publicação</span>
              <button type="button" onClick={() => setShowNewPost(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1.1rem', lineHeight: 1,
              }}>✕</button>
            </div>
            <div style={{ padding: '1rem 1.25rem 1.5rem' }}>
              <textarea
                rows={4}
                placeholder="O que você quer compartilhar?"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                style={{
                  width: '100%', border: '1px solid #e5e7eb', borderRadius: '0.75rem',
                  padding: '0.75rem', fontSize: '0.9rem', resize: 'none',
                  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />

              {/* Image preview */}
              {newPostImage && (
                <div style={{ position: 'relative', marginTop: '0.75rem' }}>
                  <img
                    src={newPostImage}
                    alt="Prévia"
                    style={{
                      width: '100%', aspectRatio: '16/9', objectFit: 'cover',
                      borderRadius: '0.65rem', display: 'block',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setNewPostImage(null)}
                    aria-label="Remover foto"
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)', border: 'none',
                      color: '#fff', fontSize: '0.9rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >×</button>
                </div>
              )}

              {/* Footer: add photo + publish */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '0.55rem 0.9rem', border: `1.5px solid ${accentColor}`,
                  borderRadius: 20, color: accentColor, cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
                }}>
                  📷 {newPostImage ? 'Trocar foto' : 'Foto'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageSelect}
                  />
                </label>
                <button type="button" onClick={createPost} style={{
                  flex: 1, background: gradient, color: '#fff',
                  border: 'none', borderRadius: 20,
                  padding: '0.6rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                }}>Publicar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada"
          onClick={() => setLightboxSrc(null)}
          onKeyDown={(e) => e.key === 'Escape' && setLightboxSrc(null)}
          tabIndex={0}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            cursor: 'zoom-out',
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            aria-label="Fechar"
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.18)',
              border: 'none', borderRadius: '50%',
              width: 44, height: 44,
              color: '#fff', fontSize: '1.5rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1,
            }}
          >×</button>
          <img
            src={lightboxSrc}
            alt="Imagem em tamanho completo"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'block',
              maxWidth: '95vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
              cursor: 'default',
            }}
          />
        </div>
      )}
    </>
  )
}
