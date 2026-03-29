"use client";

import { motion } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { RiSmartphoneLine, RiEyeLine, RiCpuLine } from "react-icons/ri";

const steps = [
  { icon: RiSmartphoneLine, label: "ваш телефон. ваше фото." },
  { icon: RiCpuLine, label: "наш алгоритм детектирует силуэт." },
  { icon: RiEyeLine, label: "вы видите правду до оплаты." },
];

const tags = ["2d-наложение", "компьютерное зрение", "силуэт-детекция", "real-time"];

export function TryOnSection() {
  return (
    <section
      id="try-on"
      className="w-full max-w-6xl mx-auto border-x border-b"
      style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
    >
      <div
        className="border-b grid grid-cols-[auto_1fr]"
        style={{ borderColor: "var(--grid-border)" }}
      >
        <div
          className="px-8 py-4 border-r text-[11px] tracking-widest uppercase font-geist-secondary"
          style={{ borderColor: "var(--grid-border)", color: "var(--accent-orange)" }}
        >
          01 / антидот
        </div>
        <div className="px-8 py-4">
          <BlurFade delay={0} inView>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--grid-foreground)" }}>
              virtual try-on.
            </h2>
          </BlurFade>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div
          className="p-8 sm:p-12 border-b md:border-b-0 md:border-r flex flex-col gap-8"
          style={{ borderColor: "var(--grid-border)" }}
        >
          <BlurFade delay={0.1} inView>
            <p className="text-base leading-relaxed font-geist-secondary" style={{ color: "var(--grid-muted)" }}>
              никаких примерочных. система определяет силуэт и накладывает
              одежду прямо на вас.{" "}
              <strong style={{ color: "var(--grid-foreground)" }}>
                вы видите правду до того, как спишутся деньги с карты.
              </strong>
            </p>
          </BlurFade>

          <div className="flex flex-col gap-4">
            {steps.map((s, i) => (
              <BlurFade key={s.label} delay={0.15 + i * 0.1} inView>
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 border flex items-center justify-center shrink-0"
                    style={{ borderColor: "var(--grid-border)" }}
                  >
                    <s.icon className="w-4 h-4" style={{ color: "var(--accent-orange)" }} />
                  </div>
                  <p className="text-sm font-geist-secondary pt-1.5" style={{ color: "var(--grid-foreground)" }}>
                    {s.label}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>

          <BlurFade delay={0.45} inView>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 border font-geist-secondary"
                  style={{ borderColor: "var(--grid-border)", color: "var(--grid-muted)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </BlurFade>
        </div>

        <BlurFade delay={0.2} inView>
          <div className="relative p-8 sm:p-12 min-h-[360px] flex items-center justify-center">
            <div
              className="relative w-52 h-72 border overflow-hidden"
              style={{ borderColor: "var(--grid-border)" }}
            >
              <BorderBeam
                colorFrom="var(--accent-orange)"
                colorTo="var(--accent-yellow)"
                duration={4}
                size={60}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6" style={{ background: "var(--grid-cell-bg)" }}>
                <motion.div
                  className="w-16 h-16 border-2 border-dashed flex items-center justify-center"
                  style={{ borderColor: "var(--accent-orange)", color: "var(--accent-orange)" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <RiSmartphoneLine className="w-7 h-7" />
                </motion.div>
                <div className="w-full text-center">
                  <p className="text-xs font-geist-secondary mb-2" style={{ color: "var(--grid-muted)" }}>
                    анализ силуэта
                  </p>
                  <div className="w-full h-1 overflow-hidden" style={{ background: "var(--grid-border)" }}>
                    <motion.div
                      className="h-full"
                      style={{ background: "var(--accent-orange)" }}
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                <div className="w-full grid grid-cols-3 gap-1.5">
                  {["верх", "низ", "обувь"].map((l) => (
                    <div
                      key={l}
                      className="border p-2 text-center"
                      style={{ borderColor: "var(--grid-border)" }}
                    >
                      <p className="text-[10px] font-geist-secondary" style={{ color: "var(--grid-muted)" }}>{l}</p>
                    </div>
                  ))}
                </div>
                <motion.div
                  className="w-full py-2 text-center text-xs"
                  style={{ background: "var(--accent-orange)", color: "#fff" }}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  примерить →
                </motion.div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
