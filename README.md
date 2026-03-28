<p align="center">
  <img src="header.png" alt="Bite My Shiny Metal Wallet" width="100%" />
</p>

# Bite My Shiny Metal Wallet

> *"You want my money? Convince me, meatbag."* — Bender

A smart contract game on **Rootstock (RSK) Testnet** with **Bender's personality** (Futurama). Bender holds funds and players place bets trying to win the entire pot. Each failed attempt doubles the cost, and blockchain randomness decides the outcome.

---

## How It Works

1. **Connect your wallet** to the RSK Testnet
2. **Send a message** to Bender and place a bet (1st transaction - `bet()`)
3. **Wait one block** for the blockchain to generate randomness
4. **Claim your result** (2nd transaction - `claim()`)
5. If you win, you take the **entire treasury**. If you lose, Bender keeps your money and the cost doubles.

### Security Features

- **Blockhash future randomness**: The outcome is determined by a blockhash that doesn't exist at the time of betting, preventing prediction
- **Front-running protection**: Uses `msg.sender` in the hash calculation, so copying a transaction won't produce the same result
- **Commit-reveal pattern**: Message is sealed on-chain during `bet()`, result is revealed during `claim()`
- **Checks-effects-interactions**: State is updated before external calls to prevent reentrancy

### Game Economics

- Starting cost: **1 sat** (0.00000001 RBTC)
- Cost doubles after each loss, resets to 1 sat after a win
- Win probability depends on treasury size:
  - < 0.001 RBTC: 20% chance
  - < 0.01 RBTC: ~14% chance
  - < 0.1 RBTC: 10% chance
  - 0.1+ RBTC: 5% chance

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Smart Contract** | Solidity 0.8.25 on Rootstock (RSK) Testnet |
| **Frontend** | Next.js 16, React 19, TypeScript |
| **UI Components** | Radix UI, Tailwind CSS 4, shadcn/ui |
| **Wallet Connection** | Reown AppKit + Wagmi + Viem |
| **Blockchain Events** | On-chain event logs (BetPlaced, Win, Loss) |

---

## Project Structure

```
bender_rsk/
├── smart-contract/
│   ├── contracts/
│   │   └── Bite-my-shiny-contract.sol
│   ├── scripts/
│   │   └── deploy.ts
│   └── test/
│       └── Bite-my-shiny-contract.ts
└── frontend/
    ├── app/                  # Next.js pages
    ├── components/bender/    # UI components
    ├── config/               # Chain, contract & AppKit config
    ├── context/              # AppKit provider
    ├── hooks/                # Custom hooks (contract events)
    └── lib/                  # i18n translations
```

---

## Current Status

- [x] Project scaffolding (Next.js + Tailwind + shadcn/ui)
- [x] Smart contract with bet/claim pattern
- [x] Blockhash future randomness (front-running protection)
- [x] Progressive cost logic (doubling sats)
- [x] On-chain events (BetPlaced, Win, Loss)
- [x] Wallet connection with Reown AppKit
- [x] Chat interface connected to smart contract
- [x] Live stats from contract (treasury, wins, losses)
- [x] History from on-chain events
- [ ] Deploy to RSK Testnet

---

## Getting Started

### Smart Contract

```bash
cd smart-contract
npm install

# Compile
npx hardhat compile

# Run local node
npx hardhat node

# Deploy to local node (in another terminal)
npx hardhat run scripts/deploy.ts --network localhost
```

### Frontend

```bash
cd frontend
npm install

# Create .env.local with your Reown project ID
echo "NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id" > .env.local

# Run development server
npm run dev
```

Get a free project ID at [dashboard.reown.com](https://dashboard.reown.com).

---

<p align="center">
  <i>"I'm 100% blockchain. And 100% keeping your money."</i> — Bender
</p>
