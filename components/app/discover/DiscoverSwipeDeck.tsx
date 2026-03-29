"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from "motion/react"
import { RiCloseLine, RiHeartLine } from "react-icons/ri"

export type DiscoverCard = {
  id: string
  title: string
  imageUrl: string | null
  category: string
  tags: string[]
}

const SWIPE_THRESHOLD = 80

function buildExcludeParam(queue: DiscoverCard[], popped: ReadonlySet<string>): string {
  const ids = new Set<string>()
  for (const c of queue) ids.add(c.id)
  for (const id of popped) ids.add(id)
  return [...ids].join(",")
}

async function fetchBatch(excludeQueue: DiscoverCard[], popped: ReadonlySet<string>): Promise<DiscoverCard[]> {
  const exclude = buildExcludeParam(excludeQueue, popped)
  const qs = exclude.length > 0 ? `?exclude=${encodeURIComponent(exclude)}` : ""
  const res = await fetch(`/api/discover/batch${qs}`, { credentials: "include" })
  if (res.status === 401) {
    throw new Error("unauthorized")
  }
  if (!res.ok) {
    throw new Error("batch_failed")
  }
  const data = (await res.json()) as { items: DiscoverCard[] }
  return data.items ?? []
}

function postSwipe(catalogItemId: string, liked: boolean) {
  void fetch("/api/discover/swipe", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ catalogItemId, liked }),
  }).catch(() => {
    /* optimistic path; errors logged in devtools */
  })
}

