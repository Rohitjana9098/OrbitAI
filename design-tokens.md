# ORO UI Design Tokens

Source of Truth: **ORO UI Design System**

---

## 1. Color Palette

### Base Surfaces
- `bg-black`: `#000000` / `#06070A`
- `bg-card`: `rgba(25, 25, 25, 0.55)` (Glassmorphism base)
- `border-muted`: `rgba(255, 255, 255, 0.08)`
- `border-gold`: `rgba(212, 162, 111, 0.3)`

### Brand Accents (The "Gold" Spectrum)
- `oro-primary`: `#D4A26F` (Muted Gold)
- `oro-secondary`: `#6B4F31` (Deep Bronze)
- `oro-accent`: `#E8C59C` (Bright Amber Accent)
- `gradient-gold`: `linear-gradient(135deg, #D4A26F 0%, #6B4F31 100%)`
- `glow-amber`: `rgba(212, 162, 111, 0.15)`
- `oro-ivory`: `#F5EEE3` (Editorial light text)

### Typography Colors
- `text-main`: `#FFFFFF`
- `text-dim`: `#A1A1A1`
- `text-accent`: `#D4A26F`
- `text-emerald`: `#34D399` (Success & execution badges)

---

## 2. Typography Scale

- **Font Family**: Plus Jakarta Sans (Headings), Inter (Body copy), Geist / JetBrains Mono (Code & Metadata).
- **H1 (Hero)**: `text-5xl` to `text-7xl` (Mobile: `text-4xl`), Tracking: `-0.04em`.
- **H2 (Section)**: `text-3xl` to `text-5xl`, Bold / Extra-bold.
- **Body**: `text-base` to `text-lg`, Leading: `relaxed`.
- **Label / Caption**: `text-xs`, Uppercase, Tracking: `widest`, Monospace.

---

## 3. Spacing & Radius

- **Container**: Max-width `1280px` (`max-w-7xl`), Padding-x `2rem`.
- **Card Radius**: `24px` / `1.5rem` (Large), `12px` / `0.75rem` (Small).
- **Section Gap**: `clamp(80px, 10vh, 160px)`.

---

## 4. Animation Keyframes

- **Marquee**: Infinite double-buffered ticker (`35s` linear loop).
- **Glow Pulse**: Radial ambient breathing animation (`4s` ease).
- **Scanline**: 2.5s pre-execution security verification sweep.
- **Circle Expansion**: Zero to 50x scale viewport takeover into terminal mode.
