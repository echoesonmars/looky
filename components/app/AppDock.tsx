"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { RiCloseLine, RiMoreLine } from "react-icons/ri"

import { cn } from "@/lib/utils"

import { APP_DOCK_MORE, APP_DOCK_PRIMARY } from "./app-nav-items"

function isActivePath(pathname: string, href: string) {
  if (href === "/home") return pathname === "/home"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppDock() {
  const pathname = usePathname() ?? "/"
  const [open, setOpen] = useState(false)

  const moreActive = useMemo(
    () => APP_DOCK_MORE.some((it) => isActivePath(pathname, it.href)),
    [pathname],
  )

  return (
    <>
      <div
        className={cn("fixed inset-x-0 bottom-0 z-40 px-4 md:hidden")}
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div
          className={cn(
            "mx-auto max-w-lg rounded-full border backdrop-blur-md",
            "shadow-[0_12px_40px_-22px_color-mix(in_oklab,var(--accent-orange)_20%,transparent)]",
          )}
          style={{
            borderColor: "var(--grid-border)",
            background: "color-mix(in oklab, var(--grid-cell-bg) 85%, transparent)",
          }}
        >
          <div className="grid grid-cols-5 items-center">
            {APP_DOCK_PRIMARY.map((it) => {
              const active = isActivePath(pathname, it.href)
              const Icon = it.Icon
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-150",
                    active ? "text-[color:var(--accent-orange)]" : "text-[color:var(--grid-muted)] hover:text-[color:var(--grid-foreground)]",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-150 ease-out",
                      active
                        ? "border-[color:var(--grid-border)] bg-[color:var(--grid-cell-bg)]"
                        : "border-[color:color-mix(in_oklab,var(--grid-border)_70%,transparent)] bg-[color:color-mix(in_oklab,var(--grid-cell-bg)_60%,transparent)] hover:-translate-y-px hover:bg-[color:var(--grid-cell-bg)]",
                    )}
                    aria-hidden
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                  </span>
                  <span className="font-geist-secondary text-[9px] uppercase leading-none tracking-[0.18em]">{it.label}</span>
                </Link>
              )
            })}

            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-150",
                moreActive ? "text-[color:var(--accent-orange)]" : "text-[color:var(--grid-muted)] hover:text-[color:var(--grid-foreground)]",
              )}
              aria-label="Открыть меню"
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-150 ease-out",
                  moreActive
                    ? "border-[color:var(--grid-border)] bg-[color:var(--grid-cell-bg)]"
                    : "border-[color:color-mix(in_oklab,var(--grid-border)_70%,transparent)] bg-[color:color-mix(in_oklab,var(--grid-cell-bg)_60%,transparent)] hover:-translate-y-px hover:bg-[color:var(--grid-cell-bg)]",
                )}
                aria-hidden
              >
                <RiMoreLine className="h-[18px] w-[18px] shrink-0" />
              </span>
              <span className="font-geist-secondary text-[9px] uppercase leading-none tracking-[0.18em]">Ещё</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0"
              style={{ background: "color-mix(in oklab, var(--grid-foreground) 30%, transparent)" }}
              onClick={() => setOpen(false)}
              aria-label="Закрыть меню"
            />

            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t px-5 pt-5 shadow-lg"
              style={{
                background: "var(--grid-cell-bg)",
                borderColor: "var(--grid-border)",
                boxShadow: "0 -14px 50px -30px rgba(0,0,0,0.45)",
                paddingBottom: "max(18px, env(safe-area-inset-bottom))",
              }}
              initial={{ y: 18, opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: 18, opacity: 0, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div
                  className="font-geist-secondary text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: "var(--grid-foreground)" }}
                >
                  Меню
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full border transition-[transform,background-color,color] duration-150 ease-out",
                    "hover:-translate-y-px",
                  )}
                  style={{
                    borderColor: "var(--grid-border)",
                    background: "color-mix(in oklab, var(--grid-cell-bg) 60%, transparent)",
                    color: "var(--grid-muted)",
                  }}
                  aria-label="Закрыть"
                >
                  <RiCloseLine className="h-[18px] w-[18px] shrink-0" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {APP_DOCK_MORE.map((it) => {
                  const Icon = it.Icon
                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-4 transition-[transform,background-color] duration-150 ease-out",
                        "hover:-translate-y-px",
                      )}
                      style={{
                        borderColor: "var(--grid-border)",
                        background: "color-mix(in oklab, var(--grid-cell-bg) 70%, transparent)",
                        color: "var(--grid-foreground)",
                      }}
                    >
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-lg border"
                        style={{
                          borderColor: "var(--grid-border)",
                          background: "var(--grid-cell-bg)",
                        }}
                        aria-hidden
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                      </span>
                      <span className="font-geist-secondary text-[10px] uppercase leading-tight tracking-[0.18em]">{it.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
