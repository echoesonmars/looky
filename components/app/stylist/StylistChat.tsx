"use client"

import Image from "next/image"
import { useCallback, useRef, useState } from "react"
import { RiSendPlaneLine } from "react-icons/ri"

import { wardrobeCategoryLabel } from "@/lib/wardrobe-categories"

type Scenario = "work" | "casual" | "event" | "sport"

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: "work", label: "Работа" },
  { id: "casual", label: "Прогулка" },
  { id: "event", label: "Мероприятие" },
  { id: "sport", label: "Спорт" },
]

type OutfitItem = {
  id: string
  role: string
  title: string
  category: string
  imageUrl: string | null
  tags: string[]
}

type UserMsg = { role: "user"; content: string }
type AssistantMsg = {
  role: "assistant"
  content: string
  outfit: OutfitItem[]
  tips: string[]
  colorScore: number
  colorLabel: string
  weather: string
}
type ChatMessage = UserMsg | AssistantMsg

export function StylistChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [scenario, setScenario] = useState<Scenario | "">("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60)
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      setMessages((prev) => [...prev, { role: "user", content: trimmed }])
      setInputValue("")
      setError(null)
      setLoading(true)
      scrollBottom()

      const historyForApi = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }))

      try {
        const res = await fetch("/api/stylist/chat", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            scenario: scenario || undefined,
            history: historyForApi,
          }),
        })

        if (res.status === 401) {
          setError("Войдите, чтобы использовать стилиста.")
          setLoading(false)
          return
        }
        if (!res.ok) {
          setError("Не удалось получить ответ. Попробуйте ещё раз.")
          setLoading(false)
          return
        }

        const data = (await res.json()) as {
          message: string
          outfit: OutfitItem[]
          tips: string[]
          colorScore: number
          colorLabel: string
          weather: string
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            outfit: data.outfit ?? [],
            tips: data.tips ?? [],
            colorScore: data.colorScore ?? 0,
            colorLabel: data.colorLabel ?? "",
            weather: data.weather ?? "",
          },
        ])
        scrollBottom()
      } catch {
        setError("Ошибка сети. Проверьте подключение.")
      } finally {
        setLoading(false)
      }
    },
    [loading, messages, scenario, scrollBottom],
  )

  const triggerScenario = useCallback(
    (sc: Scenario) => {
      const next = scenario === sc ? ("" as const) : sc
      setScenario(next)
      if (next) {
        const label = SCENARIOS.find((s) => s.id === next)?.label ?? next
        void sendMessage(`Подбери образ для: ${label}`)
      }
    },
    [scenario, sendMessage],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        void sendMessage(inputValue)
      }
    },
    [inputValue, sendMessage],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map((sc) => {
          const active = scenario === sc.id
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => triggerScenario(sc.id)}
              disabled={loading}
              className="px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] border transition-colors disabled:opacity-40"
              style={{
                borderColor: active ? "var(--grid-foreground)" : "var(--grid-border)",
                background: active ? "var(--grid-foreground)" : "transparent",
                color: active ? "var(--grid-on-foreground)" : "var(--grid-muted)",
              }}
            >
              {sc.label}
            </button>
          )
        })}
      </div>
      <div
        className="flex flex-col gap-5 min-h-52 max-h-[min(60dvh,500px)] overflow-y-auto border p-4 [scrollbar-width:thin]"
        style={{ borderColor: "var(--grid-border)" }}
      >
        {messages.length === 0 && (
          <p
            className="font-geist-secondary text-sm leading-relaxed my-auto text-center"
            style={{ color: "var(--grid-muted)" }}
          >
            Выберите сценарий или напишите — стилист подберёт образ из вашего гардероба.
          </p>
        )}

        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p
                className="max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed border px-3 py-2"
                style={{
                  borderColor: "var(--grid-foreground)",
                  background: "var(--grid-foreground)",
                  color: "var(--grid-on-foreground)",
                }}
              >
                {msg.content}
              </p>
            </div>
          ) : (
            <div key={i} className="flex flex-col gap-3">
              <p
                className="font-geist-secondary text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "var(--grid-muted)" }}
              >
                looky AI
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--grid-foreground)" }}
              >
                {msg.content}
              </p>
              {msg.outfit.length > 0 && (
                <div
                  className="border p-3 flex flex-col gap-3"
                  style={{ borderColor: "var(--grid-border)" }}
                >
                  <p
                    className="font-geist-secondary text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: "var(--grid-muted)" }}
                  >
                    Образ
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                    {msg.outfit.map((item) => (
                      <div key={item.id} className="shrink-0 flex flex-col gap-1" style={{ width: 64 }}>
                        <div
                          className="w-16 h-20 border overflow-hidden flex items-center justify-center"
                          style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
                        >
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              width={64}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">—</span>
                          )}
                        </div>
                        <p
                          className="font-geist-secondary text-[9px] uppercase tracking-wide text-center leading-tight"
                          style={{ color: "var(--grid-muted)" }}
                        >
                          {wardrobeCategoryLabel(item.category)}
                        </p>
                      </div>
                    ))}
                  </div>
                  {msg.colorScore > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: "var(--grid-border)" }}>
                        <div
                          className="h-px"
                          style={{
                            width: `${msg.colorScore}%`,
                            background: msg.colorScore >= 80 ? "#22c55e" : msg.colorScore >= 65 ? "var(--accent-orange)" : "#ef4444",
                          }}
                        />
                      </div>
                      <span
                        className="font-geist-secondary text-[10px] shrink-0"
                        style={{ color: "var(--grid-muted)" }}
                      >
                        {msg.colorLabel}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {msg.tips.length > 0 && (
                <ul className="space-y-1 pl-0">
                  {msg.tips.map((tip, j) => (
                    <li
                      key={j}
                      className="font-geist-secondary text-xs flex gap-2 leading-relaxed"
                      style={{ color: "var(--grid-muted)" }}
                    >
                      <span style={{ color: "var(--accent-orange)" }}>—</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}
              {msg.weather && (
                <p className="font-geist-secondary text-[10px]" style={{ color: "var(--grid-muted)" }}>
                  {msg.weather}
                </p>
              )}
            </div>
          ),
        )}
        {loading && (
          <div className="flex flex-col gap-2">
            <p
              className="font-geist-secondary text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--grid-muted)" }}
            >
              looky AI
            </p>
            <p className="font-geist-secondary text-sm" style={{ color: "var(--grid-muted)" }}>
              <span className="inline-flex gap-1">
                <span className="animate-bounce [animation-delay:0ms]">.</span>
                <span className="animate-bounce [animation-delay:100ms]">.</span>
                <span className="animate-bounce [animation-delay:200ms]">.</span>
              </span>
            </p>
          </div>
        )}

        {error && (
          <p className="font-geist-secondary text-xs" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 border" style={{ borderColor: "var(--grid-border)" }}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Что надеть завтра на работу?"
          rows={1}
          disabled={loading}
          className="flex-1 bg-transparent text-sm outline-none resize-none px-3 py-2.5 leading-relaxed placeholder:font-geist-secondary"
          style={{ color: "var(--grid-foreground)", maxHeight: "6rem" }}
        />
        <button
          type="button"
          onClick={() => void sendMessage(inputValue)}
          disabled={loading || !inputValue.trim()}
          className="shrink-0 px-3 flex items-center justify-center transition-opacity disabled:opacity-30 border-l"
          style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
          aria-label="Отправить"
        >
          <RiSendPlaneLine className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
