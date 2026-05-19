import type { ReactNode } from 'react'
import './styles.scss'
import ClipboardList from '../icons/clipboard-list'
import UserSearch from '../icons/user-search'
import UserPlus from '../icons/user-plus'
import BarChart3 from '../icons/bar-chart-3'

type Role = 'professor' | 'admin';

export interface Chip {
  key: string
  label: string
  count?: number
  icon?: ReactNode
}

interface FilterChipsProps {
  role: Role
  chips?: Chip[]
  active: string
  onChange: (key: string) => void
}

const PROFESSOR_CHIPS: Chip[] = [
  { key: 'chamada',   label: 'Chamada',   icon: <ClipboardList width="14" height="14" /> },
  { key: 'buscar',    label: 'Buscar',    icon: <UserSearch    width="14" height="14" /> },
  { key: 'cadastrar', label: 'Cadastrar', icon: <UserPlus      width="14" height="14" /> },
  { key: 'relatorios',label: 'Relatórios',icon: <BarChart3     width="14" height="14" /> },
]

const FilterChips = ({ role, chips, active, onChange }: FilterChipsProps) => {
  const items = role === 'professor' ? PROFESSOR_CHIPS : (chips ?? [])

  return (
    <div className="filter-chips">
      {items.map((chip) => (
        <button
          key={chip.key}
          className={`filter-chips__chip${active === chip.key ? ' filter-chips__chip--active' : ''}`}
          onClick={() => onChange(chip.key)}
          type="button"
        >
          {chip.icon && <span className="filter-chips__icon">{chip.icon}</span>}
          <span>{chip.label}</span>
          {chip.count !== undefined && (
            <span className="filter-chips__count">{chip.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

export default FilterChips
