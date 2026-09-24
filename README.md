# 📈 TenderCurve // Stocklana

> **Equity-Grade Meteora Dynamic Bonding Curves (DBC) for Pre-IPO Stocks on Solana.**  
> *"Stairs instead of a cliff."*

TenderCurve replaces memecoin pump-and-dump mechanics with stepped valuation bands anchored to real venture capital funding rounds, secondary tender offers, and IPO expectations.

---

## 🚨 The Problem

Pre-IPO stocks (like those tokenized on [PreStocks](https://prestocks.com/products)) represent companies with real fundamentals: 409A valuations, tender offers, and secondary transactions.

When launched on standard constant-product bonding curves (Pump.fun style), they suffer from:
1. **Whale Exploitation:** Low initial liquidity allows whales to pump prices 5x–10x above private valuations, only to dump on retail.
2. **Zero Valuation Anchor:** Standard curves treat a $1.9T asset like SpaceX the same as an ephemeral meme token.
3. **Retail Catastrophe:** In simulated whale shock tests, standard curves leave retail holders with up to 68% capital loss within minutes of an attack.

---

## 🛡️ The Solution: Three Key Innovations

### 1. Stepped Valuation Bands (Meteora Multi-Segment DBC)
Rather than a single continuous curve, TenderCurve breaks price discovery into discrete valuation milestones:
- **Segment 1 — Series Anchor (409A Floor):** Injected with highest virtual liquidity (800k units). Absorbs whale buy pressure and makes it mathematically prohibitive to pump past the fundamental valuation floor.
- **Segment 2 — Secondary Premium:** Moderate liquidity reflecting organic secondary market demand.
- **Segment 3 — IPO Speculation Range:** Fluid pricing leading directly to automated DEX graduation.

### 2. Anti-Dump Asymmetric Fee Schedule & Rate Limiting
- **Low Entry Friction:** 0.5% fixed buy fee for long-term equity accumulators.
- **Decaying Dump Penalty:** 5.0% initial sell fee decaying linearly to 0.5% over 7 days, punishing fast-money flippers.
- **Whale Buy Cap:** Meteora rate limiter prevents any single transaction from consuming more than 5% of pool reserves.

### 3. Institutional Graduation to Meteora DAMM v2
Upon reaching the 500,000 USDC threshold, the curve auto-migrates to a permanent Meteora DAMM v2 trading pool with:
- **90% Day-1 Locked Liquidity:** 80% permanently locked LP + 10% locked under a 6-month vesting schedule (massively exceeding Meteora’s 10% minimum).
- **0.30% Institutional Fee:** Matches traditional equity brokerage spreads.

---

## ⚡ Sponsor Integrations

### 1. Meteora Dynamic Bonding Curves (DBC) & DAMM v2
- Complies with `@meteora-ag/dynamic-bonding-curve-sdk`.
- Universal multi-segment curve parameter generation (`startSqrtPrice`, `endSqrtPrice`, `liquidityUnits`).
- Dynamic fee scheduler and pool rate limiters.
- Export-ready JSON configuration payload for the Meteora CLI.

### 2. PreStocks Live API
- Live ingestion of 8 pre-IPO assets (SpaceX, Stripe, Databricks, ByteDance, etc.).
- Benchmark OTC mark prices, discount rates, and contract addresses.
- Fault-tolerant architecture with automatic failover to cached snapshots.

---

## 📊 Stress-Test Showdown (TenderCurve vs. Standard AMM)

Simulating a **$50,000 whale buy-and-dump attack**:

| Metric | Standard Memecoin Curve | TenderCurve (Meteora DBC) | Difference |
|---|---|---|---|
| **Retail Capital Loss** | **-68.4%** | **-6.2%** | **11.0x safer** |
| **Price Crash** | **-88.0%** | **-8.5%** | **Resilient floor** |
| **Max Slippage** | 42.1% | 4.3% | Controlled execution |
| **Day-1 LP Lock** | 0% – 10% | **90.0%** (80% perm + 10% vest) | Institutional trust |

---

## 💻 Tech Stack & Architecture

- **Frontend:** React + Vite, Vanilla CSS design system (Dark mode, glassmorphism, responsive).
- **Simulation Engine:** Real-time stepped AMM bonding curve liquidity math (`src/services/curveSimulator.js`).
- **Config Generator:** Meteora DBC JSON schema generator (`src/services/meteoraDbcConfig.js`).
- **Data Layer:** PreStocks REST API with client-side timeout and offline caching (`src/services/prestocksApi.js`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
git clone https://github.com/deamybro/tendercurve.git
cd tendercurve
npm install
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build
```bash
npm run build
```
