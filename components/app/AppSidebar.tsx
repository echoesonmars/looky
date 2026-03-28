"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { APP_NAV_ITEMS } from "./app-nav-items"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex w-56 shrink-0 flex-col border-r sticky top-0 h-dvh"
      style={{
        borderColor: "var(--grid-border)",
        background: "color-mix(in oklab, var(--grid-cell-bg) 96%, transparent)",
      }}
      aria-label="Разделы приложения"
    >
      <div className="p-4 border-b" style={{ borderColor: "var(--grid-border)" }}>
        <Link href="/home" className="text-lg font-bold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
          looky
          <span
            className="inline-block w-1.5 h-1.5 rounded-full ml-0.5 align-super"
            style={{ background: "var(--accent-orange)" }}
          />
        </Link>
      </div>
      <nav className="flex flex-col gap-0.5 p-2">
        {APP_NAV_ITEMS.map(({ href, label, Icon }) => {
          const reallyActive =
            href === "/home" ? pathname === "/home" : pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 min-h-11 text-sm font-geist-secondary transition-colors"
              style={{
                background: reallyActive ? "color-mix(in oklab, var(--accent-orange) 12%, transparent)" : "transparent",
                color: reallyActive ? "var(--accent-orange)" : "var(--grid-muted)",
              }}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto p-3 border-t" style={{ borderColor: "var(--grid-border)" }}>
        <Link
          href="/"
          className="text-xs font-geist-secondary hover:underline"
          style={{ color: "var(--grid-muted)" }}
        >
          ← На сайт
        </Link>
      </div>
    </aside>
  )
}
