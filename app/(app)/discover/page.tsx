import type { Metadata } from "next"
import Link from "next/link"

import { DiscoverSwipeDeck } from "@/components/app/discover/DiscoverSwipeDeck"
import { auth } from "@/auth"

export const metadata: Metadata = {
  title: "Лента",
}

export default async function DiscoverPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-[min(60dvh,28rem)] flex-col items-center justify-center gap-5 px-2 text-center">
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
          Лента
        </h1>
        <p className="max-w-sm font-geist-secondary text-sm leading-relaxed" style={{ color: "var(--grid-muted)" }}>
          Войдите, чтобы свайпать вещи и собирать гардероб из подборки.
        </p>
        <Link
          href="/login"
          className="rounded-md px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
        >
          Войти
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <h1 className="text-lg font-semibold tracking-tight md:text-xl" style={{ color: "var(--grid-foreground)" }}>
        Лента
      </h1>
      <DiscoverSwipeDeck />
    </div>
  )
}
