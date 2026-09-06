import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0D52A0', // Signature Royal Blue from poster
          royal: '#084282',
          navy: '#06284F',
          yellow: '#FFD200', // Sunshine Yellow price badge
          green: '#0B532C', // Deep Forest Brand Green
          leaf: '#22C55E', // Fresh Leaf Green
          whatsapp: '#25D366',
        },
        cream: {
          50: '#FFFFFF',
          100: '#F8FAF8',
          200: '#F0FDF4',
          300: '#DCFCE7',
          400: '#BBF7D0',
        },
        earth: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
        },
        farm: {
          950: '#032612',
          900: '#084824', // Deep Lush Farm Green (banner & base)
          800: '#0B532C', // Rich Forest Green (Logo text & core badges)
          700: '#0D6338',
          600: '#15803D', // Primary Action & Accent Green
          500: '#22C55E', // Vibrant Spring/Leaf Green
          400: '#4ADE80',
          300: '#86EFAC',
          200: '#BBF7D0',
          100: '#ECFDF5', // Light Mint / Meadow Tint
          50: '#F0FDF4',
        },
        gold: {
          600: '#D97706',
          500: '#F59E0B',
          400: '#FFD200', // Vibrant Yellow Accent
          100: '#FEF3C7',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['monospace'],
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 25, 23, 0.05)',
        'float': '0 12px 32px -4px rgba(28, 25, 23, 0.08)',
      }
    },
  },
  plugins: [],
};
export default config;
