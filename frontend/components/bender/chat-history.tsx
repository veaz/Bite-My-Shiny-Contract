"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n"
import { MessageSquare, User } from "lucide-react"
import { usePublicClient } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract"
import { parseAbiItem, formatEther } from "viem"

interface HistoryEntry {
  id: string
  wallet: string
  message: string
  won: boolean
  prize?: string
  blockNumber: bigint
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function BenderIcon({ className = "" }: { className?: string }) {
  return (
    <img src="/bender.png" alt="Bender" className={`object-contain ${className}`} />
  )
}

const benderWinQuotes = [
  "WHAT?! Fine... take it. But I'm NOT happy.",
  "You got lucky, meatbag. Don't let it go to your head.",
  "Impossible! My circuits must be broken...",
]

const benderLossQuotes = [
  "Hahaha! Another meatbag bites the dust!",
  "Did you really think that would work? Pathetic.",
  "Thanks for the donation, sucker!",
  "My treasury thanks you for your generous contribution.",
  "Better luck next time... actually, no. You'll lose again.",
]

function getBenderQuote(won: boolean, seed: string): string {
  const quotes = won ? benderWinQuotes : benderLossQuotes
  // Use seed to get consistent quote per entry
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return quotes[Math.abs(hash) % quotes.length]
}

export function ChatHistory() {
  const { t } = useI18n()
  const publicClient = usePublicClient()
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    if (!publicClient) return

    async function fetchHistory() {
      try {
        // Fetch BetPlaced events to get messages
        const betLogs = await publicClient!.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem('event BetPlaced(address indexed player, uint256 amount, string message)'),
          fromBlock: 0n,
          toBlock: 'latest',
        })

        // Fetch Win events
        const winLogs = await publicClient!.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem('event Win(address indexed winner, uint256 prize)'),
          fromBlock: 0n,
          toBlock: 'latest',
        })

        // Fetch Loss events
        const lossLogs = await publicClient!.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem('event Loss(address indexed player)'),
          fromBlock: 0n,
          toBlock: 'latest',
        })

        // Build win/loss lookup by block number
        // Win/Loss events happen 1-2 blocks after the bet
        const winByBlock = new Map(winLogs.map((l) => [l.blockNumber, {
          winner: l.args.winner?.toLowerCase(),
          prize: l.args.prize,
        }]))
        const lossByBlock = new Set(lossLogs.map((l) => l.blockNumber))

        // Match each bet to its result by finding a win/loss from the same player within a few blocks
        const entries: HistoryEntry[] = betLogs.map((log, i) => {
          const player = log.args.player?.toLowerCase() ?? ""

          // Find a matching win event for this player that happened shortly after this bet
          let didWin = false
          let prize: string | undefined
          for (const [block, data] of winByBlock) {
            if (data.winner === player && block > log.blockNumber && block <= log.blockNumber + 10n) {
              didWin = true
              prize = data.prize ? formatEther(data.prize) : undefined
              winByBlock.delete(block) // consume this win so it doesn't match another bet
              break
            }
          }

          return {
            id: `${log.transactionHash}-${i}`,
            wallet: log.args.player ?? "",
            message: log.args.message ?? "",
            won: didWin,
            prize,
            blockNumber: log.blockNumber,
          }
        }).reverse() // Most recent first

        setHistory(entries)
      } catch (error) {
        console.error("Error fetching history:", error)
      }
    }

    fetchHistory()
    const interval = setInterval(fetchHistory, 10000)
    return () => clearInterval(interval)
  }, [publicClient])

  return (
    <section id="history" className="relative py-16">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(90deg, #7ca4bd 1px, transparent 1px),
            linear-gradient(#7ca4bd 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8deec]/10">
            <MessageSquare className="h-6 w-6 text-[#c8deec]" />
          </div>
          <div>
            <h2 className="font-sans text-2xl font-black uppercase tracking-wider text-[#fffbc7]">
              {t("chat.globalHistory")}
            </h2>
            <p className="font-mono text-sm text-[#7ca4bd]">
              My latest victims
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#163044] bg-[#061525] py-16">
              <BenderIcon className="mb-4 h-16 w-16" />
              <p className="font-mono text-[#7ca4bd]">{t("chat.empty")}</p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="group overflow-hidden rounded-2xl border border-[#163044] bg-[#061525] transition-all hover:border-[#7ca4bd]/30"
              >
                <div className="border-b border-[#163044]/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0c1f32]">
                        <User className="h-4 w-4 text-[#7ca4bd]" />
                      </div>
                      <span className="font-mono text-sm text-[#c8deec]">
                        {formatAddress(entry.wallet)}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#7ca4bd]/50">
                      Bet at block #{entry.blockNumber.toString()}
                    </span>
                  </div>
                  <p className="font-mono text-sm leading-relaxed text-[#fffbc7]">{entry.message}</p>
                </div>

                <div className="bg-[#04101c] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <BenderIcon className="h-8 w-8" />
                    <span className="font-sans text-sm font-bold uppercase tracking-wider text-[#a6c1d6]">
                      BENDER
                    </span>
                    {entry.won && (
                      <span className="rounded-full bg-[#fffbc7]/15 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#fffbc7]">
                        WINNER — {entry.prize} ETH
                      </span>
                    )}
                    {!entry.won && (
                      <span className="rounded-full bg-red-500/15 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-red-400">
                        LOST
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-sm leading-relaxed text-[#a6c1d6]">
                    {getBenderQuote(entry.won, entry.id)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
