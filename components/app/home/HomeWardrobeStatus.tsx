import Link from "next/link"

import { formatRelativeRuPast } from "@/lib/format-relative-ru"

export function HomeWardrobeStatus({
  count,
  lastAddedAt,
  loggedIn,
  loadError,
}: {
  count: number
  lastAddedAt: Date | null
  loggedIn: boolean
  loadError?: string | null
}) {
  const cap = 12
  const pct = Math.min(100, Math.round((count / cap) * 100))

  return (
    <section className="space-y-4" aria-labelledby="home-wardrobe-status-heading">
      <h2 id="home-wardrobe-status-heading" className="text-xs font-geist-secondary uppercase tracking-[0.2em]" style={{ color: "var(--grid-muted)" }}>
        Статус гардероба
      </h2>
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          borderColor: "var(--grid-border)",
          background: "color-mix(in oklab, var(--grid-cell-bg) 94%, transparent)",
        }}
      >
        {!loggedIn ? (
          <p className="text-sm font-geist-secondary leading-relaxed" style={{ color: "var(--grid-muted)" }}>
            После входа здесь появится счётчик вещей и напоминания.
          </p>
        ) : loadError ? (
          <p className="text-sm font-geist-secondary leading-relaxed" style={{ color: "var(--grid-foreground)" }}>
            {loadError}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-bold tabular-nums tracking-tight sm:text-4xl" style={{ color: "var(--grid-foreground)" }}>
                  {count}
                  <span className="text-base font-normal font-geist-secondary sm:text-lg" style={{ color: "var(--grid-muted)" }}>
                    {" "}
                    {count === 1 ? "вещь" : count >= 2 && count <= 4 ? "вещи" : "вещей"}
                  </span>
                </p>
                <p className="mt-2 text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
                  {lastAddedAt ? <>Последнее добавление — {formatRelativeRuPast(lastAddedAt)}</> : <>Ещё не добавляли — начните с одной базовой вещи.</>}
                </p>
              </div>
              <Link
                href="/wardrobe/add"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  border: "1px solid var(--grid-border)",
                  color: "var(--grid-foreground)",
                  background: "transparent",
                }}
              >
                Добавить вещь
              </Link>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-[10px] font-geist-secondary uppercase tracking-[0.16em]" style={{ color: "var(--grid-muted)" }}>
                <span>Наполнение</span>
                <span>до {cap}+</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "color-mix(in oklab, var(--grid-border) 50%, transparent)" }}>
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: "var(--accent-orange)",
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
