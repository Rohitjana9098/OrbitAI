<div align="center">

# OrbitAI

**AI-native, non-custodial DeFi companion for conversational onchain execution**

Swap, stake, lend, and bridge across 15+ chains with plain English instructions. OrbitAI routes every action through Shield Engine, a simulated security layer that previews the route before anything moves onchain.

Live demo: [orbit-ai-black.vercel.app](https://orbit-ai-black.vercel.app) · GitHub: [Rohitjana9098/OrbitAI](https://github.com/Rohitjana9098/OrbitAI)

</div>

---

OrbitAI is an AI-native, non-custodial DeFi companion for exploring onchain actions through natural language. It combines a cinematic product website with an interactive dashboard where users can preview swaps, staking, lending, and bridge intents before confirming them.

> **Prototype notice** - OrbitAI is currently a product prototype. Wallet actions and transaction routes are simulated in the dashboard and are not connected to live blockchain execution.

## Highlights

- **Conversational action flow** - swap, stake, lend, and bridge requests handled from a single natural-language interface
- **Portfolio overview** - balances, allocation, performance, and supported chains
- **Wallet connection flow** - simulated social (Google, X, Apple) and Web3 (MetaMask, Phantom, Coinbase Wallet, WalletConnect) signing with wallet address persistence
- **Activity & transaction history** - every simulated action leaves a persisted record
- **Shield Engine** - security experience with simulated route checks and dry-run previews before confirmation
- **Cinematic product site** - interactive 3-step "How it works" driven by a 300-frame scroll sequence, plus use cases, FAQ, blog, and marquee sections
- **Responsive dashboard** - 8 views (overview, ask, swap, stake, lend, bridge, activity, security) with animated transitions and mobile navigation
- **Optional Supabase persistence** with a local SQLite fallback for development

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18 |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS 3.4 (custom gold design system) |
| Animation | Framer Motion, Lenis smooth scroll |
| Icons | Lucide React |
| Persistence | Supabase REST API (hosted) or Node `node:sqlite` (local fallback) |
| Utilities | `clsx`, `tailwind-merge` |

The UI follows a "gold spectrum" design system (primary `#D4A26F`) defined in [`design-tokens.md`](design-tokens.md) and `tailwind.config.js` (glassmorphism cards, gold gradients, scanline and marquee keyframes).

## Getting Started

### Prerequisites

- **Node.js 22 or newer** - the local persistence layer uses the built-in `node:sqlite` module
- npm
- A Supabase project if hosted persistence is required

### Install

```bash
git clone https://github.com/Rohitjana9098/OrbitAI.git
cd OrbitAI
npm install
```

### Configure the environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Supabase is optional. Without these variables, OrbitAI stores users, wallets, transactions, and activity in `.data/orbitai.sqlite` using the local Node SQLite adapter.

### Configure Supabase

If hosted persistence is needed, run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL Editor. The schema creates `users`, `wallets`, `transactions`, and `activity` tables.

The included policies are intended for this prototype. Replace the permissive prototype policies with authenticated, user-scoped policies before production use.

### Run the app

```bash
npm run dev
```

Open https://orbit-ai-black.vercel.app/  in your browser.

Useful commands:

```bash
npm run build   # Create a production build
npm start       # Serve the production build
npm run lint    # Run the configured lint command
```

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Main OrbitAI marketing and product experience |
| `/landing` | Lightweight landing page variant |
| `/dashboard` | Interactive DeFi companion dashboard |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Dashboard views

The dashboard (`/dashboard`) is a single-page app with eight navigable views:

| View | Purpose |
| --- | --- |
| Overview | Portfolio positions, allocation, and performance chart |
| Ask OrbitAI | Conversational intent flow with simulated Shield Engine routing |
| Swap / Stake / Lend / Bridge | Dedicated action panels with route previews |
| Activity | Transaction history for the connected user |
| Security | Shield Engine status and security posture |

## API Routes

All dashboard API routes use the Node.js runtime. Data is routed to Supabase when configured and otherwise uses the local SQLite database.

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/users` | `POST` | Create or update a user by external ID |
| `/api/wallets` | `GET`, `POST` | List and save connected wallets |
| `/api/transactions` | `GET`, `POST` | List and record transactions (plus activity entries) |
| `/api/activity` | `GET` | Load account activity |

## Project Structure

```text
app/
  api/                 API route handlers (users, wallets, transactions, activity)
  components/          UI components
    home/              Landing page: hero, how-it-works, chat demo, features, use cases, shield engine, FAQ, blog, footer
    home/how-it-works/ 300-frame scroll sequence step rendering
    dashboard/         Dashboard single-page app
    landing/           Alternate landing components
  dashboard/           Dashboard route
  landing/             Alternate landing route
  privacy/ terms/      Legal pages
  layout.tsx           Root layout (metadata, fonts, smooth scroll)
  page.tsx             Main home page
lib/
  db.ts                Local SQLite persistence (node:sqlite)
  supabase.ts          Supabase REST persistence
  utils.ts             Shared utilities
  motion-variants.ts   Shared animation variants
  how-it-works/        Sequence content, frame mapping, and hooks
public/
  fonts/               Local web fonts (Apfel Grotezk, Bebas Neue)
  images/              Brand assets (wallet logos)
  video/               Hero and product videos (mp4/webm, 480p-1080p)
  sequence1/           210 landing animation frames
  sequence2/           300 product animation frames
supabase/
  schema.sql           Supabase database schema + prototype RLS policies
design-tokens.md       Design system tokens (colors, type, spacing, motion)
```

## Development Notes

- The current wallet modal uses a **simulated** wallet flow for the prototype.
- Transaction confirmation records a transaction and activity entry but does **not** broadcast a blockchain transaction.
- The dashboard includes representative portfolio values and quotes for demonstrating the product experience.
- The `How It Works` section scrubs a 300-frame sequence (`/sequence2`) based on scroll progress; on mobile it falls back to a step-by-step version.
- Before production, add real wallet adapters, server-side transaction simulation, chain integrations, authentication, authorization, validation, and secure Supabase Row Level Security policies.

## License

This project does not currently include a license file. Add a license before distributing OrbitAI for reuse.
