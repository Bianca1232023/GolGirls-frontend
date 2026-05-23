interface MuralPageHeaderProps {
  subtitle?: string
}

export function MuralPageHeader({ subtitle }: MuralPageHeaderProps) {
  return (
    <header className="gg-mural-header">
      <h1 className="gg-mural-header__title">
        <span>Início</span>
        <span className="gg-mural-header__sep">/</span>
        <span>Mural</span>
      </h1>
      {subtitle && <p className="gg-mural-header__subtitle">{subtitle}</p>}
    </header>
  )
}
