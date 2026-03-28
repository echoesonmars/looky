"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError("Пароли не совпадают.")
      return
    }
    setPending(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Ошибка регистрации.")
        return
      }
      const signRes = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
        callbackUrl: "/home",
      })
      if (signRes?.error) {
        router.push("/login?registered=1&callbackUrl=/home")
        router.refresh()
        return
      }
      window.location.assign("/home")
    } catch {
      setError("Не удалось отправить запрос.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className="border p-6 sm:p-8"
      style={{ borderColor: "var(--grid-border)", background: "color-mix(in oklab, var(--grid-cell-bg) 95%, transparent)" }}
    >
      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: "var(--grid-foreground)" }}>
        Регистрация
      </h1>
      <p className="text-sm font-geist-secondary mb-6" style={{ color: "var(--grid-muted)" }}>
        Минимум 8 символов в пароле.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя (необязательно)</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Повтор пароля</Label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full"
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full cursor-pointer" disabled={pending}>
          {pending ? "Создание…" : "Создать аккаунт"}
        </Button>
      </form>

      <p className="mt-6 text-sm font-geist-secondary text-center" style={{ color: "var(--grid-muted)" }}>
        Уже есть аккаунт?{" "}
        <Link href="/login?callbackUrl=/home" className="font-medium underline-offset-4 hover:underline" style={{ color: "var(--accent-orange)" }}>
          Войти
        </Link>
      </p>
    </div>
  )
}
