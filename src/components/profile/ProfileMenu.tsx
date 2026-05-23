import { MoreVertical, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface ProfileMenuProps {
  onLogout: () => void
}

export function ProfileMenu({ onLogout }: ProfileMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="profile-menu" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
      <button
        type="button"
        className="profile-menu__trigger"
        aria-label="Menu do perfil"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical size={22} />
      </button>
      {open && (
        <div className="profile-menu__dropdown">
          <button type="button" className="profile-menu__logout" onClick={onLogout}>
            <LogOut size={16} /> Sair da Conta
          </button>
        </div>
      )}
    </div>
  )
}
