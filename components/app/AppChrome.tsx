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
      className="mx-auto flex min-h-dvh w-full max-w-screen-2xl text-foreground"
      style={{ background: "var(--grid-cell-bg)", color: "var(--grid-foreground)" }}
    >
      <motion.div
        className="hidden shrink-0 overflow-hidden md:block"
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

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom))] md:max-w-none md:px-8 md:pt-6 md:pb-8 lg:max-w-6xl">
          {children}
        </main>
      </div>
      <AppFab />
      <AppDock />
    </div>
  )
}
