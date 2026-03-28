import Link from "next/link"

import { weatherSuggestsOuterLayer } from "@/lib/home-weather-tip"

type ActionRow = { title: string; hint: string; href: string }

export function HomeActionQueue({
  wardrobeCount,
  weatherCode,
  loggedIn,
}: {
  wardrobeCount: number
  weatherCode: number | null
  loggedIn: boolean
}) {
  const rows: ActionRow[] = []

  if (loggedIn && wardrobeCount === 0) {
    rows.push({
      title: "Добавьте первую вещь",
      hint: "Без базы сложно подсказать образ",
      href: "/wardrobe/add",
    })
  }

  if (weatherSuggestsOuterLayer(weatherCode)) {
    rows.push({
      title: "Верхний слой",
      hint: "Плащ или куртка под погоду",
      href: "/wardrobe/add",
    })
  }

  rows.push(
    { title: "Примерка", hint: "Наложить вещь на фото", href: "/try-on" },
    { title: "Стилист", hint: "Вопросы по образу", href: "/stylist" },
    { title: "Лента", hint: "Свайпы и идеи", href: "/discover" },
  )

  return (
    <section className="space-y-4" aria-labelledby="home-actions-heading">
      <h2 id="home-actions-heading" className="text-xs font-geist-secondary uppercase tracking-[0.2em]" style={{ color: "var(--grid-muted)" }}>
        Очередь действий
      </h2>
      <ul
        className="grid gap-0 overflow-hidden rounded-2xl border sm:grid-cols-2"
        style={{ borderColor: "var(--grid-border)", background: "color-mix(in oklab, var(--grid-cell-bg) 94%, transparent)" }}
      >
        {rows.map((row, i) => (
          <li
            key={`${row.href}-${row.title}-${i}`}
            className="border-b last:border-b-0 sm:border-b-0 sm:[&:nth-child(odd)]:border-r"
            style={{ borderColor: "var(--grid-border)" }}
          >
            <Link
              href={row.href}
              className="flex min-h-[72px] flex-col justify-center gap-1 px-5 py-4 transition-[background-color] duration-150 sm:min-h-[80px] sm:px-6 hover:bg-[color-mix(in_oklab,var(--grid-cell-bg)_78%,transparent)]"
            >
              <span className="text-sm font-medium" style={{ color: "var(--grid-foreground)" }}>
                {row.title}
              </span>
              <span className="text-xs font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
                {row.hint}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
