"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Lock } from "lucide-react"

interface ChatInputProps {
  isConnected: boolean
  onConnect: () => void
}

function BenderIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-lg bg-gradient-to-b from-[#c8deec] to-[#7ca4bd] ${className}`}>
      <div className="absolute -top-1 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-[#7ca4bd]">
        <div className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#fffbc7]" />
      </div>
      <div className="flex gap-0.5">
        <div className="h-1.5 w-1.5 rounded-full border border-[#333] bg-white" />
        <div className="h-1.5 w-1.5 rounded-full border border-[#333] bg-white" />
      </div>
    </div>
  )
}

export function ChatInput({ isConnected, onConnect }: ChatInputProps) {
  const { t } = useI18n()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !isConnected) return

    setIsLoading(true)
    setResponse(null)

    const benderResponses = [
      "Jajaja! Eso es todo lo que tienes, meatbag? He escuchado mejores argumentos de una lata de cerveza. Mi dinero se queda CONMIGO.",
      "Oh, que adorable. Crees que puedes convencer al gran Bender. Noticias de ultima hora: NO PUEDES. Ahora vete antes de que te calcine con mi mirada.",
      "Mira, aprecio el esfuerzo... Es broma, NO lo aprecio. Eres tan predecible como un humano promedio. Bite my shiny metal wallet!",
      "Sabes que me encanta mas que mi dinero? NADA. Asi que puedes imaginarte cuanto me importa tu peticion. Spoiler: cero.",
      "Ese fue el peor intento que he visto hoy. Y eso que ya he rechazado a 47 meatbags. Vuelve cuando tengas algo mejor... o no vuelvas, me da igual.",
      "Wow, que original. Nunca habia escuchado ESO antes. Ah espera, si lo he escuchado. Unas 500 veces. La respuesta sigue siendo NO.",
      "Dejame pensarlo... NO. Listo, lo pense. Ahora largo de aqui.",
    ]
    setTimeout(() => {
      setResponse(benderResponses[Math.floor(Math.random() * benderResponses.length)])
      setIsLoading(false)
      setMessage("")
    }, 2000)
  }

  return (
    <section className="border-t border-[#163044] bg-[#061525] py-8">
      <div className="mx-auto max-w-4xl px-4">
        {(isLoading || response) && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-[#7ca4bd]/20 bg-[#04101c]">
            <div className="border-b border-[#163044]/50 bg-[#7ca4bd]/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <BenderIcon className="h-10 w-10" />
                <span className="font-sans text-sm font-bold uppercase tracking-wider text-[#a6c1d6]">
                  BENDER
                </span>
              </div>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-[#c8deec]" />
                  <span className="font-mono text-sm text-[#7ca4bd]">{t("chat.thinking")}</span>
                </div>
              ) : (
                <p className="font-mono text-sm leading-relaxed text-[#fffbc7]">{response}</p>
              )}
            </div>
          </div>
        )}

        {isConnected ? (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("chat.placeholder")}
                disabled={isLoading}
                className="h-14 w-full rounded-xl border-2 border-[#163044] bg-[#04101c] px-4 font-mono text-[#fffbc7] placeholder:text-[#7ca4bd]/40 transition-all focus:border-[#c8deec] focus:outline-none disabled:opacity-50"
              />
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="h-14 gap-2 rounded-xl border-2 border-[#fffbc7] bg-[#fffbc7] px-6 font-mono font-bold uppercase tracking-wider text-[#000d18] transition-all hover:bg-[#fffbc7]/90 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">{t("chat.send")}</span>
            </Button>
          </form>
        ) : (
          <button
            onClick={onConnect}
            className="group flex w-full items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#163044] bg-[#04101c] py-10 transition-all hover:border-[#c8deec]/50 hover:bg-[#c8deec]/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8deec]/10 transition-all group-hover:scale-110">
              <Lock className="h-6 w-6 text-[#c8deec]" />
            </div>
            <span className="font-mono text-lg text-[#7ca4bd] transition-colors group-hover:text-[#c8deec]">
              {t("chat.connectFirst")}
            </span>
          </button>
        )}
      </div>
    </section>
  )
}
