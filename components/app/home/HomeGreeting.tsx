"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { RiLoginCircleLine } from "react-icons/ri"

import { cn } from "@/lib/utils"

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
      <div className="mb-2 flex flex-col gap-4">
        <div className="h-10 w-32 max-w-full animate-pulse rounded-lg opacity-40" style={{ background: "var(--grid-border)" }} aria-hidden />
        <div className="h-9 w-56 max-w-full animate-pulse rounded-md opacity-40" style={{ background: "var(--grid-border)" }} aria-hidden />
      </div>
    )
  }

  const first = firstNameFromSession(session?.user?.name, session?.user?.email)

  const logo = (
    <Link
      href="/home"
      aria-label="looky — главная"
      className={cn(
        "inline-flex w-fit items-center gap-2 font-bold tracking-tight transition-opacity hover:opacity-85",
        "text-3xl sm:text-4xl lg:text-[2.75rem]",
      )}
      style={{ color: "var(--grid-foreground)" }}
    >
      <span>looky</span>
      <span className="inline-block size-2.5 shrink-0 rounded-full sm:size-3" style={{ background: "var(--accent-orange)" }} aria-hidden />
    </Link>
  )

  if (!session?.user) {
    return (
      <header className="mb-2 flex flex-col gap-4 sm:gap-5">
        {logo}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl" style={{ color: "var(--grid-foreground)" }}>
            {phrase}
          </h1>
          <Link
            href="/login?callbackUrl=/home"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-[background-color,opacity] hover:opacity-90 sm:text-base"
            style={{ borderColor: "var(--grid-border)", color: "var(--accent-orange)" }}
          >
            <RiLoginCircleLine className="size-5 shrink-0" aria-hidden />
            Вход
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className="mb-2 flex flex-col gap-4 sm:gap-5">
      {logo}
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl" style={{ color: "var(--grid-foreground)" }}>
        {phrase}
        {first ? (
          <>
            ,{" "}
            <span style={{ color: "color-mix(in oklab, var(--accent-orange) 85%, var(--grid-foreground))" }}>{first}</span>
          </>
        ) : null}
      </h1>
    </header>
  )
}
