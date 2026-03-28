import type { Metadata } from "next"

import { AppPageHeader } from "@/components/app/AppPageHeader"

export const metadata: Metadata = {
  title: "Гардероб",
}

export default function WardrobePage() {
  return (
    <>
      <AppPageHeader
        title="Гардероб"
        description="Здесь появятся ваши вещи, теги и учёт носки (стоимость одного выхода)."
      />
      <div
        className="rounded-xl border border-dashed p-10 text-center text-sm font-geist-secondary"
        style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
      >
        Пока пусто. Нажмите «+», чтобы добавить первую вещь.
      </div>
    </>
  )
}
