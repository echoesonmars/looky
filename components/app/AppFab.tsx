"use client"

import Link from "next/link"
import { RiAddLine } from "react-icons/ri"

export function AppFab() {
  return (
    <Link
      href="/wardrobe/add"
      className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] md:bottom-6 md:right-6"
      style={{
        background: "var(--accent-orange)",
        color: "#fff",
      }}
      aria-label="Добавить вещь"
    >
      <RiAddLine className="h-7 w-7" aria-hidden />
    </Link>
  )
}
