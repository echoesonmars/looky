import type { Metadata } from "next"

import { AppPageHeader } from "@/components/app/AppPageHeader"
import { StylistChat } from "@/components/app/stylist/StylistChat"

export const metadata: Metadata = {
  title: "Стилист",
}

export default function StylistPage() {
  return (
    <>
      <AppPageHeader
        title="Стилист"
        description="AI подберёт образ из вашего гардероба с учётом погоды и сценария."
      />
      <StylistChat />
    </>
  )
}
