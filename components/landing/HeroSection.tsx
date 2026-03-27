"use client";

import { motion } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { RiArrowRightLine } from "react-icons/ri";

export function HeroSection() {
  return (
    <section
      className="w-full max-w-6xl mx-auto border-x border-b"
      style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
    >
      {/* Top label row */}
      <div className="border-b px-6 sm:px-8 py-4 flex items-center gap-3" style={{ borderColor: "var(--grid-border)" }}>
        <span
          className="text-[11px] tracking-widest uppercase font-geist-secondary"
          style={{ color: "var(--grid-muted)" }}
        >
          v0.1 · virtual fashion intelligence
        </span>
        <motion.span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--accent-orange)" }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Main hero grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] min-h-[66vh] overflow-hidden">
        {/* Dot pattern bg */}
        <DotPattern
          width={24}
          height={24}
          glow={false}
          className="opacity-25"
          style={{ color: "var(--grid-border)" }}
        />

        {/* Left: content */}
        <div className="relative z-10 flex flex-col justify-end p-6 sm:p-8 lg:p-10 gap-7">
          <BlurFade delay={0.1} inView direction="up">
            <h1
              className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.94]"
              style={{ color: "var(--grid-foreground)" }}
            >
              одежда —<br />
              <span style={{ color: "var(--accent-orange)" }}>это код.</span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.25} inView direction="up">
            <p
              className="text-lg sm:text-2xl leading-[1.28] font-geist-secondary max-w-2xl"
              style={{ color: "var(--grid-muted)" }}
            >
              вы просто не умеете его компилировать. мы убиваем
              онлайн-шопинг в его текущем виде — потому что сейчас это
              гадание на пикселях.
            </p>
          </BlurFade>

          <BlurFade delay={0.4} inView direction="up">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#solution"
                className="group flex items-center gap-2 px-6 py-3.5 text-base font-medium transition-all duration-150"
                style={{
                  background: "var(--accent-orange)",
                  color: "#fff",
                }}
              >
                начать бесплатно
                <RiArrowRightLine className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#problem"
                className="px-6 py-3.5 text-base font-medium border transition-all duration-150"
                style={{
                  borderColor: "var(--grid-border)",
                  color: "var(--grid-foreground)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--grid-foreground)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--grid-border)")}
              >
                в чём проблема?
              </a>
            </div>
          </BlurFade>
        </div>

        {/* Right: accent column */}
        <div
          className="hidden md:flex flex-col border-l w-56"
          style={{ borderColor: "var(--grid-border)" }}
        >
          {[
            { stat: "−40%", label: "возвратов" },
            { stat: "+2.4×", label: "средний чек" },
            { stat: "+67%", label: "retention" },
          ].map((item, i) => (
            <div
              key={item.stat}
              className="flex-1 flex flex-col justify-center p-7 border-b last:border-b-0"
              style={{ borderColor: "var(--grid-border)" }}
            >
              <BlurFade delay={0.2 + i * 0.15} inView>
                <p
                  className="text-4xl font-bold leading-none mb-1.5"
                  style={{ color: "var(--accent-orange)" }}
                >
                  {item.stat}
                </p>
                <p
                  className="text-sm uppercase tracking-wider font-geist-secondary"
                  style={{ color: "var(--grid-muted)" }}
                >
                  {item.label}
                </p>
              </BlurFade>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
