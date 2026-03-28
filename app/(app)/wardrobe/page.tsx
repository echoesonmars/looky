import type { Metadata } from "next"
import Link from "next/link"

import { auth } from "@/auth"
import { AppPageHeader } from "@/components/app/AppPageHeader"
import { formatRelativeRuPast } from "@/lib/format-relative-ru"
import type { WardrobeItemRow } from "@/lib/wardrobe-queries"
import { listWardrobeItems } from "@/lib/wardrobe-queries"
import { wardrobeCategoryLabel } from "@/lib/wardrobe-categories"

export const metadata: Metadata = {
  title: "Гардероб",
}

export default async function WardrobePage() {
  const session = await auth()
  const list = session?.user?.id
    ? await listWardrobeItems(session.user.id)
    : { items: [] as WardrobeItemRow[], loadError: null as string | null }
  const items = list.items
  const loadError = list.loadError

  return (
    <>
      <AppPageHeader
        title="Гардероб"
        description="Ваши вещи и скоро — теги и учёт носки."
      />
      {!session?.user ? (
        <p className="mb-6 text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
          <Link href="/login?callbackUrl=/wardrobe" className="underline-offset-4 hover:underline" style={{ color: "var(--accent-orange)" }}>
            Войдите
          </Link>
          , чтобы видеть гардероб.
        </p>
      ) : null}
      {session?.user && loadError ? (
        <div
          className="mb-6 rounded-xl border p-5 text-sm font-geist-secondary leading-relaxed"
          style={{
            borderColor: "color-mix(in oklab, var(--accent-orange) 35%, var(--grid-border))",
            background: "color-mix(in oklab, var(--accent-orange) 8%, var(--grid-cell-bg))",
            color: "var(--grid-foreground)",
          }}
        >
          {loadError}
        </div>
      ) : null}
      {session?.user && !loadError && items.length === 0 ? (
        <div
          className="rounded-xl border border-dashed p-10 text-center text-sm font-geist-secondary"
          style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
        >
          Пока пусто. Нажмите «+», чтобы добавить первую вещь.
        </div>
      ) : null}
      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((it) => (
            <li key={it.id}>
              <Link
                href={`/wardrobe/${it.id}`}
                className="flex flex-col gap-1 rounded-xl border p-4 transition-opacity hover:opacity-90 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderColor: "var(--grid-border)", background: "color-mix(in oklab, var(--grid-cell-bg) 92%, transparent)" }}
              >
                <div>
                  <span className="font-medium" style={{ color: "var(--grid-foreground)" }}>
                    {it.title}
                  </span>
                  <span className="mt-0.5 block text-xs font-geist-secondary sm:mt-0 sm:ml-2 sm:inline" style={{ color: "var(--grid-muted)" }}>
                    {wardrobeCategoryLabel(it.category)}
                  </span>
                </div>
                <span className="text-xs font-geist-secondary shrink-0" style={{ color: "var(--grid-muted)" }}>
                  {formatRelativeRuPast(it.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