function CardChrome({
  card,
  likeOpacity,
  nopeOpacity,
}: {
  card: DiscoverCard
  likeOpacity: ReturnType<typeof useTransform<number, number>>
  nopeOpacity: ReturnType<typeof useTransform<number, number>>
}) {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute left-4 top-4 z-10 -rotate-12 border-2 px-3 py-1 text-xs font-bold uppercase tracking-widest sm:left-5 sm:top-5 sm:text-sm"
        style={{ opacity: likeOpacity, borderColor: "#22c55e", color: "#22c55e" }}
      >
        LIKE
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-4 top-4 z-10 rotate-12 border-2 px-3 py-1 text-xs font-bold uppercase tracking-widest sm:right-5 sm:top-5 sm:text-sm"
        style={{ opacity: nopeOpacity, borderColor: "#ef4444", color: "#ef4444" }}
      >
        NOPE
      </motion.div>

      <div className="relative h-full min-h-[48dvh] w-full overflow-hidden sm:min-h-[52dvh]">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, min(720px, 90vw)"
            priority
            draggable={false}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-sm font-geist-secondary"
            style={{ background: "var(--grid-border)", color: "var(--grid-muted)" }}
          >
            нет фото
          </div>
        )}
        <div
          className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/35 to-transparent px-4 pb-5 pt-16"
          style={{ color: "#fafafa" }}
        >
          <p className="text-lg font-semibold leading-tight sm:text-xl">{card.title}</p>
          <p className="mt-1 font-geist-secondary text-sm opacity-90">{card.category}</p>
          {card.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.tags.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="border px-2 py-0.5 text-[10px] uppercase tracking-wide"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.9)" }}
                >
                  {t.replace(/^[^:]+:/, "")}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export function DiscoverSwipeDeck() {
  const [queue, setQueue] = useState<DiscoverCard[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [lastDir, setLastDir] = useState<"left" | "right" | null>(null)
  const [swipedCount, setSwipedCount] = useState(0)
  const poppedIdsRef = useRef(new Set<string>())
  const prefetchingRef = useRef(false)
  const swipeLockRef = useRef(false)

  const mergeIntoQueue = useCallback((incoming: DiscoverCard[]) => {
    setQueue((prev) => {
      const have = new Set(prev.map((c) => c.id))
      const next = [...prev]
      for (const c of incoming) {
        if (!have.has(c.id)) {
          have.add(c.id)
          next.push(c)
        }
      }
      return next
    })
  }, [])

  const runPrefetch = useCallback(
    async (currentQueue: DiscoverCard[]) => {
      if (prefetchingRef.current) return
      prefetchingRef.current = true
      try {
        const items = await fetchBatch(currentQueue, poppedIdsRef.current)
        mergeIntoQueue(items)
      } catch {
        /* silent; user can refresh */
      } finally {
        prefetchingRef.current = false
      }
    },
    [mergeIntoQueue],
  )

  const loadInitial = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const items = await fetchBatch([], poppedIdsRef.current)
      setQueue(items)
    } catch (e) {
      setLoadError(e instanceof Error && e.message === "unauthorized" ? "unauthorized" : "error")
      setQueue([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadInitial()
  }, [loadInitial])

  const maybePrefetch = useCallback(
    (lenAfterPop: number, snapshotQueue: DiscoverCard[]) => {
      if (lenAfterPop === 3) {
        void runPrefetch(snapshotQueue)
      }
    },
    [runPrefetch],
  )

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      setQueue((prev) => {
        if (prev.length === 0 || swipeLockRef.current) return prev
        swipeLockRef.current = true
        const top = prev[prev.length - 1]
        poppedIdsRef.current.add(top.id)
        postSwipe(top.id, dir === "right")
        setLastDir(dir)
        setSwipedCount((n) => n + 1)
        window.setTimeout(() => {
          setQueue((current) => {
            swipeLockRef.current = false
            if (current.length === 0) return current
            const sliced = current.slice(0, -1)
            maybePrefetch(sliced.length, sliced)
            return sliced
          })
        }, 20)
        return prev
      })
    },
    [maybePrefetch],
  )

  const topCard = queue[queue.length - 1]

  if (loading) {
    return (
      <div
        className="flex min-h-[min(72dvh,calc(100dvh-10rem))] items-center justify-center rounded-xl border font-geist-secondary text-sm"
        style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
      >
        Загрузка ленты…
      </div>
    )
  }

  if (loadError === "unauthorized") {
    return (
      <div
        className="flex min-h-[min(50dvh,24rem)] flex-col items-center justify-center gap-4 rounded-xl border p-6 text-center"
        style={{ borderColor: "var(--grid-border)" }}
      >
        <p className="font-geist-secondary text-sm" style={{ color: "var(--grid-muted)" }}>
          Нужна авторизация.
        </p>
        <Link
          href="/login"
          className="rounded-md px-4 py-2 text-sm font-medium"
          style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
        >
          Войти
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <div
        className="relative mx-auto w-full max-w-md flex-1 min-h-[min(72dvh,calc(100dvh-11rem))]"
        style={{ touchAction: "pan-y" }}
      >
        {queue.length > 1
          ? queue.slice(0, -1).map((card, i) => {
              const depth = queue.length - 1 - i
              return (
                <div
                  key={card.id}
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl border"
                  style={{
                    borderColor: "var(--grid-border)",
                    background: "var(--grid-cell-bg)",
                    transform: `translateY(${depth * 6}px) scale(${1 - depth * 0.03})`,
                    zIndex: i,
                    opacity: 0.55 + depth * 0.12,
                  }}
                />
              )
            })
          : null}

        <AnimatePresence mode="popLayout">
          {queue.length > 0 && topCard ? (
            <SwipeableTopCard
              key={topCard.id}
              card={topCard}
              stackSize={queue.length}
              lastDir={lastDir}
              onSwipe={handleSwipe}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-6"
              style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
            >
              <p className="text-center font-geist-secondary text-sm" style={{ color: "var(--grid-muted)" }}>
                {loadError ? "Не удалось загрузить ленту." : "Пока нечего показывать. Загляните позже или обновите."}
              </p>
              <button
                type="button"
                onClick={() => void loadInitial()}
                className="rounded-md px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
              >
                Обновить
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {queue.length > 0 ? (
        <div className="flex flex-col items-center gap-3 pb-1">
          <p className="text-xs font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
            перетащите карточку или нажмите кнопку
            {swipedCount > 0 ? (
              <span className="ml-2 opacity-60">· {swipedCount} свайпнуто</span>
            ) : null}
          </p>
          <div className="flex items-center gap-6">
            <motion.button
              type="button"
              aria-label="Нет"
              onClick={() => handleSwipe("left")}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 sm:h-16 sm:w-16"
              style={{ borderColor: "#ef4444", color: "#ef4444" }}
            >
              <RiCloseLine className="h-7 w-7" />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Нравится"
              onClick={() => handleSwipe("right")}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16"
              style={{ background: "var(--accent-orange)", color: "#fff" }}
            >
              <RiHeartLine className="h-7 w-7" />
            </motion.button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SwipeableTopCard({
  card,
  stackSize,
  lastDir,
  onSwipe,
}: {
  card: DiscoverCard
  stackSize: number
  lastDir: "left" | "right" | null
  onSwipe: (dir: "left" | "right") => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-14, 14])
  const likeOpacity = useTransform(x, [12, SWIPE_THRESHOLD], [0, 1])
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, -12], [1, 0])

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-xl border shadow-lg"
      style={{
        x,
        rotate,
        zIndex: stackSize + 10,
        borderColor: "var(--grid-border)",
        background: "var(--grid-cell-bg)",
        touchAction: "none",
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={(_: PointerEvent, info: PanInfo) => {
        if (info.offset.x > SWIPE_THRESHOLD) onSwipe("right")
        else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("left")
      }}
      exit={{
        x: lastDir === "right" ? 420 : lastDir === "left" ? -420 : 0,
        rotate: lastDir === "right" ? 12 : lastDir === "left" ? -12 : 0,
        opacity: 0,
        transition: { duration: 0.32, ease: "easeIn" },
      }}
      whileDrag={{ scale: 1.02 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      initial={{ scale: 0.94, opacity: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <CardChrome card={card} likeOpacity={likeOpacity} nopeOpacity={nopeOpacity} />
    </motion.div>
  )
}
