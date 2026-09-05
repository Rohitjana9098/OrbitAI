/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oro: {
          gold: '#D4A26F',
          bronze: '#6B4F31',
          primary: '#D4A26F',
          secondary: '#6B4F31',
          accent: '#E8C59C',
          bg: '#06070A',
          charcoal: '#0B0B0B',
          nearblack: '#121316',
          card: 'rgba(25, 25, 25, 0.55)',
          'card-hover': 'rgba(35, 35, 38, 0.7)',
          'border-muted': 'rgba(255, 255, 255, 0.08)',
          'border-gold': 'rgba(212, 162, 111, 0.3)',
          ivory: '#F5EEE3',
          dim: '#A1A1A1',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A26F 0%, #6B4F31 100%)',
        'gold-subtle': 'linear-gradient(135deg, rgba(212, 162, 111, 0.15) 0%, rgba(107, 79, 49, 0.05) 100%)',
        'radial-gold': 'radial-gradient(circle at 50% 0%, rgba(212, 162, 111, 0.18), transparent 70%)',
        'radial-center': 'radial-gradient(circle at 50% 50%, rgba(212, 162, 111, 0.12), transparent 75%)',
        'glow-conic': 'conic-gradient(from 180deg at 50% 50%, #6B4F31 0deg, #D4A26F 180deg, #6B4F31 360deg)',
      },
      boxShadow: {
        'gold-glow': '0 0 50px -10px rgba(212, 162, 111, 0.25)',
        'gold-glow-lg': '0 0 80px -15px rgba(212, 162, 111, 0.35)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'marquee-left': 'marquee-left 35s linear infinite',
        'marquee-right': 'marquee-right 35s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        scanline: 'scanline 2.5s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)', opacity: '0.1' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(100%)', opacity: '0.1' },
        },
      },
      fontFamily: {
        sans: ['var(--font-oro-sans)', 'Apfel Grotezk', 'system-ui', 'sans-serif'],
        display: ['var(--font-oro-display)', 'Bebas Neue', 'Apfel Grotezk', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
      },
    },
  },
  plugins: [],
};
