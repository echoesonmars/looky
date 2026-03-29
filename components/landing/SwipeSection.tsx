"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  PanInfo,
} from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { RiHeartLine, RiCloseLine, RiBrainLine, RiDatabase2Line } from "react-icons/ri";

const CARDS = [
  { id: 1, emoji: "🧥", name: "оверсайз худи", tag: "casual", accentColor: "#fb5607" },
  { id: 2, emoji: "👗", name: "льняное платье", tag: "summer", accentColor: "#ffbe0b" },
  { id: 3, emoji: "🧣", name: "шерстяной шарф", tag: "winter", accentColor: "#6b21ef" },
  { id: 4, emoji: "👖", name: "винтажные джинсы", tag: "denim", accentColor: "#3b82f6" },
];

const SWIPE_THRESHOLD = 80;

function SwipeCard({
  card,
  zIndex,
}: {
  card: (typeof CARDS)[0];
  zIndex: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [10, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, -10], [1, 0]);

  return (
    <motion.div className="absolute inset-0" style={{ x, rotate, zIndex, touchAction: "none" }}>
      <div
        className="h-full w-full border"
        style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
      >
      <motion.div
        className="absolute top-5 left-5 z-10 px-3 py-1 border-2 text-sm font-bold rotate-[-15deg]"
        style={{ opacity: likeOpacity, borderColor: "#22c55e", color: "#22c55e" }}
      >
        like ❤️
      </motion.div>

      <motion.div
        className="absolute top-5 right-5 z-10 px-3 py-1 border-2 text-sm font-bold rotate-15"
        style={{ opacity: nopeOpacity, borderColor: "#ef4444", color: "#ef4444" }}
      >
        nope ✕
      </motion.div>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-8">
        <div
          className="w-20 h-20 flex items-center justify-center text-4xl border"
          style={{ borderColor: "var(--grid-border)" }}
        >
          {card.emoji}
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg mb-1.5" style={{ color: "var(--grid-foreground)" }}>
            {card.name}
          </p>
          <span
            className="text-xs px-2 py-0.5 font-geist-secondary border"
            style={{ borderColor: card.accentColor, color: card.accentColor }}
          >
            {card.tag}
          </span>
        </div>
      </div>
      </div>
    </motion.div>
  );
}

