"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

import { cn } from "@/lib/utils"

export type AppSidebarNavItemProps = {
  href: string
  icon: React.ReactNode
  label: string
  collapsed?: boolean
}

function isActivePath(pathname: string, href: string) {
  if (href === "/home") return pathname === "/home"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebarNavItem({ href, icon, label, collapsed }: AppSidebarNavItemProps) {
  const pathname = usePathname() ?? "/"
  const isActive = useMemo(() => isActivePath(pathname, href), [pathname, href])

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center rounded-md border border-transparent px-3 py-2.5",
        collapsed ? "justify-center" : "gap-3",
        "text-[12px] font-geist-secondary tracking-wide transition-[transform,background-color,border-color,color] duration-150 ease-out",
        "hover:text-[color:var(--grid-foreground)]",
        !collapsed &&
          "hover:translate-x-0.5 hover:border-[color:color-mix(in_oklab,var(--grid-border)_70%,transparent)] hover:bg-[color:color-mix(in_oklab,var(--grid-cell-bg)_60%,transparent)]",
        collapsed && "hover:-translate-y-px",
        isActive &&
          "border-[color:var(--grid-border)] bg-[color:color-mix(in_oklab,var(--grid-cell-bg)_90%,transparent)] text-[color:var(--grid-foreground)] shadow-[0_10px_35px_-22px_color-mix(in_oklab,var(--accent-orange)_35%,transparent)]",
        !isActive && "text-[color:var(--grid-muted)]",
      )}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-transparent",
          isActive && "bg-[color:var(--accent-orange)]",
        )}
        aria-hidden
      />

      <span
        className={cn(
          "grid aspect-square place-items-center text-[color:var(--grid-foreground)]/80",
          collapsed
            ? "size-10 text-[color:var(--grid-foreground)]"
            : "size-8 rounded-md border border-[color:color-mix(in_oklab,var(--grid-border)_60%,transparent)] bg-[color:color-mix(in_oklab,var(--grid-cell-bg)_40%,transparent)] transition-colors duration-150",
          !collapsed && "group-hover:bg-[color:var(--grid-cell-bg)] group-hover:text-[color:var(--grid-foreground)]",
          !collapsed &&
            isActive &&
            "border-[color:var(--grid-border)] bg-[color:var(--grid-cell-bg)] text-[color:var(--grid-foreground)]",
        )}
        aria-hidden
      >
        {icon}
      </span>

      {!collapsed && <span className="flex-1 leading-none">{label}</span>}

      <span
        className={cn(
          "translate-x-1 opacity-0 transition-[opacity,transform] duration-150 ease-out",
          "group-hover:translate-x-0 group-hover:opacity-60",
          isActive && "translate-x-0 opacity-60",
        )}
        aria-hidden
      >
        {!collapsed ? "›" : null}
      </span>
    </Link>
  )
}
