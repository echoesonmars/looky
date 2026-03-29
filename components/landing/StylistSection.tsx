"use client";

import { motion } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { RiRobot2Line, RiTimeLine, RiMagicLine } from "react-icons/ri";

const features = [
  { icon: RiTimeLine, label: "за миллисекунды", desc: "быстрее чем вы успеваете моргнуть" },
  { icon: RiMagicLine, label: "стиль + контекст", desc: "офис, отдых, вечер, спорт — алгоритм знает" },
];

export function StylistSection() {
  return (
    <section
      id="stylist"
      className="w-full max-w-6xl mx-auto border-x border-b"
      style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
    >      <div
        className="border-b grid grid-cols-[auto_1fr]"
        style={{ borderColor: "var(--grid-border)" }}
      >
        <div
          className="px-8 py-4 border-r text-[11px] tracking-widest uppercase font-geist-secondary"
          style={{ borderColor: "var(--grid-border)", color: "var(--accent-orange)" }}
        >
          02 / синтез
        </div>
        <div className="px-8 py-4">
          <BlurFade delay={0} inView>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
              ai-стилист.
            </h2>
          </BlurFade>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <BlurFade delay={0.1} inView>
          <div
            className="p-8 sm:p-10 flex flex-col gap-4 border-b md:border-b-0 md:border-r"
            style={{ borderColor: "var(--grid-border)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 border flex items-center justify-center"
                style={{ borderColor: "var(--grid-border)" }}
              >
                <RiRobot2Line className="w-4 h-4" style={{ color: "var(--accent-orange)" }} />
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--grid-foreground)" }}>
                ai-стилист
              </span>
              <motion.span
                className="ml-auto text-xs font-geist-secondary px-2 py-0.5"
                style={{ background: "var(--accent-orange)", color: "#fff" }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                thinking
              </motion.span>
            </div>

            {[
              { emoji: "🧥", name: "свитер", delay: 0.2 },
              { emoji: "👖", name: "джинсы", delay: 0.35 },
              { emoji: "👟", name: "кроссовки", delay: 0.5 },
            ].map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: item.delay, duration: 0.45, ease: "easeOut" }}
                viewport={{ once: true }}
                className="flex items-center gap-3 px-4 py-3 border"
                style={{ borderColor: "var(--grid-border)" }}
              >
                <span>{item.emoji}</span>
                <p className="text-sm font-medium" style={{ color: "var(--grid-foreground)" }}>
                  {item.name}
                </p>
                <span
                  className="ml-auto text-xs font-geist-secondary"
                  style={{ color: "var(--grid-muted)" }}
                >
                  подобрано ✓
                </span>
              </motion.div>
            ))}

            <div
              className="flex items-center gap-3 justify-between pt-3 border-t"
              style={{ borderColor: "var(--grid-border)" }}
            >
              <span className="text-xs font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
                совместимость
              </span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1" style={{ background: "var(--grid-border)" }}>
                  <motion.div
                    className="h-full"
                    style={{ background: "var(--accent-orange)" }}
                    initial={{ width: "0%" }}
                    whileInView={{ width: "92%" }}
                    transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--accent-orange)" }}>
                  92%
                </span>
              </div>
            </div>
          </div>
        </BlurFade>
        <div className="p-8 sm:p-12 flex flex-col gap-8 justify-center">
          <BlurFade delay={0.15} inView>
            <p className="text-base leading-relaxed font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
              люди плохо собирают массивы из объектов. машина — нет.
              полноценные образы за миллисекунды с учётом стиля и контекста.
            </p>
          </BlurFade>

          <div className="flex flex-col gap-5">
            {features.map((f, i) => (
              <BlurFade key={f.label} delay={0.25 + i * 0.12} inView>
                <div className="flex gap-4 items-start">
                  <div
                    className="w-8 h-8 border flex items-center justify-center shrink-0"
                    style={{ borderColor: "var(--grid-border)" }}
                  >
                    <f.icon className="w-4 h-4" style={{ color: "var(--accent-orange)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--grid-foreground)" }}>
                      {f.label}
                    </p>
                    <p className="text-sm font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