export function SwipeSection() {
  const [stack, setStack] = useState([...CARDS]);
  const [lastDir, setLastDir] = useState<"left" | "right" | null>(null);
  const [gone, setGone] = useState<number[]>([]);

  function handleSwipe(dir: "left" | "right") {
    setLastDir(dir);
    if (stack.length === 0) return;
    const top = stack[stack.length - 1];
    setGone((prev) => [...prev, top.id]);
    setTimeout(() => setStack((prev) => prev.slice(0, -1)), 20);
  }

  function reset() {
    setStack([...CARDS]);
    setGone([]);
    setLastDir(null);
  }

  const topCard = stack[stack.length - 1];

  return (
    <section
      id="swipe"
      className="w-full max-w-6xl mx-auto border-x border-b"
      style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
    >
      <div className="border-b grid grid-cols-[auto_1fr]" style={{ borderColor: "var(--grid-border)" }}>
        <div
          className="px-6 sm:px-8 py-4 border-r text-[11px] tracking-widest uppercase font-geist-secondary"
          style={{ borderColor: "var(--grid-border)", color: "var(--accent-orange)" }}
        >
          03 / дата-сетинг
        </div>
        <div className="px-6 sm:px-8 py-4">
          <BlurFade delay={0} inView>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
              тиндер, но для ткани.
            </h2>
          </BlurFade>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--grid-border)" }}>
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col gap-8 bg-(--grid-cell-bg)">
          <BlurFade delay={0.1} inView>
            <p className="text-lg sm:text-xl leading-[1.35] font-geist-secondary max-w-xl" style={{ color: "var(--grid-muted)" }}>
              никаких долгих анкет. свайп вправо. свайп влево. вы обучаете
              алгоритм своими рефлексами.
            </p>
          </BlurFade>

          <div className="flex flex-col gap-5">
            {[
              { icon: RiBrainLine, label: "нейросеть рефлексов", desc: "строит векторы предпочтений из микрореакций" },
              { icon: RiDatabase2Line, label: "чистый датасет", desc: "система отсекает визуальный мусор мгновенно" },
            ].map((f, i) => (
              <BlurFade key={f.label} delay={0.2 + i * 0.1} inView>
                <div className="flex gap-4 items-start">
                  <div
                    className="w-11 h-11 border flex items-center justify-center shrink-0"
                    style={{ borderColor: "var(--grid-border)" }}
                  >
                    <f.icon className="w-5 h-5" style={{ color: "var(--accent-orange)" }} />
                  </div>
                  <div>
                    <p className="text-base font-semibold mb-1" style={{ color: "var(--grid-foreground)" }}>
                      {f.label}
                    </p>
                    <p className="text-base font-geist-secondary leading-[1.35]" style={{ color: "var(--grid-muted)" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>

        <BlurFade delay={0.2} inView className="bg-(--grid-cell-bg)">
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col items-center gap-7 h-full">
            <div className="relative w-64 h-80">
              {stack
                .slice(0, -1)
                .reverse()
                .map((card, i) => (
                  <div
                    key={card.id}
                    className="absolute inset-0 border"
                    style={{
                      borderColor: "var(--grid-border)",
                      background: "var(--grid-cell-bg)",
                      transform: `translateY(${(i + 1) * 7}px) scale(${1 - (i + 1) * 0.04})`,
                      zIndex: stack.length - i - 2,
                      opacity: 0.6,
                    }}
                  />
                ))}

              <AnimatePresence mode="popLayout">
                {stack.length > 0 && topCard ? (
                  <motion.div
                    key={topCard.id}
                    className="absolute inset-0 border"
                    style={{
                      borderColor: "var(--grid-border)",
                      background: "var(--grid-cell-bg)",
                      zIndex: stack.length + 10,
                      touchAction: "none",
                    } as React.CSSProperties}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(_: PointerEvent, info: PanInfo) => {
                      if (info.offset.x > SWIPE_THRESHOLD) handleSwipe("right");
                      else if (info.offset.x < -SWIPE_THRESHOLD) handleSwipe("left");
                    }}
                    exit={{
                      x: lastDir === "right" ? 400 : lastDir === "left" ? -400 : 0,
                      rotate: lastDir === "right" ? 15 : lastDir === "left" ? -15 : 0,
                      opacity: 0,
                      transition: { duration: 0.35, ease: "easeIn" },
                    }}
                    whileDrag={{ scale: 1.04 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  >
                    <SwipeCard
                      card={topCard}
                      zIndex={0}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 border-2 border-dashed flex flex-col items-center justify-center gap-4"
                    style={{ borderColor: "var(--grid-border)" }}
                  >
                    <p className="text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
                      вкус сохранён!
                    </p>
                    <button
                      onClick={reset}
                      className="px-5 py-2 text-sm font-medium transition-colors"
                      style={{ background: "var(--grid-foreground)", color: "var(--grid-on-foreground)" }}
                    >
                      сначала
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-5">
              <motion.button
                onClick={() => handleSwipe("left")}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-16 h-16 border-2 flex items-center justify-center transition-colors"
                style={{ borderColor: "#ef4444", color: "#ef4444" }}
              >
                <RiCloseLine className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={() => handleSwipe("right")}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-16 h-16 flex items-center justify-center"
                style={{ background: "var(--accent-orange)", color: "#fff" }}
              >
                <RiHeartLine className="w-6 h-6" />
              </motion.button>
            </div>

            <p
              className="text-sm font-geist-secondary text-center"
              style={{ color: "var(--grid-muted)" }}
            >
              перетащите карточку или нажмите кнопку · {gone.length}/{CARDS.length}
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
