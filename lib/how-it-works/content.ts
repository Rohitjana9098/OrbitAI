/**
 * How It Works — content model & sequence configuration.
 *
 * Frames are served from /public/sequence3
 * (ezgif-frame-001.jpg … ezgif-frame-130.jpg, 3840×2160).
 *
 * Everything the cinematic pinned section and the mobile fallback render lives
 * here so the two representations can never drift out of sync.
 */

export const SEQUENCE_ROOT = '/sequence3/';
export const FRAME_COUNT = 130;
export const FRAME_WIDTH = 3840;
export const FRAME_HEIGHT = 2160;

/** Scroll progress thirds that delimit STEP 01 / 02 / 03. */
export const STEP_ONE_END = 1 / 3;
export const STEP_TWO_END = 2 / 3;

export function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

export function buildFrameUrl(index: number): string {
  return `${SEQUENCE_ROOT}ezgif-frame-${pad3(index + 1)}.jpg`;
}

/**
 * Linear, monotonic mapping of scroll progress [0..1] → frame index
 * [0..FRAME_COUNT-1]. Monotonicity is what makes scrolling up reverse the
 * sequence flawlessly — the same function is evaluated in both directions.
 */
export function frameIndexForProgress(p: number): number {
  const clamped = Math.max(0, Math.min(1, p));
  return Math.floor(clamped * (FRAME_COUNT - 1));
}

export interface HowItWorkStep {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Only present on STEP 01 — the terminal mock prompt. */
  prompt?: string;
}

export const STEPS: HowItWorkStep[] = [
  {
    id: '01',
    eyebrow: 'STEP 01',
    title: 'Say what you want',
    description:
      'Tell OrbitAI in plain language. Swap, stake, lend, bridge, analyze. Anything you can say, OrbitAI can do.',
    prompt: 'Withdraw 1 USDC from PermaPod and swap it for ZIG',
  },
  {
    id: '02',
    eyebrow: 'STEP 02',
    title: 'OrbitAI finds the route',
    description:
      'Optimal path across 15+ protocols. Simulated through Shield Engine. Presented for your approval before anything happens onchain.',
  },
  {
    id: '03',
    eyebrow: 'STEP 03',
    title: "Sign and it's done",
    description:
      'Sign with your own wallet. Executes onchain. Your keys never leave your hands.',
  },
];

export interface ServiceTile {
  /** Icon key resolved to a Lucide icon by the rendering components. */
  icon: string;
  title: string;
  description: string;
}

export const SERVICE_TILES: ServiceTile[] = [
  {
    icon: 'repeat',
    title: 'Swap',
    description: 'Trade across protocols instantly with optimized routing.',
  },
  {
    icon: 'banknote',
    title: 'Stake',
    description: 'Earn yield with top validators in just one sentence.',
  },
  {
    icon: 'coins',
    title: 'Lend',
    description: 'Deposit and borrow without navigating complex dashboards.',
  },
  {
    icon: 'arrow-right-left',
    title: 'Bridge',
    description: 'Move assets across chains with AI-optimized routes.',
  },
];

export const HEADER = {
  badge: 'How it works',
  title: 'From words to onchain in three steps.',
  description:
    'No dashboards, no forms. Just tell OrbitAI what you want and it handles the rest.',
} as const;

export const TRANSACTION = {
  header: 'Transaction Ready',
  subheader: 'Review details before signing',
  routeFrom: 'PermaPod',
  routeTo: 'Jupiter',
  estOutput: '~ 12.45 ZIG',
  networkFee: '~ $0.002',
} as const;