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
          blue: '#00AEEF',
          sky: '#0284C7',
          navy: '#0B2545',
          deep: '#071B33',
          green: '#22C55E',
          whatsapp: '#25D366',
        },
        cream: {
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#F0F7FF',
          300: '#E0F2FE',
          400: '#BAE6FD',
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
          900: '#0B2545', // Deep Navy Blue
          800: '#0E3A6C', // Royal Dark Blue
          700: '#0284C7', // Signature Blue
          600: '#00AEEF', // Vibrant Sky Blue (from images)
          500: '#38BDF8', // Bright Cyan/Sky
          400: '#7DD3FC', // Light Sky
          300: '#BAE6FD', // Soft Sky
          200: '#E0F2FE', // Pale Ice Blue
          100: '#F0F9FF', // Ultra Light Blue Tint
        },
        gold: {
          600: '#B45309',
          500: '#D97706',
          400: '#F59E0B',
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
