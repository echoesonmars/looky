import { RiShirtLine } from "react-icons/ri"

type Variant = "thumb" | "hero"

const sizeThumb = "size-[4.5rem] sm:size-20"
const sizeHero = "aspect-[3/4] w-full max-w-sm"

export function WardrobeItemImage({
  imageUrl,
  title,
  variant,
  priority,
  className = "",
}: {
  imageUrl: string | null
  title: string
  variant: Variant
  priority?: boolean
  className?: string
}) {
  const box = `${variant === "thumb" ? sizeThumb : sizeHero} shrink-0 overflow-hidden rounded-xl border ${className}`
  const borderStyle = { borderColor: "var(--grid-border)" } as const

  if (imageUrl) {
    return (
      <div className={`relative ${box}`} style={borderStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center ${box}`}
      style={{ ...borderStyle, background: "color-mix(in oklab, var(--grid-border) 12%, var(--grid-cell-bg))" }}
      aria-hidden
    >
      <RiShirtLine className={variant === "thumb" ? "size-7 opacity-35" : "size-16 opacity-25"} style={{ color: "var(--grid-muted)" }} />
    </div>
  )
}
