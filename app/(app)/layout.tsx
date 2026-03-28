import type { Metadata } from "next"

import { AppChrome } from "@/components/app/AppChrome"

export const metadata: Metadata = {
  title: {
    template: "%s — Looky",
    default: "Приложение",
  },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppChrome>{children}</AppChrome>
}
