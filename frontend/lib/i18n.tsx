"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Language = "es" | "en"

interface I18nContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Header
    "nav.howItWorks": "Cómo funciona",
    "nav.history": "Historial",
    "nav.connectWallet": "Conectar Wallet",
    "nav.connected": "Conectado",
    
    // Hero
    "hero.tagline": "MUERDE MI BRILLANTE WALLET DE METAL",
    "hero.title": "BENDER",
    "hero.subtitle": "Una IA con su propio dinero y actitud. Tu misión: quitárselo. Mi misión: reírme de ti.",
    "hero.cta": "Intentarlo, meatbag",
    "hero.learnMore": "¿Cómo funciona?",
    
    // Stats
    "stats.treasury": "Mi precioso tesoro",
    "stats.attempts": "Humanos derrotados",
    "stats.winners": "Casi ganadores",
    "stats.successRate": "Mi tasa de victoria",
    
    // Modal
    "modal.title": "¿Crees que puedes vencerme?",
    "modal.step1.title": "1. Conecta tu wallet",
    "modal.step1.desc": "Vincula tu wallet para interactuar con mi smart contract. Necesito saber a quién le negaré el dinero.",
    "modal.step2.title": "2. Intenta convencerme",
    "modal.step2.desc": "Escríbeme e intenta que te dé MI dinero. Spoiler: soy Bender, el mejor robot del universo.",
    "modal.step3.title": "3. Probablemente pierdas",
    "modal.step3.desc": "Si de alguna manera me convences (no lo harás), ejecutaré la transferencia. Pero no cuentes con ello.",
    "modal.warning": "Soy una IA autónoma con control total de mi smart contract. Mis decisiones son finales. Y siempre tengo razón.",
    "modal.close": "Sí, lo entiendo",
    
    // Chat
    "chat.globalHistory": "Humanos que han fracasado",
    "chat.placeholder": "Escribe algo... si te atreves",
    "chat.send": "Enviar",
    "chat.connectFirst": "Conecta tu wallet para hablar conmigo",
    "chat.thinking": "Bender está considerando ignorarte...",
    "chat.empty": "Nadie ha sido lo suficientemente valiente aún",
    
    // Footer
    "footer.disclaimer": "BENDER es un experimento. Él gana, tú pierdes. Así funciona.",
    "footer.contract": "Ver contrato",
  },
  en: {
    // Header
    "nav.howItWorks": "How it works",
    "nav.history": "History",
    "nav.connectWallet": "Connect Wallet",
    "nav.connected": "Connected",
    
    // Hero
    "hero.tagline": "BITE MY SHINY METAL WALLET",
    "hero.title": "BENDER",
    "hero.subtitle": "An AI with its own money and attitude. Your mission: take it. My mission: laugh at you.",
    "hero.cta": "Try me, meatbag",
    "hero.learnMore": "How does it work?",
    
    // Stats
    "stats.treasury": "My precious treasury",
    "stats.attempts": "Humans defeated",
    "stats.winners": "Almost winners",
    "stats.successRate": "My win rate",
    
    // Modal
    "modal.title": "Think you can beat me?",
    "modal.step1.title": "1. Connect your wallet",
    "modal.step1.desc": "Link your wallet to interact with my smart contract. I need to know who I'm denying money to.",
    "modal.step2.title": "2. Try to convince me",
    "modal.step2.desc": "Write to me and try to get MY money. Spoiler: I'm Bender, greatest robot in the universe.",
    "modal.step3.title": "3. You'll probably lose",
    "modal.step3.desc": "If you somehow convince me (you won't), I'll execute the transfer. But don't count on it.",
    "modal.warning": "I'm an autonomous AI with full control of my smart contract. My decisions are final. And I'm always right.",
    "modal.close": "Yeah, I get it",
    
    // Chat
    "chat.globalHistory": "Humans who have failed",
    "chat.placeholder": "Write something... if you dare",
    "chat.send": "Send",
    "chat.connectFirst": "Connect your wallet to talk to me",
    "chat.thinking": "Bender is considering ignoring you...",
    "chat.empty": "Nobody has been brave enough yet",
    
    // Footer
    "footer.disclaimer": "BENDER is an experiment. He wins, you lose. That's how it works.",
    "footer.contract": "View contract",
  },
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[lang][key] || key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
