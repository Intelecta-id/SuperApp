/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coal: {
          950: '#09090B', // Root deepest coal black
          900: '#111114', // Panels, sidebars, modals
          850: '#16161B', // Card surfaces, elevated containers
          800: '#1E1E26', // Input backgrounds, hover states
          700: '#282834', // Subtle dividers, crisp outlines
          600: '#383848', // Strong borders, active separators
          500: '#4E4E62', // Muted technical borders
        },
        lightgray: {
          50: '#FFFFFF',
          100: '#F4F4F6', // Primary high-contrast headings
          200: '#E4E4E7', // Standard light gray accent & body
          300: '#D4D4D8', // Secondary text & button borders
          400: '#A1A1AA', // Subtitle text, inactive icons
          500: '#71717A', // Tertiary dim metadata
          600: '#52525B', // Faint technical labels
        },
      },
      borderRadius: {
        none: '0px',
        sm: '1px',
        DEFAULT: '0px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'sharp-sm': '0 1px 0 rgba(255, 255, 255, 0.05)',
        'sharp-md': '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'sharp-lg': '0 12px 28px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
