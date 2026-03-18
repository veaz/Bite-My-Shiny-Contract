"use client"

import { useState, useEffect } from "react"
import { I18nProvider } from "@/lib/i18n"
import { Header } from "@/components/bender/header"
import { Hero } from "@/components/bender/hero"
import { Stats } from "@/components/bender/stats"
import { ChatHistory } from "@/components/bender/chat-history"
import { ChatInput } from "@/components/bender/chat-input"
import { Footer } from "@/components/bender/footer"
import { HowItWorksModal } from "@/components/bender/how-it-works-modal"

function BenderApp() {
  const [isConnected, setIsConnected] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showInitialModal, setShowInitialModal] = useState(true)

  // Show initial modal on first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("bender-visited")
    if (!hasVisited) {
      setShowInitialModal(true)
      sessionStorage.setItem("bender-visited", "true")
    } else {
      setShowInitialModal(false)
    }
  }, [])

  const handleConnect = async () => {
    // Simulate wallet connection
    setIsConnected(!isConnected)
  }

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setShowInitialModal(false)
  }

  const handleStartPlaying = () => {
    if (!isConnected) {
      handleConnect()
    }
    // Scroll to chat input
    document.getElementById("history")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        isConnected={isConnected}
        onConnect={handleConnect}
        onShowModal={handleShowModal}
      />

      <main className="flex-1">
        <Hero onShowModal={handleShowModal} onStartPlaying={handleStartPlaying} />
        <Stats />
        <ChatHistory />
        <ChatInput isConnected={isConnected} onConnect={handleConnect} />
      </main>

      <Footer />

      <HowItWorksModal
        isOpen={showModal || showInitialModal}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default function Page() {
  return (
    <I18nProvider>
      <BenderApp />
    </I18nProvider>
  )
}
