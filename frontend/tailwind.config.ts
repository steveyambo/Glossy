import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './contexts/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1B1116',
        surface: '#271821',
        surface2: '#32202B',
        accent: '#E8A9BD',
        accent2: '#D9BB8E',
        ink: '#F6ECE7',
        muted: '#B9A2AC',
        line: 'rgba(246,236,231,0.12)',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-manrope)', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
      keyframes: {
        sheen: {
          '0%': { transform: 'translateX(-120%) rotate(8deg)' },
          '100%': { transform: 'translateX(220%) rotate(8deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-3%, 4%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        sheen: 'sheen 1.1s ease-in-out',
        drift: 'drift 14s ease-in-out infinite',
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
