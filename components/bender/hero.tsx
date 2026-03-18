"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { Play, HelpCircle } from "lucide-react"

interface HeroProps {
  onShowModal: () => void
  onStartPlaying: () => void
}

function BenderFace() {
  return (
    <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center sm:h-52 sm:w-52">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#c8deec] via-[#a6c1d6] to-[#7ca4bd] shadow-lg">
        {/* Antenna */}
        <div className="absolute -top-8 left-1/2 h-10 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#7ca4bd] to-[#a6c1d6]">
          <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#fffbc7]" />
        </div>

        {/* Eyes */}
        <div className="absolute left-1/2 top-8 flex -translate-x-1/2 items-center gap-2 sm:top-12">
          <div className="bender-eyes h-10 w-10 rounded-full border-4 border-[#333] bg-white shadow-inner sm:h-14 sm:w-14">
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black sm:h-5 sm:w-5" />
          </div>
          <div className="bender-eyes h-10 w-10 rounded-full border-4 border-[#333] bg-white shadow-inner sm:h-14 sm:w-14">
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Mouth */}
        <div className="absolute bottom-6 left-1/2 h-10 w-20 -translate-x-1/2 rounded-md border-2 border-[#666] bg-[#333] sm:bottom-8 sm:h-12 sm:w-28">
          <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 w-0.5 bg-[#555]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#c8deec]"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.2,
            animation: `twinkle ${Math.random() * 4 + 3}s ease-in-out infinite`,
            animationDelay: Math.random() * 3 + 's',
          }}
        />
      ))}
    </div>
  )
}

export function Hero({ onShowModal, onStartPlaying }: HeroProps) {
  const { t } = useI18n()

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[#000d18] via-[#091a2a] to-[#000d18]" />

      <StarField />

      {/* Distant planets */}
      <div className="absolute right-[10%] top-[15%] h-16 w-16 rounded-full bg-gradient-to-br from-[#a6c1d6] to-[#7ca4bd] opacity-30 sm:h-24 sm:w-24" />
      <div className="absolute bottom-[20%] left-[5%] h-8 w-8 rounded-full bg-gradient-to-br from-[#c8deec] to-[#a6c1d6] opacity-20 sm:h-12 sm:w-12" />

      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7ca4bd]/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="animate-float">
          <BenderFace />
        </div>

        {/* Tagline */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7ca4bd]/30 bg-[#7ca4bd]/10 px-4 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#c8deec]" />
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#a6c1d6]">
            {t("hero.tagline")}
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-6 font-sans text-6xl font-black uppercase tracking-wider sm:text-7xl md:text-8xl lg:text-9xl">
          <span className="bg-gradient-to-r from-[#fffbc7] via-[#c8deec] to-[#fffbc7] bg-clip-text text-transparent">
            {t("hero.title")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-pretty font-mono text-base text-[#a6c1d6] sm:text-lg md:text-xl">
          {t("hero.subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={onStartPlaying}
            className="gap-2 rounded-xl border-2 border-[#fffbc7] bg-[#fffbc7] px-8 py-6 font-mono text-base font-bold uppercase tracking-wider text-[#000d18] transition-all hover:bg-[#fffbc7]/90"
          >
            <Play className="h-5 w-5" />
            {t("hero.cta")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onShowModal}
            className="gap-2 rounded-xl border-2 border-[#c8deec]/50 bg-transparent px-8 py-6 font-mono text-base font-bold uppercase tracking-wider text-[#c8deec] transition-all hover:border-[#c8deec] hover:bg-[#c8deec]/10"
          >
            <HelpCircle className="h-5 w-5" />
            {t("hero.learnMore")}
          </Button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
