import type { Metadata } from "next"
import Link from "next/link"
import { DotPattern } from "@/components/ui/dot-pattern"

export const metadata: Metadata = {
  title: "Аккаунт — Looky",
  description: "Вход и регистрация Looky",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen w-full border-x border-b max-w-6xl mx-auto overflow-hidden"
      style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
    >
      <DotPattern
        width={24}
        height={24}
        glow={false}
        className="opacity-20"
        style={{ color: "var(--grid-border)" }}
      />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="mb-8 text-sm font-geist-secondary transition-colors hover:text-(--grid-foreground)"
          style={{ color: "var(--grid-muted)" }}
        >
          ← на главную
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
