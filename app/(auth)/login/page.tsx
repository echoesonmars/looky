"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"
  const registered = searchParams.get("registered") === "1"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setPending(true)
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    })
    setPending(false)
    if (res?.error) {
      setError("Неверная почта или пароль.")
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div
      className="border p-6 sm:p-8"
      style={{ borderColor: "var(--grid-border)", background: "color-mix(in oklab, var(--grid-cell-bg) 95%, transparent)" }}
    >
      <h1 className="text-2xl font-bold tracking-tight mb-6" style={{ color: "var(--grid-foreground)" }}>
        Вход
      </h1>

      {registered && (
        <p className="text-sm font-geist-secondary mb-4" style={{ color: "var(--accent-orange)" }}>
          Аккаунт создан. Теперь войдите.
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Почта</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full cursor-pointer" disabled={pending}>
          {pending ? "Вход…" : "Войти"}
        </Button>
      </form>

      <p className="mt-6 text-sm font-geist-secondary text-center" style={{ color: "var(--grid-muted)" }}>
        Нет аккаунта?{" "}
        <Link href="/register" className="font-medium underline-offset-4 hover:underline" style={{ color: "var(--accent-orange)" }}>
          Регистрация
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>Загрузка…</div>}>
      <LoginForm />
    </Suspense>
  )
}
