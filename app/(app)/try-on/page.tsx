import type { Metadata } from "next"
import Link from "next/link"

import { AppPageHeader } from "@/components/app/AppPageHeader"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Примерка",
}

export default function TryOnPage() {
  return (
    <>
      <AppPageHeader
        title="Примерка"
        description="Наложение выбранной вещи на ваше фото — тяжёлый шаг, появится позже."
      />
      <Button asChild variant="outline" className="min-h-11 border" style={{ borderColor: "var(--grid-border)" }}>
        <Link href="/home">← На главную приложения</Link>
      </Button>
    </>
  )
}
