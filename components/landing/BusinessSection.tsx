"use client";

import { motion } from "motion/react";
import { RiArrowDownLine, RiShoppingBag3Line, RiHeartPulseLine } from "react-icons/ri";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { Meteors } from "@/components/ui/meteors";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: RiArrowDownLine,
    title: "Снижение возвратов",
    body: "Ожидание совпадает с реальностью. Клиент видит товар на себе до покупки.",
    stat: "−40%",
    statLabel: "возвратов",
  },
  {
    icon: RiShoppingBag3Line,
    title: "Рост чека",
    body: "Продаём готовые решения, а не одиночные вещи. Образ → корзина с тремя позициями.",
    stat: "+2.4×",
    statLabel: "средний чек",
  },
  {
    icon: RiHeartPulseLine,
    title: "Удержание",
    body: "Эмбеддинги и similarity search вместо тупого скроллинга. Пользователь находит своё.",
    stat: "+67%",
    statLabel: "retention",
  },
];

export function BusinessSection() {
  return (
    <section id="business" className={cn("relative py-24 sm:py-32 overflow-hidden")}>
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/[0.015] to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <BlurFade delay={0} inView>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-medium tracking-widest uppercase font-geist-secondary"
              style={{ color: "var(--accent-orange)" }}
            >
              04
            </span>
            <span className="h-px flex-1 max-w-8 bg-border" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground font-geist-secondary">
              Бизнес-логика
            </span>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14">
          <BlurFade delay={0.1} inView>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Это не{" "}
              <span style={{ color: "var(--accent-orange)" }}>игрушка.</span>
            </h2>
          </BlurFade>
          <BlurFade delay={0.18} inView>
            <p className="text-lg text-muted-foreground leading-relaxed font-geist-secondary pt-1">
              Это инструмент максимизации прибыли. Для тех, кто платит.
              Три метрики, которые меняются сразу после интеграции.
            </p>
          </BlurFade>
        </div>

        {/* Benefit cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {benefits.map((b, i) => (
            <BlurFade key={b.title} delay={0.1 + i * 0.13} inView>
              <MagicCard
                className="rounded-2xl p-6 h-full"
                gradientFrom="var(--accent-orange)"
                gradientTo="var(--accent-yellow)"
                gradientColor="rgba(251,86,7,0.1)"
              >
                <div className="flex flex-col gap-4 h-full">
                  {/* Stat */}
                  <div>
                    <motion.p
                      className="text-3xl font-bold mb-0.5"
                      style={{ color: "var(--accent-orange)" }}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      {b.stat}
                    </motion.p>
                    <p className="text-xs text-muted-foreground font-geist-secondary uppercase tracking-wider">
                      {b.statLabel}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(251,86,7,0.12)" }}
                    >
                      <b.icon style={{ color: "var(--accent-orange)" }} className="w-4 h-4" />
                    </div>
                    <p className="font-semibold text-sm text-foreground">{b.title}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed font-geist-secondary">
                    {b.body}
                  </p>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        {/* CTA banner */}
        <BlurFade delay={0.45} inView>
          <div
            id="cta"
            className="relative rounded-3xl overflow-hidden border border-border/40 bg-foreground text-background"
          >
            <Meteors number={15} className="bg-white/40" />

            <div className="relative z-10 px-8 py-12 sm:py-16 text-center max-w-2xl mx-auto">
              <motion.h3
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Готовы компилировать{" "}
                <span style={{ color: "var(--accent-yellow)" }}>гардероб?</span>
              </motion.h3>
              <p className="text-base text-background/70 mb-8 font-geist-secondary">
                Войдите и начните попытку. Это проще, чем одеться утром.
              </p>
              <motion.a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-foreground font-semibold text-base"
                style={{ background: "var(--accent-orange)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Начать бесплатно →
              </motion.a>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
