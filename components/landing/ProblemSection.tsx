"use client";

import { motion } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { RiEmotionSadLine, RiRefreshLine, RiMoneyDollarCircleLine } from "react-icons/ri";

const problems = [
  {
    num: "01",
    icon: RiEmotionSadLine,
    title: "фото на модели — ложь.",
    body: "вы покупаете иллюзию. приезжает ткань. она не сидит.",
  },
  {
    num: "02",
    icon: RiRefreshLine,
    title: "возвраты убивают всех.",
    body: "бизнес теряет деньги. вы теряете время. курьер делает лишний круг.",
  },
  {
    num: "03",
    icon: RiMoneyDollarCircleLine,
    title: "страх покупать.",
    body: "вы берёте одну футболку, потому что боитесь — штаны не подойдут. бессмысленно.",
  },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="w-full max-w-6xl mx-auto border-x border-b"
      style={{ borderColor: "var(--grid-border)", background: "var(--grid-cell-bg)" }}
    >
      <div className="border-b grid grid-cols-[auto_1fr] items-baseline" style={{ borderColor: "var(--grid-border)" }}>
        <div
          className="px-6 sm:px-8 py-4 border-r text-[11px] tracking-widest uppercase font-geist-secondary"
          style={{ borderColor: "var(--grid-border)", color: "var(--accent-orange)" }}
        >
          00 / проблема
        </div>
        <div className="px-6 sm:px-8 py-4">
          <BlurFade delay={0.05} inView>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "var(--grid-foreground)" }}
            >
              гадание на пикселях.
            </h2>
          </BlurFade>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "var(--grid-border)" }}>
        {problems.map((p, i) => (
          <BlurFade key={p.num} delay={0.1 + i * 0.1} inView>
            <motion.div
              className="flex flex-col p-6 sm:p-8 min-h-[330px] bg-(--grid-cell-bg)"
              whileHover={{ backgroundColor: "rgba(251,86,7,0.03)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between mb-6">
                <span
                  className="text-sm font-geist-secondary tracking-widest"
                  style={{ color: "var(--grid-muted)" }}
                >
                  {p.num}
                </span>
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-background">
                  <p.icon className="w-6 h-6" style={{ color: "var(--accent-orange)" }} />
                </div>
              </div>
              <p
                className="text-2xl font-semibold mb-4 leading-[1.15]"
                style={{ color: "var(--grid-foreground)" }}
              >
                {p.title}
              </p>
              <p
                className="text-lg leading-[1.35] font-geist-secondary mt-auto"
                style={{ color: "var(--grid-muted)" }}
              >
                {p.body}
              </p>
            </motion.div>
          </BlurFade>
        ))}
      </div>

      <div
        className="border-t px-6 sm:px-8 py-8 sm:py-10"
        style={{ borderColor: "var(--grid-border)" }}
      >
        <BlurFade delay={0.4} inView>
          <blockquote
            className="text-2xl sm:text-4xl font-bold tracking-tight leading-[1.1] max-w-4xl"
            style={{ color: "var(--grid-foreground)" }}
          >
            &quot;мы здесь, чтобы убить онлайн-шопинг{" "}
            <span style={{ color: "var(--accent-orange)" }}>в его текущем виде.&quot;</span>
          </blockquote>
        </BlurFade>
      </div>
    </section>
  );
}
