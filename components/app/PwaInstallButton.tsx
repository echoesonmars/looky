"use client"

import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PwaInstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onAppInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener("appinstalled", onAppInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onAppInstalled)
    }
  }, [])

  const onClick = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }, [deferred])

  if (installed) {
    return (
      <p className="text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
        Установлено на устройство.
      </p>
    )
  }

  if (!deferred) {
    return (
      <p className="text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
        Установка доступна из меню браузера «На экран Домой» или появится кнопка, когда браузер предложит приложение.
      </p>
    )
  }

  return (
    <Button type="button" onClick={onClick} className="min-h-11" style={{ background: "var(--accent-orange)", color: "#fff" }}>
      Установить приложение
    </Button>
  )
}
