import Link from "next/link"
import { RiAddLine, RiShirtLine } from "react-icons/ri"

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
    <div className="relative z-10 flex h-full min-h-0 flex-col p-6 sm:p-7 lg:p-8">
      <div className="mb-5 flex items-center gap-4">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl border sm:size-16"
          style={{ borderColor: "var(--grid-border)", background: "color-mix(in oklab, var(--grid-cell-bg) 92%, var(--accent-orange))" }}
        >
          <RiShirtLine className="size-8 sm:size-9" style={{ color: "var(--accent-orange)" }} aria-hidden />
        </div>
        <span className="text-lg font-semibold sm:text-xl lg:text-2xl" style={{ color: "var(--grid-foreground)" }}>
          Гардероб
        </span>
      </div>

      {!loggedIn ? (
        <p className="text-base font-geist-secondary leading-relaxed sm:text-lg" style={{ color: "var(--grid-muted)" }}>
          Войдите, чтобы вести список вещей.
        </p>
      ) : loadError ? (
        <p className="text-base font-geist-secondary sm:text-lg" style={{ color: "var(--grid-foreground)" }}>
          {loadError}
        </p>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-5">
            <div>
              <p className="text-4xl font-bold tabular-nums tracking-tight sm:text-5xl lg:text-6xl" style={{ color: "var(--grid-foreground)" }}>
                {count}
                <span className="ms-1.5 text-lg font-normal font-geist-secondary sm:text-xl" style={{ color: "var(--grid-muted)" }}>
                  {count === 1 ? "вещь" : count >= 2 && count <= 4 ? "вещи" : "вещей"}
                </span>
              </p>
              <p className="mt-2 text-sm font-geist-secondary sm:text-base" style={{ color: "var(--grid-muted)" }}>
                {lastAddedAt ? formatRelativeRuPast(lastAddedAt) : "Добавьте первую вещь"}
              </p>
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-[10px] font-geist-secondary uppercase tracking-[0.14em]" style={{ color: "var(--grid-muted)" }}>
                <span>Заполнение</span>
                <span>{cap}+</span>
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
          </div>
          <div className="mt-4 flex w-full justify-start">
            <Link
              href="/wardrobe/add"
              className="group/add inline-flex min-h-12 w-full max-w-[14rem] items-center justify-center gap-2.5 rounded-full px-6 text-base font-medium transition-[filter,transform,box-shadow] hover:brightness-110 hover:shadow-[0_4px_14px_color-mix(in_oklab,var(--accent-orange)_35%,transparent)] active:scale-[0.98] sm:w-auto sm:max-w-none"
              style={{
                background: "var(--accent-orange)",
                color: "#fff",
              }}
            >
              <RiAddLine className="size-5 shrink-0 transition-transform duration-200 group-hover/add:rotate-90" aria-hidden />
              Добавить
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
