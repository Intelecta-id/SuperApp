/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#030303',
          surface: '#0D0D11',
          elevated: '#14141B',
          card: '#181820',
          hover: '#1F1F2A',
        },
        obsidian: {
          950: '#030303',
          900: '#07070A',
          850: '#0D0D11',
          800: '#14141B',
          700: '#1F1F2A',
          600: '#2A2A38',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(255, 255, 255, 0.15)',
          active: 'rgba(255, 255, 255, 0.25)',
        },
        brand: {
          silver: '#E4E4E7',
          dim: '#71717A',
          highlight: '#FFFFFF',
          accent: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(255, 255, 255, 0.05)',
        'glow-md': '0 0 25px rgba(255, 255, 255, 0.08)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
