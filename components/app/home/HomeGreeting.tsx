"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

function greetingPhrase(hour: number): string {
  if (hour >= 5 && hour < 12) return "Доброе утро"
  if (hour >= 12 && hour < 17) return "Добрый день"
  if (hour >= 17 && hour < 23) return "Добрый вечер"
  return "Доброй ночи"
}

function firstNameFromSession(name: string | null | undefined, email: string | null | undefined): string | null {
  const n = name?.trim()
  if (n) return n.split(/\s+/)[0] ?? n
  const e = email?.trim()
  if (e) return e.split("@")[0] ?? null
  return null
}

export function HomeGreeting() {
  const { data: session, status } = useSession()
  const [hour, setHour] = useState(12)
  useEffect(() => {
    setHour(new Date().getHours())
  }, [])
  const phrase = greetingPhrase(hour)

  if (status === "loading") {
    return (
      <div className="mb-2">
        <div className="h-9 w-48 max-w-full animate-pulse rounded-md opacity-40" style={{ background: "var(--grid-border)" }} aria-hidden />
        <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded-md opacity-30" style={{ background: "var(--grid-border)" }} aria-hidden />
      </div>
    )
  }

  const first = firstNameFromSession(session?.user?.name, session?.user?.email)

  if (!session?.user) {
    return (
      <header className="mb-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl" style={{ color: "var(--grid-foreground)" }}>
          {phrase}
        </h1>
        <p className="mt-3 max-w-xl text-sm font-geist-secondary leading-relaxed sm:text-base" style={{ color: "var(--grid-muted)" }}>
          Войдите, чтобы персонализировать главную и вести гардероб.{" "}
          <Link href="/login?callbackUrl=/home" className="underline-offset-4 hover:underline" style={{ color: "var(--accent-orange)" }}>
            Вход
          </Link>
        </p>
      </header>
    )
  }

  return (
    <header className="mb-1">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl" style={{ color: "var(--grid-foreground)" }}>
        {phrase}
        {first ? (
          <>
            ,{" "}
            <span style={{ color: "color-mix(in oklab, var(--accent-orange) 85%, var(--grid-foreground))" }}>{first}</span>
          </>
        ) : null}
      </h1>
      <p className="mt-3 max-w-xl text-sm font-geist-secondary leading-relaxed sm:text-base" style={{ color: "var(--grid-muted)" }}>
        Контекст дня и гардероб — в одном спокойном экране.
      </p>
    </header>
  )
}
