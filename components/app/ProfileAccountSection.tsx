"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export function ProfileAccountSection() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <section className="mb-8 space-y-3">
        <h2 className="text-sm font-semibold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
          Аккаунт
        </h2>
        <p className="text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
          Загрузка…
        </p>
      </section>
    )
  }

  if (session?.user) {
    return (
      <section className="mb-8 space-y-3">
        <h2 className="text-sm font-semibold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
          Аккаунт
        </h2>
        <p className="text-sm font-geist-secondary truncate" style={{ color: "var(--grid-muted)" }}>
          {session.user.email ?? session.user.name}
        </p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium"
          style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
        >
          Выйти
        </button>
      </section>
    )
  }

  return (
    <section className="mb-8 space-y-3">
      <h2 className="text-sm font-semibold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
        Вход
      </h2>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/login?callbackUrl=/home"
          className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-medium"
          style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
        >
          Войти
        </Link>
        <Link
          href="/register"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium"
          style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
        >
          Регистрация
        </Link>
      </div>
    </section>
  )
}
