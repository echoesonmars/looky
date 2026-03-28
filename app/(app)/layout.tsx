import type { Metadata } from "next"

import { AppDock } from "@/components/app/AppDock"
import { AppFab } from "@/components/app/AppFab"
import { AppSidebar } from "@/components/app/AppSidebar"

export const metadata: Metadata = {
  title: {
    template: "%s — Looky",
    default: "Приложение",
  },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh flex text-foreground"
      style={{ background: "var(--grid-cell-bg)", color: "var(--grid-foreground)" }}
    >
      <AppSidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-4 md:max-w-none md:px-8 md:pt-6 lg:max-w-6xl pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-8">
          {children}
        </main>
      </div>
      <AppFab />
      <AppDock />
    </div>
  )
}
