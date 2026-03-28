"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { signOut, useSession } from "next-auth/react"
import { RiLoginBoxLine, RiLogoutBoxRLine, RiUser3Line } from "react-icons/ri"

import { cn } from "@/lib/utils"

import { APP_SIDEBAR_SECTIONS } from "./app-nav-items"
import { AppSidebarNavItem } from "./AppSidebarNavItem"

function initialsFromUser(name: string | null | undefined, email: string | null | undefined): string {
  const src = (name?.trim() || email?.trim() || "").split("@")[0] || ""
  const parts = src.split(/\s+/g).filter(Boolean).slice(0, 2)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (parts.length === 1 && parts[0].length === 1) {
    return parts[0].toUpperCase()
  }
  return "?"
}

export function AppSidebar({
  collapsed,
  onSidebarBackgroundClick,
  onSidebarMouseEnter,
  onSidebarMouseLeave,
}: {
  collapsed?: boolean
  onSidebarBackgroundClick?: () => void
  onSidebarMouseEnter?: () => void
  onSidebarMouseLeave?: () => void
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [accountOpen, setAccountOpen] = useState(false)
  const accountOpenEffective = !collapsed && accountOpen

  const onLogout = useCallback(async () => {
    await signOut({ callbackUrl: "/" })
  }, [])

  const displayLabel = session?.user?.name?.trim() || session?.user?.email?.split("@")[0] || "Гость"
  const initials = initialsFromUser(session?.user?.name, session?.user?.email)

  return (
    <aside
      className={cn(
        "flex h-dvh w-full shrink-0 flex-col overflow-hidden border pb-5",
        "rounded-lg shadow-[0_10px_40px_-18px_color-mix(in_oklab,var(--accent-orange)_12%,transparent)]",
      )}
      style={{
        background: "color-mix(in oklab, var(--grid-cell-bg) 98%, transparent)",
        borderColor: "var(--grid-border)",
      }}
      onMouseEnter={onSidebarMouseEnter}
      onMouseLeave={onSidebarMouseLeave}
      onClick={(e) => {
        const t = e.target as HTMLElement | null
        if (!t) return
        if (t.closest("a,button,[role='button'],input,select,textarea,label")) return
        onSidebarBackgroundClick?.()
      }}
      aria-label="Разделы приложения"
    >
      <div className="border-b p-5" style={{ borderColor: "var(--grid-border)" }}>
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/home"
            aria-label="looky — главная"
            className={cn(
              "flex min-w-0 items-center gap-1.5 text-lg font-bold tracking-tight",
              collapsed && "justify-center",
            )}
            style={{ color: "var(--grid-foreground)" }}
          >
            <span className={cn("truncate", collapsed && "sr-only")}>looky</span>
            {!collapsed ? (
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full align-super"
                style={{ background: "var(--accent-orange)" }}
              />
            ) : (
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ background: "var(--accent-orange)" }}
                aria-hidden
              />
            )}
          </Link>
        </div>
        <div
          className={cn(
            "mt-1 transition-[opacity,transform] duration-300 ease-out",
            collapsed && "pointer-events-none opacity-0",
          )}
        >
          <p className="truncate font-geist-secondary text-xs" style={{ color: "var(--grid-muted)" }}>
            Приложение
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
        {APP_SIDEBAR_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-2">
            {!collapsed && (
              <div
                className="px-3 font-geist-secondary text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "color-mix(in oklab, var(--grid-muted) 70%, transparent)" }}
              >
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((it) => (
                <AppSidebarNavItem
                  key={it.href}
                  href={it.href}
                  label={it.label}
                  collapsed={collapsed}
                  icon={<it.Icon className="h-4 w-4 shrink-0" aria-hidden />}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto px-4 pb-5">
        <div className="mx-1 h-px" style={{ background: "color-mix(in oklab, var(--grid-border) 80%, transparent)" }} aria-hidden />

        <div className="relative pt-5">
          {status === "loading" ? (
            <div
              className={cn("flex items-center rounded-md px-3 py-2.5", collapsed ? "justify-center" : "gap-3")}
              style={{ color: "var(--grid-muted)" }}
            >
              <div
                className="grid size-10 shrink-0 place-items-center rounded-full border"
                style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
              >
                <span className="text-xs">…</span>
              </div>
              {!collapsed && <span className="font-geist-secondary text-xs">Загрузка…</span>}
            </div>
          ) : session?.user ? (
            <>
              <button
                type="button"
                onClick={() => {
                  if (collapsed) return
                  setAccountOpen((v) => !v)
                }}
                className={cn(
                  "group relative flex w-full items-center rounded-md border border-transparent transition-[transform,background-color,border-color,color] duration-150 ease-out",
                  collapsed ? "justify-center px-3 py-2.5" : "gap-3 px-3 py-2.5",
                  "text-[color:var(--grid-muted)] hover:text-[color:var(--grid-foreground)]",
                  "hover:translate-x-0.5 hover:border-[color:color-mix(in_oklab,var(--grid-border)_70%,transparent)] hover:bg-[color:color-mix(in_oklab,var(--grid-cell-bg)_60%,transparent)]",
                )}
                aria-label="Меню аккаунта"
                title={collapsed ? "Аккаунт" : undefined}
              >
                <div
                  className="grid size-10 shrink-0 place-items-center rounded-full border"
                  style={{
                    borderColor: "var(--grid-border)",
                    background: "var(--grid-cell-bg)",
                  }}
                  aria-hidden
                >
                  <span className="font-geist-secondary text-[12px]" style={{ color: "color-mix(in oklab, var(--grid-foreground) 80%, transparent)" }}>
                    {initials}
                  </span>
                </div>
                {!collapsed && (
                  <div className="min-w-0 flex-1 text-left leading-tight">
                    <div className="truncate font-geist-secondary text-[12px] tracking-wide" style={{ color: "var(--grid-foreground)" }}>
                      {displayLabel}
                    </div>
                    <div className="truncate font-geist-secondary text-xs" style={{ color: "var(--grid-muted)" }}>
                      {session.user.email}
                    </div>
                  </div>
                )}
              </button>

              <AnimatePresence>
                {accountOpenEffective && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-[60px] left-1 right-1 z-50 overflow-hidden rounded-lg border shadow-lg"
                    style={{
                      borderColor: "var(--grid-border)",
                      background: "var(--grid-cell-bg)",
                      boxShadow: "0 12px 40px -22px rgba(0,0,0,0.35)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false)
                        router.push("/profile")
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 font-geist-secondary text-[11px] uppercase tracking-[0.18em] transition-colors"
                      style={{ color: "var(--grid-foreground)" }}
                    >
                      <RiUser3Line className="h-[18px] w-[18px] shrink-0" aria-hidden />
                      Профиль
                    </button>
                    <div className="h-px" style={{ background: "var(--grid-border)" }} />
                    <button
                      type="button"
                      onClick={async () => {
                        setAccountOpen(false)
                        await onLogout()
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 font-geist-secondary text-[11px] uppercase tracking-[0.18em] transition-colors"
                      style={{ color: "var(--grid-muted)" }}
                    >
                      <RiLogoutBoxRLine className="h-[18px] w-[18px] shrink-0" aria-hidden />
                      Выйти
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className={cn("space-y-2", collapsed && "flex flex-col items-center")}>
              <Link
                href="/login?callbackUrl=/home"
                className={cn(
                  "flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-medium",
                  collapsed ? "w-10 px-0" : "w-full",
                )}
                style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
              >
                {collapsed ? <RiLoginBoxLine className="h-5 w-5" aria-hidden /> : "Войти"}
              </Link>
              {!collapsed && (
                <Link
                  href="/register"
                  className="flex min-h-11 w-full items-center justify-center rounded-lg border px-3 text-sm font-medium"
                  style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
                >
                  Регистрация
                </Link>
              )}
            </div>
          )}

          {!collapsed && (
            <Link
              href="/"
              className="mt-4 block font-geist-secondary text-xs transition-opacity hover:opacity-80"
              style={{ color: "var(--grid-muted)" }}
            >
              ← На сайт
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}
