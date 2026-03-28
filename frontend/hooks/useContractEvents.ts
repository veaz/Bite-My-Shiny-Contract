"use client"

import { useEffect, useState } from "react"
import { usePublicClient } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract"
import { parseAbiItem } from "viem"

export function useContractEvents() {
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!publicClient) return

    async function fetchEvents() {
      try {
        const winLogs = await publicClient!.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem('event Win(address indexed winner, uint256 prize)'),
          fromBlock: 0n,
          toBlock: 'latest',
        })

        const lossLogs = await publicClient!.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem('event Loss(address indexed player)'),
          fromBlock: 0n,
          toBlock: 'latest',
        })

        setWins(winLogs.length)
        setLosses(lossLogs.length)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()

    // Poll every 10 seconds for new events
    const interval = setInterval(fetchEvents, 10000)
    return () => clearInterval(interval)
  }, [publicClient])

  return { wins, losses }
}
