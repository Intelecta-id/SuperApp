import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030303",
        surface: {
          DEFAULT: "#0D0D11",
          card: "#121217",
          subtle: "#181820",
          hover: "#1E1E26",
        },
        foreground: {
          DEFAULT: "#FFFFFF",
          secondary: "#A1A1AA",
          muted: "#71717A",
          dark: "#52525B",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.18)",
          glow: "rgba(255, 255, 255, 0.35)",
        },
        brand: {
          silver: "#E4E4E7",
          glow: "rgba(255, 255, 255, 0.12)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "3px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        full: "9999px",
      },
      animation: {
        "spin-slow": "spin 24s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "beam-up": "beamUp 3s ease-in-out infinite alternate",
        "marquee": "marquee 28s linear infinite",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        beamUp: {
          "0%": { opacity: "0.6", transform: "translateY(0px) scaleY(0.95)" },
          "100%": { opacity: "1", transform: "translateY(-4px) scaleY(1.05)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
