import type { Metadata } from "next"

import { AppPageHeader } from "@/components/app/AppPageHeader"
import { ProfileAccountSection } from "@/components/app/ProfileAccountSection"
import { PwaInstallButton } from "@/components/app/PwaInstallButton"

export const metadata: Metadata = {
  title: "Профиль",
}

export default function ProfilePage() {
  return (
    <>
      <AppPageHeader
        title="Профиль"
        description="Аккаунт, уведомления о ценах и установка на телефон."
      />

      <ProfileAccountSection />

      <section className="mb-8 space-y-3">
        <h2 className="text-sm font-semibold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
          Цены
        </h2>
        <p className="text-sm font-geist-secondary leading-relaxed" style={{ color: "var(--grid-muted)" }}>
          Отслеживание снижения цен на выбранные вещи и уведомления — скоро.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
          На экран «Домой»
        </h2>
        <PwaInstallButton />
      </section>
    </>
  )
}
