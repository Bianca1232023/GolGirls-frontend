interface MuralPageHeaderProps {
  title?: string
  subtitle?: string
}

export function MuralPageHeader({ title, subtitle }: MuralPageHeaderProps) {
  return (
    <header className="gg-mural-header">
      <h1 className="gg-mural-header__title">
        {title ? (
          <span>{title}</span>
        ) : (
          <>
            <span>Início</span>
            <span className="gg-mural-header__sep">/</span>
            <span>Mural</span>
          </>
        )}
      </h1>
      {subtitle && <p className="gg-mural-header__subtitle">{subtitle}</p>}
    </header>
  )
}
