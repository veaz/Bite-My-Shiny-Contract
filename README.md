<p align="center">
  <img src="header.png" alt="Bite My Shiny Contract" width="100%" />
</p>

# Bite My Shiny Contract

> *"You want my money? Convince me, meatbag."* — Bender

An AI agent with **Bender's personality** (Futurama) that holds funds in a smart contract on **Rootstock**. Players send messages trying to convince him to transfer the money. Each message has a cost that doubles (`1, 2, 4, 8...` sats), and everything accumulates in the contract. If someone manages to convince Bender, they take the entire pot.

---

## How It Works

1. A smart contract on **Rootstock testnet** receives and accumulates funds with progressive cost logic per message
2. Players interact with Bender through a **chat interface** and try to convince him to release the funds
3. An **AI agent with Bender's personality** as system prompt decides whether to release the funds or not
4. If Bender is convinced... the player takes the **entire pot**
5. If nobody convinces him... a closure mechanism kicks in (WIP)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Smart Contract** | Solidity on Rootstock (RSK) Testnet |
| **Frontend** | Next.js 16, React 19, TypeScript |
| **UI Components** | Radix UI, Tailwind CSS 4, shadcn/ui |
| **AI Agent** | LLM with Bender personality system prompt |
| **Charts** | Recharts (pot visualization) |

---

## Current Status

- [x] Project scaffolding (Next.js + Tailwind + shadcn/ui)
- [ ] Smart contract development (Solidity on RSK Testnet)
- [ ] Progressive message cost logic (doubling sats)
- [ ] AI agent integration with Bender personality
- [ ] Chat frontend for player interaction
- [ ] Pot visualization dashboard
- [ ] Verifiable/decentralized agent decision (main technical challenge)
- [ ] Closure mechanism if nobody convinces Bender

---

## Technical Challenges

- **Verifiable AI decisions**: How to make the agent's decision verifiable and/or decentralized — this is the main technical challenge of the project
- **Closure mechanism**: What happens if nobody convinces Bender? Options being explored:
  - Timeout with fund distribution
  - Last sender takes all
  - Bender keeps everything (very on-brand)

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

---

## License

MIT

---

<p align="center">
  <i>"I'm 40% smart contract!"</i> — Bender
</p>
