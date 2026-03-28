import type { Metadata } from "next"

import { AppPageHeader } from "@/components/app/AppPageHeader"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Стилист",
}

export default function StylistPage() {
  return (
    <>
      <AppPageHeader
        title="Стилист"
        description="Диалог с подсказками по образу и контексту (погода, событие) — в разработке."
      />
      <div
        className="mb-6 min-h-48 rounded-xl border border-dashed flex items-center justify-center text-sm font-geist-secondary"
        style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
      >
        Окно чата появится здесь.
      </div>
      <Button type="button" disabled className="min-h-11" variant="outline" style={{ borderColor: "var(--grid-border)" }}>
        Подобрать образ до суммы — скоро
      </Button>
    </>
  )
}
