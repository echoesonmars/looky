import Link from "next/link"
import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { RiArrowRightLine } from "react-icons/ri"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/** Карточка-ссылка (лендинг и т.п.) — с `group` для внутренних group-hover. */
const bentoShell =
  "group relative flex flex-col overflow-hidden rounded-xl border border-black/[0.06] bg-background shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-black/[0.08] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-background dark:shadow-[0_-20px_80px_-20px_#ffffff1f_inset] dark:hover:border-white/12"

/** Плитка приложения: без `group`, ховер только на самой плитке — не ломает group-hover у кнопок внутри. */
const bentoTileShell =
  "relative flex min-h-0 flex-col overflow-hidden rounded-xl border border-black/[0.06] bg-background shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-[border-color,background-color] duration-200 hover:border-black/[0.08] hover:bg-black/[0.015] dark:border-white/10 dark:bg-background dark:shadow-[0_-20px_80px_-20px_#ffffff1f_inset] dark:hover:border-white/12 dark:hover:bg-white/[0.02]"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[minmax(14rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 xl:grid-cols-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface BentoTileProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

const BentoTile = ({ children, className, ...props }: BentoTileProps) => (
  <div className={cn(bentoTileShell, className)} {...props}>
    {children}
  </div>
)

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className?: string
  background: ReactNode
  Icon: React.ElementType
  description?: string
  href: string
  cta: string
}

const bentoLinkClass =
  "inline-flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300"

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => {
  const isAppLink = href.startsWith("/") && !href.startsWith("//")
  const linkChild = isAppLink ? (
    <Link href={href} className={bentoLinkClass}>
      {cta}
      <RiArrowRightLine className="ms-2 size-4 shrink-0 rtl:rotate-180" aria-hidden />
    </Link>
  ) : (
    <a href={href} className={bentoLinkClass}>
      {cta}
      <RiArrowRightLine className="ms-2 size-4 shrink-0 rtl:rotate-180" aria-hidden />
    </a>
  )

  return (
    <div className={cn(bentoShell, "justify-between", className)} {...props}>
      <div className="min-h-0 flex-1">{background}</div>
      <div className="relative z-10 p-4 sm:p-5">
        <div className="flex transform-gpu flex-col gap-1 transition-transform duration-300 lg:group-hover:-translate-y-2">
          <Icon className="size-10 shrink-0 text-neutral-700 transition-transform duration-300 ease-out group-hover:scale-90 dark:text-neutral-300 sm:size-12" />
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 sm:text-xl">{name}</h3>
          {description ? <p className="max-w-lg text-sm text-neutral-500 dark:text-neutral-400">{description}</p> : null}
        </div>

        <div className="mt-3 flex w-full items-center lg:absolute lg:bottom-4 lg:left-4 lg:right-4 lg:mt-0 lg:translate-y-6 lg:opacity-0 lg:transition-all lg:duration-300 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <Button variant="link" asChild size="sm" className="h-auto p-0 text-neutral-600 dark:text-neutral-400">
            {linkChild}
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:bg-black/[0.015] dark:group-hover:bg-white/[0.02]" />
    </div>
  )
}

export { BentoCard, BentoGrid, BentoTile }
