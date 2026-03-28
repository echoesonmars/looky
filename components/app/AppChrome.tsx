"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { AppDock } from "./AppDock"
import { AppFab } from "./AppFab"
import { AppSidebar } from "./AppSidebar"

export function AppChrome({ children }: { children: React.ReactNode }) {
  const [sidebarPinnedOpen, setSidebarPinnedOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const openSidebar = () => setSidebarCollapsed(false)
  const collapseSidebar = () => setSidebarCollapsed(true)

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-screen-2xl items-start text-foreground"
      style={{ background: "var(--grid-cell-bg)", color: "var(--grid-foreground)" }}
    >
      <div className="sticky top-0 z-20 hidden h-dvh shrink-0 self-start md:block">
        <motion.div
          className="h-full overflow-hidden"
          animate={{ width: sidebarCollapsed ? 86 : 308 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <AppSidebar
            collapsed={sidebarCollapsed}
            onSidebarBackgroundClick={() => {
              if (sidebarCollapsed) {
                setSidebarPinnedOpen(true)
                openSidebar()
                return
              }
              if (sidebarPinnedOpen) {
                setSidebarPinnedOpen(false)
                collapseSidebar()
                return
              }
              setSidebarPinnedOpen(true)
              openSidebar()
            }}
            onSidebarMouseEnter={() => {
              if (sidebarCollapsed) openSidebar()
            }}
            onSidebarMouseLeave={() => {
              if (!sidebarPinnedOpen) collapseSidebar()
            }}
          />
        </motion.div>
      </div>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-5 md:max-w-none md:px-6 md:pt-6 md:pb-8 lg:max-w-7xl lg:px-8 xl:max-w-[min(100%,90rem)] xl:px-10 2xl:px-12">
          {children}
        </main>
      </div>
      <AppFab />
      <AppDock />
    </div>
  )
}
