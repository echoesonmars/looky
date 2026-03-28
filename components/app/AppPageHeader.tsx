export function AppPageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-sm font-geist-secondary leading-relaxed" style={{ color: "var(--grid-muted)" }}>
          {description}
        </p>
      ) : null}
    </header>
  )
}
