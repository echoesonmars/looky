"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { APP_NAV_ITEMS } from "./app-nav-items"

export function AppDock() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t"
      style={{
        borderColor: "var(--grid-border)",
        background: "color-mix(in oklab, var(--grid-cell-bg) 92%, transparent)",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
      aria-label="Основная навигация"
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto pt-1">
        {APP_NAV_ITEMS.map(({ href, label, Icon }) => {
          const reallyActive =
            href === "/home" ? pathname === "/home" : pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              className="flex min-h-11 min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-geist-secondary transition-colors"
              style={{
                color: reallyActive ? "var(--accent-orange)" : "var(--grid-muted)",
              }}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
