import { useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { MuralFeed } from '../components/mural/MuralFeed'
import { MuralPageHeader } from '../components/mural/MuralPageHeader'
import { ProfileMenu } from '../components/profile/ProfileMenu'
import BottomNavigation from '../components/bottomNavigation'
import { useMural, getDisplayName } from '../contexts/MuralContext'
import { logoutToLogin, getSessionLabel } from '../services/auth'
import { EditProfileModal } from '../components/profile/EditProfileModal'
import '../styles/apphub.scss'
import '../styles/golgirls-design.scss'



function AdminProfilePage({ sessionLabel, onLogout }: { sessionLabel: string | null; onLogout?: () => void }) {
  const { posts: allPosts, addPost, toggleLike, addComment } = useMural()
  const [displayName, setDisplayName] = useState(() => getDisplayName(sessionLabel))
  const [currentEmail, setCurrentEmail] = useState(sessionLabel ?? '')
  const initial = (displayName[0] ?? 'A').toUpperCase()
  const myPosts = allPosts.filter((p) => p.authorName === displayName)

  const [editOpen, setEditOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostText, setNewPostText] = useState('')
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

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
    <div style={{ paddingBottom: '5.5rem' }}>
      {/* Hero gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #a020f0 0%, #7c3aed 100%)',
        height: 120,
        position: 'relative',
        borderRadius: '0 0 1.5rem 1.5rem',
      }}>
        {/* Avatar */}
        <div style={{
          position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a020f0, #7c3aed)',
          border: '4px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(160,32,240,0.3)',
          color: '#fff', fontWeight: 700, fontSize: '2rem',
        }}>
          {initial}
        </div>
        {/* Editar */}
        <button type="button" onClick={() => setEditOpen(true)} style={{
          position: 'absolute', top: 12, right: 16,
          background: '#fff', border: 'none', borderRadius: 20,
          padding: '0.35rem 0.85rem', color: '#ff1493',
          fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>✏️ Editar</button>
      </div>

      {/* Identity */}
      <div style={{ textAlign: 'center', marginTop: 52, padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', color: '#111' }}>{displayName}</h1>
        <p style={{ fontSize: '0.78rem', color: '#888', margin: '0 0 0.75rem' }}>ID: ADM-0001</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: '#f3f4f6', color: '#374151', borderRadius: 20, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 500 }}>
            Gestão Executiva
          </span>
          <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 20, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            🔒 Super Admin
          </span>
        </div>
      </div>

      <div style={{ padding: '1.25rem 1rem 0' }}>
        {/* Permissões de Acesso */}
        <div style={{
          background: '#fefce8', border: '1px solid #fde68a', borderRadius: '0.75rem',
          padding: '0.85rem 1rem', marginBottom: '1.25rem',
          display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '1.1rem', marginTop: 2, flexShrink: 0 }}>🛡️</span>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#d97706', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Permissões de Acesso
            </p>
            <p style={{ fontSize: '0.8rem', color: '#92400e', margin: 0 }}>
              Acesso total ao sistema com permissões de leitura, escrita, edição e exclusão em todos os módulos.
            </p>
          </div>
        </div>

        {/* Informações Administrativas */}
        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.65rem' }}>
          Informações Administrativas
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(
            [
              ['✉️', 'E-mail Corporativo', currentEmail || 'ana.paula@golgirls.org'],
              ['📱', 'Telefone', '(21) 98765-0000'],
              ['💼', 'Departamento', 'Gestão Executiva'],
              ['🔒', 'Nível de Acesso', 'Super Admin'],
              ['👥', 'Área de Gestão', 'Todos os Núcleos'],
              ['📅', 'Membro da Administração Desde', 'Janeiro 2020'],
            ] as [string, string, string][]
          ).map(([icon, label, value]) => (
            <div key={label} style={{
              background: '#f9fafb', border: '1px solid #f0f0f0',
              borderRadius: '0.75rem', padding: '0.7rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 0.1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                <p style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Publicações header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111', margin: 0 }}>Publicações</p>
            <p style={{ fontSize: '0.72rem', color: '#888', margin: 0 }}>{myPosts.length} posts</p>
          </div>
          <button type="button" onClick={() => setShowNewPost(true)} style={{
            background: 'linear-gradient(135deg, #a020f0, #7c3aed)',
            color: '#fff', border: 'none', borderRadius: 20,
            padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: 600,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            + Nova Publicação
          </button>
        </div>

        {/* Posts list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {myPosts.map((post) => (
            <div key={post.id} style={{
              background: '#fff', border: '1px solid #f0e0ec',
              borderRadius: '0.75rem', padding: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a020f0, #7c3aed)',
                  color: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                }}>{post.initial}</div>
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
                <button type="button" aria-label="Compartilhar" style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#888', fontSize: '1rem', marginLeft: 'auto', padding: 0,
                }}>↗</button>
              </div>
            </div>
          ))}
        </div>
        {onLogout && (
          <button type="button" onClick={onLogout} style={{
            width: '100%', marginTop: '1.5rem',
            padding: '0.85rem 1rem', border: '2px solid #ef4444',
            borderRadius: '9999px', background: 'transparent',
            color: '#ef4444', fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>Sair da conta</button>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <EditProfileModal
          role="admin"
          currentName={displayName}
          currentEmail={currentEmail}
          accentColor="#a020f0"
          onClose={() => setEditOpen(false)}
          onSaved={(updates) => {
            if (updates.name) setDisplayName(updates.name)
            if (updates.email) setCurrentEmail(updates.email)
          }}
        />
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
                  outline: 'none', background: '#f9fafb',
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

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '0.55rem 0.9rem', border: '1.5px solid #a020f0',
                  borderRadius: 20, color: '#a020f0', cursor: 'pointer',
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
                  flex: 1,
                  background: 'linear-gradient(135deg, #a020f0, #7c3aed)',
                  color: '#fff', border: 'none', borderRadius: 20,
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
    </div>
  )
}

type AdminTab = 'home' | 'perfil'

export const AppAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab: AdminTab = tabParam === 'perfil' ? 'perfil' : 'home'
  const sessionLabel = getSessionLabel()

  function setActiveTab(t: string) {
    const newTab = t === 'perfil' ? 'perfil' : 'home'
    if (newTab === 'home') searchParams.delete('tab')
    else searchParams.set('tab', newTab)
    setSearchParams(searchParams, { replace: true })
  }

  function handleLogout() {
    logoutToLogin('/login/admin')
  }

  return (
    <AppShell role="admin">
      <div
        className={`app-hub${tab === 'home' ? ' app-hub--mural' : ''}`}
        style={{ position: 'relative', padding: tab === 'perfil' ? 0 : undefined }}
      >
        {tab === 'home' && <ProfileMenu onLogout={handleLogout} />}
        {tab === 'home' ? (
          <>
            <MuralPageHeader title="Mural" subtitle="Novidades e conteúdo do instituto." />
            <MuralFeed role="admin" />
          </>
        ) : (
          <AdminProfilePage sessionLabel={sessionLabel} onLogout={handleLogout} />
        )}
        <BottomNavigation role="admin" activeTab={tab} onTabChange={setActiveTab} />
      </div>
    </AppShell>
  )
}
